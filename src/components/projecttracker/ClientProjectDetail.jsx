import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Button from "@mui/material/Button";
import { CaseTrackerRecord } from "../casetracker/CaseTrackerRecord";

export const ClientProjectDetail = () => {
  const { project_id } = useParams();
  const projectId = project_id;
  const client_data = sessionStorage.getItem("client_data");
  let clientId = null;

  if (client_data && client_data !== "null") {
    clientId = JSON.parse(client_data).client_id;
  }

  const { getSingleProject } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState("");

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      // console.log(
      //   "Fetching Project Details for ClientID: ",
      //   clientId,
      //   " and ProjectID: ",
      //   projectId
      // );
      const projectData = await getSingleProject(clientId, projectId);
      setProject(projectData);
    } catch (error) {
      console.error("Error fetching project details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [clientId, projectId]);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>No project details found.</div>;

  return (
    <div className="container" style={{ maxWidth: "100%" }}>
      {/* <div className="d-flex flex-row align-items-start gap-3 my-3">
        <Button
          variant={activeButton === "allCases" ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleButtonClick("allCases")}
          style={{ minWidth: "150px" }}
        >
          Show All Cases
        </Button>
      </div> */}

      {/* {activeButton === "allCases" ? (
        <CaseTrackerRecord />
      ) : ( */}
      {/* <div className="card p-3 shadow-sm">
          <div
            className="form-item d-flex align-items-center justify-content-center p-3 rounded"
            style={{
              background: "linear-gradient(145deg, #003F73 0%, #11486C 100%)",
              color: "white",
            }}
          >
            <h4 className="mb-0 fw-bold text-white">{project.Title}</h4>
          </div>

          <div className="project-details mt-4">
            <div className="row g-3">
              {Object.entries(project).map(([key, value], idx) => (
                <div className="col-lg-4 col-md-12" key={idx}>
                  <div className="d-flex flex-column p-2 border rounded bg-light">
                    <label
                      className="fw-bold fs-6 text-primary"
                      style={{ marginBottom: "5px" }}
                    >
                      {key.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}:

                      <span className="text-black fs-6">
                        {value !== null && value !== "" ? value : "N/A"}
                      </span>
                    </label>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </div> */}
      {/* )} */}


      <div className="card p-3 shadow-sm">
        <div
          className="form-item d-flex p-3 rounded text-black"
          style={{
            background: "#4fc9da",
            // background: "linear-gradient(145deg, #003F73 0%, #11486C 100%)",
            // color: "white",
          }}
        >
          <h4 className="mb-0 fw-bold text-black">{project.Title}</h4>
        </div>

        <div className="project-details mt-4">
          <div className="row g-3">
            {Object.entries(project)
              .filter(([key]) => key !== "Title")
              .map(([key, value], idx) => (
                <div className="col-lg-6 col-md-12" key={idx}>
                  <div className="d-flex flex-column p-2 border rounded bg-light">
                    <label
                      className=" fs-6 "
                      style={{ marginBottom: "5px" }}
                    >
                      {/* {key
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase())} */}
                      {key}
                      :  <span className="text-black fs-6">
                        {value !== null && value !== "" ? value : "N/A"}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>




    </div>
  );
};
