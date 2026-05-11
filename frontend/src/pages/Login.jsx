import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      if (!res.data?.token) {
        alert("Invalid login response");
        return;
      }

      const token = res.data.token;
      localStorage.setItem("token", token);

      let user = res.data.user;

      if (!user) {
        const decoded = decodeToken(token);
        user = decoded;
      }

      if (user?.role) {
        localStorage.setItem("role", user.role);
      } else {
        localStorage.setItem("role", "user");
      }

      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 Replace later with toast
      alert("Login successful");

      if (user?.role === "hospital") {
        navigate("/owner");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div style={container}>
      
      {/* 🔥 CARD */}
      <div style={card}>
        <h2 style={{ marginBottom: "10px" }}>
          Welcome Back 👋
        </h2>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
            fontSize: "14px"
          }}
        >
          Login to CareSync AI
        </p>

        <input
          style={input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={button} onClick={handleLogin}>
          Login
        </button>

        <p style={{ marginTop: "15px" }}>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

// 🔥 STYLES

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea, #764ba2)"
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  width: "320px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none"
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#667eea",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};