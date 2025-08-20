import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { FaTrashAlt, FaEye, FaSearch } from "react-icons/fa";

const buttonStyles = {
  primary: {
    background: "#0b5ed7",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  secondary: {
    background: "#e0f2fe",
    color: "#075985",
    border: "1px solid #bae6fd",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  subtle: {
    background: "#eef2ff",
    color: "#3730a3",
    border: "1px solid #c7d2fe",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  ghost: {
    background: "#f1f5f9",
    color: "#334155",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  iconDanger: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  iconGhost: {
    background: "transparent",
    color: "#64748b",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  success: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  danger: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default function Orders() {
  const [showForm, setShowForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    billNo: "",
    customerName: "",
    contact: "",
    items: [],
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem("orders");
    if (cached) {
      try {
        setOrders(JSON.parse(cached));
      } catch {
        localStorage.removeItem("orders");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleItemChange = (i, field, value) => {
    const v = field === "qty" || field === "price" ? parseFloat(value || 0) : value;
    const items = [...formData.items];
    items[i] = { ...items[i], [field]: v };
    setFormData((p) => ({ ...p, items }));
  };

  const addItem = () =>
    setFormData((p) => ({
      ...p,
      items: [...(p.items || []), { name: "", qty: 1, price: 0 }],
    }));

  const removeItem = (i) =>
    setFormData((p) => ({ ...p, items: p.items.filter((_, x) => x !== i) }));

  const resetForm = () => setFormData({ billNo: "", customerName: "", contact: "", items: [] });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = {
      ...formData,
      items: (formData.items || []).map((it) => ({
        name: (it.name || "").trim(),
        qty: Number(it.qty || 0),
        price: Number(it.price || 0),
      })),
    };
    if (editIndex !== null) {
      const copy = [...orders];
      copy[editIndex] = cleaned;
      setOrders(copy);
      setEditIndex(null);
      Swal.fire({ icon: "success", title: "Order Updated!", timer: 1200, showConfirmButton: false });
    } else {
      setOrders((p) => [...p, cleaned]);
      Swal.fire({ icon: "success", title: "Order Added!", timer: 1200, showConfirmButton: false });
    }
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (i) => {
    setEditIndex(i);
    setFormData(orders[i]);
    setShowForm(true);
  };

  const handleDelete = (i) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
      color: "#18181b",
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders((p) => p.filter((_, x) => x !== i));
        Swal.fire({ icon: "success", title: "Deleted!", timer: 1000, showConfirmButton: false });
      }
    });
  };

  const openForm = () => {
    resetForm();
    setEditIndex(null);
    setShowForm(true);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  const sumOrder = (order) =>
    (order?.items || []).reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0);

  const plainINR = (val) =>
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number(val || 0)
    );

  const selectedOrderTotal = useMemo(() => (selectedOrder ? sumOrder(selectedOrder) : 0), [
    selectedOrder,
  ]);

  const numberToWordsIndian = (num) => {
    if (num === null || num === undefined) return "";
    let n = Math.round(Number(num) * 100) / 100;
    if (n === 0) return "Zero Rupees Only";
    const rupees = Math.floor(n);
    const paise = Math.round((n - rupees) * 100);
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const two = (n2) => {
      if (n2 < 20) return ones[n2];
      const t = Math.floor(n2 / 10);
      const r = n2 % 10;
      return tens[t] + (r ? " " + ones[r] : "");
    };
    const three = (n3) => {
      const h = Math.floor(n3 / 100);
      const r = n3 % 100;
      return (h ? ones[h] + " Hundred" + (r ? " " : "") : "") + two(r);
    };

    const words = (x) => {
      if (x === 0) return "Zero";
      const crore = Math.floor(x / 10000000);
      x = x % 10000000;
      const lakh = Math.floor(x / 100000);
      x = x % 100000;
      const thousand = Math.floor(x / 1000);
      x = x % 1000;
      const hundred = x;
      let str = "";
      if (crore) str += three(crore) + " Crore";
      if (lakh) str += (str ? " " : "") + three(lakh) + " Lakh";
      if (thousand) str += (str ? " " : "") + three(thousand) + " Thousand";
      if (hundred) str += (str ? " " : "") + three(hundred);
      return str.trim();
    };

    const rw = words(rupees);
    const pw = paise ? words(paise) + " Paise" : "";
    if (rupees && paise) return `${rw} Rupees and ${pw} Only`;
    if (rupees) return `${rw} Rupees Only`;
    return `${pw} Only`;
  };

  const selectedOrderWords = useMemo(() => numberToWordsIndian(selectedOrderTotal), [
    selectedOrderTotal,
  ]);

  const todayStr = useMemo(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }, []);

  const invoiceRef = useRef(null);

  const printInvoice = () => {
    if (!invoiceRef.current) return;

    const invoiceHTML = invoiceRef.current.outerHTML;

    const styles = `
    <style>
      *{box-sizing:border-box}
      @page{size:A4;margin:12mm}
      body{margin:0;font-family:Arial, sans-serif}
      .print-container{width:210mm;max-width:210mm;margin:0 auto}
      .header{text-align:center;border-bottom:1px solid #000;padding:6px 0}
      .title{font-size:18px;font-weight:bold}
      .subTitle{font-size:12px;margin:5px 0}
      .contact{font-size:12px}
      .table{width:100%;border-collapse:collapse;margin-top:6px}
      .table th,.table td{border:1px solid #000;padding:5px}
      .table thead th{background:#d9d9ff;text-align:left}
      .tdRight{text-align:right}
      .billFooter{display:flex;justify-content:space-between;padding:5px;border-top:1px solid #000;font-weight:bold}
      .small{font-size:12px}
      .spaceRow td{border:none !important;height:36px}
    </style>
  `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
    <html>
      <head>
        <title></title>
        ${styles}
      </head>
      <body>
        <div class="print-container">
          ${invoiceHTML}
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Styles (only light mode)
  const themedStyles = {
    ...styles,
    page: {
      ...styles.page,
      background: "linear-gradient(180deg, #f5f7ff 0%, #ffffff 40%)",
      color: "#18181b",
    },
    card: {
      ...styles.card,
      background: "#fff",
      border: styles.card.border,
      color: "#18181b",
      boxShadow: "0 10px 25px rgba(16,24,40,0.10)",
      position: "relative",
      overflow: "hidden",
    },
    cardHead: {
      ...styles.cardHead,
      borderBottom: "1px solid #e6e8f0",
      paddingBottom: 8,
      marginBottom: 8,
    },
    badge: {
      ...styles.badge,
      background: "#eef2ff",
      color: "#3730a3",
      border: "#c7d2fe",
      fontSize: 13,
    },
    amountChip: {
      ...styles.amountChip,
      background: "#ecfdf3",
      color: "#065f46",
      border: "#bbf7d0",
      fontSize: 15,
    },
    cardActions: {
      ...styles.cardActions,
      marginTop: 8,
    },
    cardBody: {
      ...styles.cardBody,
      fontSize: 15,
    },
    modalContent: {
      ...styles.modalContent,
      background: "#fff",
      color: "#18181b",
      border: styles.modalContent.border,
    },
    input: {
      ...styles.input,
      background: "#fff",
      color: "#18181b",
      border: styles.input.border,
    },
    itemsTable: {
      ...styles.itemsTable,
      border: styles.itemsTable.border,
    },
    itemsHeaderRow: {
      ...styles.itemsHeaderRow,
      background: styles.itemsHeaderRow.background,
      color: "#18181b",
    },
    itemsRow: {
      ...styles.itemsRow,
      borderTop: styles.itemsRow.borderTop,
    },
    modal: {
      ...styles.modal,
      background: styles.modal.background,
    },
    invoiceBar: {
      ...styles.invoiceBar,
      background: styles.invoiceBar.background,
      color: "#18181b",
      borderBottom: styles.invoiceBar.borderBottom,
    },
    label: {
      ...styles.label,
      color: "#6b7280",
    },
    value: {
      ...styles.value,
      color: "#0b1b3a",
    },
    title: {
      ...styles.title,
      color: "#0b1b3a",
    },
    subtitle: {
      ...styles.subtitle,
      color: "#5b6b8c",
    },
  };

  // Button styles (only light mode)
  const themedButtonStyles = {
    ...buttonStyles,
    secondary: {
      ...buttonStyles.secondary,
      background: "#e0f2fe",
      color: "#075985",
      borderColor: "#bae6fd",
    },
    primary: {
      ...buttonStyles.primary,
      background: "#0b5ed7",
      color: "#fff",
    },
    subtle: {
      ...buttonStyles.subtle,
      background: "#eef2ff",
      color: "#3730a3",
      borderColor: "#c7d2fe",
    },
    ghost: {
      ...buttonStyles.ghost,
      background: "#f1f5f9",
      color: "#334155",
    },
    iconDanger: {
      ...buttonStyles.iconDanger,
      background: "#fee2e2",
      color: "#991b1b",
    },
    iconGhost: {
      ...buttonStyles.iconGhost,
      color: "#64748b",
    },
    success: {
      ...buttonStyles.success,
      background: "#16a34a",
      color: "#fff",
    },
    danger: {
      ...buttonStyles.danger,
      background: "#ef4444",
      color: "#fff",
    },
  };

  return (
    <div style={themedStyles.page}>
      <div style={themedStyles.header}>
        <div style={themedStyles.headerLeft}>
          <h2 style={themedStyles.title}>Orders</h2>
          <p style={themedStyles.subtitle}>Create, view and manage your orders easily</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", width: 459 }}>
            <FaSearch
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                fontSize: 18,
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search by customer name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                height: 40,
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                padding: "0 14px 0 38px", // left padding for icon
                fontSize: 15,
                background: "#fff",
                color: "#18181b",
                outline: "none",
                minWidth: 180,
                marginRight: 8,
                width: "100%",
              }}
            />
          </div>
          <button style={themedButtonStyles.primary} onClick={openForm} aria-label="Create order">
            <span style={{ fontSize: 20, lineHeight: 1 }}></span>
            <span>Add Order</span>
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={themedStyles.emptyWrap}>
          <div style={themedStyles.emptyIcon}></div>
          <div style={themedStyles.emptyTitle}>No orders yet</div>
          <div style={themedStyles.emptyText}>Click "Add Order" to create your first order.</div>
          <button style={{ ...themedButtonStyles.primary, marginTop: 10 }} onClick={openForm}>
            <span style={{ fontSize: 18 }}></span> Create Order
          </button>
        </div>
      ) : (
        <div style={themedStyles.cardContainer}>
          {[...orders]
            .reverse()
            .filter(order =>
              order.customerName?.toLowerCase().includes(search.trim().toLowerCase())
            )
            .map((order, i) => {
              const originalIndex = orders.length - 1 - i;
              const total = sumOrder(order);
              return (
                <div key={originalIndex} style={{
                  ...themedStyles.card,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "stretch",
                  gap: 0,
                  padding: 18,
                  margin: 0,
                }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = "0 12px 32px rgba(59,130,246,0.18)"}
                  onMouseOut={e => e.currentTarget.style.boxShadow = themedStyles.card.boxShadow}
                >
                  {/* Left side: Data */}
                  <div style={{
                    flex: "1 1 220px",
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    justifyContent: "center",
                  }}>
                    <div style={{ ...themedStyles.row, fontSize: 20 }}>
                      <span style={{ ...themedStyles.label, fontSize: 18 }}>Customer</span>
                      <span style={{ ...themedStyles.value, fontSize: 20 }}>{order.customerName || "—"}</span>
                    </div>
                    <div style={{ ...themedStyles.row, fontSize: 20 }}>
                      <span style={{ ...themedStyles.label, fontSize: 18 }}>Contact</span>
                      <span style={{ ...themedStyles.value, fontSize: 20 }}>{order.contact || "—"}</span>
                    </div>
                    <div style={{ ...themedStyles.totalRow, fontSize: 22, fontWeight: 700, marginTop: 8 }}>
                      <span>Grand Total</span>
                      <b>₹ {plainINR(total)}</b>
                    </div>
                  </div>
                  {/* Right side: Buttons */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    alignItems: "flex-end",
                    justifyContent: "center",
                    minWidth: 140,
                  }}>
                    <button className="btn btn-outline-primary" onClick={() => handleEdit(originalIndex)} title="Edit">
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => handleDelete(originalIndex)} title="Delete">
                      <FaTrashAlt />
                    </button>
                    <button className="btn btn-outline-success" onClick={() => handleView(order)} title="View Invoice">
                      <FaEye />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {showForm && (
        <div style={themedStyles.modal} role="dialog" aria-modal="true">
          <div
            style={{
              ...themedStyles.modalContent,
              width: "100%",
              maxWidth: 700,
              padding: 0,
              overflow: "hidden",
              background: "#fff",
              color: "#18181b",
              border: "1px solid #e6e8f0",
              display: "flex",
              flexDirection: "column",
              maxHeight: "92vh",
              boxShadow: "0 12px 40px rgba(30,41,59,0.25)",
            }}
          >
            <div style={{
              ...themedStyles.invoiceBar,
              background: "#f8fafc",
              color: "#0b5ed7",
              borderBottom: "#e6e8f0",
              flex: "0 0 auto",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 1,
              justifyContent: "space-between",
            }}>
              <span>{editIndex !== null ? "Edit Order" : "Create New Order"}</span>
              <button style={themedButtonStyles.ghost} onClick={() => { setShowForm(false); setEditIndex(null); }}>✖️</button>
            </div>
            <form
              onSubmit={handleSubmit}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <div style={{
                padding: 28,
                background: "#f9fafb",
                color: "#18181b",
                flex: 1,
                overflowY: "auto",
                minHeight: 0,
                borderRadius: 0,
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                  marginBottom: 18,
                }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: "block", color: "#0b1b3a" }}>
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Customer Name"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      style={{
                        ...themedStyles.input,
                        fontSize: 16,
                        borderRadius: 8,
                        border: "1.5px solid #cbd5e1",
                        background: "#fff",
                        color: "#18181b",
                        marginBottom: 0,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, display: "block", color: "#0b1b3a" }}>
                      Contact
                    </label>
                    <input
                      type="text"
                      name="contact"
                      placeholder="Contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      style={{
                        ...themedStyles.input,
                        fontSize: 16,
                        borderRadius: 8,
                        border: "1.5px solid #cbd5e1",
                        background: "#fff",
                        color: "#18181b",
                        marginBottom: 0,
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  fontWeight: 700,
                  fontSize: 16,
                  margin: "18px 0 8px",
                  color: "#0b1b3a",
                  letterSpacing: 0.5,
                }}>Items</div>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#fff",
                  color: "#18181b",
                  marginBottom: 10,
                  borderRadius: 10,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(16,24,40,0.08)",
                }}>
                  <thead>
                    <tr>
                      <th style={{
                        background: "#d9d9ff",
                        color: "#18181b",
                        padding: "10px 6px",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "1px solid #e5e7eb",
                        textAlign: "center",
                      }}>S.No</th>
                      <th style={{
                        background: "#d9d9ff",
                        color: "#18181b",
                        padding: "10px 6px",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "1px solid #e5e7eb",
                        textAlign: "center",
                      }}>Particulars</th>
                      <th style={{
                        background: "#d9d9ff",
                        color: "#18181b",
                        padding: "10px 6px",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "1px solid #e5e7eb",
                        textAlign: "center",
                      }}>Qty</th>
                      <th style={{
                        background: "#d9d9ff",
                        color: "#18181b",
                        padding: "10px 6px",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "1px solid #e5e7eb",
                        textAlign: "center",
                      }}>Rate</th>
                      <th style={{
                        background: "#d9d9ff",
                        color: "#18181b",
                        padding: "10px 6px",
                        fontWeight: 700,
                        fontSize: 14,
                        border: "1px solid #e5e7eb",
                        textAlign: "center",
                      }}>Total</th>
                      <th style={{
                        background: "#d9d9ff",
                        border: "1px solid #e5e7eb",
                        textAlign: "center",
                        width: 40,
                      }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(formData.items || []).length > 0 ? (
                      formData.items.map((item, idx) => {
                        const qty = Number(item.qty || 0);
                        const price = Number(item.price || 0);
                        const lineTotal = qty * price;
                        return (
                          <tr key={idx}>
                            <td style={{
                              color: "#18181b",
                              border: "1px solid #e5e7eb",
                              textAlign: "center",
                              fontWeight: 600,
                              fontSize: 15,
                              background: "#fff",
                            }}>{idx + 1}</td>
                            <td style={{
                              border: "1px solid #e5e7eb",
                              textAlign: "center",
                              background: "#fff",
                            }}>
                              <input
                                type="text"
                                placeholder="Item Name"
                                value={item.name}
                                onChange={e => handleItemChange(idx, "name", e.target.value)}
                                required
                                style={{
                                  width: "89%",
                                  background: "#fff",
                                  color: "#18181b",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: 6,
                                  padding: "6px 8px",
                                  fontSize: 15,
                                  margin:10
                                }}
                              />
                            </td>
                            <td style={{
                              border: "1px solid #e5e7eb",
                              textAlign: "center",
                              background: "#fff",
                            }}>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="Qty"
                                value={item.qty}
                                onChange={e => handleItemChange(idx, "qty", e.target.value)}
                                required
                                style={{
                                  width: "60px",
                                  background: "#fff",
                                  color: "#18181b",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: 6,
                                  padding: "6px 8px",
                                  fontSize: 15,
                                  textAlign: "center",
                                }}
                              />
                            </td>
                            <td style={{
                              border: "1px solid #e5e7eb",
                              textAlign: "center",
                              background: "#fff",
                            }}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Rate"
                                value={item.price}
                                onChange={e => handleItemChange(idx, "price", e.target.value)}
                                required
                                style={{
                                  width: "80px",
                                  background: "#fff",
                                  color: "#18181b",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: 6,
                                  padding: "6px 8px",
                                  fontSize: 15,
                                  textAlign: "center",
                                }}
                              />
                            </td>
                            <td style={{
                              border: "1px solid #e5e7eb",
                              textAlign: "center",
                              background: "#fff",
                              fontWeight: 600,
                              fontSize: 15,
                            }}>
                              {isNaN(lineTotal) ? "0.00" : lineTotal.toFixed(2)}
                            </td>
                            <td style={{
                              border: "1px solid #e5e7eb",
                              textAlign: "center",
                              background: "#fff",
                            }}>
                              <button
                                type="button"
                                onClick={() => removeItem(idx)}
                                style={{
                                  background: "#fee2e2",
                                  color: "#991b1b",
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "4px 8px",
                                  cursor: "pointer",
                                  fontWeight: 700,
                                  margin:10
                                }}
                                title="Remove item"
                              >❌</button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} style={{
                          textAlign: "center",
                          fontStyle: "italic",
                          color: "#18181b",
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                        }}>No Items</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={6} style={{ border: "none", padding: 0, textAlign: "left", background: "transparent" }}>
                        <button
                          type="button"
                          onClick={addItem}
                          style={{
                            margin: 8,
                            background: "#e0f2fe",
                            color: "#075985",
                            border: "1px solid #bae6fd",
                            borderRadius: 8,
                            padding: "6px 14px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >➕ Add Item</button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style={{
                  padding: 10,
                  borderTop: "1px solid #e5e7eb",
                  color: "#18181b",
                  display: "flex",
                  justifyContent: "flex-end",
                  fontWeight: "bold",
                  fontSize: 17,
                  background: "#f8fafc",
                  borderRadius: 0,
                }}>
                  <span style={{ marginRight: 18 }}>Grand Total: </span>
                  <span>
                    {plainINR(
                      (formData.items || []).reduce(
                        (s, it) => s + Number(it.qty || 0) * Number(it.price || 0),
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                padding: 18,
                borderTop: "1px solid #e5e7eb",
                background: "#f8fafc",
                flex: "0 0 auto",
                borderRadius: "0 0 18px 18px",
              }}>
                <button
                  type="button"
                  style={themedButtonStyles.ghost}
                  onClick={() => { setShowForm(false); setEditIndex(null); }}
                >Cancel</button>
                <button
                  type="submit"
                  style={themedButtonStyles.primary}
                >Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInvoice && selectedOrder && (
        <div style={themedStyles.modal} role="dialog" aria-modal="true">
          <div
            style={{
              ...themedStyles.modalContent,
              width: "95%",
              maxWidth: 820,
              padding: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
            }}
          >
            <div style={themedStyles.invoiceBar}>
              <div style={themedStyles.invoiceTitle}></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={printInvoice} style={themedButtonStyles.success} title="Print">Print</button>
                <button style={themedButtonStyles.ghost} onClick={() => setShowInvoice(false)}>Close</button>
              </div>
            </div>

            <div
              ref={invoiceRef}
              style={{
                padding: 10,
                flex: 1,
                overflowY: "auto", 
                minHeight: 0,
              }}
            >
              <div style={invoiceStyles.outer}>
                <div style={invoiceStyles.container}>
                  <div style={invoiceStyles.header}>
                    <div style={invoiceStyles.title}>लक्ष्मी जनरल स्टोअर्स</div>
                    <div style={invoiceStyles.subTitle}>
                      शालेय साहित्य, ऑफीस स्टेशनरी, प्रेझेंट आर्टिकल्स, टॉइज, गॉगल्स

                      रेसिडेन्शिअल हायस्कूल समोर, <br />
                      मिरी रोड शेवगाव ता . शेवगाव, जि . अहिल्यानगर
                    </div>
                    <div style={invoiceStyles.contact}>मो. नं . 9850837400 
                      9850332356</div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: 5, width: "70%" }}>
                          <b>To,</b><br />
                          {selectedOrder.customerName || "-"}<br />
                          Mobile: {selectedOrder.contact || "-"}
                        </td>
                        <td style={{ padding: 5, width: "30%" }}>
                          <b>Bill No.:</b> {selectedOrder.billNo || "-"}<br />
                          <b>Date:</b> {todayStr}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table style={invoiceStyles.table} className="table">
                    <thead>
                      <tr>
                        <th style={invoiceStyles.th}>S.No</th>
                        <th style={invoiceStyles.th}>Particulars</th>
                        <th style={invoiceStyles.th}>Qty</th>
                        <th style={invoiceStyles.th}>Rate</th>
                        <th style={invoiceStyles.th}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.items || []).length > 0 ? (
                        selectedOrder.items.map((item, idx) => {
                          const qty = Number(item.qty || 0);
                          const price = Number(item.price || 0);
                          const lineTotal = qty * price;
                          return (
                            <tr key={idx}>
                              <td style={invoiceStyles.td}>{idx + 1}</td>
                              <td style={invoiceStyles.td}>{item.name || "-"}</td>
                              <td style={invoiceStyles.tdRight}>{String(qty)}</td>
                              <td style={invoiceStyles.tdRight}>{plainINR(price)}</td>
                              <td style={invoiceStyles.tdRight}>{plainINR(lineTotal)}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ ...invoiceStyles.td, textAlign: "center", fontStyle: "italic" }}>No Items</td>
                        </tr>
                      )}
                      <tr className="spaceRow">
                        <td colSpan={5} style={{ height: 40, border: "none" }}></td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ padding: 5, borderTop: "1px solid #000" }}>
                    <div style={invoiceStyles.small}>
                      <b>Bill Amount in Words:</b> {selectedOrderWords || "—"}
                    </div>
                    <div style={invoiceStyles.billFooter}>
                      <span>Bill Amount:</span>
                      <span>{plainINR(selectedOrderTotal)}</span>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 12 }}>E &amp; O E</div>
                  </div>

                  {/* Customer & Laxmi General Signatures */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 40,
                    padding: "0 10px 10px 10px",
                  }}>
                    <div style={{ textAlign: "center", width: "40%" }}>
                      <div style={{ borderTop: "1px solid #000", margin: "0 auto", width: "80%" }}></div>
                      <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600 }}>Customer Signature</div>
                    </div>
                    <div style={{ textAlign: "center", width: "40%" }}>
                      <div style={{ borderTop: "1px solid #000", margin: "0 auto", width: "80%" }}></div>
                      <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600 }}>Laxmi General Signature</div>
                    </div>
                  </div>
                  {/* End signatures */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
    background: "linear-gradient(180deg, #f5f7ff 0%, #ffffff 40%)",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 10,
  },
  headerLeft: { display: "flex", flexDirection: "column" },
  title: { margin: 0, fontSize: 26, fontWeight: 800, color: "#0b1b3a" },
  subtitle: { margin: 0, color: "#5b6b8c", fontSize: 13 },

  emptyWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed #c7d2fe",
    background: "#fafaff",
    borderRadius: 16,
    padding: 22,
  },
  emptyIcon: { fontSize: 28, marginBottom: 6 },
  emptyTitle: { fontWeight: 700, color: "#0b1b3a" },
  emptyText: { color: "#55607a", fontSize: 13 },

  cardContainer: { display: "flex", flexDirection: "column", gap: 16, marginTop: 12 },

  card: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(4px)",
    padding: 16,
    borderRadius: 18,
    border: "1px solid #e6e8f0",
    boxShadow: "0 10px 25px rgba(236, 234, 233, 0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  badge: {
    background: "#eef2ff",
    color: "#3730a3",
    fontWeight: 700,
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid #c7d2fe",
  },
  amountChip: {
    background: "#ecfdf3",
    color: "#065f46",
    padding: "6px 12px",
    borderRadius: 999,
    fontWeight: 700,
    border: "1px solid #bbf7d0",
    fontSize: 13,
  },
  cardBody: { display: "flex", flexDirection: "column", gap: 6 },
  row: { display: "flex", justifyContent: "space-between", gap: 10 },
  label: { color: "#6b7280", fontSize: 12, fontWeight: 600 },
  value: { color: "#0b1b3a", fontWeight: 600 },

  itemsHead: { fontWeight: 700, color: "#0b1b3a" },
  itemsTable: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  itemsHeaderRow: {
    display: "flex",
    background: "#f3f4f6",
    fontWeight: 700,
    fontSize: 12,
  },
  itemsRow: { display: "flex", borderTop: "1px solid #eef2f7", fontSize: 13 },
  cell: { padding: "8px 10px" },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderTop: "1px dashed #d1d5db",
    marginTop: 6,
    fontSize: 14,
  },

  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 4,
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: 12,
  },
  modalContent: {
    background: "#fff",
    padding: 16,
    borderRadius: 18,
    width: "100%",
    maxWidth: 640,
    boxShadow: "0 30px 80px rgba(2,6,23,0.35)",
    border: "1px solid #e6e8f0",
  },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 800, color: "#0b1b3a" },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
  },
  labelBlock: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: "#334155" },
  input: {
    display: "block",
    width: "100%",
    height: 40,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
    transition: "box-shadow .15s, border-color .15s",
  },
  itemRow: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 8 },

  formActions: { display: "flex", justifyContent: "flex-end", marginTop: 14, gap: 10 },

  invoiceBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    background: "#f8fafc",
  },
  invoiceTitle: { fontWeight: 800, color: "#0b5ed7" },
};

/* ===== Invoice Styles (SBH) – unchanged visuals ===== */
const invoiceStyles = {
  outer: { display: "flex", justifyContent: "center", alignItems: "flex-start", background: "#fff", padding: 0 },
  container: { width: "595px", fontFamily: "Arial, sans-serif", border: "1px solid #000", fontSize: "14px", background: "#fff" },
  header: { textAlign: "center", borderBottom: "1px solid #000", padding: 5 },
  title: { fontSize: "18px", fontWeight: "bold" },
  subTitle: { fontSize: "12px", margin: "5px 0", fontWeight: "bold" },
  contact: { fontSize: "12px", fontWeight: "bold"},
  table: { width: "100%", borderCollapse: "collapse", marginTop: 5 },
  th: { border: "1px solid #000", background: "#d9d9ff", padding: 5, textAlign: "left" },
  td: { border: "1px solid #000", padding: 5 },
  tdRight: { border: "1px solid #000", padding: 5, textAlign: "right" },
  billFooter: { display: "flex", justifyContent: "space-between", padding: 5, borderTop: "1px solid #000", fontWeight: "bold" },
  small: { fontSize: "12px" },
};
