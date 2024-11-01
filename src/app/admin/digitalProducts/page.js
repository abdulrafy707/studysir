"use client"; // Enforces client-side rendering for this component
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
  Typography,
} from '@mui/material';
import { useSearchParams } from 'next/navigation'; // Use for URL parameters

const EbookComponent = () => {
  const [ebooks, setEbooks] = useState([]); // Store all ebooks
  const [filteredEbooks, setFilteredEbooks] = useState([]); // Store filtered ebooks
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(false); // Error state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar for success/error messages
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message for snackbar

  const searchParams = useSearchParams(); // Fetch query parameters from URL
  const searchQuery = searchParams.get('q') || ''; // Get the search query from the URL
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Fetch base URL from .env file

  // Fetch the list of ebooks when the component mounts
  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/ebook_api.php`); // Call the API to fetch ebooks
        if (response.data.error) {
          setError(true);
          setSnackbarMessage(response.data.error);
        } else {
          setEbooks(response.data);
        }
      } catch (err) {
        console.error('Error fetching ebooks:', err);
        setError(true);
        setSnackbarMessage('Failed to fetch ebooks');
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, [apiUrl]);

  // Filter ebooks whenever the search query or ebooks data changes
  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = ebooks.filter((ebook) =>
        ebook.ebook_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEbooks(filtered);
    } else {
      setFilteredEbooks(ebooks); // Reset to full list if no search query
    }
  }, [searchQuery, ebooks]);

  // Handle status change (Active/Inactive)
  const handleStatusChange = async (ebookId, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/ebook_api.php`, {
        ebook_id: ebookId,
        status: newStatus, // 'active' or 'inactive'
      });

      if (response.data.success) {
        setSnackbarMessage('Ebook status updated successfully');
        setSnackbarOpen(true);
        setEbooks((prevEbooks) =>
          prevEbooks.map((ebook) =>
            ebook.ebook_id === ebookId ? { ...ebook, status: newStatus } : ebook
          )
        );
      } else {
        setSnackbarMessage(response.data.error || 'Failed to update ebook status');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating ebook status:', error);
      setSnackbarMessage('Failed to update ebook status');
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
            <Typography variant="h4" gutterBottom>
              Ebooks List
            </Typography>

            {/* Table to display ebooks */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ebook ID</TableCell>
                    <TableCell>Ebook Title</TableCell>
                    <TableCell>Author Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Seller Name</TableCell>
                    <TableCell>Downloads</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEbooks.map((ebook) => (
                    <TableRow key={ebook.ebook_id}>
                      <TableCell>{ebook.ebook_id}</TableCell>
                      <TableCell>{ebook.ebook_title}</TableCell>
                      <TableCell>{ebook.author_name}</TableCell>
                      <TableCell>Rs {ebook.price}</TableCell>
                      <TableCell>{ebook.seller_name}</TableCell>
                      <TableCell>{ebook.downloads}</TableCell>
                      <TableCell>{ebook.status === 'active' ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={ebook.status}
                            onChange={(e) => handleStatusChange(ebook.ebook_id, e.target.value)}
                            label="Status"
                          >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
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

export default EbookComponent;
