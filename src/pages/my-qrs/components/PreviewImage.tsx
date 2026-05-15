import { useEffect, useState } from "react";
import { IconGridDots } from "@tabler/icons-react";

export const PreviewImage = ({ src }: { src: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoading(true);
  }

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    const handleLoad = () => {
      if (isMounted) setIsLoading(false);
    };

    if (img.complete) {
      Promise.resolve().then(handleLoad);
    } else {
      img.onload = handleLoad;
      img.onerror = handleLoad;
    }

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-10 w-full h-full animate-pulse flex flex-col items-center justify-center gap-4 bg-gray-50">
          <IconGridDots size={48} className="text-gray-200" />
          <div className="w-1/3 h-2 bg-gray-200 rounded-full opacity-50" />
        </div>
      )}
      <img
        src={src}
        alt="QR Code"
        className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        crossOrigin="anonymous"
      />
    </>
  );
};
