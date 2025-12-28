"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import "@/configs/axios.config";
export default function AuthProvider({ children, session }: { children: ReactNode; session: any }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
