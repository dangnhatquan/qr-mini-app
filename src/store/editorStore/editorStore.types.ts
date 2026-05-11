import Konva from "konva";
import { Options } from "qr-code-styling";
import React from "react";

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

export interface EditorOutputs {
  qrOptions: Options;
  elements: CanvasElement[];
  canvasBg: string;
  blob: Blob;
}

export interface KonvaEditorStore {
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  mainGroupRef: React.MutableRefObject<Konva.Group | null>;

  qrOptions: Options;
  setQrOptions: React.Dispatch<React.SetStateAction<Options>>;
  qrImageSrc: string;
  setQrImageSrc: React.Dispatch<React.SetStateAction<string>>;
  isRendering: boolean;
  setIsRendering: React.Dispatch<React.SetStateAction<boolean>>;

  elements: CanvasElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  canvasBg: string;
  setCanvasBg: React.Dispatch<React.SetStateAction<string>>;
  stageSize: { width: number; height: number };
  setStageSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
  stageScale: number;
  setStageScale: React.Dispatch<React.SetStateAction<number>>;
  stagePos: { x: number; y: number };
  setStagePos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  openSection: string | null;
  setOpenSection: React.Dispatch<React.SetStateAction<string | null>>;

  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  translateY: number;
  setTranslateY: React.Dispatch<React.SetStateAction<number>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;

  initialOptions: Options | null;
  setInitialOptions: React.Dispatch<React.SetStateAction<Options | null>>;
  initialElements: CanvasElement[] | null;
  setInitialElements: React.Dispatch<React.SetStateAction<CanvasElement[] | null>>;
  initialCanvasBg: string;
  setInitialCanvasBg: React.Dispatch<React.SetStateAction<string>>;
}
