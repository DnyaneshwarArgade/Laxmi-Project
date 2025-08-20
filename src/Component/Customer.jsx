import React, { useState, useEffect } from "react";
import { FaUserEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [search, setSearch] = useState("");

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
    if (!formData.name || !formData.phone || !formData.address) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    setCustomers(
      customers.map((cust) =>
        cust.phone === formData.phone ? formData : cust
      )
    );
    Swal.fire("Updated!", "Customer details updated successfully", "success");

    setShowModal(false);
    setFormData({ name: "", phone: "", address: "" });
  };

  const handleEdit = (cust) => {
    setFormData(cust);
    setShowModal(true);
  };

  const handleDelete = (phone, name) => {
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
        setCustomers(customers.filter((cust) => cust.phone !== phone));
        Swal.fire("Deleted!", "Customer deleted successfully", "success");
      }
    });
  };

  
  const filteredCustomers = customers.filter((cust) =>
    cust.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-dark mt-5 text-center mb-4">
        Customer Table
      </h2>

      
      <div className="d-flex justify-content-center mb-3">
        <input
          type="text"
          placeholder="Search by customer name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control w-50 shadow-sm rounded-pill px-3"
        />
      </div>

    
      <table className="table table-striped table-bordered table-hover shadow text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Mobile Number</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((cust, index) => (
              <tr key={index}>
                <td>{cust.name}</td>
                <td>{cust.phone}</td>
                <td>{cust.address}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(cust)}
                    >
                      <FaUserEdit />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(cust.phone, cust.name)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No Customers Found</td>
            </tr>
          )}
        </tbody>
      </table>

    
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg rounded-4 border-0">
              <div
                className="modal-header text-white rounded-top-4"
                style={{
                  background: "linear-gradient(135deg, #6297b9ff, #070d13ff)",
                }}
              >
                <h5 className="modal-title fw-bold">Edit Customer</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="card border-0 shadow-sm rounded-3 p-3">
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="fw-semibold">Name</label>
                      <input
                        type="text"
                        className="form-control shadow-sm rounded-pill"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Customer Name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="fw-semibold">Mobile Number</label>
                      <input
                        type="text"
                        className="form-control shadow-sm rounded-pill"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter Mobile Number"
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="fw-semibold">Address</label>
                      <textarea
                        className="form-control shadow-sm rounded-3"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter Address"
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                </div>
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
                  Update Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;


