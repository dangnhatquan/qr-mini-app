import React, { FC, useEffect } from "react";
import {
  IconPhoto,
  IconQrcode,
  IconSticker,
  IconTexture,
  IconTypography,
} from "@tabler/icons-react";
import { StylingTab } from "./components/StylingTab";
import { LayoutTab } from "./components/LayoutTab";
import { TextTab } from "./components/TextTab";
import { StickerTab } from "./components/StickerTab";
import { Header, Page, Spinner, useNavigate, useParams } from "zmp-ui";
import { IQRFormValues } from "@/utils/schemas/qr";
import { EditorOutputs, EQRCategory, EQRType, useQRStore } from "@/store";
import { showToast } from "zmp-sdk/apis";
import { QREditor } from "./components/QREditor";
import { TemplateTab } from "./components/TemplateTab";

const EditUIPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedQR, isFetchingSelectedQR, fetchQRDetail, updateQRRecord } = useQRStore();

  useEffect(() => {
    if (id) {
      fetchQRDetail(id);
    }
  }, [id, fetchQRDetail]);

  const customTabs = [
    {
      key: "qr",
      label: (
        <div className="flex items-center justify-center gap-2">
          <IconQrcode className="w-5 h-5" />
          Thiết kế QR
        </div>
      ),
      content: <StylingTab />,
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
      key: "stickers",
      label: (
        <div className="flex items-center justify-center gap-2">
          <IconSticker className="w-5 h-5" />
          Stickers
        </div>
      ),
      content: <StickerTab />,
    },
  ];

  const handleSave = async (outputs: EditorOutputs) => {
    if (!selectedQR || !id) return;

    const data: IQRFormValues = {
      qrType: selectedQR.type as EQRType,
      category: selectedQR.category as EQRCategory,
      ...selectedQR.payload,
    };

    const { qrOptions, elements, canvasBg, blob } = outputs;
    const editorStage = { qrOptions, elements, canvasBg };
    await updateQRRecord(id, data, blob, editorStage);

    showToast({ message: "Đã lưu thay đổi!" });
    navigate(-1);
  };

  if (isFetchingSelectedQR) {
    return (
      <Page className="flex items-center justify-center bg-gray-50">
        <Spinner />
      </Page>
    );
  }

  return (
    <Page>
      <Header title="Tuỳ chỉnh giao diện" />
      <QREditor onSave={handleSave} customTabs={customTabs} selectedQR={selectedQR} />
    </Page>
  );
};

export default EditUIPage;
