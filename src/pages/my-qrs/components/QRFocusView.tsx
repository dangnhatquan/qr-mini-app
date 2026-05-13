import React from "react";
import { QRCard } from "./QRCard";
import { QrCode } from "@/store";
import { QR_CARD_ANIMATION_CLOSE_DELAY } from "@/utils/constants/qr";

interface QRFocusViewProps {
  qr: QrCode | null;
  isOpen: boolean;
  onClose: () => void;
  onMoreClick: (qr: QrCode) => void;
}

export const QRFocusView: React.FC<QRFocusViewProps> = ({ qr, isOpen, onClose, onMoreClick }) => {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.82)",
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: `opacity ${QR_CARD_ANIMATION_CLOSE_DELAY}ms ease-out`,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          pointerEvents: isOpen ? "auto" : "none",
          transform: isOpen ? "translateY(-50%)" : "translateY(calc(-50% - 100vh))",
          transition: `transform ${QR_CARD_ANIMATION_CLOSE_DELAY}ms ease-out`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: "calc(100vw - 32px)",
            maxWidth: "400px",
            height: "250.94px",
          }}
        >
          {qr && (
            <QRCard
              qr={qr}
              onClick={() => {}}
              onMoreClick={() => {
                onClose();
                onMoreClick(qr);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
