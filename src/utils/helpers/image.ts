import request, { getFullUrl } from "../axios";
import { filesResource, getPresignedUrl } from "@/resources";

export const resizeImage = (
  base64: string,
  maxWidth: number,
  maxHeight: number,
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(base64);
  });
};

export const preloadImage = async (
  url: string,
  onSuccess: (base64: string) => void,
  onFail?: (error: unknown) => void,
  options?: { maxWidth?: number; maxHeight?: number },
) => {
  try {
    const fullUrl = getFullUrl(url);
    const res = await fetch(fullUrl);

    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);

    const blob = await res.blob();
    const reader = new FileReader();

    reader.onloadend = async () => {
      let result = reader.result as string;
      if (options?.maxWidth || options?.maxHeight) {
        result = await resizeImage(result, options.maxWidth || 800, options.maxHeight || 800);
      }
      onSuccess(result);
    };

    reader.onerror = (e) => {
      if (onFail) onFail(e);
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("preloadImage error:", error);
    if (onFail) onFail(error);
  }
};

export const uploadFile = async (
  blob: Blob | File,
  sessionId?: string,
): Promise<{ id: string; path: string }> => {
  const response = await request.get<{
    file: { id: string; path: string };
    uploadSignedUrl: string;
  }>(getPresignedUrl, {
    params: {
      sessionId,
      fileSize: blob.size,
    },
  });

  const { uploadSignedUrl, file } = response.data;

  await request.put(uploadSignedUrl, blob, {
    headers: { "Content-Type": blob.type || "image/png" },
  });

  return file;
};

export const getImageDimensions = (blob: Blob) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = URL.createObjectURL(blob);
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
  });
};

export const deleteFile = async (fileId?: string | null): Promise<void> => {
  if (!fileId) {
    console.info("⚠️ deleteFile called without ID. Skipping.");
    return;
  }
  console.info("🚀 Attempting to delete file from S3. ID:", fileId);
  try {
    const response = await request.delete(`${filesResource}/${fileId}`);
    console.info("✅ File deleted successfully:", fileId, response.data);
  } catch (error) {
    console.error("❌ deleteFile error for ID:", fileId, error);
  }
};
