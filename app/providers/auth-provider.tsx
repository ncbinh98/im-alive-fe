"use client";

import "@/configs/axios.config";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
export default function AuthProvider({ children, session }: { children: ReactNode; session: any }) {
  const [interval, setInterval] = useState(0);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
