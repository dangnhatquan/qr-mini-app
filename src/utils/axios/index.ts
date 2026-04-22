import { API_BASE_URL, PUBLIC_API_URL, PREFIX_API_V1 } from "@/api";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";

const BASE_URL = `${PUBLIC_API_URL}${API_BASE_URL}${PREFIX_API_V1}`;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

const request = {
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.get<T>(url, config).then((response) => response.data);
  },

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return axiosInstance.post<T>(url, data, config).then((response) => response.data);
  },

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return axiosInstance.put<T>(url, data, config).then((response) => response.data);
  },

  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return axiosInstance.patch<T>(url, data, config).then((response) => response.data);
  },

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.delete<T>(url, config).then((response) => response.data);
  },
};

export { axiosInstance };
export default request;