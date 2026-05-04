import { COLOR, COLORS } from "@/pages/edit-ui/utils/constants";
import { DEFAULT_BANK_ID, DEFAULT_WIFI_SECURITY, EQRCategory, EQRType } from "@/types/qr";
import { Options } from "qr-code-styling";

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
  dotsOptions: { color: "#000000", type: "rounded" },
  backgroundOptions: { color: "#ffffff" },
  cornersSquareOptions: { color: "#000000", type: "extra-rounded" },
  cornersDotOptions: { color: "#000000", type: "dot" },
  imageOptions: { crossOrigin: "anonymous", margin: 10 },
};

export const DEFAULT_EDITOR_STAGE = {
  qrOptions: DEFAULT_QR_STYLE,
  elements: [
    {
      id: "qr-main",
      type: "image",
      src: "",
      x: 75,
      y: 100,
      width: 200,
      height: 200,
      rotation: 0,
    },
  ],
  canvasBg: COLOR.BLUE.color,
};
