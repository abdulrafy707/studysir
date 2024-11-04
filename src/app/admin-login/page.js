'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://studysir.m3xtrader.com/api/login_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          username: data.user.username,
          fullname: data.user.fullname,
          role: data.user.role,
          image: data.user.image,
          isAuthenticated: true,
        }));

        router.push(data.user.role === 'student' ? '/student' : '/teacher');
      } else {
        setErrorMessage(data.error || 'Login failed, please try again.');
      }
    } catch (error) {
      setErrorMessage('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      {/* Mobile View */}
      <div className="block md:hidden w-full max-w-sm p-8 mx-auto bg-white shadow-lg rounded-lg relative">
      <div className="absolute inset-0 w-full flex justify-between">

          <Image src="/left.png" alt="Left Wave" width={160} height={100} className="h-[150px]" />
          <Image src="/right.png" alt="Right Wave" width={160} height={100} className="h-[150px]" />
        </div>

        <div className="text-center mt-16">
          <h1 className="text-4xl font-bold text-blue-500">StudySir</h1>
        </div>

        <h2 className="text-center text-blue-500 font-semibold text-2xl mt-8"> Admin Sign In</h2>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>

        {/* <div className="mt-4 flex justify-between">
          <Link href="/user/pages/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
          <Link href="/user/pages/signup" className="text-blue-500 hover:underline">
            Sign up for a new account
          </Link>
        </div> */}

        <div className="mt-8 flex justify-center">
          <Image src="/login.png" alt="Sign Up Bottom Image" width={150} height={150} className="w-[200px] h-[200px]" />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden h-[90vh]">
        {/* Left Side - Slanted Background */}
        <div className="relative w-1/2 h-full overflow-hidden">
          {/* Blue Slant with White Curve at the Bottom */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <polygon points="0,0 100,0 80,100 0,100" fill="#1E90FF" />
            <polygon points="0,100 80,100 100,0 100,100" fill="white" />
          </svg>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-1/2 h-full flex flex-col justify-center items-center">
          <div className="w-3/4 flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-blue-600 text-center mb-8"> Admin Sign In</h2>
            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

            <form onSubmit={handleSignIn} className="w-full">
              <input
                type="text"
                placeholder="Username"
                className="border border-blue-500 w-full py-3 px-5 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-blue-500 w-full py-3 px-5 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white w-full py-3 rounded-md hover:bg-blue-600 transition duration-200"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>
            </form>

            {/* <div className="mt-4 text-center">
              <Link href="/user/pages/forgot-password" className="text-blue-500 hover:underline block mb-2">
                Forgot your Email/Password?
              </Link>
              <Link href="/user/pages/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 inline-block">
                Sign up for new account
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
