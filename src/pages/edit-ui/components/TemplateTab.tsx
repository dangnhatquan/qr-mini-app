import { Box } from "zmp-ui";
import { IconPlus } from "@tabler/icons-react";
import { useKonvaEditor } from "../context/KonvaEditorContext";
import { useState } from "react";
import { chooseImage, showToast } from "zmp-sdk/apis";
import { getImageDimensions, uploadFile } from "@/utils/helpers/image";
import { getFullUrl } from "@/utils/axios";
import { DEFAULT_FRAME_HEIGHT, DEFAULT_FRAME_WIDTH } from "../utils/constants";

export const TemplateTab = () => {
  const { elements, setElements, setSelectedId, stageSize } = useKonvaEditor();
  const [uploading, setUploading] = useState(false);

  const handleAddTemplate = (url: string) => {
    const id = `template-${Date.now()}`;

    // Add as background (prepend to elements)
    setElements([
      {
        id,
        type: "image",
        src: url,
        x: 0,
        y: 0,
        width: stageSize.width ?? DEFAULT_FRAME_WIDTH,
        height: stageSize.height ?? DEFAULT_FRAME_HEIGHT,
        rotation: 0,
      },
      ...elements,
    ]);
    setSelectedId(id);
  };

  const handleUploadTemplate = () => {
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
            const { width, height } = await getImageDimensions(blob);
            handleAddTemplate(url);
            showToast({ message: "Đã thêm Template" });
          } catch (err) {
            console.error("Upload template error:", err);
            showToast({ message: "Lỗi tải Template" });
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
        Kho giao diện
      </div>
      <div className="grid grid-cols-2 gap-4 pb-4">
        <Box
          className="w-full aspect-[35/45] flex flex-col justify-center items-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={handleUploadTemplate}
        >
          {uploading ? (
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <IconPlus className="text-gray-400 mb-2" size={32} />
              <span className="text-[10px] text-gray-400 font-medium text-center px-2">
                Tải Template
              </span>
            </>
          )}
        </Box>
      </div>
    </Box>
  );
};
