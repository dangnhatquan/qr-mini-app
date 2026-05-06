import { BankingQRData, EQRCategory, QrCode, WifiQRData } from "@/types/qr";
import { IQRFormValues } from "../schemas/qr";
import { ZALO_APP_LINK } from "../constants/common";
import { DEFAULT_EDITOR_STAGE } from "../constants/qr";
import { ZALO_APP_DEV_VERSION, ZALO_APP_ID } from "@/api";
import { getSystemInfo } from "zmp-sdk/apis";
import { StageProps } from "react-konva";

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

export function generateVietQRPayload({
  bankId,
  accountNumber,
  amount,
  merchantName = "N/A",
  merchantCity = "VIETNAM",
  description = "",
}: {
  bankId: string;
  accountNumber: string;
  amount?: string;
  merchantName?: string;
  merchantCity?: string;
  description?: string;
}) {
  if (!bankId) throw new Error("Bank BIN không được để trống");
  if (!accountNumber) throw new Error("Số tài khoản không được để trống");

  const tlv = (id: string, value: string) => {
    const v = String(value);
    const len = v.length.toString().padStart(2, "0");
    return `${id}${len}${v}`;
  };

  const consumerInfo = tlv("00", bankId) + tlv("01", accountNumber);
  const napasProvider = tlv("00", "A000000727") + tlv("01", consumerInfo) + tlv("02", "QRIBFTTC");

  let payload = "";
  payload += tlv("00", "01");
  payload += tlv("01", "11");
  payload += tlv("38", napasProvider);
  payload += tlv("53", "704");
  if (amount) {
    payload += tlv("54", amount);
    payload = payload.replace(tlv("01", "11"), tlv("01", "12"));
  }
  payload += tlv("58", "VN");
  payload += tlv("59", merchantName);
  payload += tlv("60", merchantCity);

  if (description) {
    const addData = tlv("08", description);
    payload += tlv("62", addData);
  }

  payload += "6304";
  const crcValue = crc16(payload);
  return payload + crcValue;
}

export const generateWifiPayload = (ssid: string, password: string, security: string) => {
  return `WIFI:S:${ssid};T:${security};P:${password};;`;
};

export const buildQRCreatePayload = (data: IQRFormValues, file: { id: string }) => {
  return {
    qrType: data.qrType,
    category: data.category,
    previewImageId: file.id,
    wifiData: data.category === EQRCategory.WIFI ? data.wifiData : undefined,
    bankingData: data.category === EQRCategory.BANKING ? data.bankingData : undefined,
    vcardData: data.category === EQRCategory.VCARD ? data.vcardData : undefined,
    greetingData: data.category === EQRCategory.GREETING ? data.greetingData : undefined,
    editorStage: DEFAULT_EDITOR_STAGE,
  };
};

export const generateQRPayload = (qr: QrCode) => {
  switch (qr.category) {
    case EQRCategory.BANKING: {
      const { accountNo, amount, bankId } = qr.payload?.bankingData as BankingQRData;
      return generateVietQRPayload({ accountNumber: accountNo, amount, bankId });
    }
    case EQRCategory.WIFI: {
      const { ssid, password, security } = qr.payload?.wifiData as WifiQRData;
      return generateWifiPayload(ssid, password, security);
    }
    case EQRCategory.VCARD:
    case EQRCategory.GREETING: {
      const { version } = getSystemInfo();
      const finalVersion = version || ZALO_APP_DEV_VERSION;
      return generateDynamicLink(finalVersion, qr.id, qr.category, undefined);
    }
    default:
      return ZALO_APP_LINK;
  }
};

export const generateDynamicLink = (
  version: string,
  id: string,
  category: EQRCategory,
  shortUrl?: string,
) => {
  if (shortUrl) return shortUrl;

  let page = "vcards";
  if (category === EQRCategory.GREETING) {
    page = "greetings";
  }

  return `https://zalo.me/s/${ZALO_APP_ID}/?env=TESTING&version=${version}&page=${page}/${id}`;
};

export const isRemoteImage = (imageSrc?: string) =>
  imageSrc && (/^(https?:)?\/\//.test(imageSrc) || imageSrc.startsWith("/minio-proxy/"));

export const cleanUpBase64 = (editorStage: StageProps) => {
  return {
    ...editorStage,
    elements: editorStage.elements?.map((el) => ({
      ...el,
      src: isRemoteImage(el.src) ? el.src : "",
    })),
  };
};
