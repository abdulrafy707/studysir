'use client';
import { useState } from 'react';
// import EbookCard from '@/app/components/EbookCard';
import NewEbook from '@/app/components/NewEbook';
import TeacherEbookCard from '@/app/components/Get_teacher_ebook';

export default function Page() {
  const [isAddingEbook, setIsAddingEbook] = useState(false);

  const handleAddEbookClick = () => {
    setIsAddingEbook(true);
  };

  const handleCloseForm = () => {
    setIsAddingEbook(false); // Close the form after adding or cancelling
  };

  return (
    <div className="container mx-auto p-8">
      {/* Button to Add New Ebook */}
      {!isAddingEbook && (
        <button
          onClick={handleAddEbookClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          Add New Ebook
        </button>
      )}

      {/* Show the form if the "Add New Ebook" button is clicked */}
      {isAddingEbook && <NewEbook onCloseForm={handleCloseForm} />}

      {/* Render the EbookCard component */}
      {/* <EbookCard /> */}
      <TeacherEbookCard/>
    </div>
  );
}
