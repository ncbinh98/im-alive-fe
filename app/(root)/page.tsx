"use client";
import { Card, CardContent, Typography, CardActions, Button, Grid, Box, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function Home() {
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
    setCheckInCount((prev) => prev + 1);
  };

  const formatLifeNumber = (value: number, compact = false) => {
    if (typeof value !== "number") return value;

    return new Intl.NumberFormat("en-US", {
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : 0,
    }).format(value);
  };

  return (
    <div>
      <Grid container justifyContent="center" alignItems="center" minHeight="100vh">
        <Card
          sx={{
            minWidth: 300,
            maxWidth: 500,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <AccessTimeIcon color="primary" />
              <Typography variant="h5" component="div" color="primary">
                Still Alive Counter
              </Typography>
            </Box>

            <Typography gutterBottom sx={{ color: "text.secondary", mb: 3, fontStyle: "italic" }}>
              Since January 1, 1998
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                { label: "Years", value: timeUnits.years },
                { label: "Months", value: timeUnits.months },
                { label: "Days", value: timeUnits.days },
                { label: "Hours", value: timeUnits.hours },
                { label: "Minutes", value: timeUnits.minutes },
                { label: "Seconds", value: timeUnits.seconds },
              ].map((item, index) => (
                <Grid size={6} key={item.label}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "background.paper",
                      border: index === 5 ? "1px solid" : "1px solid",
                      borderColor: index === 5 ? "primary.main" : "divider",
                      borderRadius: 2,
                      boxShadow: index === 5 ? 1 : 0,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: index === 5 ? "#673ab7" : "action.hover",
                        borderColor: index === 5 ? "#673ab7" : "divider",
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                        cursor: "pointer", // Add this line
                      },
                    }}
                  >
                    <Typography variant="h4" color="primary">
                      {formatLifeNumber(item.value)}
                    </Typography>
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Typography variant="body2" sx={{ mb: 2 }}>
              I'm still alive for:
            </Typography>

            {checkInCount > 0 && (
              <Chip
                icon={<CheckCircleIcon />}
                label={`${checkInCount} check-in${checkInCount > 1 ? "s" : ""}`}
                color="success"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
          </CardContent>

          <CardActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={handleCheckIn}
              sx={{ px: 4 }}
            >
              Check-in Alive
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </div>
  );
}
