import React, { useEffect, useState } from "react";
import { ref, get, push, set, onValue } from "firebase/database";
import { auth, db } from "../../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../../layout/sidebar/sidebar";
import Navbar from "../../../layout/navbar/navbar";
import { useNavigate } from "react-router-dom";
import { Send, MessageSquareMore, Clock, Plus, X } from "lucide-react";

export default function ChatPage() {
  const navigate = useNavigate();

  // ==============================
  // HOOKS
  // ==============================

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [mitraData, setMitraData] = useState(null);

  const [customerChatList, setCustomerChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // Form state
  const [jobId, setJobId] = useState("");
  const [mitraId, setMitraId] = useState("");
  const [formStep, setFormStep] = useState(1); // 1: input job_id, 2: input mitra_id

  // AUTH CHECK
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

      // Cek apakah user adalah mitra
      const mitraSnap = await get(ref(db, `mitra/${user.uid}`));
      if (mitraSnap.exists()) {
        setMitraData(mitraSnap.val());
      }

      setIsAuthChecked(true);
    });

    return () => unsub();
  }, [navigate]);

  // LISTENER CUSTOMER CHAT LIST - STRUKTUR: chat/{mitra_id}/{user_id}__{job_id}
  useEffect(() => {
    if (!currentUser?.uid || !mitraData?.id) return;

    setIsLoadingChats(true);
    const mitraIdFromData = mitraData.id || currentUser.uid;
    const chatRef = ref(db, `chat/${mitraIdFromData}`);

    const unsubscribe = onValue(
      chatRef,
      (snapshot) => {
        const list = [];
        const chatMap = new Map();

        snapshot.forEach((chatSnapshot) => {
          const chatData = chatSnapshot.val();
          const chatKey = chatSnapshot.key;

          // Filter hanya chat milik current user (customer)
          // chat key format: {user_id}__{job_id}
          if (chatKey.startsWith(currentUser.uid)) {
            // Deduplikasi
            if (!chatMap.has(chatKey)) {
              const chatObj = {
                chatKey: chatKey,
                path: `chat/${mitraIdFromData}/${chatKey}`,
                mitraId: mitraIdFromData,
                ...chatData,
              };
              chatMap.set(chatKey, chatObj);
              list.push(chatObj);
            }
          }
        });

        // Sort berdasarkan last_message_at
        list.sort(
          (a, b) => (b.last_message_at || 0) - (a.last_message_at || 0)
        );

        console.log("Customer chat list:", list);
        setCustomerChatList(list);
        setIsLoadingChats(false);
      },
      (error) => {
        console.error("Error listening to chat list:", error);
        setIsLoadingChats(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid, mitraData?.id]);

  // LISTENER MESSAGES
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

  const handleSearchChat = async () => {
    if (!jobId.trim() || !mitraId.trim()) {
      alert("Job ID dan Mitra ID wajib diisi!");
      return;
    }

    setIsCreatingChat(true);

    try {
      const chatKey = `${currentUser.uid}__${jobId.trim()}`;

      // Step 1: Cek apakah Mitra ID ada di database
      const mitraRef = ref(db, `mitra/${mitraId.trim()}`);
      const mitraSnapshot = await get(mitraRef);

      if (!mitraSnapshot.exists()) {
        alert("Mitra ID tidak ditemukan!");
        setIsCreatingChat(false);
        return;
      }

      // Step 2: Cek apakah chat sudah ada dengan mitra_id dan user_id__job_id
      const chatPath = `chat/${mitraId.trim()}/${chatKey}`;
      const chatRef = ref(db, chatPath);
      const chatSnapshot = await get(chatRef);

      if (chatSnapshot.exists()) {
        // Chat sudah ada, auto select
        const chatData = chatSnapshot.val();
        const existingChat = {
          chatKey: chatKey,
          path: chatPath,
          mitraId: mitraId.trim(),
          ...chatData,
        };

        setSelectedChat(existingChat);
        setShowCreateForm(false);
        resetForm();
        setIsCreatingChat(false);
        return;
      }

      // Chat belum ada, lanjut ke step 2 untuk confirm create
      setFormStep(2);
      setIsCreatingChat(false);
    } catch (error) {
      console.error("Error searching chat:", error);
      alert(`Gagal mencari chat: ${error.message}`);
      setIsCreatingChat(false);
    }
  };

  const handleCreateNewChat = async () => {
    if (!mitraId.trim()) {
      alert("Mitra ID wajib diisi!");
      return;
    }

    setIsCreatingChat(true);

    try {
      const chatKey = `${currentUser.uid}__${jobId.trim()}`;
      const chatPath = `chat/${mitraId.trim()}/${chatKey}`;

      const newChatData = {
        chat_id: chatKey,
        job_id: jobId.trim(),
        user_id: currentUser.uid,
        mitra_id: mitraId.trim(),
        created_at: Date.now(),
        last_message_at: Date.now(),
      };

      await set(ref(db, chatPath), newChatData);

      const newChat = {
        chatKey: chatKey,
        path: chatPath,
        mitraId: mitraId.trim(),
        ...newChatData,
      };

      setSelectedChat(newChat);
      setShowCreateForm(false);
      resetForm();
      setIsCreatingChat(false);
    } catch (error) {
      console.error("Error creating chat:", error);
      alert(`Gagal membuat chat: ${error.message}`);
      setIsCreatingChat(false);
    }
  };

  const resetForm = () => {
    setJobId("");
    setMitraId("");
    setFormStep(1);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setText("");
    setReplyingTo(null);
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
                {msg.reply_to_sender === currentUser.uid ? "Anda" : "Mitra"}
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
          mitraName={mitraData?.name || userData?.name || "User"}
          mitraEmail={userData?.email || "Email"}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="bg-white border-b border-gray-200 px-8 py-5">
            <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
            <p className="text-sm text-gray-500 mt-1">
              {customerChatList.length} percakapan aktif
            </p>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex flex-1 overflow-hidden">
            {/* CHAT LIST */}
            <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
              {/* NEW CHAT BUTTON */}
              <div className="border-b border-gray-200 p-4">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus size={18} />
                  Chat Baru
                </button>
              </div>

              {/* CHAT LIST */}
              <div className="flex-1 overflow-y-auto">
                {isLoadingChats ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-sm">Memuat chat...</p>
                  </div>
                ) : customerChatList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <MessageSquareMore
                      size={48}
                      className="text-gray-300 mb-3"
                    />
                    <p className="text-gray-500 text-sm">Belum ada chat</p>
                    <p className="text-gray-400 text-xs mt-2">
                      Klik "Chat Baru" untuk memulai
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {customerChatList.map((chat) => (
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
                              {chat.job_id}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              Chat ID: {chat.chatKey}
                            </p>
                          </div>
                          {chat.last_message_at && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 ml-2 flex-shrink-0">
                              <Clock size={12} />
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
              {showCreateForm ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Chat Baru
                      </h2>
                      <button
                        onClick={() => {
                          setShowCreateForm(false);
                          resetForm();
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    {formStep === 1 ? (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">
                          Masukkan Job ID dan Mitra ID untuk mencari atau
                          membuat chat
                        </p>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Job ID
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                            placeholder="Contoh: job-123"
                            value={jobId}
                            onChange={(e) => setJobId(e.target.value)}
                            disabled={isCreatingChat}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mitra ID
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                            placeholder="Masukkan Mitra ID"
                            value={mitraId}
                            onChange={(e) => setMitraId(e.target.value)}
                            disabled={isCreatingChat}
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={handleSearchChat}
                            disabled={
                              isCreatingChat || !jobId.trim() || !mitraId.trim()
                            }
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                          >
                            {isCreatingChat ? "Mencari..." : "Cari/Buat"}
                          </button>
                          <button
                            onClick={() => {
                              setShowCreateForm(false);
                              resetForm();
                            }}
                            disabled={isCreatingChat}
                            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-medium"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-yellow-800 font-medium">
                            Chat tidak ditemukan
                          </p>
                          <p className="text-xs text-yellow-700 mt-1">
                            Yakin ingin membuat chat baru dengan Job ID "{jobId}
                            " dan Mitra ID "{mitraId}"?
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Job ID
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                            value={jobId}
                            disabled
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mitra ID
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                            value={mitraId}
                            disabled
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={handleCreateNewChat}
                            disabled={isCreatingChat}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                          >
                            {isCreatingChat ? "Membuat..." : "Buat Chat"}
                          </button>
                          <button
                            onClick={() => {
                              setFormStep(1);
                              setJobId("");
                              setMitraId("");
                            }}
                            disabled={isCreatingChat}
                            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-medium"
                          >
                            Kembali
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : !selectedChat ? (
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
                  {/* CHAT HEADER */}
                  <div className="border-b border-gray-200 px-8 py-5 bg-white">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedChat.job_id}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Mitra: {mitraData?.name || "Unknown"}
                    </p>
                  </div>

                  {/* MESSAGES */}
                  <div className="flex-1 overflow-y-auto p-8">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageSquareMore
                          size={48}
                          className="text-gray-300 mb-3"
                        />
                        <p className="text-gray-500">Mulai percakapan</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Kirim pesan pertama Anda kepada mitra
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
                      Tekan Enter untuk mengirim
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
