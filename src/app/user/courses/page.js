'use client'; // Ensure this is a client-side component

import { useEffect, useState } from "react";
import CourseList from "@/app/components/Get_courses"; // Assuming Get_courses renders individual courses
import Header from "@/app/components/Header";

export default function Page() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    }
  };

  // Initial fetch to load all courses
  useEffect(() => {
    fetchCourseData();
  }, [baseUrl]);

  // Handle search input change and trigger fetch on Enter key press
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchCourseData(searchQuery.trim());
    }
  };

  return (
    <div className="container text-black mx-auto p-0 flex flex-col items-center min-h-screen">
      <Header/>
      <div className="flex text-black justify-center pt-16  w-full  sm:px-0">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          onKeyPress={handleKeyPress}
          placeholder="Search for a course by title or description..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Render the CourseList component for each course */}
      <div className="flex text-black flex-col items-center w-full px-4">
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
