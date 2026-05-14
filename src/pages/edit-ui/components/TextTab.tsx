import { Box, Button, Input } from "zmp-ui";
import { IconPlus } from "@tabler/icons-react";
import { useKonvaEditor } from "../context/KonvaEditorContext";

export const TextTab = () => {
  const { elements, setElements, selectedId, setSelectedId } = useKonvaEditor();

  const handleAddText = () => {
    const elId = "text-" + Date.now();
    setElements([
      ...elements,
      {
        id: elId,
        type: "text",
        text: "Quét để xem",
        x: 100,
        y: 320,
        fontSize: 20,
        fill: "#000000",
        width: 150,
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
        <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">
          Thêm chữ
        </div>
        <Button variant="secondary" onClick={handleAddText} prefixIcon={<IconPlus />}>
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
