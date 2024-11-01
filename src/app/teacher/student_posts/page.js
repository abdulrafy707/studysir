'use client';

import { useEffect, useState } from "react";
import TeacherList from "@/app/components/Teachercard"; // Assuming Teachercard renders individual teacher

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
        const response = await fetch(`${baseUrl}/teacher_api.php`);
        const teachers = await response.json();

        const uniqueTeachers = Array.from(
          new Map(teachers.map((teacher) => [teacher.teacher_id, teacher])).values()
        );

        const shuffledTeachers = shuffleArray(uniqueTeachers);
        setRandomTeachers(shuffledTeachers.slice(0, 5));
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeacherData();
  }, [baseUrl]);

  return (
    <div className="container text-black mx-auto flex justify-center items-center flex-wrap">
      {/* Render the random teachers */}
      {randomTeachers.map((teacher) => (
        <div key={teacher.teacher_id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-2 flex justify-center">
          <TeacherList teacher={teacher} baseUrl={baseUrl} />
        </div>
      ))}
    </div>
  );
}
