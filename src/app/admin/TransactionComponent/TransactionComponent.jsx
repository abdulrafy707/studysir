"use client";
import React, { useState, useEffect, Suspense } from "react";

import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import edit and delete icons
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const TransactionComponent = () => {
  const [transactions, setTransactions] = useState([]); // State to hold existing transactions
  const [formData, setFormData] = useState({
    userID: "",
    gameID: "",
    amount: "",
    transactionType: "",
  });
  const [loading, setLoading] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSubmit, setSnackbarSubmit] = useState(false);

  // Fetch existing transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost/user_api/add_transaction.php");
      if (response.data.status === "success") {
        setTransactions(response.data.transactions);  // Ensure transactions state is updated
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the form
    if (!formData.userID || !formData.gameID || !formData.amount || !formData.transactionType) {
      setSnackbarSubmit(true);
      setTimeout(() => {
        setSnackbarSubmit(false);
      }, 5000);
      return;
    }
  
    try {
      setLoading(true);
  
      let response;
      if (formData.TransactionID) {
        // This is an update, so we use PUT
        response = await axios.put(`http://localhost/user_api/update_transaction.php`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // This is a new transaction, so we use POST
        response = await axios.post("http://localhost/user_api/add_transaction.php", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
  
      if (response.data.status === "success") {
        setSnackbarOpen(true);
        setTimeout(() => {
          setSnackbarOpen(false);
        }, 5000);
  
        // Refetch the transactions to update the table
        await fetchTransactions();  // Fetch updated transactions
  
        handleClose();  // Close the modal
      }
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Handle Edit Action
  // Handle Edit Action
const handleEdit = (transaction) => {
    setFormData({
      TransactionID: transaction.TransactionID,  // Include TransactionID for updates
      userID: transaction.UserID,
      gameID: transaction.GameID,
      amount: transaction.Amount,
      transactionType: transaction.TransactionType,
    });
    setModelOpen(true);  // Open the modal for editing
  };
  

  // Handle Delete Action
  const handleDelete = async (transactionID) => {
    try {
      const response = await axios.delete("http://localhost/user_api/delete_transaction.php", {
        data: { transaction_id: transactionID },
      });
      if (response.data.status === "success") {
        setTransactions((prev) => prev.filter((t) => t.TransactionID !== transactionID));
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleOpen = () => {
    setModelOpen(true);
  };

  const handleClose = () => {
    setModelOpen(false);
    setFormData({
      userID: "",
      gameID: "",
      amount: "",
      transactionType: "",
    });
  };

  return (
    <Suspense fallback={<CircularProgress />}>
    <Box sx={{ padding: 3 }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{
            backgroundColor: "#E3B505",
            color: "black",
            ":hover": {
              backgroundColor: "#d3a004",
            },
          }}
        >
          Add New Transaction
        </Button>
      </Box>

      {/* Existing Transactions Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Game</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Transaction Type</TableCell>
              <TableCell>Transaction Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.TransactionID}>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.GameTitle}</TableCell>
                <TableCell>{transaction.Amount}</TableCell>
                <TableCell>{transaction.TransactionType}</TableCell>
                <TableCell>{transaction.TransactionDate}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(transaction)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(transaction.TransactionID)}>
                    <FaTrashAlt />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Transaction Dialog */}
      <Dialog open={modelOpen} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Add/Edit Transaction</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* User ID */}
              <Grid item xs={12}>
                <TextField
                  label="User ID"
                  type="number"
                  name="userID"
                  value={formData.userID}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Game ID */}
              <Grid item xs={12}>
                <TextField
                  label="Game ID"
                  type="number"
                  name="gameID"
                  value={formData.gameID}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Amount */}
              <Grid item xs={12}>
                <TextField
                  label="Amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Transaction Type */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleInputChange}
                    label="Transaction Type"
                  >
                    <MenuItem value="purchase">Purchase</MenuItem>
                    <MenuItem value="refund">Refund</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <DialogActions>
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                sx={{
                  backgroundColor: "#E3B505",
                  color: "black",
                  ":hover": {
                    backgroundColor: "#d3a004",
                  },
                }}
              >
                {`${loading ? "Loading...." : "Save"}`}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">Transaction added/updated successfully!</Alert>
      </Snackbar>

      {/* Submit Error Snackbar */}
      <Snackbar
        open={snackbarSubmit}
        autoHideDuration={5000}
        onClose={() => setSnackbarSubmit(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error">Please fill in all the required fields.</Alert>
      </Snackbar>
    </Box>
    </Suspense>
  );
};

export default TransactionComponent;
