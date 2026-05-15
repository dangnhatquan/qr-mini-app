import React, { useState } from "react";
import { Box, Text, Input, Button } from "zmp-ui";
import { useEditor } from "@/components/za-editor/hooks/useEditor";
import { FRAME_RATIOS } from "../utils/constants";
import { openSnackbar } from "@/utils/snackbar";
import { IconCheck } from "@tabler/icons-react";

export const SizeTab = () => {
  const { stageSize, setStageSize } = useEditor();
  const [customWidth, setCustomWidth] = useState(stageSize.width.toString());
  const [customHeight, setCustomHeight] = useState(stageSize.height.toString());

  const [prevStageSize, setPrevStageSize] = useState(stageSize);
  if (stageSize !== prevStageSize) {
    setPrevStageSize(stageSize);
    setCustomWidth(Math.round(stageSize.width).toString());
    setCustomHeight(Math.round(stageSize.height).toString());
  }

  const handleRatioSelect = (width: number, height: number) => {
    setStageSize({ width, height });
  };

  const handleApplyCustom = () => {
    const w = parseFloat(customWidth);
    const h = parseFloat(customHeight);

    if (isNaN(w) || isNaN(h) || w < 50 || h < 50 || w > 3000 || h > 3000) {
      openSnackbar({ text: "Kích thước không hợp lệ (50 - 3000px)", type: "error" });
      return;
    }

    setStageSize({ width: w, height: h });
    openSnackbar({ text: "Đã áp dụng kích thước", type: "success" });
  };

  const isActive = (width: number, height: number) => {
    return Math.abs(stageSize.width - width) < 1 && Math.abs(stageSize.height - height) < 1;
  };

  return (
    <Box className="bg-white p-4">
      <Text className="font-semibold mb-3 text-gray-800">Gợi ý tỷ lệ</Text>
      <Box className="grid grid-cols-3 gap-2 mb-6">
        {FRAME_RATIOS.map((ratio) => (
          <Button
            key={ratio.label}
            variant={isActive(ratio.width, ratio.height) ? "primary" : "secondary"}
            size="small"
            onClick={() => handleRatioSelect(ratio.width, ratio.height)}
            className={`!rounded-lg transition-all !h-auto !py-2 ${isActive(ratio.width, ratio.height) ? "shadow-md" : ""}`}
          >
            <div className="flex flex-col items-center">
              <span className="text-[13px] font-bold leading-tight">{ratio.label}</span>
              <span className="text-[10px] opacity-70 font-normal leading-tight mt-0.5">
                {Math.round(ratio.width)}x{Math.round(ratio.height)}
              </span>
            </div>
          </Button>
        ))}
      </Box>

      <Text className="font-semibold mb-3 text-gray-800 border-t pt-4">
        Kích thước tùy chỉnh (px)
      </Text>
      <div className="flex justify-between items-end">
        <div className="w-[40%]">
          <Text size="xSmall" className="text-gray-500 mb-1 font-medium">
            Rộng
          </Text>
          <Input
            type="number"
            size="small"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            placeholder="0"
            className="!bg-white !rounded-lg"
          />
        </div>
        <div className="w-[40%]">
          <Text size="xSmall" className="text-gray-500 mb-1 font-medium">
            Cao
          </Text>
          <Input
            type="number"
            size="small"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            placeholder="0"
            className="!bg-white !rounded-lg"
          />
        </div>
        <div
          onClick={handleApplyCustom}
          id="save-button"
          className="mb-1 cursor-pointer bg-primary text-white shadow-xl !rounded-full !w-8 h-8 flex items-center justify-center p-0"
        >
          <IconCheck className="font-bold" size={20} />
        </div>
      </div>
      <Text size="xSmall" className="text-gray-400 mt-4 italic text-center">
        * Tip: Sử dụng 2 ngón tay để phóng to/thu nhỏ canvas.
      </Text>
    </Box>
  );
};
