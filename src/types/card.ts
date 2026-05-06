import { StageProps } from "react-konva";
import { File } from "./file";

export interface Card {
  id: string;
  editorStage: StageProps;
  previewImage: File;
}
