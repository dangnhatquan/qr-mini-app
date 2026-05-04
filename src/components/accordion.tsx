import React from "react";
import { Box, Icon } from "zmp-ui";

export interface IAccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

export const Accordion = ({ title, children, isOpen, onClick }: IAccordionProps) => {
  return (
    <Box className="border-b border-gray-100 last:border-0">
      <div
        className="flex items-center justify-between p-4 bg-white active:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <Icon icon={isOpen ? "zi-chevron-up" : "zi-chevron-down"} className="text-gray-400" />
      </div>
      {isOpen && (
        <Box p={4} className="bg-gray-50/50">
          {children}
        </Box>
      )}
    </Box>
  );
};
