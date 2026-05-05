import request from "@/utils/axios";
import { cardsResource } from "@/resources";

export interface CardResponse {
  id: string;
  editorStage: Record<string, unknown> | null;
  previewImage?: { id: string; path: string } | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const cardService = {
  async createCard(
    editorStage?: Record<string, unknown>,
    previewImageId?: string,
  ): Promise<CardResponse> {
    return await request.post<CardResponse>(cardsResource, {
      editorStage: editorStage ?? null,
      previewImageId: previewImageId ?? null,
    });
  },

  async updateCard(
    id: string,
    editorStage?: Record<string, unknown>,
    previewImageId?: string,
  ): Promise<CardResponse> {
    return await request.patch<CardResponse>(`${cardsResource}/${id}`, {
      editorStage: editorStage ?? null,
      previewImageId: previewImageId ?? null,
    });
  },

  async deleteCard(id: string): Promise<void> {
    return await request.delete(`${cardsResource}/${id}`);
  },

  async getCard(id: string): Promise<CardResponse> {
    return await request.get<CardResponse>(`${cardsResource}/${id}`);
  },
};
