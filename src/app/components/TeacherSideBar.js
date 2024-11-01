'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BuyCoinsModal from './BuyCoinsModal'; // Import the new component for sending request
import { FaBars, FaTimes } from 'react-icons/fa'; // Icons for opening/closing sidebar on mobile

const TeacherSideBar = () => {
    const router = useRouter();
    const [isBuyCoinsOpen, setIsBuyCoinsOpen] = useState(false); // State to track the modal visibility
    const [user, setUser] = useState(null); // State to store user information
    const [userImage, setUserImage] = useState('/default-profile.png'); // Default profile image
    const [referralLink, setReferralLink] = useState(''); // State to store the referral link
    const [showReferralPopup, setShowReferralPopup] = useState(false); // State to show/hide referral popup
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle the sidebar for mobile view

    // Use environment variable for the base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        console.log('Raw user data from localStorage:', userDataString); // Log raw user data from localStorage

        if (userDataString) {
            const userData = JSON.parse(userDataString);
            console.log('Parsed user data:', userData); // Log parsed user data

            setUser(userData); // Set user data if available

            // Check if the user has a profile image and set it
            if (userData?.image) {
                const imageUrl = `${baseUrl}/uploads/${userData.image}`;
                setUserImage(imageUrl);
                console.log('User profile image URL:', imageUrl); // Log the image URL
            }
        } else {
            console.error('User data not found in localStorage.');
        }
    }, [baseUrl]);

    const handleLogout = () => {
        // Clear the user data from localStorage
        localStorage.removeItem('user');
        router.push('/');
    };

    const openBuyCoinsModal = () => {
        setIsBuyCoinsOpen(true); // Open the modal
    };

    const closeBuyCoinsModal = () => {
        setIsBuyCoinsOpen(false); // Close the modal
    };

    const goToCoursesPage = () => {
        if (user && user.id) {
            router.push(`/teacher/courses`); // Navigate to courses page with teacher_id
        } else {
            console.error('User data not found.');
        }
    };

    const goToEbookPage = () => {
        if (user && user.id) {
            router.push(`/teacher/ebooks`); // Navigate to ebook page with teacher_id
        } else {
            console.error('User data not found.');
        }
    };

    const goToCoinHistory = () => {
        if (user && user.id) {
            router.push(`/teacher/coin_history`); // Navigate to coin history page
        } else {
            console.error('User not found');
        }
    };

    const goToBuyCoin = () => {
        if (user && user.id) {
            router.push(`/teacher/buy_coin`); // Navigate to buy coin page
        } else {
            console.error('User not found');
        }
    };

    const goToSavedPosts = () => {
        if (user && user.id) {
            router.push(`/teacher/saved_posts`); // Navigate to saved posts page with teacher_id
        } else {
            console.error('User data not found.');
        }
    };

     // Function to navigate to Withdraw Money
     const gotoWithdrawRequest = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            router.push(`/teacher/withdraw_request`); // Navigate to withdraw request page
        } else {
            console.error('User not found');
        }
    };

    // Affiliate Program: Generate and display referral link
    const handleAffiliateProgram = () => {
        if (user && user.id) {
            const generatedReferralLink = `http://localhost:3000/user/pages/signup?ref=${user.id}`;
            setReferralLink(generatedReferralLink); // Set the referral link
            setShowReferralPopup(true); // Show the popup with the referral link
        } else {
            console.error('User data not found.');
        }
    };

    const gotoMoneyHistory = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            router.push(`/teacher/money_history`); // Navigate to ebooks
        } else {
            console.error('User not found');
        }
    };

    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(referralLink)
            .then(() => {
                alert('Referral link copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy the referral link', err);
            });
    };

    return (
        <div>
            {/* Mobile Hamburger Menu */}
            <div className="md:hidden p-4">
                <FaBars className="text-2xl cursor-pointer" onClick={() => setIsSidebarOpen(true)} />
            </div>

            {/* Sidebar for Desktop and Mobile */}
            <div className={`fixed text-black inset-y-0 left-0 bg-gray-100 w-64 p-5 transition-transform transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:block h-screen`}>
                {/* Close button for mobile */}
                <div className="md:hidden flex justify-end mb-4">
                    <FaTimes className="text-2xl cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
                </div>
                
                <ul className="space-y-6">
                    {/* User Profile */}
                    <li className="flex items-center space-x-3">
                        <img
                            src={userImage} // Use the image from localStorage or default profile image
                            alt={user?.fullname || 'User Image'}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                            onLoad={() => console.log(`Image loaded: ${userImage}`)} // Console log the image URL when loaded
                        />
                        <span className="font-bold">{user?.fullname || 'User'}</span>
                    </li>

                    {/* Menu Items */}
                    <li className="flex items-center space-x-3 cursor-pointer" onClick={goToCoursesPage}>
                        <Image src="/course.png" alt="Courses" width={24} height={24} />
                        <span className="font-semibold">Courses</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer" onClick={goToEbookPage}>
                        <Image src="/digital.png" alt="Digital Products" width={24} height={24} />
                        <span className="font-semibold">Digital Products</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer" onClick={goToBuyCoin}>
                        <Image src="/coins.png" alt="Buy Coins" width={24} height={24} />
                        <span className="font-semibold">Buy Coins</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer" onClick={gotoMoneyHistory}>
                        <Image src="/managecalander.png" alt="Money Wallet" width={24} height={24} />
                        <span className="font-semibold">Money History</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer" onClick={gotoWithdrawRequest}>
                        <Image src="/withdraw.png" alt="Withdraw Money" width={24} height={24} />
                        <span className="font-semibold">Withdraw Money</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer" onClick={goToCoinHistory}>
                        <Image src="/coinhistory.png" alt="Coin History" width={24} height={24} />
                        <span className="font-semibold">Coins History</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer" onClick={goToSavedPosts}>
                        <Image src="/savedposts.png" alt="Saved Posts" width={24} height={24} />
                        <span className="font-semibold">Saved Posts</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer" onClick={handleAffiliateProgram}>
                        <Image src="/programs.png" alt="Affiliate Program" width={24} height={24} />
                        <span className="font-semibold">Affiliate Program</span>
                    </li>
                    
                    <li className="flex items-center space-x-3 cursor-pointer" onClick={handleLogout}>
                        <Image src="/logout.png" alt="Logout" width={24} height={24} />
                        <span className="font-semibold">Logout</span>
                    </li>
                </ul>

                {/* Conditionally render the Buy Coins Modal */}
                {isBuyCoinsOpen && <BuyCoinsModal onClose={closeBuyCoinsModal} />}

                {showReferralPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                            <h2 className="text-lg font-bold mb-4">Your Referral Link</h2>
                            <p className="text-gray-700 break-all">{referralLink}</p>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={handleCopyReferralLink}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Copy Link
                                </button>
                                <button
                                    onClick={() => setShowReferralPopup(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherSideBar;
