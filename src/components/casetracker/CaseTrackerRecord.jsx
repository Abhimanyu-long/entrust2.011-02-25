import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog"; // Ensure Dialog is imported here
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { InputText } from "primereact/inputtext";
import { encryptData, decryptData } from "../../components/common/crypto";
import toast, { Toaster } from "react-hot-toast"; // Import toast if not already
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const CaseTrackerRecord = () => {
  const [cases, setCases] = useState([]);
  // const [clientId, setClientID] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const { getAllCasesByClientID } = useAuth();
  const { clientId, projectId } = useParams();
  const fileUploadRef = useRef(null); // Ref to reset FileUpload component
  const clientID =
    clientId ?? JSON.parse(sessionStorage.getItem("client_data")).client_id;

  // useEffect(() => {
  //   const clientData =
  //   if (clientData && clientData.client_id) {
  //     console.log("CLIENT_ID", clientData);

  //     setClientID(clientData.client_id);

  //     console.log("CLIENT_ID123", clientId);
  //   }
  // }, []);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await getAllCasesByClientID(clientID, projectId);
        setCases(response.data);
      } catch (error) {
        console.error("Error fetching cases:", error.message);
      }
    };

    fetchCases();
  }, []);

  const handleFileUpload = (event, caseId) => {
    const fileNames = event.files.map((file) => ({
      id: file.name,
      name: file.name,
      isEditing: false,
    }));
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [caseId]: fileNames,
    }));

    // Reset FileUpload component
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  const handleRemoveFile = (caseId, fileId) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles[caseId].filter(
        (file) => file.id !== fileId
      );
      return {
        ...prevFiles,
        [caseId]: updatedFiles,
      };
    });
  };

  const openModal = (caseId) => {
    const staticFiles = [
      { id: "demo-file1", name: "DemoDocument1.pdf", isEditing: false },
      { id: "demo-file2", name: "DemoImage1.jpg", isEditing: false },
      { id: "demo-file3", name: "DemoPresentation.pptx", isEditing: false },
      { id: "demo-file4", name: "DemoSpreadsheet.xlsx", isEditing: false },
    ];
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [caseId]: staticFiles,
    }));
    setSelectedCaseId(caseId);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCaseId(null);
    setShowModal(false);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFiles = Array.from(uploadedFiles[selectedCaseId]);
    const [movedFile] = reorderedFiles.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, movedFile);
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [selectedCaseId]: reorderedFiles,
    }));
  };

  const toggleEditFileName = (index) => {
    const updatedFiles = uploadedFiles[selectedCaseId].map((file, idx) =>
      idx === index ? { ...file, isEditing: !file.isEditing } : file
    );
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [selectedCaseId]: updatedFiles,
    }));
  };

  const handleFileNameChange = (index, newName) => {
    const updatedFiles = uploadedFiles[selectedCaseId].map((file, idx) =>
      idx === index ? { ...file, name: newName } : file
    );
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [selectedCaseId]: updatedFiles,
    }));
  };

  const saveChanges = () => {
    setShowModal(false);
  };

  const renderUploadedFilesModal = () => {
    if (!selectedCaseId || !uploadedFiles[selectedCaseId]) return null;

    return (
      <Dialog
        visible={showModal}
        onHide={closeModal}
        header={
          <div className="d-flex justify-content-between align-items-center" style={{ padding: "0.5rem 1rem" }}>
            <h5 className="m-0" style={{ fontSize: "1.25rem", fontWeight: "500" }}>
              Manage Uploaded Files
            </h5>
            <Button
              icon="pi pi-times"
              className="p-button-rounded p-button-text"
              onClick={closeModal}
              style={{ fontSize: "1.5rem", color: "#6c757d" }}
            />
          </div>
        }
        closable={false}
        style={{ width: "50vw", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
        footer={
          <div className="d-flex justify-content-end" style={{ padding: "0.5rem 1rem" }}>
            <Button label="Save Changes" icon="pi pi-check" onClick={saveChanges} className="p-button-success mr-2" />
            <Button label="Cancel" icon="pi pi-times" onClick={closeModal} className="p-button-secondary" />
          </div>
        }
        className="p-dialog-lg"
      >
        <div style={{ padding: "1rem", maxHeight: "60vh", overflowY: "auto" }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fileList">
              {(provided) => (
                <ul className="list-unstyled" {...provided.droppableProps} ref={provided.innerRef} style={{ padding: 0, margin: 0 }}>
                  {uploadedFiles[selectedCaseId].map((file, index) => (
                    <Draggable key={file.id} draggableId={file.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="d-flex align-items-center mb-2"
                          style={{
                            padding: "0.75rem",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            marginBottom: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {file.isEditing ? (
                            <InputText
                              value={file.name}
                              onChange={(e) => handleFileNameChange(index, e.target.value)}
                              className="mr-2"
                              style={{ width: "70%", fontSize: "0.9rem", fontWeight: "500" }}
                            />
                          ) : (
                            <span className="mr-2" style={{ fontSize: "1rem", fontWeight: "500", flex: 1 }}>
                              {file.name}
                            </span>
                          )}
                          <Button
                            icon={file.isEditing ? "pi pi-save" : "pi pi-pencil"}
                            className="p-button-rounded p-button-text p-button-secondary p-button-sm mr-2"
                            onClick={() => toggleEditFileName(index)}
                          />
                          <Button
                            icon="pi pi-times"
                            className="p-button-rounded p-button-danger p-button-sm"
                            onClick={() => handleRemoveFile(selectedCaseId, file.id)}
                            style={{ backgroundColor: "#dc3545", color: "#fff", fontSize: "1.2rem", border: "none" }}
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Dialog>
    );
  };

  const fileUploadTemplate = (rowData) => {
    return (
      <div className="d-flex align-items-center position-relative">
        <FileUpload
          ref={fileUploadRef} // Assign ref to FileUpload
          mode="basic"
          name="files[]"
          auto
          multiple
          accept="*/*"
          customUpload
          chooseLabel="Upload"
          onSelect={(e) => handleFileUpload(e, rowData.case_id)}
        />
        <Button
          label="View Files"
          icon="pi pi-eye"
          className="p-button-text p-button-info ml-2 mx-2"
          onClick={() => openModal(rowData.case_id)}
          style={{ backgroundColor: "#003F73" }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    // encrypt clientId
    const clientID = encryptData(clientID, VITE_SECRET_KEY);
    const caseID = encryptData(rowData.case_id, VITE_SECRET_KEY);
    console.log("encryptJson", rowData.case_id);

    return (
      <Link
        to={`/allclients/client/${clientID}/case/${caseID}`}
        className="text-white p-button p-button-sm"
      >
        View
      </Link>
    );
  };

  const header = (
    <div className="table-header p-2">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="p-inputtext-sm p-2 fs-7"
        />
      </span>
    </div>
  );

  return (
    //     <div className="container-fluid mt-5">
    //   <div className="border-0 shadow-lg rounded-3">

    //     <div className="card-body p-4">
    //     <div className="card-header card-header-stretch" style={{
    //                     backgroundColor: "#0098CA",
    //                     borderRadius: "8px",
    //                     padding: "16px",
    //                     display: "flex",
    //                     justifyContent: "space-between text-center mb-4 ",
    //                     alignItems: "center",
    //                     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    //                 }}>
    //                     <div className="card-title">
    //                     <h5 className="text-center mb-4 " style={{ color: '#0098CA', fontWeight: '600' }}>Case Tracker Record</h5>
    //                     </div>
    //                 </div>
    //       {/* <h5 className="card-title text-center mb-4 text-primary" style={{ color: '#0098CA', fontWeight: '600' }}>Case Tracker Record</h5> */}
    //       <div className="table-responsive">
    //         <DataTable value={cases} paginator rows={10} className="datatable-responsive"
    //                    style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
    //           <Column
    //             field="case_id"
    //             header="Case ID"
    //             body={(rowData) => (
    //               <Link to={`/allclients/client/${clientID}/case/${rowData.case_id}`} className="text-decoration-none text-info">
    //                 {rowData.case_id}
    //               </Link>
    //             )}
    //             sortable
    //             style={{ minWidth: '150px', fontWeight: '500' }}
    //           />
    //           <Column
    //             field="case_title"
    //             header="Title"
    //             sortable
    //             style={{ minWidth: '150px', fontWeight: '500' }}
    //           />
    //           <Column
    //             field="due_date"
    //             header="Due Date"
    //             body={(rowData) => new Date(rowData.due_date).toLocaleDateString()}
    //             sortable
    //             style={{ minWidth: '150px' }}
    //           />
    //           <Column
    //             field="date_delivered"
    //             header="Date Delivered"
    //             body={(rowData) => new Date(rowData.date_delivered).toLocaleDateString()}
    //             sortable
    //             style={{ minWidth: '150px' }}
    //           />
    //           <Column
    //             field="status_name"
    //             header="Status"
    //             sortable
    //             style={{ minWidth: '150px', fontWeight: '500', color: '#0098CA' }}
    //           />
    //           <Column
    //             header="View"
    //             body={actionBodyTemplate}
    //             style={{ minWidth: '150px' }}
    //           />
    //           <Column
    //             header="Upload Files"
    //             body={fileUploadTemplate}
    //             style={{ minWidth: '150px' }}
    //           />
    //         </DataTable>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="container-fluid mt-5">
      <div className="border-0 shadow-lg rounded-3">
        <div className="card-body p-4">
          {/* <div className="card-header card-header-stretch"
            style={{
              backgroundColor: "#0098CA",
              borderRadius: "8px",

              display: "flex",
              justifyContent: "center", 
              alignItems: "center", 
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}>
            <div className="card-title text-center">
              <h5 className="text-center mb-0" style={{ color: '#fff', fontWeight: '600' }}>Case Tracker Record</h5>
            </div>
          </div> */}

          <div className="pt-3">
            <div className="d-flex flex-row align-items-start gap-4 m-2">
              {/* <Button
                color="primary"
                onClick={() => handleButtonClick("allCases")}
                className="hideTextOnHover text-white"
                style={{
                  transition: "all 0.3s ease",
                  backgroundColor: "#0098ca",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#0079a3"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#0098ca"}
              >
                Show All Cases
              </Button>

              <Button
                color="primary"
                onClick={() => handleButtonClick("deliveredCases")}
                className="hideTextOnHover text-white"
                style={{
                  transition: "all 0.3s ease",
                  backgroundColor: "#0098ca",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#0079a3"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#0098ca"}
              >
                Delivered Cases
              </Button>

              <Button
                color="primary"
                onClick={() => handleButtonClick("wipCases")}
                className="hideTextOnHover text-white"
                style={{
                  transition: "all 0.3s ease",
                  backgroundColor: "#0098ca",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#0079a3"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#0098ca"}
              >
                WIP Cases
              </Button>

              <Button
                color="primary"
                onClick={() => handleButtonClick("onHoldCases")}
                className="hideTextOnHover text-white"
                style={{
                  transition: "all 0.3s ease",
                  backgroundColor: "#0098ca",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#0079a3"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#0098ca"}
              >
                On Hold Cases
              </Button> */}
            </div>

            <div
              className="table-responsive mt-4"
              style={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #ddd",
              }}
            >
              {/* <DataTable  header={header} value={cases} paginator rows={10}  className="datatable-responsive"
                style={{ borderCollapse: 'separate', borderSpacing: '0 10px', width: '100%' }}> */}
              <DataTable
                paginator
                value={cases}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                header={header}
                className="p-datatable-striped p-datatable-gridlines"
                emptyMessage="No charges found."
              >
                <Column
                  field="case_id"
                  header="Case ID"
                  body={(rowData) => (
                    <Link
                      to={`/allclients/client/${clientID}/case/${rowData.case_id}`}
                      className="text-decoration-none text-info text-center mx-3"
                    >
                      {rowData.case_id}
                    </Link>
                  )}
                  sortable
                  style={{
                    minWidth: "150px",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                />
                <Column
                  field="case_title"
                  header="Title"
                  body={(rowData) => (
                    <Link
                      to={`/allclients/client/${clientID}/case/${rowData.case_id}`}
                      className="text-decoration-none text-info text-center mx-3"
                    >
                      {rowData.case_title}
                    </Link>
                  )}
                  sortable
                  style={{
                    minWidth: "150px",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                />
                {/* <Column
                  field=""
                  header=""
                  sortable
                  style={{
                    minWidth: "150px",
                    fontWeight: "500",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                /> */}
                <Column
                  field="due_date"
                  header="Due Date"
                  body={(rowData) =>
                    rowData.due_date
                      ? new Date(rowData.due_date).toLocaleDateString()
                      : "N/A"
                  }
                  sortable
                  style={{
                    minWidth: "150px",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                />
                <Column
                  field="date_delivered"
                  header="Date Delivered"
                  body={(rowData) =>
                    rowData.date_delivered
                      ? new Date(rowData.date_delivered).toLocaleDateString()
                      : "N/A"
                  }
                  sortable
                  style={{
                    minWidth: "150px",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                />
                <Column
                  field="status_name"
                  header="Status"
                  sortable
                  style={{
                    minWidth: "150px",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                />
                {/* <Column
                  header="View"
                  body={actionBodyTemplate}
                  style={{
                    minWidth: "150px",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                /> */}
                <Column
                  header="Upload Files"
                  body={fileUploadTemplate}
                  style={{
                    minWidth: "150px",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                />
              </DataTable>
              {renderUploadedFilesModal()}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
