import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const Messages = () => {
  const { user } = useAuth(); // patient

  const [doctors, setDoctors] = useState([]);
  const [activeDoctorId, setActiveDoctorId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------------------------------------
     1) Load patient’s doctors from backend
  --------------------------------------------------------- */
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const token = localStorage.getItem("authToken");

        const res = await fetch("http://localhost:9000/api/chat/patient/my-doctors", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load doctors");

        const data = await res.json();
        setDoctors(data);

        if (data.length > 0) {
          setActiveDoctorId(data[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load doctors.");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  /* ---------------------------------------------------------
     2) Load chat thread for selected doctor
  --------------------------------------------------------- */
  useEffect(() => {
    if (!activeDoctorId) return;

    const fetchChat = async () => {
      try {
        setLoadingMessages(true);
        const token = localStorage.getItem("authToken");

        const res = await fetch(
          `http://localhost:9000/api/chat/thread?patientId=${user.id}&doctorId=${activeDoctorId}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
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

    fetchChat();
  }, [activeDoctorId]);

  /* ---------------------------------------------------------
     3) Send message (patient → doctor)
  --------------------------------------------------------- */
  const handleSend = async () => {
    if (!text.trim()) return;

    const optimisticMsg = {
      id: "tmp-" + Date.now(),
      patientId: user.id,
      doctorId: activeDoctorId,
      senderRole: "patient",
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setText("");

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch("http://localhost:9000/api/chat/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: activeDoctorId,
          text,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const saved = await res.json();

      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? saved : m))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    }
  };

  const activeDoctor = doctors.find((d) => d.id === activeDoctorId);

  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Doctor List */}
        <aside className="lg:col-span-1">
          <div className="bg-beige p-4 rounded-lg mb-4">
            <h4 className="font-semibold">Your Doctors</h4>
            <p className="text-xs text-text-secondary">Message your providers</p>
          </div>

          {loadingDoctors && (
            <p className="text-sm text-text-secondary">Loading doctors...</p>
          )}

          {doctors.map((d) => (
            <div
              key={d.id}
              onClick={() => setActiveDoctorId(d.id)}
              className={`p-4 border rounded-lg cursor-pointer mb-3 ${
                activeDoctorId === d.id ? "bg-emerald-50 border-emerald-500" : "bg-white"
              }`}
            >
              <div className="font-semibold">{d.name}</div>
              <div className="text-xs text-text-secondary">{d.specialty}</div>
            </div>
          ))}
        </aside>

        {/* RIGHT: Chat Window */}
        <div className="lg:col-span-2 bg-beige p-6 rounded-lg">
          {!activeDoctor ? (
            <p>Select a doctor to start chatting.</p>
          ) : (
            <>
              <div className="mb-3">
                <h3 className="font-semibold text-lg">{activeDoctor.name}</h3>
                <p className="text-xs text-text-secondary">
                  {activeDoctor.specialty} • {activeDoctor.location}
                </p>
              </div>

              <div className="h-96 bg-white border rounded p-4 overflow-auto mb-4">
                {loadingMessages && (
                  <p className="text-sm text-text-secondary">Loading messages...</p>
                )}

                {messages.map((m) => (
                  <div key={m.id} className={`mb-4 ${m.senderRole === "patient" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block p-3 rounded ${
                        m.senderRole === "patient"
                          ? "bg-emerald-700 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
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
