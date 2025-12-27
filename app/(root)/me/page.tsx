"use client";
import {
  Box,
  Paper,
  Typography,
  Container,
  Chip,
  Button,
  Divider,
  Grid,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Person,
  Email,
  CalendarToday,
  CheckCircle,
  Edit,
  VerifiedUser,
  Refresh,
} from "@mui/icons-material";
import useAxios from "axios-hooks";

import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";

export default function ProfilePage() {
  const theme = useTheme();

  const [{ data: userData, loading, error }, refetch] = useAxios({
    method: "GET",
    url: "auth/me",
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  if (loading) {
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
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: theme.palette.mode === "dark" ? "#8b5cf6" : "#3f51b5",
          }}
        />
      </Box>
    );
  }

  if (error) {
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
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.mode === "dark" ? "rgba(244, 67, 54, 0.1)" : undefined,
              border: theme.palette.mode === "dark" ? "1px solid rgba(244, 67, 54, 0.3)" : "none",
            }}
          >
            Error loading profile: {error.message}
          </Alert>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => refetch()}
            sx={{
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
            }}
          >
            Retry
          </Button>
        </Container>
      </Box>
    );
  }

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
            p: { xs: 3, sm: 5 },
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
          {/* Header with Avatar */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                    : "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
                mb: 3,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 12px 40px rgba(99, 102, 241, 0.4)"
                    : "0 12px 40px rgba(63, 81, 181, 0.4)",
                border: "4px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {getInitials(userData?.firstName, userData?.lastName)}
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: theme.palette.mode === "dark" ? "#f1f5f9" : "#2d3748",
                mb: 1,
              }}
            >
              {userData?.firstName} {userData?.lastName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
              {userData?.isActive && (
                <Chip
                  icon={<CheckCircle fontSize="small" />}
                  label="Active"
                  color="success"
                  variant="outlined"
                  sx={{
                    borderColor:
                      theme.palette.mode === "dark" ? "rgba(34, 197, 94, 0.3)" : undefined,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "rgba(34, 197, 94, 0.1)" : undefined,
                  }}
                />
              )}
              <Chip
                icon={<VerifiedUser fontSize="small" />}
                label="Verified"
                color="primary"
                variant="outlined"
                sx={{
                  borderColor:
                    theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.3)" : undefined,
                  backgroundColor:
                    theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.1)" : undefined,
                }}
              />
            </Box>
          </Box>

          <Divider
            sx={{
              my: 4,
              borderColor:
                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* Profile Information */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Person fontSize="small" />
              Personal Information
            </Typography>

            <Grid container spacing={3}>
              {/* Email */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(30, 41, 59, 0.7)"
                        : "rgba(248, 250, 252, 0.8)",
                    border: "1px solid",
                    borderColor:
                      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#e2e8f0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 41, 59, 0.9)"
                          : "rgba(248, 250, 252, 1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        background:
                          theme.palette.mode === "dark"
                            ? "rgba(99, 102, 241, 0.2)"
                            : "rgba(99, 102, 241, 0.1)",
                      }}
                    >
                      <Email
                        sx={{
                          color: theme.palette.mode === "dark" ? "#8b5cf6" : "#6366f1",
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Email Address
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.mode === "dark" ? "#f1f5f9" : "#1e293b",
                          mt: 0.5,
                        }}
                      >
                        {userData?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* User ID */}

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(30, 41, 59, 0.7)"
                        : "rgba(248, 250, 252, 0.8)",
                    border: "1px solid",
                    borderColor:
                      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#e2e8f0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 41, 59, 0.9)"
                          : "rgba(248, 250, 252, 1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        background:
                          theme.palette.mode === "dark"
                            ? "rgba(59, 130, 246, 0.2)"
                            : "rgba(59, 130, 246, 0.1)",
                      }}
                    >
                      <Person
                        sx={{
                          color: theme.palette.mode === "dark" ? "#3b82f6" : "#3b82f6",
                        }}
                      />
                    </Box>
                    <Box sx={{ overflow: "hidden", flex: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          display: "block",
                        }}
                      >
                        User ID
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Tooltip title={userData?.id || ""} arrow placement="top">
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569",
                              fontFamily: "monospace",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                            }}
                          >
                            {userData?.id && userData.id.length > 30
                              ? `${userData.id.substring(0, 30)}...`
                              : userData?.id}
                          </Typography>
                        </Tooltip>

                        {userData?.id && (
                          <Tooltip title="Copy to clipboard" arrow>
                            <IconButton
                              size="small"
                              sx={{
                                color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                                "&:hover": {
                                  color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569",
                                },
                              }}
                              onClick={() => {
                                navigator.clipboard.writeText(userData.id);
                                // Add toast notification: "Copied to clipboard"
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Account Information */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569",
                mb: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CalendarToday fontSize="small" />
              Account Information
            </Typography>

            <Grid container spacing={3}>
              {/* Created At */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(30, 41, 59, 0.7)"
                        : "rgba(248, 250, 252, 0.8)",
                    border: "1px solid",
                    borderColor:
                      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#e2e8f0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 41, 59, 0.9)"
                          : "rgba(248, 250, 252, 1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Member Since
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.mode === "dark" ? "#f1f5f9" : "#1e293b",
                      mt: 1,
                    }}
                  >
                    {userData?.createdAt ? formatDate(userData.createdAt) : "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              {/* Last Updated */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(30, 41, 59, 0.7)"
                        : "rgba(248, 250, 252, 0.8)",
                    border: "1px solid",
                    borderColor:
                      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#e2e8f0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 41, 59, 0.9)"
                          : "rgba(248, 250, 252, 1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Last Updated
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.mode === "dark" ? "#f1f5f9" : "#1e293b",
                      mt: 1,
                    }}
                  >
                    {userData?.updatedAt ? formatDate(userData.updatedAt) : "N/A"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider
            sx={{
              my: 4,
              borderColor:
                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
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
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                borderColor:
                  theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
                color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569",
                "&:hover": {
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.3)"
                      : "rgba(0, 0, 0, 0.3)",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              Refresh
            </Button>
          </Box>
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
          Your profile • Always up to date
        </Typography>
      </Container>
    </Box>
  );
}
