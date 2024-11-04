'use client';

import { useEffect, useState } from "react";
import JobCard from "@/app/components/JobCard"; // Use JobCard to render each job post
import { ThreeDots } from 'react-loader-spinner';
import Header from "@/app/components/Header";

export default function Page() {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchJobData = async (query = '') => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = query 
        ? `https://studysir.m3xtrader.com/api/searched_studentpost_api.php?query=${encodeURIComponent(query)}`
        : `${baseUrl}/studentpost_api.php`;

      const response = await fetch(apiUrl);
      console.log("API response:", response);

      if (!response.ok) throw new Error("Failed to fetch job data");

      const responseData = await response.text();
      console.log("Raw response data:", responseData);

      const cleanData = responseData.replace(/<br\s*\/?>|<[^>]+>|Deprecated:.+/g, '').trim();
      console.log("Cleaned data:", cleanData);

      const jobData = JSON.parse(cleanData);
      console.log("Parsed job data:", jobData);

      setJobPosts(jobData);
    } catch (error) {
      console.error("Error fetching job data:", error);
      setError("Could not load job data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData();
  }, [baseUrl]);

  const handleSearchInput = (e) => setSearchQuery(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchJobData(searchQuery.trim());
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
    <div className="container mx-auto flex flex-col items-center text-black">
      <Header/>
      <div className="w-full pt-16 max-w-md my-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          onKeyPress={handleKeyPress}
          placeholder="Search for job posts..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Job Cards */}
      <div className="w-full flex flex-col items-center">
        {jobPosts.map((job) => (
          <div key={job.post_id} className="w-full flex justify-center mb-1">
            <JobCard post={job} baseUrl={baseUrl} /> {/* Render each item as a JobCard */}
          </div>
        ))}
      </div>
    </div>
  );
}
