"use client";
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
import { useRouter, usePathname } from "next/navigation"; // Using useRouter and usePathname

const TeacherPostComponent = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Fetch base URL from .env file
  const router = useRouter();
  const pathname = usePathname();

  // Fetch the list of posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/teacherpost_api.php`);
        if (response.data.error) {
          setError(true);
          setSnackbarMessage(response.data.error);
        } else {
          setPosts(response.data);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(true);
        setSnackbarMessage("Failed to fetch posts");
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
        post.post_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts); // Reset to full list if no search query
    }
  }, [searchQuery, posts]);

  // Debounced search handler to update query in URL
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("page", "1");

    if (searchValue && searchValue.length > 2) {
      newUrl.searchParams.set("q", searchValue);
    } else {
      newUrl.searchParams.delete("q");
    }

    router.push(newUrl.toString());
  };

  // Handle status change (Active/Inactive)
  const handleStatusChange = async (postId, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/teacherpost_api.php`, {
        post_id: postId,
        status: newStatus,
      });

      if (response.data.success) {
        setSnackbarMessage("Post status updated successfully");
        setSnackbarOpen(true);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.post_id === postId ? { ...post, status: newStatus } : post
          )
        );
      } else {
        setSnackbarMessage(response.data.error || "Failed to update post status");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating post status:", error);
      setSnackbarMessage("Failed to update post status");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<CircularProgress />}>
      <Box sx={{ padding: 3 }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
        />
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
                    <TableCell>Post ID</TableCell>
                    <TableCell>Post Description</TableCell>
                    <TableCell>Teacher Name</TableCell>
                    <TableCell>Fee Range</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.post_id}>
                      <TableCell>{post.post_id}</TableCell>
                      <TableCell>{post.post_description}</TableCell>
                      <TableCell>{post.teacher_details.fullname}</TableCell>
                      <TableCell>{post.fee_range}</TableCell>
                      <TableCell>{post.status === "active" ? "Active" : "Inactive"}</TableCell>
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

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success">{snackbarMessage}</Alert>
        </Snackbar>
      </Box>
    </Suspense>
  );
};

export default TeacherPostComponent;
