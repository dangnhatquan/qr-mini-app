import { Box, Button, Icon } from "zmp-ui";
import { useKonvaEditor } from "../context/KonvaEditorContext";
import { chooseImage } from "zmp-sdk";

export const StickerTab = () => {
  const { elements, setElements, setSelectedId } = useKonvaEditor();

  const handleAddSticker = (url: string) => {
    const elId = "sticker-" + Date.now();
    setElements([
      ...elements,
      {
        id: elId,
        type: "image",
        src: url,
        x: 100,
        y: 100,
        width: 80,
        height: 80,
        rotation: 0,
      },
    ]);
    setSelectedId(elId);
  };

  const handleUploadSticker = () => {
    chooseImage({
      count: 1,
      success: (data) => {
        if (data.filePaths.length > 0) {
          handleAddSticker(data.filePaths[0]);
        } else if (data.tempFiles.length > 0) {
          handleAddSticker(data.tempFiles[0].path);
        }
      },
      fail: () => {
        // do nothing
      },
    });
  };

  return (
    <Box p={4} className="overflow-y-auto h-[calc(50vh-140px)] pb-20">
      <Button
        variant="secondary"
        onClick={handleUploadSticker}
        prefixIcon={<Icon icon="zi-plus" />}
        fullWidth
        className="mb-4"
      >
        Tải nhãn dán từ máy
      </Button>
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
            src={s}
            className="w-full aspect-square object-contain border rounded-lg p-1 active:bg-gray-100 cursor-pointer bg-white"
            onClick={() => handleAddSticker(s)}
          />
        ))}
      </div>
    </Box>
  );
};
