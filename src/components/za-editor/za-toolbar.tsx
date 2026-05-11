import { SHEET_HEIGHT } from "@/pages/edit-ui/utils/constants";
import { ICustomTab } from "./types/editor.types";
import { BottomSheet } from "../bottom-sheet";
import { Tabs } from "zmp-ui";
import { useKonvaEditor } from "@/pages/edit-ui/context/KonvaEditorContext";
import { FC } from "react";

export interface IZaToolbarProps {
  customTabs?: ICustomTab[];
}

export const ZaToolbar: FC<IZaToolbarProps> = ({ customTabs }) => {
  const { setIsCollapsed, setTranslateY } = useKonvaEditor();

  return (
    <BottomSheet
      height={SHEET_HEIGHT}
      onToggle={(isCollapsed, translateY) => {
        setTranslateY(translateY);
        setIsCollapsed(isCollapsed);
      }}
      content={
        <Tabs id="editor-tabs" scrollable className="flex-1 overflow-hidden">
          {customTabs?.map((tab) => {
            return (
              <Tabs.Tab key={tab.key} label={tab.label}>
                {tab.content}
              </Tabs.Tab>
            );
          })}
        </Tabs>
      }
    />
  );
};
