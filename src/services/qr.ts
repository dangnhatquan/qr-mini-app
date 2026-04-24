import { getPresignedUrl, qrRecordResource } from "@/resources";
import { EQRCategory, QrCode } from "@/types/qr";
import request from "@/utils/axios";
import { ZALO_APP_LINK } from "@/utils/constants/common";
import { DEFAULT_QR_STYLE } from "@/utils/constants/qr";
import {
  buildQRCreatePayload,
  generateGreetingPayload,
  generateVCardPayload,
  generateVietQRPayload,
  generateWifiPayload,
} from "@/utils/helpers/qr";
import { IQRFormValues } from "@/utils/schemas/qr";
import QRCodeStyling from "qr-code-styling";

export const getQRPayload = (data: IQRFormValues): string => {
  switch (data.category) {
    case EQRCategory.BANKING: {
      const { bankId, accountNo } = data.bankingData!;
      return generateVietQRPayload({
        bankBin: bankId,
        accountNumber: accountNo,
      });
    }

    case EQRCategory.WIFI: {
      const { ssid, password, security } = data.wifiData!;
      return generateWifiPayload(ssid, password, security);
    }

    case EQRCategory.VCARD: {
      return generateVCardPayload(
        data.vcardData!.fullName,
        data.vcardData!.phone,
        data.vcardData!.email,
        data.vcardData!.company,
        data.vcardData!.position,
        data.vcardData!.website,
      );
    }

    case EQRCategory.GREETING: {
      return generateGreetingPayload(data.greetingData!.eventName, data.greetingData!.wishes);
    }

    default: {
      return ZALO_APP_LINK;
    }
  }
};

export const generateQRBlob = async (text: string): Promise<Blob> => {
  const qrCode = new QRCodeStyling({
    ...DEFAULT_QR_STYLE,
    data: text,
  });

  const raw = await qrCode.getRawData("webp");
  if (!raw) throw new Error("Failed to generate QR blob");
  if (raw instanceof Blob) {
    return raw;
  }
  return new Blob([raw as any], { type: "image/webp" });
};

export const qrService = {
  async getMyQRs() {
    return await request.get<QrCode[]>(qrRecordResource);
  },

  async createQR(data: IQRFormValues) {
    const payloadString = getQRPayload(data);
    const blob = await generateQRBlob(payloadString);

    const uploadInfo = await request.get<{
      file: { id: string; path: string };
      uploadSignedUrl: string;
    }>(getPresignedUrl);

    const { uploadSignedUrl, file } = uploadInfo;

    await request.put(uploadSignedUrl, blob, {
      headers: { "Content-Type": "image/webp" },
    });

    const payload = buildQRCreatePayload(data, file);

    const response = await request.post(qrRecordResource, payload);

    return response;
  },
};
