import { getPresignedUrl, qrRecordResource } from "@/resources";
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
import { getSystemInfo } from "zmp-sdk/apis";

import { uploadFile, deleteFile } from "@/utils/helpers/image";
import { EQRCategory, EQRType, QrCode, EditorStage } from "@/store";

export const qrService = {
  async getMyQRs() {
    return await request.get<QrCode[]>(qrRecordResource);
  },

  async createQR(data: IQRFormValues) {
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

  async updateQR(id: string, data: IQRFormValues, customBlob?: Blob, editorStage?: EditorStage) {
    const existing = await this.getQRDetail(id);
    const oldPreviewImageId = existing.previewImage?.id;

    let finalEditorStage = editorStage || existing.editorStage;

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

    const response = await request.patch(`${qrRecordResource}/${id}`, payload);

    if (oldPreviewImageId && oldPreviewImageId !== file.id) {
      await deleteFile(oldPreviewImageId);
    }

    return response;
  },

  async deleteQR(id: string) {
    try {
      const existing = await this.getQRDetail(id);
      if (existing) {
        if (existing.previewImage?.id) {
          await deleteFile(existing.previewImage.id);
        }

        if (existing.editorStage?.elements) {
          for (const el of existing.editorStage.elements) {
            if (el.fileId) {
              await deleteFile(el.fileId);
            }
          }
        }

        if (existing.editorStage?.logoFileId) {
          await deleteFile(existing.editorStage.logoFileId);
        }
      }
    } catch (err) {
      console.error("Error cleaning up files for deleted QR:", err);
    }
    return await request.delete(`${qrRecordResource}/${id}`);
  },
};
