import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Orders.css";
import {
  FaPlus,
  FaSearch,
  FaFilePdf,
  FaPhone,
  FaTrash,
  FaEdit,
  FaUser,
  FaCalendarAlt,
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
  FaListUl,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { billsGetData } from "../../store/creators";
import Loading from "../../Component/loaders/Loading";

export default function Orders() {
  const dispatch = useDispatch();
  const { bills, isLoading } = useSelector((state) => state.entities?.bills);
  const { login } = useSelector((state) => state?.login);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");

  useEffect(() => {
    const data = {
      token: login?.token,
    };
    dispatch(billsGetData(data));
  }, [dispatch, login]);

  const filteredOrders = bills.data?.filter((order) => {
    const customerName = order.customer?.name || "";
    const searchMatch = customerName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let statusMatch = false;
    if (filterStatus === "All") {
      statusMatch = true;
    } else if (filterStatus === "Completed") {
      statusMatch = order.status.toLowerCase() === "completed";
    } else if (filterStatus === "Pending") {
      statusMatch = order.status.toLowerCase() === "pending";
    } else if (filterStatus === "Dummy") {
      statusMatch = order.is_dummy === 1;
    }

    return searchMatch && statusMatch;
  });

  // 🆕 Sort by date logic
  let sortedOrders = filteredOrders;
  if (sortOrder === "asc") {
    sortedOrders = [...filteredOrders].sort((a, b) => {
      // Parse date strings to Date objects
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
  } else if (sortOrder === "desc") {
    sortedOrders = [...filteredOrders].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setSortOrder("none"); // Filter बदलल्यावर sort reset करा
  };

  return (
    <div className="orders-container">
      <div className="orders-header-wrapper">
        <div className="orders-header">
          {/* Title and Add button row */}
          <div className="orders-title-row">
            <h2 className="orders-title">Orders</h2>
            {/* Add button for mobile only */}
            <button className="add-btn add-btn-mobile">
              <FaPlus />
            </button>
          </div>

          {/* Search and Add button for desktop */}
          <section className="add-btn-search-row" aria-label="Search and Add Order">
            <div className="orders-search" role="search">
              <FaSearch className="search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by customer name"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search by customer name"
                autoComplete="off"
              />
            </div>
            <button className="add-btn add-btn-desktop" aria-label="Add new order">
              <FaPlus aria-hidden="true" />
            </button>
          </section>

          {/* Filters row */}
          <nav className="orders-filters compact filter-row" aria-label="Order Filters">
            <button
              className={`filter-btn small${filterStatus === "All" ? " active" : ""}`}
              onClick={() => handleFilterChange("All")}
              aria-label="Show all orders"
              tabIndex={0}
            >
              All
            </button>
            <button
              className={`filter-btn small completed${filterStatus === "Completed" ? " active" : ""}`}
              onClick={() => handleFilterChange("Completed")}
              aria-label="Show completed orders"
              tabIndex={0}
            >
              <FaCheckCircle style={{ marginRight: 2, fontSize: 13 }} aria-hidden="true" />
            </button>
            <button
              className={`filter-btn small pending${filterStatus === "Pending" ? " active" : ""}`}
              onClick={() => handleFilterChange("Pending")}
              aria-label="Show pending orders"
              tabIndex={0}
            >
              <FaClock style={{ marginRight: 2, fontSize: 13 }} aria-hidden="true" />
            </button>
            <button
              className={`filter-btn small dummy${filterStatus === "Dummy" ? " active" : ""}`}
              onClick={() => handleFilterChange("Dummy")}
              aria-label="Show dummy name orders"
              tabIndex={0}
            >
              Dummy
            </button>
            <button
              className="filter-btn small filter-sort-btn"
              onClick={() => {
                if (sortOrder === "none" || sortOrder === "desc") {
                  setSortOrder("asc");
                } else {
                  setSortOrder("desc");
                }
              }}
              aria-label={`Sort by date ${sortOrder === "asc" ? "ascending" : "descending"}`}
              tabIndex={0}
            >
              <FaListUl className="filter-icon-left" aria-hidden="true" style={{ fontSize: 13 }} />
              {sortOrder === "asc" ? (
                <FaSortUp className="filter-icon-right" aria-hidden="true" style={{ fontSize: 13 }} />
              ) : (
                <FaSortDown className="filter-icon-right" aria-hidden="true" style={{ fontSize: 13 }} />
              )}
            </button>
          </nav>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Loading />
        </div>
      ) : sortedOrders && sortedOrders.length > 0 ? (
        sortedOrders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-info">
              <p>
                <FaUser className="info-icon" />{" "}
                <strong>{order.customer?.name || "N/A"}</strong>
              </p>
              <p>
                <FaCalendarAlt className="info-icon" /> {order.date}
              </p>
              <p className="amount green">
                <FaRupeeSign className="info-icon" /> Total Amount:{" "}
                {order.total_amount}
              </p>
              <p className="amount red">
                <FaRupeeSign className="info-icon" /> Pending Amount:{" "}
                {order.unpaid_amount}
              </p>
            </div>
            <div className="order-status">{order.status}</div>

            <div className="order-actions">
              <button className="icon-btn pdf">
                <FaFilePdf />
              </button>
              <button className="icon-btn phone">
                <FaPhone />
              </button>
              <button className="icon-btn delete">
                <FaTrash />
              </button>
              <button className="icon-btn edit">
                <FaEdit />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          No orders found.
        </div>
      )}
    </div>
  );
}
