'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BuyCoinsModal from '@/app/components/BuyCoinsModal';

const TeacherSideBar = () => {
    const router = useRouter();
    const [isBuyCoinsOpen, setIsBuyCoinsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState('/default-profile.png');
    const [referralLink, setReferralLink] = useState('');
    const [showReferralPopup, setShowReferralPopup] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setUser(userData);
            if (userData?.image) {
                setUserImage(`${baseUrl}/uploads/${userData.image}`);
            }
        }
    }, [baseUrl]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/');
    };

    const openBuyCoinsModal = () => setIsBuyCoinsOpen(true);
    const closeBuyCoinsModal = () => setIsBuyCoinsOpen(false);

    const goToPage = (path) => {
        if (user?.id) {
            router.push(`/teacher/${path}`);
        }
    };

    const goToSavedPosts = () => {
        if (user && user.id) {
            router.push(`/teacher/saved_posts`); // Navigate to saved posts page
        } else {
            console.error('User data not found.');
        }
    };

    const goToBuyCoin = () => {
        if (user && user.id) {
            router.push(`/teacher/buy_coin`); // Navigate to saved posts page
        } else {
            console.error('User data not found.');
        }
    };


    const handleAffiliateProgram = () => {
        if (user?.id) {
            setReferralLink(`http://localhost:3000/user/pages/signup?ref=${user.id}`);
            setShowReferralPopup(true);
        }
    };

    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(referralLink).then(() => alert('Referral link copied!'));
    };

    const sidebarItems = [
        { icon: '/course.png', label: 'Courses', path: 'courses' },
        { icon: '/digital.png', label: 'Digital Store', path: 'ebooks' },
        { icon: '/managecalander.png', label: 'Money History', path: 'calendar' },
        { icon: '/coins.png', label: 'Buy Coins', action: goToBuyCoin },
        { icon: '/coinhistory.png', label: 'Coins History', path: 'coin_history' },
        { icon: '/savedposts.png', label: 'Saved Posts', action: goToSavedPosts },
        { icon: '/programs.png', label: 'Affiliate Program', action: handleAffiliateProgram },
        { icon: '/logout.png', label: 'Log Out', action: handleLogout },
    ];

    return user ? (
        <div className="fixed inset-0 text-black bg-white shadow-lg overflow-y-auto h-full w-full px-4">
            <div className="p-4 bg-white rounded-lg shadow-lg overflow-y-auto h-full flex flex-col items-center">
                {/* User Profile Section */}
                <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow mb-6 w-full">
                    <Image
                        src={userImage}
                        alt={user?.fullname || 'User Image'}
                        width={50}
                        height={50}
                        className="rounded-full object-cover mb-2"
                    />
                    <span className="font-bold text-lg">{user?.fullname || 'User'}</span>
                    <span className="text-sm text-gray-600">{user?.role || 'Role'}</span>
                </div>

                <ul className="space-y-0 w-full">
                    {sidebarItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            onClick={() => (item.action ? item.action() : goToPage(item.path))}
                        />
                    ))}
                </ul>

                {isBuyCoinsOpen && <BuyCoinsModal onClose={closeBuyCoinsModal} />}

                {showReferralPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                            <h2 className="text-lg font-bold mb-4">Your Referral Link</h2>
                            <p className="text-gray-700 break-all">{referralLink}</p>
                            <div className="flex justify-between mt-4">
                                <button onClick={handleCopyReferralLink} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                                    Copy Link
                                </button>
                                <button onClick={() => setShowReferralPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : null;
};

const SidebarItem = ({ icon, label, onClick }) => (
    <div
        className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-blue-50"
        style={{
            width: '100%',  // Set to 100% to respect parent padding
            height: '50px',
            borderRadius: '8px 0px 0px 0px',
            opacity: 1,
            marginTop: '15px',
        }}
        onClick={onClick}
    >
        <Image src={icon} alt={label} width={24} height={24} />
        <span className="text-gray-800 font-medium">{label}</span>
    </div>
);

export default TeacherSideBar;
