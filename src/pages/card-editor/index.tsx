import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showToast } from "zmp-sdk/apis";
import { setString } from "@/utils/storage";
import { CardEditor } from "./components/CardEditor";
import {
  IconAspectRatio,
  IconPolaroid,
  IconSticker,
  IconTexture,
  IconTypography,
} from "@tabler/icons-react";
import { EditorOutputs, useCardStore } from "@/store";
import { cardService } from "@/services/card";
import { uploadFile } from "@/utils/helpers/image";
import { StickerTab } from "../edit-ui/components/StickerTab";
import { Page, Spinner } from "zmp-ui";
import { LayoutTab } from "../edit-ui/components/LayoutTab";
import { TextTab } from "../edit-ui/components/TextTab";
import { ImageTab } from "./components/ImageTab";
import { SizeTab } from "../edit-ui/components/SizeTab";

const CardEditorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCardId = searchParams.get("cardId");
  const navigate = useNavigate();

  const customTabs = [
    {
      key: "layout",
      label: (
        <div className="flex items-center justify-center gap-2">
          <IconTexture className="w-5 h-5" />
          Bố cục
        </div>
      ),
      content: <LayoutTab />,
    },
    {
      key: "text",
      label: (
        <div className="flex items-center justify-center gap-2">
          <IconTypography className="w-5 h-5" />
          Chữ
        </div>
      ),
      content: <TextTab />,
    },
    {
      key: "image",
      label: (
        <div className="flex items-center justify-center gap-2">
          <IconPolaroid className="w-5 h-5" />
          Hình ảnh
        </div>
      ),
      content: <ImageTab />,
    },
    {
      key: "stickers",
      label: (
        <div className="flex items-center justify-center gap-2">
          <IconSticker className="w-5 h-5" />
          Sticker
        </div>
      ),
      content: <StickerTab />,
    },
    {
      key: "size",
      label: (
        <div className="flex items-center justify-center gap-2">
          <IconAspectRatio className="w-5 h-5" />
          Kích thước
        </div>
      ),
      content: <SizeTab />,
    },
  ];

  const handleSave = async (outputs: EditorOutputs) => {
    const { elements, canvasBg, logoFileId, canvasBgFileId, blob, stageSize } = outputs;
    const editorStage = { elements, canvasBg, logoFileId, canvasBgFileId, stageSize };

    try {
      if (!blob) throw new Error("No blob provided");
      const previewFile = await uploadFile(blob);

      let savedId: string;
      if (initialCardId) {
        const updated = await cardService.updateCard(initialCardId, editorStage, previewFile.id);
        savedId = updated.id;
      } else {
        const created = await cardService.createCard(editorStage, previewFile.id);
        savedId = created.id;
      }

      setString("pendingCardId", savedId);
      showToast({ message: "Thiệp đã được lưu!" });
      navigate(-1);
    } catch (error) {
      console.error(error);
      showToast({ message: "Lỗi khi lưu thiệp!" });
    }
  };

  const { card, fetchCard, isFetching } = useCardStore();

  useEffect(() => {
    if (initialCardId) {
      fetchCard(initialCardId!);
    }
  }, [initialCardId, fetchCard]);

  if (isFetching) {
    return (
      <Page className="flex items-center justify-center bg-gray-50">
        <Spinner />
      </Page>
    );
  }

  return <CardEditor onSave={handleSave} customTabs={customTabs} card={card} />;
};

export default CardEditorPage;
