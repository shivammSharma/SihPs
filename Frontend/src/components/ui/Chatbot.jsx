import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Namaste! How can I support your wellness today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { from: "user", text: input }]);
    setInput("");

    // backend logic will come later
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Thank you! Our AyurNutri assistant will respond soon." }
      ]);
    }, 600);
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
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[420px] bg-white shadow-2xl rounded-2xl border border-[#eee] flex flex-col animate-fadeIn">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#F9F6ED] border-b border-[#e5e2d3] rounded-t-2xl">
            <h3 className="font-semibold text-[#0D5C33]">
              AyurNutri Assistant
            </h3>
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

          {/* Input Box */}
          <div className="p-3 border-t border-[#e5e2d3] bg-white flex gap-2">
            <input
              className="w-full px-3 py-2 rounded-lg border border-[#ccc] focus:ring-2 focus:ring-[#0D5C33] outline-none"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-[#0D5C33] text-white px-4 py-2 rounded-lg hover:bg-[#0b4627] transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
