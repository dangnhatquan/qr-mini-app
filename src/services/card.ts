import request from "@/utils/axios";
import { cardsResource } from "@/resources";
import { Card } from "@/store";

export const cardService = {
  async createCard(
    editorStage?: Record<string, unknown>,
    previewImageId?: string,
    sessionId?: string,
  ): Promise<Card> {
    return await request.post<Card>(cardsResource, {
      editorStage: editorStage ?? null,
      previewImageId: previewImageId ?? null,
      sessionId,
    });
  },

  async updateCard(
    id: string,
    editorStage?: Record<string, unknown>,
    previewImageId?: string,
    sessionId?: string,
  ): Promise<Card> {
    return await request.patch<Card>(`${cardsResource}/${id}`, {
      editorStage: editorStage ?? null,
      previewImageId: previewImageId ?? null,
      sessionId,
    });
  },

  async deleteCard(id: string): Promise<void> {
    return await request.delete(`${cardsResource}/${id}`);
  },

  async getCard(id: string, password?: string): Promise<Card> {
    return await request.post<Card>(`${cardsResource}/${id}`, {
      password,
    });
  },
};
