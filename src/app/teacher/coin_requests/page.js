'use client';
import { useState } from 'react';
import axios from 'axios';

const CoinsPlansComponent = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Base URL for the API
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');

  const plans = [
    { id: 1, title: 'Basic Plan', amount: 100, description: 'Get 100 Coins for $10' },
    { id: 2, title: 'Pro Plan', amount: 500, description: 'Get 500 Coins for $45' },
    { id: 3, title: 'Ultimate Plan', amount: 1000, description: 'Get 1000 Coins for $80' },
  ];

  const handleRequestCoins = async (plan) => {
    const teacher_id = 1; // Replace with actual teacher ID from your auth state
    const bank_receipt_url = 'https://example.com/receipt.jpg'; // Replace with actual receipt URL

    try {
      const response = await axios.post(`${apiUrl}/coin_requests_api.php`, {
        teacher_id,
        requested_amount: plan.amount,
        bank_receipt_url,
      });

      if (response.data.success) {
        setSnackbarMessage(`Request for ${plan.title} sent successfully!`);
        setSnackbarType('success');
      } else {
        setSnackbarMessage(response.data.error || 'Failed to send request.');
        setSnackbarType('error');
      }
    } catch (error) {
      setSnackbarMessage('Error while sending request.');
      setSnackbarType('error');
    } finally {
      setSnackbarVisible(true);
      setTimeout(() => setSnackbarVisible(false), 5000); // Hide snackbar after 5 seconds
    }
  };

  return (
    <div className="min-h-screen text-black bg-gray-100 py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-8">Choose a Coin Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">{plan.title}</h2>
            <p className="text-gray-700 mb-4">{plan.description}</p>
            <span className="block mb-4 text-lg font-bold">${plan.amount / 10}</span>
            <button
              onClick={() => handleRequestCoins(plan)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {/* Snackbar */}
      {snackbarVisible && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 py-3 px-6 rounded shadow-md text-white ${
            snackbarType === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default CoinsPlansComponent;
