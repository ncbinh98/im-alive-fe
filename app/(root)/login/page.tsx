"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography, Container, Paper, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import useAxios from "axios-hooks";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "@/configs/axios.constants";

export default function LoginWithAxiosHooks() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [{ loading, error }, loginExecute] = useAxios(
    {
      url: "/auth/login",
      method: "POST",
    },
    { manual: true }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginExecute({
        data: { email, password },
      });

      // Store token
      if (response.data.accessToken) {
        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, response.data.accessToken);
      }

      // Redirect
      router.push("/me");
    } catch (err) {
      // Error is already handled by axios-hooks
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button type="submit" fullWidth variant="contained" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
