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

const CourseComponent = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${apiUrl}/course_api.php`);
        setCourses(response.data);
      } catch (error) {
        setError(true);
        setSnackbarMessage('Failed to fetch courses');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [apiUrl]);

  const handleStatusChange = async (courseId, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/course_api.php`, {
        course_id: courseId,   // Correct field names
        status: newStatus      // Make sure status is lowercase
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.success) {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.course_id === courseId ? { ...course, status: newStatus } : course
          )
        );
        setSnackbarMessage('Course status updated successfully');
      } else {
        setSnackbarMessage(response.data.error || 'Failed to update course status');
      }
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error updating course status');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteCourse = async (courseId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`https://studysir.m3xtrader.com/api/course_api.php`, {
        params: { course_id: courseId } // Pass course_id as a query parameter
      });
  
      if (response.data.success) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.course_id !== courseId)
        );
        setSnackbarMessage('Course deleted successfully');
      } else {
        setSnackbarMessage(response.data.error || 'Failed to delete course');
      }
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error deleting course');
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
          {/* Updated TableContainer for horizontal scrolling */}
          <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Subject</TableCell>
                  {/* <TableCell>Teacher</TableCell> */}
                  <TableCell>Fee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.course_id}>
                    <TableCell>{course.course_title}</TableCell>
                    <TableCell>{course.description}</TableCell>
                    <TableCell>{course.language}</TableCell>
                    <TableCell>{course.subject}</TableCell>
                    {/* <TableCell>{course.teacher_name}</TableCell> */}
                    <TableCell>{course.fee}</TableCell>
                    <TableCell>{course.status === 'active' ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>
                    <TableCell>
  <button
    onClick={() => handleDeleteCourse(course.course_id)}
    style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}
  >
    Delete
  </button>
</TableCell>

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

export default CourseComponent;
