
// import React, { useEffect, useState } from 'react';
// import {
//   Container,
//   Row,
//   Col,
//   Dropdown,
//   Button,
//   Card,
//   Modal,
//   Table,
// } from 'react-bootstrap';
// import { FaDownload } from 'react-icons/fa';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { toast } from "react-hot-toast";
// import { useAuth } from "../../../context/AuthContext";

// export const PreviousInvoice = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [selectedYear, setSelectedYear] = useState('All');
//   const [selectedMonth, setSelectedMonth] = useState('All');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [showModal, setShowModal] = useState(false);
//   const [modalInvoice, setModalInvoice] = useState(null);

//   const years = [2021, 2022, 2023, 2024];
//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December',
//   ];
//   const clientId = 109371;

//   const { getPreviousInvoice } = useAuth();

//   useEffect(() => {
//     const fetchPreviousInvoices = async () => {
//       try {
//         const response = await getPreviousInvoice(clientId);
//         console.log("Fetched invoices:", response.data); // Debug response data
//         if (response.data?.invoice_data?.length > 0) {
//           // Extracting and transforming the data
//           const extractedInvoices = response.data.invoice_data.flatMap(obj =>
//             Object.values(obj).map(item => ({
//               ...item.invoice_data,
//               supporting_docs: item.supporting_docs || []
//             }))
//           );
//           setInvoices(extractedInvoices);
//         } else {
//           toast.warn("No invoice data found.");
//           setInvoices([]);
//         }
//       } catch (error) {
//         console.error("Error fetching invoices:", error);
//         toast.error("Failed to fetch invoices");
//       }
//     };

//     if (clientId) {
//       fetchPreviousInvoices();
//     }
//   }, [clientId, getPreviousInvoice]);

//   const handleYearSelect = (year) => setSelectedYear(year);
//   const handleMonthSelect = (month) => setSelectedMonth(month);

// //   const handleDownload = (downloadUrl, fileName = 'Document') => {
// //     const link = document.createElement('a');
// //     link.href = downloadUrl;
// //     link.target = '_blank';
// //     link.download = fileName;
// //     link.click();
// //   };
// const handleDownload = (downloadUrl, fileName = 'Document', invoice) => {
//     // const link = document.createElement('a');
//     // link.href = downloadUrl || InvoiceDoc;
//     // link.target = '_blank';
//     // link.download = fileName;
//     // link.click();

//     // After triggering the download, show the modal with the invoice details
//     setModalInvoice(invoice);
//     setShowModal(true);
//   };

//   const filteredInvoices = invoices
//     .filter((invoice) => {
//       const invoiceDate = invoice["Invoice Date"] ? new Date(invoice["Invoice Date"]) : null;
//       const matchesYear =
//         selectedYear === 'All' ||
//         (invoiceDate && invoiceDate.getFullYear() === Number(selectedYear));
//       const matchesMonth =
//         selectedMonth === 'All' ||
//         (invoiceDate && invoiceDate.getMonth() === months.indexOf(selectedMonth));
//       const matchesSearch =
//         !searchTerm ||
//         (invoice.InvoiceID && invoice.InvoiceID.toString().includes(searchTerm)) ||
//         (invoice["Invoice Number"] && invoice["Invoice Number"].toLowerCase().includes(searchTerm.toLowerCase()));

//       return matchesYear && matchesMonth && matchesSearch;
//     })
//     .sort((a, b) => {
//       const dateA = a["Invoice Date"] ? new Date(a["Invoice Date"]) : null;
//       const dateB = b["Invoice Date"] ? new Date(b["Invoice Date"]) : null;
//       if (!dateA) return 1;
//       if (!dateB) return -1;
//       return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
//     });

//   return (
//     <Container className="my-4">
//       <Row className="mb-3">
//         <Col xs={12} sm={6} md={3} className="mb-2">
//           <Dropdown onSelect={handleYearSelect}>
//             <Dropdown.Toggle
//               id="dropdown-year"
//               className="w-100"
//               style={{
//                 backgroundColor: '#0098ca',
//                 borderColor: '#0098ca',
//                 color: 'white',
//                 borderRadius: '30px',
//                 fontSize: '0.95rem',
//               }}
//             >
//               {selectedYear === 'All' ? 'Filter by Year' : selectedYear}
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item eventKey="All">All Years</Dropdown.Item>
//               {years.map((year) => (
//                 <Dropdown.Item key={year} eventKey={year.toString()}>
//                   {year}
//                 </Dropdown.Item>
//               ))}
//             </Dropdown.Menu>
//           </Dropdown>
//         </Col>
//         <Col xs={12} sm={6} md={3} className="mb-2">
//           <Dropdown onSelect={handleMonthSelect}>
//             <Dropdown.Toggle
//               id="dropdown-month"
//               className="w-100"
//               style={{
//                 backgroundColor: '#0098ca',
//                 borderColor: '#0098ca',
//                 color: 'white',
//                 borderRadius: '30px',
//                 fontSize: '0.95rem',
//               }}
//             >
//               {selectedMonth === 'All' ? 'Filter by Month' : selectedMonth}
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item eventKey="All">All Months</Dropdown.Item>
//               {months.map((month) => (
//                 <Dropdown.Item key={month} eventKey={month}>
//                   {month}
//                 </Dropdown.Item>
//               ))}
//             </Dropdown.Menu>
//           </Dropdown>
//         </Col>
//       </Row>

//       <Row>
//         {filteredInvoices.length > 0 ? (
//           filteredInvoices.map((invoice, index) => (
//             <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
//               <Card className="h-100" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, rgb(227, 242, 253), rgb(187, 222, 251))' }}>
//                 <Card.Body>
//                   <Card.Title className="text-primary">Invoice {invoice.InvoiceID || "N/A"}</Card.Title>
//                   <Card.Subtitle className="mb-2 text-muted">{invoice["Invoice Number"] || "N/A"}</Card.Subtitle>
//                   <Card.Text>
//                     <strong>Date:</strong> {new Date(invoice["Invoice Date"]).toLocaleDateString() || "N/A"}
//                     <br />
//                     <strong>Amount:</strong> ${parseFloat(invoice["Invoice Amount"]).toFixed(2) || "0.00"}
//                   </Card.Text>
//                   <Button
//                       variant="outline"
//                       className="btn btn-sm w-100 mt-2"
//                       style={{
//                         backgroundColor: '#0097ca',
//                         color: 'white',
//                         border: 'none',
//                       }}
//                       onClick={() => handleDownload(invoice["Download"], 'Invoice.pdf', invoice)}
//                     >
//                       <FaDownload /> Download
//                     </Button>

//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <Col>
//             <p className="text-center">No invoices found for the selected criteria.</p>
//           </Col>
//         )}
//       </Row>



//           {/* Modal to display invoice details in a table */}
//        <Modal
//          show={showModal}
//          onHide={() => setShowModal(false)}
//          size="xl"
//          centered
//          className="invoice-modal"
//        >
//          <Modal.Header closeButton>
//            <Modal.Title className="text-primary">Invoice Details</Modal.Title>
//          </Modal.Header>
//          <Modal.Body>
//            {/* {modalInvoice ? ( */}
//            {modalInvoice ? (
//              <div className="table-responsive">

//                <table className="table table-striped table-hover table-bordered">
//                  <thead className="thead-dark text-center">
//                    <tr>
//                      <th>Invoice Amount</th>
//                      <th>Closing Balance</th>
//                      <th>Approved</th>
//                      <th>Approved On</th>
//                      <th>Approved User</th>
//                      <th>Finalised</th>
//                      <th>Finalised On</th>
//                      <th>Finalised User</th>
//                      <th>Generated</th>
//                      <th>Generated On</th>
//                      <th>Generated User</th>
//                      <th>Email Sent</th>
//                      <th>Email Sent On</th>
//                      <th>Email Sent By</th>
//                      <th>Download</th>
//                      <th>Download Support Docs</th>
//                      <th>Download Excel</th>
//                      <th>Resend Mail</th>
//                      <th>Delete Invoice</th>
//                    </tr>
//                  </thead>
//                  <tbody>
//                    {filteredInvoices.map((row, index) => (
//                      <tr key={index} className="text-center align-middle">
//                        <td>${modalInvoice["Invoice Amount"]}</td>
//                        <td>${modalInvoice["Closing Balance"]}</td>
//                        <td>{modalInvoice.Approved ? "Yes" : "No"}</td>
//                        <td>{modalInvoice["Approved On"] || "N/A"}</td>
//                        <td>{modalInvoice["Approved User"] || "N/A"}</td>
//                        <td>{modalInvoice.Finalised || "No"}</td>
//                        <td>{modalInvoice["Finalised On"] || "N/A"}</td>
//                        <td>{modalInvoice["Finalised User"] || "N/A"}</td>
//                        <td>{modalInvoice.Generated || "No"}</td>
//                        <td>{modalInvoice["Generated On"] || "N/A"}</td>
//                        <td>{modalInvoice["Generated User"] || "N/A"}</td>
//                        <td>{modalInvoice["Email Sent"] || "No"}</td>
//                        <td>{modalInvoice["Email Sent On"] || "N/A"}</td>
//                        <td>{modalInvoice["Email Send By"] || "N/A"}</td>
//                        <td>
//                          <Button
//                            variant="link"
//                            className="text-primary"
//                           //  onClick={() => handleShowModal(row)}
//                            href={modalInvoice.Download}
//                            target="_blank"
//                            download
//                          >
//                            Download
//                          </Button>
//                        </td>
//                        <td>
//                          <Button variant="link" className="text-primary">
//                            Download Support Docs
//                          </Button>
//                        </td>
//                        <td>
//                          <Button variant="link" className="text-primary"
                        
//                           href={modalInvoice["Download Excel"]}
//                           target="_blank"
//                           download>
//                            Download Excel
//                          </Button>
//                        </td>
//                        <td>
//                          <Button variant="link" className="text-warning">
//                            Resend
//                          </Button>
//                        </td>
//                        <td>
//                          <Button variant="link" className="text-danger">
//                            Delete Invoice
//                          </Button>
//                        </td>
//                      </tr>
//                    ))}
//                  </tbody>
//                </table>
//              </div>
//             ) : (
//               <p>No invoice details available.</p>
//             )}
//          </Modal.Body>
//        </Modal>

//      {/* <Modal
//          show={showModal}
//          onHide={() => setShowModal(false)}
//          size="xl"
//          centered
//          className="invoice-modal"
//        >
//          <Modal.Header closeButton>
//            <Modal.Title className="text-primary">Invoice Details</Modal.Title>
//          </Modal.Header>
//          <Modal.Body>
//            {modalInvoice ? (
//              <div>
//                <p>
//                  <strong>Invoice Amount:</strong> {modalInvoice.invoiceAmount}
//                </p>
//                <p>
//                  <strong>Closing Balance:</strong> {modalInvoice.closingBalance}
//                </p>
           
//              </div>
//            ) : (
//              <p className="text-center text-muted">No invoice data available.</p>
//            )}
//          </Modal.Body>
//        </Modal>  */}
//     </Container>
//   );
// };





import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Dropdown,
  Button,
  Card,
  Modal,
  Table,
} from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

export const PreviousInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [modalInvoice, setModalInvoice] = useState(null);

  const years = [2021, 2022, 2023, 2024];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const clientId = 109371;

  const { getPreviousInvoice } = useAuth();

  useEffect(() => {
    const fetchPreviousInvoices = async () => {
      try {
        const response = await getPreviousInvoice(clientId);
        // console.log("Fetched invoices:", response.data); // Debug response data
        if (response.data?.invoice_data?.length > 0) {
          // Extracting and transforming the data
          const extractedInvoices = response.data.invoice_data.flatMap(obj =>
            Object.values(obj).map(item => ({
              ...item.invoice_data,
              supporting_docs: item.supporting_docs || []
            }))
          );
          setInvoices(extractedInvoices);
        } else {
          toast.warn("No invoice data found.");
          setInvoices([]);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to fetch invoices");
      }
    };

    if (clientId) {
      fetchPreviousInvoices();
    }
  }, [clientId, getPreviousInvoice]);
  const files = [
    { name: 'NIT-2024-10-LLC-911-01.pdf', size: '148875 KB', link: '#' },
    { name: 'Invoice_cases_NIT-2024-10-LLC-911-01-1730811877.xlsx', size: '7023 KB', link: '#' },
    { name: 'Detail-Statement-893-911-LLC-10-2024.pdf', size: '143183 KB', link: '#' },
  ];
  const toggleModal = () => setShowModal(!showModal);

  const handleYearSelect = (year) => setSelectedYear(year);
  const handleMonthSelect = (month) => setSelectedMonth(month);

//   const handleDownload = (downloadUrl, fileName = 'Document') => {
//     const link = document.createElement('a');
//     link.href = downloadUrl;
//     link.target = '_blank';
//     link.download = fileName;
//     link.click();
//   };
const handleDownload = (downloadUrl, fileName = 'Document', invoice) => {
    // const link = document.createElement('a');
    // link.href = downloadUrl || InvoiceDoc;
    // link.target = '_blank';
    // link.download = fileName;
    // link.click();

    // After triggering the download, show the modal with the invoice details
    setModalInvoice(invoice);
    setShowModal(true);
  };

  const filteredInvoices = invoices
    .filter((invoice) => {
      const invoiceDate = invoice["Invoice Date"] ? new Date(invoice["Invoice Date"]) : null;
      const matchesYear =
        selectedYear === 'All' ||
        (invoiceDate && invoiceDate.getFullYear() === Number(selectedYear));
      const matchesMonth =
        selectedMonth === 'All' ||
        (invoiceDate && invoiceDate.getMonth() === months.indexOf(selectedMonth));
      const matchesSearch =
        !searchTerm ||
        (invoice.InvoiceID && invoice.InvoiceID.toString().includes(searchTerm)) ||
        (invoice["Invoice Number"] && invoice["Invoice Number"].toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesYear && matchesMonth && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = a["Invoice Date"] ? new Date(a["Invoice Date"]) : null;
      const dateB = b["Invoice Date"] ? new Date(b["Invoice Date"]) : null;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col xs={12} sm={6} md={3} className="mb-2">
          <Dropdown onSelect={handleYearSelect}>
            <Dropdown.Toggle
              id="dropdown-year"
              className="w-100"
              style={{
                backgroundColor: '#0098ca',
                borderColor: '#0098ca',
                color: 'white',
                borderRadius: '30px',
                fontSize: '0.95rem',
              }}
            >
              {selectedYear === 'All' ? 'Filter by Year' : selectedYear}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All Years</Dropdown.Item>
              {years.map((year) => (
                <Dropdown.Item key={year} eventKey={year.toString()}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={12} sm={6} md={3} className="mb-2">
          <Dropdown onSelect={handleMonthSelect}>
            <Dropdown.Toggle
              id="dropdown-month"
              className="w-100"
              style={{
                backgroundColor: '#0098ca',
                borderColor: '#0098ca',
                color: 'white',
                borderRadius: '30px',
                fontSize: '0.95rem',
              }}
            >
              {selectedMonth === 'All' ? 'Filter by Month' : selectedMonth}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All Months</Dropdown.Item>
              {months.map((month) => (
                <Dropdown.Item key={month} eventKey={month}>
                  {month}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row>
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100" style={{ borderRadius: '8px', background: 'linear-gradient(135deg, rgb(227, 242, 253), rgb(187, 222, 251))' }}>
                <Card.Body>
                  <Card.Title className="text-primary">Invoice {invoice.InvoiceID || "N/A"}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{invoice["Invoice Number"] || "N/A"}</Card.Subtitle>
                  <Card.Text>
                    <strong>Date:</strong> {new Date(invoice["Invoice Date"]).toLocaleDateString() || "N/A"}
                    <br />
                    <strong>Amount:</strong> ${parseFloat(invoice["Invoice Amount"]).toFixed(2) || "0.00"}
                  </Card.Text>
                  <Button
                      variant="outline"
                      className="btn btn-sm w-100 mt-2"
                      style={{
                        backgroundColor: '#0097ca',
                        color: 'white',
                        border: 'none',
                      }}
                      onClick={() => handleDownload(invoice["Download"], 'Invoice.pdf', invoice)}
                    >
                      <FaDownload /> Download
                    </Button>

                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No invoices found for the selected criteria.</p>
          </Col>
        )}
      </Row>



          {/* Modal to display invoice details in a table */}
       {/* <Modal
         show={showModal}
         onHide={() => setShowModal(false)}
         size="xl"
         centered
         className="invoice-modal"
       >
         <Modal.Header closeButton>
           <Modal.Title className="text-primary">Invoice Details</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           {/* {modalInvoice ? ( 
           {modalInvoice ? (
             <div className="table-responsive">

               <table className="table table-striped table-hover table-bordered">
                 <thead className="thead-dark text-center">
                   <tr>
                     <th>Invoice Amount</th>
                     <th>Closing Balance</th>
                     <th>Approved</th>
                     <th>Approved On</th>
                     <th>Approved User</th>
                     <th>Finalised</th>
                     <th>Finalised On</th>
                     <th>Finalised User</th>
                     <th>Generated</th>
                     <th>Generated On</th>
                     <th>Generated User</th>
                     <th>Email Sent</th>
                     <th>Email Sent On</th>
                     <th>Email Sent By</th>
                     <th>Download</th>
                     <th>Download Support Docs</th>
                     <th>Download Excel</th>
                     <th>Resend Mail</th>
                     <th>Delete Invoice</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredInvoices.map((row, index) => (
                     <tr key={index} className="text-center align-middle">
                       <td>${modalInvoice["Invoice Amount"]}</td>
                       <td>${modalInvoice["Closing Balance"]}</td>
                       <td>{modalInvoice.Approved ? "Yes" : "No"}</td>
                       <td>{modalInvoice["Approved On"] || "N/A"}</td>
                       <td>{modalInvoice["Approved User"] || "N/A"}</td>
                       <td>{modalInvoice.Finalised || "No"}</td>
                       <td>{modalInvoice["Finalised On"] || "N/A"}</td>
                       <td>{modalInvoice["Finalised User"] || "N/A"}</td>
                       <td>{modalInvoice.Generated || "No"}</td>
                       <td>{modalInvoice["Generated On"] || "N/A"}</td>
                       <td>{modalInvoice["Generated User"] || "N/A"}</td>
                       <td>{modalInvoice["Email Sent"] || "No"}</td>
                       <td>{modalInvoice["Email Sent On"] || "N/A"}</td>
                       <td>{modalInvoice["Email Send By"] || "N/A"}</td>
                       <td>
                         <Button
                           variant="link"
                           className="text-primary"
                          //  onClick={() => handleShowModal(row)}
                           href={modalInvoice.Download}
                           target="_blank"
                           download
                         >
                           Download
                         </Button>
                       </td>
                       <td>
                         <Button variant="link" className="text-primary">
                           Download Support Docs
                         </Button>
                       </td>
                       <td>
                         <Button variant="link" className="text-primary"
                        
                          href={modalInvoice["Download Excel"]}
                          target="_blank"
                          download>
                           Download Excel
                         </Button>
                       </td>
                       <td>
                         <Button variant="link" className="text-warning">
                           Resend
                         </Button>
                       </td>
                       <td>
                         <Button variant="link" className="text-danger">
                           Delete Invoice
                         </Button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
            ) : (
              <p>No invoice details available.</p>
            )}
         </Modal.Body>
       </Modal> */}

<Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      centered
      className="file-download-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Download Files</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>
                  <input type="checkbox" />
                </th>
                <th style={{ width: "60%" }}>Filename</th>
                <th style={{ width: "15%" }}>Size</th>
                <th style={{ width: "20%" }}>Download</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{file.name}</td>
                  <td>{file.size}</td>
                  <td>
                    <a href={file.link} className="">
                      Download File
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary btn-sm" onClick={toggleModal}>
          Close
        </button>
        <button type="button" className="btn btn-primary btn-sm">
          Download Selected Files
        </button>
      </Modal.Footer>
    </Modal>
    </Container>
  );
};

