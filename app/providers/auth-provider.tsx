"use client";

import "@/configs/axios.config";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
export default function AuthProvider({ children, session }: { children: ReactNode; session: any }) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={0}>
      {children}
    </SessionProvider>
  );
}
