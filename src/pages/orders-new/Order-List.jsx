import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import ViewInvoice from "./invoice/ViewInvoice";
import CreateOrder from "./create-order/CreateOrder";
import "./Orders.css";
import {
  FaPlus,
  FaSearch,
  FaRegFilePdf,
  FaTrash,
  FaUser,
  FaCalendarAlt,
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
  FaListUl,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaSquarePhone } from "react-icons/fa6";
import { billsGetData, customersGetData, itemsGetData } from "../../store/creators";
import Loading from "../../Component/loaders/Loading";

export default function Orders() {
  const dispatch = useDispatch();
  const { bills, isLoading } = useSelector((state) => state.entities?.bills);
  const { login } = useSelector((state) => state?.login);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);

  // Handle opening create order modal
  const handleOpenCreateOrder = () => {
    setCreateOrderModalOpen(true);
  };

  // Handle closing create order modal
  const handleCloseCreateOrder = () => {
    setCreateOrderModalOpen(false);
  };

  // Handle opening invoice modal
  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
    setInvoiceModalOpen(true);
  };

  // Handle closing invoice modal
  const handleCloseInvoice = () => {
    setInvoiceModalOpen(false);
    setSelectedOrder(null);
  };

  // Fetch data on component mount
  useEffect(() => {
    dispatch(billsGetData({ token: login?.token }));
    dispatch(customersGetData({ token: login?.token }));
    dispatch(itemsGetData({ token: login?.token }));
  }, [dispatch, login]);

  // Filter orders based on search term and status
  const filteredOrders = bills.data?.filter((order) => {
    const name = order.customer?.name || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All"
        ? true
        : filterStatus === "Completed"
        ? order.status.toLowerCase() === "completed"
        : filterStatus === "Pending"
        ? order.status.toLowerCase() === "pending"
        : order.is_dummy === 1;

    return matchesSearch && matchesStatus;
  });

  // Sort orders by date
  const sortedOrders = [...(filteredOrders || [])].sort((a, b) => {
    if (sortOrder === "asc") return new Date(a.date) - new Date(b.date);
    if (sortOrder === "desc") return new Date(b.date) - new Date(a.date);
    return 0;
  });

  return (
    <div className="orders-container">

      {/* Header */}
      <div className="orders-header-wrapper">
        <div className="orders-header">

          <div className="orders-title-row">
            <h2 className="orders-title">Orders</h2>
            <button className="add-btn add-btn-mobile" onClick={handleOpenCreateOrder}>
              <FaPlus />
            </button>
          </div>

          <section className="add-btn-search-row">
            <div className="orders-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by customer name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-btn add-btn-desktop" onClick={handleOpenCreateOrder}>
              <FaPlus />
            </button>
          </section>

          {/* Filters & Sorting */}
          <nav className="orders-filters compact filter-row">
            <button
              className={`filter-btn small${filterStatus === "All" ? " active" : ""}`}
              onClick={() => setFilterStatus("All")}
            >
              All
            </button>
            <button
              className={`filter-btn small completed${filterStatus === "Completed" ? " active" : ""}`}
              onClick={() => setFilterStatus("Completed")}
            >
              <FaCheckCircle />
            </button>
            <button
              className={`filter-btn small pending${filterStatus === "Pending" ? " active" : ""}`}
              onClick={() => setFilterStatus("Pending")}
            >
              <FaClock />
            </button>
            <button
              className={`filter-btn small dummy${filterStatus === "Dummy" ? " active" : ""}`}
              onClick={() => setFilterStatus("Dummy")}
            >
              Dummy
            </button>
            <button
              className="filter-btn small filter-sort-btn"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <FaListUl />
              {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
            </button>
          </nav>

        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <Loading />
      ) : sortedOrders.length > 0 ? (
        <>
          {sortedOrders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-info">
                <p>
                  <FaUser className="info-icon" /> <strong>{order.customer?.name || "N/A"}</strong>
                </p>
                <p>
                  <FaCalendarAlt className="info-icon" /> {order.date}
                </p>
                <p className="amount green">
                  <FaRupeeSign className="info-icon" /> Total amount: {order.total_amount}
                </p>
                <p className="amount red">
                  <FaRupeeSign className="info-icon" /> Pending amount: {order.unpaid_amount}
                </p>
              </div>

              <div className="order-status">{order.status}</div>

              <div className="order-actions">
                <button className="view-btn" onClick={() => handleViewInvoice(order)}>
                  <FaRegFilePdf />
                </button>
                <a className="call-btn" href={`tel:${order.customer?.phone}`}>
                  <FaSquarePhone />
                </a>
                <button className="delete-btn" onClick={() => alert("Delete " + order.id)}>
                  <FaTrash />
                </button>
                {order.status !== "Completed" && (
                  <button className="edit-btn" onClick={() => alert("Edit " + order.id)}>
                    <MdEdit />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Invoice Modal */}
          <Modal isOpen={invoiceModalOpen} toggle={handleCloseInvoice} size="lg">
            <ModalHeader toggle={handleCloseInvoice}>Invoice</ModalHeader>
            <ModalBody className="p-0">
              {selectedOrder && <ViewInvoice invoice={selectedOrder} />}
            </ModalBody>
          </Modal>

          {/* Create Order Modal */}
          <Modal isOpen={createOrderModalOpen} toggle={handleCloseCreateOrder} size="lg">
            <ModalHeader toggle={handleCloseCreateOrder}>Create Order</ModalHeader>
            <ModalBody className="p-0">
              <CreateOrder />
            </ModalBody>
          </Modal>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: 50 }}>No orders found.</div>
      )}

    </div>
  );
}
