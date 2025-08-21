import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Items from "./Component/Items";
import Order from "./Component/Order";
import Customer from "./Component/Customer";
import Login from "./Component/Login";
import "./App.css";

export default function App() {
  const location = useLocation();
  // Use Redux state for authentication
  const { login: loginData } = useSelector((state) => state.login);
  const isAuth = !!loginData?.token;
  // जर आपण login page वर असलो तर
  const isLoginPage = location.pathname === "/login";

  // ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    return isAuth ? children : <Navigate to="/login" />;
  };

  return (
    <div className={!isLoginPage ? "app-container bg-light" : ""}>
      <div className={!isLoginPage ? "page-content" : ""}>
        <Routes>
          {/* जर login झाले नसेल तर /login दाखवायचं */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Order /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
          <Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
        </Routes>
      </div>

      {/* ✅ Bottom Tab Bar फक्त login शिवाय */}
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
            <span className="icon">👤</span>
            <span className="label">Customer</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
}
