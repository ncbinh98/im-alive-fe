"use client";
import { ListUsers, UserData } from "@/app/interfaces/user.interface";
import { Cancel, CheckCircle, FilterList, Search } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import useAxios from "axios-hooks";
import { ChangeEvent, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

// Separate Table Component
function UsersTable({
  users,
  loading,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: {
  users: UserData[];
  loading: boolean;
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  return (
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
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Show loading rows
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
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
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Button variant="contained">Edit</Button>
                      <Button variant="contained" color="error">
                        Remove
                      </Button>
                    </Stack>
                  </TableCell>
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
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}

export default function UsersPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  // Debounce search term (500ms delay)
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [{ data: usersData, loading, error }, refetch] = useAxios<ListUsers>({
    method: "GET",
    url: "/users",
    params: {
      page: page + 1,
      limit: rowsPerPage,
      email: debouncedSearchTerm,
      isActive: filterActive,
    },
  });

  // Transform the data
  const users: UserData[] = useMemo(() => {
    return usersData?.items || [];
  }, [usersData]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleRefreshBtn = () => {
    refetch();
  };

  // Show initial loading only on first load
  if (loading && !usersData) {
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
        Users Management{" "}
        <Button onClick={handleRefreshBtn} variant="text">
          <RefreshIcon />
        </Button>
      </Typography>

      {/* Filter Section - This stays static during search */}
      <Paper sx={{ p: 2, mb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FilterList color="primary" />
          <Typography variant="h6">Filters</Typography>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search by email..."
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

      {/* Only the table area refreshes */}
      <UsersTable
        users={users}
        loading={loading}
        total={usersData?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
