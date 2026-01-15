"use client";

import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme,
  Stack,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  CheckCircleOutline,
  Timeline,
  History,
  LocalFireDepartment as FireIcon,
  EmojiEvents,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState, useMemo } from "react";
import useAxios from "axios-hooks";

// --- Types ---
type CheckInHistory = {
  id: string;
  userId: string;
  checkedInAt: string;
  notes: string;
};

// --- Constants ---
const CHECK_IN_QUOTES: string[] = [
  "I showed up today, and that is enough.",
  "Progress doesn’t need to be loud to be real.",
  "Today counts, even if nothing special happened.",
  "Small steps are how long journeys continue.",
  "Consistency beats motivation.",
  "Another day lived is another day learned.",
  "Even quiet days deserve recognition.",
  "I’m building something by simply not giving up.",
  "Showing up is a form of courage.",
  "Growth happens even when it feels invisible.",
  "Today didn’t break me — that’s a win.",
  "One honest day at a time.",
];

function getRandomQuote() {
  return CHECK_IN_QUOTES[Math.floor(Math.random() * CHECK_IN_QUOTES.length)];
}

// --- Components ---

function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}) {
  return (
    <Card sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          opacity: 0.1,
          transform: "rotate(15deg) scale(2.5)",
          color: color,
        }}
      >
        {icon}
      </Box>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Avatar sx={{ bgcolor: `${color}22`, color: color }}>{icon}</Avatar>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
        </Stack>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const theme = useTheme();
  const [{ data: histories = [], loading, error }, refetch] = useAxios<CheckInHistory[]>({
    url: "/check-in/history",
    method: "GET",
  });

  const [{ loading: checkingIn }, checkIn] = useAxios(
    {
      url: "/check-in",
      method: "POST",
    },
    { manual: true }
  );

  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [quote, setQuote] = useState("");

  const handleOpen = () => {
    setQuote(getRandomQuote());
    setNotes("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckIn = async () => {
    await checkIn({
      data: { notes },
    });
    handleClose();
    refetch();
  };

  // --- Derived State (Stats) ---
  const stats = useMemo(() => {
    if (!histories || histories.length === 0) {
      return { total: 0, streak: 0, lastCheckIn: null };
    }

    const sorted = [...histories].sort(
      (a, b) => new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime()
    );

    const total = histories.length;
    const lastCheckIn = sorted[0];

    // Simple streak calculation (consecutive days)
    // For now, let's just count total check-ins as the main "metric" to show progress

    // Let's do a simple distinct day count as 'Active Days'
    const uniqueDays = new Set(sorted.map((h) => new Date(h.checkedInAt).toDateString())).size;

    return { total, activeDays: uniqueDays, lastCheckIn };
  }, [histories]);

  // Greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      {/* Header Section */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "start", md: "center" }}
        spacing={2}
        mb={5}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {greeting}, Creator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ready to track your progress today?
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<CheckCircleOutline />}
          onClick={handleOpen}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: "50px",
            fontSize: "1.1rem",
            boxShadow: `0 8px 20px -4px ${theme.palette.primary.main}66`,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          }}
        >
          Check In Now
        </Button>
      </Stack>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Check-ins"
            value={stats.total}
            icon={<History fontSize="inherit" />}
            color={theme.palette.primary.main}
            subtitle="Keep showing up!"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Active Days"
            value={stats.activeDays || 0}
            icon={<EmojiEvents fontSize="inherit" />}
            color={theme.palette.secondary.main}
            subtitle="Distinct days recorded"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {/* Quote Card (Spans as a stat or visual) */}
          <Card
            sx={{
              height: "100%",
              background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic", mb: 1 }}
              >
                Daily Inspiration
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                "{getRandomQuote()}"
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent History Section */}
      <Typography variant="h5" fontWeight={700} mb={3}>
        Recent Journey
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center">
          Failed to load history.
        </Typography>
      )}

      {!loading && stats.total === 0 && (
        <Box textAlign="center" py={8} sx={{ opacity: 0.7 }}>
          <Typography variant="h6">No check-ins yet.</Typography>
          <Typography variant="body2">Start your journey today!</Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {histories.map((item) => (
          <Grid size={{ xs: 12 }} key={item.id}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  bgcolor: "rgba(255,255,255,0.03)",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "transparent",
                  border: `1px solid ${theme.palette.divider}`,
                  color: theme.palette.text.secondary,
                }}
              >
                <CheckCircleOutline fontSize="small" />
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date(item.checkedInAt).toLocaleString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                {item.notes && (
                  <Typography variant="body1" fontWeight={500}>
                    {item.notes}
                  </Typography>
                )}
                {!item.notes && (
                  <Typography variant="body2" fontStyle="italic" color="text.disabled">
                    No notes added
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Check-in Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: theme.palette.background.paper,
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 0, pt: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={700}>
              Check In
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box
            sx={{
              p: 2,
              mb: 3,
              bgcolor: "rgba(144, 202, 249, 0.08)",
              borderRadius: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Reflect on this:
            </Typography>
            <Typography variant="body1" fontStyle="italic" fontWeight={500}>
              "{quote}"
            </Typography>
          </Box>
          <TextField
            label="How are you feeling properly? (Notes)"
            placeholder="I'm showing up today because..."
            fullWidth
            multiline
            minRows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 4 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCheckIn}
            disabled={checkingIn}
            disableElevation
            sx={{ px: 4 }}
          >
            {checkingIn ? "Saving..." : "Confirm Check-in"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
