import React from "react";
import { Control } from "react-hook-form";
import { InputFormField } from "@/components/form-fields/input-field";
import { IQRFormValues } from "@/utils/schemas/qr";

interface GreetingFormProps {
  control: Control<IQRFormValues>;
}

export const GreetingForm: React.FC<GreetingFormProps> = ({ control }) => {
  return (
    <>
      <InputFormField
        name="greetingData.eventName"
        control={control}
        label="Tên sự kiện"
        placeholder="VD: Đám cưới, Sinh nhật..."
        required
      />
      <InputFormField
        name="greetingData.wishes"
        control={control}
        label="Lời chúc"
        placeholder="Nhập lời nhắn gửi của bạn"
        required
      />
      <InputFormField
        name="greetingData.imageUrl"
        control={control}
        label="Link hình ảnh"
        placeholder="Dán link ảnh"
      />
      <InputFormField
        name="greetingData.videoLink"
        control={control}
        label="Link video (Youtube/Tiktok)"
        placeholder="Dán link video"
      />
      <div className="mt-6 pt-4 border-t">
        <h3 className="text-sm font-bold mb-4">Bảo mật (Tùy chọn)</h3>
        <InputFormField
          name="greetingData.password"
          control={control}
          label="Mật khẩu truy cập"
          placeholder="Để trống nếu không cần mật khẩu"
          type="password"
        />
        <InputFormField
          name="greetingData.maxAttempts"
          control={control}
          label="Số lần nhập sai tối đa"
          placeholder="Mặc định: 5"
          type="number"
        />
      </div>
    </>
  );
};
