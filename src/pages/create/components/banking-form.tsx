import React from "react";
import { Control } from "react-hook-form";
import { InputFormField } from "@/components/form-fields/input-field";
import { SelectFormField } from "@/components/form-fields/select-field";
import { BANK_LIST } from "../constants";
import { DEFAULT_BANK_ID } from "@/types/qr";
import { IQRFormValues } from "@/utils/schemas/qr";

interface BankingFormProps {
  control: Control<IQRFormValues>;
}

export const BankingForm: React.FC<BankingFormProps> = ({ control }) => {
  return (
    <>
      <SelectFormField
        name="bankingData.bankId"
        control={control}
        label="Ngân hàng"
        placeholder="Chọn ngân hàng"
        options={BANK_LIST}
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
      <InputFormField
        name="bankingData.accountName"
        control={control}
        label="Tên chủ tài khoản"
        placeholder="Nhập tên chủ tài khoản (không dấu)"
      />
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
