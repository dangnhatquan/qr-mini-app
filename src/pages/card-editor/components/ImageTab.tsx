import { useState } from "react";
import { Box, Button } from "zmp-ui";
import { IconUpload } from "@tabler/icons-react";
import { chooseImage, showToast } from "zmp-sdk/apis";
import { getImageDimensions, uploadFile } from "@/utils/helpers/image";
import { getFullUrl } from "@/utils/axios";
import { useKonvaEditor } from "@/pages/edit-ui/context/KonvaEditorContext";
import { CanvasElement, CanvasElementType } from "@/store";

export const ImageTab = () => {
  const { elements, setElements, setSelectedId, sessionId } = useKonvaEditor();
  const [uploading, setUploading] = useState(false);

  const handleAddImage = async (url: string, fileId: string, width = 100, height = 100) => {
    const id = `image-${Date.now()}`;
    const ratio = width / height;

    const newElement: CanvasElement = {
      id,
      type: CanvasElementType.IMAGE,
      src: url,
      fileId,
      x: 0,
      y: 0,
      width: 100,
      height: 100 / ratio,
      rotation: 0,
    };

    setElements([...elements, newElement]);
    setSelectedId(id);
  };

  const handleUploadImage = () => {
    chooseImage({
      count: 1,
      success: async (data) => {
        const path = data.filePaths?.[0] || data.tempFiles?.[0]?.path;
        if (path) {
          try {
            setUploading(true);
            const response = await fetch(path);
            const blob = await response.blob();
            const file = await uploadFile(blob, sessionId);
            const url = getFullUrl(file.path);
            const { width, height } = await getImageDimensions(blob);
            handleAddImage(url, file.id, width, height);
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
        onClick={handleUploadImage}
        loading={uploading}
      >
        Tải ảnh từ thiết bị
      </Button>
    </Box>
  );
};
