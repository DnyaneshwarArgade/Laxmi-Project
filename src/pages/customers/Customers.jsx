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
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  InputAdornment,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import { Search, Delete, Edit, PersonAdd, Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";

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
  const { customers, isLoading, isPostLoading, isUpdateLoading, error } = useSelector((state) => state.entities.customers);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", address: "", phone: "" },
  });

  const list = useMemo(() => {
    if (Array.isArray(customers)) return customers;
    if (customers?.data && Array.isArray(customers.data)) return customers.data;
    return [];
  }, [customers]);

  useEffect(() => {
    if (token) dispatch(actions.customersGetData({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    if (search && list.length > 0) {
      const firstIndex = list.findIndex((c) => (c?.name || "").toLowerCase().includes(search.toLowerCase()));
      if (firstIndex >= 0) {
        setPage(Math.floor(firstIndex / rowsPerPage) + 1);
      } else {
        setPage(1);
      }
    }
  }, [search, list]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => (c?.name || "").toLowerCase().includes(q));
  }, [list, search]);

  const openAdd = () => {
    setEditing(null);
    reset({ name: "", address: "", phone: "" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    reset({ name: row.name, address: row.address, phone: row.phone });
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
    setEditing(null);
    reset({ name: "", address: "", phone: "" });
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
      title: `Delete ${row?.name}?`,   // ✅ बरोबर template literal
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
          timer: 1500,              // ✅ auto-close after 1.5 sec
          showConfirmButton: false, // ✅ button न दाखवता बंद होईल
        });
      }
    });
  };


  return (
    <Box sx={{ p: 3, backgroundColor: "#f9fbff", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, gap: { xs: 2, sm: 0 } }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: { xs: "100%", sm: "auto" }, mb: { xs: 1, sm: 0 } }}>
          <Box sx={{ background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>
            <Typography variant="h4" fontWeight="bold">Customers</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={openAdd}
            sx={{ width: 40, height: 40, minWidth: 40, borderRadius: "50%", textTransform: "none", fontSize: 20, fontWeight: "bold", background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", display: { xs: "flex", sm: "none" } }}
          >+</Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: "100%", sm: "auto" } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: 280 },
              background: "white",
              borderRadius: "25px",
              padding: "4px 12px",
              border: "2px solid #667eea",
              transition: "all 0.3s ease",
              "&:hover": { borderColor: "#5a67d8", boxShadow: "0 0 8px rgba(102,126,234,0.5)" },
              "&:focus-within": { borderColor: "#5a67d8", boxShadow: "0 0 8px rgba(90,103,216,0.6)" },
            }}
          >
            <InputBase
              placeholder="Search by customer name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, fontSize: 14, color: "#333", "&::placeholder": { color: "#999" } }}
              startAdornment={
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: "#667eea", mr: 1 }} />
                </InputAdornment>
              }
              endAdornment={
                search && (
                  <InputAdornment position="end">
                    <Box
                      onClick={() => setSearch("")}
                      sx={{
                        cursor: "pointer",
                        color: "#555",
                        fontSize: "13px",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                    >
                      ✖
                    </Box>
                  </InputAdornment>
                )
              }
            />
          </Box>
          <Button
            variant="contained"
            onClick={openAdd}
            sx={{ width: 40, height: 40, minWidth: 40, borderRadius: "50%", textTransform: "none", fontSize: 23, fontWeight: "bold", background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", display: { xs: "none", sm: "flex" }, alignItems: "center", justifyContent: "center", p: 0 }}
          >+</Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              {/* <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell> */}
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length > 0 ? (
              filtered
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.name}</TableCell>
                    {/* <TableCell>
                      {row.address && row.address.length <= 30
                        ? row.address
                        : row.address && row.address.match(/.{1,30}/g).map((str, idx) => (
                          <React.Fragment key={idx}>{str}<br /></React.Fragment>
                        ))}
                    </TableCell> */}
                    <TableCell>{row.phone}</TableCell>
                    <TableCell align="right" style={{display:"flex"}}>
                      <IconButton color="primary" onClick={() => openEdit(row)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => onDelete(row)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: "#888" }}>
                  {list.length === 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <Box sx={{ fontSize: 20, color: "#000" }}>🔄</Box>
                      <span>No customers available.</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", fontStyle: "italic", alignItems: "center", gap: 1 }}>
                      <span>No customers found for "{search}"</span>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filtered.length > rowsPerPage && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(filtered.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={closeForm} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3, p: 1.5, boxShadow: 8 } }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ bgcolor: "linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)", color: "white", borderTopLeftRadius: 12, borderTopRightRadius: 12, py: 2, px: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>
                <Typography fontWeight="bold" fontSize={20}>{editing ? "Edit Customer" : "Add Customer"}</Typography>
              </Box>
              <Box onClick={closeForm} sx={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", fontSize: 22, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", "&:hover": { background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)" } }}>×</Box>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ mt: 0 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Name */}
              <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Name</Typography>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter name"
                    fullWidth
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      endAdornment: field.value && (
                        <InputAdornment position="end">
                          <Box
                            onClick={() => field.onChange("")}
                            sx={{ cursor: "pointer", color: "#555", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { color: "#000" } }}
                          >✖</Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* Address */}
              <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Address</Typography>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter address"
                    fullWidth
                    variant="outlined"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    InputProps={{
                      endAdornment: field.value && (
                        <InputAdornment position="end">
                          <Box
                            onClick={() => field.onChange("")}
                            sx={{ cursor: "pointer", color: "#555", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { color: "#000" } }}
                          >✖</Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {/* Phone */}
              <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Phone</Typography>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Enter phone number"
                    fullWidth
                    variant="outlined"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                      field.onChange(e);
                    }}
                    InputProps={{
                      endAdornment: field.value && (
                        <InputAdornment position="end">
                          <Box
                            onClick={() => field.onChange("")}
                            sx={{ cursor: "pointer", color: "#555", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { color: "#000" } }}
                          >✖</Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button type="submit" variant="contained" sx={{ px: 4, borderRadius: 2, textTransform: "none", background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)" }} disabled={isPostLoading || isUpdateLoading}>
              {isPostLoading || isUpdateLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : (editing ? "Update" : "Submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Customers;