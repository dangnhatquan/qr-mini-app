import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showToast } from "zmp-sdk/apis";
import { storage } from "@/utils/storage";
import { CardEditor } from "./components/CardEditor";
import {
  IconAspectRatio,
  IconPhoto,
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
import { TemplateTab } from "../edit-ui/components/TemplateTab";

const CardEditorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCardId = searchParams.get("cardId");
  const navigate = useNavigate();

  const customTabs = [
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
    {
      key: "template",
      label: (
        <div className="flex items-center justify-center gap-2">
          <IconPhoto className="w-5 h-5" />
          Template
        </div>
      ),
      content: <TemplateTab />,
    },
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
      key: "text",
      label: (
        <div className="flex items-center justify-center gap-2">
          <IconTypography className="w-5 h-5" />
          Chữ
        </div>
      ),
      content: <TextTab />,
    },
  ];

  const handleSave = async (outputs: EditorOutputs) => {
    const { elements, canvasBg, logoFileId, canvasBgFileId, blob, stageSize, sessionId } = outputs;
    const editorStage = { elements, canvasBg, logoFileId, canvasBgFileId, stageSize };

    try {
      if (!blob) throw new Error("No blob provided");
      const previewFile = await uploadFile(blob, sessionId);

      let savedId: string;
      if (initialCardId) {
        const updated = await cardService.updateCard(
          initialCardId,
          editorStage,
          previewFile.id,
          sessionId,
        );
        savedId = updated.id;
      } else {
        const created = await cardService.createCard(editorStage, previewFile.id, sessionId);
        savedId = created.id;
      }

      storage.setItem("pendingCardId", savedId);
      showToast({ message: "Thiệp đã được lưu!" });
      navigate(-1);
    } catch (error) {
      console.error(error);
      showToast({ message: "Lỗi khi lưu thiệp!" });
    }
  };

  const { card, fetchCard, isFetching, clearCard } = useCardStore();

  useEffect(() => {
    return () => {
      clearCard();
    };
  }, [clearCard]);

  useEffect(() => {
    if (initialCardId) {
      fetchCard(initialCardId!);
    } else {
      if (card) clearCard();
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
