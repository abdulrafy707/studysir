'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RequestMoneyPage = () => {
    const [rupees, setRupees] = useState(0); // Displays the rupees entered
    const [money, setMoney] = useState(0); // Displays the converted money
    const [receiptFile, setReceiptFile] = useState(null); // Holds the uploaded file
    const [studentId, setStudentId] = useState(null); // Stores student ID from localStorage
    const [purpose, setPurpose] = useState(''); // Holds the purpose for the request (e.g., books, courses)
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Holds snackbar message
    const [snackbarVisible, setSnackbarVisible] = useState(false); // Controls snackbar visibility

    // Fetch student ID from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'student') {
            setStudentId(user.id); // Set student ID if the user is a student
        } else {
            setSnackbarMessage('Error: User not found or not a student.');
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
        }
    }, []);

    // Handle file upload
    const handleFileUpload = (e) => {
        setReceiptFile(e.target.files[0]); // Set the selected file
    };

    // Handle rupees input and calculate money (1 rupee = 1 money)
    const handleRupeesChange = (e) => {
        const rupeesInput = parseFloat(e.target.value);
        setRupees(rupeesInput);
        setMoney(rupeesInput); // 1 rupee = 1 money
    };

    // Send request to the money request API
    const handleSendRequest = async () => {
        if (!receiptFile) {
            setSnackbarMessage('Please upload a receipt.');
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
            return;
        }

        if (!studentId) {
            setSnackbarMessage('Error: Student ID not available.');
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
            return;
        }

        if (!purpose) {
            setSnackbarMessage('Please enter the purpose for the request.');
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
            return;
        }

        const formData = new FormData();
        formData.append('student_id', studentId); // Use actual student ID
        formData.append('requested_amount', money); // Send the requested money amount
        formData.append('purpose', purpose); // Send the purpose of the money request
        formData.append('file', receiptFile); // Attach the receipt file

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/money_request_api.php`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Required to handle file upload
                },
            });

            if (response.data && response.data.success) {
                setSnackbarMessage('Money request sent successfully.');
            } else if (response.data && response.data.error) {
                setSnackbarMessage(response.data.error || 'Failed to send money request.');
            } else {
                setSnackbarMessage('Unexpected response from server.');
            }
        } catch (error) {
            setSnackbarMessage('Error while sending money request.');
        } finally {
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000); // Hide snackbar after 4 seconds
        }
    };

    return (
        <div className="min-h-screen text-black flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative z-50">
                <h2 className="text-xl font-bold mb-4">Request Money for Books, Courses, etc.</h2>
                
                {/* Enter Amount */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-semibold">Amount (Rupees)</label>
                    <input
                        type="number"
                        value={rupees}
                        onChange={handleRupeesChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter amount in Rupees"
                    />
                </div>
                
                {/* Converted Money */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-semibold">Equivalent Money</label>
                    <input
                        type="number"
                        value={money}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                    />
                </div>
                
                {/* Purpose of Request */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-semibold">Purpose</label>
                    <textarea
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Explain the purpose (e.g., to buy books, courses, or digital products)"
                        rows={3}
                    ></textarea>
                </div>

                {/* Upload Receipt */}
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-semibold">Upload Receipt</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end">
                    <button className="bg-red-500 text-white py-2 px-4 rounded mr-2" onClick={handleSendRequest}>
                        Send Request
                    </button>
                </div>
            </div>

            {/* Snackbar Notification */}
            {snackbarVisible && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-lg z-[9999]">
                    {snackbarMessage}
                </div>
            )}
        </div>
    );
};

export default RequestMoneyPage;
