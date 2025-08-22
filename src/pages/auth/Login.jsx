import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/creators";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading,
    errMess,
    login: loginData,
  } = useSelector((state) => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "⚠️ Please enter Email and Password!",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    // Dispatch Redux login
    const resultAction = await dispatch(
      actions.postLogin({ data: { email, password } })
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
    <div style={styles.container} className="bg-light">
      <div style={styles.card} className="bg-white">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXVBASNO7C59zz-GfBusZjc47ZNrbLpTT1mA&s"
          alt="login"
          style={styles.image}
        />

        <h2 style={styles.heading}>Laxmi Genral Store...!!!</h2>
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
              className="shadow-sm rounded-pill form-control "
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
              className="shadow-sm rounded-pill form-control "
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