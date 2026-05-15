import { create } from "zustand";
import { CardStore } from "./cardStore.types";
import { cardService } from "@/services/card";
import { StageProps } from "react-konva";

export const useCardStore = create<CardStore>((set) => ({
  card: null,
  isFetching: false,
  error: null,
  clearCard: () => set({ card: null, isFetching: false, error: null }),
  fetchCard: async (id: string, password?: string) => {
    set({ isFetching: true, error: null });
    try {
      const data = await cardService.getCard(id, password);
      set({ card: data, isFetching: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isFetching: false });
      throw error;
    }
  },
  createCard: async (editorStage: StageProps, previewImageId: string) => {
    set({ isFetching: true, error: null });
    try {
      const data = await cardService.createCard(editorStage, previewImageId);
      set({ card: data, isFetching: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isFetching: false });
    }
  },
  updateCard: async (id: string, editorStage: StageProps, previewImageId: string) => {
    set({ isFetching: true, error: null });
    try {
      const data = await cardService.updateCard(id, editorStage, previewImageId);
      set({ card: data, isFetching: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isFetching: false });
    }
  },
  deleteCard: async (id: string) => {
    set({ isFetching: true, error: null });
    try {
      await cardService.deleteCard(id);
      set({ card: null, isFetching: false });
    } catch (error: unknown) {
      set({ error: (error as Error).message, isFetching: false });
    }
  },
}));
