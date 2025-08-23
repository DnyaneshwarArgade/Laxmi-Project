import React, { useEffect } from "react";
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
} from "@mui/material";
import { Search, Delete, Edit } from "@mui/icons-material";

const Items = () => {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.login);
  const { items } = useSelector((state) => state.entities.items);

  const data = {
    token: login?.token,
  };

  useEffect(() => {
    dispatch(actions.itemsGetData(data));
  }, []);

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
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              boxShadow: 1,
            }}
          >
            <Search fontSize="small" sx={{ color: "gray" }} />
            <InputBase placeholder="Search by item name" sx={{ ml: 1, flex: 1 }} />
          </Paper>
          <Button variant="contained" sx={{ borderRadius: "8px", textTransform: "none" }}>
            Add Item
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
              <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items?.data &&
              items.data.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>₹ {item.price}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Items;
