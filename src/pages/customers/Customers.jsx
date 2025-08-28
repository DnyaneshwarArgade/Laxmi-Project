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
  InputAdornment,

} from "@mui/material";
import { Search, Delete, Edit, PersonAdd } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import { Close } from "@mui/icons-material";

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
        <Box mb={3}>
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            gap={isMobile ? 1 : 2}
          >
            {/* Title */}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: isMobile ? 1 : 0,
              }}
            >
              Customers
            </Typography>

            {/* Search + Add Button */}
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
              width={isMobile ? "100%" : "auto"}
              alignItems={isMobile ? "stretch" : "center"}
            >
              {/* Search Box */}
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
                  "&:hover": { borderColor: "#5a67d8", boxShadow: "0 0 8px rgba(102,126,234,0.5)" },
                  "&:focus-within": { borderColor: "#5a67d8", boxShadow: "0 0 8px rgba(90,103,216,0.6)" },
                }}
              >
                <Search fontSize="small" sx={{ color: "#667eea", mr: 1 }} />
                <InputBase
                  placeholder="Search by customer name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ flex: 1, fontSize: 14, color: "#333", "&::placeholder": { color: "#999" } }}
                  endAdornment={
                    search && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearch("")} sx={{ color: "#667eea" }}>
                          <Close fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                />
              </Box>

              {/* Add Button */}
              <Button
                variant="contained"
                onClick={openAdd}
                sx={{
                  width: 50,
                  height: 48,
                  minWidth: 0,
                  borderRadius: "50%",
                  px: 0,
                  py: 0,
                  textTransform: "none",
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonAdd sx={{ color: "#fff" }} />
              </Button>
            </Box>
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

          <DialogTitle sx={{ fontWeight: "bold", p: 2, position: "relative" }}>
            {/* Title text */}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
                fontSize: "1.25rem", // h5/h6 size adjust
              }}
            >
              {editing ? "Edit Customer" : "Add Customer"}
            </Box>

            {/* Close button top-right */}
            <Box
              onClick={closeForm}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                fontSize: 22,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(90deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              ×
            </Box>
          </DialogTitle>

          <DialogContent>
            {/* Name */}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      "&.Mui-focused": { backgroundColor: "white" },
                    },
                  }}
                  InputProps={{
                    endAdornment: field.value && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => field.onChange("")}
                          sx={{ color: "#101011ff" }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Address */}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      "&.Mui-focused": { backgroundColor: "white" },
                    },
                  }}
                  InputProps={{
                    endAdornment: field.value && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => field.onChange("")}
                          sx={{ color: "#101011ff" }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Phone */}
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
                  inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                    field.onChange(e);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      "&.Mui-focused": { backgroundColor: "white" },
                    },
                  }}
                  InputProps={{
                    endAdornment: field.value && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => field.onChange("")}
                          sx={{ color: "#101011ff" }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </DialogContent>




          <DialogActions sx={{ p: 2, justifyContent: "center" }}>
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
