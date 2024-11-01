'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ChatInterface() {
  const [conversations, setConversations] = useState([]);
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [toast, setToast] = useState(null); // State for toast notifications
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [userData, setUserData] = useState(null); // Manage userData as state

  // Initialize userData inside useEffect to ensure it's available on the client
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure window is available
      const storedUser = localStorage.getItem('user');
      console.log("Retrieved user from localStorage:", storedUser); // Debugging
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Parsed user data:", parsedUser); // Debugging
          setUserData(parsedUser);
        } catch (err) {
          console.error("Error parsing user data:", err);
          setError("Invalid user data. Please log in again.");
        }
      } else {
        console.error("No user data found in localStorage.");
        setError("User not logged in. Please log in to access chats.");
      }
    }
  }, []);

  // Fetch all chatrooms when userData or baseUrl changes
  useEffect(() => {
    const fetchAllChatRooms = async () => {
      if (!userData || !userData.id || !userData.role) {
        console.error("User not logged in or missing required fields");
        return;
      }

      const userType = userData.role === "teacher" ? 0 : 1;
      const formData = new FormData();
      formData.append('id', userData.id);
      formData.append('typee', userType);

      try {
        console.log("Fetching chatrooms with:", { id: userData.id, typee: userType }); // Debugging
        const response = await fetch(`${baseUrl}/get_all_chatrooms.php`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          console.error("Failed to fetch chat rooms. Status:", response.status);
          setError(`Error: ${response.statusText}`);
          return;
        }

        const result = await response.json();
        console.log("Fetched chat rooms:", result);

        if (result.status === "success") {
          setConversations(result.all_chat_rooms || []);
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.error("Error fetching chat rooms:", err);
        setError("Failed to fetch chat rooms.");
      }
    };

    fetchAllChatRooms();
  }, [baseUrl, userData]);

  // Fetch messages whenever selectedChatroom changes
  useEffect(() => {
    const fetchMessages = async (roomid) => {
      if (!roomid) {
        console.error("No room ID provided for fetching messages.");
        return;
      }

      setMessages([]); // Clear existing messages

      const formData = new FormData();
      formData.append('roomid', roomid);

      try {
        console.log(`Fetching messages for room ID: ${roomid}`); // Debugging
        const response = await fetch(`${baseUrl}/fetch_msg_api.php`, {
          method: 'POST',
          body: formData,
        });

        // Get the raw text response
        const text = await response.text();
        console.log("Raw response from fetch_msg_api.php:", text);

        // Sanitize the JSON response by trimming up to the last closing brace
        const lastBraceIndex = text.lastIndexOf('}');
        if (lastBraceIndex === -1) {
          throw new Error("Invalid JSON response: No closing brace found.");
        }

        const jsonString = text.substring(0, lastBraceIndex + 1);
        console.log("Sanitized JSON string:", jsonString);

        // Parse the sanitized JSON
        const result = JSON.parse(jsonString);
        console.log("Parsed messages:", result);

        if (result.status === "success") {
          setMessages(result.all_chats || []);
        } else {
          setError(result.message || "Failed to fetch messages.");
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to fetch messages.");
      }
    };

    if (selectedChatroom) {
      fetchMessages(selectedChatroom.room_id);
    }
  }, [selectedChatroom, baseUrl]);

  const handleChatroomSelect = (chatroom) => {
    console.log("Selected chatroom:", chatroom); // Debugging
    setSelectedChatroom(chatroom);
    setTeacherDetails({
      fullname: chatroom.fullname,
      image: chatroom.image,
    });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      console.warn("Attempted to send an empty message.");
      return;
    }

    if (!userData) {
      console.error("User data is missing.");
      setError("User not logged in.");
      return;
    }

    if (!selectedChatroom) {
      console.error("No chatroom selected.");
      setError("Please select a chatroom to send messages.");
      return;
    }

    const receiver_id = selectedChatroom.teacher_id === userData.id ? selectedChatroom.student_id : selectedChatroom.teacher_id;

    const formData = new FormData();
    formData.append('sender_id', userData.id);
    formData.append('receiver_id', receiver_id);
    formData.append('message', newMessage);
    formData.append('roomid', selectedChatroom.room_id);

    try {
      console.log("Sending message with data:", {
        sender_id: userData.id,
        receiver_id: receiver_id,
        message: newMessage,
        roomid: selectedChatroom.room_id,
      }); // Debugging

      const response = await fetch(`${baseUrl}/send_api.php`, {
        method: 'POST',
        body: formData,
      });

      // Get the raw text response
      const text = await response.text();
      console.log("Raw response from send_api.php:", text); // Debugging

      // Sanitize the JSON response by trimming up to the last closing brace
      const lastBraceIndex = text.lastIndexOf('}');
      if (lastBraceIndex === -1) {
        throw new Error("Invalid JSON response: No closing brace found.");
      }

      const jsonString = text.substring(0, lastBraceIndex + 1);
      console.log("Sanitized JSON string:", jsonString);

      // Parse the sanitized JSON
      const result = JSON.parse(jsonString);
      console.log("Send message response:", result);

      if (result.status === "success") {
        // Append the new message to the existing messages
        const newMsg = result.all_chats[result.all_chats.length - 1]; // Assuming the last message is the newly sent one
        setMessages((prevMessages) => [...prevMessages, newMsg]);
        setNewMessage('');
      } else {
        setError(result.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message.");
    }
  };

  const handleHireTeacher = async () => {
    if (!selectedChatroom || !userData) {
      console.error("No chatroom selected or user data missing");
      return;
    }

    const hireData = {
      student_id: userData.id,
      student_fullname: userData.fullname || "Student",
      teacher_id: selectedChatroom.teacher_id,
      post_id: selectedChatroom.post_id,
    };

    try {
      const response = await fetch(`${baseUrl}/hire_teacher_api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hireData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setToast({ message: "Teacher hired successfully.", type: "success" });
      } else {
        setToast({ message: result.error || "Failed to hire teacher.", type: "error" });
      }
    } catch (err) {
      console.error("Error hiring teacher:", err);
      setToast({ message: "Failed to hire teacher.", type: "error" });
    }
  };

  const handleRejectTeacher = async () => {
    if (!selectedChatroom || !userData) {
      console.error("No chatroom selected or user data missing");
      return;
    }

    const rejectData = {
      student_id: userData.id,
      student_fullname: userData.fullname || "Student",
      teacher_id: selectedChatroom.teacher_id,
      post_id: selectedChatroom.post_id,
    };

    try {
      const response = await fetch(`${baseUrl}/reject_teacher_api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rejectData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setToast({ message: "Teacher rejected successfully.", type: "success" });
      } else {
        setToast({ message: result.error || "Failed to reject teacher.", type: "error" });
      }
    } catch (err) {
      console.error("Error rejecting teacher:", err);
      setToast({ message: "Failed to reject teacher.", type: "error" });
    }
  };

  const handleBlockTeacher = async () => {
    if (!selectedChatroom) {
      console.error("No chatroom selected");
      return;
    }

    const formData = new FormData();
    formData.append('room_id', selectedChatroom.room_id);

    try {
      const response = await fetch(`${baseUrl}/block_api.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        setToast({ message: "Chat room blocked successfully.", type: "success" });
        setSelectedChatroom(null); // Go back to chat list after blocking
        // Optionally, refetch chatrooms to reflect the blocked room
        // fetchAllChatRooms(); // Uncomment if you have access to the function
      } else {
        setToast({ message: result.error || "Failed to block chat room.", type: "error" });
      }
    } catch (err) {
      console.error("Error blocking chat room:", err);
      setToast({ message: "Failed to block chat room.", type: "error" });
    }
  };

  const handleBack = () => {
    console.log("Navigating back to chatrooms list."); // Debugging
    setSelectedChatroom(null);
    setTeacherDetails(null);
    setMessages([]); // Clear messages when going back
    setError(''); // Clear any existing errors
  };

  const showToast = (message, type) => (
    <div className={`fixed top-4 right-4 bg-${type === "success" ? "green" : "red"}-500 text-white px-4 py-2 rounded shadow flex items-center`}>
      <span>{message}</span>
      <button onClick={() => setToast(null)} className="ml-2 text-white font-bold">&times;</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Display Error Message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50 flex items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-2 text-white font-bold">&times;</button>
        </div>
      )}

      {/* Chatrooms List Sidebar */}
      <div
        className={`bg-white shadow-lg overflow-hidden flex-shrink-0 flex flex-col w-full md:w-[300px]`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-blue-600 text-white px-4 py-2 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">Chats</h2>
        </div>

        {/* Conversations List */}
        <div className="p-2 flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((chatroom) => (
              <div
                key={chatroom.room_id} // Use unique identifier
                className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${
                  selectedChatroom && selectedChatroom.room_id === chatroom.room_id
                    ? 'bg-gray-200'
                    : ''
                }`}
                onClick={() => handleChatroomSelect(chatroom)}
              >
                <img
                  src={chatroom.image ? `${baseUrl}/uploads/${chatroom.image}` : '/default-profile.png'}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <p className="font-bold">{chatroom.fullname}</p>
                  <p className="text-xs text-gray-600">{chatroom.last_message}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No conversations available.</p>
          )}
        </div>
      </div>

      {/* Chatroom Messages Area */}
      {selectedChatroom ? (
        <div className="flex-1 flex flex-col">
          {/* Sticky Chatroom Header */}
          <div className="sticky top-0 bg-blue-600 text-white px-4 py-2 flex items-center z-10">
            <button
              className="md:hidden mr-2 focus:outline-none"
              onClick={handleBack}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center">
              <img
                src={teacherDetails?.image ? `${baseUrl}/uploads/${teacherDetails.image}` : '/default-profile.png'}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-3">
                <p className="font-bold">{teacherDetails?.fullname || 'Unknown Teacher'}</p>
                {/* Removed "Last seen" */}
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.chat_id} // Use unique identifier
                  className={`flex ${message.sender_id === userData.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-[75%] ${
                      message.sender_id === userData.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                  >
                    <p>{message.message}</p>
                    <p className="text-xs mt-1">{new Date(message.sent_at).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No messages in this chat yet.</p>
            )}
          </div>

          {/* Sticky Input and Action Buttons */}
          <div className="sticky bottom-0 bg-gray-100 px-4 py-2 z-10">
            {/* Input Field */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your message"
                className="flex-grow px-4 py-2 rounded-full border"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
                disabled={!newMessage.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.94 15.61l2.804-1.001A8.146 8.146 0 005.5 11c0-.774.106-1.523.308-2.224L2.94 7.775a.5.5 0 00-.94.218v6.797c0 .373.421.605.76.42zM10.897 3.071a8.004 8.004 0 014.868 3.246l-3.32 1.187a.5.5 0 00-.25.253L9.5 10l3.322 1.817a.5.5 0 00.25.253l3.32 1.187a8.004 8.004 0 01-4.868 3.246A7.999 7.999 0 013.224 4.897a7.998 7.998 0 017.673-1.826z" />
                </svg>
              </button>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex justify-between mt-2">
              <button onClick={handleHireTeacher} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Hire Teacher</button>
              <button onClick={handleRejectTeacher} className="bg-red-500 text-white px-4 py-2 rounded-lg">Reject</button>
              <button onClick={handleBlockTeacher} className="bg-red-500 text-white px-4 py-2 rounded-lg">Block</button>
              <button className="bg-red-400 text-white px-4 py-2 rounded-lg">Report</button>
            </div>
          </div>
        </div>
      ) : (
        // Placeholder when no chatroom is selected
        <div className="flex-1 flex items-center justify-center md:hidden">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      )}

      {/* Display Toast Notification */}
      {toast && showToast(toast.message, toast.type)}
    </div>
  );
}