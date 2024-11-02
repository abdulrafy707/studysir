'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BuyCoinsModal = ({ onClose, selectedPlan }) => {
    const [coins, setCoins] = useState(0);
    const [teacherId, setTeacherId] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [receiptFile, setReceiptFile] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    // Fetch teacher ID from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'teacher') {
            setTeacherId(user.id);
        } else {
            setSnackbarMessage('Error: User not found or not a teacher.');
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
        }

        if (selectedPlan && selectedPlan.coins) {
            setCoins(selectedPlan.coins);
        }
    }, [selectedPlan]);

    // Fetch payment methods
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get(`https://studysir.m3xtrader.com/api/payment_methods_api.php`);
                if (response.data && response.data.status === 'success') {
                    setPaymentMethods(response.data.data);
                } else {
                    setSnackbarMessage('Failed to fetch payment methods.');
                    setSnackbarVisible(true);
                    setTimeout(() => setSnackbarVisible(false), 4000);
                }
            } catch (error) {
                setSnackbarMessage('Error fetching payment methods.');
                setSnackbarVisible(true);
                setTimeout(() => setSnackbarVisible(false), 4000);
            }
        };
        fetchPaymentMethods();
    }, []);

    // Handle file upload
    const handleFileUpload = (e) => {
        setReceiptFile(e.target.files[0]);
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
        formData.append('teacher_id', teacherId);
        formData.append('requested_amount', coins);
        formData.append('file', receiptFile);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/coin_request_api.php`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.success) {
                setSnackbarMessage('Request sent successfully.');
            } else {
                setSnackbarMessage(response.data.error || 'Failed to send request.');
            }
        } catch (error) {
            setSnackbarMessage('Error while sending request.');
        } finally {
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
            onClose();
        }
    };

    return (
        <div className="fixed text-black inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
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
                    <label className="block mb-1 text-sm font-semibold">Payment Methods</label>
                    <ul className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                        {paymentMethods.length ? (
                            paymentMethods.map((method) => (
                                <li key={method.id} className="mb-2">
                                    {method.account_type} - {method.account_no}
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">No payment methods available.</li>
                        )}
                    </ul>
                    <p className="mt-2 text-sm text-gray-600">
                        Please use any of the above payment methods to send the funds.
                    </p>
                </div>
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-semibold">Upload Receipt</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {receiptFile && (
                        <p className="text-sm text-gray-600 mt-2">
                            Uploaded file: {receiptFile.name}
                        </p>
                    )}
                </div>
                <div className="flex justify-end">
                    <button className="bg-red-500 text-white py-2 px-4 rounded mr-2" onClick={onClose}>
                        Close
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
