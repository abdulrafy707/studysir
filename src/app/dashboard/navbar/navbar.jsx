"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Debounced function to handle search input and update URL
  const handleSearch = useDebouncedCallback((e) => {
    const searchValue = e.target.value;
    const params = new URLSearchParams(searchParams);

    // Reset to first page and set query parameter for search
    params.set("page", 1);
    if (searchValue && searchValue.length > 2) {
      params.set("q", searchValue);
    } else {
      params.delete("q"); // Remove the search parameter if empty
    }

    // Update the URL
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <header className="flex items-center justify-between bg-gray-700 p-3 mb-5 h-16">
      <div className="flex items-center">
        <div className="text-white text-xl font-bold capitalize ml-5">
          {pathname.split("/").pop() === "Submittions" ? (
            <>Submissions</>
          ) : (
            <>{pathname.split("/").pop()}</>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center bg-white p-1 rounded-lg h-10">
          <MdSearch className="text-black" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-black ml-2"
            onChange={handleSearch}
          />
        </div>
        <div className="relative text-white">
          <MdOutlineChat size={28} />
        </div>
        <div className="relative text-white">
          <MdNotifications size={28} />
        </div>
        <div className="relative text-white mr-4">
          <MdPublic size={28} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
