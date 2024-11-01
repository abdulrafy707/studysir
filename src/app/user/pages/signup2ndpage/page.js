'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupStep2() {
  const [verificationCode, setVerificationCode] = useState('');
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

  const handleVerify = async () => {
    if (!verificationCode) {
      setError('Verification code is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/student_teacher_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'verify_code',
          email,
          verification_code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push(`/user/pages/signup3rdpage?email=${encodeURIComponent(email)}&role=${encodeURIComponent(role)}`);
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
      <div className="hidden lg:flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden relative">
        {/* Form Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">Verify Your Email</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {/* Gradient Illustration Section */}
        <div className="w-1/2 relative flex items-center justify-center bg-gradient-to-br from-blue-300 via-blue-500 to-purple-600">
          <div
            className="absolute"
            style={{
              width: '841.8px',
              height: '1105.27px',
              top: '-300.7px',
              left: '65.66px',
              opacity: '0.8',
              transform: 'rotate(-26.16deg)',
            }}
          />
          {/* You can add icons or subtle shapes within this gradient for further decoration */}
          <div className="text-white text-3xl font-bold text-center">
            <p>Secure Your Account</p>
            <p>with Email Verification</p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden w-full p-4 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">Verify Your Email</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md"
        />
        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
}
