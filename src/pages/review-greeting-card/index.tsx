import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page, Box, Text, Button, Spinner, Header, Input, useSnackbar, useNavigate } from "zmp-ui";
import { EQRCategory, EQRType, GreetingQRData, useCardStore, useQRStore } from "@/store";
import { createRoute } from "@/utils/routes";
import { IconDownload, IconLock } from "@tabler/icons-react";
import { saveImageToGallery, showToast } from "zmp-sdk/apis";
import { getFullUrl } from "@/utils/axios";
import { PreviewImage } from "../my-qrs/components/PreviewImage";

const ReviewGreetingDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const { selectedQR, isFetchingSelectedQR, fetchQRDetail } = useQRStore();
  const { card, isFetching, fetchCard, error: cardError } = useCardStore();

  const isAuthorized = !!(card && card.editorStage);
  const hasPassword = !!selectedQR?.payload?.greetingData?.hasPassword;
  const isLoading = isFetching || isFetchingSelectedQR;

  useEffect(() => {
    if (id) {
      fetchQRDetail(id);
    }
  }, [id, fetchQRDetail]);

  const handleDownload = async () => {
    if (!card) return;
    try {
      await saveImageToGallery({
        imageUrl: getFullUrl(card.previewImage.path),
      });
      showToast({ message: "Lưu ảnh thành công" });
    } catch (error) {
      console.error("Save image error:", error);
      showToast({ message: "Lưu ảnh thất bại hoặc bị từ chối quyền" });
    }
  };

  const handleAuthorize = async () => {
    const greetingData = selectedQR?.payload?.greetingData as GreetingQRData;
    if (!greetingData?.cardId) return;

    try {
      await fetchCard(greetingData.cardId, password);
    } catch {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const max = 5;

      if (newAttempts >= max) {
        setIsLocked(true);
        openSnackbar({
          type: "error",
          text: "Đã vượt quá số lần nhập sai. Bạn đã bị khóa!",
          duration: 3000,
        });
      } else {
        openSnackbar({
          type: "error",
          text: `Mật khẩu không đúng. Còn ${max - newAttempts} lần thử!`,
          duration: 2000,
        });
      }
    }
  };

  useEffect(() => {
    const greetingData = selectedQR?.payload?.greetingData as GreetingQRData;
    if (greetingData?.cardId && !card && !cardError && !isFetching) {
      fetchCard(greetingData.cardId).catch(() => {
        // Expected if password protected
      });
    }
  }, [selectedQR, card, cardError, isFetching, fetchCard]);

  if (isLoading) {
    return (
      <Page className="flex items-center justify-center bg-gray-50">
        <Spinner />
      </Page>
    );
  }

  if (!selectedQR || !selectedQR?.payload?.greetingData) {
    return (
      <Page className="bg-gray-50">
        <Header title="Chi tiết QR" />
        <Box p={4} className="content flex flex-col items-center justify-center h-full">
          <Text className="text-gray-500">Không tìm thấy thông tin chi tiết</Text>
        </Box>
      </Page>
    );
  }

  const greetingData = selectedQR?.payload?.greetingData as GreetingQRData;

  if (isLocked) {
    return (
      <Page className="bg-gray-50">
        <Header title="Truy cập bị từ chối" />
        <Box p={4} className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <IconLock />
          </div>
          <Text size="large" className="font-bold text-gray-900 mb-2">
            Truy cập bị khóa
          </Text>
          <Text className="text-gray-500 mb-6 px-10">
            Bạn đã nhập sai mật khẩu quá nhiều lần. Vui lòng liên hệ với người tạo thiệp.
          </Text>
          <Button onClick={() => navigate(-1)} type="neutral">
            Quay lại
          </Button>
        </Box>
      </Page>
    );
  }

  if (hasPassword && !isAuthorized) {
    return (
      <Page className="bg-white">
        <Box p={6} className="h-full flex flex-col justify-center items-center pt-10">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <IconLock />
          </div>
          <Text className="text-gray-500 text-center mb-8 px-4">
            Vui lòng nhập mật khẩu để xem thiệp điện tử: <br />
            <span className="font-bold text-gray-800">{greetingData.eventName}</span>
          </Text>

          <Box className="w-full mb-6">
            <Input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center text-lg"
            />
          </Box>

          <Button fullWidth onClick={handleAuthorize} size="large">
            Mở thiệp
          </Button>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="relative bg-gray-100 overflow-y-auto pb-10">
      <Box p={4} className="h-full flex flex-col justify-center items-center gap-4">
        {card ? (
          <Box className="w-full">
            {card?.previewImage?.path ? (
              <PreviewImage src={getFullUrl(card.previewImage.path)} />
            ) : (
              <Box className="w-full aspect-[350/450] bg-gray-100 rounded-xl flex items-center justify-center">
                <Text className="text-gray-400">Thiệp chưa được tạo</Text>
              </Box>
            )}
          </Box>
        ) : (
          <Box className="w-full aspect-[350/450] bg-white rounded-xl shadow-lg flex items-center justify-center flex-col gap-4">
            <Text className="text-gray-400">Thiệp chưa được tạo</Text>
          </Box>
        )}

        <div className="fixed bottom-6 right-4 flex gap-4">
          <Button
            variant="primary"
            onClick={() =>
              navigate(`${createRoute}?type=${EQRType.DYNAMIC}&category=${EQRCategory.GREETING}`)
            }
            size="large"
            className="px-6"
          >
            Tạo thiệp ngay
          </Button>

          <Button icon={<IconDownload />} onClick={handleDownload} size="large" />
        </div>
      </Box>
    </Page>
  );
};

export default ReviewGreetingDetailPage;
