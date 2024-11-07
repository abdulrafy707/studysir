'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { FaTimes } from 'react-icons/fa'; // Import FaTimes for close (cross) icon
import RequestMoneyModal from './Buymoney'; // Import the RequestMoneyModal component
import { toast } from 'react-toastify'; // Import toast from react-toastify

const Sidebar = () => {
    const [userRole, setUserRole] = useState(null); // State to track the user's role
    const [userImage, setUserImage] = useState('/default-profile.png'); // Default image
    const [userName, setUserName] = useState('User Name'); // Default name
    const [showRequestMoneyModal, setShowRequestMoneyModal] = useState(false); // State to control modal visibility
    const [referralLink, setReferralLink] = useState(''); // State to store the referral link
    const [showReferralPopup, setShowReferralPopup] = useState(false); // State to show/hide referral popup
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Base URL for API
    const affiliateRef = useRef(null); // Reference to Affiliate Program button for positioning

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear user data
        router.push('/'); // Redirect to the homepage or login
        toast.info('Logged out successfully.');
    };

    // Function to navigate to courses
    const gotoCourse = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            router.push(`/student/courses`); // Navigate to courses
        } else {
            console.error('User not found');
            toast.error('User not found.');
        }
    };

    // Function to navigate to ebooks
    const gotoEbook = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            router.push(`/student/ebooks`); // Navigate to ebooks
        } else {
            console.error('User not found');
            toast.error('User not found.');
        }
    };

    const gotoMoneyHistory = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            router.push(`/student/money_history`); // Navigate to money history
        } else {
            console.error('User not found');
            toast.error('User not found.');
        }
    };

    const goToSavedPosts = () => {
        const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage
        if (user && user.id) {
            router.push(`/student/saved_posts`); // Navigate to saved posts page
        } else {
            console.error('User data not found.');
            toast.error('User data not found.');
        }
    };

    const goToBuyMoney = () => {
        const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage
        if (user && user.id) {
            router.push(`/student/buy_money`); // Navigate to buy money page
        } else {
            console.error('User data not found.');
            toast.error('User data not found.');
        }
    };

    // Function to navigate to Withdraw Money
    const gotoWithdrawRequest = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            router.push(`/student/withdraw_request`); // Navigate to withdraw request page
        } else {
            console.error('User not found');
            toast.error('User not found.');
        }
    };

    // Function to generate and store the referral link
    const handleAffiliateProgram = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            const referralLink = `https://studysir.com/user/pages/signup?ref=${userData.id}`;
            setReferralLink(referralLink); // Set the referral link
            setShowReferralPopup(true); // Show the popup
        } else {
            console.error('User ID not found.');
            toast.error('User ID not found.');
        }
    };

    // Function to copy referral link
    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(referralLink)
            .then(() => {
                toast.success('Referral link copied to clipboard!');
                setShowReferralPopup(false); // Close the popup
            })
            .catch((err) => {
                console.error('Failed to copy the referral link', err);
                toast.error('Failed to copy the referral link.');
            });
    };

    // Effect to check the user's role and image from localStorage
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.role === 'student') {
            setUserRole('student'); // Set the user role if it's 'student'
            if (userData.image) {
                setUserImage(userData.image); // Set the user's image from localStorage
            }
            if (userData.fullname) {
                setUserName(userData.fullname); // Set the user's full name from localStorage
            }
        }
    }, []); // Runs only once when the component mounts

    // Don't render the sidebar if the user is not a student
    if (userRole !== 'student') {
        return null;
    }

    return (
        <div>
            {/* Sidebar for Desktop only */}
            <div className={`hidden md:block text-black fixed inset-y-0 left-0 bg-gray-100 w-64 p-5 pt-6 h-screen overflow-y-auto sticky top-0`}>
                <ul className="space-y-3">
                    {/* User Profile */}
                    <li className="flex items-center space-x-3">
                        <Image
                            src={userImage ? `${baseUrl}/uploads/${userImage}` : '/default-profile.png'}
                            alt={userName}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span className="font-bold">{userName}</span>
                    </li>

                    {/* Menu Items */}
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={gotoCourse}>
                        <Image src="/course.png" alt="Courses" width={24} height={24} />
                        <span className="font-semibold">Courses</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={gotoEbook}>
                        <Image src="/digital.png" alt="Digital Store" width={24} height={24} />
                        <span className="font-semibold">Digital Store</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={goToBuyMoney}>
                        <Image src="/money_wallet.png" alt="Money Wallet" width={24} height={24} />
                        <span className="font-semibold">Buy Money</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={gotoMoneyHistory}>
                        <Image src="/managecalander.png" alt="Money History" width={24} height={24} />
                        <span className="font-semibold">Money History</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={gotoWithdrawRequest}>
                        <Image src="/withdraw.png" alt="Withdraw Money" width={24} height={24} />
                        <span className="font-semibold">Withdraw Money</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={goToSavedPosts}>
                        <Image src="/savedposts.png" alt="Saved Posts" width={24} height={24} />
                        <span className="font-semibold">Saved Posts</span>
                    </li>

                    {/* Affiliate Program with Popup */}
                    <li className="flex items-center space-x-3 relative cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={handleAffiliateProgram} ref={affiliateRef}>
                        <Image src="/programs.png" alt="Affiliate Program" width={24} height={24} />
                        <span className="font-semibold">Affiliate Program</span>

                        {/* Affiliate Program Popup */}
                        {/* {showReferralPopup && (
                            <div className="absolute right-0 mt-2 w-80 bg-white  rounded-lg shadow-lg z-50">
                                <h2 className="text-lg font-bold mb-4">Your Referral Link</h2>
                                <div className="flex items-center bg-gray-100 p-2 rounded-md">
                                    <p className="text-gray-700 break-all flex-grow">{referralLink}</p>
                                    <button
                                        onClick={handleCopyReferralLink}
                                        className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowReferralPopup(false)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        )} */}
                    </li>

                    
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={handleLogout}>
                        <Image src="/logout.png" alt="Logout" width={24} height={24} />
                        <span className="font-semibold">Logout</span>
                    </li>
                </ul>

                {/* Show RequestMoneyModal when triggered */}
                {showRequestMoneyModal && (
                    <RequestMoneyModal onClose={() => setShowRequestMoneyModal(false)} />
                )}
                   {/* Referral Link Popup */}
                   {showReferralPopup && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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

export default Sidebar;
