// SearchComponent.js
"use client"; // Ensures client-side rendering for this component
import React from 'react';
import { useSearchParams } from 'next/navigation';

const SearchComponent = ({ onSearch }) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  React.useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return null; // This component doesn't need to render anything
};

export default SearchComponent;
