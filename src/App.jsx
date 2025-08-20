import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Items from "./Component/Items";
import Order from "./Component/Order";
import Customer from "./Component/Customer";
import Login from "./Component/Login";
import "./App.css";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();

  // जर आपण login page वर असलो तर app.css ची styles apply करू नयेत
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={!isLoginPage ? "app-container bg-light" : ""}>
      {!isLoginPage && <div className="page-content"></div>}

      <Routes>
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
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

      {/* ✅ Bottom Tab फक्त login शिवाय दिसेल */}
      {isAuth && !isLoginPage && (
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
