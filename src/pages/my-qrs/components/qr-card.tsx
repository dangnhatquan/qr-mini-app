import React, { useEffect, useState } from "react";
import { Box, Text, Icon } from "zmp-ui";
import { getCategoryLabel } from "../utils/functions";
import QRCodeStyling from "qr-code-styling";
import { IQRBackendPayload } from "@/types/qr";
import { generateQRPayload } from "@/utils/helpers/qr";

interface QRCardProps {
  id: string;
  type: string;
  category: string;
  previewUrl: string;
  createdAt: string;
  payload: IQRBackendPayload;
  onClick: () => void;
}

export const QRCard: React.FC<QRCardProps> = ({
  type,
  category,
  previewUrl,
  createdAt,
  payload,
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (!previewUrl) return;

    const loadImage = async () => {
      try {
        const res = await fetch(previewUrl, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        const blob = await res.blob();

        const reader = new FileReader();

        reader.onloadend = () => {
          setImgSrc(reader.result as string);
        };

        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Load image error:", err);
      }
    };

    loadImage();
  }, [previewUrl]);

  return (
    <Box
      className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center border border-gray-100"
      onClick={onClick}
    >
      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border flex-shrink-0">
        {imgSrc ? (
          <img src={imgSrc} alt="QR Thumbnail" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Icon icon="zi-more-grid" />
          </div>
        )}
      </div>

      <Box ml={4} className="flex-1">
        <Text className="font-bold text-base text-gray-800 line-clamp-1">
          {getCategoryLabel(category)}
        </Text>

        <div className="flex items-center mt-1">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold mr-2 ${
              type === "static" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
            }`}
          >
            {type === "static" ? "Tĩnh" : "Động"}
          </span>

          <Text className="text-gray-400 text-xs italic">
            {new Date(createdAt).toLocaleDateString("vi-VN")}
          </Text>
        </div>
      </Box>

      <Icon icon="zi-chevron-right" className="text-gray-300" />
    </Box>
  );
};
