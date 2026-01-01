import axios, { type InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "./service/auth.service";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipAuth?: boolean;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;
const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    // Skip auth for specific requests
    if (config._skipAuth) {
      return config;
    }

    // Get access token
    const token = await getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._skipAuth
    ) {
      originalRequest._retry = true;
      localStorage.removeItem("access_token");
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
