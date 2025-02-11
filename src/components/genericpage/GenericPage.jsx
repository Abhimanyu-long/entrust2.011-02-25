import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "primeicons/primeicons.css";
import "../../assets/css/genericPage.css";

const GenericPage = ({
  tabs = [],                       // Default to an empty array
  tableName = "",
  globalSearchFields = [],
  onTabChange,
  showExportButton = false,       // New optional prop for Export button
  searchPlaceholder = "Search",
  /**
   * Optional exportOptions prop to customize Excel export.
   * Example usage:
   *  exportOptions={{
   *    columns: [
   *      { field: "case_id", header: "Case ID" },
   *      { field: "project_name", header: "Project" },
   *      ...
   *    ],
   *    styles: { font: { name: "Arial", sz: 12, bold: true } }, // basic XLSX styling
   *    fileName: "CustomFileName",  // override default file name
   *    customTransform: (rows) => rows.map(r => { ...modify...; return r; })
   *  }}
   */
  exportOptions = {},
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = parseInt(queryParams.get("tab")) || 0;

  const [activeIndex, setActiveIndex] = useState(initialTab);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  // Log for debugging
  console.log("tabs", tabs);
  console.log("tableName", tableName);

  useEffect(() => {
    setGlobalFilterValue("");
  }, [activeIndex]);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    queryParams.set("tab", index);
    navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
    onTabChange && onTabChange(index, tabs[index]);
  };

  /**
   * Extended export-to-Excel logic, using optional exportOptions for
   * custom columns, ordering, styling, and filename.
   */
  const exportToExcel = () => {
    const currentTab = tabs[activeIndex] || { data: [], columns: [] };
    const allData = currentTab.data || [];

    // Destructure any custom export options
    const {
      columns: customColumns,  // optional array of columns to override currentTab.columns
      styles: customStyles,    // optional XLSX styling object
      fileName,                // optional override for Excel filename
      customTransform,         // optional callback to modify row data before writing
    } = exportOptions;

    /**
     * 1) Determine which columns to export
     *    - if customColumns are provided, use those
     *    - otherwise use the existing columns from currentTab
     *      (minus "Actions" if that column is present)
     */
    let defaultColumns = currentTab.columns.filter((col) => col.field !== "Actions");
    let finalColumns =
      customColumns && customColumns.length ? customColumns : defaultColumns;

    /**
     * Flatten nested objects if needed
     */
    const flattenObject = (obj, prefix = "") => {
      let result = {};
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          const newKey = prefix ? `${prefix}_${key}` : key;
          if (typeof value === "object" && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value, newKey));
          } else if (Array.isArray(value)) {
            // Convert arrays to string or handle them differently if you like
            result[newKey] = JSON.stringify(value);
          } else {
            result[newKey] = value;
          }
        }
      }
      return result;
    };

    /**
     * 2) Build array of row objects for export.
     *    For each row, only keep the columns in finalColumns.
     */
    let exportData = allData.map((item) => {
      const flattened = flattenObject(item);
      const row = {};

      // For each column in finalColumns, set the header => field's value
      finalColumns.forEach((col) => {
        const header = col.header || col.field; // column title
        row[header] = flattened[col.field] !== undefined ? flattened[col.field] : "";
      });

      return row;
    });

    /**
     * 3) Apply any custom transform if provided
     */
    if (typeof customTransform === "function") {
      exportData = customTransform(exportData);
    }

    /**
     * 4) Build an array of headers from finalColumns
     */
    const headers = finalColumns.map((col) => col.header || col.field);

    /**
     * 5) Create worksheet and workbook
     */
    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, tableName || "Exported Data");

    /**
     * 6) (Optional) Apply custom XLSX styles to every cell if provided
     */
    if (customStyles && typeof customStyles === "object") {
      const sheetRange = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let R = sheetRange.s.r; R <= sheetRange.e.r; ++R) {
        for (let C = sheetRange.s.c; C <= sheetRange.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (worksheet[cellAddress]) {
            worksheet[cellAddress].s = customStyles;
          }
        }
      }
    }

    /**
     * 7) Write to buffer and trigger file download
     */
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Use custom filename if provided, otherwise fallback
    const downloadName = fileName || tableName || "ExportedData";
    saveAs(dataBlob, `${downloadName}.xlsx`);
  };

  // Check if there are multiple tabs
  const isTabsEnabled = tabs && tabs.length > 1;
  // Fallback for no active tab
  const currentTab = tabs[activeIndex] || { data: [], columns: [] };

  // Handle global filtering
  const data = Array.isArray(currentTab.data) ? currentTab.data : [];
  const filteredData = globalFilterValue
    ? data.filter((item) =>
        globalSearchFields.some((field) =>
          String(item[field] || "")
            .toLowerCase()
            .includes(globalFilterValue.toLowerCase())
        )
      )
    : data;

  /**
   * Custom paginator template
   */
  const paginatorTemplate = {
    layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
    FirstPageLink: (options) => (
      <button
        onClick={options.onClick}
        disabled={options.disabled}
        className="btn btn-outline-primary pagination-btn d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-chevron-double-left "></i>
      </button>
    ),
    PrevPageLink: (options) => (
      <button
        onClick={options.onClick}
        disabled={options.disabled}
        className="btn btn-outline-primary pagination-btn d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-chevron-left"></i>
      </button>
    ),
    NextPageLink: (options) => (
      <button
        onClick={options.onClick}
        disabled={options.disabled}
        className="btn btn-outline-primary pagination-btn d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    ),
    LastPageLink: (options) => (
      <button
        onClick={options.onClick}
        disabled={options.disabled}
        className="btn btn-outline-primary pagination-btn d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-chevron-double-right"></i>
      </button>
    ),
  };

  return (
    <div
      className="bg-light"
      style={{
        margin: 0,
        padding: 0,
        textAlign: "center",
        userSelect: "text",
        backgroundColor: "#e3f2fd",
      }}
    >
      <style>
        {`
          button.btn.btn-outline-primary i:hover {
            color: blue;
          }
          button.btn.btn-outline-primary {
            background-color: transparent;
            border-color: transparent;
          }
          .p-datatable thead th {
            background-color: #e3f2fd !important;
          }
        `}
      </style>

      {tableName && (
        <div
          className="form-item d-flex align-items-center justify-content-center border rounded"
          style={{
            backgroundColor: "#4fc9da",
            padding: "0.75rem 1rem",
          }}
        >
          <h5 className="modal-title text-center w-100 font-weight-bold text-black">
            {tableName}
          </h5>
        </div>
      )}

      {isTabsEnabled && (
        <div className="d-flex justify-content-center mt-3">
          <ul
            className="nav nav-tabs"
            style={{ borderBottom: "0 solid #ddd", userSelect: "text" }}
          >
            {tabs.map((tab, index) => (
              <li className="nav-item" key={index}>
                <button
                  className={`nav-link ${activeIndex === index ? "active" : ""}`}
                  onClick={() => handleTabClick(index)}
                  style={{
                    border: "none",
                    textAlign: "center",
                    userSelect: "text",
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="card m-3 pt-1 rounded-3"
        style={{ borderRadius: "0.5rem", textAlign: "center", userSelect: "text" }}
      >
        {/* Search & Export Row */}
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ padding: "5px 5px", userSelect: "text" }}
        >
          <div className="input-group" style={{ userSelect: "text" }}>
            <span className="input-group-text">
              <i className="pi pi-search" />
            </span>
            <InputText
              value={globalFilterValue}
              onChange={(e) => setGlobalFilterValue(e.target.value)}
              placeholder={searchPlaceholder || "Search"}
              className="form-control p-1 fs-7"
            />
            &nbsp;&nbsp;
            {showExportButton && (
              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2">
                <button
                  className="btn btn-sm btn-success w-100 w-md-auto"
                  onClick={exportToExcel}
                  style={{
                    backgroundColor: "rgb(0, 152, 202)",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="pi pi-file-excel" style={{ fontSize: "24px" }}></i>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ margin: 0, padding: 0, textAlign: "center" }}>
          <div
            style={{
              margin: 0,
              padding: 0,
              textAlign: "center",
              border: "none",
              userSelect: "text",
            }}
          >
            <div className="table-responsive-container">
              <div
                className="table-responsive table-bordered table-striped table-hover"
                style={{ overflowX: "auto" }}
              >
                <DataTable
                  value={filteredData}
                  paginator
                  paginatorTemplate={paginatorTemplate}
                  rows={10}
                  className="table table-bordered table-striped table-hover mb-0"
                  emptyMessage="No Records Found."
                  responsiveLayout="scroll"
                  style={{
                    margin: 0,
                    padding: 0,
                    borderWidth: 0,
                    textAlign: "center",
                    userSelect: "text",
                    WebkitUserDrag: "none",
                    textWrap: "nowrap",
                  }}
                  draggable={false}
                >
                  {currentTab.columns.map((col, i) => (
                    <Column
                      key={i}
                      field={col.field}
                      header={col.header}
                      sortable={col.sortable || false}
                      body={col.body}
                      headerStyle={{ textAlign: "center", userSelect: "text" }}
                      style={{ userSelect: "text", WebkitUserDrag: "none" }}
                      draggable={false}
                    />
                  ))}
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
