export enum CanvasElementType {
  IMAGE = "image",
  TEXT = "text",
}

export interface CanvasElement {
  id: string;
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  src?: string;
  text?: string;
  fontSize?: number;
  fill?: string;
  align?: string;
}
