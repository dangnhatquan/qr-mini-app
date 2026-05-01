import { Button, Icon, useParams } from "zmp-ui";
import { useKonvaEditor } from "../context/KonvaEditorContext";
import { saveImageToGallery, showToast } from "zmp-sdk/apis";

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
            showToast({ message: "Lưu ảnh thành công!" });
          } else {
            const link = document.createElement("a");
            link.download = `qr-code-${id || "design"}.png`;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast({ message: "Đã tải ảnh về máy!" });
          }
        } catch {
          const link = document.createElement("a");
          link.download = `qr-code-${id || "design"}.png`;
          link.href = uri;
          link.click();
          showToast({ message: "Đã tải ảnh về máy!" });
        }
      }
    }, 100);
  };

  return (
    <Button fullWidth onClick={handleDownload} prefixIcon={<Icon icon="zi-download" />}>
      Tải xuống thành phẩm
    </Button>
  );
};
