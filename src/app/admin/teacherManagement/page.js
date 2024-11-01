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
  InputLabel
} from '@mui/material';

const TeacherComponent = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]); // Store the filtered teachers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State to store query parameter

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Fetch base URL from .env file

  // Fetch the query parameter directly from the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
  }, []);

  // Fetch the list of teachers when the component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/teacher_api.php`); // Call the API
        if (response.data.error) {
          setError(true);
          setSnackbarMessage(response.data.error);
        } else {
          setTeachers(response.data);
        }
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError(true);
        setSnackbarMessage('Failed to fetch teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [apiUrl]);

  // Filter teachers whenever the search query or teacher data changes
  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = teachers.filter((teacher) =>
        teacher.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers(teachers); // Reset to full list if no search query
    }
  }, [searchQuery, teachers]);

  // Handle status change
  const handleStatusChange = async (teacherId, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/teacher_api.php`, {
        id: teacherId, // Send the correct teacher ID
        status: newStatus, // Use lowercase 'status' as expected by your API
      });

      if (response.data.success) {
        setSnackbarMessage('Teacher status updated successfully');
        setSnackbarOpen(true);
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher.id === teacherId ? { ...teacher, status: newStatus } : teacher
          )
        );
      } else {
        setSnackbarMessage(response.data.error || 'Failed to update teacher status');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating teacher status:', error);
      setSnackbarMessage('Failed to update teacher status');
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Current Coins</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.id}</TableCell>
                  <TableCell>{teacher.username}</TableCell>
                  <TableCell>{teacher.fullname}</TableCell>
                  <TableCell>{teacher.current_coins}</TableCell>
                  <TableCell>{teacher.gender}</TableCell>
                  <TableCell>{teacher.city || 'N/A'}</TableCell>
                  <TableCell>{teacher.country || 'N/A'}</TableCell>
                  <TableCell>{teacher.status === 'active' ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={teacher.status}
                        onChange={(e) => handleStatusChange(teacher.id, e.target.value)}
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

export default TeacherComponent;
