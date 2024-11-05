'use client';

import { useEffect, useState } from "react";
import JobCard from "@/app/components/JobCard"; // Component to render each job post
import { ThreeDots } from 'react-loader-spinner';
import Header from "@/app/components/Header";

export default function Page() {
  const [jobPosts, setJobPosts] = useState([]);
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

  // Fetch job data, either all jobs or based on a search query
  const fetchJobData = async (query = '') => {
    try {
      const apiUrl = query 
        ? `https://studysir.m3xtrader.com/api/searched_studentpost_api.php?query=${encodeURIComponent(query)}`
        : `${baseUrl}/studentpost_api.php`;

      const response = await fetch(apiUrl);
      const responseData = await response.text();

      const cleanData = responseData.replace(/<br\s*\/?>|<[^>]+>|Deprecated:.+/g, '').trim();
      const jobData = JSON.parse(cleanData);

      // Ensure unique job records based on a unique identifier (e.g., post_id)
      const uniqueJobs = Array.from(new Map(jobData.map((job) => [job.post_id, job])).values());

      // Shuffle the unique job records
      const shuffledJobs = shuffleArray(uniqueJobs);

      // Set the unique jobs in state
      setJobPosts(shuffledJobs);
    } catch (error) {
      console.error("Error fetching job data:", error);
      setJobPosts([]); // Clear job posts on error
    }
  };

  // Initial fetch to load all jobs
  useEffect(() => {
    fetchJobData();
  }, [baseUrl]);

  // Handle search input change and trigger fetch on Enter key press
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchJobData(searchQuery.trim());
    }
  };

  return (
    <div className="container mx-auto p-0 flex flex-col items-center min-h-screen">
      <Header />
      <div className="flex justify-center pt-16 sm:pt-16 w-full sm:px-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          onKeyPress={handleKeyPress}
          placeholder="Search for job posts..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Job Cards */}
      <div className="flex flex-col items-center w-full px-4">
        {jobPosts.length > 0 ? (
          jobPosts.map((job) => (
            <div key={job.post_id} className="w-full flex justify-center mb-1">
              <JobCard post={job} baseUrl={baseUrl} />
            </div>
          ))
        ) : (
          <div className="text-center">No job posts available</div>
        )}
      </div>
    </div>
  );
}
