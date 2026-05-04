import React from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { InputFormField } from "@/components/form-fields/input-field";
import { IQRFormValues } from "@/utils/schemas/qr";
import { UploadFormField } from "@/components/form-fields/upload-form-field";

interface VCardFormProps {
  control: Control<IQRFormValues>;
  setValue: UseFormSetValue<IQRFormValues>;
}

export const VCardForm: React.FC<VCardFormProps> = ({ control, setValue }) => {
  return (
    <>
      <UploadFormField
        setValue={setValue}
        name="vcardData.avatar"
        control={control}
        label="Hình đại diện"
        placeholder="Tải lên hình đại diện"
        required
      />
      <InputFormField
        name="vcardData.fullName"
        control={control}
        label="Họ tên"
        placeholder="Nhập họ và tên"
        required
      />
      <InputFormField
        name="vcardData.phone"
        control={control}
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        required
      />
      <InputFormField
        name="vcardData.email"
        control={control}
        label="Email"
        placeholder="Nhập địa chỉ email"
      />
      <InputFormField
        name="vcardData.position"
        control={control}
        label="Chức danh"
        placeholder="VD: Giám đốc kinh doanh"
      />
      <InputFormField
        name="vcardData.company"
        control={control}
        label="Công ty"
        placeholder="Nhập tên công ty"
      />
      <InputFormField
        name="vcardData.website"
        control={control}
        label="Website"
        placeholder="https://example.com"
      />
      <InputFormField
        name="vcardData.socialLinks"
        control={control}
        label="Mạng xã hội (Facebook/LinkedIn)"
        placeholder="Dán link trang cá nhân"
      />
    </>
  );
};
