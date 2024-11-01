'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const EditCoursePage = () => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const course_id = searchParams.get('course_id'); // Get course_id from the query string

    // Fetch course details for editing
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`https://studysir.m3xtrader.com/api/course_api.php?course_id=${course_id}`);
                const data = await response.json();
                if (response.ok) {
                    setCourse(data);
                } else {
                    setError('Failed to fetch course data');
                }
            } catch (err) {
                console.error(err);
                setError('Error fetching course');
            } finally {
                setLoading(false);
            }
        };

        if (course_id) {
            fetchCourse();
        }
    }, [course_id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    // Handle form submission to update the course
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://studysir.m3xtrader.com/api/course_api.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(course),
            });

            if (response.ok) {
                setSuccessMessage('Course updated successfully!');
                router.push(`/teacher/courses?teacher_id=${course.teacher_id}`); // Redirect after update
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to update course');
            }
        } catch (err) {
            setError('Error updating course');
        }
    };

    if (loading) {
        return <div>Loading course data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Course Title</label>
                    <input
                        type="text"
                        name="course_title"
                        value={course.course_title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={course.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Language</label>
                    <input
                        type="text"
                        name="language"
                        value={course.language}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Subject</label>
                    <input
                        type="text"
                        name="subject"
                        value={course.subject}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Course Duration</label>
                    <input
                        type="text"
                        name="course_duration"
                        value={course.course_duration}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Class Duration</label>
                    <input
                        type="text"
                        name="class_duration"
                        value={course.class_duration}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Total Classes</label>
                    <input
                        type="number"
                        name="total_classes"
                        value={course.total_classes}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Class Timing</label>
                    <input
                        type="text"
                        name="class_timing"
                        value={course.class_timing}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Fee</label>
                    <input
                        type="number"
                        name="fee"
                        value={course.fee}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Platform</label>
                    <input
                        type="text"
                        name="platform"
                        value={course.platform}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Course Start Date</label>
                    <input
                        type="date"
                        name="course_start_date"
                        value={course.course_start_date}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Gender</label>
                    <input
                        type="text"
                        name="gender"
                        value={course.gender}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Update Course
                </button>
            </form>
        </div>
    );
};

export default EditCoursePage;
