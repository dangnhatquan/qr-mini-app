import axios, { AxiosHeaders, AxiosInstance, AxiosRequestConfig } from "axios";
import { getString } from "../storage";

const PUBLIC_API_URL = import.meta.env.VITE_PUBLIC_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${PUBLIC_API_URL}/api/v1`,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getString("access_token");
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

const isAbsoluteURL = (url: string) => /^(?:[a-z+]+:)?\/\//i.test(url);

const request = {
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const instance = isAbsoluteURL(url) ? axios : axiosInstance;
    return instance.get<T>(url, config).then((response) => response.data);
  },

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const instance = isAbsoluteURL(url) ? axios : axiosInstance;
    return instance.post<T>(url, data, config).then((response) => response.data);
  },

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const instance = isAbsoluteURL(url) ? axios : axiosInstance;
    return instance.put<T>(url, data, config).then((response) => response.data);
  },

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const instance = isAbsoluteURL(url) ? axios : axiosInstance;
    return instance.delete<T>(url, config).then((response) => response.data);
  },
};

export default request;
