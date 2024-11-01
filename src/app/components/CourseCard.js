'use client';
import { useState, useEffect } from 'react';
import { FaLanguage, FaCalendarAlt, FaChalkboardTeacher, FaDollarSign, FaClock, FaRegThumbsUp, FaRegComment, FaQuestionCircle, FaEllipsisV } from 'react-icons/fa';
import { AiOutlineFileText } from 'react-icons/ai';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacher, setTeacher] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null); // To track which dropdown is open
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCoursesAndTeacher = async () => {
      try {
        // Fetch courses from the API
        const coursesResponse = await fetch(`${baseUrl}/courses_api.php`, {
          method: 'GET',
        });

        // Check if the response is OK
        if (!coursesResponse.ok) {
          throw new Error(`HTTP error! status: ${coursesResponse.status}`);
        }

        const coursesData = await coursesResponse.json();

        // Log the fetched courses for debugging purposes
        console.log('Fetched Courses Data:', coursesData);

        // Check if courses are available and set them in the state
        if (Array.isArray(coursesData) && coursesData.length > 0) {
          setCourses(coursesData);

          // Fetch the teacher info based on the teacher_id from the first course
          const teacher_id = coursesData[0].teacher_id;
          console.log('Fetching teacher for ID:', teacher_id);

          const teacherResponse = await fetch(`${baseUrl}/teacher_name_api.php?id=${teacher_id}`, {
            method: 'GET',
          });

          // Check if the teacher response is OK
          if (!teacherResponse.ok) {
            throw new Error(`HTTP error! status: ${teacherResponse.status}`);
          }

          const teacherData = await teacherResponse.json();
          console.log('Fetched Teacher Data:', teacherData);

          // Set the teacher data in the state
          setTeacher(teacherData);
        } else {
          setError('No courses available');
        }
      } catch (err) {
        console.error('Error connecting to server:', err);
        setError('Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndTeacher();
  }, [baseUrl]);

  // Function to save a course post
  const handleSavePost = async (courseId) => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.id) {
      console.error('User not logged in');
      return;
    }

    const postData = {
      user_id: userData.id,
      post_id: courseId,
      post_type: 'course', // Post type is 'course' here
    };

    try {
      const response = await fetch(`${baseUrl}/save_post_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      if (result.success) {
        alert('Course saved successfully!');
      } else {
        alert(`Error saving course: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  // Toggle dropdown menu for a specific course
  const toggleDropdown = (courseId) => {
    setDropdownOpen(dropdownOpen === courseId ? null : courseId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 w-[600px] gap-4"> {/* Reduced gap between lines */}
      {teacher && (
        <div className="mb-4 p-4 bg-white shadow-lg rounded-lg"> {/* Reduced margins */}
          <div className="flex items-center">
            <img
              src={teacher.image ? `${baseUrl}/uploads/${teacher.image}` : '/default-profile.png'}
              alt={teacher.fullname || 'Profile Picture'}
              width={100}
              height={100}
              className="rounded-full object-cover"
              style={{ width: '100px', height: '100px' }}
            />
            <div className="ml-4">
              <h2 className="text-xl font-bold">{teacher.fullname || 'Teacher Name'}</h2>
              <p className="text-gray-500">{teacher.address || 'Address not provided'}</p>
              <p className="text-gray-500">{teacher.city}, {teacher.country}</p>
            </div>
          </div>
        </div>
      )}

      {courses.map((course) => (
        <div key={course.course_id} className="bg-white border rounded-lg shadow-lg p-4 relative"> {/* Reduced gaps */}
          {/* Three dots icon with dropdown */}
          <div className="absolute top-4 right-4">
            <FaEllipsisV className="cursor-pointer" onClick={() => toggleDropdown(course.course_id)} />
            {dropdownOpen === course.course_id && (
              <div className="absolute right-0 bg-white shadow-md rounded-lg py-2">
                <button
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleSavePost(course.course_id)}
                >
                  Save Course
                </button>
              </div>
            )}
          </div>

          {/* Header with course title, status, and date */}
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <img
                src={teacher?.image ? `${baseUrl}/uploads/${teacher.image}` : '/default-profile.png'}
                alt={teacher?.fullname || 'Profile Picture'}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="ml-4">
                <h2 className="text-lg font-bold">{teacher?.fullname || 'Teacher Name'}</h2>
                <p className="text-gray-500">{teacher?.city}, {teacher?.country || 'Location not provided'}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-400">{course.created_at || 'Date not available'}</span>
              <div
                className={`${
                  course.status && course.status.toLowerCase() === 'active'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                } text-white text-sm rounded-full px-4 py-1 mt-1`}
              >
                {course.status || 'Inactive'}
              </div>
            </div>
          </div>

          {/* Course Title */}
          <h3 className="mt-2 text-xl font-bold">{course.course_title || 'Course Title'}</h3> {/* Adjusted margin */}

          {/* Course description */}
          <p className="text-gray-700 mt-1"> {/* Adjusted margin */}
            {course.description || 'No description available.'} <span className="text-blue-500">See More</span>
          </p>

          {/* Course Banner Image */}
          <div className="mt-2"> {/* Adjusted margin */}
            <img
              src={course.poster_image ? `${baseUrl}/uploads/${course.poster_image}` : '/default-course.png'}
              alt="Course Banner"
              width={600}
              height={400}
              className="rounded-lg"
            />
          </div>

          {/* Course Details with icons */}
          <div className="mt-2 grid grid-cols-6 gap-2 items-center"> {/* Reduced gaps */}
            <div className="col-span-6 flex items-center space-x-2">
              <FaLanguage size={20} />
              <p className="font-bold">Language:</p>
              <p>{course.language || 'Not specified'}</p>
            </div>
            <div className="col-span-6 flex items-center space-x-2">
              <AiOutlineFileText size={20} />
              <p className="font-bold">Subject:</p>
              <p>{course.subject || 'Not specified'}</p>
            </div>
            <div className="col-span-6 flex items-center space-x-2">
              <FaCalendarAlt size={20} />
              <p className="font-bold">Course Duration:</p>
              <p>{course.course_duration || 'Not specified'}</p>
            </div>
            <div className="col-span-6 flex items-center space-x-2">
              <FaClock size={20} />
              <p className="font-bold">Class Timing:</p>
              <p>{course.class_timing || 'Not specified'}</p>
            </div>
            <div className="col-span-6 flex items-center space-x-2">
              <FaChalkboardTeacher size={20} />
              <p className="font-bold">Total Classes:</p>
              <p>{course.total_classes || 'Not specified'}</p>
            </div>
            <div className="col-span-6 flex items-center space-x-2">
              <FaDollarSign size={20} />
              <p className="font-bold">Fee:</p>
              <p>{course.fee ? `$${course.fee}` : 'Not specified'}</p>
            </div>
          </div>

          {/* Buttons at the bottom */}
          <div className="mt-2 flex justify-between items-center"> {/* Reduced margin */}
            <div className="flex space-x-6">
              <button className="flex items-center text-gray-500 hover:text-blue-500">
                <FaRegThumbsUp size={20} />
                <span>{course.likes || '0'}</span>
              </button>

              <button className="flex items-center text-gray-500 hover:text-blue-500">
                <FaRegComment size={20} />
                <span>{course.reviews || '0'}</span>
              </button>

              <button className="flex items-center text-gray-500 hover:text-blue-500">
                <FaQuestionCircle size={20} />
                <span>{course.questions || '0'}</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
