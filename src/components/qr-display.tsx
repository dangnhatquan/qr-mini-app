import React, { useEffect, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { DEFAULT_EDITOR_STAGE } from "@/utils/constants/qr";

interface QRDisplayProps {
  data: string;
  size?: number;
  className?: string;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({ data, size = 80, className }) => {
  const [qrImageUrl, setQrImageUrl] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrCode = new QRCodeStyling({
          ...DEFAULT_EDITOR_STAGE.qrOptions,
          width: size * 4,
          height: size * 4,
          data: data,
          margin: 0,
        });

        const raw = await qrCode.getRawData("webp");
        if (!raw) throw new Error("Failed to generate QR blob");

        const rawBlob =
          raw instanceof Blob ? raw : new Blob([raw as BlobPart], { type: "image/webp" });

        const imgUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(rawBlob);
        });

        setQrImageUrl(imgUrl);
      } catch (error) {
        console.error("QRDisplay Error:", error);
      }
    };

    if (data) {
      generateQR();
    }
  }, [data, size]);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-white ${className}`}
      style={{ width: size, height: size }}
    >
      {qrImageUrl ? (
        <img src={qrImageUrl} alt="QR Code" className="w-full h-full object-contain" />
      ) : (
        <div className="w-full h-full animate-pulse bg-gray-50" />
      )}
    </div>
  );
};
