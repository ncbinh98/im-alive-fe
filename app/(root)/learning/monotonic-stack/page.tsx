"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  Card,
  CardContent,
  Alert,
  Grid,
  Chip,
  Divider,
  Slider,
  alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import InfoIcon from "@mui/icons-material/Info";
import SpeedIcon from "@mui/icons-material/Speed";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type MonotonicStackType = "increasing" | "decreasing";
type StackElement = {
  value: number;
  index: number;
  isActive: boolean;
  isProcessed: boolean;
  result?: number;
};

export default function MonotonicStackVisualizer() {
  const router = useRouter(); // Add this line
  const [inputArray, setInputArray] = useState<number[]>([10, 4, 6, 8, 2, 9, 3, 7]);
  const [newElement, setNewElement] = useState<string>("");
  const [stack, setStack] = useState<StackElement[]>([]);
  const [result, setResult] = useState<(number | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [stackType, setStackType] = useState<MonotonicStackType>("increasing");
  const [animationSpeed, setAnimationSpeed] = useState<number>(800);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    initializeVisualization();
  }, [inputArray, stackType]);

  const initializeVisualization = () => {
    setStack([]);
    setResult(new Array(inputArray.length).fill(null));
    setCurrentIndex(0);
    setStep(0);
    setIsAnimating(false);
  };

  const handleAddElement = () => {
    if (newElement.trim() === "") return;

    const num = parseInt(newElement, 10);
    if (!isNaN(num)) {
      setInputArray([...inputArray, num]);
      setNewElement("");
    }
  };

  const handleRemoveElement = (index: number) => {
    const newArray = [...inputArray];
    newArray.splice(index, 1);
    setInputArray(newArray);
    initializeVisualization();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddElement();
    }
  };

  const processNextStep = () => {
    if (currentIndex >= inputArray.length) {
      setIsAnimating(false);
      return;
    }

    const newStack = [...stack];
    const newResult = [...result];
    const currentValue = inputArray[currentIndex];

    if (stackType === "increasing") {
      while (newStack.length > 0 && currentValue < newStack[newStack.length - 1].value) {
        const popped = newStack.pop()!;
        newResult[popped.index] = currentValue;
      }
    } else {
      while (newStack.length > 0 && currentValue > newStack[newStack.length - 1].value) {
        const popped = newStack.pop()!;
        newResult[popped.index] = currentValue;
      }
    }

    newStack.push({
      value: currentValue,
      index: currentIndex,
      isActive: true,
      isProcessed: false,
    });

    setTimeout(() => {
      const updatedStack = newStack.map((el, idx) => ({
        ...el,
        isActive: idx === newStack.length - 1,
      }));

      setStack(updatedStack);
      setResult(newResult);
      setCurrentIndex(currentIndex + 1);
      setStep(step + 1);
    }, 500);
  };

  const startAnimation = () => {
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating && currentIndex < inputArray.length) {
      const timer = setTimeout(processNextStep, animationSpeed);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentIndex, animationSpeed]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: "0 auto" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/learning")}
        sx={{
          mb: 3,
          color: "primary.light",
          borderColor: "divider",
          "&:hover": {
            borderColor: "primary.light",
            bgcolor: "action.hover",
          },
        }}
        variant="outlined"
      >
        Back to Algorithms
      </Button>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 3,
          color: "primary.light",
          textAlign: "center",
        }}
      >
        Monotonic Stack Visualizer
      </Typography>

      <Alert
        severity="info"
        icon={<InfoIcon />}
        sx={{
          mb: 3,
          bgcolor: "primary.dark",
          color: "primary.light",
          border: "1px solid",
          borderColor: "primary.light",
        }}
      >
        Visualize how monotonic stacks process elements to find next greater/smaller elements
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              mb: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.light">
                Configuration
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Stack Type
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant={stackType === "increasing" ? "contained" : "outlined"}
                    onClick={() => setStackType("increasing")}
                    size="small"
                    sx={{
                      bgcolor: stackType === "increasing" ? "primary.main" : "transparent",
                      "&:hover": {
                        bgcolor: stackType === "increasing" ? "primary.dark" : "action.hover",
                      },
                    }}
                  >
                    Increasing
                  </Button>
                  <Button
                    variant={stackType === "decreasing" ? "contained" : "outlined"}
                    onClick={() => setStackType("decreasing")}
                    size="small"
                    sx={{
                      bgcolor: stackType === "decreasing" ? "primary.main" : "transparent",
                      "&:hover": {
                        bgcolor: stackType === "decreasing" ? "primary.dark" : "action.hover",
                      },
                    }}
                  >
                    Decreasing
                  </Button>
                </Stack>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  <SpeedIcon sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }} />
                  Animation Speed
                </Typography>
                <Slider
                  value={animationSpeed}
                  onChange={(_, value) => setAnimationSpeed(value as number)}
                  min={200}
                  max={2000}
                  step={100}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}ms`}
                  sx={{
                    color: "primary.main",
                    "& .MuiSlider-thumb": {
                      bgcolor: "primary.light",
                    },
                  }}
                />
              </Box>

              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={startAnimation}
                  disabled={isAnimating || currentIndex >= inputArray.length}
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "&:disabled": {
                      bgcolor: "action.disabledBackground",
                    },
                  }}
                >
                  {step === 0 ? "Start" : "Continue"}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={initializeVisualization}
                  startIcon={<RestartAltIcon />}
                  sx={{
                    borderColor: "secondary.main",
                    color: "secondary.light",
                    "&:hover": {
                      borderColor: "secondary.light",
                      bgcolor: alpha("#9c27b0", 0.1),
                    },
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.light">
                Add Elements
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    value={newElement}
                    onChange={(e) => setNewElement(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a number"
                    type="number"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "text.primary",
                        "& fieldset": {
                          borderColor: "divider",
                        },
                        "&:hover fieldset": {
                          borderColor: "primary.light",
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddElement}
                    disabled={!newElement.trim()}
                    startIcon={<AddIcon />}
                    sx={{
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                      "&:disabled": {
                        bgcolor: "action.disabledBackground",
                      },
                    }}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>

              <Divider
                sx={{
                  my: 2,
                  borderColor: "divider",
                  bgcolor: "divider",
                }}
              />

              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Current Array
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {inputArray.map((num, idx) => (
                  <Chip
                    key={idx}
                    label={`${num}`}
                    onDelete={() => handleRemoveElement(idx)}
                    deleteIcon={<RemoveIcon />}
                    color={idx === currentIndex ? "primary" : "default"}
                    variant={idx === currentIndex ? "filled" : "outlined"}
                    sx={{
                      mb: 1,
                      color: idx === currentIndex ? "primary.contrastText" : "text.primary",
                      bgcolor: idx === currentIndex ? "primary.main" : "action.selected",
                      borderColor: "divider",
                      "& .MuiChip-deleteIcon": {
                        color: idx === currentIndex ? "primary.contrastText" : "text.secondary",
                        "&:hover": {
                          color: idx === currentIndex ? "primary.light" : "primary.main",
                        },
                      },
                    }}
                  />
                ))}
              </Stack>

              {inputArray.length === 0 && (
                <Alert
                  severity="warning"
                  sx={{
                    mt: 2,
                    bgcolor: "warning.dark",
                    color: "warning.light",
                  }}
                >
                  Add numbers to visualize the algorithm
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              height: "100%",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" color="primary.light">
                  Algorithm Visualization
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    color: "text.secondary",
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      mr: 1,
                    }}
                  />
                  <Typography variant="caption">Current</Typography>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                      mx: 2,
                    }}
                  />
                  <Typography variant="caption">Processed</Typography>
                </Box>
              </Box>

              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: "action.selected",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Current Index
                    </Typography>
                    <Typography variant="h6" color="primary.light">
                      {currentIndex < inputArray.length ? currentIndex : "Done!"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Step
                    </Typography>
                    <Typography variant="h6" color="secondary.light">
                      {step}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Current Value
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      {currentIndex < inputArray.length ? inputArray[currentIndex] : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Stack Size
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      {stack.length}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Typography variant="subtitle1" gutterBottom color="primary.light">
                Monotonic Stack ({stackType})
              </Typography>
              <Box
                sx={{
                  minHeight: 250,
                  border: "2px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column-reverse",
                  alignItems: "center",
                  bgcolor: "background.default",
                  backgroundImage:
                    "linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))",
                }}
              >
                {stack.length === 0 ? (
                  <Typography color="text.secondary" sx={{ my: 4, opacity: 0.7 }}>
                    Stack is empty - Start the algorithm to see elements
                  </Typography>
                ) : (
                  stack.map((element, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        width: "85%",
                        p: 2,
                        mb: 1.5,
                        textAlign: "center",
                        bgcolor: element.isActive
                          ? "primary.main"
                          : element.isProcessed
                          ? "success.dark"
                          : "action.selected",
                        color: element.isActive ? "primary.contrastText" : "text.primary",
                        transition: "all 0.3s ease",
                        transform: element.isActive ? "scale(1.02)" : "scale(1)",
                        boxShadow: element.isActive ? 4 : 1,
                        border: "1px solid",
                        borderColor: element.isActive ? "primary.light" : "divider",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": element.isActive
                          ? {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 3,
                              bgcolor: "primary.light",
                            }
                          : {},
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {element.value}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Index: {element.index}
                      </Typography>
                      {element.result !== undefined && (
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ color: "success.light" }}
                        >
                          → {element.result}
                        </Typography>
                      )}
                    </Paper>
                  ))
                )}
              </Box>

              <Typography variant="subtitle1" gutterBottom color="primary.light" sx={{ mt: 4 }}>
                Results (Next {stackType === "increasing" ? "Smaller" : "Greater"} Element)
              </Typography>
              <Grid container spacing={2}>
                {result.map((res, idx) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={idx}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: idx < currentIndex ? "action.selected" : "background.paper",
                        border: "2px solid",
                        borderColor: idx === currentIndex ? "primary.main" : "divider",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "primary.light",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Typography variant="caption" display="block" color="text.secondary">
                        arr[{idx}]
                      </Typography>
                      <Typography variant="h6" color="primary.light" sx={{ my: 1 }}>
                        {inputArray[idx]}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={res !== null ? "success.light" : "text.secondary"}
                      >
                        → {res !== null ? res : "?"}
                      </Typography>
                      {res !== null && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "success.main",
                            mx: "auto",
                            mt: 1,
                          }}
                        />
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Alert
                severity="info"
                sx={{
                  mt: 4,
                  bgcolor: "info.dark",
                  color: "info.light",
                  border: "1px solid",
                  borderColor: "info.light",
                }}
                icon={<InfoIcon sx={{ color: "info.light" }} />}
              >
                <Typography variant="body2">
                  {stackType === "increasing"
                    ? "Finding next smaller elements: Popping elements while current is smaller, setting popped elements' result to current value"
                    : "Finding next greater elements: Popping elements while current is greater, setting popped elements' result to current value"}
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
