import { Accordion } from "@/components/accordion";
import { Box, Button, Input } from "zmp-ui";
import { IconUser, IconPlus, IconLoader } from "@tabler/icons-react";
import { useKonvaEditor } from "../context/KonvaEditorContext";
import {
  BACKGROUND_COLORS,
  COLORS,
  CORNER_DOT_TYPES,
  CORNER_SQUARE_TYPES,
  DOT_TYPES,
  ERROR_CORRECTION_LEVELS,
} from "../utils/constants";
import { chooseImage, getUserInfo } from "zmp-sdk/apis";
import { openSnackbar } from "@/utils/snackbar";
import { ErrorCorrectionLevel, Options } from "qr-code-styling";
import { uploadFile } from "@/utils/helpers/image";
import { useState } from "react";
import { getFullUrl, getErrorMessage } from "@/utils/axios";

export const StylingTab = () => {
  const { qrOptions, setQrOptions, logoFileId, setLogoFileId, sessionId } = useKonvaEditor();
  const [uploading, setUploading] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("dots");

  const updateQrOption = (category: keyof Options, key: string, value: string | number) => {
    setQrOptions((prev: Options) => ({
      ...prev,
      [category]: {
        ...(prev[category] as Record<string, unknown>),
        [key]: value,
      },
    }));
  };

  const handleUseAvatar = async () => {
    try {
      setUploading(true);
      const { userInfo } = await getUserInfo({
        autoRequestPermission: false,
        avatarType: "normal",
      });
      if (userInfo.avatar) {
        let finalPath = userInfo.avatar;

        const response = await fetch(finalPath);
        const blob = await response.blob();
        const file = await uploadFile(blob, sessionId);

        setQrOptions((prev) => ({
          ...prev,
          image: getFullUrl(file.path),
        }));
        setLogoFileId(file.id);
        openSnackbar({ text: "Đã thêm Avatar", type: "success" });
      }
    } catch (_err) {
      console.error("Use avatar error:", _err);
      openSnackbar({ text: getErrorMessage(_err, "Lỗi lấy thông tin"), type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleUploadLogo = async () => {
    try {
      const { filePaths } = await chooseImage({ count: 1 });
      if (filePaths && filePaths.length > 0) {
        setUploading(true);
        const path = filePaths[0];
        const response = await fetch(path);
        const blob = await response.blob();
        const file = await uploadFile(blob, sessionId);

        setQrOptions((prev) => ({
          ...prev,
          image: getFullUrl(file.path),
        }));
        setLogoFileId(file.id);
        openSnackbar({ text: "Đã thêm Logo", type: "success" });
      }
    } catch (_err) {
      console.error("Upload logo error:", _err);
      openSnackbar({ text: getErrorMessage(_err, "Lỗi tải ảnh"), type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box className="overflow-y-auto pb-20">
      <Accordion
        title="Tùy chỉnh điểm ảnh"
        isOpen={openSection === "dots"}
        onClick={() => setOpenSection(openSection === "dots" ? null : "dots")}
      >
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Màu sắc</div>
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {COLORS.map((c) => (
            <div
              key={c}
              onClick={() => updateQrOption("dotsOptions", "color", c)}
              className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer border"
              style={{
                backgroundColor: c,
                borderColor: qrOptions.dotsOptions?.color === c ? "#3b82f6" : "#e2e8f0",
              }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-500 mb-2 mt-3 uppercase tracking-wider">Kiểu chấm</div>
        <div className="grid grid-cols-2 gap-2">
          {DOT_TYPES.map((t) => (
            <div
              key={t}
              onClick={() => updateQrOption("dotsOptions", "type", t)}
              className={`px-3 py-2 rounded-lg border text-xs text-center cursor-pointer capitalize ${qrOptions.dotsOptions?.type === t ? "bg-blue-50 border-blue-500 text-blue-600 font-medium" : "bg-white border-gray-200 text-gray-600"}`}
            >
              {t.replace("-", " ")}
            </div>
          ))}
        </div>
      </Accordion>
      <Accordion
        title="Tùy chỉnh khung mắt QR"
        isOpen={openSection === "cornersSquare"}
        onClick={() => setOpenSection(openSection === "cornersSquare" ? null : "cornersSquare")}
      >
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Màu sắc</div>
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {COLORS.map((c) => (
            <div
              key={c}
              onClick={() => updateQrOption("cornersSquareOptions", "color", c)}
              className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer border"
              style={{
                backgroundColor: c,
                borderColor: qrOptions.cornersSquareOptions?.color === c ? "#3b82f6" : "#e2e8f0",
              }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-500 mb-2 mt-3 uppercase tracking-wider">
          Kiểu khung mắt
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CORNER_SQUARE_TYPES.map((t) => (
            <div
              key={t}
              onClick={() => updateQrOption("cornersSquareOptions", "type", t)}
              className={`px-3 py-2 rounded-lg border text-xs text-center cursor-pointer capitalize ${qrOptions.cornersSquareOptions?.type === t ? "bg-blue-50 border-blue-500 text-blue-600 font-medium" : "bg-white border-gray-200 text-gray-600"}`}
            >
              {t.replace("-", " ")}
            </div>
          ))}
        </div>
      </Accordion>
      <Accordion
        title="Tùy chỉnh nhân mắt QR"
        isOpen={openSection === "cornersDot"}
        onClick={() => setOpenSection(openSection === "cornersDot" ? null : "cornersDot")}
      >
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Màu sắc</div>
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {COLORS.map((c) => (
            <div
              key={c}
              onClick={() => updateQrOption("cornersDotOptions", "color", c)}
              className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer border"
              style={{
                backgroundColor: c,
                borderColor: qrOptions.cornersDotOptions?.color === c ? "#3b82f6" : "#e2e8f0",
              }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-500 mb-2 mt-3 uppercase tracking-wider">
          Kiểu nhãn mắt
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CORNER_DOT_TYPES.map((t) => (
            <div
              key={t}
              onClick={() => updateQrOption("cornersDotOptions", "type", t)}
              className={`px-3 py-2 rounded-lg border text-xs text-center cursor-pointer capitalize ${qrOptions.cornersDotOptions?.type === t ? "bg-blue-50 border-blue-500 text-blue-600 font-medium" : "bg-white border-gray-200 text-gray-600"}`}
            >
              {t}
            </div>
          ))}
        </div>
      </Accordion>
      <Accordion
        title="Màu nền mã QR"
        isOpen={openSection === "bg"}
        onClick={() => setOpenSection(openSection === "bg" ? null : "bg")}
      >
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Màu nền mã QR</div>
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <div
            onClick={() => updateQrOption("backgroundOptions", "color", "transparent")}
            className={`w-8 h-8 rounded-full flex-shrink-0 cursor-pointer border flex items-center justify-center bg-white ${qrOptions.backgroundOptions?.color === "transparent" ? "border-blue-500" : "border-gray-200"}`}
          >
            <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
          </div>
          {BACKGROUND_COLORS.map((c) => (
            <div
              key={c.color}
              onClick={() => updateQrOption("backgroundOptions", "color", c.color)}
              className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer border"
              style={{
                backgroundColor: c.color,
                borderColor: qrOptions.backgroundOptions?.color === c.color ? "#3b82f6" : "#e2e8f0",
              }}
            />
          ))}
        </div>
      </Accordion>
      <Accordion
        title="Tùy chỉnh Logo"
        isOpen={openSection === "image"}
        onClick={() => setOpenSection(openSection === "image" ? null : "image")}
      >
        <div className="flex flex-col gap-4">
          {uploading ? (
            <div className="w-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={handleUseAvatar} prefixIcon={<IconUser />}>
                Dùng Avatar
              </Button>
              <Button
                variant="secondary"
                fullWidth
                prefixIcon={<IconPlus />}
                onClick={handleUploadLogo}
              >
                Tải Logo lên
              </Button>
            </div>
          )}
          {qrOptions.image && (
            <Button
              size="small"
              type="danger"
              variant="secondary"
              onClick={async () => {
                console.warn("🗑️ Deleting logo. LogoFileId:", logoFileId);
                setQrOptions((prev) => ({ ...prev, image: "" }));
                setLogoFileId(null);
              }}
            >
              Xoá Logo
            </Button>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Khoảng cách Logo (Margin)
            </span>
            <Input
              type="number"
              value={String(qrOptions.imageOptions?.margin || 0)}
              onChange={(e) => updateQrOption("imageOptions", "margin", Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </Accordion>
      <Accordion
        title="Mức độ sửa lỗi"
        isOpen={openSection === "errorCorrection"}
        onClick={() => setOpenSection(openSection === "errorCorrection" ? null : "errorCorrection")}
      >
        <div className="text-xs text-gray-500 mb-3 leading-relaxed">
          Mức độ sửa lỗi càng cao thì QR càng có khả năng khôi phục thông tin nếu bị hư hỏng hoặc bị
          che khuất bởi logo, nhưng bù lại mã QR sẽ trở nên phức tạp hơn (nhiều điểm ảnh hơn).
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ERROR_CORRECTION_LEVELS.map((level) => (
            <div
              key={level.value}
              onClick={() =>
                setQrOptions((prev) => ({
                  ...prev,
                  qrOptions: {
                    ...prev.qrOptions,
                    errorCorrectionLevel: level.value as ErrorCorrectionLevel,
                  },
                }))
              }
              className={`px-3 py-2 rounded-lg border text-xs text-center cursor-pointer font-medium transition-all ${
                qrOptions?.qrOptions?.errorCorrectionLevel === level.value
                  ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {level.label}
            </div>
          ))}
        </div>
      </Accordion>
    </Box>
  );
};
