import { ImageElement } from "@/components/za-editor/qr-element";
import { TextElement } from "@/components/za-editor/text-element";
import { CanvasElement, CanvasElementType } from "@/store";
import { IconFocusCentered, IconTrash } from "@tabler/icons-react";
import { Group, Layer, Rect, Stage } from "react-konva";
import { Box } from "zmp-ui";
import { useEditor } from "./hooks/useEditor";
import { FC } from "react";
import { deleteFile } from "@/utils/helpers/image";

export interface IZaStageProps {
  toolbarHeight: number;
}

export const ZaStage: FC<IZaStageProps> = ({ toolbarHeight }) => {
  const {
    translateY,
    canvasBg,
    isRendering,
    stagePos,
    stageScale,
    selectedId,
    setStagePos,
    stageSize,
    stageRef,
    mainGroupRef,
    elements,
    setElements,
    setSelectedId,
    isCollapsed,
    isDragging,
    checkDeselect,
    handleTouchZoom,
    handleTouchEndZoom,
    handleResetView,
    handleWheel,
  } = useEditor();

  return (
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
                if (el.type === CanvasElementType.IMAGE) {
                  return (
                    <ImageElement
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
          bottom: `${toolbarHeight - translateY + 16}px`,
        }}
      >
        <div className="flex gap-3 pointer-events-auto">
          <div
            onClick={handleResetView}
            className="cursor-pointer bg-white shadow-xl border border-gray-100 !rounded-full w-12 h-12 flex items-center justify-center p-0"
          >
            <IconFocusCentered />
          </div>
        </div>

        <div className="flex gap-3 pointer-events-auto">
          {selectedId && selectedId !== "qr-main" && (
            <div
              className="bg-red-500 flex items-center justify-center w-10 h-10 !rounded-full cursor-pointer"
              onClick={async () => {
                const elementToDelete = elements.find((el) => el.id === selectedId);
                console.log("🗑️ Deleting element:", selectedId, "FileId:", elementToDelete?.fileId);
                if (elementToDelete?.fileId) {
                  await deleteFile(elementToDelete.fileId);
                } else {
                  console.log("⚠️ No FileId found for this element. Skipping S3 deletion.");
                }
                setElements(elements.filter((el) => el.id !== selectedId));
                setSelectedId(null);
              }}
            >
              <IconTrash className="text-white font-bold" size={20} />
            </div>
          )}
        </div>
      </div>
    </Box>
  );
};
