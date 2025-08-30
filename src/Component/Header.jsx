import React from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { postLogout, logout } from "../store/components/Auth/login";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import "./Header.css";
import Logo from "../assets/Logo.jpg";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginData = useSelector((state) => state.login?.login?.data);
  const token = useSelector((state) => state.login?.login?.token);
  const name = loginData?.name || "User";

  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (token) {
          await dispatch(postLogout(token));
        }
        dispatch(logout());
        navigate("/login");
      }
    });
  };

  return (
    <header
      className="common-header light-header"
      style={{
        background: "linear-gradient(90deg, #36d1dc 0%, #5b86e5 100%)",
        boxShadow: "0 2px 12px rgba(59,130,246,0.08)",
        padding: "10px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "0 0 18px 18px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(59,130,246,0.12)",
            border: "2px solid #fff",
            background: "#fff",
            marginLeft: 18,
          }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginRight: 18 }}>
        <span
          style={{
            color: "#fff",
            fontWeight: 500,
            fontSize: 16,
            background: "rgba(255,255,255,0.12)",
            padding: "6px 16px",
            borderRadius: 12,
            boxShadow: "0 1px 4px rgba(59,130,246,0.08)",
          }}
        >
          Welcome, {name}
        </span>
        <button
          className="logout-btn mobile-friendly"
          onClick={handleLogout}
          title="Logout"
          style={{
            background: "linear-gradient(90deg, #ff6a00, #ee0979)",
            border: "none",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(59,130,246,0.10)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <FiLogOut size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;
