'use client';
import React, { useState, useEffect } from 'react';
import { FaLanguage, FaChalkboardTeacher, FaMale, FaWallet } from 'react-icons/fa';
import { AiOutlineLike } from 'react-icons/ai';
import { BsFillChatDotsFill, BsThreeDots } from 'react-icons/bs';
import { MdLocationOn } from 'react-icons/md';

// Helper function to shuffle and get random teachers
const getRandomTeachers = (teachers, count) => {
  const shuffled = [...teachers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function TeacherList({ maxTeachers = 3 }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Ensure this is in your .env file

  useEffect(() => {
    fetch(`${baseUrl}/teacher_api.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data && !data.error) {
          const randomTeachers = getRandomTeachers(data, maxTeachers); // Select random teachers
          setTeachers(randomTeachers);
        } else {
          setError(data.error || 'Failed to fetch teachers');
        }
      })
      .catch((err) => setError('Error fetching teachers.'))
      .finally(() => setLoading(false));
  }, [baseUrl, maxTeachers]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="space-y-4">
      {teachers.map((teacher) => (
        <TeacherCard key={teacher.id} teacher={teacher} baseUrl={baseUrl} />
      ))}
    </div>
  );
}

function TeacherCard({ teacher, baseUrl }) {
  const [likes, setLikes] = useState(teacher.likes || 0);
  const [liked, setLiked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle like functionality
  const handleLikeTeacher = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
      console.error('User not logged in');
      return;
    }

    const postData = {
      username: userData.username,
      post_id: teacher.id, // Assuming teacher's id is the post_id for 'teacherpost'
      post_type: 'teacherpost', // 'teacherpost' for teacher posts
    };

    try {
      const response = await fetch(`${baseUrl}/like_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      if (result.liked) {
        setLikes(result.total_likes);
        setLiked(true);
      } else if (result.message) {
        alert(result.message);
      } else {
        console.error(`Error liking teacher post: ${result.error}`);
      }
    } catch (error) {
      console.error('Error liking teacher post:', error);
    }
  };

  // Function to handle hiring the teacher
  const handleHireTeacher = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id || !userData.fullname) {
      console.error('User not logged in');
      setErrorMessage('Please log in to hire a teacher.');
      return;
    }

    if (userData.role !== 'student') {
      setErrorMessage('Only students can hire teachers.');
      return;
    }

    const postData = {
      student_id: userData.id,
      student_fullname: userData.fullname,
      teacher_id: teacher.id,
    };

    try {
      const response = await fetch(`${baseUrl}/hire_teacher_notification_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      if (result.success) {
        alert('Your request to hire the teacher has been sent successfully!');
        // Optionally, update the UI or disable the hire button
      } else {
        setErrorMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error notifying teacher:', error);
      setErrorMessage('Failed to send hire request.');
    }
  };

  return (
    <div className="bg-white text-black border rounded-lg shadow p-4 w-[300px] sm:w-[300px] md:w-[600px] relative z-10 mx-auto">
      {/* Header with teacher profile, name, and location */}
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <img
            src={teacher.image ? `${baseUrl}/uploads/${teacher.image}` : '/default-profile.png'}
            alt="Profile Picture"
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
          />
          <div className="ml-2 sm:ml-4">
            <h2 className="text-xs sm:text-sm font-bold">{teacher.fullname || 'Teacher'}</h2>
            <p className="text-gray-500 text-xs sm:text-sm flex items-center">
              <MdLocationOn className="mr-1" />
              {teacher.city}, {teacher.country}
            </p>
          </div>
        </div>
        <BsThreeDots className="cursor-pointer text-gray-600 hover:text-gray-800 text-xs sm:text-sm" />
      </div>

      {/* Description */}
      <h3 className="mt-4 text-xs sm:text-sm">
        {teacher.description || 'Teacher description not available'}
      </h3>

      {/* Teacher details with icons */}
      <div className="mt-4 space-y-2">
        {/* Languages */}
        <div className="flex items-center space-x-2">
          <FaLanguage className="text-gray-700 text-xs sm:text-sm" />
          <p className="font-bold text-xs sm:text-sm">Languages Can Speak:</p>
          <p className="text-xs sm:text-sm">
            {Array.isArray(teacher.languages) && teacher.languages.length > 0
              ? teacher.languages.join(', ')
              : 'Not specified'}
          </p>
        </div>

        {/* Subjects */}
        <div className="flex items-center space-x-2">
          <FaChalkboardTeacher className="text-gray-700 text-xs sm:text-sm" />
          <p className="font-bold text-xs sm:text-sm">Subjects Can Teach:</p>
          <p className="text-xs sm:text-sm">
            {Array.isArray(teacher.subjects) && teacher.subjects.length > 0
              ? teacher.subjects.join(', ')
              : 'Not specified'}
          </p>
        </div>

        {/* Gender */}
        <div className="flex items-center space-x-2">
          <FaMale className="text-gray-700 text-xs sm:text-sm" />
          <p className="font-bold text-xs sm:text-sm">Gender:</p>
          <p className="text-xs sm:text-sm">{teacher.gender || 'Not specified'}</p>
        </div>

        {/* Fee */}
        <div className="flex items-center space-x-2">
          <FaWallet className="text-gray-700 text-xs sm:text-sm" />
          <p className="font-bold text-xs sm:text-sm">Fee:</p>
          <p className="text-xs sm:text-sm">{teacher.fee || 'Not specified'}</p>
        </div>
      </div>

      {/* Action Buttons with icons and counters */}
      <hr className="mt-4" />
      <div className="mt-4 flex justify-between text-gray-600 text-xs sm:text-sm">
        {/* Like Button */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleLikeTeacher}
        >
          <AiOutlineLike
            className={`text-sm sm:text-lg ${liked ? 'text-blue-500' : ''}`}
          />
          <span>
            {likes} Like{likes === 1 ? '' : 's'}
          </span>
        </div>

        {/* Hire Teacher Button */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleHireTeacher}
        >
          <BsFillChatDotsFill className="text-sm sm:text-lg" />
          <span>Hire Teacher</span>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-500 mt-2 text-xs sm:text-sm">{errorMessage}</div>
      )}
    </div>
  );
}
