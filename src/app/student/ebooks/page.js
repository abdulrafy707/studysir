'use client'; // Ensure this is a client-side component

import { useEffect, useState } from 'react';
import EbookCard from "@/app/components/EbookCard"; // Assuming EbookCard renders individual ebooks

export default function Page() {
  const [ebooks, setEbooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch ebook data, either all ebooks or based on a search query
  const fetchEbookData = async (query = '') => {
    try {
      const apiUrl = query 
        ? `https://studysir.m3xtrader.com/api/searched_ebook_api.php?query=${encodeURIComponent(query)}`
        : `${baseUrl}/ebook_api.php`;

      const response = await fetch(apiUrl);
      const ebookData = await response.json();

      console.log("Fetched Ebooks:", ebookData); // Check what the API returns
      
      setEbooks(ebookData);
    } catch (error) {
      console.error("Error fetching ebooks:", error);
    }
  };

  // Initial fetch to load all ebooks
  useEffect(() => {
    fetchEbookData();
  }, [baseUrl]);

  // Handle search input change and trigger fetch on Enter key press
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchEbookData(searchQuery.trim());
    }
  };

  return (
    <div className="container text-black mx-auto p-0">
      {/* Search Bar */}
      <div className="flex text-black justify-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          onKeyPress={handleKeyPress}
          placeholder="Search for an ebook by title or description..."
          className="w-[400px] text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Render the EbookCard component for each ebook */}
      {ebooks.length > 0 ? (
        ebooks.map((ebook, index) => (
          <EbookCard key={index} ebook={ebook} /> // Pass the ebook data to each EbookCard
        ))
      ) : (
        <div>No ebooks available</div>
      )}
    </div>
  );
}
