import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Options } from "qr-code-styling";
import { COLOR, STYLE_SECTION } from "../utils/constants";
import Konva from "konva";
import { DEFAULT_QR_STYLE } from "@/utils/constants/qr";
import { CanvasElement } from "@/store";

interface KonvaEditorContextType {
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  mainGroupRef: React.MutableRefObject<Konva.Group | null>;
  lastDistRef: React.MutableRefObject<number>;

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

  initialQrOptions?: Options | null;
  initialElements?: CanvasElement[] | null;
  initialCanvasBg?: string;
}

const KonvaEditorContext = createContext<KonvaEditorContextType | undefined>(undefined);

export const KonvaEditorProvider: React.FC<{
  children: React.ReactNode;
  initialCanvasBg?: string;
  initialQrOptions?: Options;
  initialElements?: CanvasElement[];
}> = ({ children, initialCanvasBg, initialQrOptions, initialElements }) => {
  const lastDistRef = useRef(0);

  const stageRef = useRef<Konva.Stage | null>(null);
  const mainGroupRef = useRef<Konva.Group | null>(null);

  const [qrOptions, setQrOptions] = useState<Options>(initialQrOptions ?? DEFAULT_QR_STYLE);

  const [qrImageSrc, setQrImageSrc] = useState<string>("");
  const [isRendering, setIsRendering] = useState(false);

  const [elements, setElements] = useState<CanvasElement[]>(initialElements ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasBg, setCanvasBg] = useState(initialCanvasBg ?? COLOR.WHITE.color);
  const [stageSize] = useState({ width: 350, height: 450 });
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [openSection, setOpenSection] = useState<string | null>(STYLE_SECTION.DOTS);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const value = {
    stageRef,
    mainGroupRef,
    lastDistRef,

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
    initialQrOptions,
    initialElements,
    initialCanvasBg,
  };

  const [prevInitialCanvasBg, setPrevInitialCanvasBg] = useState(initialCanvasBg);
  const [prevInitialQrOptions, setPrevInitialQrOptions] = useState(initialQrOptions);
  const [prevInitialElements, setPrevInitialElements] = useState(initialElements);

  if (initialCanvasBg !== prevInitialCanvasBg) {
    setCanvasBg(initialCanvasBg ?? COLOR.WHITE.color);
    setPrevInitialCanvasBg(initialCanvasBg);
  }

  if (initialQrOptions !== prevInitialQrOptions) {
    setQrOptions(initialQrOptions ?? DEFAULT_QR_STYLE);
    setPrevInitialQrOptions(initialQrOptions);
  }

  if (initialElements !== prevInitialElements) {
    setElements(initialElements ?? []);
    setPrevInitialElements(initialElements);
  }

  return <KonvaEditorContext.Provider value={value}>{children}</KonvaEditorContext.Provider>;
};

export const useKonvaEditor = () => {
  const context = useContext(KonvaEditorContext);
  if (context === undefined) {
    throw new Error("useKonvaEditor must be used within a KonvaEditorProvider");
  }
  return context;
};
