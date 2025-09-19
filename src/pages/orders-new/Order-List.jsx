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
  FaSortDown,
  FaAngleLeft,
  FaAngleRight
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaSquarePhone } from "react-icons/fa6";
import { billsGetData, deleteBillsData, customersGetData, itemsGetData } from "../../store/creators";
import Loading from "../../Component/loaders/Loading";
import { formatDateDMY } from "../../Helpers/dateFormat";
import Swal from "sweetalert2";

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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleOpenCreateOrder = () => {
    setCreateOrderModalOpen(true);
  };

  const handleCloseCreateOrder = () => {
    setCreateOrderModalOpen(false);
  };

  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
    setInvoiceModalOpen(true);
  };

  const handleCloseInvoice = () => {
    setInvoiceModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    dispatch(billsGetData({ token: login?.token }));
    dispatch(customersGetData({ token: login?.token }));
    dispatch(itemsGetData({ token: login?.token }));
  }, [dispatch, login]);

  const deleteOrder = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteBillsData({ id, data: { token: login?.token } }));
      }
    });
  };

  const ordersArray = Array.isArray(bills) ? bills : bills?.data || [];
  const filteredOrders = ordersArray.filter((order) => {
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

  const sortedOrders = [...(filteredOrders || [])].sort((a, b) => {
    if (sortOrder === "asc") return new Date(a.date) - new Date(b.date);
    if (sortOrder === "desc") return new Date(b.date) - new Date(a.date);
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;
    
    if (totalPages <= maxPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        end = 4;
      }
      
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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

          <nav className="orders-filters compact filter-row">
            <button
              className={`filter-btn small${filterStatus === "All" ? " active" : ""}`}
              onClick={() => {setFilterStatus("All"); setCurrentPage(1);}}
            >
              All
            </button>
            <button
              className={`filter-btn small completed${filterStatus === "Completed" ? " active" : ""}`}
              onClick={() => {setFilterStatus("Completed"); setCurrentPage(1);}}
            >
              <FaCheckCircle />
            </button>
            <button
              className={`filter-btn small pending${filterStatus === "Pending" ? " active" : ""}`}
              onClick={() => {setFilterStatus("Pending"); setCurrentPage(1);}}
            >
              <FaClock />
            </button>
            <button
              className={`filter-btn small dummy${filterStatus === "Dummy" ? " active" : ""}`}
              onClick={() => {setFilterStatus("Dummy"); setCurrentPage(1);}}
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

      {sortedOrders.length > 0 && (
        <div className="pagination-controls-top">
          <div className="items-per-page-selector">
            <label htmlFor="itemsPerPage">Show: </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="pagination-info">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedOrders.length)} of {sortedOrders.length} orders
          </div>
        </div>
      )}

      {isLoading ? (
        <Loading />
      ) : currentOrders.length > 0 ? (
        <>
          {currentOrders.map((order) => (
            <div
              className={`order-card ${order.status.toLowerCase() === "completed" ? "completed-card" : ""}`}
              key={order.id}
            >

              <div className="order-info">
                <p>
                  <FaUser className="info-icon" /> <strong>{order.customer?.name || "N/A"}</strong>
                </p>
                {order.date && (
                  <p>
                    <FaCalendarAlt className="info-icon" /> {formatDateDMY(order.date)}
                  </p>
                )}

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
                <button className="delete-btn" onClick={() => deleteOrder(order.id)}>
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

          {totalPages > 1 && (
            <div className="pagination-controls">
              <div className="pagination-buttons">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className="pagination-btn"
                  title="Previous Page"
                >
                  <FaAngleLeft />
                </button>
                
                {getPageNumbers().map((pageNumber, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNumber === 'number' ? paginate(pageNumber) : null}
                    className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''} ${typeof pageNumber !== 'number' ? 'disabled' : ''}`}
                    disabled={typeof pageNumber !== 'number'}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                  title="Next Page"
                >
                  <FaAngleRight />
                </button>
              </div>
            </div>
          )}

          <Modal isOpen={invoiceModalOpen} toggle={handleCloseInvoice} size="md">
            <ModalHeader toggle={handleCloseInvoice}>Invoice</ModalHeader>
            <ModalBody className="p-0">
              {selectedOrder && <ViewInvoice invoice={selectedOrder} />}
            </ModalBody>
          </Modal>

          <Modal isOpen={createOrderModalOpen} toggle={handleCloseCreateOrder} size="lg">
            <ModalHeader toggle={handleCloseCreateOrder}>Create Order</ModalHeader>
            <ModalBody className="p-0">
              <CreateOrder toggle={handleCloseCreateOrder} />
            </ModalBody>
          </Modal>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: 50 }}>No orders found.</div>
      )}

    </div>
  );
}