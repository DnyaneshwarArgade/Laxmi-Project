import { Routes, Route, NavLink } from "react-router-dom";
import Items from "./Componenet/Items";
import Order from "./Componenet/Order";
import Search from "./Componenet/Search";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      {/* Main Content */}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Order />} />
          <Route path="/items" element={<Items />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>

      {/* Bottom Tab Bar */}
      <nav className="bottom-tab">
        <NavLink to="/items" className="tab-item">
          🛒 Items
        </NavLink>
        <NavLink to="/" className="tab-item">
          📦 Order
        </NavLink>
        <NavLink to="/search" className="tab-item">
          🔍 Search
        </NavLink>
      </nav>
    </div>
  );
}
