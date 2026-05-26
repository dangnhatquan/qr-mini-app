import React, { useState, useEffect, useRef } from "react";
import { openSnackbar } from "@/utils/snackbar";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholder?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  placeholder = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
  alt,
  className,
  onLoad,
  ...props
}) => {
  const [isIntersected, setIsIntersected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    const currentRef = imgRef.current;

    if (currentRef && !isIntersected) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsIntersected(true);
              if (observer && currentRef) {
                observer.unobserve(currentRef);
              }
            }
          });
        },
        { rootMargin: "80px" }, // Tải ảnh trước khi nó hiển thị 80px
      );
      observer.observe(currentRef);
    }

    return () => {
      if (observer && currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isIntersected]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (src && (src.includes("s3") || src.includes("amazonaws"))) {
      openSnackbar({
        text: "Ảnh có thể đã hết hạn, vui lòng tải lại trang để làm mới",
        type: "warning",
      });
    }
    if (props.onError) {
      props.onError(e);
    }
  };

  return (
    <img
      ref={imgRef}
      src={isIntersected ? src : placeholder}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={`transition-all duration-300 ${
        isLoaded ? "opacity-100" : "opacity-70 bg-gray-200 animate-pulse"
      } ${className || ""}`}
      {...props}
    />
  );
};

export default LazyImage;
