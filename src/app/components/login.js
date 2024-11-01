import Link from 'next/link';
import Image from 'next/image'; // Import Image component for Next.js

export default function SignInPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden flex">
        {/* Left side - Blue background with image */}
        <div className="w-1/2  flex items-center justify-center">
          {/* Add the signin.png image on the left side */}
          <Image
            src="/signin.png" // Path to the signin.png image
            alt="Sign In Illustration"
            width={800}  // Adjust the size as per your requirement
            height={800} // Adjust the size as per your requirement
            className="object-contain"
          />
        </div>

        {/* Right side - Sign In form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">Sign in</h2>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            className="border border-blue-500 w-full py-2 px-4 mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Forgot Password Link */}
          <div className="text-right text-sm text-gray-500 mb-6">
            <a href="#" className="hover:underline">Forget your Email/Password</a>
          </div>

          {/* Sign In Button */}
          <button className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition duration-200">
            Sign in
          </button>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <Link href="/signup">
              <div className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition duration-200 block text-center">
                Sign up for new account
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
