import { qrService } from "@/services/qr";
import { QrCode, QRStore } from "@/store";
import { IQRFormValues } from "@/utils/schemas/qr";
import { StageProps } from "react-konva";
import { create } from "zustand";

export const useQRStore = create<QRStore>((set) => ({
  qrCodeRecords: [],
  isFetching: false,
  error: null,

  selectedQR: null,
  isFetchingSelectedQR: false,
  errorSelectedQR: null,

  setSelectedQR: (qr: QrCode) => {
    set({ selectedQR: qr });
  },

  fetchQRDetail: async (id: string) => {
    set({ isFetchingSelectedQR: true, errorSelectedQR: null });
    try {
      const data = await qrService.getQRDetail(id);
      set({ selectedQR: data, isFetchingSelectedQR: false });
    } catch (error: any) {
      set({ errorSelectedQR: error.message, isFetchingSelectedQR: false });
    }
  },

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

  updateQRRecord: async (
    id: string,
    data: IQRFormValues,
    blob?: Blob,
    editorStage?: StageProps,
    callback?: () => void,
  ) => {
    await qrService.updateQR(id, data, blob, editorStage);
    set((state) => ({
      qrCodeRecords: state.qrCodeRecords.map((qr) => (qr.id === id ? qr : qr)),
    }));
    callback?.();
  },
}));
