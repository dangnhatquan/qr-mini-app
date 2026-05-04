import React, { useEffect, useRef, useMemo, useState } from "react";
import { Page, Box, Icon, Header } from "zmp-ui";
import { useParams, useNavigate } from "react-router-dom";
import QRCodeStyling from "qr-code-styling";
import { qrService } from "@/services/qr";
import { showToast } from "zmp-sdk/apis";
import { Stage, Layer, Rect, Group } from "react-konva";
import { FocusIcon } from "@/components/icons/Focus";
import { URLImage } from "./QRImage";
import { TextElement } from "./TextElement";
import { useKonvaEditor, CanvasElement } from "../context/KonvaEditorContext";
import { preloadImage } from "@/utils/helpers/image";
import { COLLAPSED_Y, SHEET_HEIGHT } from "../utils/constants";
import { BottomSheet } from "./BottomSheet";
import { KonvaEventObject } from "konva/lib/Node";
import { generateQRPayload } from "@/utils/helpers/qr";
import { EQRCategory, EQRType, QrCode } from "@/types/qr";
import { IQRFormValues } from "@/utils/schemas/qr";
import { DEFAULT_EDITOR_STAGE } from "@/utils/constants/qr";

export const QREditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [originalQR, setOriginalQR] = useState<QrCode | null>(null);

  const {
    stageRef,
    mainGroupRef,
    qrOptions,
    setQrOptions,
    setQrImageSrc,
    isRendering,
    setIsRendering,
    elements,
    setElements,
    selectedId,
    setSelectedId,
    canvasBg,
    setCanvasBg,
    stageSize,
    stageScale,
    setStageScale,
    stagePos,
    setStagePos,
    isCollapsed,
    setIsCollapsed,
    translateY,
    setTranslateY,
    isDragging,
    setIsDragging,
    initialOptions,
    setInitialOptions,
    initialElements,
    setInitialElements,
    initialCanvasBg,
    setInitialCanvasBg,
    assetCache,
    setAssetCache,
  } = useKonvaEditor();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const qrCode = useMemo(() => new QRCodeStyling(qrOptions), []);

  const dragStartY = useRef(0);
  const currentTranslateY = useRef(0);

  useEffect(() => {
    let isMounted = true;

    const updateQRPreview = async () => {
      // Use cached base64 for rendering if available to bypass CORS
      const imageSrc = (qrOptions.image && assetCache[qrOptions.image]) || qrOptions.image;

      const displayOptions = {
        ...qrOptions,
        image: imageSrc,
      };

      // Check if it's a remote URL (http, https, or protocol-relative) or a proxied minio path
      const isRemoteImage =
        imageSrc && (/^(https?:)?\/\//.test(imageSrc) || imageSrc.startsWith("/minio-proxy/"));

      // If we have a remote image that is not yet in cache,
      // we must wait for it to load to avoid flickering/missing logo in the preview
      if (isRemoteImage && !assetCache[imageSrc!]) {
        try {
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageSrc!;
            // Timeout after 3s to avoid hanging the UI
            setTimeout(resolve, 3000);
          });
        } catch (e) {
          console.warn("Failed to wait for logo load:", e);
        }
      }

      qrCode.update(displayOptions);

      // Small delay to ensure qr-code-styling internal canvas has processed the update
      await new Promise((r) => setTimeout(r, 150));

      try {
        const blob = await qrCode.getRawData("png");
        if (blob && isMounted) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (!isMounted) return;
            const src = reader.result as string;
            setQrImageSrc(src);
            setElements((prev) => prev.map((el) => (el.id === "qr-main" ? { ...el, src } : el)));
          };
          reader.readAsDataURL(blob as Blob);
        }
      } catch (err) {
        console.error("Error generating QR image:", err);
      }
    };

    updateQRPreview();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrOptions, qrCode, assetCache]);

  useEffect(() => {
    const initialEls = [
      {
        id: "qr-main",
        type: "image",
        src: "",
        x: 75,
        y: 100,
        width: 200,
        height: 200,
        rotation: 0,
      },
    ];
    setElements(initialEls);
    setInitialElements(initialEls);
    setInitialOptions(qrOptions);
    setInitialCanvasBg(canvasBg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    const fetchQR = async () => {
      if (!id) return;
      try {
        const qr = await qrService.getQRDetail(id);
        if (qr) {
          setOriginalQR(qr);
          const textData = generateQRPayload(qr);

          let savedStage: any = qr.editorStage;
          if (typeof savedStage === "string") {
            try {
              savedStage = JSON.parse(savedStage);
            } catch {
              savedStage = {};
            }
          }

          if (savedStage && savedStage.qrOptions) {
            const newOptions = { ...savedStage.qrOptions, data: textData };

            if (
              newOptions.image &&
              (newOptions.image.startsWith("http") || newOptions.image.startsWith("/minio-proxy/"))
            ) {
              await new Promise((resolve) => {
                preloadImage(
                  newOptions.image,
                  (base64: string) => {
                    setAssetCache((prev) => ({ ...prev, [newOptions.image!]: base64 }));
                    resolve(null);
                  },
                  () => {
                    resolve(null);
                  },
                );
              });
            }

            if (savedStage.elements) {
              const imageElements = (savedStage.elements as any[]).filter(
                (el: any) =>
                  el.type === "image" &&
                  el.src &&
                  typeof el.src === "string" &&
                  (el.src.startsWith("http") || el.src.startsWith("/minio-proxy/")),
              );

              await Promise.all(
                imageElements.map(
                  (el: any) =>
                    new Promise((resolve) => {
                      preloadImage(
                        el.src,
                        (base64: string) => {
                          setAssetCache((prev) => ({ ...prev, [el.src]: base64 }));
                          resolve(null);
                        },
                        () => {
                          resolve(null);
                        },
                      );
                    }),
                ),
              );
            }

            // 3. Now set options and elements - assetCache will already be populated
            setQrOptions(newOptions);
            setInitialOptions(newOptions);

            if (savedStage.elements) {
              setElements(savedStage.elements);
              setInitialElements(savedStage.elements);
            }
            if (savedStage.canvasBg) {
              setCanvasBg(savedStage.canvasBg);
              setInitialCanvasBg(savedStage.canvasBg);
            }
          } else {
            const newOptions = { ...DEFAULT_EDITOR_STAGE.qrOptions, data: textData };
            setQrOptions(newOptions);
            setInitialOptions(newOptions);
            setElements(DEFAULT_EDITOR_STAGE.elements);
            setInitialElements(DEFAULT_EDITOR_STAGE.elements);
            setCanvasBg(DEFAULT_EDITOR_STAGE.canvasBg);
            setInitialCanvasBg(DEFAULT_EDITOR_STAGE.canvasBg);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleMove = (y: number) => {
    if (!isDragging) return;
    const deltaY = y - dragStartY.current;
    let nextY = currentTranslateY.current + deltaY;

    if (nextY < 0) nextY = nextY * 0.2;
    if (nextY > COLLAPSED_Y) nextY = COLLAPSED_Y + (nextY - COLLAPSED_Y) * 0.2;

    setTranslateY(nextY);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateY < COLLAPSED_Y / 2) {
      setTranslateY(0);
      setIsCollapsed(false);
    } else {
      setTranslateY(COLLAPSED_Y);
      setIsCollapsed(true);
    }
  };

  useEffect(() => {
    if (isDragging) {
      const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
      const onMouseUp = () => handleEnd();
      const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
      const onTouchEnd = () => handleEnd();

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, translateY]);

  // Auto-zoom/pan based on sheet state
  useEffect(() => {
    if (!stageRef.current) return;

    const headerHeight = 60;
    const sheetHeight = isCollapsed ? 60 : window.innerHeight * 0.5;
    const availableHeight = window.innerHeight - headerHeight - sheetHeight;

    let targetScale = 1;
    let targetX = window.innerWidth / 2;
    let targetY =
      (window.innerHeight - (isCollapsed ? 120 : window.innerHeight * 0.5 + 60)) / 2 + 60;

    if (isCollapsed) {
      targetScale = Math.min(1, (availableHeight - 60) / stageSize.height);
    } else {
      targetScale = (availableHeight - 40) / stageSize.height;
    }

    // Animate using Konva's internal tween for smoothness
    stageRef.current.to({
      scaleX: targetScale,
      scaleY: targetScale,
      x: targetX + stagePos.x,
      y: targetY + stagePos.y,
      duration: 0.5,
      easing: (t: number, b: number, c: number, d: number) => {
        // Custom cubic-bezier approximation
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      onFinish: () => {
        setStageScale(targetScale);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed, stageSize.height]);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;

    if (stage) {
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (pointer) {
        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        setStageScale(newScale);
        setStagePos({
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        });
      }
    }
  };

  const lastDist = useRef(0);
  const handleTouchZoom = (e: KonvaEventObject<TouchEvent>) => {
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
      e.evt.preventDefault();
      const dist = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
      );

      if (!lastDist.current) {
        lastDist.current = dist;
        return;
      }

      const stage = stageRef.current;
      if (stage) {
        const oldScale = stage.scaleX();
        const newScale = oldScale * (dist / lastDist.current);

        setStageScale(newScale);
        lastDist.current = dist;
      }
    }
  };

  const handleTouchEndZoom = () => {
    lastDist.current = 0;
  };

  const handleResetView = () => {
    setStageScale(1);
    setStagePos({ x: 0, y: 0 });
  };

  const handleDiscard = () => {
    if (initialOptions) setQrOptions(initialOptions);
    if (initialElements) setElements(initialElements);
    setCanvasBg(initialCanvasBg);
    setSelectedId(null);
    handleResetView(); // Reset Konva view as well
    showToast({ message: "Đã hoàn tác thay đổi" });
  };

  const checkDeselect = (e: KonvaEventObject<Event>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleSave = async () => {
    if (!originalQR || !id) return;

    setSelectedId(null);
    setIsRendering(true);

    setTimeout(async () => {
      const stage = stageRef.current;
      if (mainGroupRef.current && stage) {
        const oldScale = stage.scaleX();
        const oldPos = stage.position();

        stage.scale({ x: 1, y: 1 });
        stage.position({ x: oldPos.x, y: oldPos.y });
        stage.batchDraw();

        try {
          if (stage) {
            const box = mainGroupRef.current.getClientRect({
              relativeTo: stage.getLayer() ?? undefined,
            });

            const uri = stage.toDataURL({
              x: box.x,
              y: box.y,
              width: box.width,
              height: box.height,
              pixelRatio: 3,
            });

            stage.scale({ x: oldScale, y: oldScale });
            stage.position(oldPos);
            stage.batchDraw();

            const response = await fetch(uri);
            const blob = await response.blob();

            const data: IQRFormValues = {
              qrType: originalQR.type as EQRType,
              category: originalQR.category as EQRCategory,
              ...originalQR.payload,
            };

            const editorStage = {
              qrOptions,
              elements,
              canvasBg,
            };

            await qrService.updateQR(id, data, blob, editorStage);
          }

          showToast({ message: "Đã lưu thay đổi!" });
          navigate(-1);
        } catch {
          showToast({ message: "Lỗi khi lưu!" });
        } finally {
          setIsRendering(false);
        }
      }
    }, 100);
  };

  return (
    <Page className="bg-gray-50 flex flex-col h-screen overflow-hidden">
      <div>
        <Header title="Tuỳ chỉnh giao diện" />
        <div className="w-full px-4 flex justify-between z-40 absolute top-24">
          <div
            onClick={handleDiscard}
            id="reset-button"
            className="cursor-pointer bg-white shadow-xl border border-gray-100 !rounded-full w-10 h-10 flex items-center justify-center p-0"
          >
            <Icon icon="zi-retry" className="text-black font-bold" size={20} />
          </div>

          {/* Save button */}
          <div
            onClick={handleSave}
            id="save-button"
            className="cursor-pointer bg-blue-500 text-white shadow-xl !rounded-full w-10 h-10 flex items-center justify-center p-0"
          >
            <Icon icon="zi-check" className="font-bold" size={20} />
          </div>
        </div>
      </div>

      {/* Stage */}
      <Box className="flex-1 flex flex-col items-center justify-center bg-[#d1d5db] overflow-hidden relative">
        {/* Reset button (top left) */}

        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          scaleX={stageScale}
          scaleY={stageScale}
          x={window.innerWidth / 2 + stagePos.x}
          y={
            (window.innerHeight - (isCollapsed ? 120 : window.innerHeight * 0.5 + 60)) / 2 +
            60 +
            stagePos.y
          }
          offset={{ x: stageSize.width / 2, y: stageSize.height / 2 }}
          onMouseDown={checkDeselect}
          onTouchStart={(e) => {
            checkDeselect(e);
            if (e.evt.touches.length > 1) handleTouchZoom(e);
          }}
          onTouchMove={(e) => {
            if (e.evt.touches.length > 1) handleTouchZoom(e);
          }}
          onTouchEnd={handleTouchEndZoom}
          onWheel={handleWheel}
          draggable={!selectedId}
          onDragEnd={(e) => {
            if (e.target === stageRef.current) {
              const currentCenterY =
                (window.innerHeight - (isCollapsed ? 120 : window.innerHeight * 0.5 + 60)) / 2 + 60;
              setStagePos({
                x: e.target.x() - window.innerWidth / 2,
                y: e.target.y() - currentCenterY,
              });
            }
          }}
        >
          <Layer>
            <Group
              ref={mainGroupRef}
              clipX={0}
              clipY={0}
              clipWidth={stageSize.width}
              clipHeight={stageSize.height}
            >
              {/* Main frame */}
              <Rect
                width={stageSize.width}
                height={stageSize.height}
                fill={canvasBg}
                shadowColor="rgba(0,0,0,0.1)"
                shadowBlur={30}
                shadowOffset={{ x: 0, y: 15 }}
                shadowOpacity={0.3}
                cornerRadius={8}
              />
              {elements
                .map((el, originalIndex) => ({ el, originalIndex }))
                .sort((a, b) => {
                  if (a.el.id === "qr-main") return 1;
                  if (b.el.id === "qr-main") return -1;
                  return a.originalIndex - b.originalIndex;
                })
                .map(({ el, originalIndex: i }) => {
                  if (el.type === "image") {
                    return (
                      <URLImage
                        key={el.id}
                        imageProps={el}
                        isSelected={el.id === selectedId}
                        onSelect={() => setSelectedId(el.id)}
                        onChange={(newProps: CanvasElement) => {
                          const newEls = [...elements];
                          newEls[i] = newProps;
                          setElements(newEls);
                        }}
                      />
                    );
                  }
                  if (el.type === "text") {
                    return (
                      <TextElement
                        key={el.id}
                        textProps={el}
                        isSelected={el.id === selectedId}
                        onSelect={() => setSelectedId(el.id)}
                        onChange={(newProps: CanvasElement) => {
                          const newEls = [...elements];
                          newEls[i] = newProps;
                          setElements(newEls);
                        }}
                      />
                    );
                  }
                  return null;
                })}
            </Group>
          </Layer>
        </Stage>
        {isRendering && (
          <Box className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px] z-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </Box>
        )}

        {/* Float buttons*/}
        <div
          className={`absolute left-0 right-0 px-4 flex justify-between items-center pointer-events-none z-40 ${isDragging ? "" : "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"}`}
          style={{
            bottom: `${SHEET_HEIGHT - translateY + 16}px`,
          }}
        >
          <div className="flex gap-3 pointer-events-auto">
            <div
              onClick={handleResetView}
              className="cursor-pointer bg-white shadow-xl border border-gray-100 !rounded-full w-12 h-12 flex items-center justify-center p-0"
            >
              <FocusIcon />
            </div>
          </div>

          <div className="flex gap-3 pointer-events-auto">
            {selectedId && selectedId !== "qr-main" && (
              <div
                className="bg-red-500 flex items-center justify-center w-10 h-10 !rounded-full cursor-pointer"
                onClick={() => {
                  setElements(elements.filter((el) => el.id !== selectedId));
                  setSelectedId(null);
                }}
              >
                <Icon icon="zi-delete" className="text-white font-bold" size={20} />
              </div>
            )}
          </div>
        </div>
      </Box>

      {/* Bottom Sheet */}
      <BottomSheet
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        translateY={translateY}
        dragStartYRef={dragStartY}
        currentTranslateYRef={currentTranslateY}
      />
    </Page>
  );
};
