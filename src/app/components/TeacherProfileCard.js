'use client';
import { useState, useEffect } from 'react';

export default function TeacherPostPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(true); // Show popup by default
  const [formData, setFormData] = useState({
    teacher_id: '',
    post_description: '',
    rating: '',
    fee_range: '',
    time_availability: '',
    subjects: '',
    languages: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch teacher_id from localStorage (assuming the user is logged in and has a teacher role)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'teacher') {
      setFormData(prev => ({
        ...prev,
        teacher_id: user.id
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('https://studysir.m3xtrader.com/api/save_post_api.php', { // Update with your actual API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Post added successfully!');
        setFormData({
          teacher_id: formData.teacher_id,  // Keep teacher_id intact
          post_description: '',
          rating: '',
          fee_range: '',
          time_availability: '',
          subjects: '',
          languages: ''
        });

        // Automatically close the popup after a successful post
        setTimeout(() => {
          handleClosePopup();
        }, 1500); // 1.5 seconds delay before closing
      } else {
        setError(data.error || 'An error occurred while creating the post.');
      }
    } catch (error) {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <div>
      {/* Popup box */}
      {isPopupOpen && (
        <div className="fixed text-black inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center p-4 sm:p-6">
          <div className="bg-white border rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[95%] sm:max-w-[600px] h-[80vh] overflow-y-auto relative">
            <button className="absolute top-2 right-2 text-red-500 text-lg sm:text-2xl" onClick={handleClosePopup}>
              &times; {/* Cross button for closing the popup */}
            </button>

            <h2 className="text-lg sm:text-2xl font-bold mb-4">Add New Post</h2>

            {/* Success or Error Messages */}
            {successMessage && <p className="text-green-500 mb-4 text-sm sm:text-base">{successMessage}</p>}
            {error && <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>}

            {/* Post Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm sm:text-base">Teacher ID</label>
                <input
                  type="text"
                  name="teacher_id"
                  value={formData.teacher_id}
                  readOnly
                  className="w-full border border-gray-300 p-2 rounded-lg bg-gray-200 cursor-not-allowed text-xs sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm sm:text-base">Post Description</label>
                <textarea
                  name="post_description"
                  value={formData.post_description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg text-xs sm:text-sm"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm sm:text-base">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm sm:text-base">Fee Range</label>
                <input
                  type="text"
                  name="fee_range"
                  value={formData.fee_range}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm sm:text-base">Time Availability</label>
                <input
                  type="text"
                  name="time_availability"
                  value={formData.time_availability}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg text-xs sm:text-sm"
                  required
                />
              </div>

              {/* Subjects Input */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm sm:text-base">Subjects</label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleInputChange}
                  placeholder="Enter subjects, separated by commas"
                  className="w-full border border-gray-300 p-2 rounded-lg text-xs sm:text-sm"
                />
              </div>

              {/* Languages Input */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm sm:text-base">Languages</label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  placeholder="Enter languages, separated by commas"
                  className="w-full border border-gray-300 p-2 rounded-lg text-xs sm:text-sm"
                />
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 text-xs sm:text-sm"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-xs sm:text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
