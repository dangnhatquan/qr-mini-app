import React, { useEffect } from "react";
import { Control } from "react-hook-form";
import { InputFormField } from "@/components/form-fields/input-field";
import { SelectFormField } from "@/components/form-fields/select-field";
import { IQRFormValues } from "@/utils/schemas/qr";
import { Box, Spinner } from "zmp-ui";
import { DEFAULT_BANK_ID } from "@/utils/constants/qr";
import { useBankStore } from "@/store";

interface BankingFormProps {
  control: Control<IQRFormValues>;
}

export const BankingForm: React.FC<BankingFormProps> = ({ control }) => {
  const { isFetching, banks, fetchBanks } = useBankStore();

  useEffect(() => {
    fetchBanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFetching) {
    return (
      <Box className="w-full h-[398px] flex items-center justify-center">
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
        options={banks.map((bank) => ({
          value: bank.bin || bank.code || bank.id.toString(), // prefer BIN for VietQR
          label: bank.shortName || bank.name,
          description: bank.name,
          image: bank.logo,
        }))}
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
