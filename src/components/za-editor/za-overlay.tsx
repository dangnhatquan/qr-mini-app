import { EditorOutputs } from "@/store";
import { IconCheck, IconRotate } from "@tabler/icons-react";
import { useEditor } from "./hooks/useEditor";

export interface IZaOverlayProps {
  onDiscard?: () => void;
  onSave?: (outputs: EditorOutputs) => void;
}

export const ZaOverlay = ({ onDiscard, onSave }: IZaOverlayProps) => {
  const { handleSave, handleDiscard } = useEditor();

  const handleSaveClick = () => {
    handleSave(onSave!);
  };

  const handleResetClick = () => {
    handleDiscard();
    onDiscard?.();
  };

  return (
    <div>
      <div className="w-full px-4 flex justify-between z-40 absolute top-24">
        <div
          onClick={handleResetClick}
          id="reset-button"
          className="cursor-pointer bg-white shadow-xl border border-gray-100 !rounded-full w-10 h-10 flex items-center justify-center p-0"
        >
          <IconRotate className="text-black font-bold" size={20} />
        </div>
        <div
          onClick={handleSaveClick}
          id="save-button"
          className="cursor-pointer bg-blue-500 text-white shadow-xl !rounded-full w-10 h-10 flex items-center justify-center p-0"
        >
          <IconCheck className="font-bold" size={20} />
        </div>
      </div>
    </div>
  );
};
