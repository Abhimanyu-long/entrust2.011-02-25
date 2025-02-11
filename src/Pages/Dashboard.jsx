import React, { useState, useEffect } from "react";
import {
  useNavigate,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import logo from "../assets/media/logos/neuralitlogo.png";
import userProfile from "../assets/media/users/user-profile.jpg";
import logoLight from "../assets/media/logos/neuralitlogo.png";
import logoDark from "../assets/media/logos/neuralitlogo.png";
import userprofile from "../assets/media/users/user-profile.jpg";
import { useAuth } from "../../context/AuthContext";
import { ViewDashboard } from "../dashboardPages/ViewDashboard";
import { Invoices } from "../dashboardPages/Invoices";
import { FundAdds } from "../dashboardPages/FundAdds";
import { Delivered } from "../dashboardPages/Delivered";
import { Financial } from "../components/Clients/Financial";
import { UserApprovals } from "../components/usermanagement/UserApprovals";
import { UserManager } from "../components/usermanagement/UserManager";
import { RolePermission } from "../components/usermanagement/RolePermission";
import { AllClients } from "../components/Clients/AllClients";
import { ClientsDetails } from "../components/Clients/ClientsDetails";
import { ProjectDetails } from "../components/projecttracker/ProjectDetails";
import { SingleCase } from "../components/casetracker/SingleCase";
import { Medical } from "../components/medical/Medical";
// import Joyride from "react-joyride";
import Joyride, { STATUS } from "react-joyride";
import { AddDirectCase } from "../components/casetracker/AddDirectCase";
import { MasterCode } from "../dashboardPages/Master/MasterCode";
import { AddNewProject } from "../components/projecttracker/AddNewProject";
import { AddNewCase } from "../components/casetracker/AddNewCase";
import { Breadcrumbs } from "../components/breadcrumbs/Breadcrumbs";
import ProfilePage from "../components/information/ProfilePage";
import { ActiveLogs } from "../components/information/ActiveLogs";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/dist/backdrop.css";
import "tippy.js/animations/shift-away.css";
import { roundArrow } from "tippy.js";
import "tippy.js/dist/svg-arrow.css";

import { QuickLink } from "../components/tippy/QuickLink";
import { ResetPassword } from "../components/information/ResetPassword";
import { Theme } from "../components/tippy/Theme";
import { Notification } from "../components/tippy/Notification";
import { ProfileTippy } from "../components/tippy/ProfileTippy";
import { SearchComponent } from "../components/search/SearchComponent";
import { Search } from "../components/search/Search";
import { SideBar } from "../components/sidebar/SideBar";
import { CaseTrackerRecord } from "../components/casetracker/CaseTrackerRecord";
import { PendingApproval } from "../components/Clients/PendingApproval";
import { GenericPageApproval } from "../components/Clients/GenericPageApproval";
import { ClientMembers } from "../components/Clients/ClientMembers";
import { GenericClientMembers } from "../components/Clients/GenericClientMembers";
import { ClientProject } from "../components/projecttracker/ClientProject";
import { ClientProjectDetail } from "../components/projecttracker/ClientProjectDetail";
import { FinancialActivity } from "../components/Clients/FinancialActivity";
import GenericFinancialActivity from "../components/Clients/GenericFinancialActivity";

import { FaLightbulb, FaTimes } from "react-icons/fa";
import { AddClientCase } from "../components/casetracker/AddClientCase";
import { QuickHelpFeatures } from "../components/quickhelp/QuickHelpFeatures";
import { PreviousInvoice } from "../components/report/PreviousInvoice";
import GenericCases from "../components/casetracker/GenericCases";
import { ClientMembers2 } from "../components/Clients/UpdatedGenericClientMembers";
import { FinancialSettings } from "../components/financialsettings/FinancialSettings";

import "../assets/css/newcss.css";
import { ShareBox } from "../components/sharebox/ShareBox";
import FullCalendar from "../Pages/FullCalendar";
import { EntrustAdvertisements } from "../components/popupmodal/EntrustAdvertisements";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, userdetails } = useAuth();

  const API_URL =
    import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

  const [searchQuery, setSearchQuery] = useState("");

  const UserID = JSON.parse(sessionStorage.getItem("user_id")) || {};

  // console.log(UserID.custom_id);
  const profileImageUrl = `${API_URL}/user/profile-image/${UserID.custom_id}`;
  // console.log(profileImageUrl);

  // console.log("userdetails", userdetails);

  // entust advertisement
  const [showModalEntrustAdvertisement, setShowModalEntrustAdvertisement] =
    useState(false);
  const handleEntrustAdvertisement = () =>
    setShowModalEntrustAdvertisement(false);
  const [showAdvertisementFlag, setshowAdvertisementFlag] = useState(false);

  const defaultThemeMode = "light";
  const username = sessionStorage.getItem("username");

  // const is_first_login = true;
  const is_first_login = sessionStorage.getItem("is_first_login");

  const userRole = JSON.parse(sessionStorage.getItem("roles"));

  // this is for profile state
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // --------------------------------------- delete kar na hai ----------------------------

  const [themeMode, setThemeMode] = useState(() => {
    let initialThemeMode = defaultThemeMode;

    if (document.documentElement) {
      // Check if theme mode is set as an attribute on the HTML document
      if (document.documentElement.hasAttribute("data-bs-theme-mode")) {
        initialThemeMode =
          document.documentElement.getAttribute("data-bs-theme-mode");
      }
      // Or check if theme mode is saved in sessionStorage
      else if (sessionStorage.getItem("data-bs-theme") !== null) {
        initialThemeMode = sessionStorage.getItem("data-bs-theme");
      }
    }

    if (initialThemeMode === "system") {
      const hour = new Date().getHours();
      initialThemeMode =
        hour >= 6 && hour < 18 ? "data-bs-theme-mode" : "data-bs-theme";
    }

    return initialThemeMode;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", themeMode);
    sessionStorage.setItem("data-bs-theme", themeMode);
  }, [themeMode]);

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
  };

  // -----------------------------  delete kar na hai ----------------------------

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const Logout = async () => {
    if (isLoggingOut) {
      return; // Prevent execution if a logout is already in progress
    }

    setIsLoggingOut(true); // Set the flag to true when logout starts

    const localStorageToken = sessionStorage.getItem("token"); // This seems to be your access token
    const refreshToken = sessionStorage.getItem("refresh_token"); // Assuming this stores your refresh token

    const data = {
      token: localStorageToken, // Access token
      refresh_token: refreshToken, // Add refresh_token to the request payload
    };
    try {
      const response = await logout(data);
      if (response.status === 200) {
        sessionStorage.clear();
        navigate("/login");
        setTimeout(() => {
          toast.success(response.data.message || "Logout successful!");
        }, 200);
        localStorage.removeItem("sessionSync"); // Clear localStorage sync data

        // Redirect to login and clear history
        window.history.replaceState(null, "", "/login"); // Replace current history entry
        window.location.href = "/login"; // Force redirect to login page
      } else {
        toast.error(response.data.message || "Logout failed");
        sessionStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "Logout error");
      sessionStorage.clear();
      navigate("/login");
    } finally {
      setIsLoggingOut(false); // Reset the flag after logout completes
    }
  };

  const location = useLocation();

  // State to track visibility of different menus
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  const [isUserManagementVisible, setIsUserManagementVisible] = useState(false);
  const [isUserMasterVisible, setIsUserMasterVisible] = useState(false);

  // Toggle functions
  const toggleDashboardMenu = () => setIsDashboardVisible((prev) => !prev);
  const toggleUserManagement = () =>
    setIsUserManagementVisible((prev) => !prev);
  const toggleMasterManagement = () => setIsUserMasterVisible((prev) => !prev);

  // useEffect for updating visibility based on path
  useEffect(() => {
    if (
      location.pathname.includes("/casetracker") ||
      location.pathname.includes("/projecttracker")
    ) {
      setIsDashboardVisible(false);
      setIsUserManagementVisible(false);
      setIsUserMasterVisible(false);
    } else if (
      location.pathname.includes("/") ||
      location.pathname.includes("/invoices") ||
      location.pathname.includes("/funds") ||
      location.pathname.includes("/delivered")
    ) {
      setIsDashboardVisible(true);
      setIsUserManagementVisible(false);
      setIsUserMasterVisible(false);
    } else if (
      location.pathname.includes("/userapprovals") ||
      location.pathname.includes("/usermanager") ||
      location.pathname.includes("/rolepermission")
    ) {
      setIsUserManagementVisible(true);
      setIsDashboardVisible(false);
    } else if (location.pathname.includes("/mastercode")) {
      setIsUserMasterVisible(true);
      setIsUserManagementVisible(false);
      setIsDashboardVisible(false);
    } else {
      setIsUserMasterVisible(false);

      setIsDashboardVisible(false);
      setIsUserManagementVisible(false);
    }
  }, [location.pathname]);

  // Navigation handlers (for client)
  const handleOverviewClick = () => navigate("/");

  const [showClientCaseModal, setShowClientCaseModal] = useState(false);
  const [showProjectCaseModal, setShowProjectCaseModal] = useState(false);

  const handleAddCaseClick = () => {
    navigate("/addcase");
  };

  const handleCloseClientCaseModal = () => {
    setShowClientCaseModal(false);
  };

  const handleCloseProjectCaseModal = () => {
    setShowProjectCaseModal(false); // Close WithoutProjectCaseCreate modal
  };

  const handleInvoicesClick = () => navigate("/invoices");
  const handleFundsClick = () => navigate("/funds");
  const handleDeliveredCase = () => navigate("/delivered");
  const handleUserManagerClick = () => navigate("/usermanager");
  const handleMasterCodeClick = () => navigate("/mastercode");

  const handleUserApprovalsClick = () => navigate("/userapprovals");
  const handleRolePermissionClick = () => navigate("/rolepermission");
  const handleAllClientsClick = () => navigate("/allclients");

  // (client-based functionality)
  const handleMyCaseClick = () => navigate("/mycase");
  const handleManageFundsClick = () => navigate("/managefunds");
  const handleFinancialSettingClick = () => navigate("/financialsettings");
  const handleApprovalEstimateClick = () => navigate("/approvalestimate");
  // const handleMyProjectsClick = () => navigate("/myprojects");
  const handleMyMembersClick = () => navigate("/mymembers");
  const handleMyInvoicesClick = () => navigate("/myinvoices");
  const handleShareBoxClick = () => navigate("/sharebox");
  const handleCalenderClick = () => navigate("/calendar");

  const handleFinancialActivityClick = () => navigate("/financialactivity");
  const handleCostEstimatorClick = () => {
    window.open("https://costestimator.neuralit.com/", "_blank");
  };

  const medicalRecordsPage = () => {
    navigate("/medical");
  };

  //Joyride
  const [run, setRun] = useState(false);
  const [hasVisited, setHasVisited] = useState(true);

  const steps = [
    {
      target: ".startTour",
      content:
        "Welcome! Let's start a quick tour to help you navigate the system.",
    },
    {
      target: ".direct-access",
      content: "Here, you can easily create a new case.",
    },
    {
      target: ".app-sidebar-menu",
      content:
        "This is your main navigation menu. Explore various sections from here.",
      placement: "right",
    },
    {
      target: ".notification-entrust",
      content: "Check your latest messages and notifications here.",
    },
    {
      target: ".profiletab",
      content: "View and update your personal details here.",
    },
    {
      target: ".total-cases",
      content:
        "View the breakdown of total cases by status WIP, Delivered, and On Hold with progress percentages.",
    },
    {
      target: ".available-balance",
      content:
        "Check your utilized, allocated, and estimated billing balances. You can also explore our service rate chart and use our cost estimator tool for detailed insights.",
    },
    {
      target: ".action-needed",
      content:
        "Stay on top of pending tasks, approvals, and alerts with actionable links.",
    },
    {
      target: ".project-overview",
      content:
        "Get a visual breakdown of your project distribution across different categories.",
    },
    {
      target: ".auto-swipe-active",
      content:
        "Manage your auto-pay settings, cards, and balance threshold for seamless transactions.",
    },
    {
      target: ".today-highlights",
      content: "See key updates, events, and calendar highlights for the day.",
    },
  ];

  useEffect(() => {
    const tour = sessionStorage.getItem("hasVisitedDashboard");
    if (!tour) {
      setHasVisited(false);
      setHasVisited(false);
    }
  }, []);

  const startTour = () => {
    setRun(true);
    setHasVisited(true);
    sessionStorage.setItem("hasVisitedDashboard", "true");
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: "999",
    },
    centeredDiv: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      width: "400px",
      padding: "20px",
      borderRadius: "8px",
      backgroundColor: "white",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: "1000",
    },
  };

  const handleneuralitClick = () => {
    navigate("/");
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const [visible, setVisible] = useState(true);
  const showAddCase = () => {
    navigate("/addcase");
  };

  const [showModal, setShowModal] = useState(false);
  const handleQuickHelp = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  // Function to start the Joyride tour
  // const startTourAgain = () => {
  //   setRun(true);
  //   setShowModal(false);
  // };

  // need to work --------------------

  // const startTourAgain = () => {
  //   setRun(false);
  //   setTimeout(() => setRun(true), 0);
  //   setShowModal(false);
  // };

  const startTourAgain = () => {
    if (location.pathname === "/") {
      // If already on the home page, execute the tour logic
      setRun(false);
      setTimeout(() => setRun(true), 0);
      setShowModal(false);
    } else {
      // Navigate to "/" first and then execute the tour logic
      navigate("/");
      setTimeout(() => {
        setRun(false);
        setTimeout(() => setRun(true), 0);
        setShowModal(false);
      }, 0); // Delay ensures that the state changes after navigation
    }
  };

  // need to work --------------------

  const [isSidebarVisiblemobile, setSidebarVisiblemobile] = useState(false);

  const toggleSidebarmobile = () => {
    setSidebarVisiblemobile((prevState) => !prevState);
  };

  const handleJoyrideCallback = (data) => {
    // console.log(data);
    const { status, type, action } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) || action === "close") {
      setRun(false);

      if (is_first_login && !showAdvertisementFlag) {
        setShowModalEntrustAdvertisement(true);
        setshowAdvertisementFlag(true);
      }
    }
    if (action === "close" || status === "finished" || status === "skipped") {
      // Stop the Joyride
      setRun(false);
    }
  };

  return (
    <>
      {is_first_login && !hasVisited && (
        <>
          <div style={styles.overlay}></div>
          <div style={styles.centeredDiv}>
            <h2>Welcome to Entrust!</h2>
            <p>
              This tour will guide you through the key features. Click the
              button to start.
            </p>

            <br />
            <button onClick={startTour} className="btn btn-primary startTour">
              Start
            </button>
          </div>
        </>
      )}

      {/* The tour */}
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            arrowColor: "#0098ca",
            primaryColor: "#0098ca",
            textColor: "#0098ca",
          },
        }}
        locale={{
          next: "Next",
          skip: "Skip",
        }}
      />

      <div
        id="nit_app_body"
        data-app-layout="light-sidebar"
        data-app-sidebar-enabled="true"
        data-app-sidebar-fixed="true"
        data-app-sidebar-push-header="true"
        data-app-sidebar-push-toolbar="true"
        data-app-sidebar-push-footer="true"
        className={`safari-mode app-default ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        {/* Main Body */}
        <div
          className="d-flex flex-column flex-root app-root"
          id="nit_app_root"
        >
          <div
            className="app-page flex-column flex-column-fluid"
            id="nit_app_page"
          >
            <div
              className="app-wrapper flex-column flex-row-fluid"
              id="nit_app_wrapper"
            >
              {/* Sidebar */}
              <div
                id="nit_app_sidebar"
                className={`app-sidebar flex-column ${
                  isSidebarCollapsed ? "collapsed" : ""
                }`}
                data-nit-drawer="true"
                data-nit-drawer-name="app-sidebar"
                data-nit-drawer-activate="{default: true, lg: false}"
                data-nit-drawer-overlay="true"
                data-nit-drawer-width="250px"
                data-nit-drawer-direction="start"
                data-nit-drawer-toggle="#nit_app_sidebar_mobile_toggle"
                style={{ zIndex: 100, border: "1px solid #003F73" }}
              >
                {/* this is logo div */}
                <div
                  className="app-sidebar-logo d-none d-lg-flex flex-stack flex-shrink-0 px-8"
                  id="nit_app_sidebar_logo"
                  onClick={handleneuralitClick}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    alt="Logo"
                    src={logoLight}
                    className="theme-light-show h-60px"
                  />
                  <img
                    alt="Logo"
                    src={logoDark}
                    className="theme-dark-show h-60px"
                  />
                </div>
                #4fc9da
                <div className="separator"></div>
                <div
                  id="nit_app_sidebar"
                  className={`app-sidebar flex-column ${
                    isSidebarCollapsed ? "collapsed" : ""
                  }`}
                  data-nit-drawer="true"
                  data-nit-drawer-name="app-sidebar"
                  data-nit-drawer-activate="{default: true, lg: false}"
                  data-nit-drawer-overlay="true"
                  data-nit-drawer-width="250px"
                  data-nit-drawer-direction="start"
                  data-nit-drawer-toggle="#nit_app_sidebar_mobile_toggle"
                  style={{
                    zIndex: 100,
                    backgroundColor: "#f9fcfe",
                    // backgroundColor: "rgba(177, 220, 228, 0.57)",
                    // borderRadius: "10px 10px 0px 0px",
                    // borderColor: "1px solid #003F73"
                    // backgroundColor:"rgb(226, 227, 229)"
                  }}
                >
                  {/* Sidebar Content */}
                  {/* <div
                    className="app-sidebar-logo d-none d-lg-flex flex-stack flex-shrink-0 px-8"
                    id="nit_app_sidebar_logo"
                    onClick={handleneuralitClick}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      alt="Logo"
                      src={logoLight}
                      className="theme-light-show h-60px"
                    />
                    <img
                      alt="Logo"
                      src={logoDark}
                      className="theme-dark-show h-60px"
                    />
                  </div> */}
                  <a style={{ textDecoration: "none" }}>
                    <div
                      className="app-sidebar-logo d-none d-lg-flex flex-stack flex-shrink-0 px-8"
                      id="nit_app_sidebar_logo"
                      onClick={handleneuralitClick}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        alt="Logo"
                        src={logoLight}
                        className="theme-light-show h-60px"
                      />
                      <img
                        alt="Logo"
                        src={logoDark}
                        className="theme-dark-show h-60px"
                      />
                    </div>
                  </a>

                  <div className="separator"></div>

                  <div
                    className="app-sidebar-menu hover-scroll-y my-5 my-lg-5 mx-3"
                    id="nit_app_sidebar_menu_wrapper"
                    data-nit-scroll="true"
                    data-nit-scroll-height="auto"
                    data-nit-scroll-dependencies="#nit_app_sidebar_toolbar, #nit_app_sidebar_footer"
                    data-nit-scroll-offset="0"
                    style={{ height: "100vh" }}
                  >
                    <div
                      className="menu menu-column menu-sub-indention menu-active-bg fw-semibold"
                      id="#nit_sidebar_menu"
                      data-nit-menu="true"
                    >
                      <SideBar
                        isDashboardVisible={isDashboardVisible}
                        toggleDashboardMenu={toggleDashboardMenu}
                        isUserManagementVisible={isUserManagementVisible}
                        toggleUserManagement={toggleUserManagement}
                        isUserMasterVisible={isUserMasterVisible}
                        toggleMasterManagement={toggleMasterManagement}
                        handleFundsClick={handleFundsClick}
                        handleInvoicesClick={handleInvoicesClick}
                        handleAllClientsClick={handleAllClientsClick}
                        medicalRecordsPage={medicalRecordsPage}
                        handleUserManagerClick={handleUserManagerClick}
                        handleUserApprovalsClick={handleUserApprovalsClick}
                        handleRolePermissionClick={handleRolePermissionClick}
                        handleMasterCodeClick={handleMasterCodeClick}
                        // this is for client-based functionality
                        handleOverviewClick={handleOverviewClick}
                        handleAddCaseClick={handleAddCaseClick}
                        handleMyCaseClick={handleMyCaseClick}
                        handleFinancialSettingClick={
                          handleFinancialSettingClick
                        }
                        handleManageFundsClick={handleManageFundsClick}
                        handleApprovalEstimateClick={
                          handleApprovalEstimateClick
                        }
                        // handleMyProjectsClick={handleMyProjectsClick}
                        handleMyMembersClick={handleMyMembersClick}
                        handleMyInvoicesClick={handleMyInvoicesClick}
                        handleFinancialActivityClick={
                          handleFinancialActivityClick
                        }
                        handleCostEstimatorClick={handleCostEstimatorClick}
                        handleShareBoxClick={handleShareBoxClick}
                        handleCalenderClick={handleCalenderClick}
                      />
                    </div>
                  </div>

                  {/* Fixed Profile Section */}
                  <div
                    className="app-sidebar-user d-flex flex-stack py-2 px-8  app-sidebar"
                    style={{
                      position: "sticky",
                      bottom: 0,
                      top: "100%",
                      width: "298px",
                      backgroundColor: "#f9fcfe",
                      padding: "8px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="d-flex me-5">
                      <div className="me-5">
                        <div
                          className="symbol symbol-40px cursor-pointer"
                          data-nit-menu-trigger="{default: 'click', lg: 'hover'}"
                          data-nit-menu-placement="bottom-start"
                          // data-nit-menu-overflow="true"
                        >
                          <img
                            src={
                              profileImageUrl ? profileImageUrl : userProfile
                            }
                            alt="Profile"
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite loop in case fallback also fails
                              e.target.src = userprofile; // Set fallback image
                            }}
                          />
                          {/* src={profileImageUrl?  profileImageUrl : userProfile} */}
                        </div>
                      </div>

                      <div className="me-2">
                        <span
                          className="app-sidebar-username text-gray-800 text-hover-primary fs-6 fw-semibold lh-0 username-truncate"
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: "200px",
                          }}
                        >
                          {username}
                        </span>
                        <span
                          className="app-sidebar-description text-gray-800 fw-semibold d-block fs-8"
                          style={{ color: "#003F73" }}
                        >
                          {userRole[0]?.role_name
                            ? userRole[0].role_name
                            : "Role"}
                        </span>
                      </div>
                    </div>

                    <a
                      onClick={Logout}
                      className="btn btn-icon btn-active-color-primary btn-icon-custom-color me-n4"
                      data-bs-toggle="tooltip"
                      title="Logout"
                    >
                      <i className="nit-dt nit-entrance-left fs-2 text-gray-500">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Main Content */}

              <div id="nit_app_header" className="app-header">
                <div
                  className="app-container container-fluid d-flex align-items-stretch justify-content-between"
                  id="nit_app_header_container"
                  style={{ background: "#f9fcfe" }}
                >
                  <div
                    className="d-flex align-items-center d-lg-none ms-n2 me-2"
                    title="Show sidebar menu"
                  >
                    <div
                      className="btn btn-icon btn-active-color-primary w-35px h-35px"
                      id="nit_app_sidebar_mobile_toggle"
                      onClick={toggleSidebarmobile}
                    >
                      <i className="nit-dt nit-abstract-14 fs-2hx">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div
                    className={`mobile-sidebar ${
                      isSidebarVisiblemobile ? "visible" : "hidden"
                    }`} // Toggle classes based on state
                  >
                    {/* Sidebar Content */}
                    <div className="sidebar-content">
                      {/* Logo Display */}
                      <img
                        alt="Logo"
                        src={logoLight}
                        className="theme-light-show h-60px"
                      />
                      <img
                        alt="Logo"
                        src={logoDark}
                        className="theme-dark-show h-60px"
                      />

                      {/* Close Button */}
                      <button
                        className="btn close-btn closed-sidebar"
                        onClick={toggleSidebarmobile}
                      >
                        <i
                          className="bi bi-x "
                          style={{ fontSize: "25px" }}
                        ></i>
                      </button>

                      <SideBar
                        isDashboardVisible={isDashboardVisible}
                        toggleDashboardMenu={toggleDashboardMenu}
                        isUserManagementVisible={isUserManagementVisible}
                        toggleUserManagement={toggleUserManagement}
                        isUserMasterVisible={isUserMasterVisible}
                        toggleMasterManagement={toggleMasterManagement}
                        handleFundsClick={handleFundsClick}
                        handleInvoicesClick={handleInvoicesClick}
                        handleAllClientsClick={handleAllClientsClick}
                        medicalRecordsPage={medicalRecordsPage}
                        handleUserManagerClick={handleUserManagerClick}
                        handleUserApprovalsClick={handleUserApprovalsClick}
                        handleRolePermissionClick={handleRolePermissionClick}
                        handleMasterCodeClick={handleMasterCodeClick}
                        // this is for client-based functionality
                        handleOverviewClick={handleOverviewClick}
                        handleAddCaseClick={handleAddCaseClick}
                        handleMyCaseClick={handleMyCaseClick}
                        handleFinancialSettingClick={
                          handleFinancialSettingClick
                        }
                        handleManageFundsClick={handleManageFundsClick}
                        handleApprovalEstimateClick={
                          handleApprovalEstimateClick
                        }
                        // handleMyProjectsClick={handleMyProjectsClick}
                        handleMyMembersClick={handleMyMembersClick}
                        handleMyInvoicesClick={handleMyInvoicesClick}
                        handleFinancialActivityClick={
                          handleFinancialActivityClick
                        }
                        handleCostEstimatorClick={handleCostEstimatorClick}
                        handleShareBoxClick={handleShareBoxClick}
                        handleCalenderClick={handleCalenderClick}

                        toggleSidebarmobile ={toggleSidebarmobile}
                      />
                    </div>
                      {/* Added side bar */}
                      <div
                        className="app-sidebar-user d-flex flex-stack py-2 px-8  app-sidebar"
                        style={{
                          position: "absolute",
                          bottom: "0.5rem",
                          width: "fitContain",
                          backgroundColor: "#f9fcfe",
                          padding: "8px 8px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div className="d-flex me-5">
                          <div className="me-5">
                            <div
                              className="symbol symbol-40px cursor-pointer"
                              data-nit-menu-trigger="{default: 'click', lg: 'hover'}"
                              data-nit-menu-placement="bottom-start"
                              // data-nit-menu-overflow="true"
                            >
                              <img
                                src={
                                  profileImageUrl
                                    ? profileImageUrl
                                    : userProfile
                                }
                                alt="Profile"
                                onError={(e) => {
                                  e.target.onerror = null; // Prevent infinite loop in case fallback also fails
                                  e.target.src = userprofile; // Set fallback image
                                }}
                              />
                              {/* src={profileImageUrl?  profileImageUrl : userProfile} */}
                            </div>
                          </div>

                          <div className="me-2">
                            <span
                              className="app-sidebar-username text-gray-800 text-hover-primary fs-6 fw-semibold lh-0 username-truncate"
                              style={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                maxWidth: "200px",
                              }}
                            >
                              {username}
                            </span>
                            <span
                              className="app-sidebar-description text-gray-800 fw-semibold d-block fs-8"
                              style={{ color: "#003F73" }}
                            >
                              {userRole[0]?.role_name
                                ? userRole[0].role_name
                                : "Role"}
                            </span>
                          </div>
                        </div>

                        <a
                          onClick={Logout}
                          className="btn btn-icon btn-active-color-primary btn-icon-custom-color me-n4"
                          data-bs-toggle="tooltip"
                          title="Logout"
                        >
                          <i className="nit-dt nit-entrance-left fs-2 text-gray-500">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </a>
                      </div>
                  </div>

                  <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                    <a className="d-lg-none">
                      <img alt="Logo" src={logo} className="h-25px" />
                    </a>
                  </div>

                  <div
                    className="d-flex align-items-stretch justify-content-between flex-lg-grow-1"
                    id="nit_app_header_wrapper"
                  >
                    <div
                      data-swapper="true"
                      data-swapper-mode="{default: 'prepend', lg: 'prepend'}"
                      data-swapper-parent="{default: '#nit_app_content_container', lg: '#nit_app_header_wrapper'}"
                      className="page-title d-flex flex-column justify-content-center flex-wrap me-3 mb-5 mb-lg-0"
                    >
                      <Breadcrumbs />
                    </div>

                    {/* this is header section  */}
                    <div className="app-navbar align-items-center flex-shrink-0">
                      {/* this is notification section */}
                      <div className="app-navbar-item ms-2 ms-lg-4 notification-entrust">
                        <Tippy
                          content={<Notification />}
                          arrow={false}
                          interactive
                          theme={themeMode}
                          trigger="click" //now i click on
                          //  trigger="mouseenter click"  previous use
                        >
                          <a className="btn btn-custom btn-outline btn-icon btn-icon-gray-700 btn-active-icon-primary">
                            <i
                              className="nit-dt nit-notification-status fs-2qx ms-3"
                              style={{ color: "#007bff" }}
                            >
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                              <span className="path4"></span>
                            </i>
                            <span
                              className="bullet bullet-dot bg-danger h-8px w-8px translate-middle "
                              style={{ marginLeft: "-6px", marginTop: "-10px" }}
                            ></span>
                          </a>
                        </Tippy>
                      </div>
                      {/* className="bullet bullet-dot bg-danger h-8px w-8px translate-middle animation-blink "*/}

                      {/* this is profile section */}
                      <div
                        className="app-navbar-item ms-1 ms-lg-4"
                        id="nit_header_user_menu_toggle"
                      >
                        <Tippy
                          content={<ProfileTippy Logout={Logout} />}
                          arrow={false}
                          interactive
                          theme={themeMode}
                          trigger="mouseenter click"
                        >
                          <div className="btn btn-outline btn-icon cursor-pointer symbol symbol-35px profiletab">
                            <img
                              src={
                                profileImageUrl ? profileImageUrl : userProfile
                              }
                              onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop in case fallback also fails
                                e.target.src = userprofile; // Set fallback image
                              }}
                              // profileImageUrl?  profileImageUrl : userProfile
                              className="rounded-3"
                              alt="user"
                              title="Profile"
                            />
                          </div>
                        </Tippy>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Content Area */}
              <div>
                <Routes>
                  {/* Default Route to show ViewDashboard */}
                  <Route path="/" element={<ViewDashboard />} />
                  {/* <Route path="/2" element={<ViewDashboard2 />} /> */}

                  {/* this is for admin related route */}
                  <Route path="/usermanager" element={<UserManager />} />
                  <Route path="/userapprovals" element={<UserApprovals />} />
                  <Route path="/rolepermission" element={<RolePermission />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/funds" element={<FundAdds />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route
                    path="/previousinvoice"
                    element={<PreviousInvoice />}
                  />
                  <Route
                    path="/search"
                    element={<Search searchQuery={searchQuery} />}
                  />
                  <Route path="/activity" element={<ActiveLogs />} />
                  <Route path="/delivered" element={<Delivered />} />
                  <Route path="/financial" element={<Financial />} />
                  <Route path="/resetpassword" element={<ResetPassword />} />
                  <Route path="/allclients" element={<AllClients />} />
                  <Route
                    path="/allclients/client/:clientId/*"
                    element={<ClientsDetails />}
                  />
                  <Route
                    path="/allclients/client/:clientId/projects/:projectId"
                    element={<ProjectDetails />}
                  />
                  <Route
                    path="/allclients/client/:clientId/case/:caseId"
                    element={<SingleCase />}
                  />
                  <Route path="/medical/*" element={<Medical />} />
                  {/* <Route path="/addcase" element={<AddDirectCase />} /> */}
                  <Route path="/mastercode" element={<MasterCode />} />
                  <Route
                    path="/myprojects/projects/:project_id"
                    element={<ProjectDetails />}
                  />
                  <Route
                    path="/myprojects/casetracker"
                    element={<CaseTrackerRecord />}
                  />
                  <Route
                    path="/myprojects/case/:caseId"
                    element={<SingleCase />}
                  />
                  <Route
                    path="/allclients/client/:clientId/addProject"
                    element={<AddNewProject />}
                  />
                  <Route path="/myprojects/addcase" element={<AddNewCase />} />

                  {/* this is for client related route */}
                  <Route path="/addcase" element={<AddClientCase />} />
                  <Route path="/mycase" element={<GenericCases />} />
                  <Route path="/managefunds" element={<FundAdds />} />
                  <Route
                    path="/financialsettings"
                    element={<FinancialSettings />}
                  />
                  <Route
                    path="/approvalestimate"
                    element={<PendingApproval />}
                  />
                  <Route
                    path="/approvalestimate2"
                    element={<GenericPageApproval />}
                  />
                  <Route path="/myprojects" element={<ClientProject />} />
                  <Route
                    path="/myprojects/:project_id"
                    element={<ClientProjectDetail />}
                  />
                  <Route path="/mymembers" element={<ClientMembers />} />
                  <Route path="/mymembers2" element={<ClientMembers2 />} />
                  <Route
                    path="/mygenericmembers"
                    element={<GenericClientMembers />}
                  />
                  <Route path="/myinvoices" element={<Invoices />} />
                  <Route path="/sharebox" element={<ShareBox />} />
                  <Route path="/calendar" element={<FullCalendar />} />
                  <Route
                    path="/financialactivity1"
                    element={<FinancialActivity />}
                  />
                  <Route
                    path="/financialactivity"
                    element={<GenericFinancialActivity />}
                  />
                </Routes>
              </div>

              <div className="pt-4"></div>
              <span
                className="navbar-toggler pt-9"
                type="button"
                onClick={toggleSidebar}
                aria-label="Toggle navigation"
              >
                <span className="hamburger-icon">
                  {isSidebarCollapsed ? (
                    <span
                      className="fas fa-bars fs-3 "
                      style={{ color: "grey", height: "24px", width: "24px" }}
                    ></span>
                  ) : (
                    <span
                      className="fas fa-bars fs-3"
                      style={{ color: "grey", height: "24px", width: "24px" }}
                    ></span>
                  )}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Toaster />

      {visible && (
        <div
          className="floating-button shortCut-addCase  direct-access"
          id="add-case-btn"
          onClick={showAddCase}
        >
          <FaLightbulb className="icon" style={{ color: "#000000" }} />
          <span className="text-black">Add Case</span>
          <span className="close-icon" style={{ color: "#000000" }}>
            +
          </span>
        </div>
      )}

      {visible && (
        <div
          className="floating-button shortCut-addCase"
          id="quick-help-btn"
          onClick={handleQuickHelp}
        >
          <span className="text-black">Quick Help</span>
        </div>
      )}

      {/* QuickHelpFeatures Component */}
      <QuickHelpFeatures
        show={showModal}
        handleClose={handleCloseModal}
        startTourAgain={startTourAgain}
      />

      {/* Advertisement */}
      {showModalEntrustAdvertisement && (
        <EntrustAdvertisements closed={handleEntrustAdvertisement} />
      )}
    </>
  );
};
