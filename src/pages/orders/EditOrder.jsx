import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateBillsData } from "../../store/components/Entities/billsSlice";
import { plainINR } from "../orders/Order.jsx";
import { FaRegFilePdf, FaTrash } from "react-icons/fa";
import { FaSquarePhone } from "react-icons/fa6";

export default function EditOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bills } = useSelector((state) => state.entities.bills);
  const order = bills.data?.find((o) => String(o.id) === String(orderId));
  const [paidAmount, setPaidAmount] = useState(order?.paid_amount || "0");
  const [unpaidAmount, setUnpaidAmount] = useState(order ? Math.max(order.total_amount - Number(order.paid_amount || 0), 0) : 0);
  const [status, setStatus] = useState(order?.status || "Pending");

  useEffect(() => {
    const unpaid = Math.max(order.total_amount - Number(paidAmount || 0), 0);
    setUnpaidAmount(unpaid);
    setStatus(unpaid === 0 ? "Completed" : "Pending");
  }, [paidAmount, order]);

  const handleSave = () => {
    dispatch(updateBillsData({
      data: { token: order.token, id: order.id },
      bills: {
        ...order,
        paid_amount: paidAmount,
        unpaid_amount: unpaidAmount,
        status,
      },
      toggle: () => navigate("/orders"),
      setSubmitting: () => {},
    }));
  };

  if (!order) return <div>Order not found</div>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #e5e7eb", padding: 24 }}>
      <h2 style={{ color: "#0b1b3a", fontWeight: 700 }}>Edit Order</h2>
      <div style={{ marginBottom: 18 }}>
        <div><b>Customer:</b> {order.customerName}</div>
        <div><b>Contact:</b> {order.contact}</div>
        <div><b>Date:</b> {order.date}</div>
        <div><b>Total Amount:</b> {plainINR(order.total_amount)}</div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontWeight: 600 }}>Paid Amount</label>
        <input
          type="number"
          min="0"
          max={order.total_amount}
          value={paidAmount}
          onChange={e => setPaidAmount(Math.min(Number(e.target.value), order.total_amount).toString())}
          style={{ width: "120px", marginLeft: 12, fontWeight: "bold", border: "1px solid #cbd5e1", borderRadius: 6, padding: "4px 8px" }}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <b>Unpaid Amount:</b> {plainINR(unpaidAmount)}
      </div>
      <div style={{ marginBottom: 18 }}>
        <b>Status:</b> {status}
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
        <button onClick={handleSave} style={{ background: "#0b5ed7", color: "#fff", borderRadius: 8, padding: "10px 18px", fontWeight: 700 }}>Save</button>
        <button onClick={() => navigate("/orders")} style={{ background: "#e0f2fe", color: "#075985", borderRadius: 8, padding: "10px 18px", fontWeight: 700 }}>Cancel</button>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 24, justifyContent: "center" }}>
        <FaRegFilePdf style={{ fontSize: 28, color: "#0b5ed7" }} title="Download PDF" />
        <FaSquarePhone style={{ fontSize: 28, color: "#0b5ed7" }} title="Call Customer" />
        <FaTrash style={{ fontSize: 28, color: "#ef4444" }} title="Delete Order" />
      </div>
    </div>
  );
}
