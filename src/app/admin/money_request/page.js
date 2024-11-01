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

const MoneyRequestsComponent = () => {
  const [moneyRequests, setMoneyRequests] = useState([]);  // Store all money requests
  const [loading, setLoading] = useState(true);            // Loading state
  const [error, setError] = useState(false);               // Error state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar for success/error messages
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message for snackbar
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;     // Fetch base URL from .env file

  // Fetch the list of money requests when the component mounts
  useEffect(() => {
    const fetchMoneyRequests = async () => {
      try {
        console.log('Fetching money requests from API:', apiUrl); // Log the API URL
        const response = await axios.get(`${apiUrl}/money_request_api.php`); // Call the API to fetch money requests
        console.log('API Response:', response.data); // Log the API response

        if (response.data.error) {
          console.error('Error fetching money requests:', response.data.error); // Log any errors
          setError(true);
          setSnackbarMessage(response.data.error);
        } else {
          // Ensure the response is an array before updating the state
          if (Array.isArray(response.data)) {
            setMoneyRequests(response.data);
          } else {
            setMoneyRequests([]);  // Set to an empty array if the response is not an array
          }
        }
      } catch (err) {
        console.error('Error fetching money requests:', err); // Log any request errors
        setError(true);
        setSnackbarMessage('Failed to fetch money requests');
      } finally {
        setLoading(false);
      }
    };

    fetchMoneyRequests();
  }, [apiUrl]);

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
      console.log('Sending request to API with data:', { id, request_status: newStatus });
      
      const response = await axios.put(`${apiUrl}/money_request_api.php`, {
        id,  // Send 'id'
        request_status: newStatus,
      });
  
      console.log('API Response:', response.data);  // Log the response data for debugging
  
      if (response.data.success) {
        setSnackbarMessage('Request status updated successfully');
        setSnackbarOpen(true);
        setMoneyRequests((prevRequests) =>
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
          {/* Table to display money requests */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Requested Amount</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Receipt</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Ensure moneyRequests is an array */}
                {Array.isArray(moneyRequests) && moneyRequests.length > 0 ? (
                  moneyRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.student_id}</TableCell>
                      <TableCell>{request.requested_amount}</TableCell>
                      <TableCell>{request.purpose}</TableCell>
                      <TableCell>
  {console.log(`Receipt URL: ${apiUrl}/uploads/${request.bank_receipt_url
}`)}
  <img
    src={`${apiUrl}/uploads/${request.bank_receipt_url
    }`}
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
                      No money requests found.
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

export default MoneyRequestsComponent;
