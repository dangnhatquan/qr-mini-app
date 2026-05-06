import React, { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { InputFormField } from "@/components/form-fields/input-field";
import { SelectFormField } from "@/components/form-fields/select-field";
import { DEFAULT_BANK_ID } from "@/types/qr";
import { IQRFormValues } from "@/utils/schemas/qr";
import { bankService } from "@/services/bank";
import { Bank } from "@/types/bank";
import { Box, Spinner } from "zmp-ui";

interface BankingFormProps {
  control: Control<IQRFormValues>;
}

export const BankingForm: React.FC<BankingFormProps> = ({ control }) => {
  const [banks, setBanks] = useState<{ value: string; label: string }[]>([]);
  const [isFetchingBanks, setIsFetchingBanks] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsFetchingBanks(true);
        const response = await bankService.getBanks();
        const data = Array.isArray(response) ? response : (response as any).data || [];
        const bankOptions = data.map((bank: Bank) => ({
          value: bank.bin || bank.code || bank.id.toString(), // prefer BIN for VietQR
          label: bank.shortName || bank.name,
        }));
        setBanks(bankOptions);
      } catch (error) {
        console.error("Failed to fetch banks", error);
      } finally {
        setIsFetchingBanks(false);
      }
    };
    fetchBanks();
  }, []);

  if (isFetchingBanks) {
    return (
      <Box className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </Box>
    );
  }

  return (
    <>
      <SelectFormField
        name="bankingData.bankId"
        control={control}
        label="Ngân hàng"
        placeholder="Chọn ngân hàng"
        options={banks}
        defaultValue={DEFAULT_BANK_ID}
        required
      />
      <InputFormField
        name="bankingData.accountNo"
        control={control}
        label="Số tài khoản"
        placeholder="Nhập số tài khoản"
        required
      />
      {/* <InputFormField
        name="bankingData.accountName"
        control={control}
        label="Tên chủ tài khoản"
        placeholder="Nhập tên chủ tài khoản (không dấu)"
      /> */}
      <InputFormField
        name="bankingData.amount"
        control={control}
        label="Số tiền (Tùy chọn)"
        placeholder="Nhập số tiền"
        type="number"
      />
      <InputFormField
        name="bankingData.description"
        control={control}
        label="Nội dung chuyển khoản (Tùy chọn)"
        placeholder="Nhập nội dung"
      />
    </>
  );
};
