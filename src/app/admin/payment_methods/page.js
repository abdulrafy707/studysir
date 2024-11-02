'use client';
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const PaymentMethodsComponent = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
  const [newAccountType, setNewAccountType] = useState('');
  const [newAccountNo, setNewAccountNo] = useState('');
  const apiUrl = 'https://studysir.m3xtrader.com/api/payment_methods_api.php';

  // Fetch payment methods on component mount
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrl);
      setPaymentMethods(response.data.data || []);
    } catch (error) {
      setSnackbarMessage('Failed to fetch payment methods');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!newAccountType || !newAccountNo) {
        setSnackbarMessage('Account type and account number are required');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
    }

    setLoading(true);
    try {
        const formData = new FormData();
        formData.append('account_type', newAccountType);
        formData.append('account_no', newAccountNo);

        const response = await axios.post(apiUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set content type to form data
            },
        });

        if (response.data.success) {
            setPaymentMethods([...paymentMethods, response.data.data]);
            setSnackbarMessage('Payment method added successfully');
            setSnackbarSeverity('success');
            setIsDialogOpen(false);
            resetForm();
        } else {
            setSnackbarMessage(response.data.error || 'Failed to add payment method');
            setSnackbarSeverity('error');
        }
    } catch (error) {
        setSnackbarMessage('Error adding payment method');
        setSnackbarSeverity('error');
    } finally {
        setLoading(false);
        setSnackbarOpen(true);
    }
};


  const handleUpdatePaymentMethod = async () => {
    if (!newAccountType || !newAccountNo) {
      setSnackbarMessage('Account type and account number are required');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const data = { id: currentPaymentMethod.id, account_type: newAccountType, account_no: newAccountNo };
      const response = await axios.put(apiUrl, data, { headers: { 'Content-Type': 'application/json' } });

      if (response.data.success) {
        setPaymentMethods(paymentMethods.map(method =>
          method.id === currentPaymentMethod.id ? response.data.data : method
        ));
        setSnackbarMessage('Payment method updated successfully');
        setSnackbarSeverity('success');
        setIsDialogOpen(false);
        resetForm();
      } else {
        setSnackbarMessage(response.data.error || 'Failed to update payment method');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('Error updating payment method');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(apiUrl, { params: { id } });

      if (response.data.success) {
        setPaymentMethods(paymentMethods.filter(method => method.id !== id));
        setSnackbarMessage('Payment method deleted successfully');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(response.data.error || 'Failed to delete payment method');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('Error deleting payment method');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const openEditDialog = (method) => {
    setEditMode(true);
    setIsDialogOpen(true);
    setCurrentPaymentMethod(method);
    setNewAccountType(method.account_type);
    setNewAccountNo(method.account_no);
  };

  const resetForm = () => {
    setNewAccountType('');
    setNewAccountNo('');
    setCurrentPaymentMethod(null);
    setEditMode(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <h2>Payment Methods</h2>
        <IconButton onClick={() => { setIsDialogOpen(true); setEditMode(false); }}>
          <AddIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Account Type</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>{method.id}</TableCell>
                  <TableCell>{method.account_type}</TableCell>
                  <TableCell>{method.account_no}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => openEditDialog(method)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePaymentMethod(method.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>

      {/* Dialog for adding/updating payment method */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editMode ? 'Edit Payment Method' : 'Add New Payment Method'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Account Type"
            fullWidth
            value={newAccountType}
            onChange={(e) => setNewAccountType(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Account Number"
            fullWidth
            value={newAccountNo}
            onChange={(e) => setNewAccountNo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={editMode ? handleUpdatePaymentMethod : handleAddPaymentMethod} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentMethodsComponent;
