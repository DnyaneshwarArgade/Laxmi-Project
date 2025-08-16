import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch } from "react-icons/fa";

export default function InvoiceSearch() {
  const [billNo, setBillNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  // Sample Bill Data
  const bills = [
    {
      billNo: "101",
      date: "13/08/2025",
      customerName: "Laxmi General Shevgaon",
      mobile: "9850837400",
      items: [
        { sr: 1, particulars: "Pp Pishvi", qty: 10, rate: 55, total: 550 },
        { sr: 2, particulars: "Wire Pishavi", qty: 5, rate: 190, total: 950 },
      ],
    },
    {
      billNo: "102",
      date: "14/08/2025",
      customerName: "Rahul Patil",
      mobile: "9876543210",
      items: [
        { sr: 1, particulars: "Box", qty: 2, rate: 100, total: 200 },
        { sr: 2, particulars: "Bag", qty: 1, rate: 250, total: 250 },
      ],
    },
  ];

  const searchBill = () => {
    setLoading(true);
    setInvoiceData(null);
    setTimeout(() => {
      const bill = bills.find((b) => b.billNo === billNo.trim());
      setInvoiceData(bill || null);
      setLoading(false);
    }, 1500);
  };

  const styles = {
    outer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5",
      padding: "10px",
    },
    container: {
      width: "100%",
      maxWidth: "595px",
      fontFamily: "Arial, sans-serif",
      border: "1px solid #000",
      fontSize: "14px",
      background: "#fff",
      overflowX: "auto",
    },
    header: {
      textAlign: "center",
      borderBottom: "1px solid #000",
      padding: "5px",
    },
    title: { fontSize: "18px", fontWeight: "bold" },
    subTitle: { fontSize: "12px", margin: "5px 0", fontWeight: "bold"},
    contact: { fontSize: "12px", fontWeight: "bold"},
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "5px",
      minWidth: "500px",
    },
    th: {
      border: "1px solid #000",
      background: "#d9d9ff",
      padding: "5px",
      textAlign: "left",
    },
    td: { border: "1px solid #000", padding: "5px" },
    tdRight: { border: "1px solid #000", padding: "5px", textAlign: "right" },
    billFooter: {
      display: "flex",
      justifyContent: "space-between",
      padding: "5px",
      borderTop: "1px solid #000",
      fontWeight: "bold",
      flexWrap: "wrap",
    },
    small: { fontSize: "12px" },
    searchBox: {
      display: "flex",
      alignItems: "center",
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      borderRadius: "50px",
      padding: "5px 10px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      width: "100%",
    },
    input: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      padding: "10px 15px",
      fontSize: "16px",
    },
    button: {
      border: "none",
      outline: "none",
      background: "#007bff",
      color: "#fff",
      borderRadius: "50px",
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      cursor: "pointer",
      transition: "0.3s",
    },
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "100%" }}>
      {/* Search Bar */}
      <div className="mb-4" style={{ maxWidth: "600px", margin: "auto" }}>
        <div style={styles.searchBox}>
          <input
            type="text"
            style={styles.input}
            placeholder="🔍 Enter Bill No"
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
          />
          <button
            style={styles.button}
            onClick={searchBill}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#0056b3")
            }
            onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
          >
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading bill details...</p>
        </div>
      )}

      {/* Invoice Display */}
      {!loading && invoiceData && (
        <div style={styles.outer}>
          <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.header}>
              <div style={styles.title}>लक्ष्मी जनरल स्टोअर्स</div>
              <div style={styles.subTitle}>
                शालेय साहित्य, ऑफीस स्टेशनरी, प्रेझेंट आर्टिकल्स, टॉइज, गॉगल्स

                रेसिडेन्शिअल हायस्कूल समोर, <br />
                मिरी रोड शेवगाव ता . शेवगाव, जि . अहिल्यानगर
              </div>
              <div style={styles.contact}>
                Mob: 9225326077, 8552907871
              </div>
            </div>

            {/* BILL INFO */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "5px", width: "70%" }}>
                    <b>To,</b>
                    <br />
                    {invoiceData.customerName}
                    <br />
                    Mobile: {invoiceData.mobile}
                  </td>
                  <td style={{ padding: "5px", width: "30%" }}>
                    <b>Bill No.:</b> {invoiceData.billNo}
                    <br />
                    <b>Date:</b> {invoiceData.date}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ITEMS TABLE */}
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>S.No</th>
                    <th style={styles.th}>Particulars</th>
                    <th style={styles.th}>Qty</th>
                    <th style={styles.th}>Rate</th>
                    <th style={styles.th}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item) => (
                    <tr key={item.sr}>
                      <td style={styles.td}>{item.sr}</td>
                      <td style={styles.td}>{item.particulars}</td>
                      <td style={styles.tdRight}>{item.qty.toFixed(2)}</td>
                      <td style={styles.tdRight}>{item.rate.toFixed(2)}</td>
                      <td style={styles.tdRight}>{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5" style={{ height: "40px", border: "none" }}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BILL AMOUNT */}
            <div style={{ padding: "5px", borderTop: "1px solid #000" }}>
              <div style={styles.small}>
                <b>Bill Amount in Words:</b> Rupees{" "}
                {invoiceData.items
                  .reduce((sum, i) => sum + i.total, 0)
                  .toLocaleString()}{" "}
                Only
              </div>
              <div style={styles.billFooter}>
                <span>Bill Amount:</span>
                <span>
                  {invoiceData.items
                    .reduce((sum, i) => sum + i.total, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div style={{ textAlign: "right", fontSize: "12px" }}>E & O E</div>
            </div>
          </div>
        </div>
      )}

      {/* No Bill Found */}
      {!loading && invoiceData === null && billNo && (
        <div className="text-center mt-4">
          <div
            style={{
              display: "inline-block",
              padding: "20px",
              background: "#fff3f3",
              border: "1px solid #ffb3b3",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(255,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "40px", color: "red" }}>⚠️</div>
            <h5 style={{ color: "red", marginTop: "10px" }}>Bill Not Found</h5>
            <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
              Please check the Bill No and try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
