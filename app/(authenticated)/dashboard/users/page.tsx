"use client";

import { ListUsers, UserData, EmergencyContact } from "@/app/interfaces/user.interface";
import {
  Cancel,
  CheckCircle,
  FilterList,
  Search,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert,
} from "@mui/icons-material";
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Avatar,
  Card,
  Menu,
} from "@mui/material";
import useAxios from "axios-hooks";
import { ChangeEvent, useMemo, useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

// --- Types ---
type UserFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  isActive?: boolean;
  emergencyContacts: EmergencyContact[];
};

// --- Utils ---
function getInitials(firstName: string = "", lastName: string = "") {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

// --- Components ---

// Confirmation Dialog
function ConfirmDialog({
  open,
  title,
  content,
  onConfirm,
  onClose,
  loading,
}: {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(30, 41, 59, 0.95)",
        },
      }}
    >
      <DialogTitle fontWeight={700}>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>
          {loading ? "Processing..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// User Form Dialog (Create / Edit)
function UserDialog({
  open,
  onClose,
  initialData,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: UserData | null;
  onSubmit: (data: UserFormInput) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState<UserFormInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isActive: true,
    emergencyContacts: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        password: "",
        isActive: initialData.isActive,
        emergencyContacts: initialData.emergencyContacts || [],
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        isActive: true,
        emergencyContacts: [],
      });
    }
  }, [initialData, open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactChange = (index: number, field: keyof EmergencyContact, value: string) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setFormData((prev) => ({ ...prev, emergencyContacts: updatedContacts }));
  };

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: "", telegramId: "", email: "", message: "" },
      ],
    }));
  };

  const removeContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(30, 41, 59, 0.9)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? "Edit User" : "Create New User"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} pt={1}>
            <Stack direction="row" spacing={2}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Stack>
            <TextField
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
            {!initialData && (
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
                helperText="Minimum 6 characters"
              />
            )}

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Emergency Contacts
                </Typography>
                <Button startIcon={<AddIcon />} size="small" onClick={addContact}>
                  Add Contact
                </Button>
              </Stack>
              <Stack spacing={2}>
                {formData.emergencyContacts.map((contact, index) => (
                  <Paper
                    key={index}
                    variant="outlined"
                    sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.03)", position: "relative" }}
                  >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeContact(index)}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <Stack spacing={2} pt={1}>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Name"
                          size="small"
                          fullWidth
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, "name", e.target.value)}
                          required
                        />
                        <TextField
                          label="Telegram ID"
                          size="small"
                          fullWidth
                          value={contact.telegramId}
                          onChange={(e) => handleContactChange(index, "telegramId", e.target.value)}
                        />
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Email"
                          size="small"
                          fullWidth
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, "email", e.target.value)}
                        />
                        <TextField
                          label="Message"
                          size="small"
                          fullWidth
                          multiline
                          rows={2}
                          value={contact.message}
                          onChange={(e) => handleContactChange(index, "message", e.target.value)}
                        />
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
                {formData.emergencyContacts.length === 0 && (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    No emergency contacts added.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading} sx={{ px: 4 }}>
            {loading ? "Saving..." : initialData ? "Save Changes" : "Create User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// User Table Component
function UsersTable({
  users,
  loading,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onStatusToggle,
}: {
  users: UserData[];
  loading: boolean;
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEdit: (user: UserData) => void;
  onStatusToggle: (user: UserData) => void;
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: "100%",
        overflow: "hidden",
        boxShadow: theme.shadows[4],
        bgcolor: theme.palette.background.paper,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <TableContainer>
        <Table stickyHeader aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: "transparent" }}>User</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "transparent" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "transparent" }}>Contacts</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "transparent" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "transparent" }}>Joined</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "transparent" }}>Updated</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, bgcolor: "transparent" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Stack alignItems="center" spacing={1} color="text.secondary">
                    <Search sx={{ fontSize: 40, opacity: 0.5 }} />
                    <Typography>No users found matching your criteria.</Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getInitials(user.firstName, user.lastName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: ...{user.id.slice(-4)}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      {user.emergencyContacts?.slice(0, 2).map((contact, i) => (
                        <Tooltip
                          key={i}
                          title={`${contact.telegramId ? contact.telegramId : "-"} ~ ${contact.email ? contact.email : "-"}: ${contact.message}`}
                        >
                          <Chip
                            label={contact.name}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem", height: 20 }}
                          />
                        </Tooltip>
                      ))}
                      {user.emergencyContacts?.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                          +{user.emergencyContacts.length - 2} more
                        </Typography>
                      )}
                      {(!user.emergencyContacts || user.emergencyContacts.length === 0) && (
                        <Typography variant="caption" color="text.disabled">
                          None
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip
                        label={user.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={user.isActive ? "success" : "default"}
                        variant={user.isActive ? "filled" : "outlined"}
                        sx={{ fontWeight: 500, minWidth: 70 }}
                      />
                      <Tooltip title={user.isActive ? "Deactivate User" : "Activate User"}>
                        <IconButton
                          size="small"
                          color={user.isActive ? "success" : "default"}
                          onClick={() => onStatusToggle(user)}
                        >
                          {user.isActive ? (
                            <CheckCircle fontSize="small" />
                          ) : (
                            <Cancel fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onEdit(user)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {/*
                       <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => onDelete(user)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                       </Tooltip>
                       */}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      />
    </Card>
  );
}

// Main Page Component
export default function UsersPage() {
  const theme = useTheme();

  // -- State --
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Status Confirmation State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusUser, setStatusUser] = useState<UserData | null>(null);

  // -- API Hooks --

  // List Users
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

  // Create User
  const [{ loading: creating }, createUser] = useAxios(
    {
      url: "/users",
      method: "POST",
    },
    { manual: true },
  );

  // Update User
  const [{ loading: updating }, updateUser] = useAxios(
    {
      method: "PATCH",
    },
    { manual: true },
  );

  // -- Handlers --

  const handleCreate = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleStatusToggle = (user: UserData) => {
    // Show Confirmation for BOTH Activate and Deactivate
    setStatusUser(user);
    setConfirmOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (statusUser) {
      // Toggle the status
      handleStatusChange(statusUser, !statusUser.isActive);
    }
  };

  const handleStatusChange = async (user: UserData, newStatus: boolean) => {
    try {
      await updateUser({
        url: `/users/${user.id}`,
        data: {
          isActive: newStatus,
        },
      });

      // Close dialogues and refresh
      setConfirmOpen(false);
      setStatusUser(null);
      refetch();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleFormSubmit = async (data: UserFormInput) => {
    try {
      if (editingUser) {
        // Update
        await updateUser({
          url: `/users/${editingUser.id}`,
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            isActive: data.isActive,
            emergencyContacts: data.emergencyContacts,
          },
        });
      } else {
        // Create
        await createUser({
          data,
        });
      }
      setDialogOpen(false);
      refetch(); // Refresh list
    } catch (err) {
      console.error("Failed to save user", err);
      // Could show snackbar error here
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1600, mx: "auto" }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "start", sm: "center" }}
        mb={4}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage system access and profiles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          size="large"
          sx={{
            borderRadius: "50px",
            px: 3,
            boxShadow: `0 8px 20px -4px ${theme.palette.primary.main}44`,
          }}
        >
          Add User
        </Button>
      </Stack>

      {/* Toolbar / Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 2,
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.02)", // Very subtle background
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <TextField
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          size="small"
          sx={{ flexGrow: 1, minWidth: { md: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 },
          }}
        />

        <Stack direction="row" spacing={1} overflow="auto" maxWidth="100%">
          <Chip
            label="All"
            color="primary"
            variant={filterActive === null ? "filled" : "outlined"}
            onClick={() => setFilterActive(null)}
            clickable
          />
          <Chip
            label="Active"
            color="success"
            variant={filterActive === true ? "filled" : "outlined"}
            onClick={() => setFilterActive(true)}
            clickable
            icon={<CheckCircle fontSize="small" />}
          />
          <Chip
            label="Inactive"
            color="default" // "error" might be too strong for filter
            variant={filterActive === false ? "filled" : "outlined"}
            onClick={() => setFilterActive(false)}
            clickable
            icon={<Cancel fontSize="small" />}
          />
        </Stack>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          size="small"
          sx={{ minWidth: "auto", ml: "auto" }}
        >
          Refresh
        </Button>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => refetch()}>
          Failed to load users. {error.message}
        </Alert>
      )}

      {/* Users Table */}
      <UsersTable
        users={usersData?.items || []}
        loading={loading}
        total={usersData?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        onEdit={handleEdit}
        onStatusToggle={handleStatusToggle}
      />

      {/* User Dialog */}
      <UserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editingUser}
        onSubmit={handleFormSubmit}
        loading={creating || updating}
      />

      {/* Status Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title={statusUser?.isActive ? "Deactivate User?" : "Activate User?"}
        content={
          statusUser?.isActive
            ? `Are you sure you want to deactivate ${statusUser?.firstName} ${statusUser?.lastName}? They will lose access to the system.`
            : `Are you sure you want to activate ${statusUser?.firstName} ${statusUser?.lastName}? They will regain access to the system.`
        }
        onConfirm={handleConfirmStatusChange}
        onClose={() => setConfirmOpen(false)}
        loading={updating}
      />
    </Box>
  );
}
