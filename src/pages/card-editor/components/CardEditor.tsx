import { ZaEditor } from "@/components/za-editor/za-editor";
import { Card, EditorOutputs } from "@/store";
import { ICustomTab } from "@/components/za-editor";

import { DEFAULT_EDITOR_STAGE } from "@/utils/constants/qr";

export interface ICardEditorProps {
  customTabs?: ICustomTab[];
  onSave?: (outputs: EditorOutputs) => void;
  card?: Card | null;
}

export const CardEditor = ({ customTabs, onSave, card }: ICardEditorProps) => {
  return (
    <ZaEditor
      customTabs={customTabs}
      onSave={onSave}
      canvasBg={card?.editorStage?.canvasBg || DEFAULT_EDITOR_STAGE.canvasBg}
      canvasBgFileId={card?.editorStage?.canvasBgFileId}
      elements={card?.editorStage?.elements || []}
      stageSize={card?.editorStage?.stageSize}
      logoFileId={card?.editorStage?.logoFileId}
    />
  );
};
