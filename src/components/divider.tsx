export interface IDividerProps {
  direction?: "vertical" | "horizontal";
}

export const Divider = ({ direction = "horizontal" }: IDividerProps) => {
  if (direction === "vertical") {
    return <div className="w-[1px] h-[16px] bg-gray-200 mx-2"></div>;
  }
  return <div className="w-full h-[1px] bg-gray-200 my-2"></div>;
};
