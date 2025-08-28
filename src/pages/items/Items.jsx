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
} from "@mui/material";
import { Search, Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import {  Clear } from "@mui/icons-material";


// ✅ Toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Items = () => {
  // Validation state
  const [errors, setErrors] = useState({});
  // Search filter state
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.login);
  const { items } = useSelector((state) => state.entities.items);
  console.log('items', items)
  const data = {
    token: login?.token,
  }
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "Pen",
    price: "10",
    type: "Batla",
  });
  console.log('formData', formData)
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // delete confirmation
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (login?.token) {
      dispatch(actions.itemsGetData({ token: login?.token }));
    }
  }, [dispatch, login]);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submit (Create + Update)
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
      dispatch(actions.updateItemsData({ data: { token: login?.token, id: editId }, items: formData }));
      toast.success("Item updated successfully ✏");
    } else {
      dispatch(actions.postItemsData({ data, formData }));
      toast.success("Item created successfully ✅");
    }

    setOpen(false);
    setFormData({ name: "", price: "", type: "Batla" });
    setEditMode(false);
    setEditId(null);
    setErrors({});
  };

  // handle edit click
  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      type: "Batla",
    });
    setEditId(item.id);
    setEditMode(true);
    setOpen(true);
  };

  // handle delete click -> open confirmation dialog
  const handleDeleteClick = (id) => {
    setDeleteId(id);

    // SweetAlert confirm popup
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
        confirmDelete(id); // call confirm delete
      }
    });
  };


  // confirm delete
  const confirmDelete = (id) => {
    if (id) {
      dispatch(actions.deleteItemsData({ data, id }));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your item has been deleted.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9fbff", minHeight: "100vh" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box sx={{
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "inline-block"
        }}
        >
          <Typography variant="h4" fontWeight="bold" >
            Items
          </Typography>
          <Typography variant="body2" color="black">
            View and manage your items
          </Typography>
        </Box>

        {/* Search + Add Button */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            flexDirection: {
              xs: "column", // mobile - vertical
              sm: "row",    // tablet/desktop - horizontal
            },
            alignItems: {
              xs: "stretch", // mobile - full width
              sm: "center",
            },
          }}
        >
          {/* Search Box */}
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
    "&:hover": {
      borderColor: "#1e88e5",
      boxShadow: "0 0 8px rgba(66,165,245,0.5)",
    },
    "&:focus-within": {
      borderColor: "#1e88e5",
      boxShadow: "0 0 8px rgba(30,136,229,0.6)",
    },
  }}
>
  <Search fontSize="small" sx={{ color: "#42a5f5", mr: 1 }} />

  <InputBase
    placeholder="Search by item name"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    sx={{
      flex: 1,
      fontSize: 14,
      color: "#333",
      "&::placeholder": { color: "#999" },
    }}
  />

  {search && (
   <Box
  onClick={() => setSearch("")}
  sx={{
    cursor: "pointer",
    color: "#555",          // default text color
    fontSize: "13px",
    ml: 1,
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#e0e0e0", // background on hover
      color: "#000",              // text color on hover
    },
  }}
>
  ✖
</Box>

  )}
</Box>



          {/* Add Button */}
          <Button
            variant="contained"
            onClick={() => {
              setFormData({ name: "", price: "", type: "Batla" });
              setEditMode(false);
              setEditId(null);
              setOpen(true);
            }}
            sx={{
              minWidth: { xs: "100%", sm: 40 },
              height: 40,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: 17,
              fontWeight: "bold",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            + Add Item
          </Button>
        </Box>

      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              {/* <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell> */}
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(items?.data) &&
              items.data
                .filter(item =>
                  item.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((item) => {
                  return (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        {item.name.length <= 30
                          ? item.name
                          : item.name.match(/.{1,30}/g).map((str, idx) => (
                              <React.Fragment key={`${item.id}-${idx}`}>
                                {str}
                                <br />
                              </React.Fragment>
                            ))}
                      </TableCell>
                      <TableCell>₹ {item.price}</TableCell>
                      {/* <TableCell>{item.type}</TableCell> */}
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleEdit(item)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteClick(item.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Item Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, p: 1.5, boxShadow: 8 },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)",
            color: "white",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            py: 2,
            px: 3,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box
              sx={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block"
              }}
            >
              <Typography fontWeight="bold" fontSize={20}>
                {editMode ? "Edit Item" : "Add Item"}
              </Typography>
            </Box>
            <Box
              onClick={() => setOpen(false)}
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                // color: "#1976d2",
                fontSize: 22,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                },
              }}
            >
              ×
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 0 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  height: 50,
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px 15px",
                  fontSize: 16,
                },
                width: "100%",
              }}
            />

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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  height: 50,
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px 15px",
                  fontSize: 16,
                },
                width: "100%",
              }}
            />


          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              px: 4,
              borderRadius: 2,
              textTransform: "none",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 12px rgba(17, 17, 17, 0.4)",
              "&:hover": {
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              },
            }}
          >
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Items;