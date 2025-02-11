import React from "react";
import userProfile from "../assets/media/users/user-profile.jpg"; // Update to your user profile image path



export const DashboardFooter = ({ username, userRole, Logout }) => {

  return (
    <div style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 10 }}>
      {/* Sidebar Section */}
      <div
        className="d-flex align-items-center justify-content-between px-4 py-3"
        style={{
          width: "300px",
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
          height: "60px",
          position: "fixed",
          bottom: "0",
          left: "0",
        }}
      >
        <div className="d-flex align-items-center">
          <img
            src={userProfile}
            alt="Profile"
            className="rounded-circle"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              marginRight: "10px",
            }}
          />
          <div>
            <p className="mb-0 text-gray-800 fw-bold">{username}</p>
            <p className="mb-0 text-gray-500 fs-8">{userRole}</p>
          </div>
        </div>
        <button
          onClick={Logout}
          className="btn btn-icon btn-outline-danger rounded-circle"
          style={{
            height: "40px",
            width: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>

      {/* Footer Section */}
      <div
        className="d-flex align-items-center justify-content-between px-4 py-3"
        style={{
          backgroundColor: "#f9f9f9",
          borderTop: "1px solid #ddd",
          // marginLeft: "300px",
          height: "60px",
          left:"3000px"
        }}
      >
        <div className="d-flex align-items-center">
          <span className="text-muted fs-8 me-2">2024©</span>
          <a
            href="https://www.neuralit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 text-hover-primary fw-semibold"
          >
            Neural IT
          </a>
        </div>
        <ul className="nav">
          <li className="nav-item">
            <a
              href="https://www.neuralit.com/about-us"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-gray-600 text-hover-primary px-2 fs-8"
            >
              {/* About */}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="https://www.neuralit.com/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-gray-600 text-hover-primary px-2 fs-8"
            >
              Terms of Use
            </a>
          </li>
          <li className="nav-item">
            <a
              href="https://www.neuralit.com/privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-gray-600 text-hover-primary px-2 fs-8"
            >
              Privacy Statement
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
