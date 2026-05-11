import { COLLAPSED_Y, SHEET_HEIGHT } from "@/pages/edit-ui/utils/constants";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Box } from "zmp-ui";

export interface IBottomSheetProps {
  content?: ReactNode;
  height?: number;

  onToggle?: (isCollapsed: boolean, translateY: number) => void;
}

export const BottomSheet = ({ content, height = SHEET_HEIGHT, onToggle }: IBottomSheetProps) => {
  const dragStartYRef = useRef(0);
  const currentTranslateYRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [translateY, setTranslateY] = useState(0);

  const handleStart = (y: number) => {
    dragStartYRef.current = y;
    currentTranslateYRef.current = translateY;
    setIsDragging(true);
  };

  useEffect(() => {
    onToggle?.(isCollapsed, translateY);
  }, [isCollapsed, translateY, onToggle]);

  const toggleSheet = () => {
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

  const handleMove = (y: number) => {
    if (!isDragging) return;
    const deltaY = y - dragStartYRef.current;
    let nextY = currentTranslateYRef.current + deltaY;

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

  return (
    <Box
      className={`bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex flex-col fixed bottom-0 left-0 right-0 z-50 ${isDragging ? "" : "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"}`}
      style={{
        height: `${height}px`,
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
        {content}
      </Box>
    </Box>
  );
};
