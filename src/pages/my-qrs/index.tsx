import React, { useEffect, useState } from "react";
import { Page, Header, Box, Button, Text, Icon, Spinner, Modal } from "zmp-ui";
import { saveImageToGallery, openShareSheet, showToast } from "zmp-sdk/apis";
import { useNavigate } from "react-router-dom";
import { qrService } from "@/services/qr";
import { createRoute } from "@/utils/routes";
import { getCategoryLabel } from "./utils/functions";
import { QRCard } from "./components/qr-card";
import { QrCode } from "@/types/qr";

const MyQRsPage: React.FC = () => {
  const navigate = useNavigate();
  const [qrs, setQrs] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QrCode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState<string>("");

  const handleCardClick = async (qr: QrCode) => {
    setSelectedQR(qr);
    setModalVisible(true);
    setModalImgSrc("");

    if (qr.previewImage?.path) {
      try {
        const res = await fetch(qr.previewImage.path, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setModalImgSrc(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Load modal image error:", err);
      }
    }
  };

  const handleDownload = async () => {
    if (!modalImgSrc) return;
    try {
      await saveImageToGallery({
        imageBase64Data: modalImgSrc,
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
          imageUrls: [selectedQR.previewImage.path],
        },
      });
    } catch (error) {
      console.error("Share error:", error);
      showToast({ message: "Không thể chia sẻ, vui lòng thử lại" });
    }
  };

  const handleEdit = () => {
    if (!selectedQR) return;
    showToast({ message: "Tính năng đang phát triển" });
  };

  useEffect(() => {
    const fetchQRs = async () => {
      try {
        setLoading(true);
        const data = await qrService.getMyQRs();
        setQrs(data || []);
      } catch (error) {
        console.error("Failed to fetch QRs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRs();
  }, []);

  return (
    <Page className="bg-gray-50">
      <Header title="Danh sách QR" showBackIcon={false} />
      <div className="content">
        {loading ? (
          <Box flex justifyContent="center" alignItems="center" p={10}>
            <Spinner />
          </Box>
        ) : qrs.length > 0 ? (
          <Box p={4}>
            {qrs.map((qr) => (
              <QRCard
                key={qr.id}
                id={qr.id}
                type={qr.type}
                category={qr.category}
                previewUrl={qr.previewImage?.path}
                createdAt={qr.createdAt}
                onClick={() => handleCardClick(qr)}
              />
            ))}
          </Box>
        ) : (
          <Box
            flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={10}
            className="h-[60vh]"
          >
            <div className="bg-white p-8 rounded-full shadow-inner mb-6">
              <Icon icon="zi-more-grid" className="text-gray-200 text-6xl" />
            </div>
            <Text className="text-gray-400 font-medium text-lg">Chưa có mã QR nào</Text>
            <Text className="text-gray-300 text-sm mt-2">Bấm nút bên dưới để tạo mã đầu tiên</Text>
          </Box>
        )}
      </div>

      <Box p={4} className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-8">
        <Button
          fullWidth
          size="large"
          type="highlight"
          onClick={() => navigate(createRoute)}
          prefixIcon={<Icon icon="zi-plus" />}
        >
          Tạo mã QR mới
        </Button>
      </Box>

      <Modal
        visible={modalVisible}
        title={selectedQR ? `Mã QR: ${getCategoryLabel(selectedQR.category)}` : "Chi tiết mã QR"}
        onClose={() => setModalVisible(false)}
        verticalActions
      >
        <Box flex flexDirection="column" alignItems="center" justifyContent="center">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 min-h-[256px] min-w-[256px] flex items-center justify-center">
            {modalImgSrc ? (
              <img src={modalImgSrc} alt="QR Code" className="w-64 h-64 object-contain" />
            ) : (
              <Box flex flexDirection="column" alignItems="center">
                <Spinner />
                <Text size="xxSmall" className="mt-2 text-gray-400">
                  Đang tải mã QR...
                </Text>
              </Box>
            )}
          </div>
          <Text className="mt-6 text-center text-gray-500 text-sm px-4 font-medium">
            Người dùng có thể quét mã này trực tiếp từ màn hình của bạn
          </Text>

          <Box flex flexDirection="row" justifyContent="space-around" className="w-full mt-6 px-4">
            <Box
              flex
              flexDirection="column"
              alignItems="center"
              onClick={handleDownload}
              className="cursor-pointer"
            >
              <div className="bg-gray-100 p-3 rounded-full mb-2">
                <Icon icon="zi-download" className="text-gray-800" />
              </div>
              <Text size="xxSmall" className="text-gray-600 font-medium">
                Tải xuống
              </Text>
            </Box>

            <Box
              flex
              flexDirection="column"
              alignItems="center"
              onClick={handleEdit}
              className="cursor-pointer"
            >
              <div className="bg-gray-100 p-3 rounded-full mb-2">
                <Icon icon="zi-edit-text" className="text-gray-800" />
              </div>
              <Text size="xxSmall" className="text-gray-600 font-medium">
                Tuỳ chỉnh
              </Text>
            </Box>

            <Box
              flex
              flexDirection="column"
              alignItems="center"
              onClick={handleShare}
              className="cursor-pointer"
            >
              <div className="bg-gray-100 p-3 rounded-full mb-2">
                <Icon icon="zi-share-external-1" className="text-gray-800" />
              </div>
              <Text size="xxSmall" className="text-gray-600 font-medium">
                Chia sẻ
              </Text>
            </Box>
          </Box>

          <Button className="mt-6" fullWidth onClick={() => setModalVisible(false)} type="neutral">
            Đóng
          </Button>
        </Box>
      </Modal>
    </Page>
  );
};

export default MyQRsPage;
