import { getFullUrl } from "@/utils/axios";
import { uploadFile } from "@/utils/helpers/image";
import { IQRFormValues } from "@/utils/schemas/qr";
import { get } from "radash";
import { useState } from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import { chooseImage, getUserInfo, showToast } from "zmp-sdk/apis";
import { Avatar, Button, Icon, Spinner } from "zmp-ui";

interface IUploadFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "number";
  required?: boolean;
  helperText?: string;
  setValue: UseFormSetValue<T>;
}
export const UploadFormField = ({
  name,
  control,
  label,
  placeholder,
  required,
  helperText,
  setValue,
}: IUploadFormFieldProps<IQRFormValues>) => {
  const [uploading, setUploading] = useState(false);

  const handleUploadAvatar = async () => {
    try {
      const { filePaths } = await chooseImage({ count: 1 });
      if (filePaths && filePaths.length > 0) {
        setUploading(true);
        const path = filePaths[0];
        const response = await fetch(path);
        const blob = await response.blob();
        const file = await uploadFile(blob);

        setValue(name, file.path);
        showToast({ message: "Đã thêm Avatar" });
      }
    } catch (_err) {
      console.error("Upload avatar error:", _err);
      showToast({ message: "Lỗi tải ảnh" });
    } finally {
      setUploading(false);
    }
  };

  const handleUseAvatar = async () => {
    try {
      setUploading(true);
      const { userInfo } = await getUserInfo({
        autoRequestPermission: false,
        avatarType: "large",
      });
      if (userInfo.avatar) {
        let finalPath = userInfo.avatar;

        const response = await fetch(finalPath);
        const blob = await response.blob();
        const file = await uploadFile(blob);

        setValue(name, file.path);
        showToast({ message: "Đã thêm Avatar" });
      }
    } catch (_err) {
      console.error("Use avatar error:", _err);
      showToast({ message: "Lỗi lấy thông tin" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => {
        console.log("UploadFormField render with value:", field);
        const fieldError = get(errors, name) as FieldError | undefined;

        const inputProps = {
          ...field,
          label: (
            <span className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </span>
          ),
          placeholder: placeholder,
          helperText: helperText,
          errorText: fieldError?.message,
          status: (fieldError ? "error" : undefined) as any,
        };

        return (
          <div className="h-[216px] flex items-center justify-center">
            {!uploading ? (
              <div className="mb-4 flex flex-col items-center justify-center gap-2">
                <Avatar
                  size={160}
                  src={field.value ? getFullUrl(field.value) : undefined}
                  backgroundColor="BLUE-BLUELIGHT"
                >
                  <Icon icon="zi-user-circle" size={64} />
                </Avatar>
                <div className="flex justify-center items-center gap-2">
                  <Button loading={uploading} size="small" onClick={handleUseAvatar}>
                    Dùng Avatar
                  </Button>
                  <Button loading={uploading} size="small" onClick={handleUploadAvatar}>
                    Tải lên
                  </Button>
                </div>
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        );
      }}
    />
  );
};
