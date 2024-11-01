'use client';

import { useState, useEffect } from 'react';
import {
  FaLanguage,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaDollarSign,
  FaClock,
  FaRegThumbsUp,
  FaEllipsisV,
  FaUserFriends,
} from 'react-icons/fa';
import { AiOutlineFileText } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';

const SearchCourses = ({ query }) => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [likes, setLikes] = useState({});
  const [isJoinRequestOpen, setIsJoinRequestOpen] = useState(false);
  const [joinRequestMessage, setJoinRequestMessage] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!query) return;
      try {
        const response = await fetch(`${baseUrl}/search_courses_api.php?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Error fetching courses');
        const courseData = await response.json();
        setCourses(courseData);

        // Fetch teacher info for each course
        courseData.forEach(course => fetchTeacherInfo(course.teacher_id));
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [query, baseUrl]);

  const fetchTeacherInfo = async (teacherId) => {
    if (!teachers[teacherId]) {
      try {
        const response = await fetch(`${baseUrl}/teacher_name_api.php?id=${teacherId}`);
        if (!response.ok) throw new Error('Error fetching teacher info');
        const teacherData = await response.json();
        setTeachers(prevTeachers => ({ ...prevTeachers, [teacherId]: teacherData }));
      } catch (error) {
        console.error('Error fetching teacher info:', error);
      }
    }
  };

  const handleLikeCourse = async (courseId) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      console.error('User not logged in');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/like_api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userData.username, post_id: courseId, post_type: 'course' }),
      });
      const result = await response.json();
      if (result.liked) {
        setLikes(prevLikes => ({ ...prevLikes, [courseId]: result.total_likes }));
      } else {
        alert(`Error liking course: ${result.error}`);
      }
    } catch (error) {
      console.error('Error liking course:', error);
    }
  };

  const handleJoinRequest = async (course) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      console.error('User not logged in');
      return;
    }

    const postData = {
      student_id: userData.id,
      teacher_id: course.teacher_id,
      amount: 150,
      course_title: course.course_title,
      fullname: userData.fullname,
      role: userData.role,
      message: joinRequestMessage,
    };

    try {
      const response = await fetch(`${baseUrl}/notifications_api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Join request sent to the teacher.');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending join request:', error);
    } finally {
      setIsJoinRequestOpen(false);
      setJoinRequestMessage('');
    }
  };

  const handleSaveCourse = () => {
    alert('Course saved!');
    setDropdownOpen(null);  // Close the dropdown after saving
  };

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {courses.map((course) => (
        <div key={course.course_id} className="bg-white border rounded-lg w-[300px] sm:w-[300px] md:w-[600px] shadow-lg p-4 my-8 relative mx-auto">
          
          {/* Dropdown menu */}
          <div className="absolute top-4 right-4 flex justify-end">
            <FaEllipsisV className="cursor-pointer" onClick={() => setDropdownOpen(dropdownOpen === course.course_id ? null : course.course_id)} />
            {dropdownOpen === course.course_id && (
              <div className="absolute right-0 bg-white shadow-md rounded-lg py-2">
                <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left" onClick={handleSaveCourse}>
                  Save Course
                </button>
              </div>
            )}
          </div>

          {/* Teacher Info */}
          {teachers[course.teacher_id] && (
            <div className="flex items-center mb-4">
              <img
                src={teachers[course.teacher_id].image ? `${baseUrl}/uploads/${teachers[course.teacher_id].image}` : '/default-profile.png'}
                alt={teachers[course.teacher_id].fullname || 'Profile Picture'}
                className="rounded-full object-cover w-12 h-12 sm:w-16 sm:h-16"
              />
              <div className="ml-4">
                <h2 className="text-sm sm:text-lg font-bold">{teachers[course.teacher_id].fullname || 'Teacher Name'}</h2>
                <p className="text-xs sm:text-sm text-gray-500">{teachers[course.teacher_id].city}, {teachers[course.teacher_id].country}</p>
              </div>
            </div>
          )}

          {/* Course Title, Description, and Status */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm sm:text-lg font-bold">{course.course_title}</h2>
            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm ${course.status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
              {course.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-gray-700 text-xs sm:text-sm mt-2">
            {course.description ? course.description.slice(0, 100) : 'Description not available'}
            {course.description?.length > 100 && <span>...</span>}
          </p>

          <img src={`${baseUrl}/uploads/${course.poster_image}`} alt="Course Banner" className="rounded-lg w-full mt-4" />

          {/* Course Details */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2"><FaLanguage size={16} /><p className="font-bold text-xs sm:text-sm">Language:</p><p className="text-xs sm:text-sm">{course.language || 'Not specified'}</p></div>
            <div className="flex items-center space-x-2"><AiOutlineFileText size={16} /><p className="font-bold text-xs sm:text-sm">Subject:</p><p className="text-xs sm:text-sm">{course.subject || 'Not specified'}</p></div>
            <div className="flex items-center space-x-2"><BiUser size={16} /><p className="font-bold text-xs sm:text-sm">Gender:</p><p className="text-xs sm:text-sm">{course.gender || 'Anyone'}</p></div>
            <div className="flex items-center space-x-2"><FaCalendarAlt size={16} /><p className="font-bold text-xs sm:text-sm">Course Duration:</p><p className="text-xs sm:text-sm">{course.course_duration || 'Not specified'}</p></div>
            <div className="flex items-center space-x-2"><FaClock size={16} /><p className="font-bold text-xs sm:text-sm">Class Duration:</p><p className="text-xs sm:text-sm">{course.class_duration || 'Not specified'}</p></div>
            <div className="flex items-center space-x-2"><FaClock size={16} /><p className="font-bold text-xs sm:text-sm">Class Timing:</p><p className="text-xs sm:text-sm">{course.class_timing || 'Not specified'}</p></div>
            <div className="flex items-center space-x-2"><FaChalkboardTeacher size={16} /><p className="font-bold text-xs sm:text-sm">Total Classes:</p><p className="text-xs sm:text-sm">{course.total_classes || 'Not specified'}</p></div>
            <div className="flex items-center space-x-2"><FaChalkboardTeacher size={16} /><p className="font-bold text-xs sm:text-sm">Platform:</p><p className="text-xs sm:text-sm">{course.platform || 'Not specified'}</p></div>
            <div className="flex items-center space-x-2"><FaDollarSign size={16} /><p className="font-bold text-xs sm:text-sm">Fee:</p><p className="text-xs sm:text-sm">{course.fee ? `$${Number(course.fee).toFixed(2)}` : 'Not specified'}</p></div>
            <div className="flex items-center space-x-2"><FaCalendarAlt size={16} /><p className="font-bold text-xs sm:text-sm">Course Start Date:</p><p className="text-xs sm:text-sm">{course.course_start_date || 'Not specified'}</p></div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-around items-center border-t pt-2">
            <div className="flex items-center space-x-2">
              <FaRegThumbsUp size={16} className="text-blue-500" />
              <p className="font-bold text-xs sm:text-sm">{likes[course.course_id] || course.likes || '0'}</p>
              <button className="text-blue-500 text-xs sm:text-sm" onClick={() => handleLikeCourse(course.course_id)}>Like</button>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <FaUserFriends size={14} className="text-blue-500" />
              <button className="font-bold text-xs sm:text-sm text-blue-500" onClick={() => setIsJoinRequestOpen(true)}>Join Request</button>
            </div>
          </div>

          {/* Join Request Popup */}
          {isJoinRequestOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Send Join Request</h2>
                <textarea
                  value={joinRequestMessage}
                  onChange={(e) => setJoinRequestMessage(e.target.value)}
                  placeholder="Write a message to the teacher"
                  className="w-full border rounded-md p-2 mb-4"
                  rows="4"
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setIsJoinRequestOpen(false)} className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500">Cancel</button>
                  <button onClick={() => handleJoinRequest(course)} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Send Request</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchCourses;
