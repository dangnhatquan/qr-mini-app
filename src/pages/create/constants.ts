import { EQRType, EQRCategory, EWifiSecurity } from "@/types/qr";

export const QR_TYPES = [
  { value: EQRType.STATIC, label: "QR Tĩnh (Static)" },
  { value: EQRType.DYNAMIC, label: "QR Động (Dynamic)" },
];

export const STATIC_CATEGORIES = [
  { value: EQRCategory.WIFI, label: "QR Wifi" },
  { value: EQRCategory.BANKING, label: "QR Chuyển khoản (Banking)" },
];

export const DYNAMIC_CATEGORIES = [
  { value: EQRCategory.VCARD, label: "Danh thiếp điện tử (VCard)" },
  { value: EQRCategory.GREETING, label: "Thiệp điện tử (Event/Greeting)" },
];

export const WIFI_SECURITY_OPTIONS = [
  { value: EWifiSecurity.WPA, label: "WPA/WPA2" },
  { value: EWifiSecurity.WEP, label: "WEP" },
  { value: EWifiSecurity.NONE, label: "Không bảo mật" },
];

export const BANK_LIST = [
  { value: "vcb", label: "Vietcombank" },
  { value: "tcb", label: "Techcombank" },
  { value: "bidv", label: "BIDV" },
  { value: "vbi", label: "VietinBank" },
  { value: "mbb", label: "MB Bank" },
  { value: "acb", label: "ACB" },
];
