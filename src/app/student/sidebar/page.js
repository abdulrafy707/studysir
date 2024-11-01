'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RequestMoneyModal from '@/app/components/Buymoney';

const Sidebar = () => {
    const [userRole, setUserRole] = useState(null);
    const [userImage, setUserImage] = useState('/default-profile.png');
    const [userName, setUserName] = useState('User Name');
    const [showRequestMoneyModal, setShowRequestMoneyModal] = useState(false);
    const [referralLink, setReferralLink] = useState('');
    const [showReferralPopup, setShowReferralPopup] = useState(false);
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.role === 'student') {
            setUserRole('student');
            setUserImage(userData.image ? `${baseUrl}/uploads/${userData.image}` : '/default-profile.png');
            setUserName(userData.fullname || 'User Name');
        }
    }, [baseUrl]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/');
    };

    const goToPage = (path) => router.push(`/student/${path}`);

    const handleAffiliateProgram = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
            setReferralLink(`http://localhost:3000/user/pages/signup?ref=${userData.id}`);
            setShowReferralPopup(true);
        }
    };

    const handleCopyReferralLink = () => {
        navigator.clipboard.writeText(referralLink).then(() => alert('Referral link copied!'));
    };

    const sidebarItems = [
        { icon: '/course.png', label: 'Courses', path: 'courses' },
        { icon: '/digital.png', label: 'Digital Store', path: 'ebooks' },
        { icon: '/money_wallet.png', label: 'Buy Money', path: 'buy_money' },
        { icon: '/managecalander.png', label: 'Money History', path: 'money_history' },
        { icon: '/savedposts.png', label: 'Saved Posts', path: 'saved_posts' },
        { icon: '/programs.png', label: 'Affiliate Program', action: handleAffiliateProgram },
        { icon: '/logout.png', label: 'Log Out', action: handleLogout },
    ];

    return userRole === 'student' ? (
        <div className="fixed inset-0 text-black bg-white shadow-lg overflow-y-auto h-full w-full px-4">
            <div className="p-4 bg-white rounded-lg shadow-lg overflow-y-auto h-full flex flex-col items-center">
                {/* User Profile Section */}
                <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow mb-6 w-full">
                    <Image
                        src={userImage}
                        alt={userName}
                        width={50}
                        height={50}
                        className="rounded-full object-cover mb-2"
                    />
                    <span className="font-bold text-lg">{userName}</span>
                    <span className="text-sm text-gray-600">Student</span>
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

                {/* Show RequestMoneyModal when triggered */}
                {showRequestMoneyModal && <RequestMoneyModal onClose={() => setShowRequestMoneyModal(false)} />}

                {/* Referral Link Popup */}
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
            width: '100%', 
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

export default Sidebar;
