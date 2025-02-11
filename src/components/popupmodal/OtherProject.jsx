import React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router

export const OtherProject = ({ isotherProjects }) => {
    const navigate = useNavigate();

    // console.log('Received isotherProjects:', JSON.stringify(isotherProjects, null, 2)); // Log incoming data

    // Adjust data access based on the actual structure of isotherProjects
    const projects = Array.isArray(isotherProjects) ? isotherProjects : isotherProjects?.isotherProjects || [];
    // console.log('Parsed projects:', projects); // Log parsed data

    const handleProjectClick = (projectId) => {
        // console.log(`Navigating to project with ID: ${projectId}`); // Log clicked ID
        navigate(`/myprojects/${projectId}`);
    };

    return (
<div className="container mt-4">
  <div className="row">
    {projects.map((project, index) => (
      <div
        key={project.project_id}
        className="col-md-6 col-lg-4 mb-3" // Adjust columns: 6 for 2-column, 4 for 3-column
      >
       <div className="card-body d-flex flex-column">
  <a
    className="card-title text-primary" // Bootstrap class for primary text color
    style={{ cursor: "pointer" }} // Custom cursor style to indicate clickability
    onClick={() => handleProjectClick(project.project_id)}
    role="button" // Improves accessibility
    aria-label={`Go to project: ${project.name}`} // Optional: for screen readers
    title={project.name} // Optional: Shows project name on hover
  >
    <span>{index + 1}.</span> {project.name}
  </a>
</div>

      </div>
    ))}
  </div>
</div>

    );
};

