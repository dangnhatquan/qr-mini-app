import { qrService } from "@/services/qr";
import { QRStore } from "@/store";
import { create } from "zustand";

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
