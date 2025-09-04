import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBillsData } from "../../store/components/Entities/billsSlice";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

export default function EditOrderModal({ isOpen, toggle, order }) {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.login);

  const [paidAmount, setPaidAmount] = useState(order?.paid_amount || "0");
  const [unpaidAmount, setUnpaidAmount] = useState(
    order ? Math.max(order.total_amount - Number(order.paid_amount || 0), 0) : 0
  );
  const [status, setStatus] = useState(order?.status || "Pending");

  const plainINR = (val) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val || 0));
  useEffect(() => {
    const unpaid = Math.max(order.total_amount - Number(paidAmount || 0), 0);
    setUnpaidAmount(unpaid);
    setStatus(unpaid === 0 ? "Completed" : "Pending");
  }, [paidAmount, order]);

  const handleSave = () => {
    dispatch(
      updateBillsData({
        data: { token: login.token, id: order.id },
        bills: {
          ...order,
          paid_amount: paidAmount,
          unpaid_amount: unpaidAmount,
          status,
        },
        toggle,
        setSubmitting: () => {},
      })
    );
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Edit Order</ModalHeader>
      <ModalBody>
        <div style={{ marginBottom: 18 }}>
          <div>
            <b>Customer:</b> {order.customerName}
          </div>
          <div>
            <b>Contact:</b> {order.contact}
          </div>
          <div>
            <b>Date:</b> {order.date}
          </div>
          <div>
            <b>Total Amount:</b> {plainINR(order.total_amount)}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>Paid Amount</label>
          <input
            type="number"
            min="0"
            max={order.total_amount}
            value={paidAmount}
            onChange={(e) =>
              setPaidAmount(
                Math.min(Number(e.target.value), order.total_amount).toString()
              )
            }
            style={{
              width: "120px",
              marginLeft: 12,
              fontWeight: "bold",
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              padding: "4px 8px",
            }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <b>Unpaid Amount:</b> {plainINR(unpaidAmount)}
        </div>
        <div style={{ marginBottom: 18 }}>
          <b>Status:</b> {status}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
