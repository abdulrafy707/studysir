"use client";

import styles from "./pagination.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Pagination = ({ count }) => {
  const router = useRouter();
  const pathname = usePathname();

  const ITEM_PER_PAGE = 2;
  const [page, setPage] = useState(1);

  // Calculate navigation availability
  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  // Sync the page number with URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get("page")) || 1;
    setPage(currentPage);
  }, []);

  // Handle page changes and update the URL
  const handleChangePage = (type) => {
    const newPage = type === "prev" ? page - 1 : page + 1;
    setPage(newPage);

    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        disabled={!hasPrev}
        onClick={() => handleChangePage("prev")}
      >
        Previous
      </button>
      <button
        className={styles.button}
        disabled={!hasNext}
        onClick={() => handleChangePage("next")}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
