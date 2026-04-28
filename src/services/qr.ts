import { getPresignedUrl, qrRecordResource } from "@/resources";
import { EQRCategory, QrCode } from "@/types/qr";
import request from "@/utils/axios";
import { ZALO_APP_LINK } from "@/utils/constants/common";
import { DEFAULT_EDITOR_STAGE, DEFAULT_QR_STYLE } from "@/utils/constants/qr";
import Konva from "konva";
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
        bankId,
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
    ...DEFAULT_EDITOR_STAGE.qrOptions,
    data: text,
  });

  const raw = await qrCode.getRawData("webp");
  if (!raw) throw new Error("Failed to generate QR blob");

  const rawBlob = raw instanceof Blob ? raw : new Blob([raw as BlobPart], { type: "image/webp" });

  const imgUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(rawBlob);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    // crossOrigin might not be needed for data URLs
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imgUrl;
  });

  const container = document.createElement("div");
  const stage = new Konva.Stage({
    container,
    width: 350,
    height: 450,
  });

  const layer = new Konva.Layer();
  const group = new Konva.Group({
    clipX: 0,
    clipY: 0,
    clipWidth: 350,
    clipHeight: 450,
  });

  const bgRect = new Konva.Rect({
    width: 350,
    height: 450,
    fill: DEFAULT_EDITOR_STAGE.canvasBg,
    cornerRadius: 8,
  });
  group.add(bgRect);

  const qrEl = DEFAULT_EDITOR_STAGE.elements.find((e) => e.id === "qr-main");
  if (qrEl) {
    const konvaImg = new Konva.Image({
      image,
      x: qrEl.x,
      y: qrEl.y,
      width: qrEl.width,
      height: qrEl.height,
      rotation: qrEl.rotation,
    });
    group.add(konvaImg);
  }

  layer.add(group);
  stage.add(layer);

  const dataURL = stage.toDataURL({ pixelRatio: 3, mimeType: "image/webp" });

  stage.destroy();

  const res = await fetch(dataURL);
  return await res.blob();
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

  async getQRDetail(id: string) {
    return await request.get<QrCode>(`${qrRecordResource}/${id}`);
  },

  async updateQR(id: string, data: IQRFormValues, customBlob?: Blob, editorStage?: any) {
    const payloadString = getQRPayload(data);
    const blob = customBlob || (await generateQRBlob(payloadString));

    const uploadInfo = await request.get<{
      file: { id: string; path: string };
      uploadSignedUrl: string;
    }>(getPresignedUrl);

    const { uploadSignedUrl, file } = uploadInfo;

    await request.put(uploadSignedUrl, blob, {
      headers: { "Content-Type": "image/webp" },
    });

    const payload = buildQRCreatePayload(data, file);
    if (editorStage) {
      (payload as any).editorStage = editorStage;
    }

    const response = await request.patch(`${qrRecordResource}/${id}`, payload);

    return response;
  },

  async deleteQR(id: string) {
    return await request.delete(`${qrRecordResource}/${id}`);
  },
};
