import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Card, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";

// STEP 1: Import all icons from the assets folder (Add or remove as needed).
import ArbitrationIcon from "../../assets/Images/projectIcons/arbitration.svg";
import AddOnsIcon from "../../assets/Images/projectIcons/Add ons_.svg";
import ClaimValidationIcon from "../../assets/Images/projectIcons/Claim Validation_.svg";
import ClientRelationshipIcon from "../../assets/Images/projectIcons/Client relationship management.svg";
import DataEntryIcon from "../../assets/Images/projectIcons/Data Entry.svg";
import DataScrubbingIcon from "../../assets/Images/projectIcons/Data scrubbing_.svg";
import DepositionSummaryIcon from "../../assets/Images/projectIcons/Deposition Summary_.svg";
import FileAssociationIcon from "../../assets/Images/projectIcons/file association_.svg";
import InfantCompromizeIcon from "../../assets/Images/projectIcons/Infant compromise_.svg";
import LegalResearchAndSummarizationIcon from "../../assets/Images/projectIcons/Legal research &summarization -_.svg";
import MarketResearchIcon from "../../assets/Images/projectIcons/Market research surveys_.svg";
import MassTortReviewIcon from "../../assets/Images/projectIcons/Mass tort review.svg";
import MRRIcon from "../../assets/Images/projectIcons/MRR.svg";
import MotionsIcon from "../../assets/Images/projectIcons/Motions_.svg";
import PaymentProcessingIcon from "../../assets/Images/projectIcons/payment processing_.svg";
import PlaintiffFactCheckIcon from "../../assets/Images/projectIcons/Plaintiff fact check_.svg";
import ResearchAndIntakeIcon from "../../assets/Images/projectIcons/Research and Intake.svg";
import SummonsAndComplaintsIcon from "../../assets/Images/projectIcons/Summons and complaints.svg";
import UnresponsiveClientLocationIcon from "../../assets/Images/projectIcons/Unresponsive Client location services.svg";
import VerifiedBillsIcon from "../../assets/Images/projectIcons/Verified bills of particulars_.svg";
import WorkflowAdministrationIcon from "../../assets/Images/projectIcons/workflow administration.svg";
import DemandLettersIcon from "../../assets/Images/projectIcons/DemandLetter.svg";
import MedicalRecordReviewChronologyTimelineandNarrativeSummaryIcon from "../../assets/Images/projectIcons/Medical Record Review - Chronology, Timeline and Narrative Summary.svg";
import RebuttalAffidavitsAffirmationsIcon from "../../assets/Images/projectIcons/Rebuttal Affidavits – Affirmations.svg";
import  PlaintiffFactSheet from "../../assets/Images/projectIcons/Plaintiff fact check_.svg";
import MRR from "../../assets/Images/projectIcons/MRR.svg"
// STEP 2: Create a mapping from project name to its icon.
const projectIconsMapping = {
  "Add ons": AddOnsIcon,
  "Arbitration": ArbitrationIcon,
  "Claim Validation": ClaimValidationIcon,
  "Client Relationship Management": ClientRelationshipIcon,
  "Data Entry": DataEntryIcon,
  "Data Scrubbing": DataScrubbingIcon,
  "Deposition Summary": DepositionSummaryIcon,
  "File Association": FileAssociationIcon,
  "Infant Compromise": InfantCompromizeIcon,
  "Legal Research & Summarization": LegalResearchAndSummarizationIcon,
  "Market Research Surveys": MarketResearchIcon,
  "Mass Tort Review": MassTortReviewIcon,
  "Medical Record Review": MRRIcon,
  "Motions": MotionsIcon,
  "Payment Processing": PaymentProcessingIcon,
  "Plaintiff Fact Sheet (PFS)": PlaintiffFactCheckIcon,
  "Research & Intake": ResearchAndIntakeIcon,
  "Summons and Complaint": SummonsAndComplaintsIcon,
  "Unresponsive Client Location Services": UnresponsiveClientLocationIcon,
  "Verified bills of particulars": VerifiedBillsIcon,
  "Workflow Administration": WorkflowAdministrationIcon,
  "Demand Letters": DemandLettersIcon,
  "Bill of Particulars": VerifiedBillsIcon, 
  "Chronology & Timeline & Narrative Summary": MedicalRecordReviewChronologyTimelineandNarrativeSummaryIcon,
  "Rebuttal Affidavits/Affirmations-IME": RebuttalAffidavitsAffirmationsIcon,
  "Chronologies and Medical Summaries":MedicalRecordReviewChronologyTimelineandNarrativeSummaryIcon,
  "Plaintiff Fact Sheet\'s":PlaintiffFactSheet,
  "MRR":MRR
  
};

// STEP 3: Define team order and project order (for demonstration, can customize as needed).
const teamOrder = ["Legal", "Medical", "Business Process", "Voice Process", "Others"];
const projectOrder = [
  // Missing Ratechart in API for all Existing Projects. 
  "Demand Letters",
  "Summons and Complaint",
  "Bill of Particulars", // Missing Ratechart in API
  "Research & Intake",
  "Infant Compromise", 
  "Deposition Summary",
  "Legal Research & Summarization",
  "Motions",
  "Claim Validation", // Project Team is set to null in API
  "Mass Tort Review", // Missing Ratechart in API
  "Chronology & Timeline & Narrative Summary", 
  "Rebuttal Affidavits/Affirmations-IME",
  "Plaintiff Fact Sheet (PFS)",
  "Medical Record Review",
  "Add ons", // Missing Project in API Response
  "Data Entry", // Dr. Amruta ma'am Said to ask Rohit Sir about the rates of this projects and add in database accordingly. 
  "Data Scrubbing", // Dr. Amruta ma'am Said to ask Rohit Sir about the rates of this projects and add in database accordingly.
  "File Association", // 1. Project Team is set to null in API, 2. Dr. Amruta ma'am Said to ask Rohit Sir about the rates of this projects and add in database accordingly.
  "Payment Processing", // Dr. Amruta ma'am Said to ask Rohit Sir about the rates of this projects and add in database accordingly.
  "Workflow Administration", // Dr. Amruta ma'am Said to ask Rohit Sir about the rates of this projects and add in database accordingly.
  "Arbitration", // Dr. Amruta ma'am Said to ask Rohit Sir about the rates of this projects and add in database accordingly.
  "Unresponsive Client Location Services",
  "Client Relationship Management",
  "Market Research Surveys"
];

// STEP 4: Define any hidden projects here (for demonstration, can be empty or customized).
const hiddenProjects = [
  // "Data Entry", // Example: hide this project if needed
  "Organize Medical Record", // 1. Should be Replaced with Medical Record Review Chronology Time line and Narrative Summary or Organize Medical Record Should be renamed, 2. Missing Ratechart in API
  "Calling", 
  "Intake", 
  "MCP", 
  "MRR- Research", 
  "Medical Opinion", 
  "Medical Record Tagging and Indexing", 
  "Medical Records Retrieval", 
  "Medical Transcription", 
  "Rebuttal Affidavits/Affirmations-Peer Review", 
  "Skip Tracing", 
  "Zee Test Project"
];

// STEP 5: Define any hidden teams here (for demonstration, can be empty or customized).
// For example, if you want to hide the "Others" tab, just add "Others" to this array.
const hiddenTeams = [
   "Others", // Example: hide this entire team tab if needed
];

export const WithoutProjectCaseCreate = ({ show, onHide, onProjectSelect }) => {
  const { getProjects } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState({ existingProjects: [], groupedAdditionalProjects: {} });
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [rateChart, setRateChart] = useState(null);
  const [showRateModal, setShowRateModal] = useState(false);

  const [activeTab, setActiveTab] = useState(null);

  // Kept old teamMapping
  const teamMapping = {
    LPM: "Legal",
    MPM: "Medical",
    VPM: "Voice Process",
    BPM: "Business Process",
    // We can comment out or remove the null mapping here if we wish to hide "Others".
    null: "Others",
  };

  // Helper to get icon from the mapping
  const getProjectIcon = (projectName) => {
    return projectIconsMapping[projectName] || DemandLettersIcon;
  };

  // Helper to reorder the keys of the grouped additional projects based on teamOrder
  const reorderTeamKeys = (groupedProjects) => {
    const reordered = {};
    // Sort keys by custom order in teamOrder
    const sortedKeys = Object.keys(groupedProjects).sort((a, b) => {
      const indexA = teamOrder.indexOf(a) === -1 ? 999 : teamOrder.indexOf(a);
      const indexB = teamOrder.indexOf(b) === -1 ? 999 : teamOrder.indexOf(b);
      return indexA - indexB;
    });
    sortedKeys.forEach((key) => {
      reordered[key] = groupedProjects[key];
    });
    // Remove hidden teams if any
    for (const hiddenTeam of hiddenTeams) {
      if (reordered[hiddenTeam]) {
        delete reordered[hiddenTeam];
      }
    }
    return reordered;
  };

  // Helper to reorder projects within each team based on projectOrder
  const reorderProjects = (projectArray) => {
    const mapByName = {};
    projectArray.forEach((p) => (mapByName[p.project_name] = p));
    const sortedByOrder = [];
    // Add projects by order first
    projectOrder.forEach((orderedName) => {
      if (mapByName[orderedName]) {
        sortedByOrder.push(mapByName[orderedName]);
        delete mapByName[orderedName];
      }
    });
    // Add remaining ones that are not in projectOrder
    Object.values(mapByName).forEach((p) => {
      sortedByOrder.push(p);
    });
    return sortedByOrder;
  };

  const transformProjects = (projectsData) => {
    let existingProjects = [];
    let groupedAdditionalProjects = {};

    projectsData.forEach((projectGroup) => {
      if (projectGroup.existing_projects) {
        existingProjects = projectGroup.existing_projects;
      } else if (projectGroup.additional_projects) {
        projectGroup.additional_projects.forEach((project) => {
          const team = project.project_team;
          const groupName = teamMapping[team] || "Others";
          if (!groupedAdditionalProjects[groupName]) {
            groupedAdditionalProjects[groupName] = [];
          }
          groupedAdditionalProjects[groupName].push(project);
        });
      }
    });

    // Reorder each team's projects
    Object.keys(groupedAdditionalProjects).forEach((team) => {
      groupedAdditionalProjects[team] = reorderProjects(groupedAdditionalProjects[team]);
    });

    // Reorder the grouped teams
    groupedAdditionalProjects = reorderTeamKeys(groupedAdditionalProjects);

    // Reorder existing projects too (optional)
    existingProjects = reorderProjects(existingProjects);

    return { existingProjects, groupedAdditionalProjects };
  };

  const handleFetchProjects = async () => {
    setLoading(true);
    try {
      const projectsData = await getProjects();
      const { existingProjects, groupedAdditionalProjects } = transformProjects(projectsData);
      setProjects({ existingProjects, groupedAdditionalProjects });
      setError(null);
      if (existingProjects.length > 0) {
        setActiveTab("existing");
      } else {
        const firstTeam = Object.keys(groupedAdditionalProjects)[0];
        setActiveTab(firstTeam || "none");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      handleFetchProjects();
    }
  }, [show]);

  const handleProjectSelect = (projectId, projectName) => {
    setSelectedProject({ projectId, projectName });
  };

  const dataPassModal = () => {
    onProjectSelect(selectedProject);
  };

  const handleShowRateChart = (p_rates) => {
    setRateChart(p_rates);
    setShowRateModal(true);
  };

  const handleCloseRateChart = () => {
    setShowRateModal(false);
    setRateChart(null);
  };

  const hasExistingProjects = projects.existingProjects?.length > 0;
  const hasAdditionalProjects = Object.keys(projects.groupedAdditionalProjects || {}).length > 0;

  const tabItems = [];
  if (hasExistingProjects) {
    tabItems.push({ key: "existing", label: "Existing Projects" });
  }
  if (hasAdditionalProjects) {
    Object.keys(projects.groupedAdditionalProjects).forEach((team) => {
      tabItems.push({ key: team, label: team });
    });
  }

  return (
    <>
      <style type="text/css">
        {`
          .truncated-text {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .nav-tabs .nav-link.active {
            background-color: #4fc9da !important;
            color: #fff !important;
            font-weight: 700 !important;
            border: none !important;
          }
          .nav-tabs .nav-link {
            font-weight: 600;
          }
          .selected-card {
            border: 2px solid #0098ca !important;
            background-color: #e6f7fc !important;
            box-shadow: 0 0 10px rgba(0,152,202,0.3);
            position: relative;
          }
          .selected-card::after {
            content: "✔";
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background-color: #0098ca;
            color: #fff;
            font-weight: bold;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
          }
          .tab-content {
            border: 1px solid #ddd;
            border-top: none;
          }
        `}
      </style>

      <Modal
        show={show}
        onHide={onHide}
        centered
        size="xl"
        backdrop="static"
        aria-labelledby="staticBackdropLabel"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#4fc9da",
            color: "white",
            padding: "0.75rem 1rem",
          }}
        >
          <Modal.Title
            className="w-100 text-center text-black"
            style={{ fontSize: "1.1rem", fontWeight: "bold" }}
          >
            <h5 className="modal-title text-center w-100 font-weight-bold text-black">
              Choose Your Project
            </h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: "0" }}>
          {loading && (
            <div className="d-flex justify-content-center align-items-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {!loading && (
            <>
              <div style={{ margin: "1rem 1rem 0" }}>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  {tabItems.map((tab) => (
                    <li className="nav-item" role="presentation" key={tab.key}>
                      <button
                        className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                        id={`${tab.key}-tab`}
                        data-bs-toggle="tab"
                        data-bs-target={`#${tab.key}`}
                        type="button"
                        role="tab"
                        aria-controls={tab.key}
                        aria-selected={activeTab === tab.key ? "true" : "false"}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="tab-content" id="myTabContent">
                {hasExistingProjects && (
                  <div
                    className={`tab-pane fade ${activeTab === "existing" ? "show active" : ""}`}
                    id="existing"
                    role="tabpanel"
                    aria-labelledby="existing-tab"
                  >
                    <Container
                      fluid
                      style={{ maxHeight: "calc(80vh - 150px)", overflowY: "auto", padding: "0.75rem" }}
                    >
                      <Row xs={1} sm={2} md={3} lg={4} className="g-2 align-items-stretch">
                        {projects.existingProjects.map((project) => {
                          // Hide project if in hiddenProjects
                          if (hiddenProjects.includes(project.project_name)) {
                            return null;
                          }
                          const isSelected =
                            selectedProject?.projectId === project.project_id;
                          // TODO: DO NOT DELETE THIS COMMENT!
                          // const hasDescription = Boolean(
                          //   project.project_description &&
                          //     project.project_description.trim() !== ""
                          // );
                          const hasDescription = false;
                          const cardStyle = {
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: hasDescription ? "flex-start" : "center",
                            textAlign: hasDescription ? "left" : "center",
                            backgroundImage: hasDescription
                              ? "none"
                              : "url('/path/to/your/image.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          };
                          return (
                            <Col key={project.project_id}>
                              <Card
                                className={isSelected ? "selected-card" : ""}
                                style={cardStyle}
                                onClick={() =>
                                  handleProjectSelect(
                                    project.project_id,
                                    project.project_name
                                  )
                                }
                              >
                                <Card.Body
                                  className="d-flex flex-column p-2"
                                  style={{
                                    border: "0px solid #4fc9da",
                                    flex: "1 1 auto",
                                    borderRadius: "6px",
                                  }}
                                >
                                  {/* Use local icon instead of any API project_svg */}
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      marginBottom: "0.5rem",
                                    }}
                                  >
                                    {getProjectIcon(project.project_name) && (
                                      <img
                                        src={getProjectIcon(project.project_name)}
                                        alt={project.project_name}
                                        style={{ maxHeight: "80px" }}
                                      />
                                    )}
                                  </div>

                                  <Card.Title
                                    style={{
                                      fontWeight: "700",
                                      fontSize: hasDescription ? "1rem" : "1.2rem",
                                      marginBottom: hasDescription ? "0.5rem" : "0",
                                    }}
                                  >
                                    {project.project_name}
                                  </Card.Title>

                                  {hasDescription && (
                                    <Card.Text
                                      className="flex-grow-1 "
                                      style={{ marginBottom: "0.5rem" }}
                                    >
                                      {project.project_description}
                                    </Card.Text>
                                  )}

                                  {/* Show Ratechart button ONLY if API provides it, like before */}
                                  {project.project_rate_chart?.p_rates && (
                                    <Button
                                      variant="outline-primary border"
                                      size="sm"
                                      className="mt-auto"
                                      style={{
                                        fontWeight: "600",
                                        borderRadius: "20px",
                                        fontSize: "0.8rem",
                                        background: "#4fc9da",
                                        color: "#fff",
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowRateChart(
                                          project.project_rate_chart.p_rates
                                        );
                                      }}
                                    >
                                      View Ratechart
                                    </Button>
                                  )}
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </Container>
                  </div>
                )}

                {hasAdditionalProjects &&
                  Object.entries(projects.groupedAdditionalProjects).map(
                    ([team, teamProjects]) => (
                      <div
                        className={`tab-pane fade ${
                          activeTab === team ? "show active" : ""
                        }`}
                        id={team}
                        role="tabpanel"
                        aria-labelledby={`${team}-tab`}
                        key={team}
                      >
                        <Container
                          fluid
                          style={{
                            maxHeight: "calc(80vh - 150px)",
                            overflowY: "auto",
                            padding: "0.75rem",
                          }}
                        >
                          <Row xs={1} sm={2} md={3} lg={4} className="g-2 align-items-stretch">
                            {teamProjects.map((project) => {
                              // Hide project if in hiddenProjects
                              if (hiddenProjects.includes(project.project_name)) {
                                return null;
                              }
                              const isSelected =
                                selectedProject?.projectId === project.project_id;
                              const hasDescription = Boolean(
                                project.project_description &&
                                  project.project_description.trim() !== ""
                              );
                              const cardStyle = {
                                border: "0px solid #ddd",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: hasDescription
                                  ? "flex-start"
                                  : "center",
                                textAlign: hasDescription ? "left" : "center",
                                backgroundImage: hasDescription
                                  ? "none"
                                  : "url('/path/to/your/image.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              };
                              return (
                                <Col key={project.project_id}>
                                  <Card
                                    className={isSelected ? "selected-card" : ""}
                                    style={cardStyle}
                                    onClick={() =>
                                      handleProjectSelect(
                                        project.project_id,
                                        project.project_name
                                      )
                                    }
                                  >
                                    <Card.Body
                                      className="d-flex flex-column p-2"
                                      style={{
                                        border: "1px solid #4fc9da",
                                        flex: "1 1 auto",
                                        borderRadius: "6px",
                                      }}
                                    >
                                      {/* Use local icon instead of any API project_svg */}
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          marginBottom: "0.5rem",
                                        }}
                                      >
                                        {getProjectIcon(project.project_name) && (
                                          <img
                                            src={getProjectIcon(project.project_name)}
                                            alt={project.project_name}
                                            style={{ maxHeight: "80px" }}
                                          />
                                        )}
                                      </div>

                                      <Card.Title
                                        style={{
                                          fontWeight: "700",
                                          fontSize: hasDescription
                                            ? "1rem"
                                            : "1.2rem",
                                          marginBottom: hasDescription
                                            ? "0.5rem"
                                            : "0",
                                        }}
                                      >
                                        {project.project_name}
                                      </Card.Title>

                                      {hasDescription && (
                                        <Card.Text
                                          className="flex-grow-1 truncated-text"
                                          style={{ marginBottom: "0.5rem" }}
                                        >
                                          {project.project_description}
                                        </Card.Text>
                                      )}

                                      {/* Show Ratechart button ONLY if API provides it, like before */}
                                      {project.project_rate_chart?.p_rates && (
                                        <Button
                                          variant="outline-primary border"
                                          size="sm"
                                          className="mt-auto"
                                          style={{
                                            fontWeight: "600",
                                            borderRadius: "20px",
                                            fontSize: "0.8rem",
                                            background: "#4fc9da",
                                            color: "#fff",
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowRateChart(
                                              project.project_rate_chart.p_rates
                                            );
                                          }}
                                        >
                                          View Ratechart
                                        </Button>
                                      )}
                                    </Card.Body>
                                  </Card>
                                </Col>
                              );
                            })}
                          </Row>
                        </Container>
                      </div>
                    )
                  )}
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer style={{ backgroundColor: "#f1f3f5", padding: "0.5rem 1rem" }}>
          <Button
            variant="outline-primary"
            type="button"
            className="btn btn-secondary fs-6 btn-sm text-black"
            onClick={onHide}
            style={{
              fontSize: "0.85rem",
              borderRadius: "15px",
              marginLeft: "0.5rem",
           
              border: "1px solid #5e6278",
            }}
            // style={{ border: "1px solid #5e6278" }}
          >
            Close
          </Button>
          <Button
            type="button"
            className="btn btn-sm fs-6 text-black"
            onClick={dataPassModal}
            disabled={!selectedProject}
            style={{
              fontSize: "0.85rem",
              borderRadius: "15px",
              marginLeft: "0.5rem",
              background: selectedProject
                ? "linear-gradient(135deg, #4fc9da, #4fc9da)"
                : "linear-gradient(135deg, #4fc9da,#4fc9da)",
              border: "1px solid #4fc9da",
            }}
          >
            <b> Next</b>
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRateModal} onHide={handleCloseRateChart} centered  size="lg"
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Rate Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive mx-auto pt-3" style={{ display: "flex", justifyContent: "center",width:"100%",  overflow:"auto", overflowX: "auto", }}>
            {rateChart && <div dangerouslySetInnerHTML={{ __html: rateChart }} />}
            {!rateChart && <div>No Rate Chart Available.</div>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn-sm" onClick={handleCloseRateChart}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Old code snippet for the rate modal kept intact (commented, not removed)
      <Modal show={showRateModal} onHide={handleCloseRateChart} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Rate Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mx-auto text-center p-4 w-100">
            {rateChart && (
              <div
                className="table-responsive mx-auto p-auto p-3 text-center"
                dangerouslySetInnerHTML={{
                  __html: rateChart.replace(
                    '<table>',
                    '<table class="table table-bordered table-striped text-center ">'
                  ),
                }}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn-sm" onClick={handleCloseRateChart}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      */}
    </>
  );
};
