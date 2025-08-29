import React, { useEffect, useState } from "react";
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
  CircularProgress
} from "@mui/material";
import { Search, Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Items = () => {
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.login);
  const { items } = useSelector((state) => state.entities.items);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const data = { token: login?.token };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", type: "Batla" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

 const { data: itemsData, loading } = useSelector((state) => state.entities.items);

  useEffect(() => {
    if (login?.token) {
      dispatch(actions.itemsGetData({ token: login?.token }));
    }
  }, [dispatch, login]);

  useEffect(() => {
    if (search && items?.data?.length > 0) {
      // search केलेल्या पहिल्या item चा index शोधा
      const firstIndex = items.data.findIndex(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      if (firstIndex >= 0) {
        setPage(Math.floor(firstIndex / rowsPerPage) + 1); // page set करा
      } else {
        setPage(1); // काही match नाही तर page 1
      }
    }
  }, [search, items]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name is required (min 2 chars)";
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (editMode && editId) {
      dispatch(
        actions.updateItemsData({ data: { token: login?.token, id: editId }, items: formData })
      );
      toast.success("Item updated successfully ✏");
    } else {
      dispatch(actions.postItemsData({ data, formData })).then((res) => {
        // Assuming your Redux returns the new item
        dispatch(actions.itemsGetData({ token: login?.token })); // Refresh list after add
      });
      toast.success("Item created successfully ✅");
    }

    setOpen(false);
    setFormData({ name: "", price: "", type: "Batla" });
    setEditMode(false);
    setEditId(null);
    setErrors({});
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, price: item.price, type: "Batla" });
    setEditId(item.id);
    setEditMode(true);
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(id);
      }
    });
  };

  const confirmDelete = (id) => {
    if (id) {
      dispatch(actions.deleteItemsData({ data, id })).then(() => {
        dispatch(actions.itemsGetData({ token: login?.token })); // Refresh list after delete
      });
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your item has been deleted.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const filteredItems = Array.isArray(items?.data)
    ? items.data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    : [];

     const paginatedItems = filteredItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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
            <Typography variant="h4" fontWeight="bold">Items</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => { setFormData({ name: "", price: "", type: "Batla" }); setEditMode(false); setEditId(null); setOpen(true); }}
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
              border: "2px solid #42a5f5",
              transition: "all 0.3s ease",
              "&:hover": { borderColor: "#1e88e5", boxShadow: "0 0 8px rgba(66,165,245,0.5)" },
              "&:focus-within": { borderColor: "#1e88e5", boxShadow: "0 0 8px rgba(30,136,229,0.6)" },
            }}
          >
            <InputBase
              placeholder="Search by item name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, fontSize: 14, color: "#333", "&::placeholder": { color: "#999" } }}
              startAdornment={
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: "#42a5f5", mr: 1 }} />
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

          {/* </Box> */}

          <Button
            variant="contained"
            onClick={() => { setFormData({ name: "", price: "", type: "Batla" }); setEditMode(false); setEditId(null); setOpen(true); }}
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
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

        <TableBody>
  {loading ? (
    <TableRow>
      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
        <CircularProgress size={28} />
        <Typography variant="body2" sx={{ mt: 1 }}>Loading items...</Typography>
      </TableCell>
    </TableRow>
  ) : filteredItems.length > 0 ? (
    filteredItems
      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
      .map((item) => (
        <TableRow key={item.id} hover>
          <TableCell>{item.name}</TableCell>
          <TableCell>₹ {item.price}</TableCell>
          <TableCell align="right">
            <IconButton color="primary" onClick={() => handleEdit(item)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => handleDeleteClick(item.id)}>
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
      ))
  ) : (
    <TableRow>
      <TableCell colSpan={3} align="center" sx={{ py: 4, color: "#888" }}>
        No items found.
      </TableCell>
    </TableRow>
  )}
</TableBody>


        </Table>
      </TableContainer>

      {filteredItems.length > rowsPerPage && (
  <Box display="flex" justifyContent="center" mt={2}>
    <Pagination
      count={Math.ceil(filteredItems.length / rowsPerPage)}
      page={page}
      onChange={(e, value) => setPage(value)}
      color="primary"
      shape="rounded"
    />
  </Box>
)}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3, p: 1.5, boxShadow: 8 } }}>
        <DialogTitle sx={{ bgcolor: "linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)", color: "white", borderTopLeftRadius: 12, borderTopRightRadius: 12, py: 2, px: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box sx={{ background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>
              <Typography fontWeight="bold" fontSize={20}>{editMode ? "Edit Item" : "Add Item"}</Typography>
            </Box>
            <Box onClick={() => setOpen(false)} sx={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)", fontSize: 22, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", "&:hover": { background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)" } }}>×</Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 0 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Item Name */}
            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
              Item Name
            </Typography>
            <TextField
              placeholder="Enter item name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                endAdornment: formData.name && (
                  <InputAdornment position="end">
                    <Box
                      onClick={() => setFormData({ ...formData, name: "" })}
                      sx={{
                        cursor: "pointer",
                        color: "#555",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": { color: "#000" },
                      }}
                    >
                      ✖
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            {/* Price */}
            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
              Price
            </Typography>
            <TextField
              placeholder="Enter price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                endAdornment: formData.price && (
                  <InputAdornment position="end">
                    <Box
                      onClick={() => setFormData({ ...formData, price: "" })}
                      sx={{
                        cursor: "pointer",
                        color: "#555",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": { color: "#000" },
                      }}
                    >
                      ✖
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button onClick={handleSubmit} variant="contained" sx={{ px: 4, borderRadius: 2, textTransform: "none", background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)" }}>
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default Items;
