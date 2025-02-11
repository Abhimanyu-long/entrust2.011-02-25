// src/components/projecttracker/ProjectDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { EditProject } from "./EditProject";
import Button from "@mui/material/Button";
import { CaseTrackerRecord } from "../casetracker/CaseTrackerRecord";
import { ProjectChart } from "./ProjectChart";

export const ProjectDetails = (props) => {
  const { projectId } = useParams();  // Extracts project_id from URL params
  const client_data = sessionStorage.getItem("client_data");
  let clientId = null;

  // Parse client_id from localStorage if available
  if (client_data && client_data !== "null") {
    clientId = JSON.parse(client_data).client_id;
  }

  // console.log("i am use params", clientId, projectId);

  const { getSingleProject, updateProject } = useAuth();
  const [project, setProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch project details
  const fetchProject = async () => {
    setLoading(true);
    try {
      // console.log("Fetching Project Details for ClientID: ", clientId, " and Projectid: ", projectId);
      const projectData = await getSingleProject(clientId, projectId);
      setProject(projectData);
      setFormData(projectData);
    } catch (error) {
      console.error("Error fetching project details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [clientId, projectId]);

  const [activeButton, setActiveButton] = useState("");

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>No project details found.</div>;
  }

  // console.log(project);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="project-details">
      {isEditing ? (
        <>
          <EditProject
            clientId={clientId}
            projectId={projectId}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </>
      ) : (
        <>
          <div className="d-flex flex-row align-items-start gap-4 m-2">
            <Button
              variant={activeButton === "allCases" ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleButtonClick("allCases")}
            >
              Show All Cases
            </Button>
          </div>

          {activeButton === "allCases" ? (
            <CaseTrackerRecord />
          ) : (
            <>
            <div className="m-5 pt-3">
            <div className="card mb-5 mb-xl-10" id="nit_profile_details_view">
                {/* <div className="card-header cursor-pointer">
                  <div className="card-title m-0">
                    <h3 className="fw-bold m-0">{project.title}</h3>
                  </div>

                  <a
                    onClick={() => setIsEditing(true)}
                    className="btn btn-sm btn-primary align-self-center"
                  >
                    Edit Project
                  </a>
                </div> */}


                <div
                  className="card-header cursor-pointer"
                  style={{
                    backgroundColor: "#0098CA",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="card-title m-0">
                    <h3 className="fw-bold m-0" style={{ color: "#ffffff", fontSize: "1.5rem" }}>
                      {project.title}
                    </h3>
                  </div>

                  <a
                    onClick={() => setIsEditing(true)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#0098CA",
                      border: "2px solid #0098CA",
                      borderRadius: "10px",
                      padding: "8px 16px",
                      transition: "background-color 0.3s ease, color 0.3s ease",
                      fontWeight: "bold",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                    aria-label="Edit Project"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#0098CA";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.color = "#0098CA";
                    }}
                  >
                    Edit Project
                  </a>
                </div>

                {/* <div className="projectDetails">
                  

                  <div className="card-body p-9">
                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Project ID
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.project_id} &nbsp;&nbsp;
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Title
                      </label>
                      <div className="col-lg-8 d-flex align-items-center">
                        <span className="fw-bold fs-6 text-gray-800 me-2">
                          {project.title}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Is Batchable
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.body}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Free Max Cases
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.notifications}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Separate Invoice?
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.no_notifications ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        New Timer View?
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.bill_statement_for}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Billing type
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.set_value}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Total Time
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.split_estimate ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Peer Review Time
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.enable_time_estimate_setup ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Re-work Time
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.configure_for}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Fixed Rate
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.project_group_config}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable Rate 1
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.enable_signing ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable Rate 2
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.pfs_matter_type || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable Rate 3
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.open_casebody_default ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable Rate 4
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.case_billing_check ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable Rate 5
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.comments_limit}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable Rate 6
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.checklist_message}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable Rate 7
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.checklist_file || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Fixed Caption
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.is_batchable ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable 1 Caption
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.billing_type || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable 2 Caption
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.ratemin || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable 3 Caption
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.free_max_cases}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable 4 Caption
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.case_reopen ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable 5 Caption
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.separate_invoice ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable 6 Caption
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.new_timer_view ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Variable 7 Caption
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.enable_quality_check ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Display Timer Seconds:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.display_timer_seconds ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Due Date Notification:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.due_date_notification ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Comment Fetch Documents:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.comment_fetch_documents ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Case MRR Request:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.case_mrr_request ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        File Delivery Check:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.file_delivery_check ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Case Closure Delivery Check:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.case_closure_delivery_check ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Enable Review Sheet:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.enable_review_sheet ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        KRQNNQ:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.krqnnq || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Enable PFS Module:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {project.enable_pfs_module ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Created At:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {new Date(project.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-7">
                      <label className="col-lg-4 fw-bold text-muted">
                        Updated At:
                      </label>
                      <div className="col-lg-8">
                        <span className="fw-bold fs-6 text-gray-800">
                          {new Date(project.updated_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="project-details card shadow-sm">
  {/* <div className="card-header bg-primary text-white p-4">
    <h3 className="card-title">Project Details</h3>
  </div> */}
  <div className="card-body p-10 pt-4">
    <div className="row pt-5">
      {[
        { label: "Project ID", value: project.project_id},
        { label: "Title", value: project.title },
        { label: "Is Batchable", value: project.body },
        { label: "Free Max Cases", value: project.notifications },
        { label: "Separate Invoice?", value: project.no_notifications ? "Yes" : "No"},
        { label: "New Timer View?", value: project.bill_statement_for},
        { label: "Billing Type", value: project.set_value},
        { label: "Total Time", value: project.split_estimate ? "Yes" : "No" },
        { label: "Peer Review Time", value: project.enable_time_estimate_setup ? "Yes" : "No"},
        { label: "Re-work Time", value: project.configure_for},
        { label: "Fixed Rate", value: project.project_group_config},
        { label: "Variable Rate 1", value: project.enable_signing ? "Yes" : "No" },
        { label: "Variable Rate 2", value: project.pfs_matter_type || "N/A"},
        { label: "Variable Rate 3", value: project.open_casebody_default ? "Yes" : "No" },
        { label: "Variable Rate 4", value: project.case_billing_check ? "Yes" : "No" },
        { label: "Variable Rate 5", value: project.comments_limit},
        { label: "Display Timer Seconds", value: project.display_timer_seconds ? "Yes" : "No" },
        { label: "Created At", value: new Date(project.created_at).toLocaleString() },
        { label: "Updated At", value: new Date(project.updated_at).toLocaleString()}
      ].map(({ label, value, icon }, idx) => (
        <div className="col-lg-6 col-md-12 mb-4" key={idx}>
          <div className="d-flex align-items-center">
            <i className="text-primary me-3"></i>
            <div>
              <label className="fw-bold fs-5">{label}</label>
              <span className="d-block fw-bold fs-7 " style={{color:"#1F1F1F"}}>{value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

              </div>
            </div>
            
            </>
          )}
        </>
      )}
    </div>
  );
};
