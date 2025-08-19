import { Routes, Route, NavLink } from "react-router-dom";
import Items from "./Component/Items";
import Order from "./Component/Order";
import Search from "./Component/Search";
import "./App.css";

export default function App() {
  const [isAuth, setIsAuth] = useState(false); // ✅ login status

  return (
    <div className="app-container bg-light">
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
          <span className="icon">🛒</span>
          <span className="label">Items</span>
        </NavLink>
        <NavLink to="/" className="tab-item">
          <span className="icon">📦</span>
          <span className="label">Order</span>
        </NavLink>
        <NavLink to="/search" className="tab-item">
          <span className="icon">🔍</span>
          <span className="label">Search</span>
        </NavLink>
      </nav>
    </div>
  );
}

