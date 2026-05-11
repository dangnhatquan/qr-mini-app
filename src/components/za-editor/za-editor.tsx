import { KonvaEditorProvider } from "@/pages/edit-ui/context/KonvaEditorContext";
import { CanvasEditor } from "./canvas-editor";
import { ICustomTab } from "./types/editor.types";
import { Options } from "qr-code-styling";
import { CanvasElement, EditorOutputs } from "@/store";
import { IZaToolbarProps } from "./za-toolbar";
import { IZaStageProps } from "./za-stage";
import { IZaOverlayProps } from "./za-overlay";
import { FC, ReactNode } from "react";

export interface IZaEditorProps {
  renderToolbar?: (props: IZaToolbarProps) => ReactNode;
  renderStage?: (props: IZaStageProps) => ReactNode;
  renderOverlay?: (props: IZaOverlayProps) => ReactNode;

  onSave?: (outputs: EditorOutputs) => void;

  customTabs?: ICustomTab[];

  canvasBg?: string;
  qrOptions?: Options;
  elements?: CanvasElement[];
}

export const ZaEditor: FC<IZaEditorProps> = ({
  renderStage,
  renderToolbar,
  renderOverlay,
  customTabs,
  onSave,
  canvasBg,
  qrOptions,
  elements,
}) => {
  return (
    <KonvaEditorProvider
      initialCanvasBg={canvasBg}
      initialQrOptions={qrOptions}
      initialElements={elements}
    >
      <CanvasEditor
        onSave={onSave}
        customTabs={customTabs}
        renderToolbar={renderToolbar}
        renderStage={renderStage}
        renderOverlay={renderOverlay}
      />
    </KonvaEditorProvider>
  );
};
