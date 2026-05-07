import { getPresignedUrl, qrRecordResource } from "@/resources";
import request from "@/utils/axios";
import { DEFAULT_EDITOR_STAGE } from "@/utils/constants/qr";
import Konva from "konva";
import {
  buildQRCreatePayload,
  cleanUpBase64,
  generateDynamicLink,
  generateQRBlob,
  getQRPayload,
} from "@/utils/helpers/qr";
import { IQRFormValues } from "@/utils/schemas/qr";
import { ZALO_APP_DEV_VERSION } from "@/api";
import { getSystemInfo } from "zmp-sdk/apis";
import { StageProps } from "react-konva";
import { uploadFile } from "@/utils/helpers/image";
import { EQRCategory, EQRType, QrCode } from "@/store";

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
