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
  width: 300,
  height: 300,
  type: "svg",
  dotsOptions: {
    color: "#4267b2",
    type: "rounded",
  },
  backgroundOptions: {
    color: "#e9ebee",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 20,
  },
};
