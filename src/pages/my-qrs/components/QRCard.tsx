import React from "react";
import { QrCode } from "@/store";
import { QRCardUI } from "./QRCardUI";

interface QRCardProps {
  qr: QrCode;
  onClick: () => void;
  onMoreClick: () => void;
}

export const QRCard: React.FC<QRCardProps> = ({ qr, onClick, onMoreClick }) => {
  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreClick?.();
  };

  return (
    <div onClick={onClick} className="w-full h-full">
      <QRCardUI qr={qr} onMoreClick={handleMoreClick} />
    </div>
  );
};

export default QRCard;
