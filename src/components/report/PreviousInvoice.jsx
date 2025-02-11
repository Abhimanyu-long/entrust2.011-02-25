import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  Button,
  Card,
  Modal,
  Table,
} from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { decryptData } from "../../components/common/crypto";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const PreviousInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [modalInvoice, setModalInvoice] = useState(null);

  const years = [2021, 2022, 2023, 2024];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const clientData = JSON.parse(sessionStorage.getItem("client_data")) || {};
  const clientId = clientData.client_id;
  const { getPreviousInvoice } = useAuth();
  // const clientId = 109371;

  useEffect(() => {
    const fetchPreviousInvoices = async () => {
      try {
        const response = await getPreviousInvoice(clientId);
        console.log("getPreviousInvoice", response);
        const data = decryptData(response.data);
        // console.log("Fetched invoices:", response.data); // Debug response data
        console.log("decrypted_invoice_data-", data?.invoice_data);
        if (data?.invoice_data?.length > 0) {
          // Extracting and transforming the data
          const extractedInvoices = data.invoice_data.flatMap((obj) =>
            Object.values(obj).map((item) => ({
              ...item.invoice_data,
              supporting_docs: item.supporting_docs || [],
            }))
          );
          setInvoices(extractedInvoices);
        } else {
          // toast.warn("No invoice data found.");
          setInvoices([]);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        // toast.error(error.message);
      }
    };

    if (clientId) {
      fetchPreviousInvoices();
    }
  }, [clientId, getPreviousInvoice]);
  const files = [
    { name: "NIT-2024-10-LLC-911-01.pdf", size: "148875 KB", link: "#" },
    {
      name: "Invoice_cases_NIT-2024-10-LLC-911-01-1730811877.xlsx",
      size: "7023 KB",
      link: "#",
    },
    {
      name: "Detail-Statement-893-911-LLC-10-2024.pdf",
      size: "143183 KB",
      link: "#",
    },
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
  const handleDownload = (downloadUrl, fileName = "Document", invoice) => {
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
      const invoiceDate = invoice["Invoice Date"]
        ? new Date(invoice["Invoice Date"])
        : null;
      const matchesYear =
        selectedYear === "All" ||
        (invoiceDate && invoiceDate.getFullYear() === Number(selectedYear));
      const matchesMonth =
        selectedMonth === "All" ||
        (invoiceDate &&
          invoiceDate.getMonth() === months.indexOf(selectedMonth));
      const matchesSearch =
        !searchTerm ||
        (invoice.InvoiceID &&
          invoice.InvoiceID.toString().includes(searchTerm)) ||
        (invoice["Invoice Number"] &&
          invoice["Invoice Number"]
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      return matchesYear && matchesMonth && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = a["Invoice Date"] ? new Date(a["Invoice Date"]) : null;
      const dateB = b["Invoice Date"] ? new Date(b["Invoice Date"]) : null;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // const handleDownloadSelected = async () => {
  //   if (!modalInvoice?.supporting_docs) {
  //     toast.error("No files selected for download.");
  //     return;
  //   }

  //   const zip = new JSZip();
  //   const selectedFiles = Array.from(
  //     document.querySelectorAll('.file-download-modal tbody input[type="checkbox"]:checked')
  //   );

  //   if (selectedFiles.length === 0) {
  //     toast.error("Please select at least one file.");
  //     return;
  //   }

  //   toast.loading("Preparing download...");
  //   try {
  //     const downloadPromises = selectedFiles.map(async (checkbox) => {
  //       const fileUrl = checkbox.closest('tr').querySelector('a').href;
  //       const fileName = fileUrl.split('/').pop();
  //       const response = await fetch(fileUrl);
  //       const blob = await response.blob();
  //       zip.file(fileName, blob);
  //     });

  //     await Promise.all(downloadPromises);
  //     const zipContent = await zip.generateAsync({ type: 'blob' });
  //     saveAs(zipContent, 'selected_files.zip');
  //     toast.dismiss();
  //     toast.success("Download ready.");
  //   } catch (error) {
  //     toast.dismiss();
  //     console.error("Error downloading files:", error);
  //     toast.error("Failed to download selected files.");
  //   }
  // };

  const handleDownloadSelected = async () => {
    if (!modalInvoice?.supporting_docs) {
      toast.error("No files selected for download.");
      return;
    }

    const zip = new JSZip();
    const selectedFiles = Array.from(
      document.querySelectorAll(
        '.file-download-modal tbody input[type="checkbox"]:checked'
      )
    );

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    toast.loading("Preparing download...");
    try {
      const downloadPromises = selectedFiles.map(async (checkbox) => {
        const fileUrl = checkbox.closest("tr").querySelector("a").href;
        const fileName = fileUrl.split("/").pop();
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        zip.file(fileName, blob);
      });

      await Promise.all(downloadPromises);
      const zipContent = await zip.generateAsync({ type: "blob" });

      // Use the invoice ID as the file name, defaulting to "selected_files" if not available
      const invoiceID = modalInvoice?.InvoiceID || "selected_files";
      saveAs(zipContent, `Invoice ID${invoiceID}.zip`);
      toast.dismiss();
      toast.success("Download ready.");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading files:", error);
      toast.error("Failed to download selected files.");
    }
  };

  const handleDownloadFile = async (downloadUrl, fileName = "Document.pdf") => {
    try {
      if (!downloadUrl) {
        toast.error("Download URL is missing.");
        return;
      }

      // Fetch the file to ensure the download URL is accessible
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the file.");
      }

      const blob = await response.blob();

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // Set the file name for the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("File downloaded successfully.");
    } catch (error) {
      console.error("Error during file download:", error);
      toast.error("Failed to download the file.");
    }
  };

  const [selectAll, setSelectAll] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle "select all" checkbox toggle
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all files
      const allFiles = modalInvoice?.supporting_docs
        ? Object.entries(modalInvoice.supporting_docs).map(([key, url]) => url)
        : [];
      setSelectedFiles(allFiles);
    } else {
      // Deselect all files
      setSelectedFiles([]);
    }
  };
  // Handle individual checkbox toggle
  const handleCheckboxChange = (fileUrl) => {
    setSelectedFiles(
      (prev) =>
        prev.includes(fileUrl)
          ? prev.filter((url) => url !== fileUrl) // Remove if already selected
          : [...prev, fileUrl] // Add if not selected
    );
  };

  return (
    <Container className="my-4">
      <Row className="mb-3 gx-3">
        {/* Year Filter Dropdown */}
        <Col xs={12} sm={6} md={3} className="mb-2">
          {/* <Dropdown onSelect={handleYearSelect}>
            <Dropdown.Toggle
              id="dropdown-year"
              className="w-100 text-gray-900 "
              style={{
                background: "#4fc9da",
                border: "none",
                // color: 'white',
                borderRadius: "25px",
                fontSize: "1rem",
                fontWeight: "bold",
                padding: "10px 20px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              {selectedYear === "All" ? "Filter by Year" : selectedYear}
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                borderRadius: "15px",
                border: "1px solid #ddd",
                padding: "5px",
                maxHeight: "250px",
                overflowY: "auto",
                width: "100%",
                textAlign: "left",
              }}
            >
              <Dropdown.Item eventKey="All">All Years</Dropdown.Item>
              {years.map((year) => (
                <Dropdown.Item key={year} eventKey={year.toString()}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown> */}
          <Dropdown onSelect={handleYearSelect}>
            <Dropdown.Toggle
              id="dropdown-year"
              className="w-100 text-gray-900"
              style={{
                background: "#4fc9da",
                border: "none",
                borderRadius: "15px", // Smaller border radius
                fontSize: "12px",
                fontWeight: "bold",
                padding: "6px 12px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
              }}
            >
              {selectedYear === "All" ? "Filter by Year" : selectedYear}
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                borderRadius: "10px", // Smaller border radius for menu
                border: "1px solid #ddd",
                padding: "6px 12px",
                maxHeight: "200px", // Slightly smaller height
                overflowY: "auto",
                width: "100%",
                textAlign: "left",
              }}
            >
              <Dropdown.Item eventKey="All"><b>All Years</b></Dropdown.Item>
              {years.map((year) => (
                <Dropdown.Item key={year} eventKey={year.toString()}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

        </Col>

        {/* Month Filter Dropdown */}
        <Col xs={12} sm={6} md={3} className="mb-2">
          <Dropdown onSelect={handleMonthSelect}>
            <Dropdown.Toggle
              id="dropdown-month"
              className="w-100 text-gray-800 "
              style={{
                background: "#4fc9da",
                border: "none",
                borderRadius: "15px", // Smaller border radius
                fontSize: "12px",
                fontWeight: "bold",
                padding: "6px 12px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
              }}
            >
              {selectedMonth === "All" ? "Filter by Month" : selectedMonth}
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                borderRadius: "10px", // Smaller border radius for menu
                border: "1px solid #ddd",
                padding: "6px 12px",
                maxHeight: "200px", // Slightly smaller height
                overflowY: "auto",
                width: "100%",
                textAlign: "left",
              }}
            >
              <Dropdown.Item eventKey="All"><b>All Months</b></Dropdown.Item>
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
              <Card
                className="h-100"
                style={{
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, rgb(227, 242, 253), rgb(187, 222, 251))",
                }}
              >
                <Card.Body>
                  {/* Month Badge */}
                  <div
                    className="position-absolute top-0 end-0 bg-primary text-white px-2 py-1"
                    style={{
                      borderTopLeftRadius: "8px",
                      borderBottomRightRadius: "8px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {new Date(invoice["Invoice Date"]).toLocaleString(
                      "default",
                      { month: "long" }
                    ) || "N/A"}
                  </div>
                  <Card.Title className="text-primary">
                    Invoice {invoice.InvoiceID || "N/A"}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {invoice["Invoice Number"] || "N/A"}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Date:</strong>{" "}
                    {new Date(invoice["Invoice Date"]).toLocaleDateString() ||
                      "N/A"}
                    <br />
                    <strong>Amount:</strong> $
                    {parseFloat(invoice["Invoice Amount"]).toFixed(2) || "0.00"}
                  </Card.Text>
                  <Button
                    variant="outline"
                    className="btn btn-sm w-100 mt-2"
                    style={{
                      backgroundColor: "#0097ca",
                      color: "white",
                      border: "none",
                    }}
                    onClick={() =>
                      handleDownload(
                        invoice["Download"],
                        "Invoice.pdf",
                        invoice
                      )
                    }
                  >
                    <FaDownload /> Download
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <h5 className="text-muted pt-10">
                No invoices found for the selected criteria.
              </h5>
            </div>
          </Col>
        )}
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="file-download-modal"
      >
        <Modal.Header
          style={{
            // background: 'linear-gradient(135deg, #0073a8, #0098ca)',
            background: "#4fc9da",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            // borderBottom: '2px solid #006a93',
            alignItems: "center",
            padding: "10px 15px",
            minHeight: "50px",
            position: "relative", // Ensure the close button can be positioned independently
          }}
        >
          <Modal.Title
            style={{
              color: "black",
              fontSize: "1.2rem",
              fontWeight: "600",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
              width: "100%",
              textAlign: "center",
              margin: 0,
            }}
          >
            Supporting Documents
          </Modal.Title>

          <button
            type="button"
            // className="btn-close"
            style={{
              position: "absolute",
              // top: "1rem",
              right: "0rem",
              fontSize: "2.5rem",
              color: "#5e6278",
              backgroundColor: "transparent",
              border: "none",
              appearance: "none",
            }}
            onClick={() => setShowModal(false)}
          >
            <span aria-hidden="true" style={{ color: "#5e6278" }}>
              &times;
            </span>
          </button>
        </Modal.Header>

        <Modal.Body>
          {modalInvoice?.supporting_docs ? (
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #dee2e6",
              }}
            >
              <table
                className="table table-bordered"
                style={{ marginBottom: 0 }}
              >
                <thead>
                  <tr
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#e3f2fd",
                      zIndex: 1,
                    }}
                  >
                    <th style={{ width: "5%" }}>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th style={{ width: "60%" }}>Filename</th>
                    <th style={{ width: "20%" }}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(modalInvoice.supporting_docs).map(
                    ([key, docUrl], index) => {
                      const fileName = docUrl.split("/").pop();
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(docUrl)}
                              onChange={() => handleCheckboxChange(docUrl)}
                            />
                          </td>
                          <td>{fileName}</td>
                          <td>
                            <a
                              href={docUrl} // dynamically assign the file URL
                              target="_blank"
                              rel="noopener noreferrer"
                              download={fileName} // prompt a file download with the correct file name
                            >
                              Download
                            </a>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No supporting documents available for this invoice.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary btn-sm text-black"
            onClick={toggleModal}
            style={{ border: "1px solid #5e6278" }}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-sm text-black"
            style={{
              color: "#5e6278",
              background: "#4fc9da",
            }}
            onClick={handleDownloadSelected}
          >
            <b> Download Selected Files</b>
          </button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
