'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupStep1() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, []);

  const handleSignup = async () => {
    if (!email || !password || !role) {
      setError('Email, Password, and Role are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/student_teacher_api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          action: 'signup',
          email,
          password,
          role,
          referralCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push(`/user/pages/signup2ndpage?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
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
    <div className="min-h-screen text-black flex justify-center items-center bg-gray-100">
      {/* Mobile View */}
      <div className="block md:hidden w-full max-w-sm p-8 bg-white shadow-lg rounded-lg relative">
        {/* Wave-like structure with images */}
        <div className="absolute top-0 left-0 w-full flex justify-between">
          <Image src="/left.png" alt="Left Wave" width={160} height={100} className="h-[150px]" />
          <Image src="/right.png" alt="Right Wave" width={160} height={100} className="h-[150px]" />
        </div>

        {/* Logo */}
        <div className="text-center mt-16">
          <h1 className="text-4xl font-bold text-blue-500">StudySir</h1>
        </div>

        {/* Sign Up Form */}
        <h2 className="text-center text-blue-500 font-semibold text-2xl mt-8">Sign Up (Step 1)</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form className="mt-8 space-y-6">
          <div>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Referral Code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full px-4 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-600 transition duration-200"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Bottom Image */}
        <div className="mt-8 flex justify-center">
          <Image src="/login.png" alt="Sign Up Bottom Image" width={150} height={150} className="w-[200px] h-[200px]" />
        </div>
      </div>

      {/* Desktop View */}
<div className="hidden md:flex w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden h-[90vh]">
  {/* Left Side - Slanted Background */}
  <div className="relative w-1/2 h-full overflow-hidden">
    {/* Blue Slant with White Curve at the Bottom */}
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full"
    >
      {/* Blue Background */}
      <polygon points="0,0 100,0 80,100 0,100" fill="#1E90FF" />
      
      {/* White Curve Overlay */}
      <polygon points="0,100 80,100 100,0 100,100" fill="white" />
    </svg>
  </div>

  {/* Right Side - Sign Up Form */}
  <div className="w-1/2 h-full flex flex-col justify-center items-center">
    <div className="w-3/4 flex flex-col justify-center">
      <h2 className="text-4xl font-bold text-blue-600 text-center mb-8">Sign Up (Step 1)</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md"
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md"
      >
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      <input
        type="text"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md"
        placeholder="Referral Code"
        readOnly // Make the referral code field non-editable
      />

      <button
        onClick={handleSignup}
        disabled={loading}
        className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  </div>
</div>

    </div>
  );
}
