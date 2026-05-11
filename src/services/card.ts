import request from "@/utils/axios";
import { cardsResource } from "@/resources";
import { Card } from "@/store";
import { deleteFile } from "@/utils/helpers/image";

export const cardService = {
  async createCard(editorStage?: Record<string, unknown>, previewImageId?: string): Promise<Card> {
    return await request.post<Card>(cardsResource, {
      editorStage: editorStage ?? null,
      previewImageId: previewImageId ?? null,
    });
  },

  async updateCard(
    id: string,
    editorStage?: Record<string, unknown>,
    previewImageId?: string,
  ): Promise<Card> {
    const existing = await this.getCard(id);
    const oldPreviewImageId = existing.previewImage?.id;

    const response = await request.patch<Card>(`${cardsResource}/${id}`, {
      editorStage: editorStage ?? null,
      previewImageId: previewImageId ?? null,
    });

    if (oldPreviewImageId && previewImageId && oldPreviewImageId !== previewImageId) {
      await deleteFile(oldPreviewImageId);
    }

    return response;
  },

  async deleteCard(id: string): Promise<void> {
    try {
      const existing = await this.getCard(id);
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
      console.error("Error cleaning up files for deleted card:", err);
    }
    return await request.delete(`${cardsResource}/${id}`);
  },

  async getCard(id: string, password?: string): Promise<Card> {
    return await request.post<Card>(`${cardsResource}/${id}`, {
      password,
    });
  },
};
