"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Container,
  Button,
  Avatar,
  Grid,
  Chip,
  Skeleton,
  Alert,
  Divider,
  Stack,
  IconButton,
  alpha,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import useAxios from "axios-hooks";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserData } from "@/app/interfaces/user.interface";

export default function ProfilePageClient() {
  const router = useRouter();
  const [{ data: userData, loading, error }, refetch] = useAxios<UserData>({
    method: "GET",
    url: "/auth/me",
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  const handleEditProfile = () => {
    // Navigate to edit profile page
    router.push("/profile/edit");
  };

  const handleBackDashboard = () => {
    // Navigate to edit profile page
    router.push("/dashboard");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Skeleton variant="circular" width={120} height={120} />
              <Stack spacing={2} sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="40%" height={30} />
              </Stack>
            </Stack>
            <Divider />
            {[1, 2, 3, 4].map((item) => (
              <Stack key={item} direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width="70%" height={30} />
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (error) {
    if (error.response?.status === 401) {
      handleLogout();
    }

    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert
          severity="error"
          sx={{ borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Failed to load profile data. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(
              theme.palette.background.paper,
              1,
            )} 100%)`,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            alignItems={{ xs: "center", sm: "flex-start" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={4} alignItems="center" sx={{ width: "100%" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 40,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  border: (theme) => `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                {userData ? getUserInitials(userData.firstName, userData.lastName) : "U"}
              </Avatar>

              <Stack sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                  {userData?.firstName} {userData?.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {userData?.email}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                  <Chip
                    icon={userData?.isActive ? <ActiveIcon /> : <InactiveIcon />}
                    label={userData?.isActive ? "Active" : "Inactive"}
                    color={userData?.isActive ? "success" : "error"}
                    variant="outlined"
                    size="small"
                  />
                  <Chip icon={<SecurityIcon />} label="Member" variant="outlined" size="small" />
                </Stack>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackDashboard}
                sx={{ borderRadius: 3 }}
              >
                Back To Dashboard
              </Button>
              {/* <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
                sx={{ borderRadius: 3 }}
              >
                Edit Profile
              </Button> */}
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ borderRadius: 3 }}
              >
                Logout
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Profile Details Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
            Account Details
          </Typography>

          <Grid container spacing={3}>
            {/* Personal Information Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
                  Personal Information
                </Typography>

                <Box sx={{ mt: 3 }}>
                  {/* Name Field */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        bgcolor: "#292929",
                        color: "primary.main",
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Full Name
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {userData?.firstName} {userData?.lastName}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Email Field */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        bgcolor: "#292929",
                        color: "info.main",
                      }}
                    >
                      <EmailIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Email Address
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {userData?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Account Information Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom color="primary">
                  Account Information
                </Typography>

                <Box sx={{ mt: 3 }}>
                  {/* Member Since */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        bgcolor: "#292929",
                        color: "success.main",
                      }}
                    >
                      <CalendarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Member Since
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {userData ? formatDate(userData.createdAt) : "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Last Updated */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        bgcolor: "#292929",
                        color: "warning.main",
                      }}
                    >
                      <CalendarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Last Updated
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {userData ? formatDate(userData.updatedAt) : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Additional Information Section */}
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
            Account Information
          </Typography>

          <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  User ID
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                  }}
                >
                  {userData?.id.slice(0, 8)}...
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.02),
                  border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {userData?.isActive ? "Active ✓" : "Inactive ✗"}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.02),
                  border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Email Verified
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  Verified ✓
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.02),
                  border: (theme) => `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Account Type
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  Standard
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: "divider" }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            {/* <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push("/security")}
              sx={{ borderRadius: 3 }}
            >
              Security Settings
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push("/notifications")}
              sx={{ borderRadius: 3 }}
            >
              Notification Preferences
            </Button> */}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleRefresh}
              sx={{ borderRadius: 3 }}
            >
              Refresh Data
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
