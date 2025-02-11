import React, { useEffect, useState } from "react";
import { Overview } from "./Overview";
import { Archived } from "./Archived";
import { Notebook } from "./Notebook";
import { AddNewBook } from "./AddNewBook";
import { ShareboxDetail } from "./ShareboxDetail";
import { EditShareBox } from "./EditShareBox";
import { Revision } from "./Revision";
import { GenericKeywords } from "./GenericKeywords";

export const ShareBox = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [shareboxId, setShareboxId] = useState(null);
  const [isshowTab, setShowTab] = useState(false);
  const [shareboxData, setShareboxData] = useState(null);

  const [isSelectedKeywordTab, setSelectedKeywordTab] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const handleOverviewClick = () => {
    setActiveSection("overview");
  };

  // const handleArchivedClick = () => {
  //   setActiveSection("archived");
  // };

  const handleAddBookClick = () => {
    setActiveSection("addBook");
  };

  const handleShareboxId = (id) => {
    // console.log("Received sharebox_id from child:", id);
    setShareboxId(id);
    setShowTab(true);
    setActiveSection("shareboxdetail");
  };

  const handleViewClick = () => {
    setActiveSection("shareboxdetail");
  };

  const handleEditClick = () => {
    // console.log("Edit button clicked. Current shareboxData:", shareboxData);
    if (shareboxData) {
      setActiveSection("editBook");
    } else {
      console.error("No sharebox data available");
    }
  };

  const handleRevisionClick = () => {
    setActiveSection("revision");
  };

  const handlecloseAddClosed = () => {
    setActiveSection("overview");
    setShowTab(false);
  };

  const handlecloseEditClosed = () => {
    setActiveSection("shareboxdetail");
    setShowTab(true);
  };

  const handleShareboxData = (data) => {
    // console.log("Setting sharebox data in parent:", data);
    setShareboxData(data);
  };

  const handleBackClick = () => {
    if (isSelectedKeywordTab) {
      // If in GenericKeywords, go back to ShareboxDetail
      setSelectedKeywordTab(false);
      setActiveSection("shareboxdetail");
    } else {
      // Default back behavior
      setShowTab(false);
      setActiveSection("overview");
    }
  };

  const handleKeywordClick = (data) => {
    // console.log("Keyword clicked:", data); // Log clicked keyword
    setSelectedKeyword(data);
    setSelectedKeywordTab(true);
    // console.log("Transition to GenericKeywords triggered.");
  };

  // Scroll to top when activeSection changes to 'shareboxdetail'
  useEffect(() => {
    if (activeSection === "shareboxdetail") {
      window.scrollTo(0, 0);
    }
  }, [activeSection]);

  return (
    <>
      {isSelectedKeywordTab ? (
        <GenericKeywords
          keywords={selectedKeyword}
          handleBackClick={handleBackClick}
        />
      ) : (
        <>
          {activeSection === "addBook" ? (
            <div className="container my-5">
              <AddNewBook handlecloseAddClosed={handlecloseAddClosed} />
            </div>
          ) : activeSection === "editBook" ? (
            <div className="container my-5">
              <EditShareBox
                handlecloseEditClosed={handlecloseEditClosed}
                shareboxData={shareboxData}
              />
            </div>
          ) : (
            <>
              <div className="container my-4">
                <div
                  className="form-item d-flex flex-column flex-md-row align-items-center justify-content-between border rounded p-2"
                  style={{ backgroundColor: "#4fc9da" }}
                >
                  <div
                    className="d-flex flex-row gap-3 flex-wrap flex-md-nowrap btn-container flex-wrap gap-2 mb-2 mb-md-0"
                    style={{ justifyContent: "center" }}
                  >
                    {isshowTab ? (
                      <>
                        <button
                          className="btn btn-sm"
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
                          ></i>
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            background:
                              activeSection === "shareboxdetail"
                                ? "#ffffff"
                                : "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            padding: "6px 12px",
                            fontSize: "12px",
                            color: "#003F73",
                          }}
                          onClick={handleViewClick}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            background:
                              activeSection === "editBook"
                                ? "#ffffff"
                                : "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            padding: "6px 12px",
                            fontSize: "12px",
                            color: "#003F73",
                          }}
                          onClick={handleEditClick}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            background:
                              activeSection === "revision"
                                ? "#ffffff"
                                : "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            padding: "6px 12px",
                            fontSize: "12px",
                            color: "#003F73",
                          }}
                          onClick={handleRevisionClick}
                        >
                          Revisions
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm"
                          style={{
                            background:
                              activeSection === "overview"
                                ? "#ffffff"
                                : "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            padding: "6px 12px",
                            fontSize: "12px",
                            color: "#003F73",
                          }}
                          onClick={handleOverviewClick}
                        >
                          Overview
                        </button>
                      </>
                    )}
                  </div>


                  {activeSection == "overview" ? <h5 >
                    Share Box </h5> : <></>}

                  <div className="w-100 w-md-auto">
                    <button
                     className="btn btn-sm add-member-btn w-100"
                      // className="btn btn-primary btn-sm"
                      style={{
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        padding: "6px 12px",
                        fontSize: "12px",
                        color: "#003F73",
                        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                      }}
                      onClick={handleAddBookClick}
                    >
                      Add Book Page
                    </button>
                  </div>
                </div>





                <div className="row gx-4">
                  <div className="col-md-8">
                    <div className="card shadow-sm p-4">
                      {activeSection === "overview" && (
                        <>
                          <Overview onShareboxId={handleShareboxId} />
                        </>
                      )}

                      {/* {activeSection === "archived" && (
                        <>
                          <Archived />
                        </>
                      )} */}

                      {activeSection === "shareboxdetail" && (
                        <>
                          <ShareboxDetail
                            shareboxId={shareboxId}
                            onDataUpdate={handleShareboxData}
                            handleKeywordClick={handleKeywordClick}
                          />
                        </>
                      )}

                      {activeSection === "revision" && (
                        <div className="container my-5">
                          <Revision
                            shareboxData={shareboxData}
                            handlecloseEditClosed={handlecloseEditClosed}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <Notebook onShareboxId={handleShareboxId} />
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};
