'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BuyCoinsModal = ({ onClose, selectedPlan }) => {
    const [coins, setCoins] = useState(0); // Displays the number of coins
    const [receiptFile, setReceiptFile] = useState(null); // Holds the uploaded file
    const [teacherId, setTeacherId] = useState(null); // Stores teacher ID from localStorage
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Holds snackbar message
    const [snackbarVisible, setSnackbarVisible] = useState(false); // Controls snackbar visibility

    // Fetch teacher ID from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'teacher') {
            setTeacherId(user.id); // Set teacher ID if the user is a teacher
        } else {
            setSnackbarMessage('Error: User not found or not a teacher.');
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
        }

        // Set the coins value based on the selected plan, if available
        if (selectedPlan && selectedPlan.coins) {
            setCoins(selectedPlan.coins);
        }
    }, [selectedPlan]);

    // Handle file upload
    const handleFileUpload = (e) => {
        setReceiptFile(e.target.files[0]); // Set the selected file
    };

    // Send request to the coin request API
    const handleSendRequest = async () => {
        if (!receiptFile) {
            setSnackbarMessage('Please upload a receipt.');
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
            return;
        }

        if (!teacherId) {
            setSnackbarMessage('Error: Teacher ID not available.');
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
            return;
        }

        const formData = new FormData();
        formData.append('teacher_id', teacherId); // Use actual teacher ID
        formData.append('requested_amount', coins); // Send the number of coins
        formData.append('file', receiptFile); // Attach the receipt file

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/coin_request_api.php`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Required to handle file upload
                },
            });

            if (response.data && response.data.success) {
                setSnackbarMessage('Request sent successfully.');
            } else if (response.data && response.data.error) {
                setSnackbarMessage(response.data.error || 'Failed to send request.');
            } else {
                setSnackbarMessage('Unexpected response from server.');
            }
        } catch (error) {
            setSnackbarMessage('Error while sending request.');
        } finally {
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000); // Hide snackbar after 4 seconds
            onClose(); // Close modal after sending the request
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                {/* Conditional rendering to avoid undefined error */}
                <h2 className="text-xl font-bold mb-4">
                    Buy Coins - {selectedPlan ? selectedPlan.title : 'No Plan Selected'}
                </h2>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-semibold">Coins</label>
                    <input
                        type="number"
                        value={coins}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-semibold">Upload Receipt</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex justify-end">
                    <button className="bg-red-500 text-white py-2 px-4 rounded mr-2" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSendRequest}>
                        Send Request
                    </button>
                </div>
            </div>

            {/* Snackbar Notification */}
            {snackbarVisible && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
                    {snackbarMessage}
                </div>
            )}
        </div>
    );
};

export default BuyCoinsModal;
