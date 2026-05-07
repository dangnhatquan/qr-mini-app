import { EQRCategory, QrCode } from "@/store";
import { getFullUrl } from "@/utils/axios";
import { Box, Button, Modal, useNavigate } from "zmp-ui";
import {
  IconDownload,
  IconEdit,
  IconEye,
  IconGridDots,
  IconPalette,
  IconShare,
} from "@tabler/icons-react";
import { Divider } from "@/components/divider";
import { openShareSheet, saveImageToGallery, showToast } from "zmp-sdk/apis";
import { createRoute } from "@/utils/routes";
import { getCategoryLabel } from "@/pages/my-qrs/utils/functions";

export interface IQRModalProps {
  selectedQR?: QrCode | null;
  modalVisible: boolean;
  onToggle?: () => void;
}

export const QRModal = ({ modalVisible, onToggle, selectedQR }: IQRModalProps) => {
  const navigate = useNavigate();

  const handleToggleModal = () => {
    onToggle?.();
  };

  const handleDownload = async () => {
    if (!selectedQR?.previewImage?.path) return;
    try {
      await saveImageToGallery({
        imageBase64Data: getFullUrl(selectedQR.previewImage?.path),
      });
      showToast({ message: "Lưu ảnh thành công" });
    } catch (error) {
      console.error("Save image error:", error);
      showToast({ message: "Lưu ảnh thất bại hoặc bị từ chối quyền" });
    }
  };

  const handleShare = async () => {
    if (!selectedQR?.previewImage?.path) return;
    try {
      await openShareSheet({
        type: "image",
        data: {
          imageUrls: [getFullUrl(selectedQR.previewImage?.path)],
        },
      });
    } catch (error) {
      console.error("Share error:", error);
      showToast({ message: "Không thể chia sẻ, vui lòng thử lại" });
    }
  };

  const handleEdit = () => {
    if (!selectedQR) return;
    handleToggleModal?.();
    navigate(`/edit-ui/${selectedQR.id}`);
  };

  const handleEditInfo = () => {
    if (!selectedQR) return;
    handleToggleModal?.();
    navigate(`${createRoute}?id=${selectedQR.id}`);
  };

  const handleView = () => {
    if (!selectedQR) return;
    handleToggleModal?.();
    if (selectedQR.category === EQRCategory.GREETING) {
      navigate(`/greetings/${selectedQR.id}`);
    } else {
      navigate(`/vcards/${selectedQR.id}`);
    }
  };

  return (
    <Modal
      visible={modalVisible}
      title={selectedQR ? `${getCategoryLabel(selectedQR.category)}` : "Chi tiết mã QR"}
      verticalActions
    >
      <Box flex flexDirection="column" alignItems="center" justifyContent="center">
        <div className="relative w-full aspect-[350/450] bg-gray-50 rounded-2xl border border-gray-100 shadow-inner flex items-center justify-center overflow-hidden relative">
          {selectedQR?.previewImage?.path ? (
            <img
              src={getFullUrl(selectedQR.previewImage.path)}
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full animate-pulse flex flex-col items-center justify-center gap-4">
              <IconGridDots size={48} className="text-gray-200" />
              <div className="w-1/3 h-2 bg-gray-200 rounded-full opacity-50" />
            </div>
          )}
          {selectedQR?.type === "dynamic" && (
            <div
              className="absolute right-2 bottom-2 cursor-pointer bg-white rounded-full p-3 shadow-xl"
              onClick={handleView}
            >
              <IconEye size={20} className="text-gray-800 cursor-pointer" />
            </div>
          )}
          <div
            className="absolute left-2 bottom-2 cursor-pointer bg-white rounded-full p-3 shadow-xl"
            onClick={handleEdit}
          >
            <IconPalette size={20} className="text-gray-800 cursor-pointer" />
          </div>
        </div>
        <div className="flex justify-between items-center w-full mt-6 border py-2 px-4 rounded-xl">
          <div className="flex justify-center items-center gap-2 text-sm" onClick={handleDownload}>
            <IconDownload size={12} className="text-gray-800" /> Tải xuống
          </div>
          <Divider direction="vertical" />
          <div className="flex justify-center items-center gap-2 text-sm" onClick={handleEditInfo}>
            <IconEdit size={12} className="text-gray-800" /> Thông tin
          </div>
          <Divider direction="vertical" />
          <div className="flex justify-center items-center gap-2  text-sm" onClick={handleShare}>
            <IconShare size={12} className="text-gray-800" /> Chia sẻ
          </div>
        </div>
        <Button className="mt-6" size="small" fullWidth onClick={handleToggleModal} type="neutral">
          Đóng
        </Button>
      </Box>
    </Modal>
  );
};
