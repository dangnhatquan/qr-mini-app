import React, { useEffect, useRef } from "react";
import { Page, Box, Icon, Header } from "zmp-ui";
import { Stage, Layer, Rect, Group, StageProps } from "react-konva";
import { showToast } from "zmp-sdk/apis";
import { useCardEditor } from "../context/CardEditorContext";
import { CardBottomSheet } from "./CardBottomSheet";
import { URLImage } from "@/pages/edit-ui/components/QRImage";
import { TextElement } from "@/pages/edit-ui/components/TextElement";
import { CanvasElement } from "@/pages/edit-ui/context/KonvaEditorContext";
import { COLLAPSED_Y, SHEET_HEIGHT } from "@/pages/edit-ui/utils/constants";
import { KonvaEventObject } from "konva/lib/Node";
import { cardService } from "@/services/card";
import { uploadFile } from "@/utils/helpers/image";
import { IconFocusCentered } from "@tabler/icons-react";

export interface CardEditorCanvasProps {
  onSaved: (cardId: string) => void;
  initialCardId?: string | null;
}

export const CardEditorCanvas: React.FC<CardEditorCanvasProps> = ({ onSaved, initialCardId }) => {
  const {
    stageRef,
    mainGroupRef,
    elements,
    setElements,
    selectedId,
    setSelectedId,
    canvasBg,
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
    isRendering,
    setIsRendering,
    cardId,
    setCardId,
  } = useCardEditor();

  const dragStartY = useRef(0);
  const currentTranslateY = useRef(0);
  const lastDist = useRef(0);

  useEffect(() => {
    if (initialCardId && !cardId) {
      setCardId(initialCardId);
      cardService
        .getCard(initialCardId)
        .then((card) => {
          if (card.editorStage) {
            const stage = card.editorStage as StageProps;
            if (stage.elements) setElements(stage.elements);
          }
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCardId]);

  const handleMove = (y: number) => {
    if (!isDragging) return;
    const delta = y - dragStartY.current;
    let next = currentTranslateY.current + delta;
    if (next < 0) next = next * 0.2;
    if (next > COLLAPSED_Y) next = COLLAPSED_Y + (next - COLLAPSED_Y) * 0.2;
    setTranslateY(next);
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
      const onMM = (e: MouseEvent) => handleMove(e.clientY);
      const onMU = () => handleEnd();
      const onTM = (e: TouchEvent) => handleMove(e.touches[0].clientY);
      const onTE = () => handleEnd();
      window.addEventListener("mousemove", onMM);
      window.addEventListener("mouseup", onMU);
      window.addEventListener("touchmove", onTM, { passive: false });
      window.addEventListener("touchend", onTE);
      return () => {
        window.removeEventListener("mousemove", onMM);
        window.removeEventListener("mouseup", onMU);
        window.removeEventListener("touchmove", onTM);
        window.removeEventListener("touchend", onTE);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, translateY]);

  useEffect(() => {
    if (!stageRef.current) return;
    const headerHeight = 60;
    const sheetH = isCollapsed ? 60 : window.innerHeight * 0.5;
    const avail = window.innerHeight - headerHeight - sheetH;
    const targetScale = isCollapsed
      ? Math.min(1, (avail - 60) / stageSize.height)
      : (avail - 40) / stageSize.height;
    const targetY =
      (window.innerHeight - (isCollapsed ? 120 : window.innerHeight * 0.5 + 60)) / 2 + 60;

    stageRef.current.to({
      scaleX: targetScale,
      scaleY: targetScale,
      x: window.innerWidth / 2 + stagePos.x,
      y: targetY + stagePos.y,
      duration: 0.5,
      easing: (t: number, b: number, c: number, d: number) => c * ((t = t / d - 1) * t * t + 1) + b,
      onFinish: () => setStageScale(targetScale),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed, stageSize.height]);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    if (stage) {
      const old = stage.scaleX();
      const ptr = stage.getPointerPosition();
      if (ptr) {
        const mp = { x: (ptr.x - stage.x()) / old, y: (ptr.y - stage.y()) / old };
        const ns = e.evt.deltaY < 0 ? old * scaleBy : old / scaleBy;
        setStageScale(ns);
        setStagePos({ x: ptr.x - mp.x * ns, y: ptr.y - mp.y * ns });
      }
    }
  };

  const handleTouchZoom = (e: KonvaEventObject<TouchEvent>) => {
    const t1 = e.evt.touches[0];
    const t2 = e.evt.touches[1];
    if (t1 && t2) {
      e.evt.preventDefault();
      const dist = Math.sqrt(
        Math.pow(t2.clientX - t1.clientX, 2) + Math.pow(t2.clientY - t1.clientY, 2),
      );
      if (!lastDist.current) {
        lastDist.current = dist;
        return;
      }
      const stage = stageRef.current;
      if (stage) setStageScale(stage.scaleX() * (dist / lastDist.current));
      lastDist.current = dist;
    }
  };

  const handleResetView = () => {
    setStageScale(1);
    setStagePos({ x: 0, y: 0 });
  };

  const checkDeselect = (e: KonvaEventObject<Event>) => {
    if (e.target === e.target.getStage()) setSelectedId(null);
  };

  const handleSave = async () => {
    setSelectedId(null);
    setIsRendering(true);

    setTimeout(async () => {
      const stage = stageRef.current;
      const frame = mainGroupRef.current;
      if (!stage || !frame) {
        setIsRendering(false);
        return;
      }

      const oldScale = stage.scaleX();
      const oldPos = stage.position();
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: oldPos.x, y: oldPos.y });
      stage.batchDraw();

      try {
        const frameAbsPos = frame.getAbsolutePosition();
        const uri = stage.toDataURL({
          x: frameAbsPos.x,
          y: frameAbsPos.y,
          width: stageSize.width,
          height: stageSize.height,
          pixelRatio: 1,
        });

        stage.scale({ x: oldScale, y: oldScale });
        stage.position(oldPos);
        stage.batchDraw();

        const res = await fetch(uri);
        const blob = await res.blob();
        const previewFile = await uploadFile(blob);

        const editorStage = { elements, canvasBg };

        let savedId: string;
        if (cardId) {
          const updated = await cardService.updateCard(cardId, editorStage, previewFile.id);
          savedId = updated.id;
        } else {
          const created = await cardService.createCard(editorStage, previewFile.id);
          savedId = created.id;
          setCardId(savedId);
        }

        showToast({ message: "Đã lưu thiệp!" });
        onSaved(savedId); // CardEditorPage handles navigate(-1)
      } catch (e) {
        console.error(e);
        showToast({ message: "Lỗi khi lưu thiệp!" });
      } finally {
        setIsRendering(false);
      }
    }, 100);
  };

  return (
    <Page className="bg-gray-50 flex flex-col h-screen overflow-hidden">
      <div>
        <Header title="Tạo thiệp điện tử" />
        <div className="w-full px-4 flex justify-between z-40 absolute top-24">
          <div />
          <div
            onClick={handleSave}
            id="card-editor-save"
            className="cursor-pointer bg-blue-500 text-white shadow-xl !rounded-full w-10 h-10 flex items-center justify-center"
          >
            <Icon icon="zi-check" className="font-bold" size={20} />
          </div>
        </div>
      </div>

      <Box className="flex-1 flex flex-col items-center justify-center bg-[#d1d5db] overflow-hidden relative">
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
          onTouchEnd={() => {
            lastDist.current = 0;
          }}
          onWheel={handleWheel}
          draggable={!selectedId}
          onDragEnd={(e) => {
            if (e.target === stageRef.current) {
              const cy =
                (window.innerHeight - (isCollapsed ? 120 : window.innerHeight * 0.5 + 60)) / 2 + 60;
              setStagePos({ x: e.target.x() - window.innerWidth / 2, y: e.target.y() - cy });
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
                .map((el, i) => ({ el, i }))
                .map(({ el, i }) => {
                  if (el.type === "image") {
                    return (
                      <URLImage
                        key={el.id}
                        imageProps={el}
                        isSelected={el.id === selectedId}
                        onSelect={() => setSelectedId(el.id)}
                        onChange={(np: CanvasElement) => {
                          const next = [...elements];
                          next[i] = np;
                          setElements(next);
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
                        onChange={(np: CanvasElement) => {
                          const next = [...elements];
                          next[i] = np;
                          setElements(next);
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
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </Box>
        )}

        {/* Float buttons */}
        <div
          className={`absolute left-0 right-0 px-4 flex justify-between items-center pointer-events-none z-40 ${isDragging ? "" : "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"}`}
          style={{ bottom: `${SHEET_HEIGHT - translateY + 16}px` }}
        >
          <div className="flex gap-3 pointer-events-auto">
            <div
              onClick={handleResetView}
              className="cursor-pointer bg-white shadow-xl border border-gray-100 !rounded-full w-12 h-12 flex items-center justify-center"
            >
              <IconFocusCentered />
            </div>
          </div>
          <div className="flex gap-3 pointer-events-auto">
            {selectedId && (
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

      <CardBottomSheet
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        translateY={translateY}
        dragStartYRef={dragStartY}
        currentTranslateYRef={currentTranslateY}
      />
    </Page>
  );
};
