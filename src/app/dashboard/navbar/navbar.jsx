"use client";
import { useRouter, usePathname } from "next/navigation";
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Debounced function to handle search input and update URL
  const handleSearch = useDebouncedCallback((e) => {
    const searchValue = e.target.value;

    // Construct a new URL with the updated search parameter
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("page", "1");

    if (searchValue && searchValue.length > 2) {
      newUrl.searchParams.set("q", searchValue);
    } else {
      newUrl.searchParams.delete("q"); // Remove the search parameter if empty
    }

    // Push the updated URL
    router.push(newUrl.toString());
  }, 300);

  // Capitalize page title or handle specific route title
  const pageTitle = pathname.split("/").pop();
  const formattedTitle = pageTitle === "Submittions" ? "Submissions" : pageTitle;

  return (
    <header className="flex items-center justify-between bg-gray-700 p-3 mb-5 h-16">
      <div className="flex items-center">
        <div className="text-white text-xl font-bold capitalize ml-5">
          {formattedTitle}
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
