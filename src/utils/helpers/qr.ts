import { BankingQRData, EQRCategory, QrCode, WifiQRData, EditorStage } from "@/store";
import { IQRFormValues } from "../schemas/qr";
import { ZALO_APP_LINK } from "../constants/common";
import { DEFAULT_EDITOR_STAGE } from "../constants/qr";
import { ZALO_APP_DEV_VERSION, ZALO_APP_ID } from "@/api";
import { getSystemInfo } from "zmp-sdk/apis";

import Konva from "konva";
import { CanvasElement, CanvasElementType } from "@/store";
import QRCodeStyling from "qr-code-styling";
import { generateVietQRPayload } from "./viet-qr";

export const generateWifiPayload = (ssid: string, password: string, security: string) => {
  return `WIFI:S:${ssid};T:${security};P:${password};;`;
};

export const buildQRCreatePayload = (data: IQRFormValues, file: { id: string }) => {
  return {
    name: data.name,
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

  return `https://zalo.me/s/${ZALO_APP_ID}/?env=DEVELOPMENT&version=${version}&page=${page}/${id}`;
};

export const isRemoteImage = (imageSrc?: string) =>
  imageSrc && (/^(https?:)?\/\//.test(imageSrc) || imageSrc.startsWith("/minio-proxy/"));

export const cleanUpBase64 = (editorStage: EditorStage) => {
  return {
    ...editorStage,
    stageSize: editorStage.stageSize,
    elements: (editorStage.elements as any[])?.map((el: any) => ({
      ...el,
      src: isRemoteImage(el.src) ? el.src : "",
    })),
  };
};

export const getQRPayload = (data: IQRFormValues, id?: string): string => {
  switch (data.category) {
    case EQRCategory.BANKING: {
      const { bankId, accountNo, amount, description } = data.bankingData!;
      return generateVietQRPayload({
        bankId,
        accountNumber: accountNo,
        amount,
        description,
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

export const generateQRBlob = async (text: string, editorStage?: EditorStage): Promise<Blob> => {
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
  const stageWidth = stageData.stageSize?.width || 350;
  const stageHeight = stageData.stageSize?.height || 450;

  const stage = new Konva.Stage({
    container,
    width: stageWidth,
    height: stageHeight,
  });

  const layer = new Konva.Layer();
  const group = new Konva.Group({
    clipX: 0,
    clipY: 0,
    clipWidth: stageWidth,
    clipHeight: stageHeight,
  });

  const bgRect = new Konva.Rect({
    width: stageWidth,
    height: stageHeight,
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
        width: imageElement.width,
        height: imageElement.height,
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

export const getCategoryLabel = (cat: string) => {
  const labels: Record<string, string> = {
    wifi: "QR Wifi",
    banking: "QR Chuyển khoản",
    vcard: "Danh thiếp điện tử",
    greeting: "Thiệp điện tử",
  };
  return labels[cat] || cat;
};
