import { qrRecordResource } from "@/resources";
import request from "@/utils/axios";
import { DEFAULT_EDITOR_STAGE } from "@/utils/constants/qr";
import {
  buildQRCreatePayload,
  cleanUpBase64,
  generateDynamicLink,
  generateQRBlob,
  getQRPayload,
} from "@/utils/helpers/qr";
import { IQRFormValues } from "@/utils/schemas/qr";
import { ZALO_APP_DEV_VERSION } from "@/api";

import { uploadFile } from "@/utils/helpers/image";
import { EQRCategory, EQRType, QrCode, EditorStage } from "@/store";

export const qrService = {
  async getMyQRs() {
    const response = await request.get<QrCode[]>(qrRecordResource);
    return response.data;
  },

  async createQR(data: IQRFormValues, sessionId?: string) {
    if (data.qrType === EQRType.DYNAMIC) {
      const createPayload = {
        name: data.name,
        qrType: data.qrType,
        category: data.category,
        wifiData: data.category === EQRCategory.WIFI ? data.wifiData : undefined,
        bankingData: data.category === EQRCategory.BANKING ? data.bankingData : undefined,
        vcardData: data.category === EQRCategory.VCARD ? data.vcardData : undefined,
        greetingData:
          data.category === EQRCategory.GREETING
            ? {
                ...data.greetingData,
                isPasswordProtected: !!data.greetingData?.password,
                hasPassword: !!data.greetingData?.password,
              }
            : undefined,
      };

      const qrResponse = await request.post<{
        id: string;
        slug: string;
        shortUrl: string;
      }>(qrRecordResource, { ...createPayload, sessionId });

      const { id, shortUrl } = qrResponse.data;

      const finalVersion = ZALO_APP_DEV_VERSION;

      const finalUrl = generateDynamicLink(finalVersion, id, data.category, shortUrl);

      const blob = await generateQRBlob(finalUrl);

      const file = await uploadFile(blob, sessionId);

      const updatePayload = {
        editorStage: DEFAULT_EDITOR_STAGE,
        previewImageId: file.id,
      };

      const response = await request.patch(`${qrRecordResource}/${id}`, {
        ...updatePayload,
        sessionId,
      });
      return response.data;
    }

    const payloadString = getQRPayload(data);
    const blob = await generateQRBlob(payloadString);

    const file = await uploadFile(blob, sessionId);

    const payload = buildQRCreatePayload(data, file);

    const response = await request.post(qrRecordResource, { ...payload, sessionId });

    return response.data;
  },

  async getQRDetail(id: string) {
    const response = await request.get<QrCode>(`${qrRecordResource}/${id}`);
    return response.data;
  },

  async updateQR(
    id: string,
    data: IQRFormValues,
    customBlob?: Blob,
    editorStage?: EditorStage,
    sessionId?: string,
  ) {
    const existing = await this.getQRDetail(id);

    let finalEditorStage = editorStage || existing.editorStage;

    const payloadString = getQRPayload(data, id);
    const blob = customBlob || (await generateQRBlob(payloadString, finalEditorStage));

    const file = await uploadFile(blob, sessionId);

    const payload: Record<string, unknown> = {
      name: data.name,
      qrType: data.qrType,
      category: data.category,
      previewImageId: file.id,
      wifiData: data.category === EQRCategory.WIFI ? data.wifiData : undefined,
      bankingData: data.category === EQRCategory.BANKING ? data.bankingData : undefined,
      vcardData: data.category === EQRCategory.VCARD ? data.vcardData : undefined,
      greetingData:
        data.category === EQRCategory.GREETING
          ? {
              ...data.greetingData,
              isPasswordProtected: !!data.greetingData?.password,
              hasPassword: !!data.greetingData?.password,
            }
          : undefined,
    };

    if (editorStage) {
      payload.editorStage = cleanUpBase64(editorStage);
    }

    const response = await request.patch(`${qrRecordResource}/${id}`, {
      ...payload,
      sessionId,
    });
    return response.data;
  },

  async deleteQR(id: string) {
    const response = await request.delete(`${qrRecordResource}/${id}`);
    return response.data;
  },
};
