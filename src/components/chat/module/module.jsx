import React, { useEffect, useState } from "react";
import { ref, get, push, set, onValue } from "firebase/database";
import { auth, db } from "../../../database/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "../../../layout/sidebar/sidebar";
import Navbar from "../../../layout/navbar/navbar";
import { useNavigate } from "react-router-dom";
import { ArrowRotateLeft } from "iconsax-react";

export default function ChatPage() {
  const navigate = useNavigate();

  // ==============================
  // ALL HOOKS AT THE TOP ✅
  // ==============================

  // PROTEKSI LOGIN
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [mitraData, setMitraData] = useState(null);

  // MODE: "customer" atau "mitra"
  const [mode, setMode] = useState("customer");

  // CUSTOMER MODE STATE
  const [jobId, setJobId] = useState("");
  const [userId, setUserId] = useState("");
  const [mitraId, setMitraId] = useState("");
  const [customerChatList, setCustomerChatList] = useState([]);
  const [selectedCustomerChat, setSelectedCustomerChat] = useState(null);
  const [showCreateChatForm, setShowCreateChatForm] = useState(false);

  // MITRA MODE STATE
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // SHARED STATE
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

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

      const mitraSnap = await get(ref(db, `mitra/${user.uid}`));
      if (mitraSnap.exists()) {
        setMitraData(mitraSnap.val());
      } else {
        setMitraData(null);
      }

      setIsAuthChecked(true);
    });

    return () => unsub();
  }, [navigate]);

  // LISTENER CHAT LIST (untuk mitra mode)
  useEffect(() => {
    if (mode !== "mitra" || !currentUser?.uid) {
      return;
    }

    console.log("Setting up chat list listener for mitra:", currentUser.uid);
    const chatListRef = ref(db, `chat/${currentUser.uid}`);

    const unsubscribe = onValue(
      chatListRef,
      (snapshot) => {
        const list = [];

        snapshot.forEach((child) => {
          const chatData = child.val();
          list.push({
            chatKey: child.key,
            path: `chat/${currentUser.uid}/${child.key}`,
            ...chatData,
          });
        });

        list.sort(
          (a, b) => (b.last_message_at || 0) - (a.last_message_at || 0)
        );

        setChatList(list);
      },
      (error) => {
        console.error("Error listening to chat list:", error);
      }
    );

    return () => unsubscribe();
  }, [mode, currentUser?.uid]);

  // LISTENER CUSTOMER CHAT LIST
  useEffect(() => {
    if (mode !== "customer" || !currentUser?.uid) {
      return;
    }

    console.log("Setting up customer chat list listener");
    const chatRef = ref(db, "chat");

    const unsubscribe = onValue(
      chatRef,
      (snapshot) => {
        const list = [];

        snapshot.forEach((mitraSnapshot) => {
          const mitraId = mitraSnapshot.key;

          mitraSnapshot.forEach((chatSnapshot) => {
            const chatData = chatSnapshot.val();

            if (chatData.user_id === currentUser.uid) {
              list.push({
                chatKey: chatSnapshot.key,
                path: `chat/${mitraId}/${chatSnapshot.key}`,
                mitraId: mitraId,
                ...chatData,
              });
            }
          });
        });

        list.sort(
          (a, b) => (b.last_message_at || 0) - (a.last_message_at || 0)
        );

        console.log("Customer chats found:", list.length);
        setCustomerChatList(list);
      },
      (error) => {
        console.error("Error listening to customer chat list:", error);
      }
    );

    return () => unsubscribe();
  }, [mode, currentUser?.uid]);

  // LISTENER MESSAGES
  useEffect(() => {
    let messagePath = null;

    if (mode === "customer" && selectedCustomerChat) {
      messagePath = selectedCustomerChat.path;
    } else if (mode === "mitra" && selectedChat) {
      messagePath = selectedChat.path;
    }

    if (!messagePath) {
      setMessages([]);
      return;
    }

    console.log("Setting up message listener for:", messagePath);
    const messagesRef = ref(db, `${messagePath}/messages`);

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
  }, [mode, selectedCustomerChat, selectedChat]);

  if (!isAuthChecked) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  // ==============================
  // HANDLERS
  // ==============================

  const handleCreateChat = async () => {
    if (!jobId || !userId || !mitraId) {
      alert("Semua input wajib diisi!");
      return;
    }

    try {
      const chatKey = `${userId}__${jobId}`;
      const path = `chat/${mitraId}/${chatKey}`;
      const chatRef = ref(db, path);

      const snapshot = await get(chatRef);

      if (snapshot.exists()) {
        const existingChatData = snapshot.val();
        const existingChat = {
          chatKey: chatKey,
          path: path,
          mitraId: mitraId,
          ...existingChatData,
        };

        setSelectedCustomerChat(existingChat);
        setShowCreateChatForm(false);
        setJobId("");
        setUserId("");
        setMitraId("");
        return;
      }

      const newChatData = {
        chat_id: chatKey,
        job_id: jobId,
        user_id: userId,
        mitra_id: mitraId,
        created_at: Date.now(),
        last_message_at: Date.now(),
      };

      await set(chatRef, newChatData);

      const newChat = {
        chatKey: chatKey,
        path: path,
        mitraId: mitraId,
        ...newChatData,
      };

      setCustomerChatList((prevList) => {
        const exists = prevList.some((chat) => chat.chatKey === chatKey);
        if (exists) {
          return prevList;
        }
        const newList = [newChat, ...prevList];
        return newList.sort(
          (a, b) => (b.last_message_at || 0) - (a.last_message_at || 0)
        );
      });

      setSelectedCustomerChat(newChat);
      setShowCreateChatForm(false);
      setJobId("");
      setUserId("");
      setMitraId("");
    } catch (error) {
      console.error("Error creating chat:", error);
      alert(`Gagal membuat chat: ${error.message}`);
    }
  };

  const handleSelectCustomerChat = (chat) => {
    setSelectedCustomerChat(chat);
    setText("");
    setReplyingTo(null);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setText("");
    setReplyingTo(null);
  };

  const sendMessage = async () => {
    if (!text.trim()) {
      return;
    }

    const targetPath =
      mode === "customer" ? selectedCustomerChat?.path : selectedChat?.path;

    if (!targetPath) {
      return;
    }

    try {
      const msgRef = push(ref(db, `${targetPath}/messages`));

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
      await set(ref(db, `${targetPath}/last_message_at`), Date.now());

      setText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Gagal mengirim pesan: " + error.message);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setSelectedCustomerChat(null);
    setSelectedChat(null);
    setMessages([]);
    setText("");
    setShowCreateChatForm(false);
    setReplyingTo(null);
  };

  const renderMessage = (msg, isMe, isMitra = false) => {
    const senderLabel = isMitra
      ? isMe
        ? "You (Mitra)"
        : "Customer"
      : isMe
      ? "You"
      : "Mitra";

    return (
      <div
        key={msg.id}
        className={`w-full mb-5 flex ${
          isMe ? "justify-end" : "justify-start"
        } group`}
      >
        <div className="max-w-[70%] flex items-start gap-2">
          {!isMe && (
            <button
              onClick={() => setReplyingTo(msg)}
              className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1"
              title="Reply"
            >
              <ArrowRotateLeft size={18} color="grey" variant="Bold" />
            </button>
          )}

          <div>
            <div
              className={`text-xs text-gray-400 mb-1 ${
                isMe ? "text-right" : "text-left"
              }`}
            >
              {senderLabel} •{" "}
              {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {msg.reply_to_message && (
              <div className="mb-2 px-3 py-2 bg-slate-100 border-l-4 border-slate-500 rounded">
                <p className="text-xs text-slate-600 font-semibold">
                  Membalas:
                </p>
                <p className="text-xs italic text-slate-700">
                  "{msg.reply_to_message.substring(0, 60)}..."
                </p>
              </div>
            )}

            <div
              className={`p-3 rounded-xl shadow-sm break-words ${
                isMe
                  ? "bg-slate-600 text-white rounded-tr-none"
                  : "bg-gray-200 text-gray-800 rounded-tl-none"
              }`}
            >
              {msg.message}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==============================
  // MAIN RENDER
  // ==============================

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeKey="chat" />

      <div className="flex-1 flex flex-col">
        <Navbar
          mitraPhoto={mitraData?.photo}
          mitraName={mitraData?.name || "Nama Perusahaan Belum Diisi"}
          mitraEmail={userData?.email || "Memuat..."}
        />

        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">Chat Panel</h1>

            {/* MODE TOGGLE */}
            <div className="flex gap-2">
              <button
                onClick={() => switchMode("customer")}
                className={`px-4 py-2 rounded ${
                  mode === "customer"
                    ? "bg-slate-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Mode Customer
              </button>
              <button
                onClick={() => switchMode("mitra")}
                className={`px-4 py-2 rounded ${
                  mode === "mitra"
                    ? "bg-slate-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Mode Mitra
              </button>
            </div>
          </div>

          {/* USER INFO */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-4">
            <p className="text-sm text-slate-800">
              <strong>Logged in as:</strong>{" "}
              {userData?.email || currentUser?.email}
            </p>
            <p className="text-sm text-slate-600">
              <strong>UID:</strong> {currentUser?.uid}
            </p>
            {mitraData && (
              <p className="text-sm text-slate-700">
                <strong>Mitra:</strong> {mitraData.name}
              </p>
            )}
            <p className="text-sm text-slate-500">
              <strong>Mode:</strong>{" "}
              {mode === "customer" ? "Customer" : "Mitra"}
            </p>
          </div>

          {/* CUSTOMER MODE */}
          {mode === "customer" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* LEFT: CHAT LIST */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded p-4 h-[600px] overflow-y-auto">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold text-lg">
                      My Chats ({customerChatList.length})
                    </h2>
                    <button
                      onClick={() => setShowCreateChatForm(true)}
                      className="px-3 py-1 bg-slate-600 text-white text-sm rounded hover:bg-slate-700"
                    >
                      + New
                    </button>
                  </div>

                  {customerChatList.length === 0 && (
                    <p className="text-gray-500 text-sm italic">
                      Belum ada chat. Klik "+ New" untuk membuat chat baru.
                    </p>
                  )}

                  {customerChatList.map((chat) => (
                    <div
                      key={chat.chatKey}
                      onClick={() => handleSelectCustomerChat(chat)}
                      className={`p-3 mb-2 rounded cursor-pointer border transition-all ${
                        selectedCustomerChat?.chatKey === chat.chatKey
                          ? "bg-slate-50 border-slate-300"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium text-sm">
                        Job: {chat.job_id}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        Mitra: {chat.mitra_id?.substring(0, 12)}...
                      </div>
                      {chat.last_message_at && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(chat.last_message_at).toLocaleString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: CHAT WINDOW OR CREATE FORM */}
              <div className="lg:col-span-2">
                {showCreateChatForm ? (
                  <div className="bg-white shadow rounded p-6 h-[600px]">
                    <h2 className="text-xl font-bold mb-4">Buat Chat Baru</h2>

                    <div className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Job ID
                        </label>
                        <input
                          className="w-full p-3 border rounded"
                          placeholder="Contoh: job-123"
                          value={jobId}
                          onChange={(e) => setJobId(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          User ID (Your ID / Customer ID)
                        </label>
                        <input
                          className="w-full p-3 border rounded"
                          placeholder="User ID"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Mitra ID (Tujuan Chat)
                        </label>
                        <input
                          className="w-full p-3 border rounded"
                          placeholder="Mitra ID"
                          value={mitraId}
                          onChange={(e) => setMitraId(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleCreateChat}
                          className="px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
                        >
                          Buat Chat
                        </button>
                        <button
                          onClick={() => setShowCreateChatForm(false)}
                          className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                ) : !selectedCustomerChat ? (
                  <div className="bg-white shadow rounded p-8 h-[600px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p className="text-lg mb-2">💬</p>
                      <p>Pilih chat dari daftar atau buat chat baru</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded p-4 h-[600px] flex flex-col">
                    {/* CHAT HEADER */}
                    <div className="border-b pb-3 mb-3">
                      <h3 className="font-semibold">
                        Job: {selectedCustomerChat.job_id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mitra: {selectedCustomerChat.mitra_id}
                      </p>
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto mb-4">
                      {messages.length === 0 && (
                        <p className="text-gray-500 text-center mt-8">
                          Belum ada pesan...
                        </p>
                      )}

                      {messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser?.uid;
                        return renderMessage(msg, isMe, false);
                      })}
                    </div>

                    {/* REPLYING TO INDICATOR */}
                    {replyingTo && (
                      <div className="bg-slate-50 border border-slate-300 rounded p-2 mb-2 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            Balas ke:
                          </p>
                          <p className="text-sm text-slate-600">
                            {replyingTo.message.substring(0, 50)}...
                          </p>
                        </div>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="text-slate-600 hover:text-slate-800 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* SEND MESSAGE */}
                    <div className="flex gap-3">
                      <input
                        className="flex-1 p-3 border rounded"
                        placeholder="Ketik pesan..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!text.trim()}
                        className="px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MITRA MODE */}
          {mode === "mitra" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* LEFT: CHAT LIST */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded p-4 h-[600px] overflow-y-auto">
                  <h2 className="font-semibold mb-3 text-lg">
                    Daftar Chat ({chatList.length})
                  </h2>

                  {chatList.length === 0 && (
                    <p className="text-gray-500 text-sm italic">
                      Belum ada chat masuk...
                    </p>
                  )}

                  {chatList.map((chat) => (
                    <div
                      key={chat.chatKey}
                      onClick={() => handleSelectChat(chat)}
                      className={`p-3 mb-2 rounded cursor-pointer border transition-all ${
                        selectedChat?.chatKey === chat.chatKey
                          ? "bg-slate-50 border-slate-300"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium text-sm truncate">
                        User: {chat.user_id?.substring(0, 12)}...
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Job: {chat.job_id}
                      </div>
                      {chat.last_message_at && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(chat.last_message_at).toLocaleString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: CHAT WINDOW */}
              <div className="lg:col-span-2">
                {!selectedChat ? (
                  <div className="bg-white shadow rounded p-8 h-[600px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p className="text-lg mb-2">💬</p>
                      <p>Pilih chat dari daftar untuk melihat pesan</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded p-4 h-[600px] flex flex-col">
                    {/* CHAT HEADER */}
                    <div className="border-b pb-3 mb-3">
                      <h3 className="font-semibold">
                        Chat dengan User:{" "}
                        {selectedChat.user_id.substring(0, 12)}...
                      </h3>
                      <p className="text-sm text-gray-500">
                        Job: {selectedChat.job_id}
                      </p>
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto mb-4">
                      {messages.length === 0 && (
                        <p className="text-gray-500 text-center mt-8">
                          Belum ada pesan...
                        </p>
                      )}

                      {messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser?.uid;
                        return renderMessage(msg, isMe, true);
                      })}
                    </div>

                    {/* REPLYING TO INDICATOR */}
                    {replyingTo && (
                      <div className="bg-slate-50 border border-slate-300 rounded p-2 mb-2 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            Balas ke:
                          </p>
                          <p className="text-sm text-slate-600">
                            {replyingTo.message.substring(0, 50)}...
                          </p>
                        </div>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="text-slate-600 hover:text-slate-800 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* SEND MESSAGE */}
                    <div className="flex gap-3">
                      <input
                        className="flex-1 p-3 border rounded"
                        placeholder="Balas pesan..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!text.trim()}
                        className="px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
