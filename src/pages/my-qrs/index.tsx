import React, { useEffect, useState } from "react";
import { Page, Box, Text, Spinner, Modal, Button } from "zmp-ui";
import { IconGridDots, IconPlus } from "@tabler/icons-react";
import { openSnackbar } from "@/utils/snackbar";
import { getErrorMessage } from "@/utils/axios";
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
import { SkeletonList } from "./components/SkeletonList";

const MyQRsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedQR, setSelectedQR] = useState<QrCode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmQR, setDeleteConfirmQR] = useState<QrCode | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const { isFetching, removeQRRecord, qrCodeRecords: qrs, fetchQRRecords } = useQRStore();
  const { fetchBanks } = useBankStore();

  const { focusedQR, isFocusOpen, openFocus, closeFocus } = useQRFocus();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQRRecords();
      fetchBanks();
      setIsTransitioning(false);
    }, 200);
    return () => clearTimeout(timer);
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
    const qrId = deleteConfirmQR.id;
    try {
      setDeleteConfirmQR(null);
      setSwipeState({});
      const cardElement = document.getElementById(`qr-card-wrapper-${qrId}`);
      if (cardElement) {
        cardElement.classList.add("card-delete");
        setTimeout(async () => {
          await removeQRRecord(qrId);
          openSnackbar({ text: "Xoá mã QR thành công", type: "success" });
          if (expandedId === qrId) setExpandedId(null);
        }, 500);
      } else {
        await removeQRRecord(qrId);
        openSnackbar({ text: "Xoá mã QR thành công", type: "success" });
        if (expandedId === qrId) setExpandedId(null);
      }
    } catch (error) {
      console.error(error);
      openSnackbar({ text: getErrorMessage(error, "Lỗi khi xoá mã QR"), type: "error" });
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
    <Page className="bg-[#F8FAFC] relative overflow-x-hidden overflow-y-scroll min-h-[calc(100vh-136px)] overscroll-y-contain">
      <QRFocusView
        qr={focusedQR}
        isOpen={isFocusOpen}
        onClose={closeFocus}
        onMoreClick={handleMoreClick}
        onDelete={(qr) => {
          setDeleteConfirmQR(qr);
          closeFocus();
        }}
      />
      <div
        className="pt-10 relative min-h-screen flex flex-col overflow-x-hidden"
        id="page-content-wrapper"
      >
        <Box p={6} className="pb-2" id="page-header">
          <Text className="text-3xl font-black text-primary">QR của tôi</Text>
          <Text className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">
            {qrs.length} mã QR đã lưu
          </Text>
        </Box>

        {isFetching || isTransitioning ? (
          <SkeletonList />
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

      {/* <div
        className="fixed z-50 flex bg-primary items-center justify-center bottom-6 right-4 rounded-full w-12 h-12 font-bold text-lg active:scale-95 transition-transform"
        onClick={() => navigate(createRoute)}
      >
        <IconPlus size={24} className="text-white" />
      </div> */}

      <Button
        className="fixed z-50 flex bg-primary items-center justify-center bottom-6 right-4 rounded-full w-12 h-12 font-bold text-lg active:scale-95 transition-transform"
        onClick={() => navigate(createRoute)}
        icon={<IconPlus size={24} className="text-white" />}
      ></Button>

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
