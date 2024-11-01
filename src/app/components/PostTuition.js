'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const PostTuitionBox = () => {
  const [role, setRole] = useState(null);
  const [profileImage, setProfileImage] = useState('/default-profile.png');
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.role === 'student') {
      setRole(user.role);
      setProfileImage(user.image ? `https://studysir.m3xtrader.com/api/uploads/${user.image}` : '/default-profile.png');
    }
  }, []);

  const handleOpenPostPage = () => {
    // Redirect to the new page for posting
    router.push('/student/add-tuition');
  };

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      <div className="flex items-center shadow-lg justify-between w-full p-4 border-2 hover:border-blue-200 rounded-lg">
        {/* Profile Image fetched from localStorage */}
        <div className="flex-shrink-0">
          <Image
            src={profileImage}
            alt="User Profile"
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
        </div>

        {/* Message Box */}
        <div className="flex-grow ml-4">
          <div
            className="bg-gray-100 px-4 py-2 rounded-full cursor-pointer text-gray-700"
            onClick={handleOpenPostPage}
          >
            Hi! Post your tuition here
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostTuitionBox;
