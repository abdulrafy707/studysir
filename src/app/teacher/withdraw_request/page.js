'use client';
import { useState, useEffect } from 'react';

export default function WithdrawalRequestPage() {
  const [formData, setFormData] = useState({
    user_id: '',
    role: '',
    account_number: '',
    requested_amount: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://studysir.m3xtrader.com/api';

  // Fetch user_id and role from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && (user.role === 'student' || user.role === 'teacher')) {
      setFormData(prev => ({ ...prev, user_id: user.id, role: user.role }));
    } else {
      setError('Unable to retrieve user information.');
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Validate inputs
    if (!formData.account_number || !formData.requested_amount) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/withdrawal_api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Use URL-encoded form data
        },
        body: new URLSearchParams(formData).toString(),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message || 'Withdrawal request submitted successfully.');
        setFormData({
          ...formData,
          account_number: '',
          requested_amount: '',
        });
      } else {
        setError(data.error || 'An error occurred while submitting the withdrawal request.');
      }
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container text-black mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Withdrawal Request</h2>

      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        {/* Account Number */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Account Number</label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>

        {/* Requested Amount */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount to Withdraw</label>
          <input
            type="number"
            name="requested_amount"
            value={formData.requested_amount}
            onChange={handleInputChange}
            className="w-full border p-2 rounded-lg"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
