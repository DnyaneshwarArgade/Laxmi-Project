import React, { useState } from "react";

export default function Orders() {
  const [showForm, setShowForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [formData, setFormData] = useState({
    billNo: "",
    customerName: "",
    contact: ""
  });
  const [orders, setOrders] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedOrders = [...orders];
      updatedOrders[editIndex] = formData;
      setOrders(updatedOrders);
      setEditIndex(null);
    } else {
      setOrders([...orders, formData]);
    }
    setShowForm(false);
    setFormData({ billNo: "", customerName: "", contact: "" });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(orders[index]);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
  };

  const openForm = () => {
    setFormData({ billNo: "", customerName: "", contact: "" });
    setEditIndex(null);
    setShowForm(true);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Orders</h2>
        <button style={styles.addButton} onClick={openForm}>+</button>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <p style={styles.emptyText}>No orders yet.</p>
      ) : (
        <div style={styles.cardContainer}>
          {orders.map((order, index) => (
            <div key={index} style={styles.card}>
              <div>
                <h4 style={{ margin: "0 0 8px" }}>Bill No: {order.billNo}</h4>
                <p style={styles.cardText}><strong>Customer:</strong> {order.customerName}</p>
                <p style={styles.cardText}><strong>Contact:</strong> {order.contact}</p>
              </div>
              <div style={styles.cardActions}>
                <button style={styles.iconButton} onClick={() => handleEdit(index)}>✏</button>
                <button style={{ ...styles.iconButton, backgroundColor: "#d9534f" }} onClick={() => handleDelete(index)}>🗑</button>
                <button style={{ ...styles.iconButton, backgroundColor: "#198754" }} onClick={() => handleView(order)}>👁</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>
              {editIndex !== null ? "Edit Order" : "Create New Order"}
            </h3>
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Bill No</label>
              <input
                style={styles.input}
                type="text"
                name="billNo"
                placeholder="Enter Bill No"
                value={formData.billNo}
                onChange={handleChange}
                required
              />

              <label style={styles.label}>Customer Name</label>
              <input
                style={styles.input}
                type="text"
                name="customerName"
                placeholder="Enter Customer Name"
                value={formData.customerName}
                onChange={handleChange}
                required
              />

              <label style={styles.label}>Contact</label>
              <input
                style={styles.input}
                type="text"
                name="contact"
                placeholder="Enter Contact Number"
                value={formData.contact}
                onChange={handleChange}
                required
              />

              <div style={styles.formActions}>
                <button type="submit" style={styles.saveButton}>💾 Save</button>
                <button type="button" style={styles.cancelButton} onClick={() => { setShowForm(false); setEditIndex(null); }}>✖ Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && selectedOrder && (
        <div style={styles.modal}>
          <div style={{ ...styles.modalContent, width: "600px" }}>
            <h2 style={{ textAlign: "center" }}>Invoice</h2>
            <p><strong>Bill No:</strong> {selectedOrder.billNo}</p>
            <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
            <p><strong>Contact:</strong> {selectedOrder.contact}</p>
            <table style={styles.invoiceTable}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sample Item 1</td>
                  <td>2</td>
                  <td>₹50</td>
                  <td>₹100</td>
                </tr>
                <tr>
                  <td>Sample Item 2</td>
                  <td>1</td>
                  <td>₹150</td>
                  <td>₹150</td>
                </tr>
              </tbody>
            </table>
            <h3 style={{ textAlign: "right", marginTop: "10px" }}>Grand Total: ₹250</h3>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button style={styles.cancelButton} onClick={() => setShowInvoice(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#0b5ed7",
    color: "white",
    border: "none",
    padding: "8px 16px",
    fontSize: "22px",
    fontWeight: "bold",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
    marginTop: "10px",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    margin: "4px 0",
    fontSize: "14px",
    color: "#555",
  },
  cardActions: {
    display: "flex",
    gap: "6px",
  },
  iconButton: {
    backgroundColor: "#ffc107",
    color: "white",
    padding: "6px",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "16px",
  },
  modal: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  },
  modalTitle: {
    marginTop: 0,
    marginBottom: "15px",
    textAlign: "center",
    color: "#0b5ed7",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "500",
    fontSize: "14px",
    color: "#333",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  formActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  saveButton: {
    backgroundColor: "#0b5ed7",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#d9534f",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  invoiceTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  invoiceTableThTd: {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "center",
  }
};
