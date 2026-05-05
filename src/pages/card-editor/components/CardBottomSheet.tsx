import React from "react";
import { Box, Tabs, Button, Input } from "zmp-ui";
import {
  IconPlus,
  IconPolaroid,
  IconTexture,
  IconUpload,
  IconTypography,
} from "@tabler/icons-react";
import { useCardEditor } from "../context/CardEditorContext";
import { BACKGROUND_COLORS, COLLAPSED_Y, SHEET_HEIGHT } from "@/pages/edit-ui/utils/constants";
import { chooseImage, showToast } from "zmp-sdk/apis";
import { uploadFile } from "@/utils/helpers/image";
import { getFullUrl } from "@/utils/axios";
import { useState } from "react";

interface CardBottomSheetProps {
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  translateY: number;
  dragStartYRef: React.MutableRefObject<number>;
  currentTranslateYRef: React.MutableRefObject<number>;
}

const CardLayoutTab = () => {
  const { canvasBg, setCanvasBg } = useCardEditor();

  return (
    <Box p={4} className="overflow-y-auto h-[calc(50vh-140px)] pb-20">
      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">
        Màu nền thiệp
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {BACKGROUND_COLORS.map((t) => (
          <div
            key={t.color}
            onClick={() => setCanvasBg(t.color)}
            className="w-12 h-12 rounded-lg flex-shrink-0 cursor-pointer border-2 flex items-center justify-center text-[10px]"
            style={{
              backgroundColor: t.color,
              borderColor: canvasBg === t.color ? "#3b82f6" : "#e5e7eb",
            }}
          >
            {t.name}
          </div>
        ))}
      </div>
    </Box>
  );
};

const CardTextTab = () => {
  const { elements, setElements, selectedId, setSelectedId } = useCardEditor();

  const handleAddText = () => {
    const elId = "text-" + Date.now();
    setElements([
      ...elements,
      {
        id: elId,
        type: "text",
        text: "Lời chúc",
        x: 80,
        y: 200,
        fontSize: 22,
        fill: "#333333",
        width: 200,
        align: "center",
        rotation: 0,
      },
    ]);
    setSelectedId(elId);
  };

  const selectedTextElement = elements.find((el) => el.id === selectedId && el.type === "text");

  return (
    <Box p={4} className="overflow-y-auto h-[calc(50vh-140px)] pb-20">
      <div className="mb-4">
        <Button variant="secondary" onClick={handleAddText} prefixIcon={<IconPlus />} fullWidth>
          Thêm Chữ
        </Button>
      </div>

      {selectedTextElement && (
        <Box p={3} className="bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">
            Chỉnh sửa nội dung chữ
          </span>
          <Input
            value={selectedTextElement.text || ""}
            onChange={(e) => {
              setElements(
                elements.map((el) => (el.id === selectedId ? { ...el, text: e.target.value } : el)),
              );
            }}
            className="bg-white"
          />
          <div className="flex gap-4 mt-3">
            <div className="flex-1">
              <span className="text-[10px] text-gray-400 block uppercase">Cỡ chữ</span>
              <Input
                type="number"
                value={String(selectedTextElement.fontSize)}
                onChange={(e) => {
                  setElements(
                    elements.map((el) =>
                      el.id === selectedId ? { ...el, fontSize: Number(e.target.value) } : el,
                    ),
                  );
                }}
                className="h-8 text-sm"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-gray-400 block uppercase">Màu</span>
              <input
                type="color"
                value={selectedTextElement.fill}
                onChange={(e) => {
                  setElements(
                    elements.map((el) =>
                      el.id === selectedId ? { ...el, fill: e.target.value } : el,
                    ),
                  );
                }}
                className="w-full h-8"
              />
            </div>
          </div>
        </Box>
      )}
    </Box>
  );
};

const CardStickerTab = () => {
  const { elements, setElements, setSelectedId } = useCardEditor();
  const [uploading, setUploading] = useState(false);

  const handleAddSticker = (url: string, base64?: string) => {
    const id = `sticker-${Date.now()}`;
    setElements([
      ...elements,
      { id, type: "image", src: url, x: 100, y: 100, width: 120, height: 120, rotation: 0 },
    ]);
    setSelectedId(id);
  };

  const handleUploadSticker = () => {
    chooseImage({
      count: 1,
      success: async (data) => {
        const path = data.filePaths?.[0] || data.tempFiles?.[0]?.path;
        if (path) {
          try {
            setUploading(true);
            const response = await fetch(path);
            const blob = await response.blob();

            const file = await uploadFile(blob);
            const url = getFullUrl(file.path);
            handleAddSticker(url);
            showToast({ message: "Đã thêm hình ảnh" });
          } catch {
            showToast({ message: "Lỗi tải hình ảnh" });
          } finally {
            setUploading(false);
          }
        }
      },
      fail: () => setUploading(false),
    });
  };

  return (
    <Box p={4} className="overflow-y-auto h-[calc(50vh-140px)] pb-20">
      <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">
        Thêm hình ảnh vào thiệp
      </div>
      <Button
        variant="secondary"
        fullWidth
        prefixIcon={<IconUpload />}
        onClick={handleUploadSticker}
        loading={uploading}
      >
        Tải ảnh từ thiết bị
      </Button>
    </Box>
  );
};

export const CardBottomSheet = ({
  isDragging,
  setIsDragging,
  translateY,
  dragStartYRef,
  currentTranslateYRef,
}: CardBottomSheetProps) => {
  const { setTranslateY, isCollapsed, setIsCollapsed } = useCardEditor();

  const handleStart = (y: number) => {
    dragStartYRef.current = y;
    currentTranslateYRef.current = translateY;
    setIsDragging(true);
  };

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

  return (
    <Box
      className={`bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex flex-col fixed bottom-0 left-0 right-0 z-50 ${isDragging ? "" : "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"}`}
      style={{ height: `${SHEET_HEIGHT}px`, transform: `translateY(${translateY}px)` }}
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
        <Tabs id="card-editor-tabs" className="flex-1 overflow-hidden">
          <Tabs.Tab
            key="layout"
            label={
              <div className="flex items-center justify-center gap-2">
                <IconTexture className="w-5 h-5" />
                Bố cục
              </div>
            }
          >
            <CardLayoutTab />
          </Tabs.Tab>
          <Tabs.Tab
            key="text"
            label={
              <div className="flex items-center justify-center gap-2">
                <IconTypography className="w-5 h-5" />
                Chữ
              </div>
            }
          >
            <CardTextTab />
          </Tabs.Tab>
          <Tabs.Tab
            key="stickers"
            label={
              <div className="flex items-center justify-center gap-2">
                <IconPolaroid className="w-5 h-5" />
                Hình ảnh
              </div>
            }
          >
            <CardStickerTab />
          </Tabs.Tab>
        </Tabs>
      </Box>
    </Box>
  );
};
