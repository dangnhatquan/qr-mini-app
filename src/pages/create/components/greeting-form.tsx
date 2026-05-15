import React, { useEffect, useRef, useState } from "react";
import { Control, UseFormSetValue } from "react-hook-form";
import { InputFormField } from "@/components/form-fields/input-field";
import { IQRFormValues } from "@/utils/schemas/qr";
import { Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { cardEditorRoute } from "@/utils/routes";
import { cardService } from "@/services/card";
import { getFullUrl } from "@/utils/axios";
import {
  IconExclamationCircle,
  IconCircleCheck,
  IconPlus,
  IconGiftCard,
} from "@tabler/icons-react";
import { storage } from "@/utils/storage";

interface GreetingFormProps {
  control: Control<IQRFormValues>;
  setValue: UseFormSetValue<IQRFormValues>;
  greetingData?: {
    eventName?: string;
    cardId?: string;
  };
  onBeforeEditorOpen?: () => void;
}

export const GreetingForm: React.FC<GreetingFormProps> = ({
  control,
  setValue,
  greetingData,
  onBeforeEditorOpen,
}) => {
  const navigate = useNavigate();
  const savedCardId = greetingData?.cardId || null;

  const [preview, setPreview] = useState<{ id: string | null; url: string | null }>({
    id: null,
    url: null,
  });
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (!savedCardId) return;

      setLoadingPreview(true);
      try {
        const card = await cardService.getCard(savedCardId);
        setPreview({
          id: savedCardId,
          url: card.previewImage?.path ? getFullUrl(card.previewImage.path) : null,
        });
      } catch {
        setPreview({ id: savedCardId, url: null });
      } finally {
        setLoadingPreview(false);
      }
    };

    fetchCar();
  }, [savedCardId]);

  const previewImageUrl = preview.id === savedCardId ? preview.url : null;

  const handleVisibilityChange = useRef(() => {
    const pending = storage.getItem("pendingCardId");
    if (pending) {
      setValue("greetingData.cardId", pending);
      storage.removeItem("pendingCardId");
    }
  });

  useEffect(() => {
    const cb = handleVisibilityChange.current;
    window.addEventListener("focus", cb);
    document.addEventListener("visibilitychange", cb);
    cb();
    return () => {
      window.removeEventListener("focus", cb);
      document.removeEventListener("visibilitychange", cb);
    };
  }, []);

  const handleOpenEditor = () => {
    onBeforeEditorOpen?.();
    const url = savedCardId ? `${cardEditorRoute}?cardId=${savedCardId}` : cardEditorRoute;
    navigate(url);
  };

  return (
    <>
      <div className="mb-1">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Thông tin</h3>

        <InputFormField
          name="greetingData.eventName"
          control={control}
          label="Tên thiệp"
          placeholder="VD: Thiệp sinh nhật, Thiệp cưới..."
          required
        />

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-600 block mb-2">Hình ảnh thiệp</label>

          {savedCardId ? (
            <div className="rounded-xl overflow-hidden border border-green-200 bg-green-50">
              <div className="relative w-full aspect-[350/450] bg-gray-100">
                {loadingPreview ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : previewImageUrl ? (
                  <img
                    src={previewImageUrl}
                    alt="Xem trước thiệp"
                    className="w-full h-full object-cover"
                    onError={() => setPreview({ id: savedCardId, url: null })}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <IconExclamationCircle />
                    <span className="text-xs">Không tải được ảnh xem trước</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-3 py-2 border-t border-green-100">
                <div className="flex items-center gap-2">
                  <IconCircleCheck className="text-green-600 w-4 h-4" />
                  <span className="text-xs font-semibold text-green-700">Thiệp đã được tạo</span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenEditor}
                  className="text-xs text-blue-primary font-semibold underline"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconGiftCard />
                </div>
                <p className="text-sm text-gray-400 italic">
                  Chưa có thiệp — hãy tạo thiệp bên dưới
                </p>
              </div>
              <Button
                type="neutral"
                size="medium"
                prefixIcon={<IconPlus />}
                onClick={handleOpenEditor}
                fullWidth
              >
                Tạo thiệp
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Bảo mật (Tùy chọn)</h3>
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
