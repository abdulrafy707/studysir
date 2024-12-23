'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RequestMoneyPage = () => {
    const [rupees, setRupees] = useState(0);
    const [money, setMoney] = useState(0);
    const [receiptFile, setReceiptFile] = useState(null);
    const [studentId, setStudentId] = useState(null);
    const [purpose, setPurpose] = useState('');
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    // Fetch student ID from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'student') {
            setStudentId(user.id);
        } else {
            setSnackbarMessage('Error: User not found or not a student.');
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
        }
    }, []);

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

    // Handle rupees input and calculate money (1 rupee = 1 money)
    const handleRupeesChange = (e) => {
        const rupeesInput = parseFloat(e.target.value);
        setRupees(rupeesInput);
        setMoney(rupeesInput);
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
        formData.append('student_id', studentId);
        formData.append('requested_amount', money);
        formData.append('purpose', purpose);
        formData.append('file', receiptFile);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/money_request_api.php`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.success) {
                setSnackbarMessage('Money request sent successfully.');
                setRupees(0);           // Reset rupees
                setMoney(0);            // Reset money
                setPurpose('');         // Reset purpose
                setReceiptFile(null);   // Clear uploaded file
            } else {
                setSnackbarMessage(response.data.error || 'Failed to send money request.');
            }
        } catch (error) {
            setSnackbarMessage('Error while sending money request.');
        } finally {
            setSnackbarVisible(true);
            setTimeout(() => setSnackbarVisible(false), 4000);
        }
    };

    return (
        <div className="min-h-screen text-black flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
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

                {/* Payment Methods */}
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

                {/* Upload Receipt */}
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
