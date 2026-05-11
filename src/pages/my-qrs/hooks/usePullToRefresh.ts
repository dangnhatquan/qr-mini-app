import React from "react";
import { QrCode } from "@/store";
import { useRef, useState } from "react";
import { showToast } from "zmp-sdk/apis";

export interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  isFetching: boolean;
  expandedId: string | null;
  qrs: QrCode[];
}

export const usePullToRefresh = ({ onRefresh, isFetching }: PullToRefreshOptions) => {
  const touchStart = useRef<{ x: number; y: number; val: number; currentVal?: number } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [swipeState, setSwipeState] = useState<{ [id: string]: number }>({});

  const ptrStart = useRef<{ y: number; val: number; isPulling: boolean } | null>(null);

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
      } as any;
    }
  };

  const handlePtrMove = (e: React.TouchEvent) => {
    if (!ptrStart.current || isFetching || (ptrStart.current as any).isCancelled) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - (ptrStart.current as any).startX;
    const diffY = currentY - (ptrStart.current as any).startY;

    if (!ptrStart.current.isPulling && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 5) {
      (ptrStart.current as any).isCancelled = true;
      return;
    }

    if (!ptrStart.current.isPulling && diffY < 10) return;

    if (diffY > 0) {
      ptrStart.current.isPulling = true;
      let val = (diffY - 10) * 0.4;
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
    if (!ptrStart.current || !ptrStart.current.isPulling || isFetching) {
      ptrStart.current = null;
      return;
    }
    const val = ptrStart.current.val;
    const ptrEl = document.getElementById("ptr-wrapper");
    const spinnerEl = document.getElementById("ptr-spinner");

    if (val >= 60) {
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

      await onRefresh();
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
