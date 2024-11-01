'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupStep3() {
  const [fullname, setFullname] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get('email') || '');
    setRole(params.get('role') || '');
  }, []);

  const handlePersonalDetails = async () => {
    if (!fullname || !dob || !gender || !city || !country || !address || !phoneno) {
      setError('All fields are required.');
      return;
    }

    if (isNaN(phoneno)) {
      setError('Phone number must be numeric.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('action', 'save_personal_details');
    formData.append('email', email);
    formData.append('fullname', fullname);
    formData.append('dob', dob);
    formData.append('gender', gender);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('address', address);
    formData.append('phoneno', phoneno);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/student_teacher_api.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (role === 'teacher') {
          router.push(`/user/pages/step4?email=${encodeURIComponent(email)}&role=teacher`);
        } else {
          router.push(`/user/pages/login`);
        }
      } else {
        setError(data.error || 'An error occurred.');
      }
    } catch (err) {
      setError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center">Personal Details (Step 3)</h1>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 mb-2">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
            >
              <option value="">Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 mb-2">City</label>
            <input
              type="text"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-gray-700 mb-2">Country</label>
            <input
              type="text"
              placeholder="Enter your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneno}
              onChange={(e) => setPhoneno(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Profile Picture */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-gray-700 mb-2">Profile Picture</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handlePersonalDetails}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 w-full rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
