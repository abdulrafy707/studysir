'use client';
import { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaCamera, FaPhoneAlt, FaUserAlt, FaEnvelope, FaMapMarkerAlt, FaUniversity, FaBook, FaMoneyBillAlt } from 'react-icons/fa'; // Importing icons
import { MdLanguage } from 'react-icons/md'; // Importing language icon

export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState({
    id: '',
    username: '',
    fullname: '',
    phoneno: '',
    dob: '',
    gender: '',
    city: '',
    country: '',
    status: '',
    image: '/default-profile.png', // Default image path
    address: '',
    qualification: '',
    university: '',
    experience: 0,
    languages: [],
    subjects: [],
    designation: '',
    description: '',
    fee: '', // New field for fee
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.id) {
        setLoading(true);
        fetch(`${baseUrl}/teacher_api.php?id=${userData.id}`)
          .then((response) => response.json())
          .then((data) => {
            if (data && !data.error) {
              setTeacher({
                id: data.id || '',
                username: data.username || '',
                fullname: data.fullname || '',
                phoneno: data.phoneno || '',
                dob: data.dob || '',
                gender: data.gender || '',
                city: data.city || '',
                country: data.country || '',
                status: data.status || '',
                image: data.image ? `${baseUrl}/uploads/${data.image}` : '/default-profile.png',
                address: data.address || '',
                qualification: data.qualification || '',
                university: data.university || '',
                experience: data.experience || 0,
                languages: data.languages ? data.languages : [],
                subjects: data.subjects ? data.subjects : [],
                designation: data.designation || '',
                description: data.description || '',
                fee: data.fee || '', // Set fee if available
              });
            } else {
              setMessage(data.error || 'No data found for the user.');
            }
          })
          .catch((error) => {
            setMessage('Error fetching teacher details.');
          })
          .finally(() => setLoading(false));
      } else {
        setMessage('User ID not found in localStorage.');
      }
    } else {
      setMessage('No user data found. Please log in.');
    }
  }, [baseUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('id', teacher.id);
    if (teacher.fullname) formData.append('fullname', teacher.fullname);
    if (teacher.phoneno) formData.append('phoneno', teacher.phoneno);
    if (teacher.dob) formData.append('dob', teacher.dob);
    if (teacher.gender) formData.append('gender', teacher.gender);
    if (teacher.city) formData.append('city', teacher.city);
    if (teacher.country) formData.append('country', teacher.country);
    if (teacher.address) formData.append('address', teacher.address);
    if (teacher.qualification) formData.append('qualification', teacher.qualification);
    if (teacher.university) formData.append('university', teacher.university);
    if (teacher.experience !== undefined) formData.append('experience', teacher.experience);
    if (teacher.languages.length > 0) formData.append('languages', JSON.stringify(teacher.languages));
    if (teacher.subjects.length > 0) formData.append('subjects', JSON.stringify(teacher.subjects));
    if (teacher.designation) formData.append('designation', teacher.designation);
    if (teacher.description) formData.append('description', teacher.description);
    if (teacher.fee) formData.append('fee', teacher.fee); // Append fee

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/teacher_api.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        if (result.teacher) {
          setTeacher({
            ...teacher,
            image: result.teacher.image ? `${baseUrl}/uploads/${result.teacher.image}` : '/default-profile.png',
          });
        }
      } else {
        setMessage(`Error: ${result.error || 'Failed to update profile.'}`);
      }
    } catch (error) {
      setMessage('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setMessage('');
  };

  const handleCommaSeparatedChange = (e, field) => {
    const value = e.target.value;
    const valuesArray = value.split(',').map(item => item.trim());
    setTeacher((prevState) => ({
      ...prevState,
      [field]: valuesArray,
    }));
  };

  return (
    <div className="w-full text-black max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-4xl font-semibold mb-8 text-center text-blue-600">Teacher Profile</h2>

      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
        </div>
      )}

      {message && (
        <p className={`text-center mb-4 ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}

      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={teacher.image}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover mb-4 shadow-lg"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p><FaUserAlt className="inline-block mr-2"/> <strong>Full Name:</strong> {teacher.fullname}</p>
          <p><FaPhoneAlt className="inline-block mr-2"/> <strong>Phone Number:</strong> {teacher.phoneno}</p>
          <p><FaEnvelope className="inline-block mr-2"/> <strong>Email:</strong> {teacher.username}</p>
          <p><FaMapMarkerAlt className="inline-block mr-2"/> <strong>City:</strong> {teacher.city}, {teacher.country}</p>
          <p><FaUniversity className="inline-block mr-2"/> <strong>University:</strong> {teacher.university}</p>
          <p><FaUserAlt className="inline-block mr-2"/> <strong>Designation:</strong> {teacher.designation}</p>
          <p><MdLanguage className="inline-block mr-2"/> <strong>Languages:</strong> {teacher.languages.join(', ')}</p>
          <p><FaBook className="inline-block mr-2"/> <strong>Subjects:</strong> {teacher.subjects.join(', ')}</p>
          <p><FaMoneyBillAlt className="inline-block mr-2"/> <strong>Fee:</strong> {teacher.fee}</p>
          <p><strong>Description:</strong> {teacher.description}</p>
          <button
            onClick={handleEditClick}
            className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 flex items-center justify-center"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name with Icon */}
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <FaUserAlt className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={teacher.fullname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Phone Number with Icon */}
            <div>
              <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <FaPhoneAlt className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  id="phoneno"
                  name="phoneno"
                  value={teacher.phoneno}
                  onChange={handleInputChange}
                  pattern="^\+?[0-9]{7,15}$"
                  title="Enter a valid phone number (7-15 digits, optionally starting with +)"
                  className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* City with Icon */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={teacher.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Country with Icon */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={teacher.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Designation Field */}
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={teacher.designation}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={teacher.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            ></textarea>
          </div>

          {/* Fee with Icon */}
          <div>
            <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Fee</label>
            <div className="relative">
              <FaMoneyBillAlt className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="number"
                id="fee"
                name="fee"
                value={teacher.fee}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Languages with Icon */}
          <div>
            <label htmlFor="languages" className="block text-sm font-medium text-gray-700">Languages</label>
            <div className="relative">
              <MdLanguage className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                id="languages"
                name="languages"
                value={teacher.languages.join(', ')}
                onChange={(e) => handleCommaSeparatedChange(e, 'languages')}
                placeholder="Enter languages separated by commas (e.g., English, Spanish)"
                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Subjects with Icon */}
          <div>
            <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">Subjects</label>
            <div className="relative">
              <FaBook className="absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                id="subjects"
                name="subjects"
                value={teacher.subjects.join(', ')}
                onChange={(e) => handleCommaSeparatedChange(e, 'subjects')}
                placeholder="Enter subjects separated by commas (e.g., Math, Science)"
                className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 flex items-center justify-center"
            >
              <FaSave className="mr-2" /> Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-full hover:bg-gray-700 flex items-center justify-center"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
