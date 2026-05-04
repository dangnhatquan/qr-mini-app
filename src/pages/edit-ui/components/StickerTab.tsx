import { Box, Button, Icon } from "zmp-ui";
import { useKonvaEditor } from "../context/KonvaEditorContext";
import { useState } from "react";
import { chooseImage, showToast } from "zmp-sdk/apis";
import { uploadFile } from "@/utils/helpers/image";
import { getFullUrl } from "@/utils/axios";

export const StickerTab = () => {
  const { elements, setElements, setSelectedId } = useKonvaEditor();
  const [uploading, setUploading] = useState(false);

  const handleAddSticker = (url: string) => {
    // eslint-disable-next-line react-hooks/purity
    const id = `sticker-${Date.now().toString()}`;
    setElements([
      ...elements,
      {
        id,
        type: "image",
        src: url,
        x: 100,
        y: 100,
        width: 80,
        height: 80,
        rotation: 0,
      },
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
            handleAddSticker(getFullUrl(file.path));
            showToast({ message: "Đã thêm Sticker" });
          } catch (err) {
            console.error("Upload sticker error:", err);
            showToast({ message: "Lỗi tải Sticker" });
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
      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">
        Kho nhãn dán
      </div>
      <div className="grid grid-cols-4 gap-4 pb-4">
        {[
          "https://img.icons8.com/color/96/ok--v1.png",
          "https://img.icons8.com/color/96/like--v1.png",
          "https://img.icons8.com/color/96/star--v1.png",
          "https://img.icons8.com/color/96/checked-checkbox.png",
          "https://img.icons8.com/color/96/sale.png",
          "https://img.icons8.com/color/96/discount.png",
          "https://img.icons8.com/color/96/shopping-cart.png",
        ].map((s) => (
          <img
            key={s}
            src={getFullUrl(s)}
            className="w-full aspect-square object-contain rounded-lg p-1 active:bg-gray-100 cursor-pointer bg-white"
            onClick={() => handleAddSticker(s)}
          />
        ))}
        <div className="w-full aspect-square flex justify-center items-center">
          <Button
            variant="secondary"
            fullWidth
            icon={
              <Icon
                icon={uploading ? "zi-backup-arrow-solid" : "zi-plus"}
                className={`${uploading ? "animate-spin" : ""} rotate-90`}
              />
            }
            onClick={handleUploadSticker}
            disabled={uploading}
          >
            {uploading ? "Đang tải lên..." : "Tải Sticker lên"}
          </Button>
        </div>
      </div>
    </Box>
  );
};
