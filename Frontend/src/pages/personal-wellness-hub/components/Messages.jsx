import React, { useEffect, useState, useRef } from "react";
import useAuth from "../../../hooks/useAuth";
import { io } from "socket.io-client";

const socket = io("http://localhost:9000");

const LONG_PRESS_DURATION = 550; // ms to detect long press

const Messages = () => {
  const { user } = useAuth(); // patient

  const [doctors, setDoctors] = useState([]);
  const [activeDoctorId, setActiveDoctorId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);

  // Delete menu popup state
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [selectedMsg, setSelectedMsg] = useState(null);

  // Long press timer
  const longPressTimer = useRef(null);

  /* ------------------------ helpers ------------------------ */

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  // patient viewing doctor messages → mark them as seen
  const markDoctorMessagesSeen = (msgs) => {
    if (!activeDoctorId || !Array.isArray(msgs) || msgs.length === 0) return;

    const unseenFromDoctor = msgs.filter((m) => {
      const fromDoctor = m.senderRole === "doctor";
      const notSeen = m.status !== "seen";
      const hasId = !!(m._id || m.id);
      return fromDoctor && notSeen && hasId;
    });

    if (unseenFromDoctor.length === 0) return;

    const messageIds = unseenFromDoctor.map((m) => m._id || m.id);

    socket.emit("message-seen", {
      messageIds,
      viewerId: user.id,          // patient seeing them
      otherUserId: activeDoctorId // doctor who sent them
    });
  };

  /* ----------------------------- SOCKET ----------------------------- */
  useEffect(() => {
    socket.emit("user-online", { userId: user.id, role: "patient" });

    const handleReceiveMessage = (msg) => {
      if (msg.patientId === user.id && msg.doctorId === activeDoctorId) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();

        // if this is a doctor message in the open chat, immediately mark seen
        if (msg.senderRole === "doctor") {
          markDoctorMessagesSeen([msg]);
        }
      }
    };

    const handleMessageDeleted = (msgId) => {
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
    };

    const handleStatusUpdate = ({ messageId, messageIds, status }) => {
      setMessages((prev) =>
        prev.map((m) => {
          const id = m._id || m.id;
          if (messageId && id === messageId) {
            return { ...m, status };
          }
          if (Array.isArray(messageIds) && messageIds.includes(id)) {
            return { ...m, status };
          }
          return m;
        })
      );
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message-deleted", handleMessageDeleted);
    socket.on("message-status-update", handleStatusUpdate);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message-deleted", handleMessageDeleted);
      socket.off("message-status-update", handleStatusUpdate);
    };
  }, [activeDoctorId, user.id]);

  /* ------------------------- LOAD DOCTORS --------------------------- */
  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:9000/api/doctors");
      const data = await res.json();
      setDoctors(data);
      if (data.length > 0) setActiveDoctorId(data[0]._id);
    })();
  }, []);

  /* -------------------------- LOAD MESSAGES ------------------------- */
  useEffect(() => {
    if (!activeDoctorId) return;

    (async () => {
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `http://localhost:9000/api/chat/thread?patientId=${user.id}&doctorId=${activeDoctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setMessages(data);
      setTimeout(() => {
        scrollToBottom();
        // patient opened this doctor chat → mark doctor messages seen
        markDoctorMessagesSeen(data);
      }, 50);
    })();
  }, [activeDoctorId, user.id]);

  /* -------------------------- SEND TEXT ----------------------------- */
  const handleSend = async () => {
    if (!text.trim()) return;

    const tempId = "tmp-" + Date.now();

    const optimistic = {
      id: tempId,
      senderRole: "patient",
      patientId: user.id,
      doctorId: activeDoctorId,
      text,
      createdAt: new Date().toISOString(),
      status: "sent", // single tick immediately
    };

    setMessages((prev) => [...prev, optimistic]);
    scrollToBottom();

    const messageText = text;
    setText("");

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch("http://localhost:9000/api/chat/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: activeDoctorId,
          text: messageText,
        }),
      });

      const saved = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? saved : m))
      );

      // now send over socket with real _id
      socket.emit("send-message", {
        ...saved,
        receiverId: activeDoctorId,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  /* ------------------------ SEND FILE ----------------------------- */
  const handleFileSend = async (file) => {
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    const tempId = "tmp-file-" + Date.now();

    const optimistic = {
      id: tempId,
      senderRole: "patient",
      patientId: user.id,
      doctorId: activeDoctorId,
      fileUrl: tempUrl,
      fileType: file.type,
      createdAt: new Date().toISOString(),
      status: "sent",
    };

    setMessages((p) => [...p, optimistic]);
    scrollToBottom();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", user.id);
    formData.append("doctorId", activeDoctorId);

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch("http://localhost:9000/api/chat/send-file", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const saved = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? saved : m))
      );

      socket.emit("send-message", {
        ...saved,
        receiverId: activeDoctorId,
      });
    } catch (err) {
      console.error("Failed to send file:", err);
    }
  };

  /* ---------------------- DELETE MESSAGE --------------------------- */
  const deleteMessage = async (mode) => {
    if (!selectedMsg) return;

    const token = localStorage.getItem("authToken");

    await fetch("http://localhost:9000/api/chat/delete-message", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageId: selectedMsg._id,
        mode, // "me" or "everyone"
      }),
    });

    if (mode === "me") {
      setMessages((prev) => prev.filter((m) => m._id !== selectedMsg._id));
    }

    if (mode === "everyone") {
      socket.emit("delete-message", {
        messageId: selectedMsg._id,
        doctorId: activeDoctorId,
      });
      setMessages((prev) => prev.filter((m) => m._id !== selectedMsg._id));
    }

    setShowMenu(false);
  };

  /* ---------------------- MESSAGE PRESS HANDLERS ------------------- */

  const handleRightClick = (e, msg) => {
    e.preventDefault();
    setSelectedMsg(msg);
    setMenuPos({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  const startLongPress = (msg, e) => {
    longPressTimer.current = setTimeout(() => {
      setSelectedMsg(msg);
      setMenuPos({ x: e.clientX, y: e.clientY });
      setShowMenu(true);
    }, LONG_PRESS_DURATION);
  };

  const cancelLongPress = () => {
    clearTimeout(longPressTimer.current);
  };

  /* ---------------------- FILE BUBBLE ----------------------------- */
  const renderFileBubble = (msg) => {
    const isPdf = msg.fileType === "application/pdf";
    const isImg = msg.fileType?.startsWith("image/");

    const bubbleColor =
      msg.senderRole === "patient"
        ? "bg-emerald-700 text-white"
        : "bg-gray-200 text-black";

    return (
      <div className={`inline-block p-2 rounded-lg ${bubbleColor} max-w-xs`}>
        {isImg && (
          <img src={msg.fileUrl} className="rounded max-h-64" alt="" />
        )}

        {isPdf && (
          <a
            href={"http://localhost:9000" + msg.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            📄 PDF Document
          </a>
        )}

        {!isImg && !isPdf && (
          <a
            href={"http://localhost:9000" + msg.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            📎 File
          </a>
        )}
      </div>
    );
  };

  /* ---------------------- TICKS RENDER ----------------------------- */
  const renderTicks = (status) => {
    if (!status) return null;

    if (status === "sent") {
      // single grey tick
      return <span className="ml-1 text-[10px] text-gray-500">✓</span>;
    }

    if (status === "delivered") {
      // double grey tick
      return <span className="ml-1 text-[10px] text-gray-500">✓✓</span>;
    }

    if (status === "seen") {
      // double blue tick
      return <span className="ml-1 text-[10px] text-blue-500">✓✓</span>;
    }

    return null;
  };

  const activeDoctor = doctors.find((d) => d._id === activeDoctorId);

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid cols-1 lg:grid-cols-3 gap-6">
        {/* ------------------- DOCTOR LIST ------------------- */}
        <aside className="lg:col-span-1">
          <div className="bg-beige p-4 rounded-lg mb-4">
            <h4 className="font-semibold">Your Doctors</h4>
          </div>

          {doctors.map((d) => (
            <div
              key={d._id}
              onClick={() => setActiveDoctorId(d._id)}
              className={`p-4 border rounded-lg cursor-pointer mb-3 ${
                activeDoctorId === d._id
                  ? "bg-emerald-50 border-emerald-600"
                  : "bg-white"
              }`}
            >
              <div className="font-semibold">{d.fullName}</div>
            </div>
          ))}
        </aside>

        {/* ------------------- CHAT WINDOW ------------------- */}
        <div className="lg:col-span-2 bg-beige p-6 rounded-lg">
          {activeDoctor && (
            <>
              <h3 className="font-semibold text-lg mb-3">
                {activeDoctor.fullName}
              </h3>

              <div
                ref={chatBoxRef}
                className="h-96 bg-white border rounded p-4 overflow-auto mb-4"
              >
                {messages.map((m) => {
                  const isMe = m.senderRole === "patient";
                  const time = new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={m._id || m.id}
                      className={`mb-4 ${isMe ? "text-right" : ""}`}
                      onContextMenu={(e) => handleRightClick(e, m)}
                      onMouseDown={(e) => startLongPress(m, e)}
                      onMouseUp={cancelLongPress}
                      onMouseLeave={cancelLongPress}
                    >
                      {m.fileUrl ? (
                        renderFileBubble(m)
                      ) : (
                        <div
                          className={`inline-block p-3 rounded ${
                            isMe
                              ? "bg-emerald-700 text-white"
                              : "bg-gray-200 text-black"
                          }`}
                        >
                          {m.text}
                        </div>
                      )}

                      <div
                        className={`text-xs text-gray-500 mt-1 flex items-center ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span>{time}</span>
                        {isMe && renderTicks(m.status)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* POPUP MENU */}
              {showMenu && (
                <div
                  className="absolute bg-white shadow-lg rounded border p-2 z-50"
                  style={{ top: menuPos.y, left: menuPos.x }}
                >
                  <button
                    onClick={() => deleteMessage("me")}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    Delete for Me
                  </button>
                  <button
                    onClick={() => deleteMessage("everyone")}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Delete for Everyone
                  </button>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* INPUT SECTION */}
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-3 py-2 bg-gray-200 rounded"
                >
                  📎
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFileSend(e.target.files[0])}
                />

                <input
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-emerald-700 text-white rounded"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Messages;
