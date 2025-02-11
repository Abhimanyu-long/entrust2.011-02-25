import React, { useState } from "react";
import RoleBasedElement from "../rolebaseaccess/RoleBasedElement";
import { NavLink } from "react-router-dom";

export const SideBar = ({
  isDashboardVisible,
  toggleDashboardMenu,
  isUserManagementVisible,
  toggleUserManagement,
  isUserMasterVisible,
  toggleMasterManagement,

  handleFundsClick,
  handleInvoicesClick,
  handleAllClientsClick,
  medicalRecordsPage,
  handleUserManagerClick,
  handleUserApprovalsClick,
  handleRolePermissionClick,
  handleMasterCodeClick,

  // this is for client ,
  handleOverviewClick,
  handleAddCaseClick,
  handleMyCaseClick,
  handleManageFundsClick,
  handleApprovalEstimateClick,
  handleMyProjectsClick,
  handleMyMembersClick,
  handleMyInvoicesClick,
  handleFinancialActivityClick,
  handleFinancialSettingClick,
  handleRedChartClick,
  handleCostEstimatorClick,
  handleShareBoxClick,
  handleCalenderClick,

  //toggle to closed sidebar
  toggleSidebarmobile

}) => {
  // this is for client
  const [isCaseMenuVisible, setisCaseMenuVisible] = useState(false);
  const [isManageFundVisible, setisManageFundVisible] = useState(false);
  const toggleCaseMenu = () => setisCaseMenuVisible((prev) => !prev);
  const toggleFundMenu = () => setisManageFundVisible((prev) => !prev);


  // client related route
  const routeToMenuMap = {
    // this is for client route
    "/": "Home",
    "/addcase": "Add Case",
    "/mycase": "My Case",
    "/funds": "Funds",
    "/approvalestimate": "Approval Estimate",
    "/myprojects": "My Projects",
    "/mymembers": "My Members",
    "/invoices": "Invoices",
    "/financialactivity": "Financial Activity",
    "/costestimator": "Cost Estimator",
    "/ratechart": "Rate Chart",

    "/delivered": "Delivered Cases",
    "/casetracker": "Case Tracker",
    "/projecttracker": "Project Tracker",
    "/usermanager": "UserManager",
    "/userapprovals": "UserApprovals",
    "/rolepermission": "RolePermission",
    "/allclients": "All Clients",
    "/mastercode": "Master Code",
    "/managefunds": "Manage Funds",
    "/myinvoices": "My Invoices",
    "/overview": "Overview",
    "/calendar" : "My Calendar",
  };

  // Function to get the active menu item based on the current route (updated)
  const getActiveMenu = () => {
    for (const route in routeToMenuMap) {
      if (location.pathname.includes(route)) {
        return routeToMenuMap[route];
      }
    }
    return null;
  };

  const activeMenu = getActiveMenu();

  // console.log("Current path:", location.pathname);
  // console.log("Active Menu:", activeMenu);

  const showAddCase = () => {
    navigate("/addcase");
  };

  return (
    <>
      <RoleBasedElement
        allowedRoles={["administrator"]}
        rolePriority={["administrator"]}
      >
        <div
          className={`menu-item menu-accordion ${isDashboardVisible ? "show" : ""
            }`}
        >
          <span className="menu-link" onClick={toggleDashboardMenu}>
            <span className="menu-icon">
              <i className="nit-dt nit-chart-pie-3 fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
            </span>
            <span className="menu-title">Dashboards</span>
            <span className="menu-arrow"></span>
          </span>

          {isDashboardVisible && (
            <div className="menu-sub menu-sub-accordion">
              <div className="menu-item" onClick={handleOverviewClick}>
                <a
                  className={`menu-link ${activeMenu === "Home" ? "active" : ""
                    }`}
                >
                  <span className="menu-icon">
                    <i className="nit-dt nit-chart fs-2" >
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                  <span className="menu-title">Home</span>
                </a>
              </div>

              <div className="menu-item" onClick={handleFundsClick}>
                <a
                  className={`menu-link ${activeMenu === "Funds" ? "active" : ""
                    }`}
                >
                  <span className="menu-icon">
                    <i className="nit-dt nit-shield-tick fs-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                  <span className="menu-title">Add Funds</span>
                </a>
              </div>

              <div className="menu-item" onClick={handleInvoicesClick}>
                <a
                  className={`menu-link ${activeMenu === "Invoices" ? "active" : ""
                    }`}
                >
                  <span className="menu-icon">
                    <i className="nit-dt nit-bill fs-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                      <span className="path4"></span>
                      <span className="path5"></span>
                      <span className="path6"></span>
                    </i>
                  </span>
                  <span className="menu-title">Invoices</span>
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="menu-item pt-5">
          <div className="menu-content">
            <span className="menu-heading fw-bold text-uppercase fs-7">
              Client Info
            </span>
          </div>
        </div>

        <div className="menu-item" onClick={handleAllClientsClick}>
          <a
            className={`menu-link ${activeMenu === "All Clients" ? "active" : ""
              }`}
          >
            <span className="menu-icon">
              <i className="nit-dt nit-briefcase fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </span>
            <span className="menu-title">Groups</span>
          </a>
        </div>

        <div
          className={`menu-item menu-accordion ${isUserManagementVisible ? "show" : ""
            }`}
        >
          <span className="menu-link" onClick={toggleUserManagement}>
            <span className="menu-icon">
              <i className="nit-dt nit-chart-simple fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
              </i>
            </span>
            <span className="menu-title">Users Management</span>
            <span className="menu-arrow"></span>
          </span>

          {isUserManagementVisible && (
            <div className="menu-sub menu-sub-accordion">
              <div className="menu-item" onClick={handleUserManagerClick}>
                <a
                  className={`menu-link ${activeMenu === "UserManager" ? "active" : ""
                    }`}
                >
                  <span className="menu-icon">
                    <i className="nit-dt nit-rocket fs-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                  <span className="menu-title">User Role Manager</span>
                </a>
              </div>
              <div className="menu-item" onClick={handleUserApprovalsClick}>
                <a
                  className={`menu-link ${activeMenu === "UserApprovals" ? "active" : ""
                    }`}
                >
                  <span className="menu-icon">
                    <i className="nit-dt nit-rocket fs-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                  <span className="menu-title">User Approvals</span>
                </a>
              </div>
              <div className="menu-item" onClick={handleRolePermissionClick}>
                <a
                  className={`menu-link ${activeMenu === "RolePermission" ? "active" : ""
                    }`}
                >
                  <span className="menu-icon">
                    <i className="nit-dt nit-rocket fs-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                  <span className="menu-title">Role Permission Manager</span>
                </a>
              </div>
            </div>
          )}
        </div>

        <div
          className={`menu-item menu-accordion ${isUserMasterVisible ? "show" : ""
            }`}
        >
          <span className="menu-link" onClick={toggleMasterManagement}>
            <span className="menu-icon">
              <i className="nit-dt nit-chart-simple fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
              </i>
            </span>
            <span className="menu-title">Masters</span>
            <span className="menu-arrow"></span>
          </span>

          {isUserMasterVisible && (
            <>
              <div className="menu-sub menu-sub-accordion">
                <div className="menu-item" onClick={handleMasterCodeClick}>
                  <a
                    className={`menu-link ${activeMenu === "Master Code" ? "active" : ""
                      }`}
                  >
                    <span className="menu-icon">
                      <i className="nit-dt nit-rocket fs-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </span>
                    <span className="menu-title">Master Code</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="menu-item pt-5">
          <div className="menu-content">
            <span className="menu-heading fw-bold text-uppercase fs-7">
              Help
            </span>
          </div>
        </div>
        <div className="menu-item" onClick={medicalRecordsPage}>
          <a className="menu-link">
            <span className="menu-icon">
              <i className="nit-dt nit-briefcase fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </span>
            <span className="menu-title">Medical Records</span>
          </a>
        </div>
      </RoleBasedElement>

      <RoleBasedElement
        // allowedRoles={["Client Admin", "Anonymous User"]}
        allowedRoles={["Client Admin","Client Case Manager","Client Finance Manager","Client Accountant"]}
        rolePriority={["Client Admin","Client Case Manager","Client Finance Manager","Client Accountant"]}
      >
        {/* Home */}
        <div className="menu-item" onClick={() => {
    handleOverviewClick();
    toggleSidebarmobile();
  }}>
          <NavLink to="/" className="menu-link" activeclassname="active">
            <span className="menu-icon">
              <i className="nit-dt nit-chart fs-2" style={{ color: "#000000" }}>
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </span>
            <span className="menu-title">Home</span>
          </NavLink>
        </div>

        {/* Manage Case */}
        <div
          className={`menu-item menu-accordion ${isCaseMenuVisible ? "show" : ""
            }`}
        >
          <span className="menu-link" onClick={toggleCaseMenu}>
            <span className="menu-icon">
              <i
                className="nit-dt nit-chart-pie-3 fs-2"
                style={{ color: "#000000" }}
              >
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
            </span>
            <span className="menu-title">Manage Case</span>
            <span className="menu-arrow"></span>
          </span>

          {isCaseMenuVisible && (
            <div className="menu-sub menu-sub-accordion">
              {/* Add Case */}
              <div className="menu-item" onClick={()=>{handleAddCaseClick();
                 toggleSidebarmobile();
              }}>
                <NavLink
                  to="/addcase"
                  className="menu-link"
                  activeclassname="active"
                >
                  <span className="menu-icon">
                    <i
                      className="nit-dt nit-shield-tick fs-2"
                      style={{ color: "#000000" }}
                    >
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                  <span className="menu-title">Add Case</span>
                </NavLink>
              </div>

              {/* My Cases */}
              <div className="menu-item"
              onClick={()=>{handleMyCaseClick();
                toggleSidebarmobile();
             }}
              >
                <NavLink
                  to="/mycase"
                  className="menu-link"
                  activeclassname="active"
                >
                  <span className="menu-icon">
                    <i
                      className="nit-dt nit-shield-tick fs-2"
                      style={{ color: "#000000" }}
                    >
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                  <span className="menu-title">My Cases</span>
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* Manage Funds */}
        <div
          className={`menu-item menu-accordion ${isManageFundVisible ? "show" : ""
            }`}
        >
          <span className="menu-link" onClick={toggleFundMenu}>
            <span className="menu-icon">
              <i className="nit-dt nit-bill fs-2" style={{ color: "#000000" }}>
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
                <span className="path6"></span>
              </i>
            </span>
            <span className="menu-title">Manage Funds</span>
            <span className="menu-arrow"></span>
          </span>

          {isManageFundVisible && (
            <div className="menu-sub menu-sub-accordion">
              {/* Add Fund */}
              <div className="menu-item"
                onClick={()=>{handleManageFundsClick();
                  toggleSidebarmobile();
               }}
              >
                <NavLink
                  to="/managefunds"
                  className="menu-link"
                  activeclassname="active"
                >
                  <span className="menu-icon">
                    <i
                      className="nit-dt nit-shield-tick fs-2"
                      style={{ color: "#000000" }}
                    >
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                  <span className="menu-title">Add Funds</span>
                </NavLink>
              </div>
              {/* Financial Settings */}
              <div className="menu-item"
                onClick={()=>{handleFinancialSettingClick();
                  toggleSidebarmobile();
               }}
              >
                <NavLink
                  to="/financialsettings"
                  className="menu-link"
                  activeclassname="active"
                >
                  <span className="menu-icon">
                    <i
                      className="nit-dt nit-shield-tick fs-2"
                      style={{ color: "#000000" }}
                    >
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                  <span className="menu-title">Financial Settings</span>
                </NavLink>
              </div>
              {/* Financial Activity */}
              <div className="menu-item"
               onClick={()=>{handleFinancialActivityClick();
                toggleSidebarmobile();
             }}
              >
                <NavLink
                  to="/financialactivity"
                  className="menu-link"
                  activeclassname="active"
                >
                  <span className="menu-icon">
                    <i
                      className="nit-dt nit-shield-tick fs-2"
                      style={{ color: "#000000" }}
                    >
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                  <span className="menu-title">Financial Activity</span>
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* Approve Estimate */}
        <div className="menu-item"
         onClick={()=>{handleApprovalEstimateClick();
          toggleSidebarmobile();
       }}
        >
          <NavLink
            to="/approvalestimate"
            className="menu-link"
            activeclassname="active"
          >
            <span className="menu-icon">
              <i className="nit-dt nit-badge fs-2" style={{ color: "#000000" }}>
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
              </i>
            </span>{" "}
            <span className="menu-title">Approve Estimate</span>
          </NavLink>
        </div>

        {/* My Projects */}
        {/* <div className="menu-item" onClick={handleMyProjectsClick}>
          <NavLink
            to="/myprojects"
            className="menu-link"
            activeclassname="active"
          >
            <span className="menu-icon">
              <i
                className="nit-dt nit-rocket fs-2"
                style={{ color: "#000000" }}
              >
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </span>
            <span className="menu-title">My Projects</span>
          </NavLink>
        </div> */}


    {/* My Invoices */}
    <div className="menu-item"
     onClick={()=>{handleMyInvoicesClick();
      toggleSidebarmobile();
   }}
    >
          <NavLink
            to="/myinvoices"
            className="menu-link"
            activeclassname="active"
          >
            <span className="menu-icon">
              <i className="nit-dt nit-bill fs-2" style={{ color: "#000000" }}>
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
                <span className="path6"></span>
              </i>
            </span>
            <span className="menu-title">My Invoices</span>
          </NavLink>
        </div>
        
        {/* My Members */}
        <div className="menu-item"
         onClick={()=>{handleMyMembersClick();
          toggleSidebarmobile();
       }}
        >
          <NavLink
            to="/mymembers"
            className="menu-link"
            activeclassname="active"
          >
            <span className="menu-icon">
              <i
                className="nit-dt nit-shield-tick fs-2"
                style={{ color: "#000000" }}
              >
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </span>
            <span className="menu-title">My Members</span>
          </NavLink>
        </div>

    

        {/* my share box */}
        <div className="menu-item"
         onClick={()=>{handleShareBoxClick();
          toggleSidebarmobile();
       }}
        >
          <NavLink
            to="/sharebox"
            className="menu-link"
            activeclassname="active"
          >
            <span className="menu-icon">
              <i
                className="nit-dt nit-rocket fs-2"
                style={{ color: "#000000" }}
              >
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </span>
            <span className="menu-title">ShareBox</span>
          </NavLink>
        </div>

        {/* My calender */}
        <div className="menu-item" onClick={handleCalenderClick} hidden>
          <NavLink
            to="/calendar" 
            className="menu-link"
            activeclassname="active"
          >
            <span className="menu-icon">
              <i
                className="nit-dt nit-rocket fs-2"
                style={{ color: "#000000" }}
              >
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </span>
            <span className="menu-title">My Calendar</span>
          </NavLink>
        </div>
        
        {/* My explore Services*/}
        <div className="menu-item">
          <a
            href="https://www.neuralit.com/medical-legal-outsourcing"
            target="_blank"
            className="menu-link"
          >
            <span className="menu-icon">
              <i className="nit-dt nit-map fs-2" style={{ color: "#000000" }}>
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
            </span>
            <span className="menu-title">Explore Services</span>
          </a>
        </div>



      </RoleBasedElement>
    </>
  );
};
