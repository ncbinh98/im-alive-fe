"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Container,
  Button,
  // ... other MUI imports
} from "@mui/material";
import useAxios from "axios-hooks";
// ... your existing profile UI code

export default function ProfilePageClient({ user }: { user: any }) {
  const router = useRouter();
  const [{ data: userData, loading, error }, refetch] = useAxios({
    method: "GET",
    url: "/auth/me",
  });

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  // Use your existing profile UI, replace userData with `user`
  return (
    // Your existing profile UI
    <div>
      {loading ? "Loading..." : JSON.stringify(userData)}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
