import { qrService } from "@/services/qr";
import { QrCode } from "@/types/qr";
import { create } from "zustand";

export interface QRStore {
  qrCodeRecords: QrCode[];
  isFetching: boolean;
  error: string | null;
  fetchQRRecords: () => Promise<void>;
  removeQRRecord: (id: string, callback?: () => void) => Promise<void>;
}

export const useQRStore = create<QRStore>((set) => ({
  qrCodeRecords: [],
  isFetching: false,
  error: null,
  fetchQRRecords: async () => {
    set({ isFetching: true, error: null });
    try {
      const data = await qrService.getMyQRs();
      set({ qrCodeRecords: data || [], isFetching: false });
    } catch (error: any) {
      set({ error: error.message, isFetching: false });
    }
  },
  removeQRRecord: async (id: string, callback?: () => void) => {
    await qrService.deleteQR(id);
    set((state) => ({
      qrCodeRecords: state.qrCodeRecords.filter((qr) => qr.id !== id),
    }));
    callback?.();
  },
}));
