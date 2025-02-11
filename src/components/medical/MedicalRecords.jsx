import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Form, Button, Row, Col } from "react-bootstrap";

export const MedicalRecords = () => {
    const [requestId, setRequestId] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedState, setSelectedState] = useState("");
  
    const [status, setStatus] = useState('');
    const [dateType, setDateType] = useState('');
    const [requestType, setRequestType] = useState('internal');
    const [prePayment, setPrePayment] = useState('both');
    const [paymentStatus, setPaymentStatus] = useState('both');
    const [invoiceUploaded, setInvoiceUploaded] = useState('both');
    const [billingReport, setBillingReport] = useState(false);
    const [sentForBilling, setSentForBilling] = useState(false);
    const [uspsTracking, setUspsTracking] = useState(false);
    const [checkIsAdditional, setCheckIsAdditional] = useState(false);
  
    // Options for the dropdowns
    const projectOptions = [
      "Arbitration",
      "Bill of Particulars",
      "Chronologies and Medical Summaries",
      "Claim Validation",
      "Client Relationship Management",
      "Complaint",
    ];
  
    const stateOptions = [".", "Airoli", "AK"];
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const formData = {
        requestId,
        selectedProject,
        selectedState,
        status,
        dateType,
        requestType,
        prePayment,
        paymentStatus,
        invoiceUploaded,
        billingReport,
        sentForBilling,
        uspsTracking,
        checkIsAdditional,
      };
      // console.log(formData);
    };

  return (
    <>
      <Accordion
        defaultActiveKey="1"
        className="card card-flush accordionCard m-6"
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <label className="form-label">Search Filter</label>
          </Accordion.Header>
          <Accordion.Body>
           <>
           <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formRequestId" className="mb-3">
        <Form.Label>REQUEST ID:</Form.Label>
        <Form.Control
          as="textarea"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          placeholder="Enter Request ID"
          style={{ height: "60px" }}
        />
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="formProject">
            <Form.Label>PROJECT:</Form.Label>
            <Form.Control
              as="select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Choose</option>
              {projectOptions.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="formState">
            <Form.Label>STATE:</Form.Label>
            <Form.Control
              as="select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Choose</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="formStatus">
            <Form.Label>Status:</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Choose</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="formDateType">
            <Form.Label>Date Type:</Form.Label>
            <Form.Control
              as="select"
              value={dateType}
              onChange={(e) => setDateType(e.target.value)}
            >
              <option value="">Choose</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="formDateFrom">
            <Form.Label>Date From:</Form.Label>
            <Form.Control type="date" />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="formDateTo">
            <Form.Label>Date To:</Form.Label>
            <Form.Control type="date" />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="formRecordsForPast" className="mb-3">
        <Form.Label>Records for Past:</Form.Label>
        <Form.Control type="number" placeholder="Days" />
      </Form.Group>

      <Form.Group controlId="formRequestType" className="mb-3">
        <Form.Label>Request Type:</Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id="internal"
            label="Internal"
            name="requestType"
            value="internal"
            checked={requestType === "internal"}
            onChange={() => setRequestType("internal")}
          />
          <Form.Check
            inline
            type="radio"
            id="external"
            label="External"
            name="requestType"
            value="external"
            checked={requestType === "external"}
            onChange={() => setRequestType("external")}
          />
        </div>
      </Form.Group>

      <Form.Group controlId="formPrePayment" className="mb-3">
        <Form.Label>Pre Payment:</Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id="yes"
            label="Yes"
            name="prePayment"
            value="yes"
            checked={prePayment === "yes"}
            onChange={() => setPrePayment("yes")}
          />
          <Form.Check
            inline
            type="radio"
            id="no"
            label="No"
            name="prePayment"
            value="no"
            checked={prePayment === "no"}
            onChange={() => setPrePayment("no")}
          />
          <Form.Check
            inline
            type="radio"
            id="both"
            label="Both"
            name="prePayment"
            value="both"
            checked={prePayment === "both"}
            onChange={() => setPrePayment("both")}
          />
        </div>
      </Form.Group>

      <Form.Group controlId="formPaymentStatus" className="mb-3">
        <Form.Label>Payment Status:</Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id="paymentDone"
            label="Payment Done"
            name="paymentStatus"
            value="paymentDone"
            checked={paymentStatus === "paymentDone"}
            onChange={() => setPaymentStatus("paymentDone")}
          />
          <Form.Check
            inline
            type="radio"
            id="paymentPending"
            label="Payment Pending"
            name="paymentStatus"
            value="paymentPending"
            checked={paymentStatus === "paymentPending"}
            onChange={() => setPaymentStatus("paymentPending")}
          />
          <Form.Check
            inline
            type="radio"
            id="bothStatus"
            label="Both"
            name="paymentStatus"
            value="both"
            checked={paymentStatus === "both"}
            onChange={() => setPaymentStatus("both")}
          />
        </div>
      </Form.Group>

      <Form.Group controlId="formInvoiceUploaded" className="mb-3">
        <Form.Label>Invoice Uploaded:</Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            id="invoiceYes"
            label="Yes"
            name="invoiceUploaded"
            value="yes"
            checked={invoiceUploaded === "yes"}
            onChange={() => setInvoiceUploaded("yes")}
          />
          <Form.Check
            inline
            type="radio"
            id="invoiceNo"
            label="No"
            name="invoiceUploaded"
            value="no"
            checked={invoiceUploaded === "no"}
            onChange={() => setInvoiceUploaded("no")}
          />
          <Form.Check
            inline
            type="radio"
            id="invoiceBoth"
            label="Both"
            name="invoiceUploaded"
            value="both"
            checked={invoiceUploaded === "both"}
            onChange={() => setInvoiceUploaded("both")}
          />
        </div>
      </Form.Group>

      <Form.Group controlId="formOtherOptions" className="mb-3">
        <Form.Label>Other Options:</Form.Label>
        <div>
          <Form.Check
            className="mb-4"
            type="checkbox"
            id="billingReport"
            label="Billing Report"
            checked={billingReport}
            onChange={() => setBillingReport(!billingReport)}
          />
          <Form.Check
            className="mb-4"
            type="checkbox"
            id="sentForBilling"
            label="Sent for Billing"
            checked={sentForBilling}
            onChange={() => setSentForBilling(!sentForBilling)}
          />
          <Form.Check
            className="mb-4"
            type="checkbox"
            id="uspsTracking"
            label="USPS Tracking"
            checked={uspsTracking}
            onChange={() => setUspsTracking(!uspsTracking)}
          />
          <Form.Check
            className="mb-4"
            type="checkbox"
            id="checkIsAdditional"
            label="Check Is Additional"
            checked={checkIsAdditional}
            onChange={() => setCheckIsAdditional(!checkIsAdditional)}
          />
        </div>
      </Form.Group>

      <Button variant="primary" type="submit">
        Search
      </Button>
    </Form>
           </>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="card">
        <div className="card-header card-header-stretch border-bottom border-gray-200">
          <div className="card-title">
            <h3 className="fw-bold m-0">Total Records:</h3>
          </div>
        </div>

        <div className="tab-content">
          <div
            id="nit_billing_months"
            className="card-body p-0 tab-pane fade active show"
            role="tabpanel"
            aria-labelledby="nit_billing_months"
          >
            <div className="table-responsive">
              <table className="table table-row-bordered align-middle gy-4 gs-9">
                <thead className="border-bottom border-gray-200 fs-6 text-gray-600 fw-bold bg-light bg-opacity-75">
                  <tr>
                    <th style={{ width: "auto" }}>Mark</th>
                    <th style={{ width: "auto" }}>Case Id</th>
                    <th style={{ width: "auto" }}>Reference Number</th>
                    <th style={{ width: "auto" }}>Patient name</th>
                    <th style={{ width: "auto" }}>Provider Name</th>
                    <th style={{ width: "auto" }}>Status of Request</th>
                    <th style={{ width: "auto" }}>Status Date</th>
                    <th style={{ width: "auto" }}>Status Comment</th>
                    <th style={{ width: "auto" }}>Order Date</th>
                    <th style={{ width: "auto" }}>Recieved Date</th>
                    <th style={{ width: "auto" }}>Document Sent Via</th>
                    <th style={{ width: "auto" }}>Document Recieved Via</th>
                    <th style={{ width: "auto" }}>Page Count</th>
                    <th style={{ width: "auto" }}>Invoice Uploaded</th>
                    <th style={{ width: "auto" }}>Billing Provider</th>
                    <th style={{ width: "auto" }}>Pre/Post Payment</th>
                    <th style={{ width: "auto" }}>Invoice Amount</th>
                    <th style={{ width: "auto" }}>Paid By NIT</th>
                    <th style={{ width: "auto" }}>Closed for Billing</th>
                  </tr>
                </thead>

                <tbody className="fw-semibold text-gray-600"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
