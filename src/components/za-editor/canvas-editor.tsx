import { FC, ReactNode } from "react";
import { ICustomTab } from "./types/editor.types";
import { IZaStageProps, ZaStage } from "./za-stage";
import { SHEET_HEIGHT } from "@/pages/edit-ui/utils/constants";
import { IZaToolbarProps, ZaToolbar } from "./za-toolbar";
import { IZaOverlayProps, ZaOverlay } from "./za-overlay";
import { EditorOutputs } from "@/store";

export interface ICanvasEditorProps {
  renderToolbar?: (props: IZaToolbarProps) => ReactNode;
  renderStage?: (props: IZaStageProps) => ReactNode;
  renderOverlay?: (props: IZaOverlayProps) => ReactNode;

  customTabs?: ICustomTab[];

  onSave?: (outputs: EditorOutputs) => void;
}

export const CanvasEditor: FC<ICanvasEditorProps> = ({
  renderStage,
  renderToolbar,
  renderOverlay,

  customTabs,
  onSave,
}: ICanvasEditorProps) => {
  return (
    <div>
      {renderOverlay?.({ onSave }) ?? <ZaOverlay onSave={onSave} />}
      {renderStage?.({ toolbarHeight: SHEET_HEIGHT }) ?? <ZaStage toolbarHeight={SHEET_HEIGHT} />}
      {renderToolbar?.({ customTabs }) ?? <ZaToolbar customTabs={customTabs} />}
    </div>
  );
};
