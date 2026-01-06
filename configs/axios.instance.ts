// lib/axios-instance.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3003";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add NextAuth token interceptor
axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Only run on client side
  if (typeof window !== "undefined") {
    try {
      console.log("@@@RUNING API");
      const session = await getSession({broadcast: false});
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      console.error("Failed to get session:", error);
    }
  }
  return config;
});

// Add response interceptor for token refresh
// Response interceptor - just log errors, NextAuth handles refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log error but don't handle refresh here
    return Promise.reject(error);
  }
);

export default axiosInstance;
