import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/creators";
export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading,
    errMess,
    login: loginData,
  } = useSelector((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Phone validation: must be 10 digits, numeric
    const phoneRegex = /^\d{10}$/;
    if (!phone || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "⚠️ Please enter Phone and Password!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    if (!phoneRegex.test(phone)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Phone",
        text: "⚠️ Please enter a valid 10-digit phone number!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    // Dispatch Redux login
    const resultAction = await dispatch(
      actions.postLogin({ data: { phone, password } })
    );
    if (actions.postLogin.fulfilled.match(resultAction)) {
      const { success, token } = resultAction.payload;
      if (success && token) {
        navigate("/");
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: resultAction.payload || "Login Failed",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div
      style={{ ...styles.container, padding: "0 10px", minHeight: "100vh" }}
      className="bg-light"
    >
      <div
        style={{ ...styles.card, width: "100%", maxWidth: 400, margin: "auto" }}
        className="bg-white"
      >
        <FaUserCircle
          style={{
            ...styles.image,
            color: "#36d1dc",
            background: "none",
            border: "none",
          }}
        />

        <h2 style={styles.heading}>Welcome Back...!</h2>
        <p style={styles.subHeading}>Sign in your account to continue</p>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Mobile Number</label>
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={phone}
              maxLength={10}
              pattern="\d{10}"
              onChange={(e) => {
                const val = e.target.value.replace(/[^\d]/g, "");
                setPhone(val);
              }}
              style={{ ...styles.input, minWidth: 0 }}
              className="shadow-sm rounded-pill form-control "
            />
          </div>

          <div style={styles.inputContainer}>
            <label style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, minWidth: 0, paddingRight: 40 }}
                className="shadow-sm rounded-pill form-control "
              />
              <span
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#888",
                  fontSize: 20,
                }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
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
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              <span style={styles.btnText}>Login</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    width: "100%",
    boxSizing: "border-box",
    padding: "0 10px",
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
    color: "#111111ff",
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 15,
    color: "#111111ff",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 18,
    textAlign: "left",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#131212ff",
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
    background: "rgba(240, 240, 240, 0.9)", // हलका gray
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
    color: "#fffcfcff",
  },
  footerText: {
    marginTop: 25,
    fontSize: 14,
    color: "#242323ff",
  },
};
