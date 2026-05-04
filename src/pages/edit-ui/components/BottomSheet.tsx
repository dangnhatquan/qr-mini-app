import React from "react";
import { Box, Tabs } from "zmp-ui";
import { StickerTab } from "./StickerTab";
import { LayoutTab } from "./LayoutTab";
import { StylingTab } from "./StylingTab";
import { COLLAPSED_Y, SHEET_HEIGHT } from "../utils/constants";
import { useKonvaEditor } from "../context/KonvaEditorContext";

export interface IBottomSheetProps {
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  translateY: number;
  dragStartYRef: React.MutableRefObject<number>;
  currentTranslateYRef: React.MutableRefObject<number>;
}

export const BottomSheet = ({
  isDragging,
  setIsDragging,
  translateY,
  dragStartYRef,
  currentTranslateYRef,
}: IBottomSheetProps) => {
  const { setTranslateY, isCollapsed, setIsCollapsed } = useKonvaEditor();

  // --- Drag Handlers ---
  const handleStart = (y: number) => {
    dragStartYRef.current = y;
    currentTranslateYRef.current = translateY;
    setIsDragging(true);
  };

  const toggleSheet = (_e: React.MouseEvent | React.TouchEvent) => {
    // Only toggle if not dragging (simple click)
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
        <Tabs id="editor-tabs" className="flex-1 overflow-hidden">
          <Tabs.Tab key="qr" label="Thiết kế QR">
            <StylingTab />
          </Tabs.Tab>

          <Tabs.Tab key="layout" label="Bố cục">
            <LayoutTab />
          </Tabs.Tab>

          <Tabs.Tab key="stickers" label="Nhãn dán">
            <StickerTab />
          </Tabs.Tab>
        </Tabs>
      </Box>
    </Box>
  );
};
