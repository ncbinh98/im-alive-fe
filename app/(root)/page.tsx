"use client";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Box,
  Chip,
  useTheme,
  Container,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const theme = useTheme();
  const [timeUnits, setTimeUnits] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [checkInCount, setCheckInCount] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date("1998-01-01").getTime();
      const now = new Date().getTime();
      const diffInMs = now - start;

      const seconds = Math.floor(diffInMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30.4375);
      const years = Math.floor(days / 365.25);

      setTimeUnits({ years, months, days, hours, minutes, seconds });
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();

    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    // setCheckInCount((prev) => prev + 1);
    router.push("/me");
  };

  const formatLifeNumber = (value: number) => {
    if (typeof value !== "number") return value;
    return new Intl.NumberFormat("en-US").format(value);
  };

  const timeUnitsData = [
    { label: "Years", value: timeUnits.years },
    { label: "Months", value: timeUnits.months },
    { label: "Days", value: timeUnits.days },
    { label: "Hours", value: timeUnits.hours },
    { label: "Minutes", value: timeUnits.minutes },
    { label: "Seconds", value: timeUnits.seconds },
  ];

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
      <Container maxWidth="md">
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
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 2,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)"
                    : "linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)",
                mb: 3,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 8px 32px rgba(99, 102, 241, 0.3)"
                    : "0 8px 32px rgba(63, 81, 181, 0.3)",
              }}
            >
              <FavoriteIcon sx={{ fontSize: 32, color: "white" }} />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 0.5,
                color: theme.palette.mode === "dark" ? "#f1f5f9" : "#2d3748",
              }}
            >
              Still Alive Counter
            </Typography>
            <Typography
              variant="body1"
              color={theme.palette.mode === "dark" ? "text.secondary" : "text.secondary"}
              sx={{ mb: 4 }}
            >
              Counting every moment since January 1, 1998
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {timeUnitsData.map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.label}>
                <Box
                  sx={{
                    p: 2,
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(30, 41, 59, 0.7)"
                        : "rgba(255, 255, 255, 0.9)",
                    border: index === 5 ? "2px solid" : "1px solid",
                    borderColor:
                      index === 5
                        ? theme.palette.mode === "dark"
                          ? "#8b5cf6"
                          : "#2196f3"
                        : theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "#e2e8f0",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        index === 5
                          ? theme.palette.mode === "dark"
                            ? "rgba(139, 92, 246, 0.2)"
                            : "rgba(33, 150, 243, 0.1)"
                          : theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)",
                      transform: "translateY(-4px)",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 8px 25px rgba(0, 0, 0, 0.2)"
                          : "0 8px 25px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background:
                        index === 5
                          ? theme.palette.mode === "dark"
                            ? "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)"
                            : "linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)"
                          : theme.palette.mode === "dark"
                            ? "linear-gradient(90deg, #94a3b8 0%, #cbd5e1 100%)"
                            : "linear-gradient(90deg, #64748b 0%, #475569 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    {formatLifeNumber(item.value)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569",
                fontStyle: "italic",
                mr: 2,
              }}
            >
              I'm still alive for:
            </Typography>

            {checkInCount > 0 && (
              <Chip
                icon={<CheckCircleIcon />}
                label={`${checkInCount} check-in${checkInCount > 1 ? "s" : ""}`}
                color="success"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.mode === "dark" ? "rgba(34, 197, 94, 0.3)" : undefined,
                  backgroundColor:
                    theme.palette.mode === "dark" ? "rgba(34, 197, 94, 0.1)" : undefined,
                }}
              />
            )}
          </Box>

          <CardActions sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={handleCheckIn}
              sx={{
                px: 4,
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
                  transform: "translateY(-2px)",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 12px 40px rgba(99, 102, 241, 0.4)"
                      : "0 12px 40px rgba(63, 81, 181, 0.4)",
                },
              }}
            >
              Check-in Alive
            </Button>
          </CardActions>
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
          Every second counts. Keep living! ❤️
        </Typography>
      </Container>
    </Box>
  );
}
