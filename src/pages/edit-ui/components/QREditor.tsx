import { ZaEditor } from "@/components/za-editor/za-editor";
import { CanvasElement, EditorOutputs, QrCode } from "@/store";
import { useMemo } from "react";
import { generateQRPayload } from "@/utils/helpers/qr";
import { ICustomTab } from "@/components/za-editor";

export interface IQREditorProps {
  customTabs?: ICustomTab[];
  onSave?: (outputs: EditorOutputs) => void;
  selectedQR?: QrCode | null;
}

export const QREditor = ({ customTabs, onSave, selectedQR }: IQREditorProps) => {
  const elements = useMemo<CanvasElement[]>(() => {
    const baseElements = selectedQR?.editorStage?.elements ?? [];
    return baseElements;
  }, [selectedQR]);

  const canvasBg = useMemo(() => {
    return selectedQR?.editorStage?.canvasBg ?? "";
  }, [selectedQR]);

  const qrOptions = useMemo(() => {
    const textData = selectedQR ? generateQRPayload(selectedQR) : "";
    const baseOptions = selectedQR?.editorStage?.qrOptions ?? {};
    return {
      ...baseOptions,
      data: textData,
    };
  }, [selectedQR]);

  return (
    <ZaEditor
      customTabs={customTabs}
      onSave={onSave}
      canvasBg={canvasBg}
      qrOptions={qrOptions}
      elements={elements}
    />
  );
};
