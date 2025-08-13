import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';

function Items() {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);

  // Load from localStorage on first render
  useEffect(() => {
    const storedItems = localStorage.getItem('itemsList');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('itemsList', JSON.stringify(items));
  }, [items]);

  const handleSave = () => {
    if (!itemName.trim()) {
      Swal.fire('Error', 'Please enter an item name', 'error');
      return;
    }
    if (!itemPrice || itemPrice <= 0) {
      Swal.fire('Error', 'Please enter a valid price', 'error');
      return;
    }
    if (!quantity || quantity <= 0) {
      Swal.fire('Error', 'Please enter a valid quantity', 'error');
      return;
    }

    if (isEditMode) {
      const updatedItems = [...items];
      updatedItems[currentItemIndex] = {
        name: itemName,
        price: Number(itemPrice),
        quantity: Number(quantity)
      };
      setItems(updatedItems);

      Swal.fire({
        icon: 'success',
        title: 'Item Updated',
        text: `${itemName} has been updated successfully!`,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      setItems([...items, {
        name: itemName,
        price: Number(itemPrice),
        quantity: Number(quantity)
      }]);

      Swal.fire({
        icon: 'success',
        title: 'Item Added',
        text: `${itemName} has been added successfully!`,
        timer: 2000,
        showConfirmButton: false
      });
    }

    setItemName('');
    setItemPrice('');
    setQuantity('');
    setIsEditMode(false);
    setCurrentItemIndex(null);
    setShowModal(false);
  };

  const handleEdit = (index) => {
    const item = items[index];
    setItemName(item.name);
    setItemPrice(item.price);
    setQuantity(item.quantity);
    setIsEditMode(true);
    setCurrentItemIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the item",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setItems(items.filter((_, i) => i !== index));
        Swal.fire('Deleted!', 'Item has been deleted.', 'success');
      }
    });
  };

  return (
    <div className="container mt-4">
      {/* Header + Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Items List</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setIsEditMode(false);
            setItemName('');
            setItemPrice('');
            setQuantity('');
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-lg"></i> Add Item
        </button>
      </div>

      {/* Items List */}
      {items.map((item, index) => (
        <div key={index} className="item-card shadow-sm mb-3 p-3 d-flex justify-content-between align-items-center">
          <span className="fw-semibold">{item.name}  -  <small className="text-muted">(₹ {item.price})</small></span>
          <div>
            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={() => handleEdit(index)}
            >
              <i className="bi bi-pencil-fill"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => handleDelete(index)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(3px)"
          }}
        >
         <div className="modal-dialog modal-dialog-centered" role="document">
  <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">

    {/* Modal Header */}
    <div
      className="modal-header text-white"
      style={{
        background: "linear-gradient(135deg, #6297b9ff, #070d13ff)",
        borderBottom: "none",
        padding: "1rem 1.5rem",
      }}
    >
      <h5 className="modal-title fw-bold d-flex align-items-center">
        <i className="bi bi-plus-circle me-2 text-warning"></i>
        {isEditMode ? 'Edit Item' : 'Add New Item'}
      </h5>
      <button
        type="button"
        className="btn-close btn-close-white"
        onClick={() => setShowModal(false)}
      ></button>
    </div>

    {/* Modal Body */}
    <div className="modal-body p-4 bg-light">
      <div className="mb-3">
        <label className="form-label fw-semibold">Item Name</label>
        <input
          type="text"
          className="form-control form-control-lg shadow-sm border-0 rounded-3"
          placeholder="Enter item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Item Price</label>
        <input
          type="number"
          className="form-control form-control-lg shadow-sm border-0 rounded-3"
          placeholder="Enter item price"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Quantity</label>
        <input
          type="number"
          className="form-control form-control-lg shadow-sm border-0 rounded-3"
          placeholder="Enter item quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
    </div>

    {/* Modal Footer */}
    <div
      className="modal-footer"
      style={{
        background: "linear-gradient(135deg, #f1f1f1, #e4e4e4)",
        borderTop: "none",
        padding: "1rem 1.5rem",
      }}
    >
      <button
        type="button"
        className="btn btn-outline-secondary px-4 rounded-pill"
        onClick={() => setShowModal(false)}
      >
        <i className="bi bi-x-circle me-1"></i> Close
      </button>
      <button
        type="button"
        className="btn btn-success px-4 rounded-pill shadow-sm"
        style={{
          background: "linear-gradient(135deg, #28a745, #218838)",
          border: "none",
        }}
        onClick={handleSave}
      >
        <i className="bi bi-check-circle me-1"></i> Save
      </button>
    </div>

  </div>
</div>

        </div>
      )}

    </div>
  );
}

export default Items;
