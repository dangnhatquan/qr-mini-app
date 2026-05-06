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
  dotsOptions: { color: COLOR.BLACK.color, type: "rounded" },
  backgroundOptions: { color: COLOR.WHITE.color },
  cornersSquareOptions: { color: COLOR.BLACK.color, type: "extra-rounded" },
  cornersDotOptions: { color: COLOR.BLACK.color, type: "dot" },
  imageOptions: { crossOrigin: "anonymous", margin: 10 },
};

export const DEFAULT_EDITOR_STAGE = {
  qrOptions: DEFAULT_QR_STYLE,
  elements: [
    {
      id: "qr-main",
      type: "image",
      src: "",
      x: 25,
      y: 75,
      width: 300,
      height: 300,
      rotation: 0,
    },
  ],
  canvasBg: COLOR.WHITE.color,
};
