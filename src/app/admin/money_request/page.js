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
  Dialog,
  DialogContent,
} from '@mui/material';

const MoneyRequestsComponent = () => {
  const [moneyRequests, setMoneyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchMoneyRequests = async () => {
      try {
        const response = await axios.get(`${apiUrl}/money_request_api.php`);
        if (response.data.error) {
          setError(true);
          setSnackbarMessage(response.data.error);
        } else {
          setMoneyRequests(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error('Error fetching money requests:', err);
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
      const response = await axios.put(`${apiUrl}/money_request_api.php`, {
        id,
        request_status: newStatus,
      });
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageDialog(true);
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
                  {Array.isArray(moneyRequests) && moneyRequests.length > 0 ? (
                    moneyRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.student_id}</TableCell>
                        <TableCell>{request.requested_amount}</TableCell>
                        <TableCell>{request.purpose}</TableCell>
                        <TableCell>
                          <img
                            src={`${apiUrl}/uploads/${request.bank_receipt_url}`}
                            alt="Receipt"
                            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                            onClick={() => handleImageClick(`${apiUrl}/uploads/${request.bank_receipt_url}`)}
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
                      <TableCell colSpan={7} align="center">
                        No money requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Dialog to show full image on click */}
            <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
              <DialogContent>
                <img
                  src={selectedImage}
                  alt="Full Receipt"
                  style={{ width: '100%', height: 'auto' }}
                />
              </DialogContent>
            </Dialog>
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
