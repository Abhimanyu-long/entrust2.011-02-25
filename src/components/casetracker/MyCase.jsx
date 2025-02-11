import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputText } from 'primereact/inputtext';

export const MyCase = () => {
  const [cases, setCases] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const { getAllCasesByClientID } = useAuth();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await getAllCasesByClientID(clientId);
        setCases(response.data);
      } catch (error) {
        console.error("Error fetching cases:", error.message);
      }
    };

    fetchCases();
  }, []);

  const handleFileUpload = (event, caseId) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => ({
      ...prevFiles,
      [caseId]: files.map((file) => file.name),
    }));
  };

  const handleRemoveFile = (caseId, fileName) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles[caseId].filter((file) => file !== fileName);
      return {
        ...prevFiles,
        [caseId]: updatedFiles,
      };
    });
  };

  const renderUploadedFilesTooltip = (caseId) => {
    if (uploadedFiles[caseId] && uploadedFiles[caseId].length > 0) {
      return (
        <div className="tooltip-content bg-light p-2 border rounded shadow">
          <ul className="mb-0 list-unstyled">
            {uploadedFiles[caseId].map((fileName, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center">
                {index + 1}. {fileName}
                <Button
                  icon="pi pi-times"
                  className="p-button-rounded p-button-danger p-button-sm ml-2"
                  onClick={() => handleRemoveFile(caseId, fileName)}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const fileUploadTemplate = (rowData) => {
    return (
      <div className="d-flex align-items-center position-relative">
        <FileUpload
          mode="basic"
          name="files[]"
          auto
          multiple
          accept="*/*"
          customUpload
          chooseLabel="Upload"
          onSelect={(e) => handleFileUpload(e, rowData.case_id)}
        />
        {renderUploadedFilesTooltip(rowData.case_id)}
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Link
        to={`/allclients/client/${clientId}/case/${rowData.case_id}`}
        className="text-white p-button p-button-sm"
      >
        View
      </Link>
    );
  };


  const header = (
    <div className="table-header">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="p-inputtext-sm"
        />
      </span>
    </div>
  );

  return (
    <div className="container-fluid mt-5">
      <div className="border-0 shadow-lg rounded-3">
        <div className="card-body p-4">
          <div className="pt-3">
            <div className="table-responsive mt-4" style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", borderRadius: "8px", overflow: 'hidden', border: "1px solid #ddd" }}>
              <DataTable
                paginator
                value={cases} rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                header={header}
                className="p-datatable-striped p-datatable-gridlines"
                emptyMessage="No case found."
              >
                <Column
                  field="case_id"
                  header="Case ID"
                  body={(rowData) => (
                    <Link to={`/allclients/client/${clientId}/case/${rowData.case_id}`} className="text-decoration-none text-info text-center mx-3">
                      {rowData.case_id}
                    </Link>
                  )}
                  sortable
                  style={{ minWidth: '150px', fontWeight: '500', borderBottom: "1px solid #ddd", padding: '8px' }}
                />
                <Column
                  field="case_title"
                  header="Title"
                  sortable
                  style={{ minWidth: '150px', fontWeight: '500', borderBottom: "1px solid #ddd", padding: '8px' }}
                />
                <Column
                  field="due_date"
                  header="Due Date"
                  body={(rowData) => rowData.due_date ? new Date(rowData.due_date).toLocaleDateString() : 'N/A'}
                  sortable
                  style={{ minWidth: '150px', borderBottom: "1px solid #ddd", padding: '8px' }}
                />
                <Column
                  field="date_delivered"
                  header="Date Delivered"
                  body={(rowData) => rowData.date_delivered ? new Date(rowData.date_delivered).toLocaleDateString() : 'N/A'}
                  sortable
                  style={{ minWidth: '150px', borderBottom: "1px solid #ddd", padding: '8px' }}
                />
                <Column
                  field="status_name"
                  header="Status"
                  sortable
                  style={{ minWidth: '150px', fontWeight: '500', color: '#0098CA', borderBottom: "1px solid #ddd", padding: '8px' }}
                />
                <Column
                  header="View"
                  body={actionBodyTemplate}
                  style={{ minWidth: '150px', borderBottom: "1px solid #ddd", padding: '8px' }}
                />
                <Column
                  header="Upload Files"
                  body={fileUploadTemplate}
                  style={{ minWidth: '150px', borderBottom: "1px solid #ddd", padding: '8px' }}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
