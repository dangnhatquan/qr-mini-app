import request from "@/utils/axios";
import { cardsResource } from "@/resources";
import { Card } from "@/store";

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
    return await request.patch<Card>(`${cardsResource}/${id}`, {
      editorStage: editorStage ?? null,
      previewImageId: previewImageId ?? null,
    });
  },

  async deleteCard(id: string): Promise<void> {
    return await request.delete(`${cardsResource}/${id}`);
  },

  async getCard(id: string): Promise<Card> {
    return await request.get<Card>(`${cardsResource}/${id}`);
  },
};
