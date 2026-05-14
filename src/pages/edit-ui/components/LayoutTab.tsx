import { Box } from "zmp-ui";
import { useKonvaEditor } from "../context/KonvaEditorContext";
import { BACKGROUND_COLORS } from "../utils/constants";

export const LayoutTab = () => {
  const { canvasBg, setCanvasBg } = useKonvaEditor();

  return (
    <Box p={4} className="overflow-y-auto h-[calc(50vh-140px)] pb-20">
      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Màu nền khung hình</div>
      <div className="flex gap-3 flex-wrap w-full">
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
