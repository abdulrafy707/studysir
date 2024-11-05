'use client';
import { useState, useEffect } from 'react';
import {
  FaSignOutAlt,
  FaChevronDown,
  FaUsers,
  FaGamepad,
  FaMoneyCheckAlt,
  FaCog,
  FaUserTie,
  FaFileAlt,
  FaMoneyBillWave, // For Money Management icon
  FaHandHoldingUsd, // For Withdrawal Request icon
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const [userName, setUserName] = useState('Guest'); // Default values
  const [userRole, setUserRole] = useState('admin'); // Default role
  const [isDropdownOpen, setIsDropdownOpen] = useState({});
  const router = useRouter();

  const toggleDropdown = (key) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleLogout = () => {
    // Perform any additional actions on logout if needed
    window.location.href = '/admin-login';
  };

  useEffect(() => {
    // Optional: You can add logic here for loading user info if needed
  }, []);

  // Define menu items with roles
  const menuItems = [
    {
      title: "User Management",
      icon: <FaUsers className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
      dropdown: [
        { title: "Student", path: "/admin/studentManagement" },
        { title: "Teacher", path: "/admin/teacherManagement" },
      ],
    },
    {
      title: "Posts Management",
      icon: <FaFileAlt className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
      dropdown: [
        { title: "Student Posts", path: "/admin/studentPosts" },
        
        { title: "Digital Products", path: "/admin/digitalProducts" },
        { title: "Courses", path: "/admin/courses" },
      ],
    },
    {
      title: "Wallet Management",
      path: "/admin/coin_requests",
      icon: <FaMoneyCheckAlt className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },
    {
      title: "Money Management",
      path: "/admin/money_request",
      icon: <FaMoneyBillWave className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Withdrawal Request",
      path: "/admin/withdraw-request",
      icon: <FaHandHoldingUsd className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Payment Methods",
      path: "/admin/payment_methods",
      icon: <FaMoneyCheckAlt className="h-5 w-5" />,
      roles: ["admin"], // Show this only to admin role
    },
    
    
  ];

  return (
    <div className="bg-gray-700 text-white w-full min-h-screen flex flex-col">
      {/* Profile Section */}
      <div className="p-6 text-center">
        <img
          src="/logo.png"
          alt="Profile"
          className="rounded-full mx-auto mb-4 w-24 h-24"
        />
        <h2 className="text-xl font-semibold">Study Sir</h2>
        <p className="text-green-400 mt-1">● Online</p>
      </div>

      {/* Menu Section */}
      <div className="flex-1 p-4 border-t border-gray-600">
        <ul className="mt-6 space-y-3">
          {/* Dynamic Menu Items */}
          {menuItems.map(
            (item, index) =>
              item.roles.includes(userRole) && (
                <li key={item.title}>
                  {/* Check if menu item has a dropdown */}
                  {item.dropdown ? (
                    <>
                      <button
                        className="flex items-center w-full p-3 hover:bg-blue-700 rounded-md focus:outline-none"
                        onClick={() => toggleDropdown(index)}
                      >
                        {item.icon}
                        <span className="ml-3 text-sm font-medium">
                          {item.title}
                        </span>
                        <FaChevronDown
                          className={`h-4 w-4 ml-auto transform transition-transform duration-200 ${
                            isDropdownOpen[index] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isDropdownOpen[index] && (
                        <ul className="ml-6 mt-2 space-y-2">
                          {item.dropdown.map((dropdownItem) => (
                            <li key={dropdownItem.title}>
                              <a href={dropdownItem.path}>
                                <button className="flex items-center p-2 hover:bg-blue-700 rounded-md w-full">
                                  <span className="ml-3 text-sm font-medium">
                                    {dropdownItem.title}
                                  </span>
                                </button>
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <a href={item.path}>
                      <button className="flex items-center p-3 hover:bg-blue-700 rounded-md w-full">
                        {item.icon}
                        <span className="ml-3 text-sm font-medium">
                          {item.title}
                        </span>
                      </button>
                    </a>
                  )}
                </li>
              )
          )}

          {/* Logout Button */}
          <li className="mt-6">
            <button
              className="flex items-center w-full p-3 hover:bg-blue-700 rounded-md focus:outline-none"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="h-5 w-5" />
              <span className="ml-3 text-sm font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
