import React, { useState } from 'react';
import { FaLanguage, FaChalkboardTeacher, FaMale, FaWallet } from 'react-icons/fa';
import { AiOutlineLike } from 'react-icons/ai';
import { BsFillChatDotsFill, BsThreeDots } from 'react-icons/bs';
import { MdLocationOn } from 'react-icons/md';

export default function TeacherCard({ teacher, baseUrl }) {
  const [likes, setLikes] = useState(teacher.likes || 0);
  const [liked, setLiked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLikeTeacher = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
      setErrorMessage("Please log in to like the teacher.");
      return;
    }

    const postData = {
      username: userData.username,
      post_id: teacher.id,
      post_type: 'teacherpost',
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
      } else {
        setErrorMessage(result.error || "An error occurred while liking.");
      }
    } catch (error) {
      console.error("Error liking teacher:", error);
      setErrorMessage("Error liking teacher.");
    }
  };

  const handleHireTeacher = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id || userData.role !== 'student') {
      setErrorMessage("Only students can hire teachers.");
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
        alert("Hire request sent successfully.");
      } else {
        setErrorMessage(result.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error hiring teacher:", error);
      setErrorMessage("Failed to send hire request.");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white text-black border rounded-lg w-[300px] sm:w-[500px] md:w-[600px] p-4 my-3 relative mx-auto" style={{ boxShadow: '-1px 1px 10px 0px #00000040' }}>
      <div className="flex items-center">
  <img
    src={teacher.image ? `${baseUrl}/uploads/${teacher.image}` : '/default-profile.png'}
    alt="Profile Picture"
    className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
  />
  <div className="ml-1">
  <h2 className="text-lg sm:text-lg font-bold">
    {teacher.designation ? `${teacher.designation} ` : ''}
    {teacher.fullname || 'Teacher'}
  </h2>
  <p className="text-gray-500 text-xs sm:text-sm flex items-center">
    <MdLocationOn className="mr-1" />
    {teacher.city}, {teacher.country}
  </p>
</div>

</div>



        <h3 className="mt-4 text-xs sm:text-sm">{teacher.description || 'Teacher description not available'}</h3>
         <hr></hr>
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <FaLanguage className="text-gray-700 text-xs sm:text-sm" />
            <p className="font-bold text-xs sm:text-sm">Languages:</p>
            <p className="text-xs sm:text-sm">
              {Array.isArray(teacher.languages) ? teacher.languages.join(', ') : 'Not specified'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <FaChalkboardTeacher className="text-gray-700 text-xs sm:text-sm" />
            <p className="font-bold text-xs sm:text-sm">Subjects:</p>
            <p className="text-xs sm:text-sm">
              {Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : 'Not specified'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <FaMale className="text-gray-700 text-xs sm:text-sm" />
            <p className="font-bold text-xs sm:text-sm">Gender:</p>
            <p className="text-xs sm:text-sm">{teacher.gender || 'Not specified'}</p>
          </div>

          <div className="flex items-center space-x-2">
            <FaWallet className="text-gray-700 text-xs sm:text-sm" />
            <p className="font-bold text-xs sm:text-sm">Fee:</p>
            <p className="text-xs sm:text-sm">{teacher.fee || 'Not specified'}</p>
          </div>
        </div>

        <hr className="mt-4" />
        <div className="mt-4 flex justify-between text-gray-600 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLikeTeacher}>
            <AiOutlineLike className={`text-sm sm:text-lg ${liked ? 'text-blue-500' : ''}`} />
            <span>{likes} Like{likes === 1 ? '' : 's'}</span>
          </div>

          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleHireTeacher}>
            <BsFillChatDotsFill className="text-sm sm:text-lg" />
            <span>Hire Teacher</span>
          </div>
        </div>

        {errorMessage && <div className="text-red-500 mt-2 text-xs sm:text-sm">{errorMessage}</div>}
      </div>
    </div>
  );
}
