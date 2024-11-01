'use client';

import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from "./components/Header";
import Banner from './components/Banner';
import JobCard from "./components/JobCard";
import CourseList from './components/Get_courses';
import EbookCard from './components/EbookCard';
import { ThreeDots } from 'react-loader-spinner';

export default function Home() {
  const [combinedPosts, setCombinedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [jobPostsResponse, coursesResponse, ebooksResponse] = await Promise.all([
          fetch(`${baseUrl}/studentpost_api.php`),
          fetch(`${baseUrl}/get_courses_api.php`),
          fetch(`${baseUrl}/ebook_api.php`)
        ]);

        if (!jobPostsResponse.ok || !coursesResponse.ok || !ebooksResponse.ok) {
          throw new Error("Error fetching data");
        }

        const jobPosts = await jobPostsResponse.json();
        const courses = await coursesResponse.json();
        const ebooks = await ebooksResponse.json();

        const combinedData = [
          ...jobPosts.map(post => ({ ...post, type: 'job' })),
          ...courses.map(course => ({ ...course, type: 'course' })),
          ...ebooks.map(ebook => ({ ...ebook, type: 'ebook' }))
        ];

        const shuffledPosts = shuffleArray(combinedData);
        setCombinedPosts(shuffledPosts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [baseUrl]);

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
    <Provider store={store}>
      <Header />

      <div className="w-full flex flex-col items-center justify-center space-y-4 mt-4 sm:mt-4 sm:p-4 px-4 py-8 sm:px-0">
        {/* Banner is hidden on small screens and visible on medium and larger screens */}
        <div className="w-full hidden sm:block">
          <Banner />
        </div>

        {/* Content container with responsive padding and margin adjustments */}
        <div className="w-full max-w-2xl space-y-4 mt-4 sm:mt-0 sm:p-4">
          {combinedPosts.map((post, index) => (
            <div key={index}>
              {post.type === 'job' && (
                <JobCard post={post} />
              )}
              {post.type === 'course' && (
                <CourseList course={post} />
              )}
              {post.type === 'ebook' && (
                <EbookCard ebook={post} />
              )}
            </div>
          ))}
        </div>
      </div>
    </Provider>
  );
}
