'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSignIn = async (event) => {
    event.preventDefault();

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

        if (data.user.role === 'student') {
          router.push('/student');
        } else if (data.user.role === 'teacher') {
          router.push('/teacher');
        }
      } else {
        setErrorMessage(data.error || 'Login failed, please try again.');
      }
    } catch (error) {
      setErrorMessage('Error connecting to the server.');
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

        {/* Sign In Form */}
        <h2 className="text-center text-blue-500 font-semibold text-2xl mt-8">Sign In</h2>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-600 transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Forgot Password and Sign Up Links */}
        <div className="mt-4 flex justify-between">
          <Link href="/user/pages/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
          <Link href="/user/pages/signup" className="text-blue-500 hover:underline">
            Sign up for a new account
          </Link>
        </div>

        {/* Bottom Image */}
        <div className="mt-8 flex justify-center">
          <Image src="/login.png" alt="Sign Up Bottom Image" width={150} height={150} className="w-[200px] h-[200px]" />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left side - Sign In Image */}
        <div className="w-1/2 flex items-center justify-center">
          <Image
            src="/signin.png"
            alt="Sign In Illustration"
            width={800}
            height={800}
            className="object-contain"
          />
        </div>

        {/* Right side - Sign In Form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">Sign in</h2>
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

          <form onSubmit={handleSignIn}>
            <input
              type="text"
              placeholder="Username"
              className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Sign in
            </button>
          </form>

          {/* Forgot Password and Sign Up Links */}
          <div className="mt-4 flex justify-between">
            <Link href="/user/pages/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
            <Link href="/user/pages/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
              Sign up for a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
