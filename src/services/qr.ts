import { getPresignedUrl, qrRecordResource } from "@/resources";
import { EQRCategory, EQRType, QrCode } from "@/types/qr";
import request, { getFullUrl } from "@/utils/axios";
import { ZALO_APP_LINK } from "@/utils/constants/common";
import { DEFAULT_EDITOR_STAGE } from "@/utils/constants/qr";
import Konva from "konva";
import {
  buildQRCreatePayload,
  cleanUpBase64,
  generateDynamicLink,
  generateVietQRPayload,
  generateWifiPayload,
} from "@/utils/helpers/qr";
import { IQRFormValues } from "@/utils/schemas/qr";
import QRCodeStyling from "qr-code-styling";
import { ZALO_APP_DEV_VERSION } from "@/api";
import { getSystemInfo } from "zmp-sdk/apis";
import { StageProps } from "react-konva";
import { CanvasElement, CanvasElementType } from "@/types/editor";
import { uploadFile } from "@/utils/helpers/image";

export const getQRPayload = (data: IQRFormValues, id?: string): string => {
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

    case EQRCategory.VCARD:
    case EQRCategory.GREETING: {
      const { version } = getSystemInfo();
      const finalVersion = version || ZALO_APP_DEV_VERSION;
      return generateDynamicLink(finalVersion, id!, data.category, undefined);
    }

    default: {
      return ZALO_APP_LINK;
    }
  }
};

export const generateQRBlob = async (text: string, editorStage?: StageProps): Promise<Blob> => {
  const stageData = editorStage || DEFAULT_EDITOR_STAGE;

  const qrCode = new QRCodeStyling({
    ...(stageData.qrOptions || DEFAULT_EDITOR_STAGE.qrOptions),
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
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "Anonymous";
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
    fill: stageData.canvasBg || DEFAULT_EDITOR_STAGE.canvasBg,
    cornerRadius: 8,
  });
  group.add(bgRect);

  const qrEl = (stageData.elements || DEFAULT_EDITOR_STAGE.elements).find(
    (e: CanvasElement) => e.id === "qr-main",
  );

  const otherElements = (stageData.elements || []).filter((e: CanvasElement) => e.id !== "qr-main");
  for (const el of otherElements) {
    if (el.type === CanvasElementType.IMAGE && el.src) {
      const imageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.crossOrigin = "Anonymous";
        img.src = el.src;
      });
      const newKonvaImage = new Konva.Image({
        image: imageElement,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        rotation: el.rotation,
      });
      group.add(newKonvaImage);
    } else if (el.type === CanvasElementType.TEXT) {
      const konvaText = new Konva.Text({
        text: el.text,
        x: el.x,
        y: el.y,
        fontSize: el.fontSize,
        fill: el.fill,
        width: el.width,
        align: el.align,
        rotation: el.rotation,
      });
      group.add(konvaText);
    }
  }

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
    if (data.qrType === EQRType.DYNAMIC) {
      const createPayload = {
        qrType: data.qrType,
        category: data.category,
        wifiData: data.category === EQRCategory.WIFI ? data.wifiData : undefined,
        bankingData: data.category === EQRCategory.BANKING ? data.bankingData : undefined,
        vcardData: data.category === EQRCategory.VCARD ? data.vcardData : undefined,
        greetingData: data.category === EQRCategory.GREETING ? data.greetingData : undefined,
      };

      const qrResponse = await request.post<{
        id: string;
        slug: string;
        shortUrl: string;
      }>(qrRecordResource, createPayload);

      const { id, shortUrl } = qrResponse;

      const { version } = getSystemInfo();
      const finalVersion = version || ZALO_APP_DEV_VERSION;

      const finalUrl = generateDynamicLink(finalVersion, id, data.category, shortUrl);

      const blob = await generateQRBlob(finalUrl);

      const file = await uploadFile(blob);

      const updatePayload = {
        editorStage: DEFAULT_EDITOR_STAGE,
        previewImageId: file.id,
      };

      return await request.patch(`${qrRecordResource}/${id}`, updatePayload);
    }

    const payloadString = getQRPayload(data);
    const blob = await generateQRBlob(payloadString);

    const file = await uploadFile(blob);

    const payload = buildQRCreatePayload(data, file);

    const response = await request.post(qrRecordResource, payload);

    return response;
  },

  async getQRDetail(id: string) {
    return await request.get<QrCode>(`${qrRecordResource}/${id}`);
  },

  async updateQR(id: string, data: IQRFormValues, customBlob?: Blob, editorStage?: StageProps) {
    let finalEditorStage = editorStage;
    if (!finalEditorStage) {
      const existing = await this.getQRDetail(id);
      finalEditorStage = existing.editorStage;
    }

    const payloadString = getQRPayload(data, id);
    const blob = customBlob || (await generateQRBlob(payloadString, finalEditorStage));

    const uploadInfo = await request.get<{
      file: { id: string; path: string };
      uploadSignedUrl: string;
    }>(getPresignedUrl);

    const { uploadSignedUrl, file } = uploadInfo;

    await request.put(uploadSignedUrl, blob, {
      headers: { "Content-Type": "image/webp" },
    });

    const payload: any = {
      qrType: data.qrType,
      category: data.category,
      previewImageId: file.id,
      wifiData: data.category === EQRCategory.WIFI ? data.wifiData : undefined,
      bankingData: data.category === EQRCategory.BANKING ? data.bankingData : undefined,
      vcardData: data.category === EQRCategory.VCARD ? data.vcardData : undefined,
      greetingData: data.category === EQRCategory.GREETING ? data.greetingData : undefined,
    };

    if (editorStage) {
      payload.editorStage = cleanUpBase64(editorStage);
    }

    const response = await request.patch(`${qrRecordResource}/${id}`, payload);

    return response;
  },

  async deleteQR(id: string) {
    return await request.delete(`${qrRecordResource}/${id}`);
  },
};
