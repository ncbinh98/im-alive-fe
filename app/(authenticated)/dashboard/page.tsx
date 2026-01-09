"use client";

import {
  Box,
  Stack,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useState } from "react";
import useAxios from "axios-hooks";

type CheckInHistory = {
  id: string;
  userId: string;
  checkedInAt: string;
  notes: string;
};

const CHECK_IN_QUOTES: string[] = [
  "I showed up today, and that is enough.",
  "Progress doesn’t need to be loud to be real.",
  "Today counts, even if nothing special happened.",
  "I’m still here, still trying, still moving.",
  "Small steps are how long journeys continue.",
  "I don’t need to be perfect to keep going.",
  "Consistency beats motivation.",
  "Another day lived is another day learned.",
  "I chose to pause and acknowledge myself today.",
  "Even quiet days deserve recognition.",
  "I’m building something by simply not giving up.",
  "This moment matters more than I think.",
  "Showing up is a form of courage.",
  "I honored today by being present.",
  "Growth happens even when it feels invisible.",
  "I’m allowed to move forward at my own pace.",
  "Today didn’t break me — that’s a win.",
  "I’m still becoming who I want to be.",
  "Checking in means I care about myself.",
  "One honest day at a time.",
  "I don’t need clarity to keep walking.",
  "This is part of my story, even if it’s ordinary.",
  "I stayed, and that matters.",
  "I’m learning how to live, not rushing through it.",
  "Today was real — and that’s enough.",
  "I chose awareness over autopilot.",
  "Life continues because I do.",
  "I showed respect to myself by checking in.",
  "This habit is proof I haven’t quit.",
  "I’m still writing my life, one day at a time.",
];

function getRandomQuote() {
  return CHECK_IN_QUOTES[Math.floor(Math.random() * CHECK_IN_QUOTES.length)];
}

export default function Page() {
  const [{ data: histories, loading, error }, refetch] = useAxios<CheckInHistory[]>({
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

  const handleOpen = () => {
    setNotes(getRandomQuote());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNotes("");
  };

  const handleCheckIn = async () => {
    await checkIn({
      data: { notes },
    });
    handleClose();
    refetch();
  };

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Check-in History</Typography>
          <Button variant="contained" onClick={handleOpen}>
            Check In
          </Button>
        </Stack>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">Failed to load data</Typography>}

        {histories && (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Checked In At</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {histories.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.checkedInAt).toLocaleString()}</TableCell>
                    <TableCell>{item.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Stack>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Check In</DialogTitle>
        <DialogContent>
          <TextField
            label="Notes"
            fullWidth
            multiline
            minRows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCheckIn}
            disabled={checkingIn || !notes.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
