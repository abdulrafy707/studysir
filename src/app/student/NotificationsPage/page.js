'use client';
import { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch the notifications when the component loads
  useEffect(() => {
    const fetchNotifications = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));

      if (!userData || !userData.id) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/fetch_notifications.php?user_id=${userData.id}`);
        const result = await response.json();

        if (result.success) {
          setNotifications(result.notifications);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [baseUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#3498db"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="h-screen text-black flex flex-col top-1 items-center justify-start bg-gray-100 py-2 px-4 sm:px-6 lg:px-8">
     
      {notifications.length > 0 ? (
        <div className="w-full space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.notification_id}
              className="bg-white w-full p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="text-gray-800 w-full sm:w-auto">
                <p>{notification.notification_message}</p>
                <p className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-8">
          <img src="/nonotification.png" alt="No Notifications" className="w-64 h-64 mb-4" />
          <p className="text-gray-500 text-center">No notifications available.</p>
        </div>
      )}
    </div>
  );
}
