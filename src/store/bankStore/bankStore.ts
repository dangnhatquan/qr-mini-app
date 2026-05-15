import { create } from "zustand";
import { BankStore } from "./bankStore.types";
import { bankService } from "@/services/bank";

export const useBankStore = create<BankStore>((set) => ({
  banks: [],
  isFetching: false,
  error: null,
  fetchBanks: async () => {
    set({ isFetching: true, error: null });
    try {
      const data = await bankService.getBanks();
      set({ banks: data || [], isFetching: false });
    } catch (error: any) {
      set({ error: error.message, isFetching: false });
    }
  },
}));
