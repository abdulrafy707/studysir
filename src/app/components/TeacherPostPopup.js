// 'use client';
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';

// export default function TeacherPostPopup({ postId, onClose }) {
//   const [teacherData, setTeacherData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     const fetchTeacherPost = async () => {
//       try {
//         const response = await fetch(`https://studysir.m3xtrader.com/api/teacherpost_api.php?post_id=${postId}`);
        
//         if (response.ok) {
//           const data = await response.json();

//           // Parse languages and subjects if they are strings
//           if (typeof data.teacher_details.languages === 'string') {
//             data.teacher_details.languages = JSON.parse(data.teacher_details.languages);
//           }
//           if (typeof data.teacher_details.subjects === 'string') {
//             data.teacher_details.subjects = JSON.parse(data.teacher_details.subjects);
//           }
//           setTeacherData(data);
//         } else {
//           setError('Failed to load teacher data');
//         }
//       } catch (err) {
//         setError('Error connecting to server');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeacherPost();
//   }, [postId]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   // Function to handle chat initiation with teacher
//   const handleJoinChat = () => {
//     if (teacherData && teacherData.teacher_details && teacherData.teacher_details.id) {
//       console.log(`Navigating to chat page with teacher_id: ${teacherData.teacher_details.id}`);
//       // Redirecting to the chat page with the teacher_id in the query parameter
//       router.push(`/student/chat?teacher_id=${teacherData.teacher_details.id}`);
//     } else {
//       console.error("Teacher ID is undefined or missing");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
//       <div className="bg-white border rounded-lg shadow-lg p-4 w-[600px] my-8">
//         <button className="absolute top-2 right-2 text-red-500" onClick={onClose}>X</button>

//         {/* Teacher Information */}
//         <div className="flex justify-between">
//           {/* Left: Teacher's Profile Image */}
//           <div className="flex items-start">
//             <div>
//               <Image
//                 src={teacherData.teacher_details.profile_image || '/default-profile.png'} // Use actual profile image path from API or fallback image
//                 alt={teacherData.teacher_details.fullname}
//                 width={100}
//                 height={100}
//                 className="rounded-full"
//               />
//             </div>
//           </div>

//           {/* Middle: Teacher Details */}
//           <div className="flex-1 ml-4">
//             <h2 className="text-xl font-bold">{teacherData.teacher_details.fullname}</h2>
//             <p className="text-gray-500 text-sm">{teacherData.teacher_details.location || 'Unknown Location'}</p>

//             <p className="text-gray-700 mt-2">
//               {teacherData.post_description}
//               <span className="text-blue-500"> See More</span>
//             </p>
//           </div>

//           {/* Right: Rating */}
//           <div className="flex flex-col items-end">
//             <div className="flex items-center">
//               {/* Star Ratings */}
//               <div className="flex space-x-1">
//                 {Array.from({ length: Math.floor(teacherData.rating) }).map((_, index) => (
//                   <Image
//                     key={index}
//                     src="/star.png"
//                     alt="Star Rating"
//                     width={20}
//                     height={20}
//                   />
//                 ))}
//                 {teacherData.rating % 1 !== 0 && (
//                   <Image
//                     src="/star-half.png"
//                     alt="Half Star Rating"
//                     width={20}
//                     height={20}
//                   />
//                 )}
//               </div>
//               <p className="ml-2 text-black font-bold">{teacherData.rating}</p>
//             </div>
//           </div>
//         </div>

//         {/* Extra Details Section */}
//         <div className="mt-4 border-t pt-2">
//           <div className="grid grid-cols-6 gap-4 items-center">
//             {/* Languages */}
//             <div className="flex items-center space-x-2 col-span-6">
//               <div className="flex space-x-1">
//                 <Image
//                   src="/language.png"
//                   alt="Language Icon"
//                   width={46}
//                   height={40}
//                 />
//               </div>
//               <p>Languages: {teacherData.teacher_details.languages.join(', ')}</p>
//             </div>

//             {/* Subjects */}
//             <div className="flex items-center space-x-2 col-span-6">
//               <div className="flex space-x-1">
//                 <Image
//                   src="/subject1.png"
//                   alt="Subject Icon"
//                   width={20}
//                   height={20}
//                 />
//               </div>
//               <p>Subjects: {teacherData.teacher_details.subjects.join(', ')}</p>
//             </div>

//             {/* Gender */}
//             <div className="flex items-center space-x-2 col-span-6">
//               <div className="flex space-x-1">
//                 <Image
//                   src="/male.png"
//                   alt="Male Icon"
//                   width={20}
//                   height={20}
//                   className={teacherData.teacher_details.gender === 'Male' ? 'opacity-100' : 'opacity-50'}
//                 />
//                 <Image
//                   src="/female.png"
//                   alt="Female Icon"
//                   width={20}
//                   height={20}
//                   className={teacherData.teacher_details.gender === 'Female' ? 'opacity-100' : 'opacity-50'}
//                 />
//               </div>
//               <p>Gender: {teacherData.teacher_details.gender}</p>
//             </div>

//             {/* Qualification */}
//             <div className="flex items-center space-x-2 col-span-6">
//               <div className="flex space-x-1">
//                 <Image
//                   src="/class1.png"
//                   alt="Qualification Icon"
//                   width={20}
//                   height={20}
//                 />
//               </div>
//               <p>Qualification: {teacherData.teacher_details.qualification}</p>
//             </div>

//             {/* Fee */}
//             <div className="flex items-center space-x-2 col-span-6">
//               <div className="flex space-x-1">
//                 <Image
//                   src="/feeWallet.png"
//                   alt="Fee Icon"
//                   width={20}
//                   height={20}
//                 />
//               </div>
//               <p>Fee: {teacherData.fee_range}</p>
//             </div>
//           </div>
//         </div>

//         {/* Interaction Section */}
//         <div className="mt-4 flex justify-between items-center border-t pt-2">
//           {/* Like, Review, Time Availability, Hire Teacher */}
//           <div className="flex space-x-6">
//             <button className="flex items-center text-gray-500 hover:text-blue-500">
//               <Image
//                 src="/like.png"
//                 alt="Like Icon"
//                 width={20}
//                 height={20}
//               />
//               <span className="ml-2">7</span>
//             </button>

//             <button className="flex items-center text-gray-500 hover:text-blue-500">
//               <Image
//                 src="/review1.png"
//                 alt="Review Icon"
//                 width={20}
//                 height={20}
//               />
//               <span className="ml-2">5</span>
//             </button>

//             <button className="flex items-center text-gray-500 hover:text-blue-500">
//               <Image
//                 src="/time.png"
//                 alt="Time Icon"
//                 width={20}
//                 height={20}
//               />
//               <span className="ml-2">{teacherData.time_availability}</span>
//             </button>
//           </div>

//           <button 
//             className="flex items-center text-gray-500 hover:text-blue-500"
//             onClick={handleJoinChat} // Navigate to chat when clicked
//           >
//             <Image
//               src="/hire.png"
//               alt="Hire Icon"
//               width={20}
//               height={20}
//             />
//             <span className="ml-2">Hire Teacher</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
