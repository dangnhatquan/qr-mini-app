import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { DEFAULT_QR_STYLE } from "@/utils/constants/qr";

interface QRDisplayProps {
  data: string;
  size?: number;
  className?: string;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({ data, size = 80, className }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        ...DEFAULT_QR_STYLE,
        width: size,
        height: size,
        data: data,
        margin: 0,
      });
    } else {
      qrCodeRef.current.update({
        data: data,
        width: size,
        height: size,
      });
    }

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCodeRef.current.append(qrRef.current);
    }
  }, [data, size]);

  return <div ref={qrRef} className={className} />;
};
