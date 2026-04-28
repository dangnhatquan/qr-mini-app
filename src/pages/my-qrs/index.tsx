import React, { useEffect, useState, useRef } from "react";
import { Page, Header, Box, Button, Text, Icon, Spinner, Modal } from "zmp-ui";
import { saveImageToGallery, openShareSheet, showToast } from "zmp-sdk/apis";
import { useNavigate } from "react-router-dom";
import { qrService } from "@/services/qr";
import { createRoute } from "@/utils/routes";
import { getCategoryLabel } from "./utils/functions";
import { QRCard } from "./components/qr-card";
import { QrCode } from "@/types/qr";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const MyQRsPage: React.FC = () => {
  const navigate = useNavigate();
  const [qrs, setQrs] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QrCode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null);

  // Swipe to delete states
  const [swipeState, setSwipeState] = useState<{ [id: string]: number }>({});
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteConfirmQR, setDeleteConfirmQR] = useState<QrCode | null>(null);

  const hasAnimatedIn = useRef(false);

  useGSAP(() => {
    if (qrs.length > 0 && !hasAnimatedIn.current) {
      hasAnimatedIn.current = true;
      gsap.fromTo(
        ".qr-card-wrapper",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
          clearProps: "y,opacity",
        },
      );
    }
  }, [qrs]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent, id: string, index: number) => {
    // Chỉ cho phép vuốt thẻ đang mở rộng hoặc thẻ cuối cùng
    if (expandedId !== id && index !== qrs.length - 1) return;

    if (!touchStart.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStart.current.x;
    const diffY = currentY - touchStart.current.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        // Ghi đè toàn bộ state để đảm bảo chỉ có 1 thẻ được vuốt ra tại 1 thời điểm
        setSwipeState({ [id]: Math.max(diffX, -90) });
      } else {
        setSwipeState({ [id]: Math.min(diffX, 0) });
      }
    }
  };

  const handleTouchEnd = (id: string, index: number) => {
    setIsDragging(false);
    if (expandedId !== id && index !== qrs.length - 1) return;

    if (!touchStart.current) return;
    const diffX = swipeState[id] || 0;
    if (diffX < -50) {
      setSwipeState({ [id]: -90 });
    } else {
      setSwipeState({});
    }
    touchStart.current = null;
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmQR) return;
    try {
      // Bỏ setLoading(true) để không unmount cả danh sách gây mất mượt
      await qrService.deleteQR(deleteConfirmQR.id);

      const cardId = deleteConfirmQR.id;
      setDeleteConfirmQR(null);
      setSwipeState({});
      if (expandedId === cardId) setExpandedId(null);

      // Hiệu ứng GSAP rút thẻ ra khỏi danh sách
      const cardElement = document.getElementById(`qr-card-wrapper-${cardId}`);
      if (cardElement) {
        gsap.to(cardElement, {
          x: -window.innerWidth,
          opacity: 0,
          height: 0,
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            setQrs((prev) => prev.filter((q) => q.id !== cardId));
            showToast({ message: "Xoá mã QR thành công" });
          },
        });
      } else {
        setQrs((prev) => prev.filter((q) => q.id !== cardId));
        showToast({ message: "Xoá mã QR thành công" });
      }
    } catch (error) {
      console.error(error);
      showToast({ message: "Lỗi khi xoá mã QR" });
    }
  };

  const handleCardClick = async (qr: QrCode, index: number) => {
    if (expandedId !== qr.id && index !== qrs.length - 1) {
      setExpandedId(qr.id);
      return;
    }

    setExpandedId(qr.id);
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
    setModalVisible(false);
    navigate(`/edit-ui/${selectedQR.id}`);
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

  const expandedIndex = expandedId ? qrs.findIndex((q) => q.id === expandedId) : -1;

  return (
    <Page className="bg-gray-50">
      <Header title="Danh sách QR" showBackIcon={false} />
      <div className="content relative">
        {loading ? (
          <Box flex justifyContent="center" alignItems="center" p={10}>
            <Spinner />
          </Box>
        ) : qrs.length > 0 ? (
          <Box p={4} className="pb-40" ref={container}>
            {qrs.map((qr, index) => (
              <div
                key={qr.id}
                id={`qr-card-wrapper-${qr.id}`}
                className="qr-card-wrapper transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden"
                style={{
                  marginTop: index === 0 ? "0px" : "-85px",
                  position: "relative",
                  zIndex: index,
                  transform:
                    expandedIndex !== -1 && index > expandedIndex
                      ? "translateY(105px)"
                      : "translateY(0px)",
                }}
              >
                <div
                  className="absolute inset-0 bg-red-500 rounded-2xl flex items-center justify-end pr-6 text-white"
                  style={{ zIndex: 0 }}
                  onClick={() => setDeleteConfirmQR(qr)}
                >
                  <Icon icon="zi-delete" className="text-2xl" />
                </div>
                <div
                  className="relative z-10 w-full h-full rounded-2xl"
                  style={{
                    transform: `translateX(${swipeState[qr.id] || 0}px)`,
                    transition: isDragging ? "none" : "transform 0.3s ease-out",
                  }}
                  onTouchStart={(e) => handleTouchStart(e)}
                  onTouchMove={(e) => handleTouchMove(e, qr.id, index)}
                  onTouchEnd={() => handleTouchEnd(qr.id, index)}
                >
                  <QRCard
                    id={qr.id}
                    type={qr.type}
                    category={qr.category}
                    previewUrl={qr.previewImage?.path}
                    createdAt={qr.createdAt}
                    onClick={() => {
                      if (swipeState[qr.id] === -90) {
                        setSwipeState((prev) => ({ ...prev, [qr.id]: 0 }));
                      } else {
                        handleCardClick(qr, index);
                      }
                    }}
                  />
                </div>
              </div>
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

      <Box
        p={4}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-8 z-50"
      >
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
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 w-full h-auto flex items-center justify-center">
            {modalImgSrc ? (
              <img src={modalImgSrc} alt="QR Code" className="w-full h-full object-contain" />
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
            Bạn có thể quét mã này trực tiếp bằng Zalo
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

      <Modal
        visible={!!deleteConfirmQR}
        title="Xác nhận xoá"
        description="Bạn có chắc chắn muốn xoá mã QR này không? Thao tác này không thể hoàn tác."
        onClose={() => setDeleteConfirmQR(null)}
        actions={[
          { text: "Huỷ", close: true, onClick: () => setDeleteConfirmQR(null) },
          { text: "Xoá", danger: true, onClick: handleDeleteConfirm },
        ]}
      />
    </Page>
  );
};

export default MyQRsPage;
