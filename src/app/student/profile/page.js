'use client';
import { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaVenusMars, FaCity, FaFlag, FaSave, FaEdit, FaTimesCircle, FaCamera, FaWallet } from 'react-icons/fa'; // Import icons
import { ThreeDots } from 'react-loader-spinner'; // Import the spinner
export default function StudentUpdateForm() {
  const [student, setStudent] = useState({
    id: '',
    username: '',
    fullname: '',
    phoneno: '',
    gender: '',
    city: '',
    country: '',
    status: '',
    image: '/default-profile.png', // Default image path
    current_money: 0, // Add current money field
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For storing the selected image

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch student details when the component mounts
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.id) {
        setLoading(true);
        fetch(`${baseUrl}/student_api.php?id=${userData.id}`)
          .then((response) => response.json())
          .then((data) => {
            if (data && Array.isArray(data) && data.length > 0) {
              const studentData = data[0];
              setStudent({
                id: studentData.id || '',
                username: studentData.username || '',
                fullname: studentData.fullname || '',
                phoneno: studentData.phoneno || '',
                gender: studentData.gender || '',
                city: studentData.city || '',
                country: studentData.country || '',
                status: studentData.status || '',
                image: studentData.image ? `${baseUrl}/uploads/${studentData.image}` : '/noprofile.png', // Set the image URL
                current_money: studentData.current_money || 0, // Fetch and set the current money
              });
            } else {
              setMessage('No data found for the user.');
            }
          })
          .catch((error) => {
            setMessage('Error fetching student details.');
            console.error(error);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [baseUrl]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Handle form submission to update details
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, username, status, ...updatedData } = student; // Exclude username and status for update
    const formData = new FormData();

    // Add action and id to the FormData
    formData.append('action', 'update');
    formData.append('id', id);

    // Add updated fields to the FormData
    for (const key in updatedData) {
      formData.append(key, updatedData[key]);
    }

    if (selectedImage) {
      formData.append('image', selectedImage); // Add image to form data if selected
    }

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/student_api.php`, {
        method: 'POST', // Use POST for updates
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage('Details updated successfully!');
        setIsEditing(false); // Turn off editing mode after successful update

        if (result.student) {
          setStudent((prevState) => ({
            ...prevState,
            fullname: result.student.fullname || prevState.fullname,
            phoneno: result.student.phoneno || prevState.phoneno,
            gender: result.student.gender || prevState.gender,
            city: result.student.city || prevState.city,
            country: result.student.country || prevState.country,
            image: result.student.image ? `${baseUrl}/uploads/${result.student.image}` : prevState.image,
          }));
        }
      } else {
        setMessage(`Error: ${result.error || 'Failed to update details'}`);
      }
    } catch (error) {
      setMessage('Error updating details.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="w-full text-black max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Your Profile</h2>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {message && <p className="text-center text-red-500">{message}</p>}

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
        <img
  src={student.image}
  alt="Profile"
  className="w-32 h-32 rounded-full object-cover shadow-lg mb-4"
  onError={() => setStudent((prevState) => ({ ...prevState, image: '/noprofile.png' }))} // Set fallback if image fails to load
/>

          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
              <FaCamera />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div className="space-y-4">

<div className="mb-6">
  <FaWallet className="inline-block mr-2 text-gray-600" /> 
  <strong>Balance:</strong> Rs.{student.current_money} {/* Display balance here */}
</div>
          <p><FaUser className="inline-block mr-2 text-gray-600"/> <strong>Full Name:</strong> {student.fullname}</p>
          <p><FaPhone className="inline-block mr-2 text-gray-600"/> <strong>Phone Number:</strong> {student.phoneno}</p>
          <p><FaVenusMars className="inline-block mr-2 text-gray-600"/> <strong>Gender:</strong> {student.gender}</p>
          <p><FaCity className="inline-block mr-2 text-gray-600"/> <strong>City:</strong> {student.city}</p>
          <p><FaFlag className="inline-block mr-2 text-gray-600"/> <strong>Country:</strong> {student.country}</p>
          <button
            onClick={handleEditClick}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={student.fullname}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                id="phoneno"
                name="phoneno"
                value={student.phoneno}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                pattern="^\+?[0-9]{7,15}$" // Basic phone number validation
                title="Enter a valid phone number (7-15 digits, optionally starting with +)"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="relative">
              <FaVenusMars className="absolute left-3 top-2.5 text-gray-500" />
              <select
                id="gender"
                name="gender"
                value={student.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <div className="relative">
              <FaCity className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                id="city"
                name="city"
                value={student.city}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <div className="relative">
              <FaFlag className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                id="country"
                name="country"
                value={student.country}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
            >
              <FaSave className="mr-2" /> Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full mt-3 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 flex items-center justify-center"
            >
              <FaTimesCircle className="mr-2" /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
