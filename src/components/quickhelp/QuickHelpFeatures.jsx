
import React, { useState } from "react";
import { Modal, Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPhoneAlt, FaEnvelope, FaWalking, FaServer } from "react-icons/fa";
import { FcBusinessman, FcBusinesswoman } from "react-icons/fc";

export const QuickHelpFeatures = ({ show, handleClose, startTourAgain }) => {
  const contacts = [
    {
      name: "Mary Paul",
      phone: "+1-516-717-1901",
      designation: "Manager - Business Development",
      email: "mary.p@neuralit.com",
      link: "https://calendar.neuralit.com/mary",
      icon: <FcBusinesswoman size={30} />,
    },
    {
      name: "Imran Inamdar",
      phone: "+1-516-717-1903",
      designation: "Head of Department - Legal",
      email: "imran.i@neuralit.com",
      link: "https://calendar.neuralit.com/imran",
      icon: <FcBusinessman size={30} />,
    },
    {
      name: "Amruta Phadtare",
      phone: "+1-516-717-1911",
      designation: "Head of Department - Medical",
      email: "amruta.p@neuralit.com",
      link: "https://calendar.neuralit.com/amruta",
      icon: <FcBusinesswoman size={30} />,
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ platform: "", description: "" });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.platform || !formData.description) {
      setError("Both fields are mandatory.");
      return;
    }
    alert("We have received your request and will contact you soon.");
    setShowModal(false);
    setFormData({ platform: "", description: "" });
    setError("");
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        {/* Modal Header */}
        <Modal.Header
         closeButton
         style={{ backgroundColor: "#4fc9da", color: "white", padding: "0.75rem 1rem" }}
       >
         <Modal.Title className="w-100 text-center text-black" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
           <h5 className="modal-title text-center w-100 font-weight-bold text-black">
             How Can We Assist You Today?
           </h5>
         </Modal.Title>
       </Modal.Header>


        {/* Modal Body */}
        <Modal.Body>
          <Container>
            <Row className="justify-content-center p-2">
              {contacts.map((contact, index) => (
                <Col xs={12} sm={6} md={4} key={index} className="mb-3">
                  <Card className="h-100 text-center shadow-sm border-0" style={{ background: "#e3f2fd" }}>
                    <Card.Body>
                      {contact.icon}
                      <Card.Title className="mt-2 text-primary" style={{ fontSize: "1rem", fontWeight: 600 }}>
                        {contact.name}
                      </Card.Title>
                      <Card.Text style={{ fontSize: "0.9rem", color: "#333" }}>
                        {contact.designation}
                      </Card.Text>

                      <p className="mb-2" style={{ fontSize: "0.85rem" }}>
                        <FaPhoneAlt className="me-2" />
                        <a href={`tel:${contact.phone}`} className="text-dark text-decoration-none">
                          {contact.phone}
                        </a>
                      </p>

                      <p style={{ fontSize: "0.85rem" }}>
                        <FaEnvelope className="me-2" />
                        <a href={`mailto:${contact.email}`} className="text-dark text-decoration-none">
                          {contact.email}
                        </a>
                      </p>

                      {/* <Button size="sm" variant="primary" href={contact.link} target="_blank">
                        Schedule Meeting
                      </Button> */}
                       <button
                      className="btn btn-sm"
                      style={{
                        background:
                          "linear-gradient(135deg,rgb(73, 164, 255), #bbdefb)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        // padding: "2px 12px",
                        fontSize: "12px",
                      }}
                     >
                     <a
                         href={contact.link}
                         target='_blank'
                         style={{ textDecoration: "none", color: "black" }}
                       >
                         {"Schedule Meeting"}
                       </a>
                     </button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Guided Tour Section */}
            <div className="text-center mt-4 p-1">
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                Want a quick refresher? Explore key features below or take a guided tour.
              </p>
              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2 mt-4 m-2">
              {/* <Button onClick={startTourAgain} className="btn-sm me-2" style={{ background: "#4fc9da", borderRadius: "50px" }}>
                <FaWalking className="me-2" /> Take a Guided Tour
              </Button>
              <Button onClick={() => setShowModal(true)} className="btn-sm" style={{ background: "#4fc9da", borderRadius: "50px" }}>
                <FaServer className="me-2" /> API Integration Request
              </Button> */}
                <Button
                  onClick={startTourAgain}
                  style={{
                    background: "#4fc9da",
                    border: "none",
                    // padding: "10px 24px",
                    // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    // color: "#ffffff",
                   fontSize: "1rem",
                  borderRadius: "50px",
                   }}
                   className='text-black btn-sm'
                 >
                   <FaWalking style={{ marginRight: "0.5rem" }} /> <b>Take a Guided Tour</b>
                 </Button>
                 <Button
                   onClick={() => setShowModal(true)}
                   style={{
                     background: "#4fc9da",
                    border: "none",
                    // padding: "10px 24px",
                    // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                     fontSize: "1rem",
                    borderRadius: "50px",
                  }}
                  className='text-black btn-sm mx-2'
                >
                <FaServer style={{ marginRight: "0.5rem" }} /> <b>API Integration Request</b>
                 </Button>
              </div>
            </div>
          </Container>
        </Modal.Body>
      </Modal>

      {/* API Integration Request Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#4fc9da", color: "white" }}>
          <Modal.Title className="w-100 text-center" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
            API Integration Request Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
          <Container>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "600", fontSize: "1rem" }}>Integration Platform/Tool</Form.Label>
                <Form.Control
                  type="text"
                  name="platform"
                  placeholder="e.g., Litify, Salesforce, Smart Advocate"
                  value={formData.platform}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "600", fontSize: "1rem" }}>Request Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={4}
                  placeholder="Provide details of your request"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              {error && <p className="text-danger text-center">{error}</p>}
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#f1f1f1" }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit} style={{ background: "#4fc9da" }}>Submit Request</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
