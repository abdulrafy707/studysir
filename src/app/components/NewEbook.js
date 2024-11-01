'use client';
import { useState, useEffect } from 'react';

export default function NewEbook({ onCloseForm }) {
  const [formData, setFormData] = useState({
    ebook_title: '',
    author_name: '',
    description: '',
    price: '',
    seller_name: '',
    rating: '',
    teacher_id: '',  // The teacher_id will be fetched from localStorage
    ebook_file: null, // Will hold the selected file (PDF, Word, ZIP, MP3, MP4)
    cover_page_image: null, // Will hold the selected cover image
    drive_link: ''    // Will hold the Google Drive link if provided
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://studysir.m3xtrader.com/api';

  // Fetch teacher_id and seller_name from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'teacher') {
      setFormData(prev => ({
        ...prev,
        teacher_id: user.id,
        seller_name: user.fullname || user.username, // Use fullname if available
      }));
    } else {
      setError('Unable to retrieve teacher information.');
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection for ebook file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, ebook_file: file });
    console.log('Selected Ebook File:', file);
  };

  // Handle file selection for cover page image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, cover_page_image: file });
    console.log('Selected Cover Page Image:', file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const formDataToSend = new FormData();
    formDataToSend.append('ebook_title', formData.ebook_title);
    formDataToSend.append('author_name', formData.author_name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('seller_name', formData.seller_name);
    formDataToSend.append('rating', formData.rating);
    formDataToSend.append('teacher_id', formData.teacher_id);

    // Append ebook file if it's selected
    if (formData.ebook_file) {
      formDataToSend.append('ebook_file', formData.ebook_file);
    }

    // Append cover page image if it's selected
    if (formData.cover_page_image) {
      formDataToSend.append('cover_page_image', formData.cover_page_image);
    }

    // Append Google Drive link if provided
    if (formData.drive_link) {
      formDataToSend.append('drive_link', formData.drive_link);
    }

    try {
      console.log('Submitting formData to:', `${BASE_URL}/ebook_post_api.php`);
      const response = await fetch(`${BASE_URL}/ebook_post_api.php`, {
        method: 'POST',
        body: formDataToSend,
      });
    
      const responseText = await response.text();
    
      try {
        const data = JSON.parse(responseText);
    
        if (data.success) {
          setSuccessMessage('Ebook added successfully!');
          // Reset form data...
        } else {
          console.log('Error from API:', data.error);
          setError(data.error || 'An error occurred while adding the ebook.');
        }
      } catch (parseError) {
        // The response was not JSON
        console.error('Server returned invalid JSON:', responseText);
        setError('An unexpected server error occurred.');
      }
    } catch (error) {
      console.error('Failed to connect to the server:', error);
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-lg relative">
      <button onClick={onCloseForm} className="text-red-500 text-2xl absolute top-2 right-2">&times;</button>
      <h2 className="text-2xl font-bold mb-4">Add New Ebook</h2>

      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Ebook Title */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Ebook Title</label>
          <input
            type="text"
            name="ebook_title"
            value={formData.ebook_title}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        {/* Author Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Author Name</label>
          <input
            type="text"
            name="author_name"
            value={formData.author_name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        {/* Description */}
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

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            step="0.01"
            required
          />
        </div>

        {/* Seller Name (Disabled, auto-filled) */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Seller Name</label>
          <input
            type="text"
            name="seller_name"
            value={formData.seller_name}
            className="w-full border p-2 rounded-lg bg-gray-100"
            disabled
          />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating</label>
          <input
            type="number"
            step="0.1"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
            min="0"
            max="5"
          />
        </div>

        {/* Ebook File */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Ebook File (PDF, Word, ZIP, MP3, MP4)</label>
          <input
            type="file"
            name="ebook_file"
            onChange={handleFileChange}
            className="w-full border p-2 rounded-lg"
            accept=".pdf,.doc,.docx,.zip,.mp3,.mp4"
          />
        </div>

        {/* Cover Page Image */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Cover Page Image</label>
          <input
            type="file"
            name="cover_page_image"
            onChange={handleImageChange}
            className="w-full border p-2 rounded-lg"
            accept="image/*"
          />
        </div>

        {/* Google Drive Link */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Google Drive Link (optional)</label>
          <input
            type="url"
            name="drive_link"
            value={formData.drive_link}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-between">
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500" onClick={onCloseForm}>
            Cancel
          </button>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Ebook'}
          </button>
        </div>
      </form>
    </div>
  );
}
