import { FC, ReactNode } from "react";
import { ICustomTab } from "./types/editor.types";
import { IZaStageProps, ZaStage } from "./za-stage";
import { SHEET_HEIGHT } from "@/pages/edit-ui/utils/constants";
import { IZaToolbarProps, ZaToolbar } from "./za-toolbar";
import { IZaOverlayProps } from "./za-overlay";
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
  customTabs,
  onSave,
}: ICanvasEditorProps) => {
  return (
    <div>
      {renderStage?.({ toolbarHeight: SHEET_HEIGHT, onSave }) ?? (
        <ZaStage toolbarHeight={SHEET_HEIGHT} onSave={onSave} />
      )}
      {renderToolbar?.({ customTabs }) ?? <ZaToolbar customTabs={customTabs} />}
    </div>
  );
};
