'use client';
import { useState, useEffect } from 'react';
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
import { FaStar } from 'react-icons/fa';

export default function EbookCard({ ebook }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewSection, setShowReviewSection] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(null);
  const [likes, setLikes] = useState(ebook.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [userData, setUserData] = useState(null); // Manage userData as state
  const [loading, setLoading] = useState(false); // Loading state for download
  const [downloadError, setDownloadError] = useState(''); // Download error state
  const [downloadSuccess, setDownloadSuccess] = useState(''); // Download success state
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false); // Share dropdown state
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Retrieve user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        console.log("User Data Retrieved:", parsedUser); // Debugging
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  // Check if the user has already liked the ebook
  useEffect(() => {
    const checkIfLiked = async (ebookId) => {
      if (!userData || !userData.id) return;
      const postData = {
        username: userData.username,
        post_id: ebookId,
        post_type: 'ebookpost',
      };
      console.log("Checking if liked with data:", postData); // Debugging
      try {
        const response = await fetch(`${baseUrl}/check_like_api.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });
        const result = await response.json();
        console.log("Check Like API Response:", result); // Debugging
        if (result.liked) setIsLiked(true);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    checkIfLiked(ebook.id);
  }, [ebook.id, userData, baseUrl]);

  // Handle liking a post
  const handleLikePost = async (ebookId) => {
    if (!userData || !userData.id) {
      alert('User not logged in');
      return;
    }
    const postData = {
      username: userData.username,
      post_id: ebookId,
      post_type: 'ebookpost',
    };
    console.log("Liking post with data:", postData); // Debugging
    try {
      const response = await fetch(`${baseUrl}/like_api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
      console.log("Like API Response:", result); // Debugging
      if (result.liked) {
        setLikes(result.total_likes);
        setIsLiked(true);
      } else {
        alert(`Error liking post: ${result.error}`);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Fetch reviews for the ebook
  const fetchReviews = async (ebookId) => {
    try {
      const response = await fetch(`${baseUrl}/ebook_review_api.php?ebook_id=${ebookId}`);
      const data = await response.json();
      console.log("Fetched Reviews:", data); // Debugging
      if (Array.isArray(data)) setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Toggle the review section
  const toggleReviewSection = (ebookId) => {
    setShowReviewSection(!showReviewSection);
    if (!showReviewSection) fetchReviews(ebookId);
  };

  // Handle submitting a review
  const handleReviewSubmit = async (ebookId) => {
    if (!userData || !userData.id) {
      alert('User not logged in');
      return;
    }
    if (rating === 0) {
      alert('Please give a star rating');
      return;
    }
    const payload = {
      ebook_id: ebookId,
      user_id: userData.id,
      comment: newReview,
      rating,
    };
    console.log("Submitting Review with Payload:", payload); // Debugging
    try {
      const response = await fetch(`${baseUrl}/ebook_review_api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log("Review Submission Response:", result); // Debugging
      if (result.success) {
        alert('Review submitted successfully');
        setNewReview('');
        setRating(0);
        fetchReviews(ebookId);
      } else {
        alert(`Error submitting review: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Truncate description to first 30 words
  const getTruncatedDescription = (description) => {
    const words = description.split(' ');
    return words.length > 30 ? words.slice(0, 30).join(' ') + '...' : description;
  };

  // Handle the download process (Direct Download Approach)
  const handleDownload = () => {
    // Check if the user is logged in
    if (!userData || !userData.id) {
      alert('User not logged in');
      return;
    }

    // Ensure that the ebook prop contains seller_id (or teacher_id)
    if (!ebook.teacher_id) { // Change to seller_id if that's the correct field
      alert('Seller ID not found for this ebook.');
      setShowDownloadConfirm(false);
      return;
    }

    // Construct the file URL
    const downloadLink = ebook.ebook_file_url; // Assuming this is the filename
    if (downloadLink) {
      const fileUrl = `${baseUrl}/uploads/${encodeURIComponent(downloadLink)}`;
      const fileName = downloadLink.split('/').pop();

      // Initiate the download by opening the file in a new tab
      window.open(fileUrl, '_blank');

      // Optionally, you can increment the download count here by making an API call
      // Example:
      // incrementDownloadCount(ebook.id);

      // Provide feedback to the user
      setDownloadSuccess('Download initiated!');
    } else {
      setDownloadError('Download link not available.');
    }

    // Close the confirmation modal
    setShowDownloadConfirm(false);
  };

  // Define the URL to share. This should point to the ebook's detail page.
  const shareUrl = `${baseUrl}/ebook/${encodeURIComponent(ebook.id)}`;
  const shareTitle = ebook.ebook_title || 'Check out this amazing ebook!';

  return (
    <div className="bg-white shadow-lg text-black border rounded-lg shadow-lg p-4 w-[300px] md:w-[600px] mx-auto my-6">
      <div className="flex flex-col md:flex-row justify-between space-x-4">
        <div className="w-full md:w-1/3 flex flex-col justify-between">
          <img
            src={`${baseUrl}/uploads/${encodeURIComponent(ebook.cover_page_image_url)}`}
            alt={ebook.ebook_title || 'Ebook Image'}
            className="rounded-lg object-cover w-full h-40 mb-2"
          />
          <p className="text-gray-800 font-bold text-base">Rs {ebook.price || 'N/A'}</p>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{ebook.ebook_title || 'Ebook Title'}</h2>
          <p className="text-gray-600 text-sm mb-2">Written by {ebook.author_name || 'Author'}</p>

          <p className="text-gray-700 text-xs leading-relaxed mb-2">
            {showFullDescription
              ? ebook.description || 'No description available.'
              : getTruncatedDescription(ebook.description || 'No description available.')}
            {ebook.description && ebook.description.split(' ').length > 30 && (
              <span
                className="text-blue-500 cursor-pointer ml-2"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? 'See Less' : 'See More'}
              </span>
            )}
          </p>

          <p className="text-gray-800 font-semibold text-sm">
            Seller: <span className="text-gray-500">{ebook.seller_name || 'Seller Name'}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center border-t pt-2">
        <div className="flex space-x-6">
          <button
            className={`flex items-center ${isLiked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
            onClick={() => handleLikePost(ebook.id)}
          >
            <img src="/like.png" alt="Like Icon" width={16} height={16} />
            <span className="ml-2 text-sm">{likes}</span>
          </button>
          <button className="flex items-center text-gray-500 hover:text-blue-600" onClick={() => toggleReviewSection(ebook.id)}>
            <img src="/review1.png" alt="Review Icon" width={16} height={16} />
            <span className="ml-2 text-sm">{reviews.length || 0}</span>
          </button>
          {/* Share Button with Dropdown */}
          <div className="relative">
            <button
              className="flex items-center text-gray-500 hover:text-blue-500"
              onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
            >
              <img src="/share.png" alt="Share Icon" width={16} height={16} />
              <span className="ml-2 text-sm">{ebook.shares || 0}</span>
            </button>

            {shareDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 z-20">
                <FacebookShareButton url={shareUrl} quote={shareTitle} className="mx-2 my-1 flex items-center">
                  <FacebookIcon size={32} round />
                  <span className="ml-2 text-xs sm:text-sm">Facebook</span>
                </FacebookShareButton>

                <TwitterShareButton url={shareUrl} title={shareTitle} className="mx-2 my-1 flex items-center">
                  <TwitterIcon size={32} round />
                  <span className="ml-2 text-xs sm:text-sm">Twitter</span>
                </TwitterShareButton>

                <LinkedinShareButton url={shareUrl} title={shareTitle} className="mx-2 my-1 flex items-center">
                  <LinkedinIcon size={32} round />
                  <span className="ml-2 text-xs sm:text-sm">LinkedIn</span>
                </LinkedinShareButton>

                <WhatsappShareButton url={shareUrl} title={shareTitle} className="mx-2 my-1 flex items-center">
                  <WhatsappIcon size={32} round />
                  <span className="ml-2 text-xs sm:text-sm">WhatsApp</span>
                </WhatsappShareButton>
              </div>
            )}
          </div>
        </div>
        <button
          className="flex items-center text-gray-500 hover:text-blue-600"
          onClick={() => setShowDownloadConfirm(true)}
        >
          <img src="/download.png" alt="Download Icon" width={16} height={16} />
          <span className="ml-2 text-sm">{ebook.downloads || 'Download'}</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showDownloadConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Download</h3>
            <p className="mb-4">Are you sure you want to download this ebook?</p>
            {downloadError && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                {downloadError}
              </div>
            )}
            {downloadSuccess && (
              <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
                {downloadSuccess}
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                onClick={() => setShowDownloadConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-blue-500 text-white rounded ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
                onClick={handleDownload}
                disabled={loading}
              >
                {loading ? 'Downloading...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Section */}
      {showReviewSection && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2">User Reviews</h3>

          <div className="space-y-2">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="p-2 bg-gray-100 rounded-lg shadow-sm">
                  <p className="font-semibold text-blue-600 text-sm">{review.fullname}</p>
                  <p className="text-gray-700 text-xs mt-1">{review.comment}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar key={i} size={12} className="text-yellow-500" />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-500 text-xs">{new Date(review.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-xs">No reviews yet. Be the first to review!</p>
            )}
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-sm text-gray-800 mb-2">Leave a Review</h4>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review here..."
              className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-xs"
            />
            <div className="flex items-center space-x-1 mt-2">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={ratingValue}
                    size={20}
                    className={`cursor-pointer ${ratingValue <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHoverRating(ratingValue)}
                    onMouseLeave={() => setHoverRating(null)}
                  />
                );
              })}
            </div>
            <button
              onClick={() => handleReviewSubmit(ebook.id)}
              className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 text-xs"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
