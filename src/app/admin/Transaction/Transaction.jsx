"use client";
import React, { useState, useEffect, Suspense } from "react";


import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false); // State to handle image popup
  const [selectedImage, setSelectedImage] = useState(null); // State to store selected image
  const [formData, setFormData] = useState({
    user_id: "",
    transaction_id: "",
    status: "pending",
  });

  // Fetch transactions from the API
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost/user_api/transactions.php");
      if (response.data.status === "success") {
        setTransactions(response.data.transactions);
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
    fetchTransactions(); // Fetch transactions when component mounts
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle transaction approval or status change
  const handleStatusChange = async (transactionID, status) => {
    setLoading(true);
    try {
      const response = await axios.put("http://localhost/user_api/transactions.php", {
        transaction_id: transactionID,
        status: status,
      });

      if (response.data.status === "success") {
        setSnackbarMessage("Transaction status updated successfully!");
        setSnackbarOpen(true);
        fetchTransactions(); // Fetch updated transactions after approval
      } else {
        console.error("Failed to update transaction status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("user_id", formData.user_id);
      formDataToSend.append("transaction_id", formData.transaction_id);

      // Optional image upload
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post("http://localhost/user_api/transactions.php", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        setSnackbarMessage("Transaction added successfully!");
        setSnackbarOpen(true);
        fetchTransactions(); // Fetch updated transactions
        handleCloseDialog();
      } else {
        console.error("Failed to add transaction", response.data.message);
      }
    } catch (error) {
      console.error("Error adding transaction", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog open
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      user_id: "",
      transaction_id: "",
      status: "pending",
      image: null,
    });
  };

  // Handle image input change
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Handle image popup open
  const handleOpenImagePopup = (image) => {
    setSelectedImage(image);
    setImagePopupOpen(true);
  };

  // Handle image popup close
  const handleCloseImagePopup = () => {
    setImagePopupOpen(false);
    setSelectedImage(null);
  };

  return (
    <Suspense fallback={<CircularProgress />}>
    <Box sx={{ padding: 3 }}>
      {loading && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        sx={{ marginBottom: 2 }}
      >
        Add New Transaction
      </Button>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Prebalance</TableCell>
              <TableCell>Current Balance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>Receipt</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.transactionid}>
                <TableCell>{transaction.transactionid}</TableCell>
                <TableCell>{transaction.username}</TableCell>
                <TableCell>{transaction.prebalance}</TableCell>
                <TableCell>{transaction.currentbalance}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>{transaction.created_at}</TableCell>
                <TableCell>{transaction.updated_at}</TableCell>
                <TableCell>
                  {transaction.image && (
                    <Button onClick={() => handleOpenImagePopup(transaction.image)}>
                      View Receipt
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={transaction.status}
                      label="Status"
                      onChange={(e) => handleStatusChange(transaction.transactionid, e.target.value)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Transaction Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Add New Transaction</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
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
            <TextField
              label="User ID"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Transaction ID"
              name="transaction_id"
              value={formData.transaction_id}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Upload Image"
              type="file"
              onChange={handleImageChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <DialogActions>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Popup Dialog */}
      <Dialog open={imagePopupOpen} onClose={handleCloseImagePopup} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Receipt Image</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseImagePopup}
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
          {selectedImage && (
            <img
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Receipt"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
    </Suspense>
  );
};

export default Transactions;
