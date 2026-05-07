import React, { useEffect, useState, useRef } from "react";
import { Page, Box, Button, Text, Spinner, Modal } from "zmp-ui";
import { IconTrash, IconGridDots, IconPlus, IconRefresh } from "@tabler/icons-react";
import { showToast } from "zmp-sdk/apis";
import { useNavigate } from "react-router-dom";
import { qrService } from "@/services/qr";
import { createRoute } from "@/utils/routes";
import { QRCard } from "./components/qr-card";
import { QrCode } from "@/types/qr";
import "./styles.scss";

import { useQRStore } from "@/store";
import { QRModal } from "../edit-ui/components/QRModal";
import { usePullToRefresh } from "./hooks/usePullToRefresh";

const MyQRsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedQR, setSelectedQR] = useState<QrCode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null!);

  const [deleteConfirmQR, setDeleteConfirmQR] = useState<QrCode | null>(null);

  const [isInitialRender, setIsInitialRender] = useState(true);

  const { isFetching, removeQRRecord, qrCodeRecords: qrs, fetchQRRecords } = useQRStore();

  useEffect(() => {
    fetchQRRecords();
  }, []);

  useEffect(() => {
    if (qrs.length > 0 && isInitialRender) {
      const timer = setTimeout(() => setIsInitialRender(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [qrs, isInitialRender]);

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

        removeQRRecord(cardId, () => {
          showToast({ message: "Xoá mã QR thành công" });
        });
      } else {
        removeQRRecord(cardId, () => {
          showToast({ message: "Xoá mã QR thành công" });
        });
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
  };

  const expandedIndex = expandedId ? qrs.findIndex((q) => q.id === expandedId) : -1;

  const {
    swipeState,
    setSwipeState,
    isDragging,
    handlePtrStart,
    handlePtrMove,
    handlePtrEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = usePullToRefresh({
    onRefresh: fetchQRRecords,
    isFetching,
    expandedId,
    qrs,
  });

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
          <IconRefresh id="ptr-spinner" className="text-gray-400 text-2xl" style={{ opacity: 0 }} />
        </div>
        {isFetching ? (
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
                  <IconTrash className="text-2xl" />
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
              <IconGridDots className="text-gray-200 text-6xl" />
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
          prefixIcon={<IconPlus />}
        >
          Tạo mã QR mới
        </Button>
      </Box>

      <QRModal
        selectedQR={selectedQR}
        modalVisible={modalVisible}
        onToggle={() => setModalVisible(!modalVisible)}
      />

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
