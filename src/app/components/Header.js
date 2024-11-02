'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userImage, setUserImage] = useState('/default-profile.png');
    const [searchQuery, setSearchQuery] = useState('');
    const [userRole, setUserRole] = useState('');
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsAuthenticated(true);
            const userData = JSON.parse(user);
            if (userData?.image) {
                setUserImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${userData.image}`);
            }
            if (userData?.role) {
                setUserRole(userData.role);
            }
        }
    }, []);

    const handleSearch = () => {
        const targetRolePath = isAuthenticated ? `/${userRole}` : '/user';
        const searchPath = searchQuery.trim() ? `${targetRolePath}/searched_courses?query=${encodeURIComponent(searchQuery)}` : targetRolePath;
        router.push(searchPath);
    };

    const handleMobileMenuClick = () => {
        if (userRole === 'teacher') {
            router.push('/teacher/sidebar');
        } else if (userRole === 'student') {
            router.push('/student/sidebar');
        }
    };

    return (
        <header className="bg-white text-black flex items-center justify-between px-4 py-1 sm:py-2 shadow-md w-full fixed top-0 z-50">
            <div className="flex items-center space-x-4">
                <Link href={userRole ? `/${userRole}` : '/'}>
                    <span className="text-blue-500 text-2xl font-bold">S</span>
                </Link>

                <div className="hidden md:flex items-center bg-gray-100 px-4 py-1 rounded-full w-[150px] lg:w-[300px]">
                    <input
                        type="text"
                        placeholder="Search Courses"
                        className="bg-transparent w-full text-gray-700 focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch}>
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.15-5.15a7 7 0 1 0-14 0 7 7 0 0 0 14 0z"></path>
                        </svg>
                    </button>
                </div>

                {isAuthenticated && (
                    <button
                        className="md:hidden text-gray-700 focus:outline-none"
                        onClick={handleMobileMenuClick}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                )}
            </div>

            <div className={`flex items-center ${isAuthenticated ? 'space-x-4' : 'space-x-8'} md:space-x-8 lg:space-x-20`}>
                <Link href={isAuthenticated ? `/${userRole}` : '/user'}>
                    <Image src="/home.png" alt="Home Icon" width={20} height={20} className="w-5 h-5 md:w-7 md:h-7"/>
                </Link>
                <Link href={isAuthenticated ? `/${userRole}/student_posts` : '/user/student_posts'}>
                    <Image src="/studentposts.png" alt="Student Posts Icon" width={30} height={20} className="w-5 h-5 md:w-7 md:h-7"/>
                </Link>
                <Link href={isAuthenticated ? `/${userRole}/courses` : '/user/courses'}>
                    <Image src="/courses.png" alt="Courses Icon" width={20} height={20} className="w-5 h-5 md:w-7 md:h-7"/>
                </Link>
                <Link href={isAuthenticated ? `/${userRole}/ebooks` : '/user/ebooks'}>
                    <Image src="/digitalproducts.png" alt="Digital Products Icon" width={20} height={20} className="w-5 h-5 md:w-7 md:h-7"/>
                </Link>
                {(userRole === 'teacher' || userRole === 'student') && isAuthenticated && (
                    <Link href={`/${userRole}/chat`}>
                        <Image src="/sms.png" alt="SMS Icon" width={20} height={20} className="w-5 h-5 md:w-7 md:h-7"/>
                    </Link>
                )}
            </div>

            <div className={`flex items-center ${isAuthenticated ? 'space-x-4' : 'space-x-8'} md:space-x-8`}>
                {isAuthenticated ? (
                    <>
                        {(userRole === 'student' || userRole === 'teacher') && (
                            <Link href={`/${userRole}/NotificationsPage`}>
                                <Image src="/notifications.png" alt="Notifications" width={20} height={20} className="w-5 h-5 md:w-7 md:h-7 cursor-pointer"/>
                            </Link>
                        )}
                        <Link href={`/${userRole}/profile`}>
                            <Image src={userImage} alt="User Avatar" width={30} height={30} className="w-8 h-8 md:w-9 md:h-9 rounded-full cursor-pointer"/>
                        </Link>
                    </>
                ) : (
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 w-full md:w-auto">
                        <Link href="/user/pages/login">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm md:text-base w-full sm:w-auto">
                                Log in
                            </button>
                        </Link>
                        <div className="hidden sm:block">
                            <Link href="/user/pages/signup">
                                <button className="border border-blue-600 text-blue-600 px-3 py-1 rounded-md text-sm md:text-base w-full sm:w-auto">
                                    Sign up
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
