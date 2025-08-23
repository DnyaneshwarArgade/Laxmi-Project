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
import { WarningAmber, Close } from "@mui/icons-material";

// ✅ Toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Items = () => {
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

    if (editMode && editId) {
      dispatch(actions.updateItemsData({ data: { token: login?.token, id: editId }, items: formData }));
      toast.success("Item updated successfully ✏️");
    } else {
      dispatch(actions.postItemsData({ data, formData }));
      toast.success("Item created successfully ✅");
    }

    setOpen(false);
    setFormData({ name: "", price: "", type: "Batla" });
    setEditMode(false);
    setEditId(null);
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
    setDeleteDialog(true);
  };

  // confirm delete
  const confirmDelete = () => {
    if (deleteId) {
      dispatch(actions.deleteItemsData({ data, id: deleteId }));
      toast.error("Item deleted ❌");
    }
    setDeleteDialog(false);
    setDeleteId(null);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9fbff", minHeight: "100vh" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Items
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your items
          </Typography>
        </Box>

        {/* Search + Add Button */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: 280,
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
              sx={{
                flex: 1,
                fontSize: 14,
                color: "#333",
                "&::placeholder": { color: "#999" },
              }}
            />
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
              minWidth: 40,
              height: 40,
              borderRadius: "50%",
              textTransform: "none",
              fontSize: 22,
              fontWeight: "bold",
              background: "linear-gradient(135deg,#43ee90ff, #2527adff)",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0, #1e88e5)",
                transform: "scale(1.00) rotate(10deg)",
                boxShadow: "0 6px 16px rgba(25,118,210,0.5)",
              },
            }}
          >
            +
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
              items.data.map((item) => {
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.name}</TableCell>
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
            <Typography fontWeight="bold" fontSize={20} color="black">
              {editMode ? "Edit Item" : "Add Item"}
            </Typography>
            <Box
              onClick={() => setOpen(false)}
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "white",
                color: "#1976d2",
                fontSize: 22,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  background: "#e3f2fd",
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
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              boxShadow: "0 4px 12px rgba(17, 17, 17, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0, #1e88e5)",
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
