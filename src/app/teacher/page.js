'use client';
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PostTuition from "../components/PostTuition";
import JobCard from "../components/JobCard";
import CourseCard from "../components/Get_courses";
import EbookCard from "../components/EbookCard";
import TeacherCard from "../components/Teachercard"; // Assuming Teachercard renders individual teacher
import { ThreeDots } from 'react-loader-spinner'; // Import the spinner

export default function Home() {
  const [combinedRecords, setCombinedRecords] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Helper function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobPostsRes, coursesRes, ebooksRes, teachersRes] = await Promise.all([
          fetch(`${baseUrl}/studentpost_api.php`),
          fetch(`${baseUrl}/get_courses_api.php`),
          fetch(`${baseUrl}/ebook_api.php`),
          fetch(`${baseUrl}/teacher_api.php`),
        ]);

        // Parse the responses into JSON
        const jobPosts = await jobPostsRes.json();
        const courses = await coursesRes.json();
        const ebooks = await ebooksRes.json();
        const teachers = await teachersRes.json();

        // Combine all the data into a single array with type identifiers
        const combinedData = [
          ...jobPosts.map(post => ({ ...post, type: 'job', id: post.post_id || post.id })),
          ...courses.map(course => ({ ...course, type: 'course', id: course.course_id || course.id })),
          ...ebooks.map(ebook => ({ ...ebook, type: 'ebook', id: ebook.ebook_id || ebook.id })),
          ...teachers.map(teacher => ({ ...teacher, type: 'teacher', id: teacher.teacher_id || teacher.id }))
        ];

        // Filter out any possible duplicates
        const uniqueRecords = combinedData.filter(
          (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        );

        // Shuffle the array
        const shuffledRecords = shuffleArray(uniqueRecords);

        // Update state
        setCombinedRecords(shuffledRecords);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, [baseUrl]);

  // Show the loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#3498db"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex">
        <div className="w-4/5 flex flex-col items-start justify-start space-y-4 mt-4">
          <div className="w-full">
            {/* <PostTuition /> */}
          </div>

          <div className="w-full space-y-4">
            {combinedRecords.map((record, index) => {
              if (record.type === 'job') {
                return <JobCard key={index} post={record} />;
              } else if (record.type === 'course') {
                return <CourseCard key={index} course={record} />;
              } else if (record.type === 'ebook') {
                return <EbookCard key={index} ebook={record} />;
              } else if (record.type === 'teacher') {
                return <TeacherCard key={index} teacher={record} baseUrl={baseUrl} />;
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
