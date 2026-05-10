import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text: "Hi 👋 I'm MediBot. How can I help you today?",
      sender: "bot"
    }
  ]);

  const [input, setInput] = useState("");

  const navigate = useNavigate();

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;
    }
  }, [messages]);

  const quickReplies = [
    "Find MRI",
    "My bookings",
    "Open dashboard",
    "Blood Test"
  ];

  const processMessage = (message) => {
    const msg = message.toLowerCase();

    let botReply =
      "Sorry 😅 I couldn't understand that.";

    if (
      msg.includes("mri") ||
      msg.includes("scan")
    ) {
      botReply =
        "Searching MRI services for you 🔍";

      navigate("/search");

    } else if (
      msg.includes("booking")
    ) {
      botReply =
        "Opening your bookings 📅";

      navigate("/bookings");

    } else if (
      msg.includes("hospital") ||
      msg.includes("dashboard")
    ) {

      const role = localStorage.getItem("role");

      if (role === "hospital") {

        botReply =
          "Opening hospital dashboard 🏥";

        navigate("/owner");

      } else if (role === "admin") {

        botReply =
          "Opening admin dashboard 📊";

        navigate("/admin");

      } else {

        botReply =
          "Dashboard access only for owners/admins 🔒";
      }

    } else if (
      msg.includes("blood")
    ) {
      botReply =
        "Blood test services are available 🩸";

      navigate("/search");

    } else if (
      msg.includes("hello") ||
      msg.includes("hi")
    ) {
      botReply =
        "Hello 👋 How can I assist you?";
    }

    return botReply;
  };

  const handleSend = (customMessage) => {
    const finalMessage =
      customMessage || input;

    if (!finalMessage.trim()) return;

    const userMsg = {
      text: finalMessage,
      sender: "user"
    };

    const botMsg = {
      text: processMessage(finalMessage),
      sender: "bot"
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
      botMsg
    ]);

    setInput("");
  };

  return (
    <>

      {/* FLOATING BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        style={floatingBtn}
      >
        {open ? "✖" : "🤖"}
      </button>

      {/* CHAT WINDOW */}

      {open && (
        <div style={chatWindow}>

          {/* HEADER */}

          <div style={header}>

            <div style={headerLeft}>
              <div style={botAvatar}>
                🤖
              </div>

              <div>
                <h3 style={botName}>
                  MediBot
                </h3>

                <p style={onlineText}>
                  Online
                </p>
              </div>
            </div>

          </div>

          {/* CHAT BODY */}

          <div
            style={chatBody}
            ref={chatRef}
          >

            {messages.map((m, i) => (

              <div
                key={i}
                style={{
                  ...messageWrapper,

                  justifyContent:
                    m.sender === "user"
                      ? "flex-end"
                      : "flex-start"
                }}
              >

                <div
                  style={{
                    ...messageBubble,

                    background:
                      m.sender === "user"
                        ? "#4f46e5"
                        : "white",

                    color:
                      m.sender === "user"
                        ? "white"
                        : "#111827"
                  }}
                >
                  {m.text}
                </div>

              </div>

            ))}

          </div>

          {/* QUICK REPLIES */}

          <div style={quickRepliesWrapper}>

            {quickReplies.map((q, i) => (
              <button
                key={i}
                style={quickReplyBtn}
                onClick={() =>
                  handleSend(q)
                }
              >
                {q}
              </button>
            ))}

          </div>

          {/* INPUT */}

          <div style={inputArea}>

            <input
              style={input}
              placeholder="Ask something..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button
              style={sendBtn}
              onClick={() => handleSend()}
            >
              ➤
            </button>

          </div>

        </div>
      )}

    </>
  );
}

/* STYLES */

const floatingBtn = {
  position: "fixed",
  bottom: "25px",
  right: "25px",
  width: "65px",
  height: "65px",
  borderRadius: "50%",
  border: "none",
  background:
    "linear-gradient(135deg, #4f46e5, #8b5cf6)",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
  zIndex: "999",
  boxShadow:
    "0 10px 25px rgba(79,70,229,0.35)"
};

const chatWindow = {
  position: "fixed",
  bottom: "100px",
  right: "25px",
  width: "370px",
  height: "600px",
  background: "white",
  borderRadius: "24px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxShadow:
    "0 20px 50px rgba(0,0,0,0.18)",
  zIndex: "999"
};

const header = {
  padding: "18px 20px",
  background:
    "linear-gradient(135deg, #4f46e5, #8b5cf6)",
  color: "white"
};

const headerLeft = {
  display: "flex",
  alignItems: "center",
  gap: "14px"
};

const botAvatar = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.2)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "24px"
};

const botName = {
  marginBottom: "4px"
};

const onlineText = {
  fontSize: "13px",
  opacity: "0.9"
};

const chatBody = {
  flex: 1,
  padding: "18px",
  overflowY: "auto",
  background: "#f9fafb"
};

const messageWrapper = {
  display: "flex",
  marginBottom: "14px"
};

const messageBubble = {
  maxWidth: "75%",
  padding: "14px 16px",
  borderRadius: "18px",
  fontSize: "14px",
  lineHeight: "1.5",
  boxShadow:
    "0 4px 10px rgba(0,0,0,0.05)"
};

const quickRepliesWrapper = {
  display: "flex",
  gap: "10px",
  padding: "12px",
  overflowX: "auto",
  background: "white"
};

const quickReplyBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4338ca",
  cursor: "pointer",
  whiteSpace: "nowrap",
  fontWeight: "600"
};

const inputArea = {
  display: "flex",
  padding: "15px",
  gap: "12px",
  borderTop: "1px solid #e5e7eb",
  background: "white"
};

const input = {
  flex: 1,
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "14px"
};

const sendBtn = {
  width: "52px",
  border: "none",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, #4f46e5, #8b5cf6)",
  color: "white",
  fontSize: "18px",
  cursor: "pointer"
};