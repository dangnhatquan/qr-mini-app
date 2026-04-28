import React from "react";
import { Box, Icon, Text } from "zmp-ui";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBackIcon?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBackIcon = true }) => {
  const navigate = useNavigate();

  return (
    <Box
      flex
      alignItems="center"
      className="fixed top-0 left-0 right-0 bg-white z-[100] border-b border-gray-100"
      style={{ height: "96px", padding: "0 16px" }}
    >
      <Box className="w-10 flex items-center">
        {showBackIcon && (
          <div
            onClick={() => navigate(-1)}
            className="w-6 h-6 flex items-center justify-center active:bg-gray-100 rounded-full cursor-pointer transition-colors"
          >
            <Icon icon="zi-chevron-left" className="text-gray-900" size={24} />
          </div>
        )}
      </Box>

      <Box className="flex-1 flex justify-center px-4">
        <Text size="large" className="font-bold text-gray-900 truncate text-center">
          {title}
        </Text>
      </Box>

      <Box className="w-10" />
    </Box>
  );
};
