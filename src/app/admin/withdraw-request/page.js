'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const WithdrawalRequestsComponent = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);  // Store all withdrawal requests
  const [loading, setLoading] = useState(true);          // Loading state
  const [error, setError] = useState(false);             // Error state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar for success/error messages
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message for snackbar
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;   // Fetch base URL from .env file

  // Fetch the list of withdrawal requests when the component mounts
  useEffect(() => {
    const fetchWithdrawalRequests = async () => {
      try {
        const response = await axios.get(`${apiUrl}/withdrawal_api.php`); // Call the API to fetch withdrawal requests
        if (response.data.error) {
          setError(true);
          setSnackbarMessage(response.data.error);
        } else {
          // Ensure the response is an array before updating the state
          if (Array.isArray(response.data)) {
            setWithdrawalRequests(response.data);
          } else {
            setWithdrawalRequests([]);  // Set to an empty array if the response is not an array
          }
        }
      } catch (err) {
        console.error('Error fetching withdrawal requests:', err);
        setError(true);
        setSnackbarMessage('Failed to fetch withdrawal requests');
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawalRequests();
  }, [apiUrl]);

  // Handle status change (e.g., Approve/Reject)
  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/withdrawal_api.php`, {
        id,  // Send 'id'
        request_status: newStatus,
      });

      if (response.data.success) {
        setSnackbarMessage('Request status updated successfully');
        setSnackbarOpen(true);
        setWithdrawalRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === id ? { ...request, request_status: newStatus } : request
          )
        );
      } else {
        setSnackbarMessage(response.data.error || 'Failed to update request status');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      setSnackbarMessage('Failed to update request status');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="error">{snackbarMessage}</Alert>
        </Snackbar>
      ) : (
        <>
          {/* Table to display withdrawal requests */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Requested Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Ensure withdrawalRequests is an array */}
                {Array.isArray(withdrawalRequests) && withdrawalRequests.length > 0 ? (
                  withdrawalRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.user_id}</TableCell>
                      <TableCell>{request.role}</TableCell>
                      <TableCell>{request.account_number}</TableCell>
                      <TableCell>{request.requested_amount}</TableCell>
                      <TableCell>{request.request_status === 'approved' ? 'Approved' : request.request_status}</TableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={request.request_status}
                            onChange={(e) => handleStatusChange(request.id, e.target.value)}
                            label="Status"
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="approved">Approved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No withdrawal requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default WithdrawalRequestsComponent;
