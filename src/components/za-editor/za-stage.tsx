import { ImageElement } from "@/components/za-editor/qr-element";
import { TextElement } from "@/components/za-editor/text-element";
import { CanvasElement, CanvasElementType, EditorOutputs } from "@/store";
import {
  IconArrowBarToDown,
  IconArrowBarToUp,
  IconCheck,
  IconFocusCentered,
  IconRotate,
  IconStackBack,
  IconStackFront,
  IconTrash,
} from "@tabler/icons-react";
import { Group, Layer, Rect, Stage } from "react-konva";
import { Box, Spinner } from "zmp-ui";
import { useEditor } from "./hooks/useEditor";
import { FC } from "react";

export interface IZaStageProps {
  toolbarHeight: number;
  onSave?: (outputs: EditorOutputs) => void;
}

export const ZaStage: FC<IZaStageProps> = ({ toolbarHeight, onSave }) => {
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
    handleSave,
    handleDiscard,
    handleMoveToFront,
    handleMoveToBack,
  } = useEditor();

  const handleSaveClick = () => {
    handleSave(onSave!);
  };

  const handleResetClick = () => {
    handleDiscard();
  };

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
            {elements.map((el, i) => {
              if (el.id === "qr-main") {
                return (
                  <ImageElement
                    enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
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
        <Box className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] z-[9999]">
          <Spinner />
        </Box>
      )}

      <div
        className={`absolute left-0 right-0 px-4 flex justify-center pointer-events-none z-40 ${isDragging ? "" : "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"}`}
        style={{
          bottom: `${toolbarHeight - translateY + 68}px`,
        }}
      >
        {selectedId && selectedId !== "qr-main" && (
          <div className="flex gap-2 pointer-events-auto"></div>
        )}
      </div>

      <div
        className={`absolute left-0 right-0 px-4 flex justify-between items-end pointer-events-none z-40 ${isDragging ? "" : "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"}`}
        style={{
          bottom: `${toolbarHeight - translateY + 16}px`,
        }}
      >
        <div className="flex flex-col justify-end gap-3 pointer-events-auto">
          <div
            onClick={handleResetClick}
            id="reset-button"
            className="cursor-pointer bg-white shadow-xl border border-gray-100 !rounded-full w-10 h-10 flex items-center justify-center p-0"
          >
            <IconRotate className="text-black font-bold" size={20} />
          </div>
          <div
            onClick={handleResetView}
            className="cursor-pointer bg-white shadow-xl border border-gray-100 !rounded-full w-10 h-10 flex items-center justify-center p-0"
          >
            <IconFocusCentered />
          </div>
        </div>

        <div className="flex flex-col justify-end  gap-3 pointer-events-auto">
          {selectedId && selectedId !== "qr-main" && (
            <div
              className="bg-red-500 flex items-center justify-center w-10 h-10 !rounded-full cursor-pointer"
              onClick={async () => {
                setElements(elements.filter((el) => el.id !== selectedId));
                setSelectedId(null);
              }}
            >
              <IconTrash className="text-white font-bold" size={20} />
            </div>
          )}
          {selectedId && (
            <div
              onClick={handleMoveToFront}
              className="cursor-pointer bg-white text-gray-600 shadow-xl !rounded-full w-10 h-10 flex items-center justify-center p-0"
            >
              <IconStackFront size={18} />
            </div>
          )}
          {selectedId && (
            <div
              onClick={handleMoveToBack}
              className="cursor-pointer bg-white text-white shadow-xl !rounded-full w-10 h-10 flex items-center justify-center p-0"
            >
              <IconStackBack size={18} className="text-gray-600" />
            </div>
          )}
          <div
            onClick={handleSaveClick}
            id="save-button"
            className="cursor-pointer bg-primary text-white shadow-xl !rounded-full w-10 h-10 flex items-center justify-center p-0"
          >
            <IconCheck className="font-bold" size={20} />
          </div>
        </div>
      </div>
    </Box>
  );
};
