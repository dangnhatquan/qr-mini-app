import React from "react";
import { Control } from "react-hook-form";
import { InputFormField } from "@/components/form-fields/input-field";
import { SelectFormField } from "@/components/form-fields/select-field";
import { WIFI_SECURITY_OPTIONS } from "../constants";
import { DEFAULT_WIFI_SECURITY } from "@/types/qr";
import { IQRFormValues } from "@/utils/schemas/qr";

interface WifiFormProps {
  control: Control<IQRFormValues>;
}

export const WifiForm: React.FC<WifiFormProps> = ({ control }) => {
  return (
    <>
      <InputFormField
        name="wifiData.ssid"
        control={control}
        label="Tên Wifi (SSID)"
        placeholder="Nhập tên mạng Wifi"
        required
      />
      <InputFormField
        name="wifiData.password"
        control={control}
        label="Mật khẩu"
        placeholder="Nhập mật khẩu Wifi"
        type="password"
      />
      <SelectFormField
        name="wifiData.security"
        control={control}
        label="Loại bảo mật"
        options={WIFI_SECURITY_OPTIONS}
        defaultValue={DEFAULT_WIFI_SECURITY}
      />
    </>
  );
};
