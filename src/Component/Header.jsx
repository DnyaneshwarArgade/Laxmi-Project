import React from "react";
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
    if (token) {
      await dispatch(postLogout(token));
    }
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="common-header light-header">
      <div className="header-left">
        <img src={Logo} alt="Logo" className="header-logo" />
      </div>
      <div className="header-right">
        <span className="welcome">Welcome back, {name}</span>
        <button className="logout-btn mobile-friendly" onClick={handleLogout} title="Logout">
          <FiLogOut size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;
