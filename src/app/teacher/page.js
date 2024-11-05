'use client';
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import PostTuition from "../components/PostTuition";
import JobCard from "../components/JobCard";
import CourseCard from "../components/Get_courses";
import EbookCard from "../components/EbookCard";
import TeacherCard from "../components/Teachercard";
import { ThreeDots } from 'react-loader-spinner';

export default function Home() {
  const [combinedRecords, setCombinedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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

        const parseJSON = async (response, label) => {
          const text = await response.text();
          console.log(`${label} raw response:`, text);

          const cleanText = text.replace(/<br\s*\/?>|<[^>]+>|Deprecated:.+/g, '').trim();

          try {
            return JSON.parse(cleanText);
          } catch (error) {
            console.error(`${label} did not return valid JSON.`);
            return [];
          }
        };

        const jobPosts = await parseJSON(jobPostsRes, "Job Posts");
        const courses = await parseJSON(coursesRes, "Courses");
        const ebooks = await parseJSON(ebooksRes, "Ebooks");
        const teachers = await parseJSON(teachersRes, "Teachers");

        const combinedData = [
          ...jobPosts.map(post => ({ ...post, type: 'job', id: post.post_id || post.id })),
          ...courses.map(course => ({ ...course, type: 'course', id: course.course_id || course.id })),
          ...ebooks.map(ebook => ({ ...ebook, type: 'ebook', id: ebook.ebook_id || ebook.id })),
          ...teachers.map(teacher => ({ ...teacher, type: 'teacher', id: teacher.teacher_id || teacher.id }))
        ];

        const uniqueRecords = combinedData.filter(
          (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        );

        setCombinedRecords(shuffleArray(uniqueRecords));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ThreeDots height="80" width="80" radius="9" color="#3498db" ariaLabel="three-dots-loading" visible={true} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <>
      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />
      
      <div className="flex justify-center">
        <div className="w-full md:w-4/5 flex flex-col items-center md:items-start justify-start space-y-4 mt-0 sm:mt-4">
          <div className="w-full space-y-3">
            {combinedRecords.map((record, index) => {
              console.log("Rendering record:", record);
              if (record.type === 'job') return <JobCard key={index} post={record} className="mx-auto" />;
              if (record.type === 'course') return <CourseCard key={index} course={record} className="mx-auto" />;
              if (record.type === 'ebook') return <EbookCard key={index} ebook={record} className="mx-auto" />;
              if (record.type === 'teacher') return <TeacherCard key={index} teacher={record} baseUrl={baseUrl} className="mx-auto" />;
              return null;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
