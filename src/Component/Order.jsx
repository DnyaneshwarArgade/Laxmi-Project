import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function Orders() {
  const [showForm, setShowForm] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [theme, setTheme] = useState("light");

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
      background: theme === "dark" ? "#23272f" : "#fff",
      color: theme === "dark" ? "#e5e7eb" : "#18181b",
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
        <title>Invoice</title>
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

  // Theme toggle handler
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // Merge theme styles
  const themedStyles = {
    ...styles,
    page: {
      ...styles.page,
      background: theme === "dark"
        ? "linear-gradient(180deg, #23272f 0%, #18181b 40%)"
        : styles.page.background,
      color: theme === "dark" ? "#e5e7eb" : "#18181b",
      transition: "background 0.3s, color 0.3s",
    },
    card: {
      ...styles.card,
      background: theme === "dark"
        ? "linear-gradient(135deg, #23272f 60%, #334155 100%)"
        : "#fff", // Light mode: pure white card
      border: theme === "dark" ? "1px solid #334155" : styles.card.border,
      color: theme === "dark" ? "#e5e7eb" : "#18181b",
      boxShadow: theme === "dark"
        ? "0 8px 32px rgba(30,41,59,0.35)"
        : "0 10px 25px rgba(16,24,40,0.10)",
      transition: "box-shadow 0.2s, background 0.3s, color 0.3s",
      position: "relative",
      overflow: "hidden",
    },
    cardHead: {
      ...styles.cardHead,
      borderBottom: theme === "dark" ? "1px solid #475569" : "1px solid #e6e8f0",
      paddingBottom: 8,
      marginBottom: 8,
    },
    badge: {
      ...styles.badge,
      background: theme === "dark" ? "#334155" : "#eef2ff",
      color: theme === "dark" ? "#facc15" : "#3730a3",
      border: theme === "dark" ? "1px solid #64748b" : "#c7d2fe",
      fontSize: 13,
    },
    amountChip: {
      ...styles.amountChip,
      background: theme === "dark" ? "#18181b" : "#ecfdf3",
      color: theme === "dark" ? "#facc15" : "#065f46",
      border: theme === "dark" ? "1px solid #64748b" : "#bbf7d0",
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
      background: theme === "dark" ? "#23272f" : "#fff",
      color: theme === "dark" ? "#e5e7eb" : "#18181b",
      border: theme === "dark" ? "1px solid #334155" : styles.modalContent.border,
    },
    input: {
      ...styles.input,
      background: theme === "dark" ? "#18181b" : "#fff",
      color: theme === "dark" ? "#e5e7eb" : "#18181b",
      border: theme === "dark" ? "1px solid #334155" : styles.input.border,
    },
    itemsTable: {
      ...styles.itemsTable,
      border: theme === "dark" ? "1px solid #334155" : styles.itemsTable.border,
    },
    itemsHeaderRow: {
      ...styles.itemsHeaderRow,
      background: theme === "dark" ? "#23272f" : styles.itemsHeaderRow.background,
      color: theme === "dark" ? "#e5e7eb" : "#18181b",
    },
    itemsRow: {
      ...styles.itemsRow,
      borderTop: theme === "dark" ? "1px solid #334155" : styles.itemsRow.borderTop,
    },
    modal: {
      ...styles.modal,
      background: theme === "dark" ? "rgba(24,24,27,0.85)" : styles.modal.background,
    },
    invoiceBar: {
      ...styles.invoiceBar,
      background: theme === "dark" ? "#23272f" : styles.invoiceBar.background,
      color: theme === "dark" ? "#e5e7eb" : "#18181b",
      borderBottom: theme === "dark" ? "1px solid #334155" : styles.invoiceBar.borderBottom,
    },
    label: {
      ...styles.label,
      color: theme === "dark" ? "#facc15" : "#6b7280", // yellow in dark, gray in light
    },
    value: {
      ...styles.value,
      color: theme === "dark" ? "#fff" : "#0b1b3a", // white in dark, dark blue in light
    },
    title: {
      ...styles.title,
      color: theme === "dark" ? "#facc15" : "#0b1b3a", // yellow in dark, dark blue in light
    },
    subtitle: {
      ...styles.subtitle,
      color: theme === "dark" ? "#e5e7eb" : "#5b6b8c", // light gray in dark, blue-gray in light
    },
  };

  // Button styles theme support
  const themedButtonStyles = {
    ...buttonStyles,
    secondary: {
      ...buttonStyles.secondary,
      background: theme === "dark" ? "#18181b" : "#e0f2fe",
      color: theme === "dark" ? "#facc15" : "#075985",
      borderColor: theme === "dark" ? "#334155" : "#bae6fd",
    },
    primary: {
      ...buttonStyles.primary,
      background: theme === "dark" ? "#0b5ed7" : "#0b5ed7",
      color: "#fff",
    },
    subtle: {
      ...buttonStyles.subtle,
      background: theme === "dark" ? "#334155" : "#eef2ff",
      color: theme === "dark" ? "#facc15" : "#3730a3",
      borderColor: theme === "dark" ? "#64748b" : "#c7d2fe",
    },
    ghost: {
      ...buttonStyles.ghost,
      background: theme === "dark" ? "#23272f" : "#f1f5f9",
      color: theme === "dark" ? "#e5e7eb" : "#334155",
    },
    iconDanger: {
      ...buttonStyles.iconDanger,
      background: theme === "dark" ? "#7f1d1d" : "#fee2e2",
      color: theme === "dark" ? "#f87171" : "#991b1b",
    },
    iconGhost: {
      ...buttonStyles.iconGhost,
      color: theme === "dark" ? "#e5e7eb" : "#64748b",
    },
    success: {
      ...buttonStyles.success,
      background: theme === "dark" ? "#166534" : "#16a34a",
      color: "#fff",
    },
    danger: {
      ...buttonStyles.danger,
      background: theme === "dark" ? "#991b1b" : "#ef4444",
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
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={themedButtonStyles.secondary}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
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
          {orders.map((order, i) => {
            const total = sumOrder(order);
            return (
              <div key={i} style={themedStyles.card}
                onMouseOver={e => e.currentTarget.style.boxShadow = "0 12px 32px rgba(59,130,246,0.18)"}
                onMouseOut={e => e.currentTarget.style.boxShadow = themedStyles.card.boxShadow}
              >
                <div style={themedStyles.cardHead}>
                  <div style={themedStyles.badge}>#{order.billNo || "—"}</div>
                  <div style={themedStyles.amountChip}>₹ {plainINR(total)}</div>
                </div>

                <div style={themedStyles.cardBody}>
                  <div style={themedStyles.row}>
                    <span style={themedStyles.label}>Customer</span>
                    <span style={themedStyles.value}>{order.customerName || "—"}</span>
                  </div>
                  <div style={themedStyles.row}>
                    <span style={themedStyles.label}>Contact</span>
                    <span style={themedStyles.value}>{order.contact || "—"}</span>
                  </div>

                  {!!order.items?.length && (
                    <div style={{ marginTop: 10 }}>
                      <div style={themedStyles.itemsHead}>Items</div>
                      <div style={themedStyles.itemsTable}>
                        <div style={themedStyles.itemsHeaderRow}>
                          <div style={{ ...themedStyles.cell, flex: 3 }}>Particular</div>
                          <div style={{ ...themedStyles.cell, flex: 1, textAlign: "right" }}>Qty</div>
                          <div style={{ ...themedStyles.cell, flex: 1, textAlign: "right" }}>Rate</div>
                          <div style={{ ...themedStyles.cell, flex: 1, textAlign: "right" }}>Total</div>
                        </div>
                        {(order.items || []).map((it, j) => {
                          const line = Number(it.qty || 0) * Number(it.price || 0);
                          return (
                            <div key={j} style={themedStyles.itemsRow}>
                              <div style={{ ...themedStyles.cell, flex: 3 }}>{it.name || "—"}</div>
                              <div style={{ ...themedStyles.cell, flex: 1, textAlign: "right" }}>{String(it.qty || 0)}</div>
                              <div style={{ ...themedStyles.cell, flex: 1, textAlign: "right" }}>₹ {plainINR(it.price || 0)}</div>
                              <div style={{ ...themedStyles.cell, flex: 1, textAlign: "right" }}>₹ {plainINR(line)}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={themedStyles.totalRow}>
                        <span>Grand Total</span>
                        <b>₹ {plainINR(total)}</b>
                      </div>
                    </div>
                  )}
                </div>

                <div style={themedStyles.cardActions}>
                  <button style={themedButtonStyles.subtle} onClick={() => handleEdit(i)} title="Edit">
                    <span role="img" aria-label="edit"></span>Edit
                  </button>
                  <button style={themedButtonStyles.danger} onClick={() => handleDelete(i)} title="Delete">
                    <span role="img" aria-label="delete"></span>Delete
                  </button>
                  <button style={themedButtonStyles.success} onClick={() => handleView(order)} title="View Invoice">
                    <span role="img" aria-label="view"></span>View
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
              width: "95%",
              maxWidth: 820,
              padding: 0,
              overflow: "hidden",
              background: theme === "dark" ? "#18181b" : "#fff",
              color: theme === "dark" ? "#fff" : "#18181b",
              border: theme === "dark" ? "1px solid #334155" : "#e6e8f0",
            }}
          >
            <div style={{
              ...themedStyles.invoiceBar,
              background: theme === "dark" ? "#23272f" : themedStyles.invoiceBar.background,
              color: theme === "dark" ? "#fff" : themedStyles.invoiceBar.color,
              borderBottom: theme === "dark" ? "1px solid #334155" : themedStyles.invoiceBar.borderBottom,
            }}>
              <div style={{ ...themedStyles.invoiceTitle, color: theme === "dark" ? "#facc15" : "#0b5ed7" }}>
                {editIndex !== null ? "Edit Order" : "Create New Order"}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={themedButtonStyles.ghost} onClick={() => { setShowForm(false); setEditIndex(null); }}>Close</button>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{
                padding: 18,
                background: theme === "dark" ? "#23272f" : "#fff",
                color: theme === "dark" ? "#fff" : "#18181b",
              }}>
                <div style={{
                  ...invoiceStyles.outer,
                  background: theme === "dark" ? "#23272f" : "#fff",
                  color: theme === "dark" ? "#fff" : "#18181b",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: 0,
                }}>
                  <div style={{
                    ...invoiceStyles.container,
                    background: theme === "dark" ? "#18181b" : "#fff",
                    color: theme === "dark" ? "#fff" : "#18181b",
                    border: theme === "dark" ? "1px solid #334155" : "#000",
                    margin: "0 auto",
                  }}>
                    <div style={{
                      ...invoiceStyles.header,
                      borderBottom: theme === "dark" ? "1px solid #334155" : "#000",
                      color: theme === "dark" ? "#facc15" : "#18181b",
                    }}>
                      <div style={{
                        ...invoiceStyles.title,
                        color: theme === "dark" ? "#facc15" : "#18181b",
                      }}>SBH</div>
                      <div style={{
                        ...invoiceStyles.subTitle,
                        color: theme === "dark" ? "#e5e7eb" : "#18181b",
                      }}>
                        "Hiranandani Towers", Shimpi Lane,<br />
                        Near Meera Medical, Telikhunt Chowk,<br />
                        Ahmednagar - 414 111
                      </div>
                      <div style={{
                        ...invoiceStyles.contact,
                        color: theme === "dark" ? "#e5e7eb" : "#18181b",
                      }}>Mob: 9225326077, 8552907871</div>
                    </div>

                    <table style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      background: theme === "dark" ? "#23272f" : "#fff",
                      color: theme === "dark" ? "#fff" : "#18181b",
                      marginBottom: 10,
                    }}>
                      <tbody>
                        <tr>
                          <td style={{
                            padding: 8,
                            width: "70%",
                            color: theme === "dark" ? "#fff" : "#18181b",
                            verticalAlign: "top",
                          }}>
                            <b>To,</b><br />
                            <input
                              type="text"
                              name="customerName"
                              placeholder="Customer Name"
                              value={formData.customerName}
                              onChange={handleChange}
                              required
                              style={{
                                width: "95%",
                                margin: "6px 0",
                                background: theme === "dark" ? "#23272f" : "#fff",
                                color: theme === "dark" ? "#fff" : "#18181b",
                                border: "1px solid #cbd5e1",
                                borderRadius: 6,
                                padding: "8px 10px",
                                fontSize: 15,
                                fontWeight: 500,
                              }}
                            /><br />
                            <span style={{ fontWeight: 600 }}>Mobile:</span>{" "}
                            <input
                              type="text"
                              name="contact"
                              placeholder="Contact"
                              value={formData.contact}
                              onChange={handleChange}
                              required
                              style={{
                                width: "70%",
                                margin: "6px 0",
                                background: theme === "dark" ? "#23272f" : "#fff",
                                color: theme === "dark" ? "#fff" : "#18181b",
                                border: "1px solid #cbd5e1",
                                borderRadius: 6,
                                padding: "8px 10px",
                                fontSize: 15,
                                fontWeight: 500,
                              }}
                            />
                          </td>
                          <td style={{
                            padding: 8,
                            width: "30%",
                            color: theme === "dark" ? "#fff" : "#18181b",
                            verticalAlign: "top",
                          }}>
                            <b>Bill No.:</b>{" "}
                            <input
                              type="text"
                              name="billNo"
                              placeholder="Bill No"
                              value={formData.billNo}
                              onChange={handleChange}
                              required
                              style={{
                                width: "80%",
                                margin: "6px 0",
                                background: theme === "dark" ? "#23272f" : "#fff",
                                color: theme === "dark" ? "#fff" : "#18181b",
                                border: "1px solid #cbd5e1",
                                borderRadius: 6,
                                padding: "8px 10px",
                                fontSize: 15,
                                fontWeight: 500,
                              }}
                            /><br />
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table style={{
                      ...invoiceStyles.table,
                      background: theme === "dark" ? "#23272f" : "#fff",
                      color: theme === "dark" ? "#fff" : "#18181b",
                      marginBottom: 10,
                    }}>
                      <thead>
                        <tr>
                          <th style={{
                            ...invoiceStyles.th,
                            background: theme === "dark" ? "#18181b" : "#d9d9ff",
                            color: theme === "dark" ? "#fff" : "#18181b",
                            border: theme === "dark" ? "1px solid #334155" : "#000",
                            textAlign: "center",
                          }}>S.No</th>
                          <th style={{
                            ...invoiceStyles.th,
                            background: theme === "dark" ? "#18181b" : "#d9d9ff",
                            color: theme === "dark" ? "#fff" : "#18181b",
                            border: theme === "dark" ? "1px solid #334155" : "#000",
                            textAlign: "center",
                          }}>Particulars</th>
                          <th style={{
                            ...invoiceStyles.th,
                            background: theme === "dark" ? "#18181b" : "#d9d9ff",
                            color: theme === "dark" ? "#fff" : "#18181b",
                            border: theme === "dark" ? "1px solid #334155" : "#000",
                            textAlign: "center",
                          }}>Qty</th>
                          <th style={{
                            ...invoiceStyles.th,
                            background: theme === "dark" ? "#18181b" : "#d9d9ff",
                            color: theme === "dark" ? "#fff" : "#18181b",
                            border: theme === "dark" ? "1px solid #334155" : "#000",
                            textAlign: "center",
                          }}>Rate</th>
                          <th style={{
                            ...invoiceStyles.th,
                            background: theme === "dark" ? "#18181b" : "#d9d9ff",
                            color: theme === "dark" ? "#fff" : "#18181b",
                            border: theme === "dark" ? "1px solid #334155" : "#000",
                            textAlign: "center",
                          }}>Total</th>
                          <th style={{
                            ...invoiceStyles.th,
                            background: theme === "dark" ? "#18181b" : "#d9d9ff",
                            color: theme === "dark" ? "#fff" : "#18181b",
                            border: theme === "dark" ? "1px solid #334155" : "#000",
                            textAlign: "center",
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
                                  ...invoiceStyles.td,
                                  color: theme === "dark" ? "#fff" : "#18181b",
                                  border: theme === "dark" ? "1px solid #334155" : "#000",
                                  textAlign: "center",
                                }}>{idx + 1}</td>
                                <td style={{
                                  ...invoiceStyles.td,
                                  color: theme === "dark" ? "#fff" : "#18181b",
                                  border: theme === "dark" ? "1px solid #334155" : "#000",
                                  textAlign: "center",
                                }}>
                                  <input
                                    type="text"
                                    placeholder="Item Name"
                                    value={item.name}
                                    onChange={e => handleItemChange(idx, "name", e.target.value)}
                                    required
                                    style={{
                                      width: "98%",
                                      background: theme === "dark" ? "#23272f" : "#fff",
                                      color: theme === "dark" ? "#fff" : "#18181b",
                                      border: "1px solid #cbd5e1",
                                      borderRadius: 6,
                                      padding: "6px 8px",
                                      fontSize: 15,
                                    }}
                                  />
                                </td>
                                <td style={{
                                  ...invoiceStyles.tdRight,
                                  color: theme === "dark" ? "#fff" : "#18181b",
                                  border: theme === "dark" ? "1px solid #334155" : "#000",
                                  textAlign: "center",
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
                                      background: theme === "dark" ? "#23272f" : "#fff",
                                      color: theme === "dark" ? "#fff" : "#18181b",
                                      border: "1px solid #cbd5e1",
                                      borderRadius: 6,
                                      padding: "6px 8px",
                                      fontSize: 15,
                                      textAlign: "center",
                                    }}
                                  />
                                </td>
                                <td style={{
                                  ...invoiceStyles.tdRight,
                                  color: theme === "dark" ? "#fff" : "#18181b",
                                  border: theme === "dark" ? "1px solid #334155" : "#000",
                                  textAlign: "center",
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
                                      background: theme === "dark" ? "#23272f" : "#fff",
                                      color: theme === "dark" ? "#fff" : "#18181b",
                                      border: "1px solid #cbd5e1",
                                      borderRadius: 6,
                                      padding: "6px 8px",
                                      fontSize: 15,
                                      textAlign: "center",
                                    }}
                                  />
                                </td>
                                <td style={{
                                  ...invoiceStyles.tdRight,
                                  color: theme === "dark" ? "#fff" : "#18181b",
                                  border: theme === "dark" ? "1px solid #334155" : "#000",
                                  textAlign: "center",
                                  fontWeight: 600,
                                }}>
                                  {isNaN(lineTotal) ? "0.00" : lineTotal.toFixed(2)}
                                </td>
                                <td style={{
                                  ...invoiceStyles.td,
                                  border: theme === "dark" ? "1px solid #334155" : "#000",
                                  textAlign: "center"
                                }}>
                                  <button
                                    type="button"
                                    onClick={() => removeItem(idx)}
                                    style={{
                                      background: theme === "dark" ? "#7f1d1d" : "#fee2e2",
                                      color: theme === "dark" ? "#f87171" : "#991b1b",
                                      border: "none",
                                      borderRadius: 6,
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                      fontWeight: 700,
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
                              ...invoiceStyles.td,
                              textAlign: "center",
                              fontStyle: "italic",
                              color: theme === "dark" ? "#fff" : "#18181b",
                              border: theme === "dark" ? "1px solid #334155" : "#000",
                            }}>No Items</td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan={6} style={{ border: "none", padding: 0, textAlign: "left" }}>
                            <button
                              type="button"
                              onClick={addItem}
                              style={{
                                margin: 8,
                                background: theme === "dark" ? "#23272f" : "#e0f2fe",
                                color: theme === "dark" ? "#facc15" : "#075985",
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
                      padding: 8,
                      borderTop: theme === "dark" ? "1px solid #334155" : "1px solid #000",
                      color: theme === "dark" ? "#fff" : "#18181b",
                      display: "flex",
                      justifyContent: "flex-end",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}>
                      <span style={{ marginRight: 16 }}>Grand Total: </span>
                      <span>
                        {plainINR(
                          (formData.items || []).reduce(
                            (s, it) => s + Number(it.qty || 0) * Number(it.price || 0),
                            0
                          )
                        )}
                      </span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 10,
                      padding: 14,
                      borderTop: theme === "dark" ? "1px solid #334155" : "1px solid #e5e7eb",
                      background: theme === "dark" ? "#23272f" : "#f8fafc"
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
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInvoice && selectedOrder && (
        <div style={themedStyles.modal} role="dialog" aria-modal="true">
          <div style={{ ...themedStyles.modalContent, width: "95%", maxWidth: 820, padding: 0, overflow: "hidden" }}>
            <div style={themedStyles.invoiceBar}>
              <div style={themedStyles.invoiceTitle}>Invoice</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={printInvoice} style={themedButtonStyles.success} title="Print">Print</button>
                <button style={themedButtonStyles.ghost} onClick={() => setShowInvoice(false)}>Close</button>
              </div>
            </div>

            <div ref={invoiceRef} style={{ padding: 10 }}>
              <div style={invoiceStyles.outer}>
                <div style={invoiceStyles.container}>
                  <div style={invoiceStyles.header}>
                    <div style={invoiceStyles.title}>SBH</div>
                    <div style={invoiceStyles.subTitle}>
                      "Hiranandani Towers", Shimpi Lane,<br />
                      Near Meera Medical, Telikhunt Chowk,<br />
                      Ahmednagar - 414 111
                    </div>
                    <div style={invoiceStyles.contact}>Mob: 9225326077, 8552907871</div>
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

const buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid transparent",
  borderRadius: 12,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 700,
  transition: "transform .06s ease, box-shadow .2s ease, background .2s ease",
  boxShadow: "0 8px 20px rgba(59,130,246,0.12)",
};

const buttonStyles = {
  primary: {
    ...buttonBase,
    background: "#0b5ed7",
    color: "#fff",
  },
  secondary: {
    ...buttonBase,
    background: "#e0f2fe",
    color: "#075985",
    borderColor: "#bae6fd",
    boxShadow: "0 8px 20px rgba(2,132,199,0.14)",
  },
  success: { ...buttonBase, background: "#16a34a", color: "#fff", boxShadow: "0 8px 20px rgba(22,163,74,0.18)" },
  danger: { ...buttonBase, background: "#ef4444", color: "#fff", boxShadow: "0 8px 20px rgba(239,68,68,0.18)" },
  subtle: { ...buttonBase, background: "#eef2ff", color: "#3730a3", borderColor: "#c7d2fe" },
  ghost: { ...buttonBase, background: "#f1f5f9", color: "#334155", boxShadow: "none" },
  iconDanger: { ...buttonBase, background: "#fee2e2", color: "#991b1b", padding: "8px 10px", boxShadow: "none" },
  iconGhost: { ...buttonBase, background: "transparent", color: "#64748b", padding: 8, boxShadow: "none" },
};

/* ===== Invoice Styles (SBH) – unchanged visuals ===== */
const invoiceStyles = {
  outer: { display: "flex", justifyContent: "center", alignItems: "flex-start", background: "#fff", padding: 0 },
  container: { width: "595px", fontFamily: "Arial, sans-serif", border: "1px solid #000", fontSize: "14px", background: "#fff" },
  header: { textAlign: "center", borderBottom: "1px solid #000", padding: 5 },
  title: { fontSize: "18px", fontWeight: "bold" },
  subTitle: { fontSize: "12px", margin: "5px 0" },
  contact: { fontSize: "12px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 5 },
  th: { border: "1px solid #000", background: "#d9d9ff", padding: 5, textAlign: "left" },
  td: { border: "1px solid #000", padding: 5 },
  tdRight: { border: "1px solid #000", padding: 5, textAlign: "right" },
  billFooter: { display: "flex", justifyContent: "space-between", padding: 5, borderTop: "1px solid #000", fontWeight: "bold" },
  small: { fontSize: "12px" },
};
