import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';

function Items() {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);

  useEffect(() => {
    const storedItems = localStorage.getItem('itemsList');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('itemsList', JSON.stringify(items));
  }, [items]);

  const handleSave = () => {
    if (!newItem.name.trim()) {
      Swal.fire('Error', 'Please enter an item name', 'error');
      return;
    }
    // if (!newItem.price || newItem.price <= 0) {
    //   Swal.fire('Error', 'Please enter a valid price', 'error');
    //   return;
    // }
    // if (!newItem.quantity || newItem.quantity <= 0) {
    //   Swal.fire('Error', 'Please enter a valid quantity', 'error');
    //   return;
    // }

    if (isEditMode) {
      const updatedItems = [...items];
      updatedItems[currentItemIndex] = newItem;
      setItems(updatedItems);
      Swal.fire({
        icon: 'success',
        title: 'Item Updated',
        text: `${newItem.name} has been updated successfully!`,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      setItems([...items, {
        name: newItem.name,
        price: Number(newItem.price),
        quantity: Number(newItem.quantity)
      }]);
      Swal.fire({
        icon: 'success',
        title: 'Item Added',
        text: `${newItem.name} has been added successfully!`,
        timer: 2000,
        showConfirmButton: false
      });
    }

    setNewItem({ name: '', price: '', quantity: '' });
    setIsEditMode(false);
    setCurrentItemIndex(null);
    setShowModal(false);
  };

  const handleEdit = (index) => {
    const item = items[index];
    setNewItem({ name: item.name, price: item.price, quantity: item.quantity });
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

        Swal.fire({
          title: 'Deleted!',
          text: 'Item has been deleted.',
          icon: 'success',
          showConfirmButton: false, 
          timer: 1500                
        });
      }
    });
  };



  const updateItemField = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };


  return (
    <div className="container mt-4">
      <div className="position-relative mb-3">
        {/* Center Heading */}
        <h4 className="mb-0 text-center">Items List</h4>

        {/* Right Side Button */}
        <button
          className="btn btn-primary btn-md position-absolute end-0 top-50 translate-middle-y"
          onClick={() => {
            setIsEditMode(false);
            setNewItem({ name: '', price: '', quantity: '' });
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-lg"></i> Add Item
        </button>
      </div>



      {items.map((item, index) => (
        <div
          key={index}
          className="item-card shadow-sm mb-3 p-3 d-flex align-items-start flex-wrap"
          style={{ gap: '0.5rem' }}
        >
          {/* Item Name */}
          <div
            className="fw-semibold flex-grow-1"
            style={{ minWidth: '0', wordBreak: 'break-word', whiteSpace: 'normal' }}
          >
            {item.name}
          </div>

          {/* Price */}
          <div
            className="text-end flex-shrink-0"
            style={{ minWidth: '80px' }}
          >
            ₹ {item.price}
          </div>

          {/* Actions */}
          <div
            className="d-flex flex-shrink-0 justify-content-end"
            style={{ minWidth: '120px', gap: '0.5rem' }}
          >
            <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(index)}>
              <i className="bi bi-pencil-fill"></i>
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(index)}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      ))}


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
              <div
                className="modal-header text-white"
                style={{
                  background: "linear-gradient(135deg, #6297b9ff, #070d13ff)",
                  borderBottom: "none",
                  padding: "1rem 1.5rem",
                }}
              >
                <h5 className="modal-title fw-bold d-flex align-items-center">
                  {isEditMode ? 'Edit Item' : 'Add New Item'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4 bg-light">
                <div className="border rounded-3 p-3 mb-3 bg-white shadow-sm position-relative">
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Item Name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg shadow-lg border-0 rounded-3"
                      placeholder="Enter item name"
                      value={newItem.name}
                      onChange={(e) => updateItemField('name', e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Item Price</label>
                    <input
                      type="number"
                      className="form-control form-control-lg shadow-lg border-0 rounded-3"
                      placeholder="Enter item price"
                      value={newItem.price}
                      onChange={(e) => updateItemField('price', e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Quantity</label>
                    <input
                      type="number"
                      className="form-control form-control-lg shadow-lg border-0 rounded-3"
                      placeholder="Enter item quantity"
                      value={newItem.quantity}
                      onChange={(e) => updateItemField('quantity', e.target.value)}
                    />
                  </div>
                </div>
              </div>

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
