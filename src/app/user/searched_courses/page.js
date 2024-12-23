'use client';

import { useState, useEffect } from 'react';
import { 
  FaLanguage, 
  FaCalendarAlt, 
  FaChalkboardTeacher, 
  FaDollarSign, 
  FaClock, 
  FaRegThumbsUp, 
  FaUserFriends
} from 'react-icons/fa';
import { AiOutlineFileText } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';

const SearchCourses = () => {
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [likes, setLikes] = useState({});
  const [isJoinRequestOpen, setIsJoinRequestOpen] = useState(null);
  const [joinRequestMessage, setJoinRequestMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Retrieve query parameter from window.location
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('query') || '';
    setQuery(queryParam);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!query) return;
      try {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}/search_courses_api.php?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Error fetching courses');
        
        const courseData = await response.json();
        setCourses(Array.isArray(courseData) ? courseData : []);
        courseData.forEach(course => fetchTeacherInfo(course.teacher_id));
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to fetch courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [query, baseUrl]); // Trigger useEffect on query change

  const fetchTeacherInfo = async (teacherId) => {
    if (!teachers[teacherId]) {
      try {
        const response = await fetch(`${baseUrl}/teacher_name_api.php?id=${teacherId}`);
        if (!response.ok) throw new Error('Error fetching teacher info');
        
        const teacherData = await response.json();
        setTeachers(prevTeachers => ({ ...prevTeachers, [teacherId]: teacherData }));
      } catch (error) {
        console.error('Error fetching teacher info:', error);
        toast.error('Failed to fetch teacher information.');
      }
    }
  };

  const toggleDropdown = (courseId) => {
    setDropdownOpen(dropdownOpen === courseId ? null : courseId);
  };

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const handleLikeCourse = async (courseId) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      toast.error('Please log in to like the course.');
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
        toast.success('Course liked successfully!');
      } else {
        toast.error(`Error liking course: ${result.error}`);
      }
    } catch (error) {
      console.error('Error liking course:', error);
      toast.error('An error occurred while liking the course.');
    }
  };

  const handleJoinRequestClick = (courseId) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      toast.error('You need to log in to send a join request.');
      return;
    }
    setIsJoinRequestOpen(courseId);
  };

  const handleJoinRequest = async (course) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      toast.error('You need to log in to send a join request.');
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
        toast.success('Join request sent to the teacher.');
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      toast.error('An error occurred while sending the join request.');
    } finally {
      setIsJoinRequestOpen(null);
      setJoinRequestMessage('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots height="80" width="80" radius="9" color="#3498db" ariaLabel="three-dots-loading" visible={true} />
        <p className="ml-4">Loading courses...</p>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="flex flex-wrap justify-center gap-3 text-black">
        {courses.length === 0 ? (
          <p>No courses found for "{query}"</p>
        ) : (
          courses.map((course) => (
            <div key={course.course_id} className="bg-white border z-10 rounded-lg w-[300px] sm:w-[300px] md:w-[600px] shadow-lg p-4 my-3 relative mx-auto">
              {/* Join Request Popup */}
              {isJoinRequestOpen === course.course_id && (
                <div className="absolute right-0 bottom-4 mt-2 w-80 bg-white p-6 rounded-lg shadow-lg z-50">
                  <h2 className="text-xl font-bold mb-4">Send Join Request</h2>
                  <textarea
                    value={joinRequestMessage}
                    onChange={(e) => setJoinRequestMessage(e.target.value)}
                    placeholder="Write a message to the teacher"
                    className="w-full border rounded-md p-2 mb-4"
                    rows="4"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsJoinRequestOpen(null)}
                      className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleJoinRequest(course)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                      Send Request
                    </button>
                  </div>
                </div>
              )}

              {/* Dropdown Menu */}
              <div className="absolute z-10 top-4 right-4 flex justify-end">
                <BsThreeDots
                  className="cursor-pointer text-gray-600 hover:text-gray-800 ml-2 text-xs sm:text-sm"
                  onClick={() => toggleDropdown(course.course_id)}
                />
                {dropdownOpen === course.course_id && (
                  <div className="absolute right-0 bg-white shadow-md rounded-lg py-2 mt-2">
                    <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                      Save Course
                    </button>
                  </div>
                )}
              </div>

              {/* Teacher Info */}
              {teachers[course.teacher_id] && (
                <div className="flex items-center mb-4 justify-between">
                  <div className="flex">
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
                  <div className="flex flex-col items-start space-y-2">
                    <div className="text-xs mt-4 sm:text-sm text-gray-500">
                      {course.created_at ? new Date(course.created_at).toLocaleDateString() : 'Date not available'}
                    </div>
                    <div
                      className={`${
                        course.status?.toLowerCase() === 'active' ? 'bg-green-600' : 'bg-red-600'
                      } text-white text-xs sm:text-sm font-medium rounded-full px-4 py-1 shadow-md`}
                    >
                      {course.status || 'Inactive'}
                    </div>
                  </div>
                </div>
              )}

              {/* Course Title */}
              <div className="flex items-start justify-between">
                <h2 className="text-sm sm:text-lg font-bold">{course.course_title || 'Course Title'}</h2>
              </div>

              {/* Course Description */}
              <p className="text-gray-700 text-xs sm:text-sm mt-2">
                {showFullDescription ? course.description : `${course.description?.slice(0, 100)}...`}
                {course.description?.length > 100 && (
                  <button onClick={toggleDescription} className="text-blue-500 text-xs sm:text-sm ml-2">
                    {showFullDescription ? 'See Less' : 'See More'}
                  </button>
                )}
              </p>

              {/* Course Banner */}
              <div className="mt-4">
                <img
                  src={course.poster_image ? `${baseUrl}/uploads/${course.poster_image}` : '/default-course.png'}
                  alt="Course Banner"
                  className="rounded-lg w-full"
                />
              </div>

               {/* Course Details */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="flex items-center space-x-2">
            <FaLanguage size={16} />
            <p className="font-bold text-xs sm:text-sm">Language:</p>
            <p className="text-xs sm:text-sm">{course.language || 'Not specified'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineFileText size={16} />
            <p className="font-bold text-xs sm:text-sm">Subject:</p>
            <p className="text-xs sm:text-sm">{course.subject || 'Not specified'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <BiUser size={16} />
            <p className="font-bold text-xs sm:text-sm">Gender:</p>
            <p className="text-xs sm:text-sm">{course.gender || 'Not specified'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaCalendarAlt size={16} />
            <p className="font-bold text-xs sm:text-sm">Course Duration:</p>
            <p className="text-xs sm:text-sm">{course.course_duration || 'Not specified'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaClock size={16} />
            <p className="font-bold text-xs sm:text-sm">Class Duration:</p>
            <p className="text-xs sm:text-sm">{course.class_duration || 'Not specified'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaCalendarAlt size={16} />
            <p className="font-bold text-xs sm:text-sm">Class Timing:</p>
            <p className="text-xs sm:text-sm">{course.class_timing || 'Not specified'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaChalkboardTeacher size={16} />
            <p className="font-bold text-xs sm:text-sm">Total Classes:</p>
            <p className="text-xs sm:text-sm">{course.total_classes || 'Not specified'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaChalkboardTeacher size={16} />
            <p className="font-bold text-xs sm:text-sm">Platform:</p>
            <p className="text-xs sm:text-sm">{course.platform || 'Not specified'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaDollarSign size={16} />
            <p className="font-bold text-xs sm:text-sm">Fee:</p>
            <p className="text-xs sm:text-sm">{course.fee ? `$${course.fee}` : 'Not specified'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaCalendarAlt size={16} />
            <p className="font-bold text-xs sm:text-sm">Course Start Date:</p>
            <p className="text-xs sm:text-sm">{course.course_start_date || 'Not specified'}</p>
          </div>
        </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row justify-around items-center border-t pt-2 space-y-4 sm:space-y-0">
                {/* Like Button */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <FaRegThumbsUp size={16} className="text-blue-500" />
                  <p className="font-bold">{likes[course.course_id] || '0'}</p>
                  <button 
                    className="text-blue-500 text-xs sm:text-sm hover:underline"
                    onClick={() => handleLikeCourse(course.course_id)}
                  >
                    Like
                  </button>
                </div>
                {/* Join Request Button */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <FaUserFriends size={14} className="text-blue-500" />
                  <button 
                    className="font-bold text-blue-500 text-xs sm:text-sm hover:underline"
                    onClick={() => handleJoinRequestClick(course.course_id)}
                  >
                    Join Request
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchCourses;
