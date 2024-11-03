'use client'
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTuitionPost = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    job_title: '',
    job_description: '',
    required_gender: '',
    time_availability: '',
    fee_budget: '',
    languages: '',
    subjects: '',
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.id && userData.role === 'student') {
      setFormData((prev) => ({
        ...prev,
        student_id: userData.id, // Pre-fill student_id from user data
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const updatedFormData = {
      ...formData,
      languages: formData.languages.split(',').map((item) => item.trim()),
      subjects: formData.subjects.split(',').map((item) => item.trim()),
      status: 'active', // Ensure status is set to active
    };
  
    // Log the data being sent to the backend
    console.log("Data being sent to backend:", updatedFormData);
  
    try {
      const response = await fetch('https://studysir.m3xtrader.com/api/studentpost_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
  
      const data = await response.json();
  
      // Log the response data from the backend
      console.log("Response from backend:", data);
  
      if (data.success) {
        toast.success('Tuition post added successfully!');
  
        // Reset the form fields
        setFormData({
          student_id: formData.student_id, // Keep student ID intact
          job_title: '',
          job_description: '',
          required_gender: '',
          time_availability: '',
          fee_budget: '',
          languages: '',
          subjects: '',
        });
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('An error occurred while submitting the post.');
    }
  };
  

  return (
    <div className="container text-black mx-auto p-4 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Post a Tuition Ad</h2>

      {/* Form Fields */}
      <input
        type="text"
        name="job_title"
        placeholder="Job Title"
        value={formData.job_title}
        onChange={handleInputChange}
        className="w-full mb-4 p-2 border rounded"
      />
      <textarea
        name="job_description"
        placeholder="Job Description"
        value={formData.job_description}
        onChange={handleInputChange}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        name="required_gender"
        placeholder="Required Gender"
        value={formData.required_gender}
        onChange={handleInputChange}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        name="time_availability"
        placeholder="Time Availability"
        value={formData.time_availability}
        onChange={handleInputChange}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        name="fee_budget"
        placeholder="Fee Budget"
        value={formData.fee_budget}
        onChange={handleInputChange}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        name="subjects"
        placeholder="Subjects (comma-separated)"
        value={formData.subjects}
        onChange={handleInputChange}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        name="languages"
        placeholder="Languages (comma-separated)"
        value={formData.languages}
        onChange={handleInputChange}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Submit Button */}
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Post
      </button>

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default AddTuitionPost;
