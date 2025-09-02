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
    <header className="common-header light-header">
      <div className="header-left">
        <img src={Logo} alt="Logo" className="header-logo" />
      </div>
      <div className="header-right">
        <span
          className="welcome"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: "0.98rem",
            padding: "2px 10px",
            background: "#f5f5f5",
            borderRadius: 8,
            color: "#1976d2",
            fontWeight: 500,
            border: "1px solid #e3e3e3",
            minWidth: 0,
            boxShadow: "0 1px 4px rgba(25,118,210,0.06)",
          }}
        >
          <span style={{ fontWeight: 500, fontSize: "0.98em", color: "#1976d2" }}>Welcome, {name}</span>
        </span>
        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <FiLogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;
