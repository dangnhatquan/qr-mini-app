import React, { useEffect, useState, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { DEFAULT_EDITOR_STAGE } from "@/utils/constants/qr";

interface QRDisplayProps {
  data: string;
  size?: number;
  className?: string;
  delayRender?: boolean;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({
  data,
  size = 80,
  className,
  delayRender = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px" },
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !data || !isVisible || delayRender) return;

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
  }, [data, size, isVisible, delayRender]);

  const showPlaceholder = !isVisible || delayRender;

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center overflow-hidden bg-white qr-container ${
        showPlaceholder ? "animate-pulse bg-gray-100" : ""
      } ${className || ""}`}
      style={{ width: size, height: size }}
    />
  );
};
