'use client';
import React, { useState, useEffect, Suspense } from "react";

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

const CoinRequestsComponent = () => {
  const [coinRequests, setCoinRequests] = useState([]);  // Store all coin requests
  const [loading, setLoading] = useState(true);          // Loading state
  const [error, setError] = useState(false);             // Error state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar for success/error messages
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message for snackbar
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;   // Fetch base URL from .env file

  // Fetch the list of coin requests when the component mounts
  useEffect(() => {
    const fetchCoinRequests = async () => {
      try {
        const response = await axios.get(`${apiUrl}/coin_request_api.php`); // Call the API to fetch coin requests
        if (response.data.error) {
          setError(true);
          setSnackbarMessage(response.data.error);
        } else {
          // Ensure the response is an array before updating the state
          if (Array.isArray(response.data)) {
            setCoinRequests(response.data);
          } else {
            setCoinRequests([]);  // Set to an empty array if the response is not an array
          }
        }
      } catch (err) {
        console.error('Error fetching coin requests:', err);
        setError(true);
        setSnackbarMessage('Failed to fetch coin requests');
      } finally {
        setLoading(false);
      }
    };

    fetchCoinRequests();
  }, [apiUrl]);

  // Handle status change (e.g., Approve/Reject)
  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
        const response = await axios.put(`${apiUrl}/coin_request_api.php`, {
            id,  // Send 'id'
            request_status: newStatus,
        });

        if (response.data.success) {
            setSnackbarMessage('Request status updated successfully');
            setSnackbarOpen(true);
            setCoinRequests((prevRequests) =>
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
    <Suspense fallback={<CircularProgress />}>
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
          {/* Table to display coin requests */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Teacher ID</TableCell>
                  <TableCell>Requested Amount</TableCell>
                  <TableCell>Bank Receipt</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Ensure coinRequests is an array */}
                {Array.isArray(coinRequests) && coinRequests.length > 0 ? (
                  coinRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.teacher_id}</TableCell>
                      <TableCell>{request.requested_amount}</TableCell>
                      <TableCell>
                        {/* Display the bank receipt image using the URL path */}
                        <img
                          src={`${apiUrl}/uploads/${request.bank_receipt_url}`}
                          alt="Receipt"
                          style={{ width: '100px', height: '100px' }}
                        />
                      </TableCell>
                      <TableCell>{request.request_status === 'approved' ? 'Approved' : 'Pending'}</TableCell>
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
                      No coin requests found.
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
    </Suspense>
  );
};

export default CoinRequestsComponent;
