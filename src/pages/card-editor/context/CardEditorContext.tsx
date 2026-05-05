import React, { createContext, useContext, useRef, useState } from "react";
import Konva from "konva";
import { COLOR } from "@/pages/edit-ui/utils/constants";
import { CanvasElement } from "@/types/editor";

interface CardEditorContextType {
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  mainGroupRef: React.MutableRefObject<Konva.Group | null>;

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

  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  translateY: number;
  setTranslateY: React.Dispatch<React.SetStateAction<number>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;

  isRendering: boolean;
  setIsRendering: React.Dispatch<React.SetStateAction<boolean>>;

  cardId: string | null;
  setCardId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CardEditorContext = createContext<CardEditorContextType | undefined>(undefined);

export const CardEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const mainGroupRef = useRef<Konva.Group | null>(null);

  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasBg, setCanvasBg] = useState(COLOR.PINK.color);
  const [stageSize] = useState({ width: 350, height: 450 });
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [isRendering, setIsRendering] = useState(false);

  const [cardId, setCardId] = useState<string | null>(null);

  return (
    <CardEditorContext.Provider
      value={{
        stageRef,
        mainGroupRef,
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
        isCollapsed,
        setIsCollapsed,
        translateY,
        setTranslateY,
        isDragging,
        setIsDragging,
        isRendering,
        setIsRendering,
        cardId,
        setCardId,
      }}
    >
      {children}
    </CardEditorContext.Provider>
  );
};

export const useCardEditor = () => {
  const ctx = useContext(CardEditorContext);
  if (!ctx) throw new Error("useCardEditor must be used within a CardEditorProvider");
  return ctx;
};
