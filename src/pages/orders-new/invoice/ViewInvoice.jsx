import React, { useRef } from "react";
import "./Invoice.css";
import Swal from "sweetalert2";
import { toWords } from "number-to-words";
import { formatDateDMY } from "../../../Helpers/dateFormat";

const Invoice = ({ invoice }) => {
  const invoiceRef = useRef(null);
  const customerName = invoice?.customer?.name || "-";
  const phone = invoice?.customer?.phone || "-";
  const id = invoice?.id || "-";
  const date = invoice?.date || "-";
  const items = invoice?.items || [];
  const total_amount = invoice?.total_amount || 0;
  const paid_amount = invoice?.paid_amount || 0;
  const unpaid_amount = invoice?.unpaid_amount || 0;

  const downloadInvoicePDF = () => {
    if (!invoiceRef.current) return;
    Swal.fire({
      title: "Download Invoice PDF?",
      text: "Do you want to download this invoice as PDF?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Download",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#667eea",
      cancelButtonColor: "#64748b",
      background: "#fff",
      color: "#18181b",
    }).then((result) => {
      if (result.isConfirmed) {
        let customerName = invoice?.customer?.id || "Customer";
        customerName = customerName.replace(/[^a-zA-Z0-9]/g, "_");
        const opt = {
          margin: 0.5,
          filename: `Invoice_${customerName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };
        window
          .html2pdf()
          .set(opt)
          .from(invoiceRef.current)
          .save()
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Downloaded!",
              text: "Invoice PDF has been downloaded.",
              confirmButtonColor: "#667eea",
              background: "#fff",
              color: "#18181b",
            });
          });
      }
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        <button
          onClick={downloadInvoicePDF}
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            marginRight: 10,
          }}
        >
          Download PDF
        </button>
      </div>
      <div className="invoice-page">
        <div className="invoice-sheet" id="invoice-sheet" ref={invoiceRef}>
          <div className="invoice-header">
            <div className="owner-info">
              ॥ श्री ॥
            </div>
            <div className="store-title-banner">लक्ष्मी जनरल स्टोअर्स</div>
            <div className="store-subtitle">
              शालेय साहित्य, ऑफिस स्टेशनरी, गिफ्ट, टॉइज, गॉगल्स, घड्याळे,
              क्लिनिंग मटेरियल<br />
              रेसिडेन्शियल हायस्कूल समोर, मिरी रोड, शेवगाव, जि. अहिल्यानगर ४१४५०२ <br />
              ९८५०८३७४००, ९८५०३३२३५६
            </div>
          </div>

          <table className="invoice-details-table">
            <tbody>
              <tr>
                <td className="invoice-id w-50">
                  Bill No - <span>INV_{id}</span>
                  <div className="underline"></div>
                </td>
                <td className="invoice-date">
                  Date - {formatDateDMY(date)}
                  <div className="underline"></div>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="customer-details-table">
            <tbody>
              <tr>
                <td>
                  <strong>To,</strong>
                  <br />
                  {customerName}
                  <br />
                  Mobile: {phone}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="items-table">
            <thead>
              <tr>
                <th className="col-sno">Sr.No</th>
                <th className="col-desc">Particulars</th>
                <th className="col-unit">Unit</th>
                <th className="col-qty">Qty</th>
                <th className="col-rate">Rate</th>
                <th className="col-amt">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.item?.name || "-"}</td>
                    <td>{item?.unit}</td>
                    <td>{item?.quantity || 0}</td>
                    <td>{item?.price || 0}</td>
                    <td>
                      {(item?.quantity * item?.price).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Items
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="amount-row">
            <span>Bill Amount:</span>
            <span>₹ {total_amount.toFixed(2)}</span>
          </div>

          {paid_amount !== total_amount && (
            <div className="amount-row">
              <span>Paid Amount:</span>
              <span>₹ {paid_amount.toFixed(2)}</span>
            </div>
          )}

          {paid_amount > 0 && paid_amount < total_amount && (
            <div className="amount-row">
              <span>Unpaid Amount:</span>
              <span>₹ {unpaid_amount.toFixed(2)}</span>
            </div>
          )}

          <div className="amount-words">
            <strong>Bill Amount in Words:</strong>{" "}
            {toWords(total_amount)} Rupees Only
          </div>

          <div className="bank-details">
            <strong>Bank Details:</strong>
            <div>Account Name - Laxmi General</div>
            <div>Account Number - 42100200000374</div>
            <div>IFSC Code - BARB0SHEVGA</div>
          </div>

          <div className="signatures">
            <div className="signature-box">
              <div className="signature-line"></div>
              <div>Customer Signature</div>
            </div>
            <div className="signature-box">
              <div className="signature-line"></div>
              <div>Laxmi General Signature</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;