import React, { useState, useEffect } from "react";
import { FaPlus, FaUserEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("customers");
    if (storedData) {
      setCustomers(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (
      !formData.id ||
      !formData.name ||
      !formData.phone ||
      !formData.address
    ) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    if (editMode) {
      setCustomers(
        customers.map((cust) => (cust.id === formData.id ? formData : cust))
      );
      Swal.fire("Updated!", "Customer details updated successfully", "success");
    } else {
      if (customers.find((cust) => cust.id === formData.id)) {
        Swal.fire("Error", "Customer ID already exists!", "error");
        return;
      }
      setCustomers([...customers, formData]);
      Swal.fire("Added!", "New customer added successfully", "success");
    }

    setShowModal(false);
    setFormData({ id: "", name: "", phone: "", address: "" });
    setEditMode(false);
  };

  const handleEdit = (cust) => {
    setFormData(cust);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Are you sure to delete ${name}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setCustomers(customers.filter((cust) => cust.id !== id));
        Swal.fire("Deleted!", "Customer deleted successfully", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-dark mt-5 text-center mb-4">
        Customer Table 
      </h2>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-success px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
          onClick={() => {
            setFormData({ id: "", name: "", phone: "", address: "" });
            setEditMode(false);
            setShowModal(true);
          }}
        >
          <FaPlus /> Add New Customer
        </button>
      </div>

      <table className="table table-striped table-bordered table-hover shadow text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Mobile Number</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((cust) => (
              <tr key={cust.id}>
                <td>{cust.id}</td>
                <td>{cust.name}</td>
                <td>{cust.phone}</td>
                <td>{cust.address}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                      onClick={() => handleEdit(cust)}
                    >
                      <FaUserEdit /> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                      onClick={() => handleDelete(cust.id, cust.name)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No Customers Found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg rounded-4 border-0">
              <div
                className="modal-header bg-gradient text-white rounded-top-4"
                style={{
                  background: "linear-gradient(90deg, #0d6efd, #0dcaf0)",
                }}
              >
                <h5 className="modal-title fw-bold">
                  {editMode ? "Add Edit Form" : "Add Customer Form"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <form>
                  <h5 className="modal-title fw-bold">
                    {editMode ? "Edit Customer Form" : "Add Customer Form"}
                  </h5>

                  <div className="mb-3">
                    <label className="form-label fw-semibold mt-4">
                      Customer ID
                    </label>
                    <input
                      type="text"
                      className="form-control shadow-sm rounded"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="Enter Customer ID"
                      disabled={editMode}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input
                      type="text"
                      className="form-control shadow-sm rounded"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className="form-control shadow-sm rounded"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter Mobile Number"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Address</label>
                    <textarea
                      className="form-control shadow-sm rounded"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter Address"
                      rows="2"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success rounded-pill px-4 shadow-sm"
                  onClick={handleSave}
                >
                  {editMode ? "Update Customer" : "Save Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
