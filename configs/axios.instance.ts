// lib/axios-instance.ts
import axios from "axios";
import { getSession } from "next-auth/react";
// Always use absolute URL or properly configured base URL
const baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3003";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add NextAuth token interceptor
axiosInstance.interceptors.request.use(async (config) => {
  // Only run on client side
  if (typeof window !== "undefined") {
    try {
      const session = await getSession();

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      console.error("Failed to get session:", error);
    }
  }

  return config;
});

export default axiosInstance;
