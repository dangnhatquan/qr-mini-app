import React from "react";
import { KonvaEditorProvider } from "./context/KonvaEditorContext";
import { QREditor } from "./components/QREditor";

const EditUIPage: React.FC = () => {
  return (
    <KonvaEditorProvider>
      <QREditor />
    </KonvaEditorProvider>
  );
};

export default EditUIPage;
