import React from "react";
import { Box } from "zmp-ui";
import { IconTrash } from "@tabler/icons-react";
import { QrCode } from "@/store";
import { QRCard } from "./QRCard";

interface StackedQRListProps {
  qrs: QrCode[];
  isInitialRender: boolean;
  expandedId: string | null;
  swipeState: Record<string, number>;
  isDragging: boolean;
  onCardClick: (qr: QrCode) => void;
  onMoreClick: (qr: QrCode) => void;
  onDeleteConfirm: (qr: QrCode) => void;
  onCloseSwipe: (id: string) => void;
  handleTouchStart: (e: React.TouchEvent, id: string) => void;
  handleTouchMove: (e: React.TouchEvent, id: string) => void;
  handleTouchEnd: (id: string) => void;
}

export const StackedQRList: React.FC<StackedQRListProps> = ({
  qrs,
  isInitialRender,
  expandedId,
  swipeState,
  isDragging,
  onCardClick,
  onMoreClick,
  onDeleteConfirm,
  onCloseSwipe,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}) => {
  const expandedIndex = expandedId ? qrs.findIndex((q) => q.id === expandedId) : -1;

  return (
    <Box p={4} className="pb-48">
      {qrs.map((qr, index) => (
        <div
          key={qr.id}
          id={`qr-card-wrapper-${qr.id}`}
          className={`qr-card-base qr-card-wrapper transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] mx-auto max-w-[400px] aspect-[1.586/1] relative ${
            isInitialRender ? "card-enter" : ""
          }`}
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
          {/* Swipe Action Background */}
          <div
            className="absolute inset-0 bg-red-500 rounded-3xl flex items-center justify-end pr-8 text-white shadow-inner"
            style={{ zIndex: 0 }}
            onClick={() => onDeleteConfirm(qr)}
          >
            <div className="flex flex-col items-center gap-1">
              <IconTrash className="text-3xl" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Xoá</span>
            </div>
          </div>

          {/* Swipeable Content */}
          <div
            id={`swipe-content-${qr.id}`}
            className="relative z-10 w-full h-full"
            style={{
              transform: `translate3d(${swipeState[qr.id] || 0}px, 0, 0)`,
              transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
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
                  onCloseSwipe(qr.id);
                } else {
                  onCardClick(qr);
                }
              }}
              onMoreClick={() => {
                onMoreClick(qr);
              }}
            />
          </div>
        </div>
      ))}
    </Box>
  );
};
