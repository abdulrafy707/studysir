'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { FaTimes } from 'react-icons/fa'; // Icon for closing the popup
import BuyCoinsModal from './BuyCoinsModal'; // Component for buying coins modal
import { toast } from 'react-toastify'; // For notifications

const TeacherSidebar = () => {
    const [userRole, setUserRole] = useState(null); // To track user role
    const [userImage, setUserImage] = useState('/default-profile.png'); // Default profile image
    const [userName, setUserName] = useState('User Name'); // Default user name
    const [showBuyCoinsModal, setShowBuyCoinsModal] = useState(false); // To control buy coins modal visibility
    const [referralLink, setReferralLink] = useState(''); // Referral link state
    const [showReferralPopup, setShowReferralPopup] = useState(false); // To show/hide referral popup
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Base API URL for images

    // Function to log the user out
    const handleLogout = () => {
        localStorage.removeItem('user'); // Remove user from localStorage
        router.push('/'); // Redirect to home/login
        toast.info('Logged out successfully.');
    };

    // Function to navigate to different sections
    const navigateToPage = (path) => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            router.push(`/teacher/${path}`); // Navigate to specified path
        } else {
            console.error('User data not found');
            toast.error('User data not found.');
        }
    };

    // Function to generate and display referral link
    const handleAffiliateProgram = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            const referral = `https://studysir.com/user/pages/signup?ref=${userData.id}`;
            setReferralLink(referral); // Set the referral link
            setShowReferralPopup(true); // Show the popup with the referral link
        } else {
            console.error('User data not found');
            toast.error('User data not found.');
        }
    };

    // Function to copy the referral link to the clipboard
    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(referralLink)
            .then(() => {
                toast.success('Referral link copied to clipboard!');
                setShowReferralPopup(false); // Close popup
            })
            .catch((err) => {
                console.error('Failed to copy the referral link', err);
                toast.error('Failed to copy the referral link.');
            });
    };

    // Fetch user data from localStorage and set user-related states
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.role === 'teacher') {
            setUserRole('teacher'); // Set role
            if (userData.image) {
                setUserImage(`${baseUrl}/uploads/${userData.image}`); // Set image from user data
            }
            if (userData.fullname) {
                setUserName(userData.fullname); // Set user name
            }
        }
    }, []); // Run once on mount

    // Render nothing if user is not a teacher
    if (userRole !== 'teacher') {
        return null;
    }

    return (
        <div>
            {/* Sidebar for Desktop */}
            <div className={`hidden md:block pt-20 text-black fixed inset-y-0 left-0 bg-gray-100 w-64 p-5 pt-6 h-screen overflow-y-auto`}>
                <ul className="space-y-3">
                    {/* User Profile */}
                    <li className="flex items-center space-x-3">
                        <Image
                            src={userImage}
                            alt={userName}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span className="font-bold">{userName}</span>
                    </li>

                    {/* Menu Items */}
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={() => navigateToPage('my-courses')}>
                        <Image src="/course.png" alt="Courses" width={24} height={24} />
                        <span className="font-semibold">Courses</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={() => navigateToPage('my-ebooks')}>
                        <Image src="/digital.png" alt="Digital Products" width={24} height={24} />
                        <span className="font-semibold">Digital Products</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={() => setShowBuyCoinsModal(true)}>
                        <Image src="/coins.png" alt="Buy Coins" width={24} height={24} />
                        <span className="font-semibold">Buy Coins</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={() => navigateToPage('money_history')}>
                        <Image src="/managecalander.png" alt="Money Wallet" width={24} height={24} />
                        <span className="font-semibold">Money History</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={() => navigateToPage('withdraw_request')}>
                        <Image src="/withdraw.png" alt="Withdraw Money" width={24} height={24} />
                        <span className="font-semibold">Withdraw Money</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={() => navigateToPage('coin_history')}>
                        <Image src="/coinhistory.png" alt="Coin History" width={24} height={24} />
                        <span className="font-semibold">Coins History</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={() => navigateToPage('saved_posts')}>
                        <Image src="/savedposts.png" alt="Saved Posts" width={24} height={24} />
                        <span className="font-semibold">Saved Posts</span>
                    </li>
                    <li className="flex items-center space-x-3 relative cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={handleAffiliateProgram}>
                        <Image src="/programs.png" alt="Affiliate Program" width={24} height={24} />
                        <span className="font-semibold">Affiliate Program</span>
                    </li>
                    
                    {/* Logout */}
                    <li className="flex items-center space-x-3 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-colors" onClick={handleLogout}>
                        <Image src="/logout.png" alt="Logout" width={24} height={24} />
                        <span className="font-semibold">Logout</span>
                    </li>
                </ul>

                {/* Show BuyCoinsModal when triggered */}
                {showBuyCoinsModal && <BuyCoinsModal onClose={() => setShowBuyCoinsModal(false)} />}

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

export default TeacherSidebar;
