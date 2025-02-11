import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css'; // Core PrimeReact styles
import 'primeicons/primeicons.css'; // PrimeIcons
import "../../assets/css/activitylog.css"
import Loader from "../Loader/Loader";

const entrust_url =
  import.meta.env.VITE_BASE_URL + ':' + import.meta.env.VITE_BASE_PORT;
const API_URL = entrust_url;

export const ActiveLogs = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageRange, setPageRange] = useState([1, 2, 3, 4, 5]);
  const rows = 10 + 1; // Fixed rows per page
  const [filters, setFilters] = useState({
    start_time: null,
    end_time: null,
    activity_type: null,
    sort: 'desc',
  });

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const params = {
        page: page,
        limit: rows,
        sort: filters.sort,
        ...(filters.start_time && { start_time: filters.start_time.toISOString() }),
        ...(filters.end_time && { end_time: filters.end_time.toISOString() }),
        ...(filters.activity_type && { activity_type: filters.activity_type }),
      };

      const response = await axios.get(`${API_URL}/user/activity-history/log-trail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      const fetchedLogs = Array.isArray(response.data) ? response.data : [];
      // setActivityLogs([...fetchedLogs].reverse());
      setActivityLogs(fetchedLogs);

      setTotalRecords(activityLogs.length);      // Extract unique activity types from the logs
      const uniqueActivityTypes = [
        ...new Set(fetchedLogs.map((log) => log.activity_type)),
      ].map((type) => ({ label: type, value: type }));
      setActivityTypes(uniqueActivityTypes);
    } catch (err) {
      // setError('Failed to fetch activity logs.');
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs(page); // Fetch data whenever the page or filters change
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setPage(1); // Reset to page 1 on filter change
  };

  const resetFilters = () => {
    setFilters({
      start_time: null,
      end_time: null,
      activity_type: null,
      sort: 'desc',
    });
    setPage(1); // Reset to page 1 when clearing filters
  };

  const handlePageClick = (selectedPage) => {
    setPage(selectedPage);

    if (selectedPage === pageRange[pageRange.length - 1]) {
      const newRange = Array.from({ length: 5 }, (_, i) => selectedPage + i);
      setPageRange(newRange);
    } else if (selectedPage === pageRange[0] && selectedPage > 1) {
      const newRange = Array.from({ length: 5 }, (_, i) => selectedPage - 5 + i).filter((p) => p > 0);
      setPageRange(newRange);
    } else if (selectedPage === 1) {
      setPageRange([1, 2, 3, 4, 5]);
    }
  };

  const paginatorTemplate = {
    layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
    FirstPageLink: (options) => (
      <button
        onClick={options.onClick}
        disabled={options.disabled}
        // className="btn btn-outline-primary pagination-btn d-flex align-items-center justify-content-center"
        className="btn btn-outline-primary pagination-btn d-flex align-items-center justify-content-center"
      // style={{ padding: "0.25rem", fontSize: "1rem", width: "2rem", height: "2rem" }}
      >
        <i className="bi bi-chevron-double-left "></i>
      </button>
    ),
    PrevPageLink: (options) => (
      <button
        onClick={options.onClick}
        disabled={options.disabled}
        //  className="btn btn-outline-primary pagination-btn"
        className="btn btn-outline-primary pagination-btn d-flex align-items-center justify-content-center"
      //  style={{ padding: "0.25rem", fontSize: "1rem", width: "2rem", height: "2rem" }}
      >
        <i className="bi bi-chevron-left"></i>
      </button>
    ),
    NextPageLink: (options) => (
      <button
        onClick={options.onClick}
        disabled={options.disabled}
        // className="btn btn-outline-primary pagination-btn"
        className="btn btn-outline-primary pagination-btn d-flex align-items-center justify-content-center"
      // style={{ padding: "0.25rem", fontSize: "1rem", width: "2rem", height: "2rem" }}
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    ),
    LastPageLink: (options) => (
      <button
        onClick={options.onClick}
        disabled={options.disabled}
        // className="btn btn-outline-primary pagination-btn"
        className="btn btn-outline-primary pagination-btn d-flex align-items-center justify-content-center"
      // style={{ padding: "0.25rem", fontSize: "1rem", width: "2rem", height: "2rem" }}
      >
        <i className="bi bi-chevron-double-right"></i>
      </button>
    ),
  };

  const handlePageChange = (event) => {
    // const newPage = event.page + 1; // PrimeReact uses 0-based indexing
    setPage(event.page + 1);
    fetchActivityLogs(event.page + 1); // Fetch data for the new page
  };

    // If loading, show loader
    if (loading) {
      return <Loader />;
    }

  return (
    <Suspense fallback={<Loader />}>
    <div className="container my-5  border-0">
      <div
        className="form-item d-flex align-items-center justify-content-center border rounded "
        style={{
          backgroundColor: "#4fc9da",
          padding: "0.75rem 1rem",
        }}
      >
        <h5 className="modal-title text-center w-100 font-weight-bold text-black">
          My Activity Log
        </h5>
      </div>


      <div className="">
        {/* Data Table and Pagination */}
        {loading && page === 1 ? (
          <div className="text-center py-3">
            <span className="spinner-border text-primary" role="status" aria-hidden="true"></span>
            <p className="mt-3">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center text-danger py-5">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="table-responsive-container ">
              <div
                className="table-responsive table-bordered table-striped table-hover"
                style={{ overflowX: "auto" }}
              >

                {console.log("activityLogs", activityLogs.length)}
                <DataTable
                  value={Array.isArray(activityLogs) ? activityLogs : []}
                  rowsPerPageOptions={[10, 20, 30, 50, 100]}
                  emptyMessage="No activity logs available."
                  scrollable // Makes the table scrollable
                  paginator
                  // rows={rows}
                  totalRecords={totalRecords}
                  paginatorTemplate={paginatorTemplate}
                  rows={10}
                  className="table table-bordered table-striped table-hover mb-0 text-center fs-8"
                  responsiveLayout="scroll"
                  first={(page - 1) * rows} // Ensure correct start index
                  onPage={(event) => handlePageChange(event)}
                  style={{
                    margin: 0,
                    padding: 0,
                    borderWidth: 0,
                    textAlign: "center",
                    userSelect: "text",
                    WebkitUserDrag: "none",
                  }}
                  draggable={false} // If supported
                >
                  <Column
                    header={`Sr${'\u00A0'}No`}
                    body={(rowData, { rowIndex }) => rowIndex + 1}
                    style={{ textAlign: "center", minWidth: "80px" }}
                  />
                  <Column
                    field="entity_type"
                    header="Entity Type"
                    sortable
                    style={{ minWidth: "200px", textAlign: "left", whiteSpace: "normal", wordBreak: "break-word" }}
                  />
                  <Column
                    field="activity_type"

                    header={`Activity${'\u00A0'}Type`}
                    sortable
                    style={{ minWidth: "200px", textAlign: "left", whiteSpace: "normal", wordBreak: "break-word" }}
                  />
                  <Column
                    field="activity_description"
                    header={`Activity${'\u00A0'}Description`}
                    body={(rowData) => (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: rowData.activity_description || '',
                        }}
                        style={{ whiteSpace: "normal", wordBreak: "break-word", minWidth: "300px" }}
                      />
                    )}
                    sortable
                    style={{ textAlign: "left" }}
                  />
                  <Column
                    field="performed_by"
                    header={`Performed${'\u00A0'}By`}
                    sortable
                    style={{ minWidth: "200px", textAlign: "left", whiteSpace: "normal", wordBreak: "break-word" }} />
                  <Column
                    field="performed_at"
                    header={`Performed${'\u00A0'}At`}
                    body={(rowData) => new Date(rowData.performed_at).toLocaleString()}
                    sortable
                    style={{ minWidth: "250px", textAlign: "left", whiteSpace: "normal", wordBreak: "break-word" }}
                  />
                </DataTable>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
     </Suspense>
  );
};