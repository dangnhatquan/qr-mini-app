import React from "react";
import { QrCode } from "@/store";
import { useRef, useState } from "react";
import { openSnackbar } from "@/utils/snackbar";
import { getErrorMessage } from "@/utils/axios";

export interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  isFetching: boolean;
  expandedId: string | null;
  qrs: QrCode[];
}

interface PtrState {
  y: number;
  val: number;
  isPulling: boolean;
  startX: number;
  startY: number;
  isCancelled: boolean;
}

export const usePullToRefresh = ({ onRefresh, isFetching }: PullToRefreshOptions) => {
  const touchStart = useRef<{ x: number; y: number; val: number; currentVal?: number } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [swipeState, setSwipeState] = useState<{ [id: string]: number }>({});

  const ptrStart = useRef<PtrState | null>(null);

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const initialOffset = swipeState[id] || 0;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, val: initialOffset };
    setIsDragging(true);

    if (Object.keys(swipeState).length > 0 && !swipeState[id]) {
      setSwipeState({});
    }
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    if (!touchStart.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStart.current.x;
    const diffY = currentY - touchStart.current.y;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      if (ptrStart.current) {
        ptrStart.current.isPulling = false;
      }

      const val = touchStart.current.val + diffX;
      const cappedVal = Math.max(Math.min(val, 0), -90);

      touchStart.current.currentVal = cappedVal;

      const el = document.getElementById(`swipe-content-${id}`);
      if (el) {
        el.style.transform = `translate3d(${cappedVal}px, 0, 0)`;
      }
    }
  };

  const handleTouchEnd = (id: string) => {
    setIsDragging(false);
    if (!touchStart.current) return;

    const finalVal =
      touchStart.current.currentVal !== undefined
        ? touchStart.current.currentVal
        : touchStart.current.val;

    const el = document.getElementById(`swipe-content-${id}`);
    if (el) el.style.transform = "";

    if (finalVal < -45) {
      setSwipeState({ [id]: -90 });
    } else {
      setSwipeState({});
    }
    touchStart.current = null;
  };

  const handlePtrStart = (e: React.TouchEvent) => {
    const pageContent = document.querySelector(".zaui-page-content") || document.documentElement;
    if (pageContent.scrollTop <= 0) {
      ptrStart.current = {
        y: e.touches[0].clientY,
        val: 0,
        isPulling: false,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        isCancelled: false,
      };
    }
  };

  const handlePtrMove = (e: React.TouchEvent) => {
    if (!ptrStart.current || isFetching || ptrStart.current.isCancelled) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - ptrStart.current.startX;
    const diffY = currentY - ptrStart.current.startY;

    if (!ptrStart.current.isPulling && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 15) {
      ptrStart.current.isCancelled = true;
      return;
    }

    if (!ptrStart.current.isPulling && diffY < 30) return;

    if (diffY > 0) {
      ptrStart.current.isPulling = true;

      const damping = 180;
      let val = damping * Math.log1p((diffY - 30) / damping);

      if (val > 140) val = 140;
      ptrStart.current.val = val;

      const ptrEl = document.getElementById("ptr-wrapper");
      if (ptrEl) {
        ptrEl.style.transform = `translate3d(0, ${val}px, 0)`;
        ptrEl.style.transition = "none";
        ptrEl.style.willChange = "transform";
      }

      const spinnerEl = document.getElementById("ptr-spinner");
      if (spinnerEl) {
        const rotation = val * 6;
        const scale = Math.min(0.5 + (val / 100) * 0.5, 1.2);
        const opacity = Math.min(val / 70, 1);

        const isReady = val >= 100;
        spinnerEl.style.color = isReady ? "#2563eb" : "#94a3b8";
        spinnerEl.style.transform = `translate3d(0, ${val - 45}px, 0) rotate(${rotation}deg) scale(${scale})`;
        spinnerEl.style.opacity = `${opacity}`;
        spinnerEl.style.transition = "color 0.2s ease";
      }
    }
  };

  const handlePtrEnd = async () => {
    if (!ptrStart.current || !ptrStart.current.isPulling || isFetching) {
      ptrStart.current = null;
      return;
    }
    const val = ptrStart.current.val;
    const ptrEl = document.getElementById("ptr-wrapper");
    const spinnerEl = document.getElementById("ptr-spinner");

    const snapEasing = "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)";

    if (val >= 100) {
      if (ptrEl) {
        ptrEl.style.transition = snapEasing;
        ptrEl.style.transform = `translate3d(0, 70px, 0)`;
      }
      if (spinnerEl) {
        spinnerEl.style.transition = "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)";
        spinnerEl.style.transform = `translate3d(0, 30px, 0) rotate(720deg) scale(1)`;
        spinnerEl.style.opacity = `1`;
        spinnerEl.style.color = "#2563eb";
        spinnerEl.classList.add("animate-spin");
      }

      try {
        await onRefresh();
        openSnackbar({ text: "Đã làm mới danh sách", type: "success" });
      } catch (err) {
        console.error(err);
        openSnackbar({ text: getErrorMessage(err, "Lỗi khi làm mới danh sách"), type: "error" });
      }
    }

    if (ptrEl) {
      ptrEl.style.transition = snapEasing;
      ptrEl.style.transform = `translate3d(0, 0, 0)`;
    }
    if (spinnerEl) {
      spinnerEl.style.transition = "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)";
      spinnerEl.style.transform = `translate3d(0, -45px, 0) scale(0.5)`;
      spinnerEl.style.opacity = `0`;
      spinnerEl.classList.remove("animate-spin");
    }

    setTimeout(() => {
      if (ptrEl) {
        ptrEl.style.transition = "";
        ptrEl.style.willChange = "auto";
      }
      if (spinnerEl) {
        spinnerEl.style.transition = "";
      }
    }, 500);

    ptrStart.current = null;
  };

  return {
    swipeState,
    setSwipeState,

    isDragging,
    setIsDragging,

    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,

    handlePtrStart,
    handlePtrMove,
    handlePtrEnd,
  };
};
