"use client";

import { MdSearch } from "react-icons/md";
import styles from "./search.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const Search = ({ placeholder }) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useDebouncedCallback((e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);

    const params = new URLSearchParams(window.location.search);
    params.set("page", 1); // Reset to the first page when searching

    if (newValue && newValue.length > 2) {
      params.set("q", newValue); // Set query parameter for search
    } else {
      params.delete("q"); // Remove the query if input is empty
    }

    // Use 'push' instead of 'replace' so the search state remains in the history
    router.push(`?${params.toString()}`);
  }, 300); // Debounce search input for smoother UX

  return (
    <div className={styles.container}>
      <MdSearch />
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        value={searchValue}
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;
