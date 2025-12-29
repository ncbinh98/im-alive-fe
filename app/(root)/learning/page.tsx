"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Container,
  Chip,
  Stack,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DataArrayIcon from "@mui/icons-material/DataArray";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CodeIcon from "@mui/icons-material/Code";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useRouter } from "next/navigation";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";

interface AlgorithmCard {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  tags: string[];
  color: "primary" | "secondary" | "info" | "success" | "warning";
}

export default function LearningPage() {
  const router = useRouter();
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const algorithmCards: AlgorithmCard[] = [
    {
      id: "monotonic-stack",
      title: "Monotonic Stack",
      description:
        "Visualize how monotonic stacks work to solve problems like Next Greater/Smaller Element",
      path: "/learning/monotonic-stack",
      icon: <StackedBarChartIcon fontSize="large" />,
      tags: ["Stack", "Array", "Pattern"],
      color: "primary",
    },
    {
      id: "two-pointers",
      title: "Two Pointers",
      description:
        "Learn the two-pointer technique for solving array and string problems efficiently",
      path: "/learning/two-pointers",
      icon: <TrendingUpIcon fontSize="large" />,
      tags: ["Array", "String", "Optimization"],
      color: "secondary",
    },
    {
      id: "sliding-window",
      title: "Sliding Window",
      description: "Master the sliding window pattern for substring and subarray problems",
      path: "/learning/sliding-window",
      icon: <DataArrayIcon fontSize="large" />,
      tags: ["Array", "String", "Window"],
      color: "info",
    },
    {
      id: "binary-search",
      title: "Binary Search",
      description: "Interactive binary search visualization for sorted arrays",
      path: "/learning/binary-search",
      icon: <TrendingDownIcon fontSize="large" />,
      tags: ["Search", "Sorted", "Log N"],
      color: "success",
    },
    {
      id: "dynamic-programming",
      title: "Dynamic Programming",
      description: "Step-by-step DP visualization for classic problems",
      path: "/learning/dp",
      icon: <PsychologyIcon fontSize="large" />,
      tags: ["Optimization", "Memoization", "Pattern"],
      color: "warning",
    },
    {
      id: "graph-traversal",
      title: "Graph Traversal",
      description: "BFS and DFS visualization with interactive nodes and edges",
      path: "/learning/graph",
      icon: <CodeIcon fontSize="large" />,
      tags: ["Graph", "BFS", "DFS"],
      color: "primary",
    },
  ];

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  const getCardBgColor = (color: AlgorithmCard["color"], isHovered: boolean) => {
    const baseColor = theme.palette[color].main;
    const darkColor = theme.palette[color].dark;
    return isHovered
      ? `linear-gradient(135deg, ${alpha(baseColor, 0.15)} 0%, ${alpha(darkColor, 0.1)} 100%)`
      : alpha(theme.palette.background.paper, 0.5);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Algorithm Visualizations
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: "auto", mb: 1 }}>
          Interactive visualizations to help you understand and master essential algorithms
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto", opacity: 0.8 }}
        >
          Click on any algorithm to explore its visualization and step-by-step execution
        </Typography>
      </Box>

      <Divider
        sx={{
          mb: 6,
          borderColor: alpha(theme.palette.divider, 0.3),
          "&::before, &::after": {
            borderColor: alpha(theme.palette.divider, 0.3),
          },
        }}
      />

      <Grid container spacing={3}>
        {algorithmCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.id}>
            <Card
              sx={{
                height: "100%",
                bgcolor: getCardBgColor(card.color, hoveredCard === card.id),
                backdropFilter: "blur(10px)",
                border: "1px solid",
                borderColor:
                  hoveredCard === card.id
                    ? alpha(theme.palette[card.color].main, 0.3)
                    : alpha(theme.palette.divider, 0.2),
                transition: "all 0.3s ease",
                transform: hoveredCard === card.id ? "translateY(-4px)" : "none",
                boxShadow:
                  hoveredCard === card.id
                    ? `0 12px 40px ${alpha(theme.palette[card.color].main, 0.2)}`
                    : "none",
                overflow: "visible",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette[card.color].main}, ${
                    theme.palette[card.color].light
                  })`,
                  borderTopLeftRadius: theme.shape.borderRadius,
                  borderTopRightRadius: theme.shape.borderRadius,
                },
              }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardActionArea
                onClick={() => handleCardClick(card.path)}
                sx={{ height: "100%", p: 2 }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    p: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette[card.color].main, 0.15),
                        color: theme.palette[card.color].light,
                        transition: "all 0.3s ease",
                        transform: hoveredCard === card.id ? "scale(1.1) rotate(5deg)" : "none",
                      }}
                    >
                      {card.icon}
                    </Box>
                    <ArrowForwardIcon
                      sx={{
                        color: alpha(theme.palette[card.color].main, 0.5),
                        transition: "all 0.3s ease",
                        transform: hoveredCard === card.id ? "translateX(4px)" : "none",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 2,
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      flexGrow: 1,
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {card.description}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {card.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette[card.color].main, 0.1),
                          color: theme.palette[card.color].light,
                          border: "1px solid",
                          borderColor: alpha(theme.palette[card.color].main, 0.3),
                          fontSize: "0.75rem",
                          height: 24,
                        }}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.2),
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.light }}>
          More Visualizations Coming Soon
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
          We&apos;re constantly adding new algorithm visualizations to help you learn. Stay tuned
          for more interactive learning tools!
        </Typography>
      </Box>
    </Container>
  );
}
