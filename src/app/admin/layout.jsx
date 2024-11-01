'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Navbar from "../dashboard/navbar/navbar";
import Sidebar from "../dashboard/sidebar/sidebar";
import Footer from "../dashboard/footer/footer";
import { ToastContainer } from "react-toastify";

const Layout = ({ children }) => {
  const router = useRouter();

  // useEffect(() => {
  //   const token = Cookies.get('token');
  //   if (!token) {
  //     // If no token, redirect to login page
  //     router.push('/Login');
  //   }
  // }, [router]);

  // // If no token, we avoid showing the page content
  // if (!Cookies.get('token')) {
  //   return null; // Or you can show a loading spinner
  // }

  return (
    <div className="flex w-full min-h-screen bg-white">
      <div className="flex w-[350px]">
        <ToastContainer />
        <Sidebar />
      </div>
      <div className="flex flex-col w-full flex-grow">
        <Navbar />
        <div className="flex-grow p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
