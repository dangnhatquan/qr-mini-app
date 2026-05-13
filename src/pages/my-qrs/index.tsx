import React, { useEffect, useState } from "react";
import { Page, Box, Button, Text, Spinner, Modal } from "zmp-ui";
import { IconGridDots, IconPlus, IconRefresh } from "@tabler/icons-react";
import { showToast } from "zmp-sdk/apis";
import { useNavigate } from "react-router-dom";
import { createRoute } from "@/utils/routes";
import { QrCode } from "@/store";
import "./styles.scss";

import { useQRStore, useBankStore } from "@/store";
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import { useQRFocus } from "./hooks/useQRFocus";
import { QRModal } from "./components/QRModal";
import { StackedQRList } from "./components/StackedQRList";
import { QRFocusView } from "./components/QRFocusView";

const MyQRsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedQR, setSelectedQR] = useState<QrCode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmQR, setDeleteConfirmQR] = useState<QrCode | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const { isFetching, removeQRRecord, qrCodeRecords: qrs, fetchQRRecords } = useQRStore();
  const { fetchBanks } = useBankStore();

  const { focusedQR, isFocusOpen, openFocus, closeFocus } = useQRFocus();

  useEffect(() => {
    fetchQRRecords();
    fetchBanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (qrs.length > 0 && isInitialRender) {
      const timer = setTimeout(() => setIsInitialRender(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [qrs, isInitialRender]);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmQR) return;
    const cardId = deleteConfirmQR.id;
    try {
      setDeleteConfirmQR(null);
      setSwipeState({});
      const cardElement = document.getElementById(`qr-card-wrapper-${cardId}`);
      if (cardElement) {
        cardElement.classList.add("card-delete");
        setTimeout(async () => {
          await removeQRRecord(cardId);
          showToast({ message: "Xoá mã QR thành công" });
          if (expandedId === cardId) setExpandedId(null);
        }, 500);
      } else {
        await removeQRRecord(cardId);
        showToast({ message: "Xoá mã QR thành công" });
        if (expandedId === cardId) setExpandedId(null);
      }
    } catch (error) {
      console.error(error);
      showToast({ message: "Lỗi khi xoá mã QR" });
    }
  };

  const handleMoreClick = (qr: QrCode) => {
    setSelectedQR(qr);
    setModalVisible(true);
  };

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
    <Page className=" bg-[#F8FAFC] relative overflow-x-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 -ml-48 -mb-48" />

      {/* Focus Card Layer */}
      <QRFocusView
        qr={focusedQR}
        isOpen={isFocusOpen}
        onClose={closeFocus}
        onMoreClick={handleMoreClick}
      />

      <div
        className="mt-10 relative min-h-screen flex flex-col overflow-x-hidden"
        id="ptr-wrapper"
        onTouchStart={handlePtrStart}
        onTouchMove={handlePtrMove}
        onTouchEnd={handlePtrEnd}
      >
        <Box p={6} className="pb-2" id="page-header">
          <Text className="text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            QR của tôi
          </Text>
          <Text className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">
            {qrs.length} mã QR đã lưu
          </Text>
        </Box>

        {/* Pull to Refresh Spinner */}
        <div
          className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center -translate-y-full pointer-events-none"
          style={{ zIndex: 100 }}
        >
          <IconRefresh
            id="ptr-spinner"
            className="text-blue-500 text-2xl animate-spin"
            style={{ opacity: 0 }}
          />
        </div>

        {isFetching ? (
          <Box flex justifyContent="center" alignItems="center" className="flex-1">
            <div className="flex flex-col items-center gap-4">
              <Spinner />
              <Text className="text-gray-400 font-medium animate-pulse uppercase tracking-widest text-[10px]">
                Đang tải dữ liệu...
              </Text>
            </div>
          </Box>
        ) : qrs.length > 0 ? (
          <StackedQRList
            qrs={qrs}
            isInitialRender={isInitialRender}
            expandedId={expandedId}
            swipeState={swipeState}
            isDragging={isDragging}
            onCardClick={openFocus}
            onMoreClick={handleMoreClick}
            onDeleteConfirm={setDeleteConfirmQR}
            onCloseSwipe={(id) => setSwipeState((prev) => ({ ...prev, [id]: 0 }))}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
          />
        ) : (
          <Box
            flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={10}
            className="flex-1"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-50">
                <IconGridDots className="text-blue-100 text-8xl" />
              </div>
            </div>
            <Text className="text-gray-800 font-black text-2xl tracking-tighter text-center">
              Bắt đầu tạo mã QR
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center max-w-[200px] font-medium leading-relaxed">
              Bạn chưa có mã QR nào. Hãy tạo mã đầu tiên để trải nghiệm.
            </Text>
          </Box>
        )}
      </div>

      <Box
        p={6}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-10 z-50 rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.05)]"
      >
        <Button
          fullWidth
          size="large"
          type="highlight"
          className="rounded-2xl shadow-xl shadow-blue-200 font-bold text-lg active:scale-95 transition-transform"
          onClick={() => navigate(createRoute)}
          prefixIcon={<IconPlus size={24} />}
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
