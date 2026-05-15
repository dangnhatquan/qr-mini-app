import React, { createContext, useContext, useRef, useState } from "react";
import { Options } from "qr-code-styling";
import { COLOR, STYLE_SECTION } from "../utils/constants";
import Konva from "konva";
import { DEFAULT_QR_STYLE } from "@/utils/constants/qr";
import { CanvasElement } from "@/store";

interface KonvaEditorContextType {
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  mainGroupRef: React.MutableRefObject<Konva.Group | null>;
  lastDistRef: React.MutableRefObject<number>;

  qrOptions: Partial<Options>;
  setQrOptions: React.Dispatch<React.SetStateAction<Partial<Options>>>;
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
  canvasBgFileId: string | null;
  setCanvasBgFileId: React.Dispatch<React.SetStateAction<string | null>>;
  logoFileId: string | null;
  setLogoFileId: React.Dispatch<React.SetStateAction<string | null>>;
  stageSize: { width: number; height: number };
  setStageSize: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
  stageScale: number;
  setStageScale: React.Dispatch<React.SetStateAction<number>>;
  stagePos: { x: number; y: number };
  setStagePos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;

  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  translateY: number;
  setTranslateY: React.Dispatch<React.SetStateAction<number>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;

  initialQrOptions?: Partial<Options> | null;
  initialElements?: CanvasElement[] | null;
  initialCanvasBg?: string;
  initialStageSize?: { width: number; height: number };
  sessionId: string;
}

const KonvaEditorContext = createContext<KonvaEditorContextType | undefined>(undefined);

export const KonvaEditorProvider: React.FC<{
  children: React.ReactNode;
  initialCanvasBg?: string;
  initialQrOptions?: Partial<Options>;
  initialElements?: CanvasElement[];
  initialStageSize?: { width: number; height: number };
  initialLogoFileId?: string | null;
  initialCanvasBgFileId?: string | null;
}> = ({
  children,
  initialCanvasBg,
  initialQrOptions,
  initialElements,
  initialStageSize,
  initialLogoFileId,
  initialCanvasBgFileId,
}) => {
  const lastDistRef = useRef(0);

  const stageRef = useRef<Konva.Stage | null>(null);
  const mainGroupRef = useRef<Konva.Group | null>(null);
  const sessionId = crypto.randomUUID();

  const [qrOptions, setQrOptions] = useState<Partial<Options>>(
    initialQrOptions ?? DEFAULT_QR_STYLE,
  );

  const [qrImageSrc, setQrImageSrc] = useState<string>("");
  const [isRendering, setIsRendering] = useState(false);

  const [elements, setElements] = useState<CanvasElement[]>(initialElements ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasBg, setCanvasBg] = useState(initialCanvasBg ?? COLOR.WHITE.color);
  const [canvasBgFileId, setCanvasBgFileId] = useState<string | null>(
    initialCanvasBgFileId ?? null,
  );
  const [logoFileId, setLogoFileId] = useState<string | null>(initialLogoFileId ?? null);
  const [stageSize, setStageSize] = useState(initialStageSize ?? { width: 350, height: 450 });
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
    canvasBgFileId,
    setCanvasBgFileId,
    logoFileId,
    setLogoFileId,
    stageSize,
    setStageSize,
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
    initialStageSize,
    sessionId,
  };

  const [prevInitialCanvasBg, setPrevInitialCanvasBg] = useState(initialCanvasBg);
  const [prevInitialQrOptions, setPrevInitialQrOptions] = useState(initialQrOptions);
  const [prevInitialElements, setPrevInitialElements] = useState(initialElements);
  const [prevInitialStageSize, setPrevInitialStageSize] = useState(initialStageSize);

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

  if (
    initialStageSize &&
    (initialStageSize.width !== prevInitialStageSize?.width ||
      initialStageSize.height !== prevInitialStageSize?.height)
  ) {
    setStageSize(initialStageSize);
    setPrevInitialStageSize(initialStageSize);
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
