import { SHEET_HEIGHT } from "@/pages/edit-ui/utils/constants";
import { ICustomTab } from "./types/editor.types";
import { BottomSheet } from "../bottom-sheet";
import { Tabs } from "zmp-ui";
import { useKonvaEditor } from "@/pages/edit-ui/context/KonvaEditorContext";
import { FC, useState } from "react";

export interface IZaToolbarProps {
  customTabs?: ICustomTab[];
}

export const ZaToolbar: FC<IZaToolbarProps> = ({ customTabs }) => {
  const { setIsCollapsed, setTranslateY } = useKonvaEditor();
  const defaultTabKey = customTabs?.[0]?.key || "";
  const [activeTab, setActiveTab] = useState(defaultTabKey);
  const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({
    [defaultTabKey]: true,
  });

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setVisitedTabs((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <BottomSheet
      height={SHEET_HEIGHT}
      onToggle={(isCollapsed, translateY) => {
        setTranslateY(translateY);
        setIsCollapsed(isCollapsed);
      }}
      content={
        <Tabs
          id="editor-tabs"
          scrollable
          className="flex-1 overflow-hidden"
          activeKey={activeTab}
          onChange={handleTabChange}
        >
          {customTabs?.map((tab) => {
            const isVisited = visitedTabs[tab.key];
            return (
              <Tabs.Tab key={tab.key} label={tab.label}>
                <div style={{ height: SHEET_HEIGHT - 44, overflowY: "auto" }}>
                  {isVisited ? tab.content : null}
                </div>
              </Tabs.Tab>
            );
          })}
        </Tabs>
      }
    />
  );
};
