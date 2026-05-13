import React from "react";
import { Box } from "zmp-ui";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

export interface IAccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
}

export const Accordion = ({ title, children, isOpen, onClick }: IAccordionProps) => {
  return (
    <Box className="border-b border-gray-100 last:border-0">
      <div
        className="flex items-center justify-between p-4 bg-white active:bg-gray-50 transition-colors"
        onClick={onClick}
      >
        <span className="font-semibold text-gray-800">{title}</span>
        {isOpen ? (
          <IconChevronUp className="text-gray-400 w-5 h-5" />
        ) : (
          <IconChevronDown className="text-gray-400 w-5 h-5" />
        )}
      </div>
      {isOpen && (
        <Box p={4} className="bg-gray-50/50">
          {children}
        </Box>
      )}
    </Box>
  );
};
