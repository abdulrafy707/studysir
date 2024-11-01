'use client'; // Ensure this is a client-side component

import { useEffect, useState } from "react";
import TeacherList from "@/app/components/Teachercard"; // Assuming Teachercard renders individual teacher
import Header from '@/app/components/Header'; // Import the Header component

export default function Page() {
  const [randomTeachers, setRandomTeachers] = useState([]);
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
      }
    };

    fetchTeacherData();
  }, [baseUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Header /> {/* Added Header component */}
      <div className="flex flex-wrap justify-center items-center mt-8 w-full max-w-5xl p-4">
        {/* Render the random teachers */}
        {randomTeachers.length > 0 ? (
          randomTeachers.map((teacher) => (
            <div key={teacher.teacher_id} className="p-4">
              <TeacherList teacher={teacher} baseUrl={baseUrl} />
            </div>
          ))
        ) : (
          <div>No teachers available</div>
        )}
      </div>
    </div>
  );
}
