import React from "react";
import { QrCode } from "@/store";
import { QRCardUI } from "./QRCardUI";

interface QRCardProps {
  qr: QrCode;
  onClick: () => void;
  onMoreClick: () => void;
  delayRender?: boolean;
}

export const QRCard: React.FC<QRCardProps> = ({ qr, onClick, onMoreClick, delayRender }) => {
  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreClick?.();
  };

  return (
    <div onClick={onClick} className="w-full h-full">
      <QRCardUI qr={qr} onMoreClick={handleMoreClick} delayRender={delayRender} />
    </div>
  );
};

export default QRCard;
