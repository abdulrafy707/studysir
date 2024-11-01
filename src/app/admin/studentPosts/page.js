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
  TextField
} from '@mui/material';
import { useSearchParams } from 'next/navigation'; // Use for URL parameters

const PostComponent = () => {
  const [posts, setPosts] = useState([]);               // Store all posts
  const [filteredPosts, setFilteredPosts] = useState([]); // Store filtered posts
  const [loading, setLoading] = useState(true);          // Loading state
  const [error, setError] = useState(false);             // Error state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar for success/error messages
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message for snackbar

  const searchParams = useSearchParams();                // Fetch query parameters from URL
  const searchQuery = searchParams.get('q') || '';       // Get the search query from the URL
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;   // Fetch base URL from .env file

  // Fetch the list of posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/studentpost_api.php`); // Call the API to fetch posts
        if (response.data.error) {
          setError(true);
          setSnackbarMessage(response.data.error);
        } else {
          setPosts(response.data);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(true);
        setSnackbarMessage('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [apiUrl]);

  // Filter posts whenever the search query or posts data changes
  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = posts.filter((post) =>
        post.job_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts); // Reset to full list if no search query
    }
  }, [searchQuery, posts]);

  // Handle status change (Active/Inactive)
  const handleStatusChange = async (postId, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/studentpost_api.php`, {
        post_id: postId,
        status: newStatus,  // 'active' or 'inactive'
      });

      if (response.data.success) {
        setSnackbarMessage('Post status updated successfully');
        setSnackbarOpen(true);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.post_id === postId ? { ...post, status: newStatus } : post
          )
        );
      } else {
        setSnackbarMessage(response.data.error || 'Failed to update post status');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating post status:', error);
      setSnackbarMessage('Failed to update post status');
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
         

          {/* Table to display posts */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Post ID</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.post_id}>
                    <TableCell>{post.post_id}</TableCell>
                    <TableCell>{post.job_title}</TableCell>
                    <TableCell>{post.location}</TableCell>
                    <TableCell>{post.status === 'active' ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={post.status}
                          onChange={(e) => handleStatusChange(post.post_id, e.target.value)}
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
  );
};

export default PostComponent;
