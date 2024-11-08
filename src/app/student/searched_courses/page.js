'use client'; // Ensure this is a client-side component

import { useEffect, useState } from "react";
import CourseList from "@/app/components/Get_courses"; // Assuming Get_courses renders individual courses
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [initialLoad, setInitialLoad] = useState(true); // Track if it's the first load

  // Helper function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Fetch course data, either all courses or based on a search query
  const fetchCourseData = async (query = '') => {
    try {
      const apiUrl = query 
        ? `${baseUrl}/search_courses_api.php?query=${encodeURIComponent(query)}`
        : `${baseUrl}/get_courses_api.php`;

      const response = await fetch(apiUrl);
      const courseData = await response.json();

      // Ensure unique course records based on a unique identifier (e.g., course_id)
      const uniqueCourses = Array.from(
        new Map(courseData.map((course) => [course.course_id, course])).values()
      );

      // Shuffle the unique course records
      const shuffledCourses = shuffleArray(uniqueCourses);

      // Set the unique courses in state
      setCourses(shuffledCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses. Please try again later.");
    }
  };

  // Fetch data on the initial load using URL search params, and set initial load flag to false after
  useEffect(() => {
    if (initialLoad) {
      const urlParams = new URLSearchParams(window.location.search);
      const initialQuery = urlParams.get('query') || '';
      setSearchQuery(initialQuery);
      fetchCourseData(initialQuery);
      setInitialLoad(false);
    }
  }, [baseUrl, initialLoad]);

  // Handle search input change and trigger fetch on Enter key press
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const newUrl = `?query=${encodeURIComponent(searchQuery.trim())}`;
      window.history.replaceState(null, '', newUrl);
      fetchCourseData(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen text-black flex flex-col items-center justify-center px-4">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* Search Bar */}
      <div className="w-full text-black sm:max-w-md lg:max-w-lg xl:max-w-xl flex justify-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          onKeyPress={handleKeyPress}
          placeholder="Search for a course by title or description..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Render the CourseList component for each course */}
      <div className="w-full sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <CourseList key={index} course={course} /> // Pass the course data to each CourseList component
          ))
        ) : (
          <div className="text-center">No courses available</div>
        )}
      </div>
    </div>
  );
}
