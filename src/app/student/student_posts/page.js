'use client'; // Ensure this is a client-side component

import { useEffect, useState } from "react";
import TeacherList from "@/app/components/Teachercard"; // Assuming Teachercard renders individual teacher
import { ThreeDots } from 'react-loader-spinner'; // Import the spinner

export default function Page() {
  const [randomTeachers, setRandomTeachers] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
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
    const fetchTeacherData = async () => {
      try {
        // Fetch teacher data
        const response = await fetch(`${baseUrl}/teacher_api.php`);
        const teachers = await response.json();

        // Ensure unique teacher records based on a unique identifier (e.g., teacher_id)
        const uniqueTeachers = Array.from(
          new Map(teachers.map((teacher) => [teacher.teacher_id, teacher])).values()
        );

        // Shuffle the unique teacher records
        const shuffledTeachers = shuffleArray(uniqueTeachers);

        // Set the random teachers in state
        setRandomTeachers(shuffledTeachers.slice(0, 5)); // Fetch 5 random teachers
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchTeacherData();
  }, [baseUrl]);

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#3498db"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      {/* Render the random teachers */}
      {randomTeachers.map((teacher) => (
        <TeacherList key={teacher.teacher_id} teacher={teacher} baseUrl={baseUrl} />
      ))}
    </div>
  );
}
