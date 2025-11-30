// src/components/Chatbot.jsx

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "How can I support your wellness today?" },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const recognitionRef = useRef(null);
  const { user } = useAuth();

  // Setup Voice Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
      console.warn("Microphone permission denied");
    });

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    // FIX: EN-IN works best for English + Hinglish + Indian accents
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (err) => {
      console.error("Voice Error:", err);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interimText += transcript;
      }

      setInput(finalText || interimText);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support voice input.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Voice start error:", err);
      }
    }
  };

  // Speak message only when voiceEnabled = true
  const speakMessage = (text) => {
    if (!voiceEnabled) return;
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN"; // works for Hinglish, English, Indian accent
    window.speechSynthesis.speak(speech);
  };

  const sendMessage = async (overrideText) => {
    const messageText = (overrideText ?? input).trim();
    if (!messageText || isSending) return;

    setMessages((prev) => [...prev, { from: "user", text: messageText }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(`${API_BASE}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          user: {
            name: user?.fullName || user?.name,
            dosha: user?.dosha || user?.doshaType,
            age: user?.age,
          },
        }),
      });

      const data = await res.json();
      const reply = data?.reply || "Something went wrong.";

      setMessages((prev) => [...prev, { from: "bot", text: reply }]);

      // Speak only when toggle is ON
      if (voiceEnabled) {
        speakMessage(reply);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      const fallback = "Network issue. Please try again.";
      setMessages((prev) => [...prev, { from: "bot", text: fallback }]);

      if (voiceEnabled) speakMessage(fallback);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-[#0D5C33] text-white shadow-xl hover:scale-105 transition"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[430px] bg-white shadow-2xl rounded-2xl border border-[#eee] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#F9F6ED] border-b border-[#e5e2d3] rounded-t-2xl">
            <div>
              <h3 className="font-semibold text-[#0D5C33]">AyurNutri Assistant</h3>
              <p className="text-xs text-[#6b6b5f]">
                Speak or type in Hindi, English, Marathi, or any Indian language.
              </p>
            </div>
            <button onClick={() => setOpen(false)}>
              <X className="text-[#0D5C33]" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#FAFAF7]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.from === "user"
                    ? "ml-auto bg-[#0D5C33] text-white"
                    : "mr-auto bg-[#E9E5D8] text-[#0D5C33]"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="p-3 border-t border-[#e5e2d3] bg-white flex items-center gap-2">

            {/* Voice Toggle */}
            <button
              type="button"
              onClick={() => setVoiceEnabled((v) => !v)}
              className="p-2 rounded-lg border border-[#ddd] hover:bg-[#f4f4ef]"
            >
              {voiceEnabled ? (
                <Volume2 size={18} className="text-[#0D5C33]" />
              ) : (
                <VolumeX size={18} className="text-gray-500" />
              )}
            </button>

            {/* Input */}
            <div className="flex-1 flex items-center border border-[#ccc] rounded-lg px-2">
              <input
                className="w-full py-2 text-sm bg-transparent outline-none"
                placeholder="Type or use mic…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <button
                type="button"
                onClick={startListening}
                className="p-1 rounded-full hover:bg-[#f0efe6]"
              >
                {isListening ? (
                  <MicOff size={18} className="text-red-600" />
                ) : (
                  <Mic size={18} className="text-[#0D5C33]" />
                )}
              </button>
            </div>

            <button
              onClick={() => sendMessage()}
              disabled={isSending}
              className="bg-[#0D5C33] text-white px-4 py-2 rounded-lg hover:bg-[#0b4627] text-sm"
            >
              {isSending ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
