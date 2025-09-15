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
    FaSortDown
} from "react-icons/fa";
import { billsGetData } from "../../store/creators";

export default function Orders() {
    const dispatch = useDispatch();
    const { bills, isLoading } = useSelector((state) => state.entities?.bills);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch data from the server when the component mounts
        // This 'data' object should contain the authentication token.
        const data = {
            token: "YOUR_AUTH_TOKEN_HERE" // Replace with a dynamic token from your login state
        };
        dispatch(billsGetData(data));
    }, [dispatch]);

    // Filter the orders based on the search term
    const filteredOrders = bills.data?.filter((order) => {
        const customerName = order.customer?.name || '';
        return customerName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="orders-container">
            {/* 🔹 Header Section */}
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
                    <button className="filter-btn active">All</button>
                    <button className="filter-btn completed">
                        <FaCheckCircle style={{ marginRight: "6px" }} /> Completed
                    </button>
                    <button className="filter-btn pending">
                        <FaClock style={{ marginRight: "6px" }} /> Pending
                    </button>
                    <button className="filter-btn filter-sort-btn">
                        <FaListUl className="filter-icon-left" />
                        <FaSortDown className="filter-icon-right" />
                    </button>
                </div>
            </div>

            {/* 🔹 Dynamic Order Cards */}
            {isLoading ? (
                <div style={{ textAlign: "center", marginTop: "50px" }}>Loading orders...</div>
            ) : (
                filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
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

                            {/* 🔹 Bottom Actions */}
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