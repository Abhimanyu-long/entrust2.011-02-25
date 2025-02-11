import React, { useState } from "react";
import { AddNewProject } from "../components/projecttracker/AddNewProject";
import { AddNewCase } from "../components/casetracker/AddNewCase";
import { CaseTrackerRecord } from "../components/casetracker/CaseTrackerRecord";

export const CaseTracker = () => {

  // this is case tracker page

  const [activeComponent, setActiveComponent] = useState("CaseTrackerRecord");

  const renderComponent = () => {
    switch (activeComponent) {
      case "CaseTrackerRecord":
        return <CaseTrackerRecord />;
      case "AddNewProject":
        return <AddNewProject />;
      case "AddNewCase":
        return <AddNewCase />;
      default:
        return <CaseTrackerRecord />;
    }
  };

  return (
    <>
      <div>
        <div className="mx-8">
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => setActiveComponent("CaseTrackerRecord")}
          >
            Show All Cases
          </button>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => setActiveComponent("AddNewCase")}
          >
            Add New Case
          </button>
        </div>
        <br />

        <div className="component-display">{renderComponent()}</div>
      </div>
    </>
  );
};
