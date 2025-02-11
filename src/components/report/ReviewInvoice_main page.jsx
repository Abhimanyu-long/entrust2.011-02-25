import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ReviewInvoice = () => {
  return (
    <div className="container mt-5 p-5 shadow border rounded bg-white">
      {/* Invoice Header */}
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4" style={{ borderColor: '#67c4e4' }}>
        <div>
          <img
            alt="Neural IT Logo"
            src="/src/assets/media/logos/neuralit-logo.png"
            className="w-150px"
          />
        </div>
        <div className="text-end">
          <h2 className="fw-bold mb-0" style={{ color: '#67c4e4' }}>Invoice #34782</h2>
          <p className="text-muted mb-0">Issue Date: 12 June 2024</p>
          <p className="text-muted">Due Date: 30 June 2024 <span className="text-danger">(Due in 7 days)</span></p>
        </div>
      </div>

      {/* Issued For and Issued By Sections */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="border rounded p-3" style={{ borderColor: '#67c4e4', backgroundColor: '#f9f9f9' }}>
            <h6 className="fw-bold" style={{ color: '#67c4e4' }}>Issued For:</h6>
            <p className="mb-0 fw-bold">XL Corporate Law Firm</p>
            <p className="text-muted mb-0">709 Hillview Street</p>
            <p className="text-muted mb-0">Columbia, SC 29201</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-3" style={{ borderColor: '#67c4e4', backgroundColor: '#f9f9f9' }}>
            <h6 className="fw-bold" style={{ color: '#67c4e4' }}>Issued By:</h6>
            <p className="mb-0 fw-bold">Neural IT Pvt. Ltd.</p>
            <p className="text-muted mb-0">MindSpace, Airoli</p>
            <p className="text-muted mb-0">Navi Mumbai, MH 400708</p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="border p-4 mb-4 rounded shadow-sm" style={{ borderColor: '#67c4e4' }}>
        <h6 className="fw-bold mb-3" style={{ color: '#67c4e4' }}>Payment Details</h6>
        <div className="row">
          <div className="col-md-4">
            <p className="mb-1 fw-bold">Payment Method:</p>
            <p className="text-muted">Paypal</p>
          </div>
          <div className="col-md-4">
            <p className="mb-1 fw-bold">Paypal Email:</p>
            <p className="text-muted">pay@neuralit.com</p>
          </div>
          <div className="col-md-4">
            <p className="mb-1 fw-bold">Account No:</p>
            <p className="text-muted">NITAC123456789</p>
          </div>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="border p-4 mb-4 rounded shadow-sm" style={{ borderColor: '#67c4e4' }}>
        <h6 className="fw-bold mb-3" style={{ color: '#67c4e4' }}>Invoice Summary</h6>
        <div className="row">
          <div className="col-md-8">
            <p className="mb-1 fw-bold">HERRON LAW</p>
            <p className="text-muted mb-0">PO Box 1802 Lake Oswego, Oregon 97035</p>
            <p className="text-muted">Lake Oswego OR United States 97035</p>
          </div>
          <div className="col-md-4 text-end">
            <p className="mb-1 fw-bold">Ref No:</p>
            <p className="text-muted">NIT/2024-09/LLC/HL/01</p>
            <p className="mb-1 fw-bold">Date:</p>
            <p className="text-muted">Sep/30/2024</p>
          </div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="border p-4 mb-4 rounded shadow-sm" style={{ borderColor: '#67c4e4' }}>
        <h6 className="fw-bold mb-3" style={{ color: '#67c4e4' }}>Billing Details</h6>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Particulars</th>
              <th>Fixed DL Hours</th>
              <th>DL</th>
              <th>Fixed MR Hours</th>
              <th>MR</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01</td>
              <td>DL-MPM</td>
              <td>15</td>
              <td>3</td>
              <td>20</td>
              <td>8.47</td>
              <td>$214.40</td>
            </tr>
          </tbody>
        </table>
        <p className="fw-bold">Amount in Words:</p>
        <p className="text-muted">Two Hundred Fourteen Dollars and Forty Cents</p>
      </div>

      {/* Referral Section */}
      <div className="p-3 mb-4 text-center bg-info rounded shadow-sm" style={{ backgroundColor: '#67c4e4', color: '#fff' }}>
        <p className="mb-0 fw-bold">
          Refer another law firm to us and RECEIVE A REFERRAL BONUS for every new invoice generated for them. Reduce your billing while helping others benefit from our services!
        </p>
      </div>

      {/* Detailed Statement */}
      <div className="border p-4 rounded shadow-sm" style={{ borderColor: '#67c4e4' }}>
        <h6 className="fw-bold mb-3" style={{ color: '#67c4e4' }}>Detailed Statement for Invoice #058-HL-LLC-09-2024 of DL-MPM</h6>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Case Name</th>
              <th>Fixed DL Hours</th>
              <th>DL</th>
              <th>Fixed MR Hours</th>
              <th>MR</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fitch, Zachery v Rivera Village Apartments</td>
              <td>15</td>
              <td>3</td>
              <td>20</td>
              <td>8.47</td>
              <td>$214.40</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
