import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { storage } from "../storage";
import { ApiErrorResponse, ApiResponse } from "@/types/api";
import { openSnackbar } from "@/utils/snackbar";
import { t } from "@/utils/i18n";

const PUBLIC_API_URL = import.meta.env.VITE_PUBLIC_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${PUBLIC_API_URL}/api/v1`,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

export const sanitizePayloadUrls = (payload: any): any => {
  if (!payload) return payload;
  if (payload instanceof Blob || payload instanceof File) return payload;
  if (typeof FormData !== "undefined" && payload instanceof FormData) return payload;

  try {
    const isString = typeof payload === "string";
    const payloadStr = isString ? payload : JSON.stringify(payload);
    const uuidRegex = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/gi;

    const sanitizedStr = payloadStr.replace(
      /https?:\/\/[^\s"']*(?:s3|amazonaws|127\.0\.0\.1:9000|localhost:9000|minio)[^\s"']+/gi,
      (match) => {
        const ids = match.match(uuidRegex);
        if (ids && ids.length > 0) {
          const fileId = ids[ids.length - 1];
          return `/api/v1/files/serve/${fileId}`;
        }
        return match;
      },
    );

    return isString ? sanitizedStr : JSON.parse(sanitizedStr);
  } catch (error) {
    console.error("Error sanitizing payload URLs:", error);
    return payload;
  }
};

axiosInstance.interceptors.request.use((config) => {
  const token = storage.getItem("access_token");
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  if (config.data && ["post", "put", "patch"].includes(config.method?.toLowerCase() || "")) {
    config.data = sanitizePayloadUrls(config.data);
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const { code, details } = error.response.data.error;

      if (code === "UNAUTHORIZED" || code === "TOKEN_EXPIRED") {
        storage.removeItem("access_token");
      }

      if (error.response.status === 413 || code === "FILE_TOO_LARGE") {
        openSnackbar({
          type: "countdown",
          duration: 5000,
          text: t("errors.FILE_TOO_LARGE"),
        });
      } else if (code === "VALIDATION_ERROR" && details) {
        details.forEach((detail: any) => {
          const translatedMsg = t(`errors.${detail.message}`);
          console.error(`${detail.field}: ${translatedMsg}`);
        });
      } else if (code) {
        openSnackbar({
          type: "error",
          text: t(`errors.${code}`),
        });
      }
    }
    return Promise.reject(error);
  },
);

const isAbsoluteURL = (url: string) => /^(?:[a-z+]+:)?\/\//i.test(url);

const request = {
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const instance = isAbsoluteURL(url) ? axios : axiosInstance;
    return instance.get<ApiResponse<T>>(url, config).then((response) => response.data);
  },

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const instance = isAbsoluteURL(url) ? axios : axiosInstance;
    return instance.post<ApiResponse<T>>(url, data, config).then((response) => response.data);
  },

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const instance = isAbsoluteURL(url) ? axios : axiosInstance;
    return instance.put<ApiResponse<T>>(url, data, config).then((response) => response.data);
  },

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const instance = isAbsoluteURL(url) ? axios : axiosInstance;
    return instance.delete<ApiResponse<T>>(url, config).then((response) => response.data);
  },

  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const instance = isAbsoluteURL(url) ? axios : axiosInstance;
    return instance.patch<ApiResponse<T>>(url, data, config).then((response) => response.data);
  },
};

export const getFullUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  return `${PUBLIC_API_URL}${path}`;
};

export const cleanFileUrl = (url: string): string => {
  if (!url) return url;
  const uuidRegex = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i;
  if (
    url.includes("/api/v1/files/serve/") ||
    url.includes("s3") ||
    url.includes("amazonaws") ||
    url.includes("127.0.0.1:9000") ||
    url.includes("localhost:9000") ||
    url.includes("minio")
  ) {
    const match = url.match(uuidRegex);
    if (match) {
      return `/api/v1/files/serve/${match[1]}`;
    }
  }
  return url;
};

export const getErrorMessage = (error: unknown, defaultMessage = "Đã có lỗi xảy ra") => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const code = axiosError.response?.data?.error?.code;
    if (code) {
      return t(`errors.${code}`);
    }
    return axiosError.response?.data?.error?.message || axiosError.message || defaultMessage;
  }
  return defaultMessage;
};

export default request;
