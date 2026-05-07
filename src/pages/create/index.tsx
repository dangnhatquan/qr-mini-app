import React, { useEffect, useRef, useState } from "react";
import { Page, Button, Box, useSnackbar, Spinner } from "zmp-ui";
import { IconChevronLeft } from "@tabler/icons-react";
import { FieldErrors, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IQRFormValues, qrFormSchema } from "@/utils/schemas/qr";
import { RadioFormField } from "@/components/form-fields/radio-field";
import { SelectFormField } from "@/components/form-fields/select-field";
import { QR_TYPES, STATIC_CATEGORIES, DYNAMIC_CATEGORIES } from "./constants";
import { WifiForm } from "./components/wifi-form";
import { BankingForm } from "./components/banking-form";
import { VCardForm } from "./components/vcard-form";
import { GreetingForm } from "./components/greeting-form";
import { EQRType, EQRCategory } from "@/store";
import { qrService } from "@/services/qr";
import { cardService } from "@/services/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { myQrsRoute } from "@/utils/routes";
import { getString, removeItem, setString } from "@/utils/storage";
import { DEFAULT_BANK_ID, DEFAULT_MAX_ATTEMPTS, DEFAULT_WIFI_SECURITY } from "@/utils/constants/qr";

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const pendingNavRef = useRef<() => void>(() => navigate(myQrsRoute));

  const FORM_STATE_KEY = "createFormState";

  const savedFormState = React.useMemo(() => {
    try {
      const raw = getString(FORM_STATE_KEY);
      if (raw) return JSON.parse(raw) as IQRFormValues;
    } catch (error) {
      console.error(error);
    }
    return null;
  }, []);

  useEffect(() => {
    if (savedFormState) {
      removeItem(FORM_STATE_KEY);
    }
  }, [savedFormState]);

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { isDirty },
  } = useForm<IQRFormValues>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: savedFormState ?? {
      qrType: EQRType.STATIC,
      category: EQRCategory.WIFI,
      wifiData: { ssid: "", password: "", security: DEFAULT_WIFI_SECURITY },
      bankingData: { bankId: DEFAULT_BANK_ID, accountNo: "", accountName: "" },
      vcardData: { fullName: "", phone: "" },
      greetingData: {
        eventName: "",
        wishes: "",
        maxAttempts: DEFAULT_MAX_ATTEMPTS,
        cardId: undefined,
      },
    },
  });

  const hasFetchedRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchQR = async () => {
      if (!id || hasFetchedRef.current === id) return;
      try {
        setInitialLoading(true);
        const qr = await qrService.getQRDetail(id);
        if (qr) {
          hasFetchedRef.current = id;
          if (!savedFormState) {
            reset({
              qrType: qr.type as EQRType,
              category: qr.category as EQRCategory,
              wifiData: qr.payload?.wifiData,
              bankingData: qr.payload?.bankingData,
              vcardData: qr.payload?.vcardData,
              greetingData: qr.payload?.greetingData,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch QR detail:", error);
        openSnackbar({
          type: "error",
          text: "Không thể lấy thông tin mã QR",
          duration: 3000,
        });
      } finally {
        setInitialLoading(false);
      }
    };
    fetchQR();
  }, [id, reset, openSnackbar, savedFormState]);

  const qrType = useWatch({ control, name: "qrType" });
  const category = useWatch({ control, name: "category" });
  const greetingData = useWatch({ control, name: "greetingData" });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isEdit) return; // Disable auto-switching category when editing
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (qrType === EQRType.STATIC) {
      setValue("category", EQRCategory.WIFI);
    } else {
      setValue("category", EQRCategory.VCARD);
    }
  }, [qrType, setValue, isEdit]);

  const prevCategory = useRef(category);
  useEffect(() => {
    if (prevCategory.current === EQRCategory.GREETING && category !== EQRCategory.GREETING) {
      const cardId = greetingData?.cardId;
      if (cardId) {
        cardService.deleteCard(cardId).catch(console.warn);
        setValue("greetingData.cardId", undefined);
      }
    }
    prevCategory.current = category;
  }, [category, greetingData?.cardId, setValue]);

  const handleNavigateAway = (navFn?: () => void) => {
    const isGreeting = category === EQRCategory.GREETING && qrType === EQRType.DYNAMIC;
    const hasOrphanCard = isGreeting && greetingData?.cardId && !isEdit;

    if (isDirty || hasOrphanCard) {
      setShowExitConfirm(true);
    } else {
      navFn?.();
    }
  };

  const handleConfirmExit = async () => {
    const cardId = greetingData?.cardId;
    if (cardId) {
      try {
        await cardService.deleteCard(cardId);
      } catch (e) {
        console.warn("Failed to delete orphan card:", e);
      }
      setValue("greetingData.cardId", undefined);
    }
    setShowExitConfirm(false);
    pendingNavRef.current();
  };

  const onSubmit = async (data: IQRFormValues) => {
    try {
      setLoading(true);
      if (isEdit && id) {
        await qrService.updateQR(id, data);
        openSnackbar({
          type: "success",
          text: "Cập nhật mã QR thành công!",
          duration: 2000,
        });
      } else {
        await qrService.createQR(data);
        openSnackbar({
          type: "success",
          text: "Tạo mã QR thành công!",
          duration: 2000,
        });
      }

      setTimeout(() => navigate(myQrsRoute), 1500);
    } catch (error) {
      console.error("Failed to save QR:", error);
      openSnackbar({
        type: "error",
        text: `${isEdit ? "Cập nhật" : "Tạo"} mã QR thất bại. Vui lòng thử lại.`,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (_errors: FieldErrors<IQRFormValues>) => {
    openSnackbar({
      type: "error",
      text: "Vui lòng kiểm tra lại các trường thông tin bắt buộc",
      duration: 3000,
    });
  };

  const isLoading = initialLoading || loading;

  if (isLoading) {
    return (
      <Box className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Page className="bg-white">
      <div className="zaui-header absolute fixed flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="tertiary"
            icon={<IconChevronLeft size={24} className="text-black" />}
            onClick={() => handleNavigateAway(() => navigate(-1))}
          />
          <div className="zaui-header-title">
            {isEdit ? "Sửa thông tin mã QR" : "Tạo mã QR mới"}
          </div>
        </div>
      </div>

      <Box p={4} className="content">
        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          {!isEdit && (
            <>
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
            </>
          )}

          <Box mt={4} className="bg-white p-4 rounded-lg shadow-sm border">
            {qrType === EQRType.STATIC && category === EQRCategory.WIFI && (
              <WifiForm control={control} />
            )}
            {qrType === EQRType.STATIC && category === EQRCategory.BANKING && (
              <BankingForm control={control} />
            )}
            {qrType === EQRType.DYNAMIC && category === EQRCategory.VCARD && (
              <VCardForm control={control} setValue={setValue} />
            )}
            {qrType === EQRType.DYNAMIC && category === EQRCategory.GREETING && (
              <GreetingForm
                control={control}
                setValue={setValue}
                greetingData={greetingData}
                onBeforeEditorOpen={() => {
                  setString(FORM_STATE_KEY, JSON.stringify(getValues()));
                }}
              />
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
              disabled={loading || initialLoading}
            >
              {isEdit ? "Cập nhật mã QR" : "Tạo mã QR"}
            </Button>
          </Box>
        </form>
      </Box>

      {showExitConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-5 pb-3">
              <h2 className="text-base font-bold text-gray-900 mb-2">Thoát mà không lưu?</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Các thay đổi của bạn sẽ không được lưu.{" "}
                {category === EQRCategory.GREETING &&
                  qrType === EQRType.DYNAMIC &&
                  greetingData?.cardId &&
                  !isEdit &&
                  "Thiệp điện tử bạn vừa tạo cũng sẽ bị xóa."}{" "}
                Bạn có chắc muốn thoát không?
              </p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                className="flex-1 py-3.5 text-sm font-medium text-gray-600 border-r border-gray-100 active:bg-gray-50"
                onClick={() => setShowExitConfirm(false)}
              >
                Ở lại
              </button>
              <button
                className="flex-1 py-3.5 text-sm font-semibold text-red-500 active:bg-red-50"
                onClick={handleConfirmExit}
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

export default CreatePage;
