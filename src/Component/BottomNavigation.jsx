import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaBoxOpen, FaShoppingCart } from "react-icons/fa";
import "./BottomNavigation.css";

const navItems = [
  { to: "/", label: "Home", icon: <FaHome /> },
  { to: "/items", label: "Items", icon: <FaBoxOpen /> },
  { to: "/customers", label: "Customer", icon: <FaUser /> },
  // { to: "/orders", label: "Order", icon: <FaShoppingCart /> },
  { to: "/orders-new", label: "Order", icon: <FaShoppingCart /> },
];

const BottomNavigation = () => (
  <nav className="bottom-nav">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
        end
      >
        {item.icon}
        <span className="nav-label">{item.label}</span>
      </NavLink>
    ))}
  </nav>
);

export default BottomNavigation;
