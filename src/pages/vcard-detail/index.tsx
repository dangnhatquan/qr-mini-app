import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page, Box, Text, Icon, Button, Spinner } from "zmp-ui";
import { Header } from "@/components/Header";
import { qrService } from "@/services/qr";
import { QrCode, VCardQRData } from "@/types/qr";
import { openPhone, openWebview } from "zmp-sdk/apis";

const VCardDetailPage: React.FC = () => {
  const { id } = useParams();
  const [qr, setQr] = useState<QrCode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await qrService.getQRDetail(id);
        setQr(data);
      } catch (error) {
        console.error("Failed to fetch VCard detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <Page className="flex items-center justify-center bg-gray-50">
        <Spinner />
      </Page>
    );
  }

  if (!qr || !qr.payload?.vcardData) {
    return (
      <Page className="bg-gray-50">
        <Header title="Chi tiết QR" />
        <Box p={4} className="content flex flex-col items-center justify-center h-full">
          <Text className="text-gray-500">Không tìm thấy thông tin chi tiết</Text>
        </Box>
      </Page>
    );
  }

  const vcardData = qr.payload.vcardData as VCardQRData;

  const handleCall = () => {
    if (vcardData?.phone) {
      openPhone({ phoneNumber: vcardData.phone });
    }
  };

  const handleEmail = () => {
    if (vcardData?.email) {
      window.location.href = `mailto:${vcardData.email}`;
    }
  };

  const handleWebsite = () => {
    if (vcardData?.website) {
      openWebview({ url: vcardData.website });
    }
  };

  return (
    <Page className="bg-gray-50 pb-10">
      <Header title={"Danh thiếp điện tử"} />

      {vcardData && (
        <>
          <Box className="content bg-white p-6 flex flex-col items-center shadow-sm border-b">
            <Box className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 overflow-hidden border-2 border-blue-500 shadow-md">
              {vcardData.fullName ? (
                <Text className="text-3xl font-bold text-blue-600">
                  {vcardData.fullName.charAt(0).toUpperCase()}
                </Text>
              ) : (
                <Icon icon="zi-user" className="text-blue-500" size={48} />
              )}
            </Box>
            <Text size="xLarge" className="font-bold text-gray-900 text-center">
              {vcardData.fullName || "N/A"}
            </Text>
            {vcardData.position && (
              <Text className="text-blue-600 font-medium mt-1">{vcardData.position}</Text>
            )}
            {vcardData.company && (
              <Text className="text-gray-500 text-sm mt-1">{vcardData.company}</Text>
            )}
          </Box>

          <Box flex className="px-4 py-6 gap-4 bg-white mb-2 shadow-sm">
            <Button
              fullWidth
              icon={<Icon icon="zi-call" />}
              onClick={handleCall}
              className="bg-green-500"
            >
              Gọi
            </Button>
            {vcardData.email && (
              <Button fullWidth variant="secondary" onClick={handleEmail}>
                Email
              </Button>
            )}
          </Box>

          <Box className="mt-2 bg-white shadow-sm overflow-hidden">
            <Box
              p={4}
              className="border-b flex items-center gap-4 active:bg-gray-50"
              onClick={handleCall}
            >
              <Box className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Icon icon="zi-call" className="text-green-600" size={20} />
              </Box>
              <Box className="flex-1">
                <Text className="text-gray-400 text-xs uppercase font-semibold">Số điện thoại</Text>
                <Text className="text-gray-800 font-medium">{vcardData.phone || "N/A"}</Text>
              </Box>
            </Box>

            {vcardData.email && (
              <Box
                p={4}
                className="border-b flex items-center gap-4 active:bg-gray-50"
                onClick={handleEmail}
              >
                <Box className="flex-1">
                  <Text className="text-gray-400 text-xs uppercase font-semibold">Email</Text>
                  <Text className="text-gray-800 font-medium">{vcardData.email}</Text>
                </Box>
              </Box>
            )}

            {vcardData.website && (
              <Box
                p={4}
                className="border-b flex items-center gap-4 active:bg-gray-50"
                onClick={handleWebsite}
              >
                <Box className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Icon icon="zi-link" className="text-purple-600" size={20} />
                </Box>
                <Box className="flex-1">
                  <Text className="text-gray-400 text-xs uppercase font-semibold">Website</Text>
                  <Text className="text-blue-600 font-medium">{vcardData.website}</Text>
                </Box>
              </Box>
            )}
          </Box>
        </>
      )}

      <Box p={8} className="flex flex-col items-center">
        <Text className="text-gray-300 text-xs italic">Tạo bởi Zalo Mini App QR</Text>
      </Box>
    </Page>
  );
};

export default VCardDetailPage;
