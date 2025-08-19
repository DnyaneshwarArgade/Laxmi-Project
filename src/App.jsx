import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState } from "react";
import Items from "./Component/Items";
import Order from "./Component/Order";
import Customer from "./Component/Customer";
import Login from "./Component/Login";
import "./App.css";

export default function App() {
  const [isAuth, setIsAuth] = useState(false); // ✅ login status

  return (
    <div className="app-container bg-light">
      <div className="page-content">
        <Routes>
          {/* जर login झाले नसेल तर /login दाखवायचं */}
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={isAuth ? <Order /> : <Navigate to="/login" />}
          />
          <Route
            path="/items"
            element={isAuth ? <Items /> : <Navigate to="/login" />}
          />
          <Route
            path="/customer"
            element={isAuth ? <Customer /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>

      {/* Bottom Tab Bar */}
      {isAuth && (
        <nav className="bottom-tab">
          <NavLink to="/items" className="tab-item">
            <span className="icon">🛒</span>
            <span className="label">Items</span>
          </NavLink>
          <NavLink to="/" className="tab-item">
            <span className="icon">📦</span>
            <span className="label">Order</span>
          </NavLink>
          <NavLink to="/customer" className="tab-item">
            <span className="icon">🔍</span>
            <span className="label">Customer</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
}
