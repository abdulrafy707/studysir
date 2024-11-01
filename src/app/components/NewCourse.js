'use client';
import { useState, useEffect } from 'react';

export default function NewCourse({ onCloseForm }) {
  const [formData, setFormData] = useState({
    teacher_id: '',
    course_title: '',
    description: '',
    language: '',
    subject: '',
    course_duration: '',
    class_duration: '',
    class_timing: '',
    total_classes: '',
    platform: '',
    fee: '',
    course_start_date: '',
    gender: '',
    poster_image: null, // For file upload
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch user from localStorage (assuming user data is stored when logged in)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'teacher') {
      // Set teacher ID in form data
      setFormData((prev) => ({ ...prev, teacher_id: user.id }));
    } else {
      setError('You are not authorized to add a course.');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, poster_image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
  
    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });
  
    try {
      const response = await fetch('https://studysir.m3xtrader.com/api/courses_api.php', {
        method: 'POST',
        body: formPayload,
      });
  
      const responseText = await response.text(); // Read the raw response as text
      console.log('Raw response:', responseText); // Log the response to see if it's HTML or an error page
  
      try {
        const data = JSON.parse(responseText); // Parse it manually
        if (data.success) {
          setSuccessMessage('Course added successfully!');
          setFormData({
            teacher_id: formData.teacher_id,
            course_title: '',
            description: '',
            language: '',
            subject: '',
            course_duration: '',
            class_duration: '',
            class_timing: '',
            total_classes: '',
            platform: '',
            fee: '',
            course_start_date: '',
            gender: '',
            poster_image: null,
          });
          setTimeout(() => {
            onCloseForm();
          }, 1500);
        } else {
          setError(data.error || 'An error occurred while adding the course.');
          console.error('Error response:', data);
        }
      } catch (err) {
        // This means the response wasn't valid JSON
        setError('The server returned an invalid response.');
        console.error('Invalid JSON:', responseText);
      }
    } catch (error) {
      setError('Failed to connect to the server.');
      console.error('Connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-lg">
      <button
        onClick={onCloseForm}
        className="text-red-500 text-2xl absolute top-2 right-2"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>

      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Course Title</label>
          <input
            type="text"
            name="course_title"
            value={formData.course_title}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            rows="3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Language</label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Course Duration</label>
          <input
            type="text"
            name="course_duration"
            value={formData.course_duration}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Class Duration</label>
          <input
            type="text"
            name="class_duration"
            value={formData.class_duration}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Class Timing</label>
          <input
            type="text"
            name="class_timing"
            value={formData.class_timing}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Total Classes</label>
          <input
            type="number"
            name="total_classes"
            value={formData.total_classes}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Platform</label>
          <input
            type="text"
            name="platform"
            value={formData.platform}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Fee</label>
          <input
            type="number"
            name="fee"
            value={formData.fee}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Course Start Date</label>
          <input
            type="date"
            name="course_start_date"
            value={formData.course_start_date}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Anyone">Anyone</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Poster Image</label>
          <input
            type="file"
            name="poster_image"
            onChange={handleFileChange}
            className="w-full border p-2 rounded-lg"
            accept="image/*"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            onClick={onCloseForm}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
