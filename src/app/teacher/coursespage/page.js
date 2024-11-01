'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import NewCourse from '@/app/components/NewCourse'; // Import the NewCourse component

const TeacherCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewCourseForm, setShowNewCourseForm] = useState(false); // State to toggle new course form
    const searchParams = useSearchParams(); // Access query parameters
    const router = useRouter(); // For navigating to the edit page
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const teacher_id = searchParams.get('teacher_id'); // Get teacher_id from the query string

    useEffect(() => {
        const fetchCourses = async () => {
            console.log('Fetching courses for teacher_id:', teacher_id); // Log the teacher_id
            try {
                const response = await fetch(`https://studysir.m3xtrader.com/api/course_api.php?teacher_id=${teacher_id}`);
                const data = await response.json();

                // console.log('API response data:', data); // Log the API response data

                if (response.ok) {
                    setCourses(data.courses || []); // Use data.courses to avoid undefined
                } else {
                    setError(data.error || 'Failed to fetch courses');
                }
            } catch (err) {
                console.error('Error fetching courses:', err); // Log the error
                setError('Error fetching courses');
            } finally {
                setLoading(false);
            }
        };

        if (teacher_id) {
            fetchCourses();
        }
    }, [teacher_id]);

    const handleEdit = (course_id) => {
        router.push(`/teacher/edit_course?course_id=${course_id}`); // Navigate to the course edit page
    };

    const handleAddNewCourse = () => {
        setShowNewCourseForm(true); // Show the new course form when button is clicked
    };

    const handleCloseNewCourseForm = () => {
        setShowNewCourseForm(false); // Hide the new course form when closed
    };

    if (loading) {
        return <div>Loading courses...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    console.log('Fetched courses:', courses); // Log the fetched courses

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Your Courses</h1>

            {/* Add New Course Button */}
            <div className="flex justify-center mb-8">
                <button
                    onClick={handleAddNewCourse}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                    Add New Course
                </button>
            </div>

            {/* Render the New Course Form if showNewCourseForm is true */}
            {showNewCourseForm && (
                <NewCourse onCloseForm={handleCloseNewCourseForm} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.course_id} className="bg-white border rounded-lg shadow-lg p-4">
                            {/* Teacher Profile and Rating */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                    <Image
                                        src={course.teacher_image || '/default-profile.png'} // Dynamically load teacher image or default
                                        alt={course.teacher_name || 'Profile Picture'}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <div className="ml-4">
                                        <h2 className="text-lg font-bold">{course.teacher_name || 'Teacher Name'}</h2>
                                        <p className="text-gray-500">{course.teacher_location || 'Location not provided'}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-400">{course.created_at || 'Date not available'}</span>
                                    <div className={`bg-${course.status === 'active' ? 'green' : 'red'}-500 text-white text-sm rounded-full px-4 py-1 mt-1`}>
                                        {course.status || 'Inactive'}
                                    </div>
                                </div>
                            </div>

                            {/* Course Title */}
                            <h3 className="mt-4 text-xl font-bold">{course.course_title || 'Course Title'}</h3>

                            {/* Course Description */}
                            <p className="text-gray-700 mt-2">
                                {course.description || 'No description available.'} <span className="text-blue-500">See More</span>
                            </p>

                            {/* Course Banner */}
                            <div className="mt-4">
                                <img
                                    src={course.poster_image ? `${baseUrl}/uploads/${course.poster_image}` : '/default-course.png'} // Dynamically load the course banner image
                                    alt="Course Banner"
                                    className="rounded-lg w-full h-40 object-cover"
                                />
                            </div>

                            {/* Course Details */}
                            <div className="mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Language */}
                                    <div className="flex items-center">
                                        <Image src="/language.png" alt="Language Icon" width={20} height={20} />
                                        <p className="ml-2 text-gray-600">Language: {course.language || 'Not specified'}</p>
                                    </div>

                                    {/* Subject */}
                                    <div className="flex items-center">
                                        <Image src="/subject1.png" alt="Subject Icon" width={20} height={20} />
                                        <p className="ml-2 text-gray-600">Subject: {course.subject || 'Not specified'}</p>
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-center">
                                        <Image src="/calander.png" alt="Duration Icon" width={20} height={20} />
                                        <p className="ml-2 text-gray-600">Duration: {course.course_duration || 'Not specified'}</p>
                                    </div>

                                    {/* Fee */}
                                    <div className="flex items-center">
                                        <Image src="/feeWallet.png" alt="Fee Icon" width={20} height={20} />
                                        <p className="ml-2 text-gray-600">Fee: ${course.fee || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => handleEdit(course.course_id)}
                                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors duration-300"
                            >
                                Edit Course
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500">No courses found.</p>
                )}
            </div>
        </div>
    );
};

export default TeacherCoursesPage;
