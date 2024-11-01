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
  Alert
} from '@mui/material';

const CoinHistoryPage = () => {
  const [history, setHistory] = useState([]); // State to hold coin history
  const [loading, setLoading] = useState(true); // State for loading spinner
  const [error, setError] = useState(false); // State for error handling
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar to show error/success messages
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [teacherId, setTeacherId] = useState(null); // State to hold teacher ID

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Fetch base URL from .env file

  // Check if code is running on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        setTeacherId(user.id); // Set teacher ID from localStorage
      } else {
        setError(true);
        setSnackbarMessage('Failed to retrieve user information.');
        setSnackbarOpen(true);
        setLoading(false);
      }
    }
  }, []);

  // Fetch the coin history when the teacherId is set
  useEffect(() => {
    const fetchCoinHistory = async () => {
      if (!teacherId) return; // Don't fetch if teacherId is not available

      try {
        const response = await axios.get(`${apiUrl}/coin_history_api.php?teacher_id=${teacherId}`); // API call

        if (response.data.error) {
          setError(true);
          setSnackbarMessage(response.data.error);
          setSnackbarOpen(true);
        } else {
          setHistory(response.data);
        }
      } catch (err) {
        console.error('Error fetching coin history:', err);
        setError(true);
        setSnackbarMessage('Failed to fetch coin history');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinHistory();
  }, [apiUrl, teacherId]);

  return (
    <Box sx={{ padding: 3 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Snackbar open={snackbarOpen} autoHideDuration={6000}>
          <Alert severity="error">{snackbarMessage}</Alert>
        </Snackbar>
      ) : history.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <p>No coin history available for this teacher.</p>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Requested Coin</TableCell>
                <TableCell>Final Coins</TableCell>
                <TableCell>Transaction Type</TableCell>
                <TableCell>Request ID</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.requested_amount}</TableCell>
                  <TableCell>{transaction.final_balance}</TableCell>
                  <TableCell>{transaction.transaction_type}</TableCell>
                  <TableCell>{transaction.request_id}</TableCell>
                  <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CoinHistoryPage;
