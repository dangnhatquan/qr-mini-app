import { COLOR } from "@/pages/edit-ui/utils/constants";
import { EQRCategory, EQRType, EWifiSecurity } from "@/store/qrStore/qrStore.types";
import { Options } from "qr-code-styling";

export const DEFAULT_WIFI_SECURITY = EWifiSecurity.WPA;
export const DEFAULT_BANK_ID = "970422";
export const DEFAULT_MAX_ATTEMPTS = 5;

export const DEFAULT_QR_FORM_VALUES = {
  qrType: EQRType.STATIC,
  category: EQRCategory.WIFI,
  wifiData: {
    ssid: "",
    password: "",
    security: DEFAULT_WIFI_SECURITY,
  },
  bankingData: {
    bankId: DEFAULT_BANK_ID,
    accountNo: "",
  },
  vcardData: {
    fullName: "",
    phone: "",
    email: "",
    company: "",
    position: "",
    website: "",
  },
  greetingData: {
    eventName: "",
    wishes: "",
  },
};

export const DEFAULT_QR_STYLE: Partial<Options> = {
  width: 512,
  height: 512,
  margin: 10,
  dotsOptions: { color: COLOR.BLACK.color, type: "rounded" },
  backgroundOptions: { color: COLOR.WHITE.color },
  cornersSquareOptions: { color: COLOR.BLACK.color, type: "extra-rounded" },
  cornersDotOptions: { color: COLOR.BLACK.color, type: "dot" },
  imageOptions: { crossOrigin: "anonymous", margin: 10 },
  qrOptions: { errorCorrectionLevel: "Q" },
};

export const DEFAULT_EDITOR_STAGE = {
  qrOptions: DEFAULT_QR_STYLE,
  elements: [
    {
      id: "qr-main",
      type: "image",
      src: "",
      x: 75,
      y: 125,
      width: 200,
      height: 200,
      rotation: 0,
    },
  ],
  canvasBg: COLOR.WHITE.color,
  stageSize: { width: 350, height: 450 },
};

export const QR_CARD_ANIMATION_CLOSE_DELAY = 300;
