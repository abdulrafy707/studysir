'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [actionType, setActionType] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));

      if (!userData || !userData.id) {
        console.error('User not logged in');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/fetch_notifications.php?user_id=${userData.id}`);
        const result = await response.json();

        if (result.success) {
          setNotifications(result.notifications);

          // Log the details of each notification to check the data structure
          console.log("Fetched Notifications:", result.notifications);
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


  const handleAction = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
  
    if (!userData || !selectedNotification || !actionType) return;
  
    // Set "last_message" as "Join Course" instead of an empty string
    const chatroomData = new FormData();
    chatroomData.append("student_id", selectedNotification.student_id);
    chatroomData.append("teacher_id", userData.id);
    chatroomData.append("post_id", selectedNotification.post_id || null); // Optional post_id
    chatroomData.append("status", "active");
    chatroomData.append("last_message", "Join Course"); // Set last_message to "Join Course"
  
    try {
      // Call chatroom_api.php to create a new chat room
      console.log("Data being sent to chatroom_api.php:", Object.fromEntries(chatroomData));
      
      const chatroomResponse = await fetch(`${baseUrl}/chatroom_api.php`, {
        method: 'POST',
        body: chatroomData,
      });
  
      const chatroomResult = await chatroomResponse.json();
      console.log("Response from chatroom_api.php:", chatroomResult);
  
      if (chatroomResult.status === 'success' || chatroomResult.status === 'exists') {
        // Only proceed to handle the action (deduct coins) if the chat room is created or exists
        const postData = {
          teacher_id: userData.id,
          notification_id: selectedNotification.notification_id,
          amount: 150, // Deduct 150 coins for both actions
          action: actionType,
        };
  
        console.log("Data being sent to handle_accept_reject_request.php:", postData);
  
        const response = await fetch(`${baseUrl}/handle_accept_reject_request.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });
  
        const result = await response.json();
        console.log("Response from handle_accept_reject_request.php:", result);
  
        if (result.success) {
          toast.success(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)}ed successfully!`);
  
          // Redirect to the chat page
          const chatUrl = `/teacher/chat?teacher_id=${userData.id}&student_id=${selectedNotification.student_id}${
            selectedNotification.post_id ? `&post_id=${selectedNotification.post_id}` : `&post_id=null`
          }`;
          window.location.href = chatUrl;
  
          // Update notification status in the UI
          setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
              n.notification_id === selectedNotification.notification_id
                ? { ...n, status: actionType }
                : n
            )
          );
        } else {
          toast.error(`Error: ${result.error}`);
        }
      } else {
        // If chatroom creation fails, show an error
        toast.error(`Error creating chat room: ${chatroomResult.message}`);
      }
    } catch (error) {
      console.error(`Error performing ${actionType}:`, error);
      toast.error(`Error performing ${actionType}`);
    } finally {
      setShowPopup(false);
    }
  };

  

  const handleActionClick = (notification, action) => {
    setSelectedNotification(notification);
    setActionType(action);
    setShowPopup(true);
    // Log data when action is selected to inspect selected notification details
    console.log("Notification clicked for action:", notification);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container text-black mx-auto mt-8">
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.notification_id}
              className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center"
            >
              <div className="text-gray-800">
                <p>{notification.notification_message}</p>
                <p className="text-sm text-gray-500">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {!notification.is_read && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">New</span>
                )}

                {/* Show action buttons for 'hire_reque' and 'pending' statuses */}
                {notification.status === 'hire_reque' || notification.status === 'pending' ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      onClick={() => handleActionClick(notification, 'accept')}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      onClick={() => handleActionClick(notification, 'reject')}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      notification.status === 'accept' || notification.status === 'accepted'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-8">
          <img src="/nonotification.png" alt="No Notifications" className="w-64 h-64" />
          <p className="text-gray-500 mt-4">No notifications available.</p>
        </div>
      )}

      {/* Popup for confirmation */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
            <p>
              Are you sure you want to {actionType} this {selectedNotification.status === 'hire_reque' ? 'hire' : 'join'} request?
            </p>
            {actionType === 'accept' && (
              <p>150 coins will be deducted from your account.</p>
            )}
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-white hover:bg-opacity-80 ${
                  actionType === 'accept' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
                onClick={handleAction}
              >
                {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
