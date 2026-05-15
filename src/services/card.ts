import request from "@/utils/axios";
import { cardsResource } from "@/resources";
import { Card } from "@/store";

export const cardService = {
  async createCard(
    editorStage?: Record<string, unknown>,
    previewImageId?: string,
    sessionId?: string,
  ): Promise<Card> {
    const response = await request.post<Card>(cardsResource, {
      editorStage: editorStage ?? null,
      previewImageId: previewImageId ?? null,
      sessionId,
    });
    return response.data;
  },

  async updateCard(
    id: string,
    editorStage?: Record<string, unknown>,
    previewImageId?: string,
    sessionId?: string,
  ): Promise<Card> {
    const response = await request.patch<Card>(`${cardsResource}/${id}`, {
      editorStage: editorStage ?? null,
      previewImageId: previewImageId ?? null,
      sessionId,
    });
    return response.data;
  },

  async deleteCard(id: string): Promise<void> {
    const response = await request.delete(`${cardsResource}/${id}`);
    return response.data;
  },

  async getCard(id: string, password?: string): Promise<Card> {
    const response = await request.post<Card>(`${cardsResource}/${id}`, {
      password,
    });
    return response.data;
  },
};
