"use client";
import { useState, useMemo, ChangeEvent } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Search, FilterList, CheckCircle, Cancel } from "@mui/icons-material";
import { UserData } from "@/app/interfaces/user.interface";
import useAxios from "axios-hooks";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [{ data: usersData, loading, error }, refetch] = useAxios<UserData>({
    method: "GET",
    url: "/users",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  // Transform the data to handle both array and object responses
  const users: User[] = useMemo(() => {
    if (!usersData) return [];

    // If usersData is already an array, return it
    if (Array.isArray(usersData)) {
      return usersData;
    }

    // If usersData has a users property that's an array, return that
    if (
      usersData &&
      typeof usersData === "object" &&
      "users" in usersData &&
      Array.isArray(usersData.users)
    ) {
      return usersData.users;
    }

    // If usersData has a data property that's an array, return that
    if (
      usersData &&
      typeof usersData === "object" &&
      "data" in usersData &&
      Array.isArray(usersData.data)
    ) {
      return usersData.data;
    }

    return [];
  }, [usersData]);

  // Filter users based on search term and active status
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Active status filter
      const matchesActive = filterActive === null || user.isActive === filterActive;

      return matchesSearch && matchesActive;
    });
  }, [users, searchTerm, filterActive]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading users: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Users Management
      </Typography>

      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FilterList color="primary" />
          <Typography variant="h6">Filters</Typography>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={1}>
            <Chip
              label="All Users"
              clickable
              variant={filterActive === null ? "filled" : "outlined"}
              onClick={() => setFilterActive(null)}
              color="primary"
            />
            <Chip
              label="Active"
              clickable
              variant={filterActive === true ? "filled" : "outlined"}
              onClick={() => setFilterActive(true)}
              icon={<CheckCircle />}
              color="success"
            />
            <Chip
              label="Inactive"
              clickable
              variant={filterActive === false ? "filled" : "outlined"}
              onClick={() => setFilterActive(false)}
              icon={<Cancel />}
              color="error"
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Users Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="users table">
            <TableHead
              sx={{
                "& .MuiTableCell-head": {
                  color: "white",
                  backgroundColor: "#2e2d2dff",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                },
              }}
            >
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Updated Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No users found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={user.isActive ? "success" : "error"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{formatDate(user.updatedAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
