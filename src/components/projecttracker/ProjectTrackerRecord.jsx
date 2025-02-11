// src/components/projecttracker/ProjectTrackerRecord.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

export const ProjectTrackerRecord = ({ clientId }) => {
  // console.log(clientId);
  const [projects, setProjects] = useState([]);
  const { getAllProjects } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getAllProjects(clientId);
        if (Array.isArray(projectData)) {
          setProjects(projectData);
        } else {
          console.error("API returned data that is not an array:", projectData);
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error.message);
        setProjects([]);
      }
    };

    fetchProjects();
  }, [getAllProjects]);

  // console.log(clientId);

  return (
    <>

      <div className="card">

        <div className="tab-content">
          <div
            id="nit_billing_months"
            className="card-body p-0 tab-pane fade active show"
            role="tabpanel"
            aria-labelledby="nit_billing_months"
          >
            <div className="table-responsive">
              <table className="table table-row-bordered align-middle gy-4 gs-9">
                <thead className="border-bottom border-gray-200 fs-6 text-gray-600 fw-bold bg-light bg-opacity-75">
                  <tr>
                    <td className="min-w-150px">Project ID</td>
                    <td className="min-w-150px">Title</td>
                    <td className="min-w-150px">Body</td>
                    <td className="min-w-250px">Created At</td>
                    <td className="min-w-150px">Updated At</td>
                    <td className="min-w-150px">View</td>
                  </tr>
                </thead>
                <tbody className="fw-semibold text-gray-600">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <tr key={project.project_id}>
                        <td>
                          <Link
                            to={`projects/${project.project_id}`}
                          >
                            {project.project_id}
                          </Link>
                        </td>
                        <td>{project.title}</td>
                        <td>{project.body}</td>
                        <td>{new Date(project.created_at).toLocaleString()}</td>
                        <td>{new Date(project.updated_at).toLocaleString()}</td>
                        <td>
                          <Link
                            to={`projects/${project.project_id}`}
                            className="btn btn-sm btn-light btn-active-light-primary"
                          >
                            View
                          </Link>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No projects available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};
