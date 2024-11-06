'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userImage, setUserImage] = useState('/default-profile.png');
    const [searchQuery, setSearchQuery] = useState('');
    const [userRole, setUserRole] = useState('');
    const [activePage, setActivePage] = useState('home');
    const router = useRouter();
    const pathname = usePathname();

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

    useEffect(() => {
        const path = pathname.split('/')[2] || 'home';
        setActivePage(path);
    }, [pathname]);

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

    const handleClick = (page) => {
        setActivePage(page);
    };

    const getIconSrc = (page, defaultIcon, activeIcon) => (
        activePage === page ? activeIcon : defaultIcon
    );

    return (
        <header className="bg-white text-black flex items-center justify-between px-4 py-1 sm:py-2 shadow-md w-full fixed top-0 z-50">
            <div className="flex items-center space-x-4">
                <Link href={userRole ? `/${userRole}` : '/'}>
                    <svg width="30" height="35" viewBox="0 0 30 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.929688 8.68164C0.929688 7.13542 1.31217 5.72754 2.07715 4.45801C2.8584 3.18848 3.90007 2.17936 5.20215 1.43066C6.52051 0.66569 7.96908 0.283203 9.54785 0.283203H27.5166V5.41016H9.54785C8.60384 5.41016 7.79004 5.74382 7.10645 6.41113C6.42285 7.07845 6.08105 7.88411 6.08105 8.82812V11.2207C6.08105 12.0833 6.42285 12.8239 7.10645 13.4424C7.79004 14.0609 8.60384 14.3701 9.54785 14.3701H20.6074C22.2025 14.3701 23.651 14.7526 24.9531 15.5176C26.2552 16.2663 27.2887 17.2835 28.0537 18.5693C28.835 19.8389 29.2256 21.2467 29.2256 22.793V26.5771C29.2256 28.1234 28.835 29.5394 28.0537 30.8252C27.2887 32.0947 26.2552 33.112 24.9531 33.877C23.651 34.6257 22.2025 35 20.6074 35H0.954102V29.8486H20.6074C21.5677 29.8486 22.3815 29.5312 23.0488 28.8965C23.7324 28.2454 24.0742 27.4642 24.0742 26.5527V22.8174C24.0742 21.9059 23.7324 21.1247 23.0488 20.4736C22.3815 19.8226 21.5677 19.4971 20.6074 19.4971H9.54785C7.96908 19.4971 6.52051 19.1309 5.20215 18.3984C3.90007 17.6497 2.8584 16.6488 2.07715 15.3955C1.31217 14.1423 0.929688 12.7588 0.929688 11.2451V8.68164Z" fill="#0866FF"/>
                    </svg>
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
                <Link href={isAuthenticated ? `/${userRole}` : '/'}>
                    <Image
                        src={getIconSrc('home', '/home1.png', '/home.png')}
                        alt="Home Icon"
                        width={20}
                        height={20}
                        className="w-5 h-5 md:w-7 md:h-7"
                        onClick={() => handleClick('home')}
                    />
                </Link>
                <Link href={isAuthenticated ? `/${userRole}/student_posts` : '/user/student_posts'}>
                    <Image
                        src={getIconSrc('student_posts', '/studentposts.png', '/studentposts1.png')}
                        alt="Student Posts Icon"
                        width={30}
                        height={20}
                        className="w-5 h-5 md:w-7 md:h-7"
                        onClick={() => handleClick('student_posts')}
                    />
                </Link>

                <Link href={isAuthenticated ? `/${userRole}/courses` : '/user/courses'}>
                    <Image
                        src={getIconSrc('courses', '/courses.png', '/courses1.png')}
                        alt="Courses Icon"
                        width={20}
                        height={20}
                        className="w-5 h-5 md:w-7 md:h-7"
                        onClick={() => handleClick('courses')}
                    />
                </Link>
                <Link href={isAuthenticated ? `/${userRole}/ebooks` : '/user/ebooks'}>
                    <Image
                        src={getIconSrc('ebooks', '/digitalproducts.png', '/digitalproducts1.png')}
                        alt="Digital Products Icon"
                        width={20}
                        height={20}
                        className="w-5 h-5 md:w-7 md:h-7"
                        onClick={() => handleClick('ebooks')}
                    />
                </Link>

                {/* Conditionally render the Chat icon only if the user is authenticated */}
                {isAuthenticated && (
                    <Link href={`/${userRole}/chat`}>
                        <Image
                            src={getIconSrc('chat', '/sms.png', '/sms1.png')}
                            alt="Chat Icon"
                            width={20}
                            height={20}
                            className="w-5 h-5 md:w-7 md:h-7"
                            onClick={() => handleClick('chat')}
                        />
                    </Link>
                )}
            </div>

            <div className={`flex items-center ${isAuthenticated ? 'space-x-4' : 'space-x-8'} md:space-x-8`}>
                {isAuthenticated ? (
                    <>
                        {(userRole === 'student' || userRole === 'teacher') && (
                            <Link href={`/${userRole}/NotificationsPage`}>
                                <Image
                                    src={getIconSrc('notifications', '/notifications.png', '/notifications.png')}
                                    alt="Notifications"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 md:w-7 md:h-7 cursor-pointer"
                                    onClick={() => handleClick('notifications')}
                                />
                            </Link>
                        )}
                        <Link href={`/${userRole}/profile`}>
                            <Image src={userImage} alt="User Avatar" width={30} height={30} className="w-8 h-8 md:w-9 md:h-9 rounded-full cursor-pointer" />
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
