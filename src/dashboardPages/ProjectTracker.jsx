import React, { useState } from "react";
import { AddNewProject } from "../components/projecttracker/AddNewProject";
import { ProjectTrackerRecord } from "../components/projecttracker/ProjectTrackerRecord";

export const ProjectTracker = () => {

  // this is case tracker page

  const [activeComponent, setActiveComponent] = useState("ProjectTrackerRecord");

  const renderComponent = () => {
    switch (activeComponent) {
      case "ProjectTrackerRecord":
        return <ProjectTrackerRecord />;
      case "AddNewProject":
        return <AddNewProject />;
      default:
        return <ProjectTrackerRecord />;
    }
  };

  return (
    <>
      <div >
        <div className="mx-8">
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => setActiveComponent("ProjectTrackerRecord")}
          >
            Show All Project
          </button>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => setActiveComponent("AddNewProject")}
          >
            Add New Project
          </button>
        </div>
  
        <div className="component-display">{renderComponent()}</div>
      </div>
    </>
  )
}
