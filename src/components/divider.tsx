import { HTMLAttributes } from "react";

export interface IDividerProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal";
}

export const Divider = ({ direction = "horizontal", ...props }: IDividerProps) => {
  if (direction === "vertical") {
    return <div className="w-[1px] h-[16px] bg-gray-200 mx-2" {...props}></div>;
  }
  return <div className="w-full h-[1px] bg-gray-200 my-2"></div>;
};
