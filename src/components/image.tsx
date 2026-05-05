import { preloadImage } from "@/utils/helpers/image";
import React, { useEffect, useState } from "react";
import { IconGridDots } from "@tabler/icons-react";

interface IImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const Image = ({ src, ...props }: IImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (!src) return;

    preloadImage(src, (base64) => {
      setImgSrc(base64);
    });
  }, [src]);

  if (!imgSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-300">
        <IconGridDots />
      </div>
    );
  }

  return <img src={imgSrc} {...props} />;
};
