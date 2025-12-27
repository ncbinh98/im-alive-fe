"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import useAxios from "axios-hooks";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "@/configs/axios.constants";

export default function LoginWithAxiosHooks() {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      if (response.data.accessToken) {
        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, response.data.accessToken);
      }

      router.push("/me");
    } catch (err) {
      // Error handled by axios-hooks
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(145deg, #1e293b 0%, #334155 100%)"
                : "white",
            border: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                : "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: theme.palette.mode === "dark" ? "#f1f5f9" : "#2d3748",
              textAlign: "center",
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            color={theme.palette.mode === "dark" ? "text.secondary" : "text.secondary"}
            sx={{ mb: 4, textAlign: "center" }}
          >
            Sign in to your account
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor:
                  theme.palette.mode === "dark" ? "rgba(244, 67, 54, 0.1)" : undefined,
                border: theme.palette.mode === "dark" ? "1px solid rgba(244, 67, 54, 0.3)" : "none",
              }}
            >
              {error.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email
                      fontSize="small"
                      color={theme.palette.mode === "dark" ? "action" : "action"}
                    />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx:
                  theme.palette.mode === "dark"
                    ? {
                        color: "text.secondary",
                      }
                    : {},
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock
                      fontSize="small"
                      color={theme.palette.mode === "dark" ? "action" : "action"}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{
                        color: theme.palette.mode === "dark" ? "text.secondary" : "inherit",
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx:
                  theme.palette.mode === "dark"
                    ? {
                        color: "text.secondary",
                      }
                    : {},
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: "1rem",
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)"
                    : "linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)",
                "&:hover": {
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)"
                      : "linear-gradient(90deg, #303f9f 0%, #1976d2 100%)",
                },
                "&.Mui-disabled": {
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(90deg, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.5) 100%)"
                      : "linear-gradient(90deg, rgba(63, 81, 181, 0.5) 0%, rgba(33, 150, 243, 0.5) 100%)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Link
              href="/forgot-password"
              underline="hover"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: theme.palette.mode === "dark" ? "#94a3b8" : "primary.main",
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "#cbd5e1" : "primary.dark",
                },
              }}
            >
              Forgot password?
            </Link>

            <Link
              href="/register"
              underline="hover"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: theme.palette.mode === "dark" ? "#94a3b8" : "primary.main",
                "&:hover": {
                  color: theme.palette.mode === "dark" ? "#cbd5e1" : "primary.dark",
                },
              }}
            >
              Create account
            </Link>
          </Box>

          <Typography
            variant="body2"
            color={theme.palette.mode === "dark" ? "text.secondary" : "text.secondary"}
            sx={{ mt: 3, textAlign: "center", fontSize: "0.75rem", opacity: 0.7 }}
          >
            Demo: demo@example.com / password123
          </Typography>
        </Paper>

        <Typography
          variant="caption"
          color={theme.palette.mode === "dark" ? "text.secondary" : "text.secondary"}
          sx={{
            mt: 4,
            display: "block",
            textAlign: "center",
            opacity: 0.6,
          }}
        >
          © {new Date().getFullYear()} Your App. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
