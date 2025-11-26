import React, { useEffect, useState } from "react";
import { ref, get, push, set, onValue } from "firebase/database";
import { auth, db } from "../../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../../layout/sidebar/sidebar";
import Navbar from "../../../layout/navbar/navbar";
import { useNavigate } from "react-router-dom";
import { Send, MessageSquareMore, Clock, MapPin, Calendar } from "lucide-react";

export default function ChatPage() {
  const navigate = useNavigate();

  // ==============================
  // HOOKS
  // ==============================

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [mitraData, setMitraData] = useState(null);

  const [chatList, setChatList] = useState([]);
  const [chatDetailsMap, setChatDetailsMap] = useState({}); // Store customer & job details
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatDetails, setSelectedChatDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  // ==============================
  // UTILITY FUNCTIONS
  // ==============================

  const fetchCustomerData = async (userId) => {
    try {
      // Jika data customer sudah ada di chat node, gunakan itu
      if (selectedChat?.customer_data) {
        return selectedChat.customer_data;
      }

      // CEK MITRA DULU (karena mitra read: true, tidak perlu permission)
      const mitraRef = ref(db, `mitra/${userId}`);
      const mitraSnap = await get(mitraRef);

      if (mitraSnap.exists()) {
        // User ini adalah mitra, ambil data dari collection mitra
        const mitraData = mitraSnap.val();

        // Coba ambil email dari users (optional, jika permission allowed)
        let userEmail = null;
        try {
          const userRef = ref(db, `users/${userId}`);
          const userSnap = await get(userRef);
          if (userSnap.exists()) {
            userEmail = userSnap.val().email;
          }
        } catch (err) {
          console.log("Cannot read user email, using fallback");
        }

        return {
          id: userId,
          email: userEmail || "mitra@example.com",
          name: mitraData.name,
          phone_number: mitraData.phone_number,
          address: mitraData.address,
          city: mitraData.city,
          state: mitraData.state,
          country: mitraData.country,
          description: mitraData.description,
          photo: mitraData.photo,
          verified: mitraData.verified,
          type: "mitra",
        };
      }

      // Jika bukan mitra, coba akses users collection
      try {
        const userRef = ref(db, `users/${userId}`);
        const userSnap = await get(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.val();
          return {
            id: userId,
            email: userData.email,
            verified: userData.verified,
            created_at: userData.created_at,
            type: userData.userable_type || "customer",
            name: userData.email?.split("@")[0] || "Customer",
          };
        }
      } catch (userError) {
        console.warn("Cannot access user data:", userError.message);
      }

      // Fallback jika semua gagal
      return {
        id: userId,
        email: "customer@example.com",
        type: "unknown",
        name: "Customer",
      };
    } catch (error) {
      console.error("Error fetching customer data:", error);
      // Return fallback data jika ada error
      return {
        id: userId,
        email: "customer@example.com",
        type: "unknown",
        name: "Customer",
      };
    }
  };

  const fetchJobData = async (jobId) => {
    try {
      const jobRef = ref(db, `jobs/${jobId}`);
      const jobSnap = await get(jobRef);

      if (!jobSnap.exists()) return null;

      const jobData = jobSnap.val();
      return {
        id: jobId,
        title: jobData.title,
        category: jobData.category,
        location: jobData.location,
        description: jobData.description,
        deadline: jobData.deadline,
        budget: jobData.budget,
        status: jobData.status,
        created_at: jobData.created_at,
        ...jobData,
      };
    } catch (error) {
      console.error("Error fetching job data:", error);
      return null;
    }
  };

  const fetchChatDetails = async (chat) => {
    const cacheKey = `${chat.user_id}_${chat.job_id}`;

    // Jika sudah ada di cache, return dari cache
    if (chatDetailsMap[cacheKey]) {
      return chatDetailsMap[cacheKey];
    }

    const customerData = await fetchCustomerData(chat.user_id);
    const jobData = await fetchJobData(chat.job_id);

    const details = {
      customer: customerData,
      job: jobData,
    };

    setChatDetailsMap((prev) => ({
      ...prev,
      [cacheKey]: details,
    }));

    return details;
  };

  // ==============================
  // AUTH CHECK
  // ==============================

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      setCurrentUser(user);

      const userSnap = await get(ref(db, `users/${user.uid}`));
      if (userSnap.exists()) {
        setUserData(userSnap.val());
      }

      const mitraSnap = await get(ref(db, `mitra/${user.uid}`));
      if (mitraSnap.exists()) {
        setMitraData(mitraSnap.val());
      }

      setIsAuthChecked(true);
    });

    return () => unsub();
  }, [navigate]);

  // ==============================
  // LISTENER CHAT LIST
  // ==============================

  useEffect(() => {
    if (!currentUser?.uid) return;

    const chatListRef = ref(db, `chat/${currentUser.uid}`);

    const unsubscribe = onValue(
      chatListRef,
      async (snapshot) => {
        const list = [];

        for (const child of snapshot.val()
          ? Object.entries(snapshot.val())
          : []) {
          const [chatKey, chatData] = child;

          // Fetch details for each chat untuk preview
          const customerData = await fetchCustomerData(chatData.user_id);

          list.push({
            chatKey: chatKey,
            path: `chat/${currentUser.uid}/${chatKey}`,
            customerPreview:
              customerData?.name || customerData?.email || "Unknown",
            ...chatData,
          });
        }

        list.sort(
          (a, b) => (b.last_message_at || 0) - (a.last_message_at || 0)
        );

        setChatList(list);
        setIsLoadingChats(false);
      },
      (error) => {
        console.error("Error listening to chat list:", error);
        setIsLoadingChats(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // ==============================
  // LISTENER MESSAGES
  // ==============================

  useEffect(() => {
    if (!selectedChat?.path) {
      setMessages([]);
      return;
    }

    const messagesRef = ref(db, `${selectedChat.path}/messages`);

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        const list = [];

        snapshot.forEach((child) => {
          list.push({ id: child.key, ...child.val() });
        });

        list.sort((a, b) => a.created_at - b.created_at);
        setMessages(list);
      },
      (error) => {
        console.error("Error listening to messages:", error);
      }
    );

    return () => unsubscribe();
  }, [selectedChat?.path]);

  // ==============================
  // HANDLERS
  // ==============================

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    setText("");
    setReplyingTo(null);

    // Fetch customer & job details
    const details = await fetchChatDetails(chat);
    setSelectedChatDetails(details);
  };

  const sendMessage = async () => {
    if (!text.trim() || !selectedChat?.path) return;

    try {
      const msgRef = push(ref(db, `${selectedChat.path}/messages`));

      const messageData = {
        sender_id: currentUser.uid,
        message: text.trim(),
        created_at: Date.now(),
        ...(replyingTo && {
          reply_to_id: replyingTo.id,
          reply_to_message: replyingTo.message,
          reply_to_sender: replyingTo.sender_id,
        }),
      };

      await set(msgRef, messageData);
      await set(ref(db, `${selectedChat.path}/last_message_at`), Date.now());

      setText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Gagal mengirim pesan: " + error.message);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDeadline = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderMessage = (msg, isMe) => {
    return (
      <div
        key={msg.id}
        className={`flex mb-4 ${isMe ? "justify-end" : "justify-start"} group`}
      >
        <div className="max-w-xs lg:max-w-md xl:max-w-lg">
          {msg.reply_to_message && (
            <div className="mb-2 px-3 py-2 bg-gray-100 border-l-4 border-gray-400 rounded opacity-75">
              <p className="text-xs text-gray-600 font-medium">
                Balas ke{" "}
                {msg.reply_to_sender === currentUser.uid ? "Anda" : "Customer"}
              </p>
              <p className="text-xs text-gray-700 italic">
                "{msg.reply_to_message.substring(0, 40)}..."
              </p>
            </div>
          )}

          <div
            className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm break-words ${
                isMe
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.message}</p>
              <p
                className={`text-xs mt-1 ${
                  isMe ? "text-blue-100" : "text-gray-600"
                }`}
              >
                {formatTime(msg.created_at)}
              </p>
            </div>

            {!isMe && (
              <button
                onClick={() => setReplyingTo(msg)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-full"
                title="Balas"
              >
                <MessageSquareMore size={16} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthChecked) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeKey="chat" />

      <div className="flex-1 flex flex-col">
        <Navbar
          mitraPhoto={mitraData?.photo}
          mitraName={mitraData?.name || "Nama Perusahaan"}
          mitraEmail={userData?.email || "Email"}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="bg-white border-b border-gray-200 px-8 py-5">
            <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
            <p className="text-sm text-gray-500 mt-1">
              {chatList.length} percakapan aktif
            </p>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex flex-1 overflow-hidden">
            {/* CHAT LIST */}
            <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {isLoadingChats ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm">Memuat chat...</p>
                  </div>
                ) : chatList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <MessageSquareMore
                      size={48}
                      className="text-gray-300 mb-3"
                    />
                    <p className="text-gray-500 text-sm">
                      Belum ada chat masuk
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {chatList.map((chat) => (
                      <button
                        key={chat.chatKey}
                        onClick={() => handleSelectChat(chat)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          selectedChat?.chatKey === chat.chatKey
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {chat.customerPreview}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {selectedChatDetails?.job?.title || "Job Title"}
                            </p>
                          </div>
                          {chat.last_message_at && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 ml-2 flex-shrink-0">
                              <Clock size={12} />
                              {new Date().toDateString() ===
                              new Date(chat.last_message_at).toDateString()
                                ? formatTime(chat.last_message_at)
                                : formatDate(chat.last_message_at).split(
                                    " "
                                  )[0] +
                                  " " +
                                  formatDate(chat.last_message_at).split(
                                    " "
                                  )[1]}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CHAT WINDOW */}
            <div className="flex-1 flex flex-col bg-white">
              {!selectedChat ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <MessageSquareMore size={64} className="text-gray-300 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">
                    Pilih percakapan
                  </h2>
                  <p className="text-gray-500">
                    Pilih chat dari daftar untuk memulai
                  </p>
                </div>
              ) : (
                <>
                  {/* CHAT HEADER dengan CUSTOMER & JOB INFO */}
                  <div className="border-b border-gray-200 px-8 py-5 bg-gradient-to-r from-white to-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Customer Info */}
                        <div className="mb-4">
                          <h2 className="text-lg font-bold text-gray-900">
                            {selectedChatDetails?.customer?.name ||
                              selectedChatDetails?.customer?.email ||
                              "Customer"}
                          </h2>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                            {selectedChatDetails?.customer?.type ===
                              "mitra" && (
                              <>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  Mitra
                                </span>
                                {selectedChatDetails?.customer?.city && (
                                  <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    <span>
                                      {selectedChatDetails?.customer?.city}
                                      {selectedChatDetails?.customer?.country &&
                                        `, ${selectedChatDetails?.customer?.country}`}
                                    </span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Job Info */}
                        {selectedChatDetails?.job && (
                          <div className="p-4 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {selectedChatDetails?.job?.title ||
                                    "Job Title"}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {selectedChatDetails?.job?.category ||
                                    "Category"}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-600">
                              {selectedChatDetails?.job?.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  <span>
                                    {selectedChatDetails?.job?.location}
                                  </span>
                                </div>
                              )}
                              {selectedChatDetails?.job?.deadline && (
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  <span>
                                    Deadline:{" "}
                                    {formatDeadline(
                                      selectedChatDetails?.job?.deadline
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* MESSAGES */}
                  <div className="flex-1 overflow-y-auto p-8">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageSquareMore
                          size={48}
                          className="text-gray-300 mb-3"
                        />
                        <p className="text-gray-500">
                          Mulai percakapan dengan customer
                        </p>
                      </div>
                    ) : (
                      <div>
                        {messages.map((msg) => {
                          const isMe = msg.sender_id === currentUser?.uid;
                          return renderMessage(msg, isMe);
                        })}
                      </div>
                    )}
                  </div>

                  {/* REPLY INDICATOR */}
                  {replyingTo && (
                    <div className="px-8 py-3 bg-blue-50 border-t border-b border-blue-200 flex justify-between items-center">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-blue-900">
                          Balas ke pesan:
                        </p>
                        <p className="text-sm text-blue-800 truncate">
                          {replyingTo.message.substring(0, 60)}
                        </p>
                      </div>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="ml-3 text-blue-600 hover:text-blue-900 font-bold flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* INPUT */}
                  <div className="border-t border-gray-200 bg-white px-8 py-5">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                        placeholder="Ketik pesan..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && !e.shiftKey && sendMessage()
                        }
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!text.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
