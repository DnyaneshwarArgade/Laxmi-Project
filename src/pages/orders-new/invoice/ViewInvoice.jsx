import React from 'react';
import './Invoice.css';

const Invoice = ({ invoice }) => {
  const customerName = invoice?.customer?.name || "-";
  const phone = invoice?.customer?.phone || "-";
  const id = invoice?.id || "-";
  const date = invoice?.date || "-";
  const items = invoice?.items || [];
  const total_amount = invoice?.total_amount || 0;
  const paid_amount = invoice?.paid_amount || 0;
  const unpaid_amount = invoice?.unpaid_amount || 0;

  const formatDateDMY = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
  };

  const numberToWordsIndian = (num) => {
    if (num === 0) return "Zero Rupees Only";
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
    const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

    if(num < 10) return ones[num] + " Rupees Only";
    if(num < 20) return teens[num-10] + " Rupees Only";
    if(num < 100) return tens[Math.floor(num/10)] + (num%10 !== 0 ? ' '+ones[num%10] : '') + " Rupees Only";
    if(num < 1000) return ones[Math.floor(num/100)] + " Hundred" + (num%100 !== 0 ? ' ' + numberToWordsIndian(num%100) : ' Rupees Only');

    return num + " Rupees Only";
  };

  return (
    <div className="invoice-page">
      <div className="invoice-sheet" id="invoice-sheet">

        <div className="invoice-header">
          <div className="owner-info">
            प्रोप्रा. रविंद्र भुसारे | मो. ९८५०८३७४०० / ९८५०३३२३५६
          </div>
          <div className="store-title-banner">
            लक्ष्मी जनरल स्टोअर्स
          </div>
          <div className="store-subtitle">
            शालेय साहित्य, गृहउपयोगी, ऑफिस मटेरियल व सौंदर्य प्रसाधनांचे विक्रेते प्रेझेंटेशन आर्टिकल, रिस्टरवॉच, वॉच क्लॉक (रेसिडेन्शियल हायस्कूल समोर, मिरी रोड, शेवगाव, जि. अहिल्यानगर ४१४५०२)
          </div>
        </div>

        <table className="invoice-details-table">
          <tbody>
            <tr>
              <td className="invoice-id">
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
                <strong>To,</strong><br />
                {customerName}<br />
                Mobile: {phone}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="items-table">
          <thead>
            <tr>
              <th className="col-sno text-center">S.No</th>
              <th className="col-desc">Particulars</th>
              <th className="col-unit text-center">Unit</th>
              <th className="col-qty text-center">Qty</th>
              <th className="col-rate text-center">Rate</th>
              <th className="col-amt text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{item?.item?.name || "-"}</td>
                  <td className="text-center">{item?.unit}</td>
                  <td className="text-center">{item?.quantity || 0}</td>
                  <td className="text-center">{item?.price || 0}</td>
                  <td className="text-center">{(item?.quantity * item?.price).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No Items</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="amount-row">
          <span>Bill Amount:</span>
          <span>₹ {total_amount.toFixed(2)}</span>
        </div>
        <div className="amount-row">
          <span>Paid Amount:</span>
          <span>₹ {paid_amount.toFixed(2)}</span>
        </div>
        {unpaid_amount > 0 && (
          <div className="amount-row">
            <span>Unpaid Amount:</span>
            <span>₹ {unpaid_amount.toFixed(2)}</span>
          </div>
        )}

        <div className="amount-words">
          <strong>Bill Amount in Words:</strong> {numberToWordsIndian(total_amount)}
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
  );
};

export default Invoice;
