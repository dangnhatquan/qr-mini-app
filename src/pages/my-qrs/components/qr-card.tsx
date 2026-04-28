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
  onClick: () => void;
}

export const QRCard: React.FC<QRCardProps> = ({
  type,
  category,
  previewUrl,
  createdAt,
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
      className={`rounded-2xl shadow-xl p-5 w-full flex flex-col justify-between relative overflow-hidden transition-transform duration-300 active:scale-95 cursor-pointer text-white ${
        type === "static"
          ? "bg-gradient-to-br from-blue-500 to-blue-700"
          : "bg-gradient-to-br from-indigo-500 to-purple-700"
      }`}
      style={{ minHeight: "180px" }}
      onClick={onClick}
    >
      {/* Decorative Background Elements */}
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white opacity-10 blur-xl" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white opacity-10 blur-xl" />

      <div className="flex justify-between items-start relative z-10">
        <Box>
          <Text className="font-bold text-xl text-white line-clamp-1 mb-2 shadow-sm">
            {getCategoryLabel(category)}
          </Text>
          <span className="text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider bg-white/20 backdrop-blur-sm text-white border border-white/30">
            {type === "static" ? "QR Tĩnh" : "QR Động"}
          </span>
        </Box>

        <div className="w-14 h-14 bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0 p-1 border border-white/50">
          {imgSrc ? (
            <img src={imgSrc} alt="QR Thumbnail" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Icon icon="zi-more-grid" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end relative z-10 mt-6">
        <div>
          <Text className="text-white/70 text-xs font-medium uppercase tracking-wider mb-0.5">
            Ngày tạo
          </Text>
          <Text className="font-semibold text-white text-sm">
            {new Date(createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Text>
        </div>

        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    </Box>
  );
};
