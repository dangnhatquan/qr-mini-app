import { File } from "@/types/file";
import { StageProps } from "react-konva";

export interface Card {
  id: string;
  editorStage: StageProps;
  previewImage: File;
}

export interface CardStore {
  card: Card | null;
  isFetching: boolean;
  error: string | null;
  fetchCard: (id: string) => Promise<void>;
  createCard: (editorStage: StageProps, previewImageId: string) => Promise<void>;
  updateCard: (id: string, editorStage: StageProps, previewImageId: string) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
}
