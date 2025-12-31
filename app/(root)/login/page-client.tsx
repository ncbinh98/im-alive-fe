"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  useTheme,
  alpha,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginPageClient({ user }: { user: any }) {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if(user) router.push("/me");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/me");
        router.refresh(); // Refresh server components
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
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
            ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(
                theme.palette.primary.dark,
                0.3
              )} 100%)`
            : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            background:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.9)
                : theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === "dark"
                ? `0 8px 32px ${alpha(theme.palette.common.black, 0.3)}`
                : `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
          }}
        >
          <Typography variant="h4" sx={{ mb: 1, textAlign: "center", fontWeight: 600 }}>
            Welcome
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
            Sign in to your account
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                background: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              }}
            >
              {error}
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
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              slotProps={{
                inputLabel: {
                  sx: {
                    color: theme.palette.mode === "dark" ? theme.palette.text.secondary : "inherit",
                  },
                },
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
                      sx={{
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                      }}
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
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.grey[400]
                            : theme.palette.grey[600],
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              slotProps={{
                inputLabel: {
                  sx: {
                    color: theme.palette.mode === "dark" ? theme.palette.text.secondary : "inherit",
                  },
                },
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
                    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                    : undefined,
                "&:hover": {
                  background:
                    theme.palette.mode === "dark"
                      ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                      : undefined,
                },
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: theme.palette.mode === "dark" ? theme.palette.common.white : undefined,
                  }}
                />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
