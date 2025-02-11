import React, { useEffect, useState, useMemo } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import CaseCalender from "./../dashboardPages/Master/CaseCalender";
import { CloseButton, Spinner } from "react-bootstrap";
import RoleBasedElement from "../components/rolebaseaccess/RoleBasedElement";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../assets/css/viewDashboard.css";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Utilized } from "../components/popupmodal/Utilized";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { OtherProject } from "../components/popupmodal/OtherProject";
import { Allocate } from "../components/popupmodal/Allocate";
import autopayimage from "../assets/media/widgets/autopay.png";
import "../assets/css/viewDashboard.css"


import ActivistInjured from "../assets/Images/Activist.jpg";
import DakotaCounty from "../assets/Images/D1.jpg";
import MistrialDeclared from "../assets/Images/mistrial.jpg";
import GoogleReview from "../assets/Images/GoogleReview.jpg";
import MedicalReview from "../assets/Images/Medicalreviewreferalbanner.jpg";
import ReferBanner from "../assets/Images/ReferBanner.jpg";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

export const ViewDashboard = () => {
  const navigate = useNavigate();
  const {
    getCaseCount,
    getAutopayDetails,
    getProjectOverview,
    getBankBalanceDashboard,
    getActionNeeded,
    deleteNotification,
    getUtilizedBalance,
    getAllocatedBalance,
    getEstimatedBilling,
    handleDownloadFile
  } = useAuth();
  const [projectData, setProjectData] = useState([]);
  const { getProject, setgetProject } = useState([]);
  const [caseData, setCaseData] = useState([]);
  const [clientId, setClientId] = useState(null);
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const [autopay, setAutoPay] = useState(null);
  const [autopayStatus, setAutopayStatus] = useState(0);
  const [projectStatus, setProjectStatus] = useState(0);
  const [isotherProjects, setOtherProjects] = useState();
  const [balance, setBalance] = useState({});

  const [isutilized, setutilized] = useState({});
  const [isallocated, setallocated] = useState({});
  const [isestimated, setestimated] = useState({});

  const [actionNeeded, setActionNeeded] = useState([]);

  const [isCaseDataLoading, setIsCaseDataLoading] = useState(true);
  const [isProjectDataLoading, setIsProjectDataLoading] = useState(true);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [isActionNeededLoading, setIsActionNeededLoading] = useState(true);
  const [loading, setLoading] = useState(true);



  const FILE_BASE_URL = API_URL;

  const data = [
    {
      id: 1,
      urlImage: MistrialDeclared, // Imported image
      link: "https://www.neuralit.com/personal-injury-news/mistrial-declared-latest-roundup-weed-killer-lawsuit", // Link to the corresponding article or page
      title: "Mistrial Declared in Latest Roundup Weed Killer Lawsuit",
    },
    {
      id: 2,
      urlImage: DakotaCounty, // Imported image
      link: "https://www.neuralit.com/personal-injury-news/dakota-county-settles-wrongful-death-case-225-million", // Link to the corresponding article or page
      title: "Dakota County Settles Wrongful Death Case for $2.25 Million",
    },
    {
      id: 3,
      urlImage: ActivistInjured, // Imported image
      link: "https://www.neuralit.com/personal-injury-news/activist-injured-rubber-bullet-wins-2m-settlement", // Link to the corresponding article or page
      title: "Activist Injured by Rubber Bullet Wins $2m Settlement",
    },
    {
      id: 4,
      urlImage: GoogleReview, // Imported image
      link: "https://g.page/r/CYXjE5PvMyx2EAE/review",
      title: "Google Review",
    },
    {
      id: 5,
      urlImage: MedicalReview, // Imported image
      // link: "#",
      title: "Medical Review",
    },
    {
      id: 6,
      urlImage: ReferBanner, // Imported image
      // link: "#",
      title: "Medical Review",
    },

  ];
  const [notificationsVisible, setNotificationsVisible] = useState(true);

  const handleActionNeedClose = async (index, notificationId) => {
    try {
      // Call the delete notification API
      await deleteNotification(notificationId);

      // Update the local state to hide the specific alert
      const updatedActionNeeded = [...actionNeeded];
      updatedActionNeeded[index].show = false; // Hide the notification
      setActionNeeded(updatedActionNeeded);
    } catch (error) {
      console.error("Failed to delete notification:", error);
      setError("Failed to delete the notification. Please try again.");
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setIsCaseDataLoading(true);
        setIsProjectDataLoading(true);
        setIsBalanceLoading(true);
        setIsActionNeededLoading(true);


        const clientDataString = sessionStorage.getItem("client_data");
        const token = sessionStorage.getItem("token");
        if (!clientDataString) throw new Error("Client data not found.");

        const clientData = JSON.parse(clientDataString);
        const clientIdFromStorage = clientData.client_id;

        if (!clientIdFromStorage) throw new Error("Client ID is missing.");
        setClientId(clientIdFromStorage);

        // balance
        const balanceAVL = await getBankBalanceDashboard(clientIdFromStorage);
        // console.log("Current Balance", balanceAVL);
        setBalance(balanceAVL.data || "NA");
        setIsBalanceLoading(false);
        // Fetch case count
        const caseCountResponse = await getCaseCount(clientIdFromStorage);
        setCaseData(caseCountResponse);
        setIsCaseDataLoading(false);

        // Fetch autopay details
        const autopayResponse = await getAutopayDetails(clientIdFromStorage);
        setAutopayStatus(autopayResponse.status);
        setAutoPay(autopayResponse.data);

        // After fetching the data:
        const projectResponse = await getProjectOverview(clientIdFromStorage);
        const rawData = projectResponse.data?.data ?? {};

        let projectDataArray = Object.entries(rawData).map(
          ([name, { percentage, project_id }]) => ({
            name,
            // value: percentage,
            value: Math.round(percentage),
            project_id,
          })
        );

        // Sort, group "Other Projects" if needed:
        projectDataArray = projectDataArray.sort((a, b) => b.value - a.value);
        let otherProjects = [];
        if (projectDataArray.length > 5) {
          const topFour = projectDataArray.slice(0, 4);
          otherProjects = projectDataArray.slice(4);
          const othersValue = projectDataArray
            .slice(4)
            .reduce((sum, item) => sum + item.value, 0);
          projectDataArray = [
            ...topFour,
            {
              name: "Other Projects",
              // value: othersValue,
              value: Math.floor(othersValue),
              details: otherProjects,
            },
          ];
        }
        setOtherProjects(otherProjects);
        setProjectData(projectDataArray);
        setProjectStatus(projectResponse.status);
        setIsProjectDataLoading(false);

        const actionData = await getActionNeeded();
        setActionNeeded(actionData);
        setIsActionNeededLoading(false);
        const utilized = await getUtilizedBalance(clientIdFromStorage);
        const allocated = await getAllocatedBalance(clientIdFromStorage);
        const estimated = await getEstimatedBilling(clientIdFromStorage);
        setutilized(utilized || "NA");
        setallocated(allocated || "NA");
        setestimated(estimated || "NA");
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error.message);

        setIsCaseDataLoading(false);
        setIsProjectDataLoading(false);
        setIsBalanceLoading(false);
        setIsActionNeededLoading(false);
      }finally {
        setLoading(false); 
      }

    };

    fetchDashboardData();
  }, [
    getCaseCount,
    getAutopayDetails,
    getProjectOverview,
    getActionNeeded,
    getUtilizedBalance,
    getAllocatedBalance,
    getEstimatedBilling,
  ]);

  const processedCaseData = useMemo(() => {
    const validCaseData = Array.isArray(caseData) ? caseData : [];
    const totalCases = validCaseData.reduce((acc, curr) => acc + curr.case_count, 0);
  
    const statusData = validCaseData.map((item) => ({
      label: `${item.case_count} ${item.case_status}`,
      percentage:
        totalCases > 0
          ? `${Math.round((item.case_count / totalCases) * 100)}%`
          : "0%",
      color:
        item.case_status === "Delivered"
          ? "#28a745" // Green
          : item.case_status === "On-Hold"
          ? "#dc3545" // Red
          : item.case_status === "WIP"
          ? "#ffc107" // Yellow
          : item.case_status === "Awaiting Fund"
          ? "#001845"
          : item.case_status === "Awaiting Info"
          ? "#0353a4"
          : "#ffc107", // Default color (Gray)
    }));
  
    // console.log("Processed Case Data:", statusData); 
    return { totalCases, statusData };
  }, [caseData]);

  // Function to handle navigation based on the case status
  const handleStatusClick = (caseStatus) => {

    const match = caseStatus.match(/[a-zA-Z\s-]+$/); // Match only the text portion
    const normalizedStatus = match ? match[0].trim().toLowerCase() : "";

    console.log("Normalized status:", normalizedStatus); // Debugging output

    if (normalizedStatus === "delivered") {
      navigate("/mycase?tab=1");
    } else if (normalizedStatus === "wip") {
      navigate("/mycase?tab=2");
    } else if (normalizedStatus === "on-hold") {
      navigate("/mycase?tab=3");
    } else if (normalizedStatus === "awaiting funds") {
      navigate("/mycase?tab=4");
    } else if (normalizedStatus === "awaiting info") {
      navigate("/mycase?tab=5");
    } else {
      console.log("No matching case status found!");
    }
  };

  const [modalVisible, setModalVisible] = useState(false); 
  const [modalContent, setModalContent] = useState("");
  // Available fund
  const handleBalanceClick = (title) => {
    if (title === "Utilized Balance") {
      setModalContent(title);
      setModalVisible(true); // Show the modal only when title matches
    } else if (title === "Allocated Balance") {
      setModalContent(title);
      setModalVisible(true); // Show the modal only when title matches
    } else {
      setModalVisible(false); // Hide the modal for other cases
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
    setModalContent(""); // Reset the modal content
  };

  const COLORS = [
    "#6B5B95", // Muted Purple
    "#4CAF50", // Green
    "#FF9800", // Orange
    "#2196F3", // Blue
    "#F44336", // Red
    "#9C27B0", // Purple
    "#FFC107", // Amber
    "#00BCD4", // Cyan
  ];

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥",
    // Add more currencies as needed
  };
  const currencySymbol = currencySymbols[balance.currency] || "";

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  const handleProjectClick = (projectName) => {
    if (projectName) {
      navigate(`/myprojects/${projectName}`);
    } else {
      setShowModal(true);
    }
  };

  const handleActionNeed = (action_type, action_details) => {
    console.log(action_type);
    if (action_type === "low_funds_action") {
      navigate("/managefunds");
    } else if (action_type === "estimate_approval_action") {
      navigate("/approvalestimate");
    } else if (action_type === "case_status_action") {
      if (action_details) {
        const details = JSON.parse(action_details);
        // console.log(details);
        if (details.action_details?.additional_data?.status) {
          const navigatorlink = details.action_details.additional_data;
          // console.log("Status:", navigatorlink);
          if (navigatorlink.status === 13) {
            navigate(`/allclients/client/${navigatorlink.client_id}/case/${navigatorlink.case_id}`);
          }
          if (navigatorlink.status === 62) {
            navigate("/managefunds");
          }

        } else {
          console.log("Status not found in action details!");
        }
      }
    } else {
      console.log("No matching case status found!");
    }
  };

  return (
    <>
      <div className="container-fluid">
        <RoleBasedElement allowedRoles={["Administrator"]}>
          <h1>This is the Admin dashboard</h1>
        </RoleBasedElement>

        <RoleBasedElement allowedRoles={["Client Admin","Client Case Manager","Client Finance Manager","Client Accountant"]}>
          <div className="row" style={{ background: "f9fcfe" }}>
            {/* Total Cases Card */}
            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 ">
              {/* Open Cases Card */}
              <div
                className="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-center border-0 mb-3 mb-xl-2 total-cases"
                style={{
                  backgroundColor: "#003F73",
                  minHeight: "335px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {isCaseDataLoading ? (
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{
                      height: "100%",
                      minHeight: "335px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Spinner animation="border" variant="light" />
                    <span
                      style={{
                        marginTop: "10px",
                        color: "#ffffff",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Loading...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="card-header pt-5">
                      <div className="card-title d-flex flex-column">
                        <span
                          className="fw-bold text-white me-2 lh-1 ls-n2"
                          style={{ fontSize: "22px" }}
                        >
                          {processedCaseData.totalCases || 0}
                        </span>

                        <span className="text-white opacity-75 pt-1 fw-medium fs-6">
                          Total Cases
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "500",
                          color: "#ffffff",
                        }}
                      >
                        <b>{currentMonth}</b>
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="card-body" style={{ minHeight: "50px" }}>
                      {processedCaseData.statusData.length > 0 ? (
                        processedCaseData.statusData.map((status, idx) => (
                          <div
                            key={idx}
                            className="mb-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleStatusClick(status.label)}
                          >
                            <div className="d-flex justify-content-between align-items-center text-white">
                              <span className="fw-medium">{status.label}</span>
                              <span className="fw-bold">{status.percentage}</span>
                            </div>
                            <div
                              className="progress"
                              style={{
                                height: "8px",
                                backgroundColor: "#e9ecef",
                                borderRadius: "5px",
                              }}
                            >
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: status.percentage,
                                  backgroundColor: status.color,
                                }}
                                aria-valuenow={parseInt(status.percentage)}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#fff",
                            fontSize: "1rem",
                            marginTop: "20px",
                          }}
                        >
                          <p>No case data available for {currentMonth}.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Active Team Card */}
              <div
                className="card card-flush h-md-50 mb-3 mb-xl-2 project-overview"
                style={{
                  maxHeight: "335px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {isCaseDataLoading ? (
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{
                      height: "100%",
                      minHeight: "335px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Spinner animation="border" variant="dark" />
                    <span
                      style={{
                        marginTop: "10px",
                        color: "#000000",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Loading...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-center card-header pt-0">
                      <div className="card-title d-flex flex-column">
                        <span
                          className="fw-bold text-gray-900 me-2 lh-1 ls-n2 "
                          style={{ fontSize: "22px" }}
                        >
                          Projects Overview
                        </span>
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column justify-content-end pt-0 mt-0" style={{padding:"10px"}}>
                      {projectData && projectData.length > 0 ? (

                        <ResponsiveContainer
                          width="100%"
                          height={180}
                          style={{ fontSize: "11px" }}
                        >
                          <PieChart>
                            <Pie
                              data={projectData.filter(entry => entry.value > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius="40%"
                              outerRadius="70%"
                              dataKey="value"
                              label={({ percent }) => `${Math.round(percent * 100)}%`}
                              labelLine={false}
                              style={{ fontSize: "12px", cursor: "pointer" }}
                              paddingAngle={1} // Adds space between slices
                              minAngle={3} // Ensures a minimum angle for small slices
                            >
                              {projectData
                                .filter(entry => entry.value > 0)
                                .map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    onClick={() => handleProjectClick(entry.project_id)}
                                    style={{ cursor: "pointer" }}
                                  />
                                ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name) => {
                                const total = projectData
                                  .filter(entry => entry.value > 0)
                                  .reduce((sum, entry) => sum + entry.value, 0);
                                const percentage = ((value / total) * 100).toFixed(1); // Calculate percentage
                                return [`${Math.round(percentage)}%`, name]; // Correct syntax: Enclose percentage in backticks
                              }}
                            />

                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#6c757d",
                            fontSize: "1rem",
                          }}
                        >
                          No Projects Available
                        </div>
                      )}

                      {projectData && projectData.length > 0 && (
                       
                        <div
                          className="legend-container"
                          style={{
                            display: "grid", // Use grid for two columns
                            gridTemplateColumns: "1fr 1fr", // Two equal-width columns
                            maxHeight: "120px", 
                            overflowY: "auto", 
                          }}
                        >
                          {projectData.filter(entry => entry.value > 0).map((entry, index) => (
                            <div
                              key={`legend-${index}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.85rem", // Adjust font size to fit card
                                cursor: "pointer",
                              }}
                              onClick={() => handleProjectClick(entry.project_id)}
                            >
                              <div
                                style={{
                                  width: "10px", // Slightly smaller circle for compact design
                                  height: "10px",
                                  backgroundColor: COLORS[index % COLORS.length],
                                  borderRadius: "50%",
                                  marginRight: "6px",
                                }}
                              ></div>
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: "120px", // Ensure names don’t break layout
                                }}
                                title={entry.name} // Show full name on hover
                              >
                                {entry.name}
                              </span>
                            </div>
                          ))}
                        </div>

                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-5">
              {/* Card Fund */}
              <div
                className="card card-flush h-md-50 mb-3 mb-xl-2 available-balance"
                // className="card card-flush mb-3 mb-xl-2 available-balance"
                style={{
                  borderRadius: "15px",
                  minHeight: "335px",
                }}
              >

                {isCaseDataLoading ? (
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{
                      height: "100%",
                      minHeight: "335px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Spinner animation="border" variant="dark" />
                    <span
                      style={{
                        marginTop: "10px",
                        color: "#000000",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Loading...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="card-title d-flex flex-column p-6">
                      <div className="d-flex align-items-center">
                        <span
                          className=" fw-bold text-gray-900 me-2 lh-1 ls-n2"
                          style={{ fontSize: "22px" }}
                        >
                          {currencySymbol}
                          {Number(balance.balance).toLocaleString("en-US")}
                        </span>
                      </div>
                      {/* Subtitle */}
                      <span className="text-gray-500 pt-1 fw-semibold fs-6">
                        Available balance in {currentMonth}
                      </span>
                    </div>
                    <div className="card-body d-flex flex-column align-items-center p-5">
                      <div className="d-flex align-items-center"></div>
                      <div className="w-100 px-3">
                        <div className="d-flex align-items-center justify-content-between py-2">
                          <div className="d-flex align-items-center">
                            <div className="bullet w-8px h-3px rounded-2 bg-primary me-2"></div>
                            <span
                              className="text-gray-800 fw-semibold cursor-pointer"
                              onClick={() =>
                                handleBalanceClick("Allocated Balance")
                              }
                            >
                              Allocated Amount
                            </span>
                          </div>
                          <span className="fw-bold text-gray-700">
                            {currencySymbol}
                            {/* {isallocated.amount} */}
                            {Number(isallocated?.amount).toLocaleString("en-US")}
                          </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between py-2">
                          <div className="d-flex align-items-center">
                            <div
                              className="bullet w-8px h-3px rounded-2 me-2"
                              style={{ backgroundColor: "#767986" }}
                            ></div>
                            <span className="text-gray-800 fw-semibold">
                              Estimated Billing
                            </span>
                          </div>
                          <span className="fw-bold text-gray-700">
                            {currencySymbol}
                            {isestimated?.amount}
                          </span>
                        </div>
                        {/* Modal for displaying content */}
                        {modalVisible && (
                          <div
                            centered
                            backdrop="static"
                            aria-labelledby="staticBackdropLabel"
                          >
                            <div
                              className="modal-backdrop show"
                              style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 1040,
                              }}
                            ></div>
                            <div
                              className="modal show"
                              style={{ display: "block", zIndex: 1050 }}
                              onClick={closeModal}
                            >
                              <div
                                className="modal-dialog modal-xl modal-dialog-centered"
                                onClick={(e) => e.stopPropagation()} // Prevents event from propagating to the parent
                              >
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title">{modalContent}</h5>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      aria-label="Close"
                                      aria-hidden="true"
                                      onClick={closeModal}
                                    ></button>
                                  </div>

                                  {/* Content Section */}
                                  <div className="modal-body">
                                    {/* Scrollable Table Wrapper */}
                                    <div
                                      style={{
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                      }}
                                    >
                                      {modalContent === "Utilized Balance" && (
                                        <Utilized />
                                      )}
                                      {modalContent === "Allocated Balance" && (
                                        <Allocate />
                                      )}
                                    </div>
                                  </div>

                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      className="btn btn-secondary"
                                      onClick={closeModal}
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="d-flex justify-content-center align-items-center p-5 w-100">
                          <div className="row w-100">
                            {/* Button 1 */}
                            <div className="col-12 mb-2">
                              <button
                                className="btn btn-sm w-100 p-1 text-black"
                                style={{
                                  borderRadius: "12px",
                                  fontWeight: "500",
                                  background: "#4fc9da",
                                  color: "#ffffff",
                                  fontSize: "11px",
                                  padding: "6px 12px",
                                }}
                                onClick={() =>
                                  handleDownloadFile(
                                    "/neuralit/web/apps/openatrium-6.x-1.7/sites/default/files/RATE_CHART.pdf", null,"download_rate_chart"
                                  )
                                }
                              >
                                <b>Rate Chart</b>
                              </button>
                            </div>
                            {/* Button 2 */}
                            <div className="col-12">
                              <button
                                className="btn btn-sm w-100 p-1"
                                style={{
                                  borderRadius: "12px",
                                  fontWeight: "500",
                                  background: "#4fc9da",
                                  color: "#ffffff",
                                  fontSize: "11px",
                                  padding: "6px 12px",
                                }}
                              >
                                <a
                                  href="https://costestimator.neuralit.com/"
                                  target="_blank"
                                  className="text-black  w-50 border-2"
                                  style={{ borderRadius: "8px" }}
                                >
                                  <b> Cost Estimator</b>
                                </a>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Card Auto Pay */}
              <div
                className="card card-flush h-md-50 mb-3 mb-xl-2 auto-swipe-active"
                style={{
                  maxHeight: "335px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isCaseDataLoading ? (
                  <div
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{
                      height: "100%",
                      minHeight: "335px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Spinner animation="border" variant="dark" />
                    <span
                      style={{
                        marginTop: "10px",
                        color: "#000000",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Loading...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-center card-header pt-0">
                      <div className="card-title d-flex flex-column">
                        <span
                          className="fw-bold text-gray-900 me-2 lh-1 ls-n2 "
                          style={{ fontSize: "22px" }}
                        >
                          {autopayStatus === 1
                            ? "Auto Swipe: Active"
                            : "Auto Swipe: Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column justify-content-center align-items-center pt-0">
                      <div className="p-0">
                        <img
                          src={autopayimage}
                          style={{ width: "120px" }}
                          alt="Auto Pay Illustration"
                        />
                      </div>

                      <div className="d-flex flex-column align-items-center ">
                        {/* Minimum Balance */}
                        <div className="d-flex align-items-center">
                          <h3
                            className="badge"
                            style={{
                              color: "#212121",
                              fontWeight: "600",
                              fontSize: "0.9rem",
                              borderRadius: "8px",
                            }}
                          >
                            Minimum Balance:
                          </h3>
                          <p className="fw-bold fs-5" style={{ color: "#003F73" }}>
                            {autopay?.Symbol || "$"} {/* Fallback symbol */}
                            {autopay?.Minimum_Balance_Required !== undefined ? autopay.Minimum_Balance_Required : "0"} {/* Ensure fallback */}
                          </p>
                        </div>

                        {/* Auto Swipe Amount */}
                        <div className="d-flex align-items-center">
                          <h3
                            className="badge pt-0"
                            style={{
                              color: "#212121",
                              fontWeight: "600",
                              fontSize: "0.9rem",
                              borderRadius: "8px",
                            }}
                          >
                            Auto Swipe Amount:
                          </h3>
                          <p className="fw-bold fs-5" style={{ color: "#003F73" }}>
                            {autopay?.Symbol || "$"} {/* Fallback symbol */}
                            {autopay?.Threshold !== undefined
                              ? autopay.Threshold
                              : "0"} {/* Ensure fallback */}
                          </p>
                        </div>
                      </div>

                      <div className="d-flex justify-content-center align-items-center gap-2 w-100">

                        <button
                          className="btn btn-sm flex-fill"
                          style={{
                            borderRadius: "12px",
                            fontWeight: "500",
                            background: "#4fc9da",
                            color: "#ffffff",
                            fontSize: "11px",
                            padding: "6px 12px",
                          }}
                        >
                          <a
                            href="/financialsettings"
                            className="text-black fw-bold text-decoration-none d-flex align-items-center justify-content-center"
                          >
                            Manage{"\u00A0"}Auto{"\u00A0"}Pay
                          </a>
                        </button>
                        <button
                          className="btn btn-sm flex-fill"
                          style={{
                            borderRadius: "12px",
                            fontWeight: "500",
                            background: "#4fc9da",
                            color: "#ffffff",
                            fontSize: "11px",
                            padding: "6px 12px",

                          }}
                        >
                          <a
                            href="/managefunds"
                            className="text-black fw-bold text-decoration-none d-flex align-items-center justify-content-center"
                          >
                            Add Funds
                          </a>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="col-12 col-md-12 col-lg-6">
  {/* Action Needed */}
<div
  className="card card-flush h-md-50 mb-3 mb-xl-2 auto-swipe-active action-needed"
  style={{
    maxHeight: "335px", 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden", 
    borderRadius: "12px", 
  }}
>

{loading ? (
  <div
    className="d-flex flex-column justify-content-center align-items-center"
    style={{
      height: "100%",
      minHeight: "335px",
      width: "100%",
      textAlign: "center",
    }}
  >
    <Spinner animation="border" variant="dark" />
    <span
      style={{
        marginTop: "10px",
        color: "#000000",
        fontSize: "1rem",
        fontWeight: "bold",
      }}
    >
      Loading...
    </span>
  </div>
) : actionNeeded.some((alert) => alert.show !== false) ? (
  <>
    <div className="d-flex justify-content-center card-header">
      <div className="card-title d-flex flex-column">
        <span
          className="fw-bold text-gray-900 me-2 lh-1 ls-n2"
          style={{ fontSize: "22px" }}
        >
          Action Needed
        </span>
      </div>
    </div>

    <div
      className="alerts-container w-100 pt-0"
      style={{
        maxHeight: "335px",
        overflowY: "auto", 
      }}
    >
      {actionNeeded.map(
        (alert, idx) =>
          alert.show !== false && (
            <div
              key={idx}
              className={`alert alert-${alert.type} d-flex justify-content-between align-items-center p-2 m-2`}
              style={{
                borderRadius: "8px",
                marginBottom: "12px",
                background:
                  alert.type === "success"
                    ? "#d4edda"
                    : alert.type === "warning"
                    ? "#fff3cd"
                    : alert.type === "danger"
                    ? "#f8d7da"
                    : "#e2e3e5",
                color:
                  alert.type === "success"
                    ? "#155724"
                    : alert.type === "warning"
                    ? "#856404"
                    : alert.type === "danger"
                    ? "#721c24"
                    : "#383d41",
              }}
            >
              <span style={{ fontSize: "1rem", flex: 1 }}>
                {alert.message}
              </span>
              <a
                style={{
                  fontSize: "1rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  color:
                    alert.type === "success"
                      ? "#155724"
                      : alert.type === "warning"
                      ? "#856404"
                      : alert.type === "danger"
                      ? "#721c24"
                      : "#383d41",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleActionNeed(alert.action_type, alert.action_details, e);
                }}
              >
                Check Here
              </a>
              <CloseButton
                className="ms-2"
                aria-label="Close"
                onClick={() =>
                  handleActionNeedClose(
                    idx,
                    alert.user_notification_id
                  )
                }
              />
            </div>
          )
      )}
    </div>
  </>
) : (
  <Carousel
    indicators
    interval={5000}
    controls
    className="rounded-4 shadow"
    style={{
      borderRadius: "12px",
      overflow: "hidden",
      height: "100%", // Ensures the carousel takes full card height
      width: "100%",
    }}
  >
    {data.map((image, index) => (
      <Carousel.Item key={image.id}>
        <a
          href={image.link}
          title={image.title}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            textDecoration: "none",
          }}
        >
          <img
            className="d-block w-100 h-100"
            src={image.urlImage}
            alt={`Slide ${index + 1}`}
            style={{
              width: "100%", // Takes full width of the carousel container
              height: "100%", // Takes full height of the carousel container
              objectFit: "cover", // Ensures the image covers the entire area
            }}
          />
        </a>
      </Carousel.Item>
    ))}
  </Carousel>
)}

</div>


  {/* Card Highlights */}
  <div
  className="card card-flush mb-3 mb-xl-2 today-highlights"
  style={{
    height: "335px", 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  {loading ? (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        height: "100%",
        minHeight: "335px",
        width: "100%",
        textAlign: "center",
      }}
    >
      <Spinner animation="border" variant="dark" />
      <span
        style={{
          marginTop: "10px",
          color: "#000000",
          fontSize: "1rem",
          fontWeight: "bold",
        }}
      >
        Loading...
      </span>
    </div>
  ) : (
    /** Wrap the content inside a React Fragment or a parent <div> **/
    <>
      <div className="d-flex justify-content-center card-header pt-0">
        <div className="card-title d-flex flex-column">
          <span
            className="fw-bold text-gray-900 me-2 lh-1 ls-n2"
            style={{ fontSize: "22px" }}
          >
            What’s up Today
          </span>
        </div>
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        <CaseCalender />
      </div>
    </>
  )}
</div>


</div>

          </div>
        </RoleBasedElement>
      </div>

      <footer
        className="footer bottom py-3 "
        style={{ left: "14%", background: "transparent" }}
      >
        <div>
          <div className="me-3 pt-0">
            <ul className="nav justify-content-end">
              <li className="menu-item">
                <a
                  href="https://www.neuralit.com/about-us"
                  target="_blank"
                  className="menu-link px-2"
                >
                  About
                </a>
              </li>
              <li className="menu-item">
                <a
                  href="https://www.neuralit.com/terms-of-use"
                  target="_blank"
                  className="menu-link px-2"
                >
                  Terms of Use
                </a>
              </li>
              <li className="menu-item">
                <a
                  href="https://www.neuralit.com/privacy-statement"
                  target="_blank"
                  className="menu-link px-2"
                >
                  Privacy Statement
                </a>
              </li>
            </ul>
          </div>
          <div className="ms-3">
            <p className="mb-0">
              &copy;{new Date().getFullYear()}&nbsp;
              <a href="https://neuralit.com" target="_blank">
                Neural IT
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Popup Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Other Projects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OtherProject isotherProjects={isotherProjects} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
