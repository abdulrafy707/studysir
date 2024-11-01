'use client'; // Ensure this is a client-side component

import { useEffect, useState } from "react";
import CourseList from "@/app/components/Get_courses"; // Assuming Get_courses renders individual courses

export default function Page() {
  const [courses, setCourses] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Helper function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course data
        const response = await fetch(`${baseUrl}/get_courses_api.php`);
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

    fetchCourseData();
  }, [baseUrl]);

  return (
    <div className="container mx-auto p-8">
      {/* Render the CourseList component for each course */}
      {courses.map((course, index) => (
        <CourseList key={index} course={course} />
      ))}
    </div>
  );
}
