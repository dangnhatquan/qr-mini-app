import { IQRFormValues } from "@/utils/schemas/qr";
import { EditorStage } from "../editorStore";

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

export interface IQRBackendPayload {
  wifiData?: WifiQRData;
  bankingData?: BankingQRData;
  vcardData?: VCardQRData;
  greetingData?: GreetingQRData;
}

export interface WifiQRData {
  security: string;
  ssid: string;
  password: string;
}

export interface BankingQRData {
  bankId: string;
  accountNo: string;
  amount?: string;
  accountName?: string;
}

export interface VCardQRData {
  fullName: string;
  phone: string;
  email?: string;
  company?: string;
  position?: string;
  website?: string;
  avatar?: string;
  socialLinks?: string;
}

export interface GreetingQRData {
  eventName: string;
  wishes: string;
  password?: string;
  maxAttempts?: number;
  cardId?: string;
}

export interface QrCode {
  id: string;
  userId: number;
  type: string;
  category: string;
  slug: string | null;
  passwordHash: string | null;
  previewImage: PreviewImage;
  payload: IQRBackendPayload | null;
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

// Using EditorStage from editorStore.types.ts

export interface QRStore {
  qrCodeRecords: QrCode[];
  isFetching: boolean;
  error: string | null;

  selectedQR: QrCode | null;
  isFetchingSelectedQR: boolean;
  errorSelectedQR: string | null;

  setSelectedQR: (qr: QrCode) => void;
  fetchQRRecords: () => Promise<void>;
  fetchQRDetail: (id: string) => Promise<void>;
  removeQRRecord: (id: string, callback?: () => void) => Promise<void>;

  updateQRRecord: (
    id: string,
    data: IQRFormValues,
    blob?: Blob,
    editorStage?: EditorStage,
    callback?: () => void,
  ) => Promise<void>;
}
