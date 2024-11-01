'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ResetPassword() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError('Invalid or missing token.');
        }
    }, []);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/student_teacher_api.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    action: 'reset_password',
                    token: token,
                    new_password: newPassword
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage(data.success);
                setTimeout(() => {
                    router.push('/user/pages/login');
                }, 3000);
            } else {
                setError(data.error || 'An error occurred.');
            }
        } catch (err) {
            setError('An error occurred while resetting the password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-black flex justify-center items-center bg-gray-100">
            {/* Mobile View */}
            <div className="block md:hidden w-full max-w-sm p-8 bg-white shadow-lg rounded-lg relative">
                <div className="absolute top-0 left-0 w-full flex justify-between">
                    <Image src="/left.png" alt="Left Wave" width={160} height={100} className="h-[150px]" />
                    <Image src="/right.png" alt="Right Wave" width={160} height={100} className="h-[150px]" />
                </div>

                <div className="text-center mt-16">
                    <h1 className="text-4xl font-bold text-blue-500">StudySir</h1>
                </div>

                <h2 className="text-center text-blue-500 font-semibold text-2xl mt-8">Reset Password</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {message && <p className="text-green-500 text-center mb-4">{message}</p>}

                <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
                    <div>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full px-4 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full px-4 py-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-600 transition duration-200"
                    >
                        {loading ? 'Resetting...' : 'Set New Password'}
                    </button>
                </form>

                <div className="mt-8 flex justify-center">
                    <Image src="/login.png" alt="Reset Password Bottom Image" width={150} height={150} className="w-[200px] h-[200px]" />
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="relative w-1/2 overflow-hidden">
                    <Image
                        src="/image1.png"
                        alt="Reset Password Illustration"
                        layout="fill"
                        objectFit="cover"
                        className="object-cover"
                    />
                </div>

                <div className="w-1/2 p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">Reset Password</h2>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    {message && <p className="text-green-500 mb-4 text-center">{message}</p>}

                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border border-blue-500 w-full py-2 px-4 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        {loading ? 'Resetting...' : 'Set New Password'}
                    </button>
                </div>
            </div>
        </div>
    );
}
