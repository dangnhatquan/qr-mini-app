import React, { useEffect, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { DEFAULT_EDITOR_STAGE } from "@/utils/constants/qr";

interface QRDisplayProps {
  data: string;
  size?: number;
  className?: string;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({ data, size = 80, className }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const qrCodeRef = React.useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        ...DEFAULT_EDITOR_STAGE.qrOptions,
        type: "svg",
        width: size,
        height: size,
        data: data,
        margin: 0,
      });
      qrCodeRef.current.append(containerRef.current);
    } else {
      qrCodeRef.current.update({
        data: data,
        width: size,
        height: size,
      });
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      qrCodeRef.current = null;
    };
  }, [data, size]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center overflow-hidden bg-white qr-container ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
