import React from "react";
import { CardEditorProvider } from "./context/CardEditorContext";
import { CardEditorCanvas } from "./components/CardEditorCanvas";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showToast } from "zmp-sdk/apis";
import { setString } from "@/utils/storage";

const CardEditorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCardId = searchParams.get("cardId");
  const navigate = useNavigate();

  const handleSaved = (cardId: string) => {
    setString("pendingCardId", cardId);
    showToast({ message: "Thiệp đã được lưu!" });
    navigate(-1);
  };

  return (
    <CardEditorProvider>
      <CardEditorCanvas onSaved={handleSaved} initialCardId={initialCardId} />
    </CardEditorProvider>
  );
};

export default CardEditorPage;
