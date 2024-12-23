'use client';
import { useState, useEffect, useRef } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'next-share';
import { FaLanguage, FaChalkboardTeacher, FaMale, FaRegClock, FaWallet } from 'react-icons/fa';
import { AiOutlineLike } from 'react-icons/ai';
import { BsFillChatDotsFill, BsThreeDots } from 'react-icons/bs';
import { MdLocationOn } from 'react-icons/md';
import { BiShare } from 'react-icons/bi';

export default function JobCard({ post }) {
  // Separate state variables for each dropdown
  const [saveDropdownOpen, setSaveDropdownOpen] = useState(false);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deductionMessage, setDeductionMessage] = useState('');
  const [coinsToDeduct, setCoinsToDeduct] = useState(0);
  const [remainingCoins, setRemainingCoins] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Separate refs for each dropdown
  const shareDropdownRef = useRef(null);
  const saveDropdownRef = useRef(null);

  useEffect(() => {
    if (post.likes) {
      setLikes(post.likes);
    }
  }, [post.likes]);

  useEffect(() => {
    // Close dropdowns if clicked outside
    const handleClickOutside = (event) => {
      if (saveDropdownRef.current && !saveDropdownRef.current.contains(event.target)) {
        setSaveDropdownOpen(false);
      }
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target)) {
        setShareDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSavePost = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
      console.error('User not logged in');
      alert('You need to be logged in to save posts.');
      return;
    }

    const postData = {
      user_id: userData.id,
      post_id: post.post_id,
      post_type: 'studentpost',
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
        setSaveDropdownOpen(false);
      } else {
        alert(`Error saving post: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('An unexpected error occurred while saving the post.');
    }
  };

  const handleLikePost = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
      console.error('User not logged in');
      alert('You need to be logged in to like posts.');
      return;
    }

    const postData = {
      username: userData.username,
      post_id: post.post_id,
      post_type: 'studentpost',
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
      } else {
        alert(`Error liking post: ${result.error}`);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('An unexpected error occurred while liking the post.');
    }
  };

  const handleLiveChatClick = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
      console.error('User not logged in');
      alert('You need to be logged in to start a live chat.');
      return;
    }

    if (userData.role === 'student') {
      setErrorMessage('Students are not allowed to chat with this person.');
      return;
    }

    if (userData.role === 'teacher') {
      if (post.status?.toLowerCase() !== 'active') {
        setErrorMessage('This post is inactive. Live Chat is not available.');
        return;
      }

      const feeBudget = post.fee_budget ? parseFloat(post.fee_budget) : 0;
      const coins = feeBudget < 5 ? 50 : feeBudget * 10;
      setCoinsToDeduct(coins);
      setShowChatPopup(true);
    }
  };

  const confirmChat = async () => {
    setShowChatPopup(false);
    setErrorMessage('');
    setDeductionMessage('');
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
      console.error('User not logged in');
      setErrorMessage('User not logged in');
      return;
    }

    const coinDeductData = {
      teacher_id: userData.id,
      post_id: post.post_id,
    };

    try {
      const coinResponse = await fetch(`${baseUrl}/coin_deduct_api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coinDeductData),
      });
      const coinResult = await coinResponse.json();

      if (!coinResult.success) {
        setErrorMessage(`Coin Deduction Error: ${coinResult.error}`);
        return;
      }

      setDeductionMessage(`Coins deducted successfully. Remaining coins: ${coinResult.remaining_coins}`);
      setRemainingCoins(coinResult.remaining_coins);

      const chatroomData = new FormData();
      chatroomData.append('teacher_id', userData.id);
      chatroomData.append('student_id', post.student_id);
      chatroomData.append('post_id', post.post_id);
      chatroomData.append('type', userData.role === 'teacher' ? 1 : 0);
      chatroomData.append('status', 1);
      chatroomData.append('last_message', "Chat started");

      const chatroomResponse = await fetch(`${baseUrl}/chatroom_api.php`, {
        method: 'POST',
        body: chatroomData,
      });

      const chatroomText = await chatroomResponse.text();
      try {
        const chatroomResult = JSON.parse(chatroomText);
        if (chatroomResult.status === "success" || chatroomResult.status === "exists") {
          window.location.href = `/teacher/chat?teacher_id=${userData.id}&student_id=${post.student_id}&post_id=${post.post_id}`;
        } else {
          setErrorMessage(`Chatroom Error: ${chatroomResult.message}`);
        }
      } catch (parseError) {
        console.error("Failed to parse JSON response from chatroom API:", parseError);
        setErrorMessage("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error('Error during chat confirmation:', error);
      setErrorMessage('Failed to start chat due to a network or server error.');
    }
  };

  const closePopup = () => {
    setShowChatPopup(false);
  };

  // Toggle functions for each dropdown
  const toggleSaveDropdown = () => {
    setSaveDropdownOpen((prev) => !prev);
    setShareDropdownOpen(false); // Close share dropdown when toggling save dropdown
  };

  const toggleShareDropdown = () => {
    setShareDropdownOpen((prev) => !prev);
    setSaveDropdownOpen(false); // Close save dropdown when toggling share dropdown
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getTruncatedDescription = (description, wordLimit = 100) => {
    if (!description) return '';
    const words = description.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : description;
  };

  const shareTitle = post.job_title || 'Job Opportunity';
  const shareDescription = getTruncatedDescription(post.job_description, 100);
  const shareUrl = 'https://studysir.com';

  return (
    <div
      className="bg-white text-black border rounded-lg w-[300px] sm:w-[500px] md:w-[600px] p-4 my-3 relative mx-auto"
      style={{ boxShadow: '-1px 1px 10px 0px #00000040' }}
    >
      {/* Header with student profile, name, location, and status */}
      <div className="flex items-start justify-between relative">
        <div className="flex items-center">
          <img
            src={post.profile_image ? `${baseUrl}/uploads/${post.profile_image}` : '/default-profile.png'}
            alt="Profile Picture"
            className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
          />
          <div className="ml-2 sm:ml-4">
            <h2 className="text-lg sm:text-lg font-bold">{post.name || 'Student'}</h2>
            <p className="text-gray-500 text-xs sm:text-sm flex items-center">
              
              {post.location || 'Location not provided'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1">
          {/* Three Dots Menu */}
          <div ref={saveDropdownRef} className="relative">
            <BsThreeDots
              className="cursor-pointer text-gray-600 hover:text-gray-800 ml-2 text-xs sm:text-sm"
              onClick={toggleSaveDropdown}
            />
            {/* Save Post Dropdown */}
            {saveDropdownOpen && (
              <div className="absolute right-0 top-6 bg-white shadow-lg rounded-lg w-32 z-10">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={handleSavePost}
                  >
                    Save Post
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Posted Time */}
          <div className="text-xs text-gray-500">
            {post.posted_time ? new Date(post.posted_time).toLocaleDateString() : 'Date not available'}
          </div>

          {/* Status Badge */}
          <div
            className={`${
              post.status?.toLowerCase() === 'active' ? 'bg-green-600' : 'bg-red-600'
            } text-white text-xs font-medium rounded-full px-3 py-1 shadow-md`}
          >
            {post.status || 'Inactive'}
          </div>
        </div>
      </div>

      {/* Job Title and Description */}
      <h3 className="text-lg sm:text-lg font-bold">{post.job_title || 'Job Title not available'}</h3>
      <p className="text-gray-700 text-xs sm:text-sm mt-2">
        {showFullDescription
          ? post.job_description || 'Job description not provided'
          : getTruncatedDescription(post.job_description || 'Job description not provided')}
        {post.job_description && post.job_description.split(' ').length > 100 && (
          <span className="text-blue-500 cursor-pointer" onClick={toggleDescription}>
            {showFullDescription ? ' See Less' : ' See More'}
          </span>
        )}
      </p>
      <hr />

      {/* Job details with icons */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2">
          <FaLanguage className="text-gray-700 text-xs sm:text-sm" />
          <p className="font-bold text-xs sm:text-sm">Languages:</p>
          <p className="text-xs sm:text-sm">
            {Array.isArray(post.languages) && post.languages.length > 0
              ? post.languages.join(', ')
              : 'Not specified'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <FaChalkboardTeacher className="text-gray-700 text-xs sm:text-sm" />
          <p className="font-bold text-xs sm:text-sm">Subjects:</p>
          <p className="text-xs sm:text-sm">
            {Array.isArray(post.subjects) && post.subjects.length > 0
              ? post.subjects.join(', ')
              : 'Not specified'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <FaMale className="text-gray-700 text-xs sm:text-sm" />
          <p className="font-bold text-xs sm:text-sm">Required Gender:</p>
          <p className="text-xs sm:text-sm">{post.required_gender || 'Not specified'}</p>
        </div>

        <div className="flex items-center space-x-2">
          <FaRegClock className="text-gray-700 text-xs sm:text-sm" />
          <p className="font-bold text-xs sm:text-sm">Time Availability:</p>
          <p className="text-xs sm:text-sm">{post.time_availability || 'Not specified'}</p>
        </div>

        <div className="flex items-center space-x-2">
          <FaWallet className="text-gray-700 text-xs sm:text-sm" />
          <p className="font-bold text-xs sm:text-sm">Fee Budget:</p>
          <p className="text-xs sm:text-sm">{post.fee_budget ? `${post.fee_budget}$` : 'Not specified'}</p>
        </div>
      </div>

      {/* Action Buttons: Like, Share, and Live Chat */}
      <hr className="mt-4" />
      <div className="mt-2 flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="flex items-center text-gray-500 hover:text-blue-500" onClick={handleLikePost}>
            <AiOutlineLike className="mr-1 text-xs sm:text-sm" />
            <span className="text-xs sm:text-sm">
              {likes} Like{likes === 1 ? '' : 's'}
            </span>
          </button>

          {/* Share Button and Dropdown */}
          <div ref={shareDropdownRef} className="relative">
            <button className="flex items-center text-gray-500 hover:text-blue-500" onClick={toggleShareDropdown}>
              <BiShare className="mr-1 text-xs sm:text-sm" />
              <span className="text-xs sm:text-sm">Share</span>
            </button>

            {shareDropdownOpen && (
              <div
                className="absolute bottom-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 z-20"
              >
                <div className="grid grid-cols-2 gap-2">
                  <FacebookShareButton
                    url={shareUrl}
                    quote={`${shareTitle} - ${shareDescription}`}
                    className="flex items-center p-1"
                  >
                    <FacebookIcon size={32} round />
                    <span className="ml-2 text-xs sm:text-sm">Facebook</span>
                  </FacebookShareButton>

                  <TwitterShareButton
                    url={shareUrl}
                    title={`${shareTitle} - ${shareDescription}`}
                    className="flex items-center p-1"
                  >
                    <TwitterIcon size={32} round />
                    <span className="ml-2 text-xs sm:text-sm">Twitter</span>
                  </TwitterShareButton>

                  <LinkedinShareButton
                    url={shareUrl}
                    title={shareTitle}
                    summary={shareDescription}
                    source={shareUrl}
                    className="flex items-center p-1"
                  >
                    <LinkedinIcon size={32} round />
                    <span className="ml-2 text-xs sm:text-sm">LinkedIn</span>
                  </LinkedinShareButton>

                  <WhatsappShareButton
                    url={shareUrl}
                    title={`${shareTitle} - ${shareDescription}`}
                    className="flex items-center p-1"
                  >
                    <WhatsappIcon size={32} round />
                    <span className="ml-2 text-xs sm:text-sm">WhatsApp</span>
                  </WhatsappShareButton>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className={`flex items-center ${
            post.status?.toLowerCase() !== 'active'
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-500 hover:text-blue-500'
          }`}
          onClick={handleLiveChatClick}
          disabled={post.status?.toLowerCase() !== 'active'}
        >
          <BsFillChatDotsFill className="mr-1 text-xs sm:text-sm" />
          <span className="text-xs sm:text-sm">Live Chat</span>
        </button>
      </div>

      {/* Chat Popup */}
      {showChatPopup && (
        <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm sm:w-[400px]">
            <h2 className="text-xs sm:text-lg font-bold text-gray-800 mb-4">Confirm Chat</h2>
            <p className="text-gray-600 mb-6 text-xs sm:text-sm">
              You are about to start a chat with this person. This will deduct{' '}
              <strong>{coinsToDeduct} coins</strong> from your account.
            </p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-4 text-xs sm:text-sm"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded text-xs sm:text-sm"
                onClick={confirmChat}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error and Deduction Messages */}
      {errorMessage && <div className="text-red-500 mt-4 text-xs sm:text-sm">{errorMessage}</div>}
      {deductionMessage && <div className="text-green-500 mt-4 text-xs sm:text-sm">{deductionMessage}</div>}
    </div>
  );
}
