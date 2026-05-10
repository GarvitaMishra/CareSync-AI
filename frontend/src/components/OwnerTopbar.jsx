import { useEffect, useState } from "react";

export default function OwnerTopbar() {
  const [time, setTime] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={topbar}>

      {/* LEFT */}
      <div style={leftSection}>

        <div style={avatar}>
          👤
        </div>

        <div>
          <h2 style={heading}>
            Welcome back, {user?.name || "Owner"} 👋
          </h2>

          <p style={subText}>
            Manage hospitals, services & bookings
          </p>
        </div>

      </div>

      {/* CENTER */}
      <div style={searchWrapper}>

        <input
          type="text"
          placeholder="Search hospitals, services..."
          style={searchInput}
        />

      </div>

      {/* RIGHT */}
      <div style={rightSection}>

        <div style={timeCard}>
          🕒 {time}
        </div>

        <button style={notificationBtn}>
          🔔
        </button>

      </div>

    </div>
  );
}

/* STYLES */

const topbar = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px",
  flexWrap: "wrap",
  padding: "20px 25px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  border: "1px solid rgba(255,255,255,0.4)",
  position: "sticky",
  top: "0",
  zIndex: "20"
};

const leftSection = {
  display: "flex",
  alignItems: "center",
  gap: "16px"
};

const avatar = {
  width: "58px",
  height: "58px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "24px",
  color: "white",
  boxShadow: "0 6px 18px rgba(99,102,241,0.35)"
};

const heading = {
  fontSize: "28px",
  marginBottom: "5px",
  color: "#111827",
  fontWeight: "700"
};

const subText = {
  color: "#6b7280",
  fontSize: "14px"
};

const searchWrapper = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  minWidth: "250px"
};

const searchInput = {
  width: "100%",
  maxWidth: "450px",
  padding: "15px 20px",
  borderRadius: "14px",
  border: "1px solid #e5e7eb",
  background: "rgba(255,255,255,0.9)",
  fontSize: "15px",
  outline: "none",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  transition: "0.3s"
};

const rightSection = {
  display: "flex",
  alignItems: "center",
  gap: "15px"
};

const timeCard = {
  background: "rgba(255,255,255,0.9)",
  padding: "12px 18px",
  borderRadius: "14px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  fontSize: "14px",
  color: "#374151",
  fontWeight: "500"
};

const notificationBtn = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  border: "none",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "white",
  fontSize: "18px",
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(99,102,241,0.35)",
  transition: "0.3s"
};