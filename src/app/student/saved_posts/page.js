'use client';

import { useEffect, useState } from "react";
import JobCard from "@/app/components/JobCard";
import TeacherCard from "@/app/components/Teachercard";
import { ThreeDots } from 'react-loader-spinner';
import CourseList from "@/app/components/Get_courses";
import Image from "next/image"; // Import Image component if using Next.js

export default function SavedPostsPage() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchSavedPosts = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.id) {
        throw new Error('User not logged in');
      }

      const response = await fetch(`${baseUrl}/save_post_api.php?user_id=${userData.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSavedPosts(data);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      setError("An error occurred while fetching saved posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, [baseUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots height="80" width="80" radius="9" color="#3498db" ariaLabel="three-dots-loading" visible={true} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!savedPosts.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <Image src="/nosavepost.png" alt="No posts available" width={150} height={150} /> {/* Display no post image */}
        <p className="text-red-500 font-semibold mt-4">No saved posts available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 mt-4">
      {savedPosts.map((post, index) => {
        switch (post.post_type) {
          case 'studentpost':
            return <JobCard key={index} post={post} />;
          case 'course':
            return <CourseList key={index} course={post} />;
          case 'teacherpost':
            return <TeacherCard key={index} teacher={post} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
