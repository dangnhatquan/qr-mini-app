import React, { useEffect, useState, useRef } from "react";
import { Page, Box, Button, Text, Icon, Spinner, Modal } from "zmp-ui";
import { saveImageToGallery, openShareSheet, showToast } from "zmp-sdk/apis";
import { useNavigate } from "react-router-dom";
import { qrService } from "@/services/qr";
import { createRoute } from "@/utils/routes";
import { getCategoryLabel } from "./utils/functions";
import { QRCard } from "./components/qr-card";
import { EQRCategory, QrCode } from "@/types/qr";
import "./styles.scss";
import { Image } from "@/components/image";

const MyQRsPage: React.FC = () => {
  const navigate = useNavigate();
  const [qrs, setQrs] = useState<QrCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QrCode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null!);

  const [swipeState, setSwipeState] = useState<{ [id: string]: number }>({});
  const touchStart = useRef<{ x: number; y: number; val: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteConfirmQR, setDeleteConfirmQR] = useState<QrCode | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const ptrStart = useRef<{ y: number; val: number; isPulling: boolean } | null>(null);

  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (qrs.length > 0 && isInitialRender) {
      const timer = setTimeout(() => setIsInitialRender(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [qrs, isInitialRender]);

  const fetchQRs = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const data = await qrService.getMyQRs();
      setQrs(data || []);
    } catch (error) {
      console.error("Failed to fetch QRs:", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchQRs();
    })();
  }, []);

  const handlePtrStart = (e: React.TouchEvent) => {
    const pageContent = document.querySelector(".zaui-page-content") || document.documentElement;
    if (pageContent.scrollTop <= 0) {
      ptrStart.current = { y: e.touches[0].clientY, val: 0, isPulling: false };
    }
  };

  const handlePtrMove = (e: React.TouchEvent) => {
    if (!ptrStart.current || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diffY = currentY - ptrStart.current.y;

    if (diffY > 0) {
      ptrStart.current.isPulling = true;
      let val = diffY * 0.4;
      if (val > 80) val = 80;
      ptrStart.current.val = val;

      const ptrEl = document.getElementById("ptr-wrapper");
      if (ptrEl) ptrEl.style.transform = `translate3d(0, ${val}px, 0)`;

      const spinnerEl = document.getElementById("ptr-spinner");
      if (spinnerEl) {
        spinnerEl.style.transform = `translate3d(0, ${val - 40}px, 0) rotate(${val * 5}deg)`;
        spinnerEl.style.opacity = `${val / 80}`;
      }
    }
  };

  const handlePtrEnd = async () => {
    if (!ptrStart.current || !ptrStart.current.isPulling || isRefreshing) {
      ptrStart.current = null;
      return;
    }
    const val = ptrStart.current.val;
    const ptrEl = document.getElementById("ptr-wrapper");
    const spinnerEl = document.getElementById("ptr-spinner");

    if (val >= 60) {
      setIsRefreshing(true);
      if (ptrEl) {
        ptrEl.style.transition = "transform 0.3s ease-out";
        ptrEl.style.transform = `translate3d(0, 60px, 0)`;
      }
      if (spinnerEl) {
        spinnerEl.style.transition = "all 0.3s ease-out";
        spinnerEl.style.transform = `translate3d(0, 20px, 0) rotate(360deg)`;
        spinnerEl.style.opacity = `1`;
        spinnerEl.classList.add("animate-spin");
      }

      await fetchQRs(true);
      setIsRefreshing(false);
      showToast({ message: "Đã làm mới danh sách" });
    }

    if (ptrEl) {
      ptrEl.style.transition = "transform 0.3s ease-out";
      ptrEl.style.transform = `translate3d(0, 0, 0)`;
    }
    if (spinnerEl) {
      spinnerEl.style.transition = "all 0.3s ease-out";
      spinnerEl.style.transform = `translate3d(0, -40px, 0)`;
      spinnerEl.style.opacity = `0`;
      spinnerEl.classList.remove("animate-spin");
    }

    setTimeout(() => {
      if (ptrEl) ptrEl.style.transition = "";
      if (spinnerEl) spinnerEl.style.transition = "";
    }, 300);

    ptrStart.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, val: 0 };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent, id: string, index: number) => {
    if (expandedId !== id && index !== qrs.length - 1) return;

    if (!touchStart.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStart.current.x;
    const diffY = currentY - touchStart.current.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      const val = diffX < 0 ? Math.max(diffX, -90) : Math.min(diffX, 0);
      touchStart.current.val = val;

      const el = document.getElementById(`swipe-content-${id}`);
      if (el) {
        el.style.transform = `translate3d(${val}px, 0, 0)`;
      }
    }
  };

  const handleTouchEnd = (id: string, index: number) => {
    setIsDragging(false);
    if (expandedId !== id && index !== qrs.length - 1) return;

    if (!touchStart.current) return;
    const diffX = touchStart.current.val || 0;

    const el = document.getElementById(`swipe-content-${id}`);
    if (el) el.style.transform = "";

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
      await qrService.deleteQR(deleteConfirmQR.id);

      const cardId = deleteConfirmQR.id;
      setDeleteConfirmQR(null);
      setSwipeState({});
      if (expandedId === cardId) setExpandedId(null);

      const cardElement = document.getElementById(`qr-card-wrapper-${cardId}`);
      if (cardElement) {
        cardElement.classList.add("card-delete");

        setTimeout(() => {
          setQrs((prev) => prev.filter((q) => q.id !== cardId));
          showToast({ message: "Xoá mã QR thành công" });
        }, 500);
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
      setModalImgSrc(qr.previewImage?.path);
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

  const handleView = () => {
    if (!selectedQR) return;
    setModalVisible(false);
    if (selectedQR.category === EQRCategory.GREETING) {
      navigate(`/greetings/${selectedQR.id}`);
    } else {
      navigate(`/vcards/${selectedQR.id}`);
    }
  };

  const expandedIndex = expandedId ? qrs.findIndex((q) => q.id === expandedId) : -1;

  return (
    <Page className="bg-gray-50">
      {/* <Header title="Danh sách QR" showBackIcon={false} className="max-w-[100px]"/> */}
      <div
        className="content relative"
        id="ptr-wrapper"
        onTouchStart={handlePtrStart}
        onTouchMove={handlePtrMove}
        onTouchEnd={handlePtrEnd}
      >
        <div
          className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center -translate-y-full pointer-events-none"
          style={{ zIndex: 100 }}
        >
          <Icon
            id="ptr-spinner"
            icon="zi-auto-solid"
            className="text-gray-400 text-2xl"
            style={{ opacity: 0 }}
          />
        </div>
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
                className={`qr-card-base qr-card-wrapper transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden ${isInitialRender ? "card-enter" : ""}`}
                style={{
                  marginTop: index === 0 ? "0px" : "-85px",
                  zIndex: index,
                  animationDelay: isInitialRender ? `${index * 0.1}s` : "0s",
                  transform:
                    expandedIndex !== -1 && index > expandedIndex
                      ? "translate3d(0, 105px, 0)"
                      : "translate3d(0, 0, 0)",
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
                  id={`swipe-content-${qr.id}`}
                  className="relative z-10 w-full h-full rounded-2xl"
                  style={{
                    transform: `translate3d(${swipeState[qr.id] || 0}px, 0, 0)`,
                    transition: isDragging ? "none" : "transform 0.3s ease-out",
                    willChange: "transform",
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
                    vcardData={qr.payload?.vcardData}
                    greetingData={qr.payload?.greetingData}
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
          <div className="w-full max-w-[280px] aspect-[350/450] bg-gray-50 rounded-2xl border border-gray-100 shadow-inner flex items-center justify-center overflow-hidden relative">
            {modalImgSrc ? (
              <Image src={modalImgSrc} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full animate-pulse flex flex-col items-center justify-center gap-4">
                <Icon icon="zi-more-grid" size={48} className="text-gray-200" />
                <div className="w-1/3 h-2 bg-gray-200 rounded-full opacity-50" />
              </div>
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

            {selectedQR?.type === "dynamic" && (
              <Box
                flex
                flexDirection="column"
                alignItems="center"
                onClick={handleView}
                className="cursor-pointer"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-2">
                  <Icon icon="zi-user" className="text-blue-600" />
                </div>
                <Text size="xxSmall" className="text-blue-600 font-medium">
                  Xem chi tiết
                </Text>
              </Box>
            )}
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
