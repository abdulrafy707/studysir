'use client';
import { useEffect, useState } from 'react';

export default function TeacherEbookCard() {
  const [ebooks, setEbooks] = useState([]); // State to hold fetched ebooks
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(''); // State for error handling
  const [editingEbook, setEditingEbook] = useState(null); // State to track ebook being edited
  const [formData, setFormData] = useState({}); // State to hold form data for updates

  // Get base URL from environment variables
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    // Get teacher_id from local storage
    const fetchTeacherEbooks = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.id) {
          throw new Error('No teacher ID found in local storage.');
        }

        const teacherId = userData.id;
        console.log(`Fetching ebooks for teacher ID: ${teacherId}`);

        // Fetch ebooks for the specific teacher from the API
        const response = await fetch(`${baseUrl}/get_teacher_ebooks.php?teacher_id=${teacherId}`, {
          method: 'GET', // Specify GET method
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response as JSON
        const data = await response.json();
        console.log("Parsed Data:", data); // Log the parsed data

        if (Array.isArray(data) && data.length > 0) {
          setEbooks(data); // Store fetched ebooks in the state
        } else {
          setError('No ebooks available for this teacher.');
        }
      } catch (err) {
        console.error('Error fetching ebooks for teacher:', err);
        setError('Error connecting to server or invalid JSON.');
      } finally {
        setLoading(false); // Stop loading after fetch is complete
      }
    };

    fetchTeacherEbooks();
  }, [baseUrl]);

  const handleDelete = async (ebookId) => {
    // Ensure userData is defined
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      alert('User data is not available. Please log in again.');
      return;
    }
  
    try {
      const response = await fetch(`${baseUrl}/get_teacher_ebooks.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ ebook_id: ebookId, teacher_id: userData.id }),
      });
  
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.success) {
        alert('Ebook deleted successfully.');
        // Optionally, remove the deleted ebook from the state
        setEbooks((prevEbooks) => prevEbooks.filter((ebook) => ebook.id !== ebookId));
      } else {
        alert(data.error || 'Failed to delete ebook.');
      }
    } catch (error) {
      console.error('Error deleting ebook:', error);
      alert('Error deleting ebook.');
    }
  };
  

  // Handle update ebook
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${baseUrl}/get_teacher_ebooks.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          ebook_id: editingEbook.id,
          teacher_id: editingEbook.teacher_id,
          ebook_title: formData.ebook_title || editingEbook.ebook_title,
          author_name: formData.author_name || editingEbook.author_name,
          description: formData.description || editingEbook.description,
          price: formData.price || editingEbook.price,
          seller_name: formData.seller_name || editingEbook.seller_name,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Ebook updated successfully.');
      } else {
        alert(data.error || 'Failed to update ebook.');
      }
    } catch (error) {
      console.error('Error updating ebook:', error);
      alert('Error updating ebook.');
    }
  };

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error state if there is an error
  if (error) {
    return <div>{error}</div>;
  }

  // Render fetched ebooks
  return (
    <div className="container text-black mx-auto p-4">
      {ebooks.map((ebook) => (
        <div key={ebook.id} className="bg-white border rounded-lg shadow-lg p-6 w-full md:w-[600px] my-6">
          <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-6">
            {/* Left: Ebook Image and Price */}
            <div className="w-full md:w-1/3 flex flex-col justify-between">
              <img
                src={`${baseUrl}/uploads/${ebook.cover_page_image_url}`}
                alt={ebook.ebook_title || 'Ebook Image'}
                className="rounded-lg object-cover w-full h-48 mb-4"
              />
              <p className="text-gray-800 font-bold text-lg md:text-xl">Rs {ebook.price || 'N/A'}</p>
            </div>

            {/* Middle: Ebook Information */}
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{ebook.ebook_title || 'Ebook Title'}</h2>
              <p className="text-gray-600 text-md md:text-lg mb-4">Written by {ebook.author_name || 'Author'}</p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
                {ebook.description || 'No description available.'}{' '}
                <span className="text-blue-500 cursor-pointer">See More</span>
              </p>
              <p className="text-gray-800 font-semibold">
                Seller: <span className="text-gray-500">{ebook.seller_name || 'Seller Name'}</span>
              </p>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-col items-end space-y-2">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => {
                  setEditingEbook(ebook);
                  setFormData({
                    ebook_title: ebook.ebook_title,
                    author_name: ebook.author_name,
                    description: ebook.description,
                    price: ebook.price,
                    seller_name: ebook.seller_name,
                  });
                }}
              >
                Edit
              </button>
              <button className="text-red-500 hover:underline" onClick={() => handleDelete(ebook.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Show Edit Form when editing an ebook */}
      {editingEbook && (
        <div className="bg-gray-100 p-4 rounded-md shadow-md mt-6">
          <h3 className="text-lg font-bold mb-4">Edit Ebook</h3>
          <input
            type="text"
            value={formData.ebook_title}
            onChange={(e) => setFormData({ ...formData, ebook_title: e.target.value })}
            className="border rounded-lg p-2 w-full mb-4"
            placeholder="Ebook Title"
          />
          <input
            type="text"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            className="border rounded-lg p-2 w-full mb-4"
            placeholder="Author Name"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border rounded-lg p-2 w-full mb-4"
            placeholder="Description"
          />
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="border rounded-lg p-2 w-full mb-4"
            placeholder="Price"
          />
          <input
            type="text"
            value={formData.seller_name}
            onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
            className="border rounded-lg p-2 w-full mb-4"
            placeholder="Seller Name"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleUpdate}>
            Update Ebook
          </button>
        </div>
      )}
    </div>
  );
}
