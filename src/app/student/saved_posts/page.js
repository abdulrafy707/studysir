'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  FaLanguage, 
  FaChalkboardTeacher, 
  FaMale, 
  FaRegClock, 
  FaWallet, 
  FaRegThumbsUp, 
  FaUserFriends,
  FaCalendarAlt, 
  FaClock,
  FaDollarSign
} from 'react-icons/fa';

import { AiOutlineLike, AiOutlineFileText } from 'react-icons/ai';
import { BsFillChatDotsFill, BsThreeDots } from 'react-icons/bs';
import { MdLocationOn } from 'react-icons/md';
import { BiShare } from 'react-icons/bi';
import { ThreeDots } from 'react-loader-spinner'; // Import the spinner


export default function SavedPostsPage() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [teachers, setTeachers] = useState({}); // Store teacher information
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState({});
  const [isJoinRequestOpen, setIsJoinRequestOpen] = useState(false);
  const [joinRequestMessage, setJoinRequestMessage] = useState('');
  const [selectedPost, setSelectedPost] = useState(null); // To track the post for the join request

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData && userData.id) {
      const userId = userData.id;

      const fetchSavedPosts = async () => {
        try {
          const response = await fetch(`${baseUrl}/save_post_api.php?user_id=${userId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSavedPosts(data);
          console.log("Saved Posts Data: ", data);

          // Fetch teacher info for each course post
          data.forEach(post => {
            if (post.post_type === 'course') {
              fetchTeacherInfo(post.teacher_id);
            }
          });
        } catch (error) {
          setFetchError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

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

      fetchSavedPosts();
    } else {
      setFetchError('User not logged in');
      setIsLoading(false);
    }
  }, [baseUrl]);

  const handleSavePost = async (postId, postType) => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
      return;
    }

    const postData = {
      user_id: userData.id,
      post_id: postId,
      post_type: postType,
    };

    try {
      const response = await fetch(`${baseUrl}/save_post_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      if (result.success) {
        alert('Post saved successfully!');
      } else {
        alert(`Error saving post: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleOpenJoinRequestPopup = (post) => {
    setSelectedPost(post);
    setIsJoinRequestOpen(true);
  };

  const handleCloseJoinRequestPopup = () => {
    setIsJoinRequestOpen(false);
    setJoinRequestMessage('');
    setSelectedPost(null);
  };

  const handleSendJoinRequest = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    // Check userData fields
    if (!userData || !userData.id || !userData.fullname || !userData.role) {
      console.error('Missing user fields:', {
        user_id: userData?.id,
        fullname: userData?.fullname,
        role: userData?.role
      });
      alert('Required user fields are missing.');
      return;
    }

    // Check selectedPost fields
    if (!selectedPost || !selectedPost.teacher_id || !selectedPost.course_title) {
      console.error('Missing post fields:', {
        selectedPost,
        teacher_id: selectedPost?.teacher_id,
        course_title: selectedPost?.course_title
      });
      alert('Required post fields are missing.');
      return;
    }

    const postData = {
      student_id: userData.id,
      teacher_id: selectedPost.teacher_id,
      amount: 150,  // Adjust this value as needed
      course_title: selectedPost.course_title,
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
        console.error('Server error:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending join request:', error);
    } finally {
      handleCloseJoinRequestPopup();
    }
  };

  const handleLike = async (courseId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        console.error("User not logged in");
        return;
      }

      const postData = {
        user_id: userData.id,
        post_id: courseId,
        post_type: "course",
      };

      const response = await fetch(`${baseUrl}/like_api.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      if (result.success) {
        // Update the likes in the savedPosts state
        setSavedPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.course_id === courseId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      } else {
        console.error("Error liking course:", result.error);
      }
    } catch (error) {
      console.error("Error in handleLike function:", error);
    }
  };

  const toggleDescription = (postId) => {
    setShowFullDescription((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const getTruncatedDescription = (description) => {
    const words = description.split(' ');
    return words.length > 100 ? words.slice(0, 100).join(' ') : description;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#3498db"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }
  

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <Image src="/error.png" alt="Error" width={100} height={100} />
        <p className="text-red-500 mt-4">Error: {fetchError}</p>
      </div>
    );
  }

  // Filter posts with recognized post_type
  const recognizedPostTypes = ['studentpost', 'course', 'teacherpost'];
  const filteredPosts = savedPosts.filter(post => recognizedPostTypes.includes(post.post_type));

  if (!Array.isArray(filteredPosts) || filteredPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <Image src="/nopost.png" alt="No Posts Available" width={256} height={256} />
        <p className="text-gray-500 mt-4">No saved posts available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 sm:px-6 lg:px-8 py-6">
      {filteredPosts.map((post, index) => {
        const postType = post.post_type;

        if (postType === 'studentpost') {
          return (
            <div
              key={`${post.post_id}-${index}`} // Use a unique key
              className="bg-white border rounded-lg shadow p-4 sm:w-[600px] w-full mx-auto my-4 sm:my-8 relative text-sm sm:text-base"
            >
              {/* Header with student profile, name, and location */}
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Image
                    src={post.profile_image ? `${baseUrl}/uploads/${post.profile_image}` : '/default-profile.png'}
                    alt="Profile Picture"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <h2 className="font-semibold text-base sm:text-lg">{post.name || 'Student'}</h2>
                    <p className="text-gray-500 flex items-center text-xs sm:text-sm">
                      <MdLocationOn className="mr-1" />
                      {post.location || 'Location not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start space-y-2">
                  {/* Posted Time Section */}
                  <div className="text-xs text-gray-500">
                    {post.posted_time ? new Date(post.posted_time).toLocaleDateString() : 'Date not available'}
                  </div>

                  {/* Status Button */}
                  <div
                    className={`${
                      post.status?.toLowerCase() === 'active' ? 'bg-green-600' : 'bg-red-600'
                    } text-white text-xs sm:text-sm font-medium rounded-full px-3 py-1 shadow-md`}
                  >
                    {post.status || 'Inactive'}
                  </div>

                  {/* Three Dots Menu */}
                  <BsThreeDots
                    className="cursor-pointer text-gray-600 hover:text-gray-800 ml-2"
                    onClick={() => toggleDropdown(index)}
                  />
                  {dropdownOpen === index && (
                    <div className="absolute right-4 top-16 bg-white shadow-lg rounded-lg z-10">
                      <ul className="py-2">
                        <li
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSavePost(post.post_id, 'studentpost')}
                        >
                          Save Post
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Title and Description */}
              <h3 className="mt-4 text-base sm:text-lg font-bold">{post.job_title || 'Job Title not available'}</h3>
              <p className="text-gray-700 mt-2 text-xs sm:text-sm">
                {showFullDescription[post.post_id]
                  ? post.job_description || 'Job description not provided'
                  : getTruncatedDescription(post.job_description || 'Job description not provided')}
                {post.job_description && post.job_description.split(' ').length > 100 && (
                  <span
                    className="text-blue-500 cursor-pointer ml-2"
                    onClick={() => toggleDescription(post.post_id)}
                  >
                    {showFullDescription[post.post_id] ? 'See Less' : 'See More'}
                  </span>
                )}
              </p>

              {/* Job details with icons */}
              <div className="mt-4 space-y-2">
                {/* Languages */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <FaLanguage className="text-gray-700" />
                  <p className="font-bold">Languages:</p>
                  <p>{Array.isArray(post.languages) && post.languages.length > 0 ? post.languages.join(', ') : 'Not specified'}</p>
                </div>

                {/* Subjects */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <FaChalkboardTeacher className="text-gray-700" />
                  <p className="font-bold">Subjects:</p>
                  <p>{Array.isArray(post.subjects) && post.subjects.length > 0 ? post.subjects.join(', ') : 'Not specified'}</p>
                </div>

                {/* Gender */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <FaMale className="text-gray-700" />
                  <p className="font-bold">Required Gender:</p>
                  <p>{post.required_gender || 'Not specified'}</p>
                </div>

                {/* Time Availability */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <FaRegClock className="text-gray-700" />
                  <p className="font-bold">Time Availability:</p>
                  <p>{post.time_availability || 'Not specified'}</p>
                </div>

                {/* Fee Budget */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <FaWallet className="text-gray-700" />
                  <p className="font-bold">Fee Budget:</p>
                  <p>{post.fee_budget ? `${post.fee_budget}$` : 'Not specified'}</p>
                </div>
              </div>

              {/* Action Buttons: Like, Share, and Live Chat */}
              <hr className="mt-4" />
              <div className="mt-2 flex justify-between items-center">
                <div className="flex space-x-4">
                  <button className="flex items-center text-gray-500 hover:text-blue-500" onClick={() => handleLike(post.post_id)}>
                    <AiOutlineLike className="mr-1" />
                    <span>{post.likes || 0} Like{post.likes === 1 ? '' : 's'}</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-blue-500">
                    <BiShare className="mr-1" />
                    <span>Share</span>
                  </button>
                </div>
                <button className="flex items-center text-gray-500 hover:text-blue-500">
                  <BsFillChatDotsFill className="mr-1" />
                  <span>Live Chat</span>
                </button>
              </div>
            </div>
          );
        }
        else if (postType === 'course') {
          return (
            <div
              key={`${post.course_id}-${index}`} // Use a unique key
              className="bg-white border rounded-lg shadow p-4 sm:w-[600px] w-full mx-auto my-4 sm:my-8 relative text-sm sm:text-base"
            >
              {/* Header with Course Image and Teacher Info */}
              <div className="flex items-center mb-4 justify-between">
                <div className="flex">
                  <Image
                    src={teachers[post.teacher_id]?.image ? `${baseUrl}/uploads/${teachers[post.teacher_id].image}` : '/default-profile.png'}
                    alt={teachers[post.teacher_id]?.fullname || 'Teacher'}
                    width={64}
                    height={64}
                    className="rounded-full object-cover w-16 h-16 sm:w-24 sm:h-24"
                  />
                  <div className="ml-4">
                    <h2 className="text-base sm:text-lg font-semibold">{teachers[post.teacher_id]?.fullname || 'Teacher Name'}</h2>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {teachers[post.teacher_id]?.city || 'City not specified'}, {teachers[post.teacher_id]?.country || 'Country not specified'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start space-y-2">
                  <div
                    className={`${
                      post.status?.toLowerCase() === 'active' ? 'bg-green-600' : 'bg-red-600'
                    } text-white text-xs sm:text-sm font-medium rounded-full px-3 py-1 shadow-md`}
                  >
                    {post.status || 'Inactive'}
                  </div>
                </div>
              </div>

              {/* Course Title and Description */}
              <h3 className="text-base sm:text-lg font-bold">{post.course_title || 'Course Title'}</h3>
              <p className="text-gray-700 mt-2 text-xs sm:text-sm">
                {showFullDescription[post.course_id]
                  ? post.description || 'Course description not provided'
                  : getTruncatedDescription(post.description || 'Course description not provided')}
                {post.description && post.description.split(' ').length > 100 && (
                  <span
                    className="text-blue-500 cursor-pointer ml-2"
                    onClick={() => toggleDescription(post.course_id)}
                  >
                    {showFullDescription[post.course_id] ? 'See Less' : 'See More'}
                  </span>
                )}
              </p>

              {/* Course Banner */}
              <div className="mt-4">
                <Image
                  src={post.poster_image ? `${baseUrl}/uploads/${post.poster_image}` : '/default-course.png'}
                  alt="Course Banner"
                  width={600}
                  height={300}
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>

              {/* Course Details */}
              <div className="mt-4 grid grid-cols-6 gap-2 items-center">
                <div className="col-span-6 flex items-center space-x-2 text-xs sm:text-sm">
                  <FaLanguage className="text-gray-700" />
                  <p className="font-bold">Language:</p>
                  <p>{post.language || 'Not specified'}</p>
                </div>
                <div className="col-span-6 flex items-center space-x-2 text-xs sm:text-sm">
                  <AiOutlineFileText className="text-gray-700" />
                  <p className="font-bold">Subject:</p>
                  <p>{post.subject || 'Not specified'}</p>
                </div>
                <div className="col-span-6 flex items-center space-x-2 text-xs sm:text-sm">
                  <FaCalendarAlt className="text-gray-700" />
                  <p className="font-bold">Course Duration:</p>
                  <p>{post.course_duration || 'Not specified'}</p>
                </div>
                <div className="col-span-6 flex items-center space-x-2 text-xs sm:text-sm">
                  <FaClock className="text-gray-700" />
                  <p className="font-bold">Class Duration:</p>
                  <p>{post.class_duration || 'Not specified'}</p>
                </div>
                <div className="col-span-6 flex items-center space-x-2 text-xs sm:text-sm">
                  <FaChalkboardTeacher className="text-gray-700" />
                  <p className="font-bold">Total Classes:</p>
                  <p>{post.total_classes || 'Not specified'}</p>
                </div>
                <div className="col-span-6 flex items-center space-x-2 text-xs sm:text-sm">
                  <FaDollarSign className="text-gray-700" />
                  <p className="font-bold">Fee:</p>
                  <p>{post.fee ? `$${post.fee}` : 'Not specified'}</p>
                </div>
                <div className="col-span-6 flex items-center space-x-2 text-xs sm:text-sm">
                  <FaCalendarAlt className="text-gray-700" />
                  <p className="font-bold">Course Start Date:</p>
                  <p>{post.course_start_date || 'Not specified'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-around items-center border-t pt-2">
                {/* Like Button */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <FaRegThumbsUp className="text-blue-500" />
                  <p className="font-bold">{post.likes || 0}</p>
                  <button 
                    className="text-blue-500"
                    onClick={() => handleLike(post.course_id)} // Trigger handleLike with course ID
                  >
                    Like
                  </button>
                </div>

                {/* Join Request Button */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <FaUserFriends />
                  <button 
                    className="font-bold text-blue-500" 
                    onClick={() => handleOpenJoinRequestPopup(post)} // Pass the post data
                  >
                    Join Request
                  </button>
                </div>
              </div>
            </div>
          );
        }
        else if (postType === 'teacherpost') {
          return (
            <div
              key={`${post.teacher_id}-${index}`} // Use a unique key
              className="bg-white border rounded-lg shadow p-4 sm:w-[600px] w-full mx-auto my-4 sm:my-8 relative text-sm sm:text-base"
            >
              {/* Header with teacher's name and posted time */}
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <h2 className="text-base sm:text-lg font-bold">{post.teacher_name || 'Teacher Name'}</h2>
                </div>
                <div className="relative text-xs sm:text-sm text-gray-400">
                  <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Posted time not available'}</span>
                </div>
              </div>

              {/* Post description */}
              <h3 className="mt-4 text-base sm:text-lg font-bold">{post.post_description || 'Post Description not available'}</h3>
              <p className="text-gray-700 mt-2 text-xs sm:text-sm">Rating: {post.rating || 'No rating available'}</p>
              <p className="text-gray-700 mt-2 text-xs sm:text-sm">Fee Range: {post.fee_range || 'Fee not specified'}</p>
            </div>
          );
        }
        else {
          // For any unrecognized post_type, you can choose to skip rendering or handle it differently
          return null;
        }
      })}

      {/* Join Request Modal */}
      {isJoinRequestOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Send Join Request</h2>
            <textarea
              value={joinRequestMessage}
              onChange={(e) => setJoinRequestMessage(e.target.value)}
              placeholder="Write a message to the teacher"
              className="w-full border rounded-md p-2 mb-4 resize-none"
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
                onClick={handleSendJoinRequest}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
