import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../Loader/Loader";
import GenericPage from "../genericpage/GenericPage";
import { useNavigate } from "react-router-dom";

export const GenericKeywords = ({ keywords, handleBackClick }) => {
  const { updateShareBoxKeyword } = useAuth();
  const [keywordDetails, setKeywordDetails] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKeywordDetails = async () => {
      if (!keywords) return;
      setLoading(true);
      setError(null);

      try {
        const response = await updateShareBoxKeyword(keywords);
        setKeywordDetails(response?.data || {});
        setError(null);
      } catch (err) {
        console.error("Error fetching keyword details:", err);
        setError("Failed to fetch keyword details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchKeywordDetails();
  }, [keywords]);

  useEffect(() => {
    if (keywordDetails) {
      // const handleNameClick = (createdById) => {
      //   navigate(`/profile/${createdById}`);
      // };

      const handleNameClick = (createdById) => {
        navigate(`/profile`);
      };

      const shareboxColumns = [
        { field: "s_id", header: "ID", sortable: true },
        { field: "s_title", header: "Title", sortable: true },
        {
          field: "created_by_username",
          header: "Created By",
          sortable: true,
          body: (rowData) => (
            <a
              href="#"
              className="text-decoration-none text-info"
              onClick={(e) => {
                e.preventDefault();
                handleNameClick(rowData.s_created_by);
              }}
            >
              {rowData.created_by_username}
            </a>
          ),
        },
        { field: "s_updated_on", header: "Last Updated", sortable: true },
      ];

      const fileColumns = [
        { field: "file_id", header: "File ID", sortable: true },
        { field: "file_name", header: "File Name", sortable: true },
        { field: "file_size", header: "File Size", sortable: true },
        { field: "uploaded_by", header: "Uploaded By", sortable: true },
        { field: "upload_date", header: "Upload Date", sortable: true },
      ];

      const newTabs = [
        {
          label: "Posts",
          data: keywordDetails?.shareboxes || [],
          columns: shareboxColumns,
        },
        {
          label: "Files",
          data: keywordDetails?.files || [],
          columns: fileColumns,
        },
      ];

      setTabs(newTabs);
    }
  }, [keywordDetails, navigate]);

  if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container my-4">
      <div
        className="form-item d-flex align-items-center justify-content-between border p-3 rounded text-white fs-4"
        style={{
          background: "#4fc9da",
          marginBottom: "1rem",
        }}
      >
        {/* <h4>Details for Keyword: {keywords}</h4> */}
        {/* TODO: Add back Button Here */}

        <button
          className="btn btn-sm d-flex justify-content-between align-items-center"
          style={{
            background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            padding: "6px 12px",
            fontSize: "12px",
            color: "#003F73",
          }}
          onClick={handleBackClick}
        >
          <i
            className="bi bi-arrow-left"
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "black",
            }}
          ></i> &nbsp;{"Back"}
        </button>

      </div>

      <GenericPage
        tabs={tabs}
        tableName={`Details for ${keywords}`}
        globalSearchFields={[
          "s_id",
          "s_title",
          "created_by_username",
          "s_updated_on",
          "file_id",
          "file_name",
          "file_size",
          "uploaded_by",
          "upload_date",
        ]}
        searchPlaceholder="Search in Posts or Files"
      />
    </div>
  );
};
