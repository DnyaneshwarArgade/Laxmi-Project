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
    FaSortUp, // 🆕 FaSortUp add करा
    FaSortDown
} from "react-icons/fa";
import { billsGetData } from "../../store/creators";

export default function Orders() {
    const dispatch = useDispatch();
    const { bills, isLoading } = useSelector((state) => state.entities?.bills);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortOrder, setSortOrder] = useState("none"); // 🆕 नवीन state

    useEffect(() => {
        const data = {
            token: "YOUR_AUTH_TOKEN_HERE"
        };
        dispatch(billsGetData(data));
    }, [dispatch]);

    const filteredOrders = bills.data?.filter((order) => {
        const customerName = order.customer?.name || '';
        const searchMatch = customerName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const statusMatch = filterStatus === "All" || order.status.toLowerCase() === filterStatus.toLowerCase();
        
        return searchMatch && statusMatch;
    });

    // 🆕 नवीन sorting logic
    let sortedOrders = filteredOrders;
    if (sortOrder === "asc") {
        sortedOrders = [...filteredOrders].sort((a, b) => a.total_amount - b.total_amount);
    } else if (sortOrder === "desc") {
        sortedOrders = [...filteredOrders].sort((a, b) => b.total_amount - a.total_amount);
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
                    <h2 className="orders-title">Orders</h2>
                    <div className="orders-search">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search by customer name" 
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button className="add-btn">
                        <FaPlus />
                    </button>
                    <div className="orders-filters">
                        <button 
                            className={`filter-btn ${filterStatus === "All" ? "active" : ""}`}
                            onClick={() => handleFilterChange("All")}
                        >
                            All
                        </button>
                        <button 
                            className={`filter-btn completed ${filterStatus === "Completed" ? "active" : ""}`}
                            onClick={() => handleFilterChange("Completed")}
                        >
                            <FaCheckCircle style={{ marginRight: "6px" }} /> Completed
                        </button>
                        <button 
                            className={`filter-btn pending ${filterStatus === "Pending" ? "active" : ""}`}
                            onClick={() => handleFilterChange("Pending")}
                        >
                            <FaClock style={{ marginRight: "6px" }} /> Pending
                        </button>
                        {/* 🆕 Sort Button with new logic */}
                        <button 
                            className="filter-btn filter-sort-btn"
                            onClick={() => {
                                if (sortOrder === "none" || sortOrder === "desc") {
                                    setSortOrder("asc");
                                } else {
                                    setSortOrder("desc");
                                }
                            }}
                        >
                            <FaListUl className="filter-icon-left" />
                            {sortOrder === "asc" ? (
                                <FaSortUp className="filter-icon-right" />
                            ) : (
                                <FaSortDown className="filter-icon-right" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔹 Dynamic Order Cards sorted by amount */}
            {isLoading ? (
                <div style={{ textAlign: "center", marginTop: "50px" }}>Loading orders...</div>
            ) : (
                sortedOrders && sortedOrders.length > 0 ? (
                    sortedOrders.map((order) => (
                        <div className="order-card" key={order.id}>
                            <div className="order-info">
                                <p>
                                    <FaUser className="info-icon" /> <strong>{order.customer?.name || 'N/A'}</strong>
                                </p>
                                <p>
                                    <FaCalendarAlt className="info-icon" /> {order.date}
                                </p>
                                <p className="amount green">
                                    <FaRupeeSign className="info-icon" /> Total Amount: {order.total_amount}
                                </p>
                                <p className="amount red">
                                    <FaRupeeSign className="info-icon" /> Pending Amount: {order.unpaid_amount}
                                </p>
                            </div>
                            <div className="order-status">{order.status}</div>

                            <div className="order-actions">
                                <button className="icon-btn pdf"><FaFilePdf /></button>
                                <button className="icon-btn phone"><FaPhone /></button>
                                <button className="icon-btn delete"><FaTrash /></button>
                                <button className="icon-btn edit"><FaEdit /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: "center", marginTop: "50px" }}>No orders found.</div>
                )
            )}
        </div>
    );
}