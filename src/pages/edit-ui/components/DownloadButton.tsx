import { Button } from "zmp-ui";
import { useParams } from "react-router-dom";
import { IconDownload } from "@tabler/icons-react";
import { useKonvaEditor } from "../context/KonvaEditorContext";
import { saveImageToGallery } from "zmp-sdk/apis";
import { openSnackbar } from "@/utils/snackbar";

export const DownloadButton = () => {
  const { id } = useParams();

  const { stageRef, mainGroupRef, setSelectedId } = useKonvaEditor();

  const handleDownload = async () => {
    setSelectedId(null);
    setTimeout(async () => {
      const stage = stageRef.current;
      if (mainGroupRef.current && stage) {
        const oldScale = stage.scaleX();
        const oldPos = stage.position();

        stage.scale({ x: 1, y: 1 });
        stage.position({ x: oldPos.x, y: oldPos.y });
        stage.batchDraw();

        const box = mainGroupRef.current.getClientRect({ relativeTo: stage.getLayer() });

        const uri = stage.toDataURL({
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          pixelRatio: 3,
          quality: 1.0,
          mimeType: "image/png",
        });

        stage.scale({ x: oldScale, y: oldScale });
        stage.position(oldPos);
        stage.batchDraw();

        try {
          const isZalo =
            (window as unknown as { ZaloJavaScriptInterface?: unknown }).ZaloJavaScriptInterface ||
            navigator.userAgent.toLocaleLowerCase().includes("zalo");

          if (isZalo) {
            await saveImageToGallery({ imageBase64Data: uri });
            openSnackbar({ text: "Lưu ảnh thành công!", type: "success" });
          } else {
            const link = document.createElement("a");
            link.download = `qr-code-${id || "design"}.png`;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            openSnackbar({ text: "Đã tải ảnh về máy!", type: "success" });
          }
        } catch {
          const link = document.createElement("a");
          link.download = `qr-code-${id || "design"}.png`;
          link.href = uri;
          link.click();
          openSnackbar({ text: "Đã tải ảnh về máy!", type: "success" });
        }
      }
    }, 100);
  };

  return (
    <Button fullWidth onClick={handleDownload} prefixIcon={<IconDownload />}>
      Tải xuống thành phẩm
    </Button>
  );
};
