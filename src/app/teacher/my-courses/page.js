"use client";
import { useState } from 'react';
import CourseTeacherId from '@/app/components/CourseTeacherId'; // Updated component
import NewCourse from "@/app/components/NewCourse";

export default function Page() {
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  // Function to toggle the course form
  const handleAddCourseClick = () => {
    setIsAddingCourse(true);
  };

  const handleCloseForm = () => {
    setIsAddingCourse(false); // Close the form after adding or cancelling
  };

  return (
    <div className="container text-black mx-auto p-8">
      {/* Button to Add New Course */}
      {!isAddingCourse && (
        <button
          onClick={handleAddCourseClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          Add New Course
        </button>
      )}

      {/* Show the form if the "Add New Course" button is clicked */}
      {isAddingCourse && <NewCourse onCloseForm={handleCloseForm} />}

      {/* Render the CourseTeacherId component */}
      <CourseTeacherId />
    </div>
  );
}
