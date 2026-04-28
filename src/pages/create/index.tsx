import React, { useEffect, useState } from "react";
import { Page, Button, Box, useSnackbar } from "zmp-ui";
import { Header } from "@/components/Header";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IQRFormValues, qrFormSchema } from "@/utils/schemas/qr";
import { RadioFormField } from "@/components/form-fields/radio-field";
import { SelectFormField } from "@/components/form-fields/select-field";
import { QR_TYPES, STATIC_CATEGORIES, DYNAMIC_CATEGORIES } from "./constants";
import { WifiForm } from "./components/wifi-form";
import { BankingForm } from "./components/banking-form";
import { VCardForm } from "./components/vcard-form";
import { GreetingForm } from "./components/greeting-form";
import {
  EQRType,
  EQRCategory,
  DEFAULT_BANK_ID,
  DEFAULT_WIFI_SECURITY,
  DEFAULT_MAX_ATTEMPTS,
} from "@/types/qr";
import { qrService } from "@/services/qr";
import { useNavigate } from "react-router-dom";
import { myQrsRoute } from "@/utils/routes";

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const { control, watch, setValue, handleSubmit } = useForm<IQRFormValues>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: {
      qrType: EQRType.STATIC,
      category: EQRCategory.WIFI,
      wifiData: {
        ssid: "",
        password: "",
        security: DEFAULT_WIFI_SECURITY,
      },
      bankingData: {
        bankId: DEFAULT_BANK_ID,
        accountNo: "",
        accountName: "",
      },
      vcardData: {
        fullName: "",
        phone: "",
      },
      greetingData: {
        eventName: "",
        wishes: "",
        maxAttempts: DEFAULT_MAX_ATTEMPTS,
      },
    },
  });

  const qrType = watch("qrType");
  const category = watch("category");

  useEffect(() => {
    if (qrType === EQRType.STATIC) {
      setValue("category", EQRCategory.WIFI);
    } else {
      setValue("category", EQRCategory.VCARD);
    }
  }, [qrType, setValue]);

  const onSubmit = async (data: IQRFormValues) => {
    try {
      setLoading(true);
      await qrService.createQR(data);

      openSnackbar({
        type: "success",
        text: "Tạo mã QR thành công!",
        duration: 2000,
      });

      setTimeout(() => navigate(myQrsRoute), 1500);
    } catch (error) {
      console.error("Failed to create QR:", error);
      openSnackbar({
        type: "error",
        text: "Tạo mã QR thất bại. Vui lòng thử lại.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (errors: FieldErrors<IQRFormValues>) => {
    openSnackbar({
      type: "error",
      text: "Vui lòng kiểm tra lại các trường thông tin bắt buộc",
      duration: 3000,
    });
  };

  return (
    <Page className="bg-white">
      <Header title="Tạo mã QR mới" />

      <Box p={4} className="content">
        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <RadioFormField
            name="qrType"
            control={control}
            label="Kiểu mã QR"
            options={QR_TYPES}
            required
          />

          <SelectFormField
            name="category"
            control={control}
            label="Loại nội dung"
            options={qrType === EQRType.STATIC ? STATIC_CATEGORIES : DYNAMIC_CATEGORIES}
            required
          />

          <Box mt={4} className="bg-white p-4 rounded-lg shadow-sm border">
            {qrType === EQRType.STATIC && category === EQRCategory.WIFI && (
              <WifiForm control={control} />
            )}
            {qrType === EQRType.STATIC && category === EQRCategory.BANKING && (
              <BankingForm control={control} />
            )}
            {qrType === EQRType.DYNAMIC && category === EQRCategory.VCARD && (
              <VCardForm control={control} />
            )}
            {qrType === EQRType.DYNAMIC && category === EQRCategory.GREETING && (
              <GreetingForm control={control} />
            )}
          </Box>

          <Box
            p={4}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-8"
          >
            <Button
              fullWidth
              size="large"
              type="highlight"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Tạo mã QR
            </Button>
          </Box>
        </form>
      </Box>
    </Page>
  );
};

export default CreatePage;
