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
  Typography
} from '@mui/material';

const MoneyHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [studentId, setStudentId] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        setStudentId(user.id);
      } else {
        setError(true);
        setSnackbarMessage('Failed to retrieve user information.');
        setSnackbarOpen(true);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMoneyHistory = async () => {
      if (!studentId) return;

      try {
        const response = await axios.get(`${apiUrl}/money_history_api.php?student_id=${studentId}`);
        console.log('API response:', response.data);

        if (response.data.error) {
          setError(true);
          setSnackbarMessage(response.data.error);
          setSnackbarOpen(true);
          setHistory([]);
        } else {
          setHistory(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error('Error fetching money history:', err);
        setError(true);
        setSnackbarMessage('Failed to fetch money history');
        setSnackbarOpen(true);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoneyHistory();
  }, [apiUrl, studentId]);

  return (
    <Box sx={{ p: 0 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Snackbar open={snackbarOpen} autoHideDuration={6000}>
          <Alert severity="error">{snackbarMessage}</Alert>
        </Snackbar>
      ) : history.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', color: 'black' }}>
            No money history available for this student.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            width: { xs: '110vw', md: '80%' },
            mx: 'auto',
            overflowX: 'auto', // Ensure table is scrollable on mobile
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Requested Amount</TableCell>
                <TableCell>Final Balance</TableCell>
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

export default MoneyHistoryPage;
