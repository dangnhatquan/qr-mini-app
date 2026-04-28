import React, { createContext, useContext, useRef, useState } from "react";
import { Options } from "qr-code-styling";
import { COLOR, DEFAULT_OPTIONS, STYLE_SECTION } from "../utils/constants";
import Konva from "konva";

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

interface KonvaEditorContextType {
  // Ref
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  mainGroupRef: React.MutableRefObject<Konva.Group | null>;

  // QR Styling State
  qrOptions: Options;
  setQrOptions: React.Dispatch<React.SetStateAction<Options>>;
  qrImageSrc: string;
  setQrImageSrc: React.Dispatch<React.SetStateAction<string>>;
  isRendering: boolean;
  setIsRendering: React.Dispatch<React.SetStateAction<boolean>>;

  // Konva State
  elements: CanvasElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  canvasBg: string;
  setCanvasBg: React.Dispatch<React.SetStateAction<string>>;
  stageSize: { width: number; height: number };
  stageScale: number;
  setStageScale: React.Dispatch<React.SetStateAction<number>>;
  stagePos: { x: number; y: number };
  setStagePos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  openSection: string | null;
  setOpenSection: React.Dispatch<React.SetStateAction<string | null>>;

  // Bottom Sheet State
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

const KonvaEditorContext = createContext<KonvaEditorContextType | undefined>(undefined);

export const KonvaEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const mainGroupRef = useRef<Konva.Group | null>(null);

  const [qrOptions, setQrOptions] = useState<Options>(DEFAULT_OPTIONS);

  const [qrImageSrc, setQrImageSrc] = useState<string>("");
  const [isRendering, setIsRendering] = useState(false);

  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasBg, setCanvasBg] = useState(COLOR.WHITE.color);
  const [stageSize] = useState({ width: 350, height: 450 });
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [openSection, setOpenSection] = useState<string | null>(STYLE_SECTION.DOTS);

  // Bottom Sheet
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // History for Discard
  const [initialOptions, setInitialOptions] = useState<Options | null>(null);
  const [initialElements, setInitialElements] = useState<CanvasElement[] | null>(null);
  const [initialCanvasBg, setInitialCanvasBg] = useState("");

  const value = {
    stageRef,
    mainGroupRef,
    qrOptions,
    setQrOptions,
    qrImageSrc,
    setQrImageSrc,
    isRendering,
    setIsRendering,
    elements,
    setElements,
    selectedId,
    setSelectedId,
    canvasBg,
    setCanvasBg,
    stageSize,
    stageScale,
    setStageScale,
    stagePos,
    setStagePos,
    openSection,
    setOpenSection,
    isCollapsed,
    setIsCollapsed,
    translateY,
    setTranslateY,
    isDragging,
    setIsDragging,
    initialOptions,
    setInitialOptions,
    initialElements,
    setInitialElements,
    initialCanvasBg,
    setInitialCanvasBg,
  };

  return <KonvaEditorContext.Provider value={value}>{children}</KonvaEditorContext.Provider>;
};

export const useKonvaEditor = () => {
  const context = useContext(KonvaEditorContext);
  if (context === undefined) {
    throw new Error("useKonvaEditor must be used within a KonvaEditorProvider");
  }
  return context;
};
