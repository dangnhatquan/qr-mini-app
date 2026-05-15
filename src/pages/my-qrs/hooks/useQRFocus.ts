import { useState } from "react";
import { QrCode } from "@/store";
import { QR_CARD_ANIMATION_CLOSE_DELAY } from "@/utils/constants/qr";

export const useQRFocus = () => {
  const [focusedQR, setFocusedQR] = useState<QrCode | null>(null);
  const [isFocusOpen, setIsFocusOpen] = useState(false);

  const openFocus = (qr: QrCode) => {
    if (isFocusOpen) return;
    setFocusedQR(qr);
    setTimeout(() => setIsFocusOpen(true), 16);
  };

  const closeFocus = () => {
    setIsFocusOpen(false);
    setTimeout(() => setFocusedQR(null), QR_CARD_ANIMATION_CLOSE_DELAY);
  };

  return {
    focusedQR,
    isFocusOpen,
    openFocus,
    closeFocus,
  };
};
