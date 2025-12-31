// app/dashboard/layout.tsx
"use client";

import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Inventory as InventoryIcon,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import Link from "next/link"; // Import Next.js Link
import { usePathname, useRouter } from "next/navigation"; // Import navigation hooks
import theme from "@/app/theme";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, href: "/dashboard" },
  { text: "Users", icon: <PeopleIcon />, href: "/dashboard/users" },
  { text: "Products", icon: <InventoryIcon />, href: "/dashboard/products" },
  { text: "Analytics", icon: <AnalyticsIcon />, href: "/dashboard/analytics" },
  { text: "Settings", icon: <SettingsIcon />, href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  // Navigation handler for client-side routing
  const handleNavigation = (href: string) => {
    router.push(href);
    // Close mobile drawer on navigation
    if (mobileOpen) {
      handleDrawerClose();
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          // const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isActive= pathname === item.href
          return (
            <ListItem key={item.text} disablePadding>
              {/* Solution 1A: Using Next.js Link (Recommended) */}
              <Link href={item.href} passHref style={{ textDecoration: "none", color: "inherit" }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => handleNavigation(item.href)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "rgba(144, 202, 249, 0.16)",
                      "&:hover": {
                        backgroundColor: "rgba(144, 202, 249, 0.24)",
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? "primary.main" : "inherit" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <DynamicBreadcrumbs />
            </Box>

            <Typography variant="h6" noWrap component="div">
              <Button onClick={() => handleNavigation("/me")} variant="text">
                {user.name}
              </Button>
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Drawer for mobile */}
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            minHeight: "100vh",
            backgroundColor: "background.default",
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// Updated Breadcrumbs component with Next.js Link
function DynamicBreadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter((path) => path);
    const breadcrumbs: any = [];

    let currentPath = "";
    paths.forEach((path) => {
      currentPath += `/${path}`;
      breadcrumbs.push({
        label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />} aria-label="breadcrumb">
      <MuiLink
        component={Link}
        href="/dashboard"
        color="inherit"
        underline="hover"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </MuiLink>

      {breadcrumbs.map((breadcrumb: any, index: number) => {
        const isLast = index === breadcrumbs.length - 1;

        return isLast ? (
          <Typography key={breadcrumb.href} color="text.primary">
            {breadcrumb.label}
          </Typography>
        ) : (
          <MuiLink
            key={breadcrumb.href}
            component={Link}
            href={breadcrumb.href}
            color="inherit"
            underline="hover"
          >
            {breadcrumb.label}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
}
