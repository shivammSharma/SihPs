import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import useAuth from "../../../hooks/useAuth";

const API_BASE = "http://localhost:9000";

const CommunicationTools = () => {
  const { user } = useAuth(); // doctor

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  /* -------------------------------------------------------
     1) FETCH DOCTOR’S CONVERSATIONS
  ------------------------------------------------------- */
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoadingConvos(true);
        const token = localStorage.getItem("authToken");

        const res = await fetch(
          `${API_BASE}/api/chat/doctor/me/conversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load conversations");

        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load conversations.");
      } finally {
        setLoadingConvos(false);
      }
    };

    fetchConversations();
  }, []);

  /* -------------------------------------------------------
     2) FETCH CHAT THREAD WHEN A PATIENT IS SELECTED
  ------------------------------------------------------- */
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const token = localStorage.getItem("authToken");

        const patientId = selectedConversation.patientId;

        const res = await fetch(
          `${API_BASE}/api/chat/thread?patientId=${patientId}&doctorId=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load messages");

        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load messages.");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  /* -------------------------------------------------------
     3) SELECT A CONVERSATION
  ------------------------------------------------------- */
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  /* -------------------------------------------------------
     4) SEND MESSAGE (Doctor → Patient)
  ------------------------------------------------------- */
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const token = localStorage.getItem("authToken");
    const patientId = selectedConversation.patientId;

    // Create optimistic temporary UI message
    const optimisticMessage = {
      id: "tmp-" + Date.now(),
      doctorId: user.id,
      patientId,
      senderRole: "doctor",
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/chat/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId,
          doctorId: user.id,
          text: optimisticMessage.text,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const saved = await res.json();

      // Replace optimistic message with actual one
      setMessages((prev) =>
        prev.map((msg) => (msg.id === optimisticMessage.id ? saved : msg))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to send message");

      // Remove optimistic message if failed
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
    }
  };

  /* -------------------------------------------------------
     5) HELPERS
  ------------------------------------------------------- */
  const filteredConversations = conversations.filter((c) =>
    c.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (t) => {
    const time = new Date(t);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusColor = (s) =>
    s === "online" ? "bg-success" : "bg-muted";

  const getPriorityColor = () => "border-l-primary bg-primary/5";

  /* -------------------------------------------------------
     6) UI
  ------------------------------------------------------- */
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">
            Communication Tools
          </h2>
          <p className="text-text-secondary">Secure messaging & coordination</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL: LIST OF PATIENTS */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border organic-shadow">

            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Messages</h3>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-border">
              {loadingConvos && (
                <p className="p-3 text-sm text-text-secondary">Loading...</p>
              )}

              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 cursor-pointer border-l-4 ${getPriorityColor(
                    conv.priority
                  )} ${
                    selectedConversation?.id === conv.id ? "bg-muted/40" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={conv.patient.avatar}
                        className="w-10 h-10 rounded-full"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                          conv.patient.status
                        )}`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{conv.patient.name}</p>
                        {conv.unread > 0 && (
                          <span className="text-xs bg-primary px-2 py-1 rounded-full text-white">
                            {conv.unread}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-text-secondary truncate">
                        {conv.lastMessage}
                      </p>

                      <p className="text-xs text-text-secondary">
                        {formatTimestamp(conv.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {!loadingConvos && filteredConversations.length === 0 && (
                <p className="p-3 text-sm text-text-secondary">
                  No conversations found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: CHAT */}
        <div className="lg:col-span-2">
          {!selectedConversation ? (
            <div className="h-96 flex justify-center items-center border rounded-lg">
              <p>Select a patient to start chatting</p>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border organic-shadow h-96 flex flex-col">

              {/* HEADER */}
              <div className="p-4 border-b border-border flex justify-between">
                <div className="flex gap-3">
                  <img
                    src={selectedConversation.patient.avatar}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">
                      {selectedConversation.patient.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {selectedConversation.patient.dosha} •{" "}
                      {selectedConversation.patient.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {loadingMessages && (
                  <p className="text-sm text-text-secondary">Loading...</p>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg._id || msg.id}
                    className={`flex ${
                      msg.senderRole === "doctor"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-md ${
                        msg.senderRole === "doctor"
                          ? "bg-primary text-white"
                          : "bg-muted"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTimestamp(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT BAR */}
              <div className="p-4 border-t flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />

                <Button onClick={handleSend} iconName="Send">
                  Send
                </Button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationTools;
