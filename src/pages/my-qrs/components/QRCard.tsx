import React, { useMemo } from "react";
import { Box, Text } from "zmp-ui";
import { EQRCategory, QrCode, useBankStore } from "@/store";
import { generateQRPayload, getCategoryLabel } from "@/utils/helpers/qr";
import { QRDisplay } from "@/components/qr-display";

interface QRCardProps {
  qr: QrCode;
  onClick: () => void;
  onMoreClick: () => void;
}

export const QRCard: React.FC<QRCardProps> = ({ qr, onClick, onMoreClick }) => {
  const { category, type, createdAt, payload } = qr;
  const { banks } = useBankStore();

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreClick?.();
  };

  const qrText = useMemo(() => generateQRPayload(qr), [qr]);

  const detailText = useMemo(() => {
    if (!payload) return "Chưa có nội dung";
    switch (category) {
      case EQRCategory.BANKING: {
        const bank = banks.find(
          (b) =>
            b.bin === payload.bankingData?.bankId ||
            b.id.toString() === payload.bankingData?.bankId,
        );
        return bank ? bank.shortName || bank.name : "Ngân hàng";
      }
      case EQRCategory.WIFI:
        return payload.wifiData?.ssid || "Wifi";
      case EQRCategory.VCARD:
        return payload.vcardData?.fullName || "Danh thiếp";
      case EQRCategory.GREETING:
        return payload.greetingData?.eventName || "Lời chúc";
      default:
        return "";
    }
  }, [category, payload, banks]);

  const getBgColor = () => {
    switch (category) {
      case EQRCategory.GREETING:
        return "bg-[#009688]";
      case EQRCategory.VCARD:
        return "bg-[#D32F2F]";
      case EQRCategory.WIFI:
        return "bg-gradient-to-br from-blue-500 to-blue-700";
      case EQRCategory.BANKING:
        return "bg-gradient-to-br from-indigo-500 to-purple-700";
      default:
        return "bg-gradient-to-br from-gray-700 to-gray-900";
    }
  };

  return (
    <Box
      className={`rounded-2xl shadow-2xl p-7 w-full h-full flex flex-col justify-between relative overflow-hidden cursor-pointer text-white border border-white/10 ${getBgColor()}`}
      onClick={onClick}
    >
      {/* Premium Decorative elements */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white opacity-[0.15] blur-2xl" />
      <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-black opacity-10 blur-2xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

      <div className="flex justify-between items-start relative z-10">
        <Box className="flex-1 mr-4">
          <Text className="font-extrabold text-2xl uppercase tracking-tighter text-white line-clamp-1 mb-3 leading-none drop-shadow-md">
            {detailText}
          </Text>
          <div className="flex flex-wrap gap-2">
            <span className="text-[9px] px-3 py-1.5 rounded-full uppercase font-black tracking-[0.1em] bg-white/20 backdrop-blur-md text-white border border-white/40 shadow-sm">
              {getCategoryLabel(category)}
            </span>
            <span className="text-[9px] px-3 py-1.5 rounded-full uppercase font-black tracking-[0.1em] bg-black/10 backdrop-blur-md text-white/90 border border-white/20 shadow-sm">
              {type === "static" ? "QR Tĩnh" : "QR Động"}
            </span>
          </div>
        </Box>

        <div className="w-20 h-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden flex-shrink-0 border border-white/50 flex items-center justify-center p-2">
          <QRDisplay data={qrText} size={80} />
        </div>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="flex flex-col gap-1">
          <Text className="text-white/60 text-[9px] font-black uppercase tracking-[0.2em]">
            Ngày khởi tạo
          </Text>
          <Text className="font-bold text-white text-base tracking-tight">
            {new Date(createdAt)
              .toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(",", "")}
          </Text>
        </div>

        {/* Premium More Button */}
        <div
          className="w-12 h-12 -mr-3 -mb-3 flex items-center justify-center cursor-pointer active:scale-90 transition-transform bg-white/10 backdrop-blur-sm rounded-full border border-white/10"
          onClick={handleMoreClick}
        >
          <div className="flex space-x-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-sm"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/30 shadow-sm"></div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default QRCard;
