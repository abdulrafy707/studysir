'use client'; // Ensure this is a client-side component

import { useEffect, useState } from 'react';
import EbookCard from "@/app/components/EbookCard"; // Assuming EbookCard renders individual ebooks

export default function Page() {
  const [ebooks, setEbooks] = useState([]);
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
    const fetchEbookData = async () => {
      try {
        // Fetch ebook data
        const response = await fetch(`${baseUrl}/ebook_api.php`);
        const ebookData = await response.json();
  
        console.log("Fetched Ebooks:", ebookData); // Check what the API returns
  
        setEbooks(ebookData); // Directly set fetched data without shuffling for testing
      } catch (error) {
        console.error("Error fetching ebooks:", error);
      }
    };
  
    fetchEbookData();
  }, [baseUrl]);
  

  return (
    <div className="container mx-auto p-8">
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
