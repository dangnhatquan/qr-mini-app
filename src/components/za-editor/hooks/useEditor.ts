import { useKonvaEditor } from "@/pages/edit-ui/context/KonvaEditorContext";
import { EditorOutputs } from "@/store";
import { DEFAULT_EDITOR_STAGE } from "@/utils/constants/qr";
import { KonvaEventObject } from "konva/lib/Node";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useMemo } from "react";
import { showToast } from "zmp-sdk/apis";

export const useEditor = () => {
  const {
    stageRef,
    mainGroupRef,
    lastDistRef,
    qrOptions,
    isRendering,
    elements,
    selectedId,
    canvasBg,
    canvasBgFileId,
    logoFileId,
    stageSize,
    stageScale,
    stagePos,
    isCollapsed,
    translateY,
    isDragging,
    initialQrOptions,
    initialElements,
    initialCanvasBg,
    initialStageSize,

    setSelectedId,
    setStageScale,
    setStagePos,
    setElements,
    setIsCollapsed,
    setTranslateY,
    setCanvasBg,
    setQrOptions,
    setQrImageSrc,

    setIsRendering,

    setStageSize,
    sessionId,
  } = useKonvaEditor();

  const qrCode = useMemo(() => new QRCodeStyling(qrOptions), [qrOptions]);

  const checkDeselect = (e: KonvaEventObject<Event>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleTouchZoom = (e: KonvaEventObject<TouchEvent>) => {
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
      e.evt.preventDefault();
      const dist = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2),
      );

      if (!lastDistRef.current) {
        lastDistRef.current = dist;
        return;
      }

      const stage = stageRef.current;
      if (stage) {
        const oldScale = stage.scaleX();
        const newScale = oldScale * (dist / lastDistRef.current);

        setStageScale(newScale);
        lastDistRef.current = dist;
      }
    }
  };

  const handleTouchEndZoom = () => {
    lastDistRef.current = 0;
  };

  const handleResetView = () => {
    setStageScale(1);
    setStagePos({ x: 0, y: 0 });
  };

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
        const newX = pointer.x - mousePointTo.x * newScale;
        const newY = pointer.y - mousePointTo.y * newScale;

        const currentCenterY =
          (window.innerHeight - (isCollapsed ? 120 : window.innerHeight * 0.5 + 60)) / 2 + 60;

        setStagePos({
          x: newX - window.innerWidth / 2,
          y: newY - currentCenterY,
        });
      }
    }
  };

  const handleSave = async (onSave: (outputs: EditorOutputs) => void) => {
    setSelectedId(null);
    setIsRendering(true);

    setTimeout(async () => {
      const stage = stageRef.current;
      const frame = mainGroupRef.current;

      if (frame && stage) {
        const oldScale = stage.scaleX();
        const oldPos = stage.position();

        stage.scale({ x: 1, y: 1 });
        stage.position({ x: oldPos.x, y: oldPos.y });
        stage.batchDraw();

        try {
          const frameAbsPos = frame.getAbsolutePosition();

          const CAPTURE_WIDTH = stageSize.width;
          const CAPTURE_HEIGHT = stageSize.height;

          const uri = stage.toDataURL({
            x: frameAbsPos.x,
            y: frameAbsPos.y,
            width: CAPTURE_WIDTH,
            height: CAPTURE_HEIGHT,
            pixelRatio: 1,
            quality: 1.0,
            mimeType: "image/png",
          });

          stage.scale({ x: oldScale, y: oldScale });
          stage.position(oldPos);
          stage.batchDraw();

          const response = await fetch(uri);
          const blob = await response.blob();

          onSave?.({
            qrOptions,
            elements,
            canvasBg,
            canvasBgFileId,
            logoFileId,
            stageSize,
            blob,
            sessionId,
          });
        } catch {
          showToast({ message: "Lỗi khi lưu!" });
        } finally {
          setIsRendering(false);
        }
      }
    }, 100);
  };

  const handleDiscard = () => {
    if (initialQrOptions) {
      setQrOptions({ ...initialQrOptions });
    } else {
      setQrOptions({ ...DEFAULT_EDITOR_STAGE.qrOptions });
    }

    if (initialElements) {
      setElements([...initialElements]);
    } else {
      setElements([...DEFAULT_EDITOR_STAGE.elements]);
    }

    setCanvasBg(initialCanvasBg ?? DEFAULT_EDITOR_STAGE.canvasBg);
    setStageSize(
      initialStageSize ? { ...initialStageSize } : { ...DEFAULT_EDITOR_STAGE.stageSize },
    );

    setSelectedId(null);
    handleResetView();
    showToast({ message: "Đã hoàn tác thay đổi" });
  };

  const handleMoveToFront = () => {
    if (!selectedId) return;
    const index = elements.findIndex((el) => el.id === selectedId);
    if (index === -1) return;
    const newElements = [...elements];
    const [element] = newElements.splice(index, 1);
    newElements.push(element);
    setElements(newElements);
  };

  const handleMoveToBack = () => {
    if (!selectedId) return;
    const index = elements.findIndex((el) => el.id === selectedId);
    if (index === -1) return;
    const newElements = [...elements];
    const [element] = newElements.splice(index, 1);
    newElements.unshift(element);
    setElements(newElements);
  };

  useEffect(() => {
    let isMounted = true;

    const updateQRPreview = async () => {
      const displayOptions = {
        ...qrOptions,
      };
      qrCode.update(displayOptions);

      await new Promise((r) => setTimeout(r, 150));

      try {
        const blob = await qrCode.getRawData("webp");
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
  }, [qrOptions, qrCode]);

  return {
    checkDeselect,
    handleTouchZoom,
    handleTouchEndZoom,
    handleResetView,
    handleWheel,
    handleSave,
    handleDiscard,
    handleMoveToFront,
    handleMoveToBack,

    stageRef,
    mainGroupRef,
    lastDistRef,
    qrOptions,
    isRendering,
    elements,
    selectedId,
    canvasBg,
    stageSize,
    stageScale,
    stagePos,
    isCollapsed,
    translateY,
    isDragging,
    initialQrOptions,
    initialElements,
    initialCanvasBg,

    setStagePos,
    setSelectedId,
    setElements,
    setStageSize,

    setIsCollapsed,
    setTranslateY,
  };
};
