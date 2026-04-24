export enum EQRType {
  STATIC = "static",
  DYNAMIC = "dynamic",
}

export enum EQRCategory {
  WIFI = "wifi",
  BANKING = "banking",
  VCARD = "vcard",
  GREETING = "greeting",
}

export enum EWifiSecurity {
  WPA = "WPA/WPA2",
  WEP = "WEP",
  NONE = "None",
}

export const DEFAULT_WIFI_SECURITY = EWifiSecurity.WPA;
export const DEFAULT_BANK_ID = "vcb";
export const DEFAULT_MAX_ATTEMPTS = 5;

export interface QrCode {
  id: string;
  userId: number;
  type: string;
  category: string;
  slug: string | null;
  passwordHash: string | null;
  previewImage: PreviewImage;
  payload: unknown | null;
  editorStage: EditorStage;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PreviewImage {
  id: string;
  path: string;
  status: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EditorStage {
  dots: string;
  color: string;
}
