import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../store/creators";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Card,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search, Delete, Edit, PersonAdd } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";

// ✅ Validation Schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
});

const Customers = () => {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.login);
  const token = login?.token;

  const {
    customers,
    isLoading,
    isPostLoading,
    isUpdateLoading,
    error,
  } = useSelector((state) => state.entities.customers);

  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", address: "", phone: "" },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const list = useMemo(() => {
    if (Array.isArray(customers)) return customers;
    if (customers?.data && Array.isArray(customers.data)) return customers.data;
    return [];
  }, [customers]);

  useEffect(() => {
    if (token) dispatch(actions.customersGetData({ token }));
  }, [dispatch, token]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => (c?.name || "").toLowerCase().includes(q));
  }, [list, search]);

  const openAdd = () => {
    setEditing(null);
    reset({ name: "", address: "", phone: "" });
    setOpenForm(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    reset({ name: row.name, address: row.address, phone: row.phone });
    setOpenForm(true);
  };

  const closeForm = () => {
    setOpenForm(false);
    setEditing(null);
  };

  const onSubmit = (data) => {
    const toggle = () => {
      closeForm();
      Swal.fire({
        icon: "success",
        title: editing ? "Customer Updated!" : "Customer Added!",
        showConfirmButton: false,
        timer: 1500,
      });
    };

    const setSubmitting = () => { };

    if (editing?.id) {
      dispatch(
        actions.updateCustomersData({
          data: { token, id: editing.id },
          customers: data,
          toggle,
          setSubmitting,
        })
      );
    } else {
      dispatch(
        actions.postCustomersData({
          data: { token },
          customers: data,
          toggle,
          setSubmitting,
        })
      );
    }
  };

  const onDelete = (row) => {
    Swal.fire({
      title: `Delete ${row?.name}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(actions.deleteCustomersData({ id: row.id, data: { token } }));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: `${row?.name} has been deleted.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Card
        sx={{
          p: isMobile ? 2 : 3,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "stretch" : "center"}
          mb={3}
          gap={2}
        >
          <Box sx={{
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block"
          }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Customers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track all your customers easily
            </Typography>
          </Box>

          <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2}>
            {/* 🔍 Search Box */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: isMobile ? "100%" : 280,
                background: "#ffffff",
                borderRadius: "25px",
                padding: "4px 12px",
                border: "2px solid #667eea",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#5a67d8",
                  boxShadow: "0 0 8px rgba(102,126,234,0.5)",
                },
                "&:focus-within": {
                  borderColor: "#5a67d8",
                  boxShadow: "0 0 8px rgba(90,103,216,0.6)",
                },
              }}
            >
              <Search fontSize="small" sx={{ color: "#667eea", mr: 1 }} />
              <InputBase
                placeholder="Search by customer name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  flex: 1,
                  fontSize: 14,
                  color: "#333",
                  "&::placeholder": { color: "#999" },
                }}
              />
            </Box>

            {/* Add Customer Button */}
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{
                borderRadius: "8px",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              }}
              onClick={openAdd}
              fullWidth={isMobile}
            >
              Add Customer
            </Button>
          </Box>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {String(error)}
          </Typography>
        )}

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: 3 }}>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead sx={{ backgroundColor: "#f1f4f9" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        "&:hover": { backgroundColor: "#f0faff" },
                        transition: "0.3s",
                      }}
                    >
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        {row.address && row.address.length <= 30
                          ? row.address
                          : row.address && row.address.match(/.{1,30}/g).map((str, idx) => (
                              <React.Fragment key={idx}>
                                {str}
                                <br />
                              </React.Fragment>
                            ))}
                      </TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => openEdit(row)}
                          sx={{ "&:hover": { backgroundColor: "#e3f2fd" } }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => onDelete(row)}
                          sx={{ "&:hover": { backgroundColor: "#ffebee" } }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={openForm} onClose={closeForm} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit(onSubmit)}>

          <Box
            sx={{
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block"
            }}
          >
            <DialogTitle sx={{ fontWeight: "bold" }}>
              {editing ? "Edit Customer" : "Add Customer"}
            </DialogTitle>

          </Box>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Enter name"
                  fullWidth
                  margin="dense"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Enter address"
                  fullWidth
                  margin="dense"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Enter phone number"
                  fullWidth
                  margin="dense"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                  onInput={e => {
                    // Only allow numbers and max 10 digits
                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    field.onChange(e);
                  }}
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button  sx={{
                borderRadius: "8px",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                color:"white"
              }} onClick={closeForm}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPostLoading || isUpdateLoading}
              sx={{
                borderRadius: "8px",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {isPostLoading || isUpdateLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Save"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Customers;
