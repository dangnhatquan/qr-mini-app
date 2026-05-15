import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { storage } from "../storage";
import { ApiErrorResponse, ApiResponse } from "@/types/api";

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

axiosInstance.interceptors.request.use((config) => {
  const token = storage.getItem("access_token");
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const { code, message, details } = error.response.data.error;

      if (code === "VALIDATION_ERROR") {
        console.error("Validation Error:", details);
      }

      if (code === "UNAUTHORIZED" || code === "TOKEN_EXPIRED") {
        storage.removeItem("access_token");
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
  if (path.startsWith("http")) return path;
  return `${PUBLIC_API_URL}${path}`;
};

export default request;
