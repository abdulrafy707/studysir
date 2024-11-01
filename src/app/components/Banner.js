import React from 'react';

export default function Banner() {
  return (
    <div className="flex justify-center items-center w-full bg-gray-100 py-10">
      <div className="flex items-center justify-between w-full max-w-6xl relative">
        {/* Left Image */}
        <div className="w-1/3 flex justify-center">
          <img src="/carton1.png" alt="Carton 1" className="max-w-full h-auto" />
        </div>
        
        {/* Center Text */}
        <div className="w-1/3 text-center z-10">
          <h1 className="text-4xl font-bold text-blue-600">EDUCATION</h1>
          <p className="mt-4 text-lg text-gray-700">
            is the most powerful weapon which you can use to <span className="text-blue-400 font-bold">change the world.</span>
          </p>
          <p className="mt-2 text-gray-500">NELSON MANDELA</p>
          <div className="mt-6">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
              Find Your Tutor
            </button>
            <button className="px-6 py-2 ml-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100 transition">
              Become a Tutor
            </button>
          </div>
        </div>
        
        {/* Right Image Section */}
        <div className="w-1/3 flex justify-center relative">
          {/* Background Image */}
          <img src="/carton2BG.png" alt="Carton 2 Background" className="absolute max-w-64 right-0 top-0 h-auto" style={{zIndex: 0}} />
          
          {/* Foreground Image */}
          <img src="/carton2.png" alt="Carton 2" className="relative z-10 max-w-72 h-auto" />
        </div>
      </div>
    </div>
  );
}
