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
  InputLabel
} from '@mui/material';
import { useSearchParams } from 'next/navigation'; // Use for URL parameters

const StudentComponent = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // Store the filtered students
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const searchParams = useSearchParams(); // Fetch query parameters from URL
  const searchQuery = searchParams.get('q') || ''; // Get the search query from the URL
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Fetch base URL from .env file

  // Fetch the list of students when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/student_api.php`); // Call the API
        if (response.data.error) {
          setError(true);
          setSnackbarMessage(response.data.error);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        } else {
          setStudents(response.data);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(true);
        setSnackbarMessage('Failed to fetch students');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [apiUrl]);

  // Filter students whenever the search query or students data changes
  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = students.filter((student) =>
        student.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students); // Reset to full list if no search query
    }
  }, [searchQuery, students]);

  // Handle status change for a student
  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const response = await axios.put(`${apiUrl}/student_api.php`, {
        id: studentId,
        status: newStatus
      });

      if (response.data.success) {
        setSnackbarMessage('Status updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        // Update the student's status locally in the state
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === studentId ? { ...student, status: newStatus } : student
          )
        );
      } else {
        setSnackbarMessage(response.data.error || 'Failed to update status');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbarMessage('Error updating status');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
                <TableCell>Gender</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.username}</TableCell>
                  <TableCell>{student.fullname}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.city || 'N/A'}</TableCell>
                  <TableCell>{student.country || 'N/A'}</TableCell>
                  <TableCell>{student.status === 'active' ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={student.status}
                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
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
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentComponent;
