export const FocusIcon = () => (
  <div className="relative w-5 h-5 flex items-center justify-center">
    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-current rounded-tl-[2px]" />
    <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-current rounded-tr-[2px]" />
    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-current rounded-bl-[2px]" />
    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-current rounded-br-[2px]" />
    <div className="w-1.5 h-1.5 bg-current rounded-full" />
  </div>
);
