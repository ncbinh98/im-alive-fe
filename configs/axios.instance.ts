import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_ACCESS_TOKEN_KEY,
} from "./axios.constants";

const baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3003";

// Type-safe token getter
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  }
  return null;
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor with proper typing
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _skipRefresh?: boolean;
    };

    // Define paths that should skip refresh logic
    const skipRefreshPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh", // Important: Don't refresh the refresh call itself!
      "/public/",
    ];

    // Get the request URL
    const requestUrl = originalRequest.url || "";

    // Check if this path should skip refresh
    const shouldSkipRefresh = skipRefreshPaths.some((path) => requestUrl.includes(path));

    if (shouldSkipRefresh) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Safely get refresh token
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem(LOCAL_STORAGE_REFRESH_ACCESS_TOKEN_KEY)
            : null;

        if (!refreshToken) {
          //   throw new Error("No refresh token");
          //handle later
        }

        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data as { accessToken: string };

        // Safely store new token
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
        }

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Clear tokens safely
        if (typeof window !== "undefined") {
          localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
          localStorage.removeItem(LOCAL_STORAGE_REFRESH_ACCESS_TOKEN_KEY);
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
