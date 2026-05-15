import React, { useRef, useState } from "react";
import { QRCardUI } from "./QRCardUI";
import { QrCode } from "@/store";
import { QR_CARD_ANIMATION_CLOSE_DELAY } from "@/utils/constants/qr";
import { IconDownload, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { toCanvas, toPng } from "html-to-image";
import { saveImageToGallery, showToast } from "zmp-sdk/apis";
import { Button } from "zmp-ui";

interface QRFocusViewProps {
  qr: QrCode | null;
  isOpen: boolean;
  onClose: () => void;
  onMoreClick: (qr: QrCode) => void;
  onDelete: (qr: QrCode) => void;
}

export const QRFocusView: React.FC<QRFocusViewProps> = ({
  qr,
  isOpen,
  onClose,
  onMoreClick,
  onDelete,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;

    try {
      setIsDownloading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!cardRef.current) return;

      const canvas = await toCanvas(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "transparent",
        skipFonts: false,
        style: {
          borderRadius: "0px",
          transform: "none",
          margin: "0",
          padding: "0",
        },
      });

      const dataUrl = canvas.toDataURL("image/png");

      if (!dataUrl || dataUrl === "data:,") {
        throw new Error("Generated image is empty");
      }

      await saveImageToGallery({
        imageBase64Data: dataUrl,
        success: () => {
          showToast({ message: "Đã lưu ảnh vào thư viện" });
          setIsDownloading(false);
        },
        fail: (error) => {
          console.error("Save image failed", error);
          showToast({ message: "Lưu ảnh thất bại" });
          setIsDownloading(false);
        },
      });
    } catch (err) {
      console.error("Failed to generate image", err);
      showToast({ message: "Không thể tạo ảnh, vui lòng thử lại" });
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/85 backdrop-blur-[10px] z-[9998] transition-opacity duration-[${QR_CARD_ANIMATION_CLOSE_DELAY}ms] ease-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-1/2 left-0 right-0 z-[9999] flex flex-col items-center gap-2 will-change-transform ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          transform: isOpen ? "translateY(-50%)" : "translateY(calc(-50% - 100vh))",
          transition: `transform ${QR_CARD_ANIMATION_CLOSE_DELAY}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        <div className="w-[calc(100vw-48px)] max-w-[400px]  flex flex-col gap-2">
          <div ref={cardRef} className="aspect-[1.586/1]">
            {qr && <QRCardUI qr={qr} showMore={false} />}
          </div>
          <div className="w-full flex justify-between gap-2">
            <Button
              onClick={() => {
                if (qr) onMoreClick(qr);
                onClose();
              }}
              icon={<IconDotsVertical size={24} />}
              className="bg-white/10 w-full hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-2xl py-8 h-auto font-bold flex flex-col items-center gap-1 transition-all active:scale-95"
            />
            <Button
              onClick={handleDownload}
              loading={isDownloading}
              icon={<IconDownload size={24} />}
              className="bg-white/10 w-full hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-2xl py-8 h-auto font-bold flex flex-col items-center gap-1 transition-all active:scale-95"
            />
            <Button
              onClick={() => {
                if (qr) onDelete(qr);
              }}
              icon={<IconTrash size={24} />}
              className="bg-white/10 w-full hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-2xl py-8 h-auto font-bold flex flex-col items-center gap-1 transition-all active:scale-95"
            />
          </div>
        </div>
      </div>
    </>
  );
};
