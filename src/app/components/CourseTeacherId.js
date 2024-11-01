'use client';
import { useState, useEffect } from 'react';
import { FaLanguage, FaCalendarAlt, FaChalkboardTeacher, FaDollarSign, FaClock } from 'react-icons/fa';
import { AiOutlineFileText } from 'react-icons/ai';

export default function CourseTeacherId() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editCourseId, setEditCourseId] = useState(null); // For editing
  const [editData, setEditData] = useState({}); // Hold data to be edited
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCoursesByTeacherId = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));

      if (!userData || !userData.id) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const teacherId = userData.id;
      try {
        const response = await fetch(`${baseUrl}/course_fetch_by_teacherID.php?teacher_id=${teacherId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const coursesData = await response.json();
        if (Array.isArray(coursesData) && coursesData.length > 0) {
          setCourses(coursesData);
        } else {
          setError('No courses available for this teacher.');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Error fetching courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesByTeacherId();
  }, [baseUrl]);

  const handleDelete = async (course_id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`${baseUrl}/course_fetch_by_teacherID.php`, {
        method: 'DELETE',
        body: JSON.stringify({ course_id }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        setCourses(courses.filter(course => course.course_id !== course_id));
      } else {
        setError(data.error || 'Failed to delete course.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
};

  const handleEdit = async (course_id) => {
    try {
      const response = await fetch(`${baseUrl}/course_fetch_by_teacherID.php`, {
        method: 'PUT',
        body: JSON.stringify({ course_id, ...editData }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        const updatedCourses = courses.map(course =>
          course.course_id === course_id ? { ...course, ...editData } : course
        );
        setCourses(updatedCourses);
        setShowModal(false); // Close the modal
      } else {
        setError(data.error || 'Failed to update course.');
      }
    } catch (error) {
      console.error('Error editing course:', error);
    }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openModal = (course) => {
    setEditCourseId(course.course_id);
    setEditData(course); // Set current course data to editData
    setShowModal(true); // Show modal
  };

  const closeModal = () => {
    setShowModal(false); // Hide modal
    setEditCourseId(null); // Reset editing state
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-8">
       <h1 className="text-2xl font-bold mb-4 text-start">Your Courses</h1>
      {courses.length > 0 ? (
        courses.map((course) => (
          <div key={course.course_id} className="bg-white border w-full md:w-[600px] rounded-lg shadow-lg p-4 my-4 relative text-sm sm:text-base">
            <h2 className="text-base sm:text-lg font-bold">{course.course_title || 'Course Title'}</h2>
            <p className="text-gray-700 mt-2 text-xs sm:text-sm">{course.description || 'No description available.'}</p>
            <div className="mt-4">
              <img
                src={course.poster_image ? `${baseUrl}/uploads/${course.poster_image}` : '/default-course.png'}
                alt="Course Banner"
                width={600}
                height={400}
                className="rounded-lg w-full h-auto"
              />
            </div>

            <div className="mt-4 grid grid-cols-6 gap-4 items-center">
              <div className="col-span-6 flex items-center space-x-2">
                <FaLanguage size={16} />
                <p className="font-bold text-xs sm:text-base">Language:</p>
                <p className="text-xs sm:text-base">{course.language || 'Not specified'}</p>
              </div>
              <div className="col-span-6 flex items-center space-x-2">
                <AiOutlineFileText size={16} />
                <p className="font-bold text-xs sm:text-base">Subject:</p>
                <p className="text-xs sm:text-base">{course.subject || 'Not specified'}</p>
              </div>
              <div className="col-span-6 flex items-center space-x-2">
                <FaCalendarAlt size={16} />
                <p className="font-bold text-xs sm:text-base">Course Duration:</p>
                <p className="text-xs sm:text-base">{course.course_duration || 'Not specified'}</p>
              </div>
              <div className="col-span-6 flex items-center space-x-2">
                <FaClock size={16} />
                <p className="font-bold text-xs sm:text-base">Class Timing:</p>
                <p className="text-xs sm:text-base">{course.class_timing || 'Not specified'}</p>
              </div>
              <div className="col-span-6 flex items-center space-x-2">
                <FaChalkboardTeacher size={16} />
                <p className="font-bold text-xs sm:text-base">Total Classes:</p>
                <p className="text-xs sm:text-base">{course.total_classes || 'Not specified'}</p>
              </div>
              <div className="col-span-6 flex items-center space-x-2">
                <FaDollarSign size={16} />
                <p className="font-bold text-xs sm:text-base">Fee:</p>
                <p className="text-xs sm:text-base">{course.fee ? `$${course.fee}` : 'Not specified'}</p>
              </div>
              <div className="col-span-6 flex items-center space-x-2">
                <p className="font-bold text-xs sm:text-base">Status:</p>
                <p className={`text-xs sm:text-base ${course.status.toLowerCase() === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                  {course.status || 'Inactive'}
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={() => handleDelete(course.course_id)} className="bg-red-500 text-white px-3 sm:px-4 py-2 text-xs sm:text-base rounded-lg hover:bg-red-600">
                Delete
              </button>
              <button onClick={() => openModal(course)} className="bg-yellow-500 text-white px-3 sm:px-4 py-2 text-xs sm:text-base rounded-lg hover:bg-yellow-600">
                Edit
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>No courses available for this teacher.</div>
      )}

      {/* Modal for editing */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Edit Course</h2>

              <input
                type="text"
                name="course_title"
                value={editData.course_title}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Course Title"
              />
              <textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Description"
              />
              <input
                type="text"
                name="language"
                value={editData.language}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Language"
              />
              <input
                type="text"
                name="subject"
                value={editData.subject}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Subject"
              />
              <input
                type="text"
                name="course_duration"
                value={editData.course_duration}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Course Duration"
              />
              <input
                type="text"
                name="class_duration"
                value={editData.class_duration}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Class Duration"
              />
              <input
                type="text"
                name="class_timing"
                value={editData.class_timing}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Class Timing"
              />
              <input
                type="number"
                name="total_classes"
                value={editData.total_classes}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Total Classes"
              />
              <input
                type="text"
                name="platform"
                value={editData.platform}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Platform"
              />
              <input
                type="number"
                name="fee"
                value={editData.fee}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Fee"
              />
              <input
                type="date"
                name="course_start_date"
                value={editData.course_start_date}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
                placeholder="Course Start Date"
              />
              <select
                name="status"
                value={editData.status}
                onChange={handleChange}
                className="border p-1 rounded w-full mb-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex justify-between mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-3 sm:px-4 py-2 text-xs sm:text-base rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEdit(editCourseId)}
                  className="bg-blue-500 text-white px-3 sm:px-4 py-2 text-xs sm:text-base rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
