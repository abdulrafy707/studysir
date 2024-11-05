'use client';

import { useEffect, useState } from "react";
import TeacherCard from "@/app/components/Teachercard";
import { ThreeDots } from 'react-loader-spinner';

export default function Page() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

 // Function to fetch data from either the teacher API or the searched teacher API
const fetchTeacherData = async (query = '') => {
  setLoading(true);
  setError(null); // Reset error before fetching

  try {
    const apiUrl = query
      ? `https://studysir.m3xtrader.com/api/searched_teacher_api.php?query=${encodeURIComponent(query)}`
      : `https://studysir.m3xtrader.com/api/teacher_api.php`;

    const response = await fetch(apiUrl);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Log the data to inspect its structure
    console.log("API response data:", data);

    // Check if data contains an error key
    if (data.error) {
      setError(data.error);
      console.error("API Error:", data.error);
      return;
    }

    const uniqueTeachers = Array.from(
      new Map(data.map((teacher) => [teacher.id, teacher])).values()
    );

    setTeachers(shuffleArray(uniqueTeachers).slice(0, 5)); // Display up to 5 teachers
  } catch (error) {
    console.error("Error fetching teachers:", error);
    setError("Could not load teacher data.");
  } finally {
    setLoading(false);
  }
};


  // Initial fetch to load all teachers when the component mounts
  useEffect(() => {
    fetchTeacherData();
  }, [baseUrl]);

  // Handle search input change and fetch data when Enter is pressed
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchTeacherData(searchQuery.trim());
    }
  };

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-0">
      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          onKeyPress={handleKeyPress}
          placeholder="Search for a teacher by description or subject..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Teacher Cards */}
      <div className="w-full flex flex-col items-center">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="w-full flex justify-center mb-4">
            <TeacherCard teacher={teacher} baseUrl={baseUrl} />
          </div>
        ))}
      </div>
    </div>
  );
}
