"use client";
import React, { useState, useEffect } from "react";
import {
  Backdrop,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const AdminList = () => {
  const [admins, setAdmins] = useState([]); // State to store the list of admins
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [editDialogOpen, setEditDialogOpen] = useState(false); // State for edit dialog
  const [selectedAdmin, setSelectedAdmin] = useState(null); // State for the selected admin to edit
  const [formData, setFormData] = useState({
    name: "",
    phoneno: "",
    city: "",
  }); // State for form data
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state for showing success/error
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message

  // Function to fetch admins
  const fetchAdmins = async () => {
    setLoading(true); // Show loading spinner
    try {
      const response = await axios.get("http://localhost/user_api/get_admins.php");
      if (response.data.status === "success") {
        setAdmins(response.data.admins); // Store the fetched admins
      } else {
        console.error("Failed to fetch admins");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Fetch admins when the component mounts
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle opening the edit dialog
  const handleEditClick = (admin) => {
    setSelectedAdmin(admin); // Set the selected admin to edit
    setFormData({
      name: admin.name,
      phoneno: admin.phoneno,
      city: admin.city,
    }); // Populate form data
    setEditDialogOpen(true); // Open the dialog
  };

  // Handle closing the edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedAdmin(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission for updating admin info
  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost/user_api/update_user.php",
        {
          id: selectedAdmin.id,
          name: formData.name,
          phoneno: formData.phoneno,
          city: formData.city,
        }
      );

      if (response.data.status === "success") {
        setSnackbarMessage("Admin details updated successfully!");
        setSnackbarOpen(true);
        fetchAdmins(); // Refetch the updated admins list
        handleCloseEditDialog(); // Close the dialog
      } else {
        console.error("Failed to update admin details");
      }
    } catch (error) {
      console.error("Error updating admin details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" mb={3} textAlign="center">
        Admin Users List
      </Typography>

      {/* Loading Spinner */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Admins Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Email</TableCell>
              {/* <TableCell>Balance</TableCell> */}
              <TableCell>Updated At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.id}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.phoneno}</TableCell>
                <TableCell>{admin.city}</TableCell>
                <TableCell>{admin.email}</TableCell>
                {/* <TableCell>{admin.balance}</TableCell> */}
                <TableCell>{admin.updatedAt}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleEditClick(admin)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Admin Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Phone Number"
            name="phoneno"
            value={formData.phoneno}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit} disabled={loading}>
            Save
          </Button>
        </DialogActions>
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
  );
};

export default AdminList;
