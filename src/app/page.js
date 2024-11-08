'use client';

import { useEffect, useState } from "react";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from "./components/Header";
import Banner from './components/Banner';
import JobCard from "./components/JobCard";
import CourseCard from './components/Get_courses';
import EbookCard from './components/EbookCard';
import TeacherCard from "./components/Teachercard";
import { ThreeDots } from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

        toast.success('Data loaded successfully!', {
          className: 'bg-green-600 text-white',
          bodyClassName: 'text-sm',
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
        toast.error('Failed to load data. Please try again later.', {
          className: 'bg-red-600 text-white',
          bodyClassName: 'text-sm',
        });
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
    <Provider store={store}>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />

      <div className="w-full flex flex-col items-center justify-center space-y-4 sm:p-4 px-4 py-8 sm:px-0">
        {/* Banner is hidden on small screens and visible on medium and larger screens */}
        <div className="w-full hidden sm:block">
          <Banner />
        </div>

        {/* Content container with negative margin to pull it closer to the banner */}
        <div className="w-full max-w-2xl space-y-3 sm:mt-[-1rem] sm:p-4">
          {combinedRecords.map((record, index) => {
            if (record.type === 'job') return <JobCard key={index} post={record} />;
            if (record.type === 'course') return <CourseCard key={index} course={record} />;
            if (record.type === 'ebook') return <EbookCard key={index} ebook={record} />;
            if (record.type === 'teacher') return <TeacherCard key={index} teacher={record} baseUrl={baseUrl} />;
            return null;
          })}
        </div>
      </div>
    </Provider>
  );
}
