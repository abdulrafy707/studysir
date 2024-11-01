'use client';
import { useState, useEffect } from 'react';

export default function ChatInterface() {
  const [conversations, setConversations] = useState([]);
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [teacherDetails, setTeacherDetails] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (err) {
        setError("Invalid user data. Please log in again.");
      }
    } else {
      setError("User not logged in. Please log in to access chats.");
    }
  }, []);

  useEffect(() => {
    const fetchAllChatRooms = async () => {
      if (!userData || !userData.id || !userData.role) return;
      const userType = userData.role === "teacher" ? 2 : 1;
      const formData = new FormData();
      formData.append('id', userData.id);
      formData.append('typee', userType);

      try {
        const response = await fetch(`${baseUrl}/get_all_chatrooms.php`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData,
        });
        const text = await response.text();
        const result = JSON.parse(text);
        if (result.status === "success") {
          setConversations(result.all_chat_rooms || []);
        } else {
          setError(result.message || "Failed to fetch chat rooms.");
        }
      } catch {
        setError("Failed to fetch chat rooms.");
      }
    };

    fetchAllChatRooms();
  }, [baseUrl, userData]);

  useEffect(() => {
    let pollingInterval = null;
    const fetchMessages = async (roomid) => {
      if (!roomid) return;
      setMessages([]);
      const formData = new FormData();
      formData.append('roomid', roomid);

      try {
        const response = await fetch(`${baseUrl}/fetch_msg_api.php`, {
          method: 'POST',
          body: formData,
        });
        const text = await response.text();
        const lastBraceIndex = text.lastIndexOf('}');
        const jsonString = text.substring(0, lastBraceIndex + 1);
        const result = JSON.parse(jsonString);

        if (result.status === "success") {
          setMessages(result.all_chats || []);
        } else {
          setError(result.message || "Failed to fetch messages.");
        }
      } catch {
        setError("Failed to fetch messages.");
      }
    };

    if (selectedChatroom) {
      fetchMessages(selectedChatroom.room_id);
      pollingInterval = setInterval(() => {
        fetchMessages(selectedChatroom.room_id);
      }, 4000);
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [selectedChatroom, baseUrl]);

  const handleChatroomSelect = (chatroom) => {
    setSelectedChatroom(chatroom);
    setTeacherDetails({ fullname: chatroom.fullname, image: chatroom.image });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedChatroom || !userData || !userData.id) return;

    const receiver_id = selectedChatroom.teacher_id === userData.id ? selectedChatroom.student_id : selectedChatroom.teacher_id;
    const formData = new FormData();
    formData.append('sender_id', userData.id);
    formData.append('receiver_id', receiver_id);
    formData.append('message', newMessage);
    formData.append('roomid', selectedChatroom.room_id);

    try {
      const response = await fetch(`${baseUrl}/send_api.php`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      const text = await response.text();
      const result = JSON.parse(text);

      if (result.status === "success") {
        setNewMessage('');
        const newMsg = {
          chat_id: result.chat_id || Date.now(),
          sender_id: userData.id,
          message: newMessage,
          sent_at: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, newMsg]);
      } else {
        setError(result.message || "Failed to send message.");
      }
    } catch {
      setError("Failed to send message.");
    }
  };

  const handleBack = () => {
    setSelectedChatroom(null);
    setTeacherDetails(null);
    setMessages([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50 flex items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-2 text-white font-bold">&times;</button>
        </div>
      )}

      {(!selectedChatroom || window.innerWidth >= 768) && (
        <div className="bg-white shadow-lg flex-shrink-0 w-full md:w-[300px] overflow-y-auto">
          <div className="sticky top-0 bg-blue-600 text-white px-4 py-2">
            <h2 className="text-lg font-bold">Chats</h2>
          </div>
          <div className="p-2">
            {conversations.length > 0 ? (
              conversations.map((chatroom) => (
                <div
                  key={chatroom.room_id}
                  className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${
                    selectedChatroom && selectedChatroom.room_id === chatroom.room_id ? 'bg-gray-200' : ''
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
      )}

      {selectedChatroom && (
        <div className="flex-1 flex flex-col w-full">
          <div className="sticky top-0 bg-blue-600 text-white px-4 py-2 flex items-center">
            <button className="md:hidden mr-2" onClick={handleBack}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.chat_id}
                  className={`flex ${message.sender_id === userData?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-[75%] ${
                      message.sender_id === userData?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
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

          <div className="sticky bottom-0 bg-gray-100 px-4 py-2 border-t">
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
                className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
                disabled={!newMessage.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.94 15.61l2.804-1.001A8.146 8.146 0 005.5 11c0-.774.106-1.523.308-2.224L2.94 7.775a.5.5 0 00-.94.218v6.797c0 .373.421.605.76.42zM10.897 3.071a8.004 8.004 0 014.868 3.246l-3.32 1.187a.5.5 0 00-.25.253L9.5 10l3.322 1.817a.5.5 0 00.25.253l3.32 1.187a8.004 8.004 0 01-4.868 3.246A7.999 7.999 0 013.224 4.897a7.998 7.998 0 017.673-1.826z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
