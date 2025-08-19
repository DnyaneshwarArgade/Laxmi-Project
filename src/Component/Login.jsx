import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("⚠️ Please enter Email and Password!");
      return;
    }

    if (email === "Laxmi@gmail.com" && password === "Laxmi51") {
      alert("✅ Login Successful!");
      setIsAuth(true);
      navigate("/");
    } else {
      alert("❌ Invalid Email or Password!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
          alt="login"
          style={styles.image}
        />

        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subHeading}>Login to your account</p>

        <form onSubmit={handleLogin}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputContainer}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            style={styles.btn}
            onMouseOver={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #ff6a00, #ee0979)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #36d1dc, #5b86e5)")
            }
          >
            <span style={styles.btnText}>Login</span>
          </button>
        </form>

        <p style={styles.footerText}>
          Demo: <b>Laxmi@gmail.com / Laxmi51</b>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #1f1c2c, #928dab)",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(15px)",
    borderRadius: 20,
    padding: "40px 30px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid rgba(255,255,255,0.2)",
    marginTop: 50,
    marginBottom: 50,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    marginBottom: 15,
    border: "3px solid white",
    background: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 15,
    color: "#ddd",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 18,
    textAlign: "left",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    height: 45,
    borderRadius: 10,
    border: "none",
    padding: "0 15px",
    fontSize: 15,
    outline: "none",
    background: "rgba(255,255,255,0.9)",
  },
  btn: {
    background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
    padding: "14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    marginTop: 15,
    width: "100%",
    transition: "all 0.3s ease",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  footerText: {
    marginTop: 25,
    fontSize: 14,
    color: "#eee",
  },
};
