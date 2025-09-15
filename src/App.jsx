import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import BottomNavigation from "./Component/BottomNavigation";
import Header from "./Component/Header";
import { useSelector } from "react-redux";
import Home from "./pages/home/Home";
import Customers from "./pages/customers-new/CustomersListing";
import Items from "./pages/items-new/ItemsListing";
import Orders from "./pages/orders/Order";
import Login from "./pages/auth/Login";
import OrderList from "./pages/orders-new/Order-List";
import "./App.css";

export default function App() {
  const location = useLocation();
  const { login: loginData } = useSelector((state) => state.login);
  const isAuth = !!loginData?.token;
  const isLoginPage = location.pathname === "/login";
  const ProtectedRoute = ({ children }) => {
    return isAuth ? children : <Navigate to="/login" />;
  };
  return (
      <div className={!isLoginPage ? "app-container bg-light" : ""}>
        {!isLoginPage && <Header />}
        <div className={!isLoginPage ? "page-content" : ""}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            {/* <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} /> */}
            <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/orders-new" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
          </Routes>
        </div>
        {isAuth && !isLoginPage && <BottomNavigation />}
      </div>
  );
}
