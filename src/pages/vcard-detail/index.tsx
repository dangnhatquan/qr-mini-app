import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Page, Box, Text, Button, Spinner, Header, Avatar, useNavigate } from "zmp-ui";
import { IconMail, IconPhone, IconWorld, IconUserCircle } from "@tabler/icons-react";
import { qrService } from "@/services/qr";
import { QrCode, VCardQRData } from "@/types/qr";
import { openPhone, openWebview } from "zmp-sdk/apis";
import { getFullUrl } from "@/utils/axios";
import { myQrsRoute } from "@/utils/routes";

const VCardDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    <Page className="bg-white pb-10">
      <Header
        title="Danh thiếp điện tử"
        onBackClick={() => navigate(myQrsRoute, { direction: "backward" })}
      />
      <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="hexagons"
              width="10"
              height="17.32"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1)"
            >
              <polygon
                points="5,0 10,2.88 10,8.66 5,11.54 0,8.66 0,2.88"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.2"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hexagons)" />
        </svg>
      </div>

      <Box className="relative px-6 -mt-16 z-10">
        <Box flex alignItems="center" justifyContent="center" className="mb-6 relative">
          <div className="relative">
            {vcardData.avatar ? (
              <div className="p-1 bg-white rounded-full shadow-xl">
                <Avatar
                  src={getFullUrl(vcardData.avatar)}
                  size={120}
                  className="border-4 border-blue-500"
                  backgroundColor="BLUE-BLUELIGHT"
                />
              </div>
            ) : (
              <Box className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                <Text className="text-4xl font-bold text-blue-600">
                  {vcardData.fullName?.charAt(0).toUpperCase() || "U"}
                </Text>
              </Box>
            )}
            <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
          </div>
        </Box>

        <Box className="mb-8">
          <Text size="xLarge" className="font-bold text-blue-500 text-2xl mb-1">
            {vcardData.fullName || "N/A"}
          </Text>
          <Text className="text-gray-500 font-medium text-base">
            {vcardData.position || "Professional"}
            {vcardData.company ? ` tại ${vcardData.company}` : ""}
          </Text>
        </Box>

        <div className="grid grid-cols-2 gap-3">
          <Box
            className="bg-blue-500 p-4 rounded-xl shadow-md cursor-pointer active:opacity-80 transition-opacity"
            onClick={handleEmail}
          >
            <IconMail className="text-blue-300 mb-2" size={20} />
            <Text className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
              E-mail
            </Text>
            <Text className="text-white text-xs font-medium truncate">
              {vcardData.email || "N/A"}
            </Text>
          </Box>

          <Box
            className="bg-blue-500 p-4 rounded-xl shadow-md cursor-pointer active:opacity-80 transition-opacity"
            onClick={handleCall}
          >
            <IconPhone className="text-green-300 mb-2" size={20} />
            <Text className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
              Số điện thoại
            </Text>
            <Text className="text-white text-xs font-medium">{vcardData.phone || "N/A"}</Text>
          </Box>

          <Box
            className="bg-blue-500 p-4 rounded-xl shadow-md cursor-pointer active:opacity-80 transition-opacity"
            onClick={handleWebsite}
          >
            <IconWorld className="text-purple-300 mb-2" size={20} />
            <Text className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
              Website
            </Text>
            <Text className="text-white text-xs font-medium truncate">
              {vcardData.website || "N/A"}
            </Text>
          </Box>

          <Box className="bg-blue-500 p-4 rounded-xl shadow-md cursor-pointer active:opacity-80 transition-opacity">
            <IconUserCircle className="text-red-300 mb-2" size={20} />
            <Text className="text-white/60 text-[10px] uppercase font-bold tracking-wider mb-1">
              Mạng xã hội
            </Text>
            <Text className="text-white text-xs font-medium">
              {vcardData.socialLinks || "Global"}
            </Text>
          </Box>
        </div>
      </Box>
    </Page>
  );
};

export default VCardDetailPage;
