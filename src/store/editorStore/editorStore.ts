import Konva from "konva";
import { create } from "zustand";
import { KonvaEditorStore } from "./editorStore.types";
import React from "react";

export const useEditorStore = create<KonvaEditorStore>((set) => {
  const createSetter =
    <T>(key: keyof KonvaEditorStore) =>
    (valueOrUpdater: React.SetStateAction<T>) =>
      set((state: any) => ({
        [key]:
          typeof valueOrUpdater === "function"
            ? (valueOrUpdater as (prev: any) => T)(state[key])
            : valueOrUpdater,
      }));

  return {
    stageRef: { current: null } as React.MutableRefObject<Konva.Stage | null>,
    mainGroupRef: { current: null } as React.MutableRefObject<Konva.Group | null>,

    qrOptions: {},
    setQrOptions: createSetter("qrOptions"),

    qrImageSrc: "",
    setQrImageSrc: createSetter("qrImageSrc"),

    isRendering: false,
    setIsRendering: createSetter("isRendering"),

    elements: [],
    setElements: createSetter("elements"),

    selectedId: null,
    setSelectedId: createSetter("selectedId"),

    canvasBg: "",
    setCanvasBg: createSetter("canvasBg"),

    stageSize: { width: 400, height: 600 },
    setStageSize: createSetter("stageSize"),

    stageScale: 1,
    setStageScale: createSetter("stageScale"),

    stagePos: { x: 0, y: 0 },
    setStagePos: createSetter("stagePos"),

    openSection: null,
    setOpenSection: createSetter("openSection"),

    isCollapsed: false,
    setIsCollapsed: createSetter("isCollapsed"),

    translateY: 0,
    setTranslateY: createSetter("translateY"),

    isDragging: false,
    setIsDragging: createSetter("isDragging"),

    initialOptions: null,
    setInitialOptions: createSetter("initialOptions"),

    initialElements: null,
    setInitialElements: createSetter("initialElements"),

    initialCanvasBg: "",
    setInitialCanvasBg: createSetter("initialCanvasBg"),
  };
});
