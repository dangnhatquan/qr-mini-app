import React, { useEffect, useState, useRef, useCallback } from "react";
import { Page, Box, Button, Text, Spinner, Modal } from "zmp-ui";
import { IconTrash, IconGridDots, IconPlus, IconRefresh } from "@tabler/icons-react";
import { showToast } from "zmp-sdk/apis";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createRoute } from "@/utils/routes";
import { QrCode } from "@/store";
import "./styles.scss";

import { useQRStore, useBankStore } from "@/store";
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import { QRCard } from "./components/QRCard";
import { QRModal } from "./components/QRModal";

const MyQRsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedQR, setSelectedQR] = useState<QrCode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null!);

  const [deleteConfirmQR, setDeleteConfirmQR] = useState<QrCode | null>(null);

  const [isInitialRender, setIsInitialRender] = useState(true);
  const [animatingQR, setAnimatingQR] = useState<QrCode | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const cloneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const originalRectRef = useRef<DOMRect | null>(null);
  useGSAP({ scope: container });

  const { isFetching, removeQRRecord, qrCodeRecords: qrs, fetchQRRecords } = useQRStore();
  const { fetchBanks } = useBankStore();

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

  const handleCardClick = (qr: QrCode) => {
    if (isFocused || animatingQR) return;
    const originalCard = document.getElementById(`qr-card-wrapper-${qr.id}`);
    if (originalCard) {
      originalRectRef.current = originalCard.getBoundingClientRect();
      gsap.set(originalCard, { opacity: 0, pointerEvents: "none" });
    }
    setAnimatingQR(qr);
    setIsFocused(true);
  };

  useGSAP(() => {
    if (!animatingQR || !isFocused) return;

    const originalCard = document.getElementById(`qr-card-wrapper-${animatingQR.id}`);
    if (!originalCard || !cloneRef.current || !originalRectRef.current) return;

    const CARD_HEIGHT = 250.94;
    const rect = originalRectRef.current;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const cardPadding = 16;
    const centeredWidth = Math.min(rect.width, viewportW - cardPadding * 2);
    const centeredX = (viewportW - centeredWidth) / 2;
    const centeredY = (viewportH - CARD_HEIGHT) / 2;

    gsap.set(cloneRef.current, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: CARD_HEIGHT,
      opacity: 1,
      scale: 1,
      display: "block",
    });

    const tl = gsap.timeline();

    tl.to(
      cloneRef.current,
      {
        y: -CARD_HEIGHT - 40,
        duration: 0.33,
        ease: "power3.in",
      },
      0,
    );

    tl.set(overlayRef.current, { display: "block", opacity: 0 }).to(overlayRef.current, {
      opacity: 1,
      duration: 0.22,
      ease: "power2.out",
    });

    tl.set(cloneRef.current, {
      y: -CARD_HEIGHT - 40,
      x: centeredX,
      width: centeredWidth,
      opacity: 1,
    });
    tl.to(cloneRef.current, {
      y: centeredY,
      duration: 0.42,
      ease: "back.out(1.4)",
    });
  }, [animatingQR, isFocused]);

  const handleCloseFocus = useCallback(() => {
    if (!animatingQR) return;
    const originalCard = document.getElementById(`qr-card-wrapper-${animatingQR.id}`);
    const clone = cloneRef.current;
    const overlay = overlayRef.current;
    const CARD_HEIGHT = 250.94;

    const tl = gsap.timeline({
      onComplete: () => {
        if (clone) gsap.set(clone, { display: "none" });
        if (overlay) gsap.set(overlay, { display: "none", opacity: 0 });
        if (originalCard) gsap.set(originalCard, { clearProps: "opacity,pointerEvents" });
        setIsFocused(false);
        setAnimatingQR(null);
        originalRectRef.current = null;
      },
    });

    tl.to(clone, {
      y: -CARD_HEIGHT - 40,
      duration: 0.25,
      ease: "power3.in",
    });

    tl.to(overlay, {
      opacity: 0,
      duration: 0.22,
      ease: "power2.out",
    });

    if (originalCard) {
      tl.to(
        originalCard,
        {
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
        },
        "<",
      );
    }
  }, [animatingQR]);

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
    <Page className=" bg-[#F8FAFC] relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 -ml-48 -mb-48" />

      {/* Animation Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/80 z-[9998] hidden opacity-0 backdrop-blur-sm"
        onClick={handleCloseFocus}
      />

      {/* Animating Clone */}
      {animatingQR && (
        <div
          ref={cloneRef}
          className="fixed top-0 left-0 z-[9999]"
          style={{ willChange: "transform, opacity", display: "none" }}
        >
          <div
            className="pointer-events-auto cursor-pointer"
            onClick={() => {
              setSelectedQR(animatingQR);
            }}
            style={{ height: "250.94px" }}
          >
            <QRCard qr={animatingQR} onClick={() => {}} onMoreClick={() => {}} />
          </div>
        </div>
      )}

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
          <Box p={4} className="pb-48" ref={container}>
            {qrs.map((qr, index) => (
              <div
                key={qr.id}
                id={`qr-card-wrapper-${qr.id}`}
                className={`qr-card-base qr-card-wrapper transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mx-auto max-w-[400px] aspect-[1.586/1] relative ${isInitialRender ? "card-enter" : ""}`}
                style={{
                  marginTop: index === 0 ? "0px" : "-125px",
                  zIndex: swipeState[qr.id] ? 100 : index,
                  animationDelay: isInitialRender ? `${index * 0.1}s` : "0s",
                  transform:
                    expandedIndex !== -1 && index !== expandedIndex
                      ? `translate3d(0, ${index > expandedIndex ? "375px" : "500px"}, 0)`
                      : `translate3d(0, ${expandedIndex !== -1 ? index * -125 : 0}px, 0)`,
                }}
              >
                <div
                  className="absolute inset-0 bg-red-500 rounded-3xl flex items-center justify-end pr-8 text-white shadow-inner"
                  style={{ zIndex: 0 }}
                  onClick={() => setDeleteConfirmQR(qr)}
                >
                  <div className="flex flex-col items-center gap-1">
                    <IconTrash className="text-3xl" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Xoá</span>
                  </div>
                </div>
                <div
                  id={`swipe-content-${qr.id}`}
                  className="relative z-10 w-full h-full"
                  style={{
                    transform: `translate3d(${swipeState[qr.id] || 0}px, 0, 0)`,
                    transition: isDragging
                      ? "none"
                      : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "transform",
                  }}
                  onTouchStart={(e) => handleTouchStart(e, qr.id)}
                  onTouchMove={(e) => handleTouchMove(e, qr.id)}
                  onTouchEnd={() => handleTouchEnd(qr.id)}
                >
                  <QRCard
                    qr={qr}
                    onClick={() => {
                      if (swipeState[qr.id] === -90) {
                        setSwipeState((prev) => ({ ...prev, [qr.id]: 0 }));
                      } else {
                        handleCardClick(qr);
                      }
                    }}
                    onMoreClick={() => handleMoreClick(qr)}
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
          className="h-16 rounded-2xl shadow-xl shadow-blue-200 font-bold text-lg active:scale-95 transition-transform"
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
