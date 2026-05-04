import { Box, Button, Icon, Input } from "zmp-ui";
import { useKonvaEditor } from "../context/KonvaEditorContext";
import { BACKGROUND_COLORS } from "../utils/constants";

export const LayoutTab = () => {
  const { canvasBg, setCanvasBg, elements, setElements, selectedId, setSelectedId } =
    useKonvaEditor();

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

  return (
    <Box p={4} className="overflow-y-auto h-[calc(50vh-140px)] pb-20">
      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Màu nền khung hình</div>
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

      <div className="mt-6">
        <Button
          variant="secondary"
          onClick={handleAddText}
          prefixIcon={<Icon icon="zi-plus" />}
          fullWidth
        >
          Thêm Chữ
        </Button>
      </div>

      {selectedId && elements.find((el) => el.id === selectedId)?.type === "text" && (
        <Box mt={4} p={3} className="bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">
            Chỉnh sửa nội dung chữ
          </span>
          <Input
            value={elements.find((el) => el.id === selectedId)?.text || ""}
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
                value={String(elements.find((el) => el.id === selectedId)?.fontSize)}
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
                value={elements.find((el) => el.id === selectedId)?.fill}
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
