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
import { toast } from 'react-toastify';

export default function CourseList({ course }) {
  const [teachers, setTeachers] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isJoinRequestOpen, setIsJoinRequestOpen] = useState(false);
  const [joinRequestMessage, setJoinRequestMessage] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Determine if user is logged in
  const userLoggedIn = !!JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    const fetchTeacherInfo = async (teacherId) => {
      try {
        const response = await fetch(`${baseUrl}/teacher_name_api.php?id=${teacherId}`, { method: 'GET' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const teacherData = await response.json();
        setTeachers(prevTeachers => ({
          ...prevTeachers,
          [teacherId]: teacherData,
        }));
      } catch (error) {
        console.error('Error fetching teacher info:', error);
      }
    };

    if (course.teacher_id) {
      fetchTeacherInfo(course.teacher_id);
    }

    if (course.likes) {
      setLikes(course.likes);
    }
  }, [baseUrl, course.teacher_id, course.likes]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const handleLikeCourse = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
      toast.error('Please log in to like the course.', {
        className: 'bg-red-500 text-white',
        bodyClassName: 'text-sm',
      });
      return;
    }

    const postData = {
      username: userData.username,
      post_id: course.course_id,
      post_type: 'course',
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
        toast.success('Course liked successfully!', {
          className: 'bg-green-500 text-white',
          bodyClassName: 'text-sm',
        });
      } else {
        toast.error(`Error liking course: ${result.error}`, {
          className: 'bg-red-500 text-white',
          bodyClassName: 'text-sm',
        });
      }
    } catch (error) {
      console.error('Error liking course:', error);
      toast.error('An error occurred while liking the course.', {
        className: 'bg-red-500 text-white',
        bodyClassName: 'text-sm',
      });
    }
  };

  const handleJoinRequestClick = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('Join Request Clicked. User Data:', userData); // Debugging line

    // Check if user is logged in
    if (!userData || !userData.id) {
      toast.error('You need to log in to send a join request.', {
        className: 'bg-red-500 text-white',
        bodyClassName: 'text-sm',
      });
      return;
    }

    // Open the join request popup if user is logged in
    handleOpenJoinRequestPopup();
  };

  const handleJoinRequest = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    // Check if user is logged in
    if (!userData) {
      toast.error('You need to log in to send a join request.', {
        className: 'bg-red-500 text-white',
        bodyClassName: 'text-sm',
      });
      return;
    }

    // Check if essential user fields are present
    const { id, fullname, role } = userData;
    if (!id || !fullname || !role) {
      toast.error('Incomplete user information. Please log in again.', {
        className: 'bg-red-500 text-white',
        bodyClassName: 'text-sm',
      });
      return;
    }

    // Validate course fields
    if (!course.teacher_id || !course.course_title) {
      toast.error('Required course information is missing.', {
        className: 'bg-red-500 text-white',
        bodyClassName: 'text-sm',
      });
      return;
    }

    // Optional: Validate joinRequestMessage length
    if (joinRequestMessage.length > 500) {
      toast.error('Your message is too long. Please limit it to 500 characters.', {
        className: 'bg-red-500 text-white',
        bodyClassName: 'text-sm',
      });
      return;
    }

    const postData = {
      student_id: id,
      teacher_id: course.teacher_id,
      amount: 150,  // Adjust this value as needed
      course_title: course.course_title,
      fullname: fullname,
      role: role,
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
        toast.success('Join request sent to the teacher.', {
          className: 'bg-green-500 text-white',
          bodyClassName: 'text-sm',
        });
      } else {
        console.error('Server error:', result.error);
        toast.error(`Error: ${result.error}`, {
          className: 'bg-red-500 text-white',
          bodyClassName: 'text-sm',
        });
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      toast.error('An error occurred while sending the join request.', {
        className: 'bg-red-500 text-white',
        bodyClassName: 'text-sm',
      });
    } finally {
      handleCloseJoinRequestPopup();
    }
  };

  const handleOpenJoinRequestPopup = () => {
    setIsJoinRequestOpen(true);
  };

  const handleCloseJoinRequestPopup = () => {
    setIsJoinRequestOpen(false);
    setJoinRequestMessage('');
  };

  const handleSaveCourse = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
      console.error('User not logged in');
      toast.error('User not logged in.', {
        className: 'bg-red-500 text-white',
        bodyClassName: 'text-sm',
      });
      return;
    }

    try {
      console.log('Attempting to save course:', course.course_id);
      const response = await fetch(`${baseUrl}/save_post_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.id,
          post_id: course.course_id,
          post_type: 'course',
          course_id: course.course_id,
          teacher_id: course.teacher_id,
          course_title: course.course_title,
          description: course.description,
          language: course.language,
          subject: course.subject,
          gender: course.gender,
          course_duration: course.course_duration,
          class_duration: course.class_duration,
          class_timing: course.class_timing,
          total_classes: course.total_classes,
          platform: course.platform,
          fee: course.fee,
          course_start_date: course.course_start_date,
          created_at: course.created_at,
          updated_at: course.updated_at,
          likes: course.likes,
          reviews: course.reviews,
          questions: course.questions,
          status: course.status,
          poster_image: course.poster_image,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        toast.success('Course saved successfully!', {
          className: 'bg-green-500 text-white',
          bodyClassName: 'text-sm',
        });
      } else {
        console.error('Error saving course:', result.error);
        toast.error(`Error saving course: ${result.error}`, {
          className: 'bg-red-500 text-white',
          bodyClassName: 'text-sm',
        });
      }
    } catch (error) {
      console.error('Error in handleSaveCourse:', error);
      toast.error('An error occurred while saving the course.', {
        className: 'bg-red-500 text-white',
        bodyClassName: 'text-sm',
      });
    } finally {
      setDropdownOpen(false);  // Close the dropdown after saving
    }
  };

  return (
    <div className="bg-white shadow-lg text-black border z-10 rounded-lg w-[300px] sm:w-[300px] md:w-[600px] shadow-lg p-4 my-8 relative mx-auto">
      
      {/* Join Request Popup */}
      {isJoinRequestOpen && (
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
              onClick={handleCloseJoinRequestPopup}
              className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleJoinRequest}
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
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div className="absolute right-0 bg-white shadow-md rounded-lg py-2 mt-2">
            <button
              onClick={handleSaveCourse}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
            >
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
              className="rounded-full object-cover w-12 h-12 sm:w-16 sm:h-16" // Adjusted profile image size
            />
            <div className="ml-1 mt-3">
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
              } text-white text-xs sm:text-sm font-medium rounded-full px-4 py-1 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out`}
            >
              {course.status || 'Inactive'}
            </div>
          </div>
        </div>
      )}

      {/* Course Title */}
      <div className="flex items-start justify-between">
        <h2 className="text-lg sm:text-lg font-bold">{course.course_title || 'Course Title'}</h2>
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
          <p className="font-bold">{likes || '0'}</p>
          <button 
            className="text-blue-500 text-xs sm:text-sm hover:underline"
            onClick={handleLikeCourse}
          >
            Like
          </button>
        </div>

        {/* Join Request Button */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <FaUserFriends size={14} className="text-blue-500" />
          <button 
            className={`font-bold text-blue-500 text-xs sm:text-sm ${
              !userLoggedIn ? 'opacity-50 cursor-not-allowed' : 'hover:underline'
            }`}
            onClick={handleJoinRequestClick}  // Updated onClick handler
            disabled={!userLoggedIn} // Disable if not logged in
            title={userLoggedIn ? 'Send Join Request' : 'Please log in to send a join request'}
          >
            Join Request
          </button>
        </div>
      </div>
    </div>
  );
}
