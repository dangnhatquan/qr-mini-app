import { Box, Tabs } from "zmp-ui";
import { COLLAPSED_Y, SHEET_HEIGHT } from "../utils/constants";
import { useKonvaEditor } from "../context/KonvaEditorContext";
import { ICustomTab } from "@/components/za-editor/types/editor.types";
import React, { MutableRefObject } from "react";

export interface IBottomSheetProps {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  translateY: number;
  dragStartYRef: MutableRefObject<number>;
  currentTranslateYRef: MutableRefObject<number>;

  customTabs?: ICustomTab[];
}

export const BottomSheet = ({
  isDragging,
  setIsDragging,
  translateY,
  dragStartYRef,
  currentTranslateYRef,

  customTabs,
}: IBottomSheetProps) => {
  const { setTranslateY, isCollapsed, setIsCollapsed } = useKonvaEditor();

  const handleStart = (y: number) => {
    dragStartYRef.current = y;
    currentTranslateYRef.current = translateY;
    setIsDragging(true);
  };

  const toggleSheet = (_e: React.MouseEvent | React.TouchEvent) => {
    if (Math.abs(translateY - currentTranslateYRef.current) < 5) {
      if (isCollapsed) {
        setTranslateY(0);
        setIsCollapsed(false);
      } else {
        setTranslateY(COLLAPSED_Y);
        setIsCollapsed(true);
      }
    }
  };

  return (
    <Box
      className={`bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex flex-col fixed bottom-0 left-0 right-0 z-50 ${isDragging ? "" : "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"}`}
      style={{
        height: `${SHEET_HEIGHT}px`,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        className="w-full flex flex-col items-center py-4 cursor-grab active:cursor-grabbing select-none touch-none"
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onMouseDown={(e) => handleStart(e.clientY)}
        onClick={toggleSheet}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-1" />
        {translateY > COLLAPSED_Y - 20 && (
          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider animate-pulse">
            Kéo lên hoặc chạm để mở
          </div>
        )}
      </div>

      <Box
        className={`flex-1 flex flex-col transition-opacity duration-300 ${translateY > COLLAPSED_Y - 100 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <Tabs id="editor-tabs" scrollable className="flex-1 overflow-hidden">
          {customTabs?.map((tab) => {
            return (
              <Tabs.Tab key={tab.key} label={tab.label}>
                {tab.content}
              </Tabs.Tab>
            );
          })}
        </Tabs>
      </Box>
    </Box>
  );
};
