import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page, Box, Text, Button, Spinner, Header, Input, useSnackbar, useNavigate } from "zmp-ui";
import { qrService } from "@/services/qr";
import { cardService } from "@/services/card";
import { QrCode, GreetingQRData } from "@/types/qr";
import { CardRenderer } from "./components/CardRenderer";
import { myQrsRoute } from "@/utils/routes";
import { IconLoader, IconLock } from "@tabler/icons-react";

const GreetingDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [qr, setQr] = useState<QrCode | null>(null);
  const [card, setCard] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await qrService.getQRDetail(id);
        setQr(data);

        const greetingData = data.payload?.greetingData as GreetingQRData;

        if (!greetingData?.password) {
          setIsAuthorized(true);
          if (greetingData?.cardId) {
            const cardData = await cardService.getCard(greetingData.cardId);
            setCard(cardData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch Greeting detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAuthorize = async () => {
    if (!qr) return;
    const greetingData = qr.payload?.greetingData as GreetingQRData;

    if (password === greetingData.password) {
      setIsAuthorized(true);
      if (greetingData.cardId) {
        try {
          const cardData = await cardService.getCard(greetingData.cardId);
          setCard(cardData);
        } catch (e) {
          console.error("Failed to fetch card content:", e);
        }
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const max = greetingData.maxAttempts || 5;

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

  if (loading) {
    return (
      <Page className="flex items-center justify-center bg-gray-50">
        <Spinner />
      </Page>
    );
  }

  if (!qr || !qr.payload?.greetingData) {
    return (
      <Page className="bg-gray-50">
        <Header title="Chi tiết QR" />
        <Box p={4} className="content flex flex-col items-center justify-center h-full">
          <Text className="text-gray-500">Không tìm thấy thông tin chi tiết</Text>
        </Box>
      </Page>
    );
  }

  const greetingData = qr.payload.greetingData as GreetingQRData;

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

  if (!isAuthorized) {
    return (
      <Page className="bg-white">
        <Header title="Yêu cầu mật khẩu" />
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
    <Page className="bg-gray-100 overflow-y-auto pb-10">
      <Header
        title={greetingData.eventName}
        onBackClick={() => navigate(myQrsRoute, { direction: "backward" })}
      />

      <Box p={4} className="h-full flex flex-col justify-center items-center">
        {card ? (
          <Box className="w-full max-w-[350px]">
            <CardRenderer
              elements={card.editorStage?.elements || []}
              canvasBg={card.editorStage?.canvasBg || "#ffffff"}
            />
          </Box>
        ) : (
          <Box className="w-full aspect-[350/450] bg-white rounded-xl shadow-lg flex items-center justify-center flex-col gap-4">
            <IconLoader className="animate-spin" />
            <Text className="text-gray-400">Đang tải nội dung thiệp...</Text>
          </Box>
        )}

        <Box mt={6} className="w-full text-center px-4">
          <Text className="text-gray-400 text-xs italic mb-4">
            Thiệp điện tử được tạo bởi QR Mini App
          </Text>

          {greetingData.wishes && (
            <Box className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/80 shadow-sm mt-2">
              <Text className="text-gray-600 leading-relaxed">{greetingData.wishes}</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default GreetingDetailPage;
