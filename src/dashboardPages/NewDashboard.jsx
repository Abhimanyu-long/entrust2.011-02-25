import React, { useEffect, useState, useMemo } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import CaseCalender from "./../dashboardPages/Master/CaseCalender";
import { CloseButton } from "react-bootstrap";
import RoleBasedElement from "../components/rolebaseaccess/RoleBasedElement";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../assets/css/viewDashboard.css";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
// import Loader from "../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { Utilized } from "../components/popupmodal/Utilized";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { OtherProject } from "../components/popupmodal/OtherProject";
import { Allocate } from "../components/popupmodal/Allocate";

export const NewDashboard = () => {
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
  const [images] = useState([
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
  ]);
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
        setBalance(balanceAVL.data);

        // Fetch case count
        const caseCountResponse = await getCaseCount(clientIdFromStorage);
        setCaseData(caseCountResponse);
        // setCaseData(dataview);   // for testing

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
            value: percentage,
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
              value: othersValue,
              details: otherProjects,
            },
          ];
        }
        setOtherProjects(otherProjects);
        setProjectData(projectDataArray);
        setProjectStatus(projectResponse.status);

        const actionData = await getActionNeeded();
        setActionNeeded(actionData);

        const utilized = await getUtilizedBalance(clientIdFromStorage);
        const allocated = await getAllocatedBalance(clientIdFromStorage);
        const estimated = await getEstimatedBilling(clientIdFromStorage);
        setutilized(utilized.data);
        setallocated(allocated.data);
        setestimated(estimated.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error.message);
      }
    };

    fetchDashboardData();
  }, [getCaseCount, getAutopayDetails, getProjectOverview, getActionNeeded, getUtilizedBalance, getAllocatedBalance, getEstimatedBilling]);


  const processedCaseData = useMemo(() => {
    const validCaseData = Array.isArray(caseData) ? caseData : [];
    const totalCases = validCaseData.reduce(
      (acc, curr) => acc + curr.case_count,
      0
    );

    const statusData = validCaseData.map((item) => ({
      label: `${item.case_count} ${item.case_status}`,
      percentage:
        totalCases > 0
          ? `${((item.case_count / totalCases) * 100).toFixed(2)}%`
          : "0%",
      color:
        item.case_status === "Delivered"
          ? "#28a745" // Green
          : item.case_status === "On-Hold"
            ? "#dc3545" // Red
            : item.case_status === "WIP"
              ? "#ffc107" // Yellow
              : item.case_status === "Awaiting Fund"
                ? "#001845" // ssghsa
                : item.case_status === "Awaiting Info"
                  ? "#0353a4" // fdfgfh
                  : "#ffc107", // Default color (Gray)
    }));
    return { totalCases, statusData };
  }, [caseData]);

  // Function to handle navigation based on the case status
  const handleStatusClick = (caseStatus) => {
    console.log("Clicked status:", caseStatus); // Debugging output

    // Normalize caseStatus by removing leading numbers and trimming whitespace
    const match = caseStatus.match(/[a-zA-Z\s-]+$/); // Match only the text portion
    const normalizedStatus = match ? match[0].trim().toLowerCase() : "";

    console.log("Normalized status:", normalizedStatus); // Debugging output

    if (normalizedStatus === "delivered") {
      navigate("/mycase?tab=1");
    } else if (normalizedStatus === "wip") {
      navigate("/mycase?tab=2");
    } else if (normalizedStatus === "on-hold") {
      navigate("/mycase?tab=3");
    } else if (normalizedStatus === "awaiting fund") {
      navigate("/mycase?tab=4");
    } else if (normalizedStatus === "awaiting info") {
      navigate("/mycase?tab=5");
    } else {
      console.log("No matching case status found!");
    }
  };

  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
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
    // "#FF6F61", // Coral Red
    "#6B5B95", // Muted Purple
    "#88B04B", // Olive Green
    "#F7CAC9", // Soft Pink
    "#92A8D1", // Light Blue
    "#F4E04D", // Bright Yellow
    "#FFFFFF", // Pure White
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

  const handleActionNeed = (action_type) => {
    console.log(action_type);
    if (action_type === "low_funds_action") {
      navigate("/managefunds");
    } else if (action_type === "estimate_approval_action") {
      navigate("/approvalestimate");
    } else {
      console.log("No matching case status found!");
    }
  };


  return (
    <>
      <div className="container-fluid">
        <RoleBasedElement allowedRoles={["administrator"]}>
          <h1>This is the Admin dashboard</h1>
        </RoleBasedElement>

        <RoleBasedElement allowedRoles={["Client Admin", "Client Case Manager","Client Finance Manager","Client Accountant"]}>
          <div className="row gy-4">
            {/* Total Cases Card */}
            <div className="col-12 col-sm-6 col-lg-4 total-cases">
              <div
                className="card shadow-lg h-100"
                style={{
                  borderRadius: "10px",
                  background:
                    "linear-gradient(145deg, #003f73 0%, #66c2ff 100%)",
                  color: "#fff",
                  border: "none",
                }}
              >
                {/* Header */}
                <div
                  className="d-flex justify-content-between align-items-center text-white"
                  style={{
                    borderRadius: "10px 10px 0 0",
                    fontWeight: "bold",
                    background:
                      "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17 72 108) 100%)",
                    padding: "10px 10px",
                    lineHeight: "1.2",
                  }}
                >
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      marginBottom: 0,
                    }}
                  >
                    {processedCaseData.totalCases}{" "}
                    <span style={{ fontSize: "15px" }}>Total Cases</span>
                  </p>
                  <span style={{ fontSize: "20px", fontWeight: "400" }}>
                    <b>{currentMonth}</b>
                  </span>
                </div>

                {/* Body */}
                <div className="card-body">
                  {processedCaseData.statusData.length > 0 ? (
                    processedCaseData.statusData.map((status, idx) => (
                      <div
                        key={idx}
                        className="mb-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleStatusClick(status.label)}
                      >
                        <div className="d-flex justify-content-between">
                          <span>{status.label}</span>
                          <span>{status.percentage}</span>
                        </div>
                        <div
                          className="progress"
                          style={{ height: "8px", backgroundColor: "#e9ecef" }}
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
                      }}
                    >
                      <p>No case data available for {currentMonth}.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Available Balance Card */}
            <div className="col-12 col-sm-6 col-lg-4 available-balance">
              <div
                className="card shadow-lg h-100"
                style={{
                  borderRadius: "10px",
                  background:
                    "linear-gradient(145deg, #003f73 0%, #66c2ff 100%)",
                  color: "#fff",
                  border: "none",
                }}
              >
                <div
                  className=" d-flex justify-content-between align-items-center text-white"
                  style={{
                    borderRadius: "10px 10px 0 0",
                    padding: "10px 10px",
                    fontWeight: "bold",
                    background:
                      "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17 72 108) 100%)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      marginBottom: 0,
                    }}
                  >
                    {currencySymbol}
                    {balance.balance}
                  </p>
                  <span style={{ fontSize: "24px", fontWeight: "500" }}>
                    <b> Available Balance</b>
                  </span>
                </div>
                <div className="card-body">
                  <div
                    className="d-flex justify-content-between align-items-center p-2 mb-2"
                    style={{
                      background: "rgba(0, 0, 0, 0.05)",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleBalanceClick("Utilized Balance")}
                  >
                    {console.log("isutilized", isutilized)}
                    <span>Utilized Balance</span>
                    <span>{currencySymbol}{isutilized.amount}</span>
                  </div>

                  <div
                    className="d-flex justify-content-between align-items-center p-2 mb-2"
                    style={{
                      background: "rgba(0, 0, 0, 0.05)",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleBalanceClick("Allocated Balance")}
                  >
                    <span>Allocated Balance</span>
                    <span>{currencySymbol}{isallocated.amount}</span>
                  </div>

                  <div
                    className="d-flex justify-content-between align-items-center p-2 mb-2"
                    style={{
                      background: "rgba(0, 0, 0, 0.05)",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <span>Estimated Billing</span>
                    <span>{currencySymbol}{isestimated.amount}</span>
                  </div>

                  {/* Modal for displaying content */}
                  {modalVisible && (
                    <div
                      className="modal fade show"
                      style={{ display: "block" }}
                      onClick={closeModal} // Triggers only when clicking outside the modal content
                    >
                      <div
                        className="modal-dialog modal-xl"
                        style={{ margin: "10% auto" }}
                        onClick={(e) => e.stopPropagation()} // Prevents event from propagating to the parent
                      >
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">{modalContent}</h5>
                            <button
                              type="button"
                              className="btn-close"
                              aria-label="Close"
                              onClick={closeModal}
                            ></button>
                          </div>
                          {modalContent === "Utilized Balance" && <Utilized />}
                          {modalContent === "Allocated Balance" && <Allocate />}
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
                  )}

                  <div className="d-flex justify-content-between pt-6">
                    <a
                      href="https://entrust.neuralit.com/sites/default/files/rate_chart/NIT_RATE_CHART_1728068417.pdf"
                      target="_blank"
                      className="btn btn-primary btn-sm me-2 w-50"
                      style={{ borderRadius: "8px", background: "#125bad" }}
                    >
                      <b> NIT Rate Chart</b>
                    </a>
                    <a
                      href="https://costestimator.neuralit.com/"
                      target="_blank"
                      className="btn btn-primary btn-sm w-50 border-2"
                      style={{ borderRadius: "8px", background: "#125bad" }}
                    >
                      <b> Cost Estimator</b>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Needed Card */}

            <div className="col-12 col-sm-6 col-lg-4 action-needed">
              <div
                className="card shadow-lg h-100"
                style={{
                  background:
                    "linear-gradient(145deg, #003f73 0%, #66c2ff 100%)",
                  color: "#fff",
                  borderRadius: "10px",
                  border: "none",
                  overflow: notificationsVisible ? "auto" : "hidden",
                }}
              >
                {notificationsVisible ? (
                  <>
                    {/* Card Header */}
                    <div
                      className="text-white d-flex justify-content-between align-items-center"
                      style={{
                        borderRadius: "10px 10px 0 0",
                        padding: "10px 10px",
                        fontWeight: "bold",
                        background:
                          "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17 72 108) 100%)",
                      }}
                    >
                      <b
                        className="mb-0 text-white"
                        style={{ margin: "0 auto", fontSize: "20px" }}
                      >
                        Action Needed
                      </b>
                    </div>

                    {/* Alerts */}
                    <div
                      className="alerts-container mt-3 px-3"
                      style={{
                        maxHeight: "250px",
                        overflowY: "auto",
                      }}
                    >
                      {actionNeeded.length > 0 ? (
                        actionNeeded.map(
                          (alert, idx) =>
                            alert.show !== false && (
                              <div
                                key={idx}
                                className={`alert alert-${alert.type} d-flex justify-content-between align-items-center p-3`}
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
                                    handleActionNeed(alert.action_type, e);
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
                        )
                      ) : (
                        <div className="image-slider mt-0">
                          <Carousel
                            indicators
                            interval={5000}
                            controls
                            className="rounded-4 shadow"
                            style={{ borderRadius: "12px", overflow: "hidden" }}
                          >
                            {images.map((image, index) => (
                              <Carousel.Item key={index}>
                                <img
                                  className="d-block w-100 p-2"
                                  src={image}
                                  alt={`Slide ${index + 1}`}
                                  style={{
                                    borderRadius: "12px",
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "250px",
                                    maxHeight: "250px",
                                  }}
                                />
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="image-slider mt-3">
                    <Carousel
                      indicators
                      interval={5000}
                      controls
                      className="rounded-4 shadow"
                      style={{ borderRadius: "12px", overflow: "hidden" }}
                    >
                      {images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img
                            className="d-block w-100 p-2"
                            src={image}
                            alt={`Slide ${index + 1}`}
                            style={{
                              borderRadius: "12px",
                              objectFit: "cover",
                              width: "100%",
                              height: "300px",
                              maxHeight: "300px",
                            }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                )}
              </div>
            </div>

            {/* Project Overview */}

            <div className="col-12 col-sm-6 col-lg-4 project-overview">
              <div
                className="card shadow-lg h-100 d-flex flex-column"
                style={{
                  background:
                    "linear-gradient(145deg, #003f73 0%, #66c2ff 100%)",
                  color: "#fff",
                  minHeight: "250px",
                  border: "none",
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="text-white d-flex justify-content-between align-items-center"
                  style={{
                    borderRadius: "10px 10px 0 0",
                    padding: "10px 10px",
                    fontWeight: "bold",
                    background:
                      "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17 72 108) 100%)",
                  }}
                >
                  <b
                    className="mb-0 text-white"
                    style={{ margin: "0 auto", fontSize: "20px" }}
                  >
                    Project Overview
                  </b>
                </div>

                {projectData && projectData.length > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height={220}
                    className="pt-1"
                  >
                    <PieChart>
                      <Pie
                        data={projectData}
                        cx="50%"
                        cy="50%"
                        innerRadius="50%"
                        outerRadius="80%"
                        dataKey="value"
                        label={({ percent, x, y }) => (
                          <text
                            x={x}
                            y={y}
                            fill="#FFFFFF"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ fontSize: "0.9rem", fontWeight: "bold" }}
                          >
                            {`${(percent * 100).toFixed(1)}%`}
                          </text>
                        )}
                        labelLine={false}
                      >
                        {projectData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            onClick={() => handleProjectClick(entry.project_id)}
                            style={{ cursor: "pointer" }}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${value.toLocaleString()}%`}
                        contentStyle={{
                          backgroundColor: "#fff",
                          color: "#000",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          padding: "5px 10px",
                          fontSize: "0.85rem",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#fff",
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
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    {projectData.map((entry, index) => (
                      <div
                        key={`legend-${index}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          cursor: "pointer", // visually indicate clickable
                        }}
                        onClick={() => handleProjectClick(entry.project_id)}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: COLORS[index % COLORS.length],
                            borderRadius: "50%",
                            marginRight: "5px",
                          }}
                        ></div>
                        {entry.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Auto Swipe Active */}
            <div className="col-12 col-sm-6 col-lg-4 auto-swipe-active">
              <div
                className="card shadow-lg h-100"
                style={{
                  background:
                    "linear-gradient(145deg, #005a8f 0%, #66c2ff 100%)",
                  color: "#f1f1f1",
                  borderRadius: "15px",
                  border: "none",
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    borderRadius: "10px 10px 0 0",
                    fontWeight: 600,
                    background:
                      "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",
                    color: "#fff",
                    textAlign: "center",
                    padding: "10px 10px",
                  }}
                >
                  <p
                    className="mb-0 text-white"
                    style={{ margin: "0 auto", fontSize: "20px" }}
                  >
                    {autopayStatus === 1
                      ? "Auto Swipe Active"
                      : "Auto Swipe Inactive"}
                  </p>
                </div>
                {autopayStatus === 1 && autopay && (
                  <div className="text-center pt-3">
                    <div className="d-flex align-items-center justify-content-center my-3">
                      <span
                        className="badge p-2"
                        style={{
                          backgroundColor: "#f9a825",
                          color: "#212121",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          borderRadius: "8px",
                        }}
                      >
                        Threshold Balance:
                      </span>
                      <span
                        className="ms-3"
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: "1.5rem",
                        }}
                      >
                        {autopay?.Symbol} {autopay?.Threshold || "0"}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-center my-3">
                      <span
                        className="badge p-2"
                        style={{
                          backgroundColor: "#f9a825",
                          color: "#212121",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          borderRadius: "8px",
                        }}
                      >
                        Minimum Balance Required:
                      </span>
                      <span
                        className="ms-3"
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: "1.5rem",
                        }}
                      >
                        {autopay?.Symbol}{" "}
                        {autopay?.Minimum_Balance_Required || "0"}
                      </span>
                    </div>
                  </div>
                )}
                <div
                  className="d-flex flex-column gap-3 mt-4"
                  style={{ alignItems: "center" }}
                >
                  <button
                    className="btn btn-outline-light w-75"
                    style={{
                      borderRadius: "25px",
                      fontWeight: "600",
                      background: "#125bad",
                    }}
                  >
                    <a
                      href="/managefunds#pay_via_saved_cards"
                      className="text-white d-flex align-items-center justify-content-center"
                      style={{ textDecoration: "none" }}
                    >
                      <i
                        className="bi bi-wallet2 me-2"
                        style={{ color: "#ffffff" }}
                      ></i>
                      Manage Cards
                    </a>
                  </button>
                  <button
                    className="btn btn-outline-light w-75"
                    style={{
                      background: "#125bad",
                      borderRadius: "25px",
                      fontWeight: "600",
                    }}
                  >
                    <a
                      href="/managefunds"
                      className="text-white d-flex align-items-center justify-content-center"
                      style={{ textDecoration: "none" }}
                    >
                      <i
                        className="bi bi-gear me-2"
                        style={{ color: "#ffffff" }}
                      ></i>
                      Manage Auto Pay
                    </a>
                  </button>
                  <button
                    className="btn btn-outline-light w-75"
                    style={{
                      background: "#125bad",
                      borderRadius: "25px",
                      fontWeight: "600",
                    }}
                  >
                    <a
                      href="/managefunds"
                      className="text-white d-flex align-items-center justify-content-center"
                      style={{ textDecoration: "none" }}
                    >
                      <i
                        className="bi bi-wallet2 me-2"
                        style={{ color: "#ffffff" }}
                      ></i>
                      Add Funds
                    </a>
                  </button>
                </div>
              </div>
            </div>

            {/* Today's Highlights */}
            <div className="col-12 col-sm-6 col-lg-4 today-highlights">
              <div
                className="card shadow-lg h-100 "
                style={{
                  background:
                    "linear-gradient(145deg, #003f73 0%, #66c2ff 100%)",
                  color: "#fff",
                  border: "none",
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    borderRadius: "10px 10px 0 0",
                    fontWeight: 600,
                    background:
                      "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",
                    color: "#fff",
                    textAlign: "center",
                    padding: "10px 10px",
                  }}
                >
                  <p
                    className="mb-0 text-white"
                    style={{ margin: "0 auto", fontSize: "20px" }}
                  >
                    {" "}
                    Today's Highlights
                  </p>
                </div>
                <div className="text-center">
                  <CaseCalender />
                </div>
              </div>
            </div>
          </div>
        </RoleBasedElement>
      </div>

      <footer
        className="footer bottom py-3 "
        style={{ left: "14%", background: "transparent" }}
      >
        <div className="ms-3">
          <p className="mb-0">
            &copy;{new Date().getFullYear()}&nbsp;
            <a href="https://neuralit.com" target="_blank">
              Neural IT
            </a>
          </p>
        </div>
        <div className="me-3">
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
      </footer>

      {/* Popup Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
      >
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
