import request from "@/utils/axios";
import { banksResource } from "@/resources";
import { Bank } from "@/types/bank";

export const bankService = {
  getBanks: async () => {
    return await request.get<Bank[]>(banksResource);
  },
};
