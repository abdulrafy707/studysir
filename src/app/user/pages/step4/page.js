'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupStep4() {
  const [qualification, setQualification] = useState('');
  const [university, setUniversity] = useState('');
  const [experience, setExperience] = useState('');
  const [languages, setLanguages] = useState('');
  const [subjects, setSubjects] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get('email') || '');
  }, []);

  const handleEducationalDetails = async () => {
    if (!qualification || !university || !experience || !languages || !subjects) {
      setError('All fields are required.');
      return;
    }

    if (isNaN(experience)) {
      setError('Experience must be numeric.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/student_teacher_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'save_educational_details',  // Ensure the action is being sent properly
          email,
          qualification,
          university,
          experience,
          languages,
          subjects,
        }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok && data.success) {
        // Redirect to the login page after successfully saving educational details
        router.push(`/user/pages/login`);
      } else {
        setError(data.error || 'An error occurred.');
        console.error('Error from server:', data.error || 'Unknown error');
      }
    } catch (err) {
      setError('Error connecting to server.');
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Educational Details (Step 4)</h1>
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your qualification"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Enter your university"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Enter your experience in years"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Enter the languages you speak (comma separated)"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Enter the subjects you teach (comma separated)"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleEducationalDetails}
          disabled={loading}
          className={`w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-200 ${
            loading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
