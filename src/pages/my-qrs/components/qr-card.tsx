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
      className="rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-5 w-full flex flex-col justify-between relative overflow-hidden transition-transform duration-300 active:scale-95 border border-gray-100 bg-white cursor-pointer"
      style={{ minHeight: "180px" }}
      onClick={onClick}
    >
      {/* Decorative Background Element */}
      <div
        className={`absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10 blur-2xl ${
          type === "static" ? "bg-blue-500" : "bg-purple-500"
        }`}
      />
      <div
        className={`absolute -left-10 -bottom-10 w-32 h-32 rounded-full opacity-10 blur-2xl ${
          type === "static" ? "bg-blue-400" : "bg-purple-400"
        }`}
      />

      <div className="flex justify-between items-start relative z-10">
        <Box>
          <Text className="font-bold text-xl text-gray-800 line-clamp-1 mb-1">
            {getCategoryLabel(category)}
          </Text>
          <span
            className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
              type === "static" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
            }`}
          >
            {type === "static" ? "Tĩnh" : "Động"}
          </span>
        </Box>

        <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 p-1">
          {imgSrc ? (
            <img src={imgSrc} alt="QR Thumbnail" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <Icon icon="zi-more-grid" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end relative z-10 mt-6">
        <div>
          <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-0.5">
            Ngày tạo
          </Text>
          <Text className="font-semibold text-gray-700 text-sm">
            {new Date(createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Text>
        </div>

        <div className="flex space-x-1">
          {/* Placeholder for dots if we want to show it's a card */}
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </Box>
  );
};
