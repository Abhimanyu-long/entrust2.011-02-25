import React from "react";

export const Theme = ({ handleThemeChange }) => {
  return (
    <>
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px show"
        data-nit-menu="true"
        data-nit-element="theme-mode-menu"
        data-popper-placement="bottom-end"
      >
        <div className="menu-item px-3 my-0">
          <a
            className="menu-link px-3 py-2"
            data-nit-element="mode"
            data-nit-value="light"
            onClick={() => handleThemeChange("light")}
          >
            <span className="menu-icon" data-nit-element="icon">
              <i className="nit-dt nit-night-day fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
                <span className="path6"></span>
                <span className="path7"></span>
                <span className="path8"></span>
                <span className="path9"></span>
                <span className="path10"></span>
              </i>
            </span>
            <span className="menu-title"> Light </span>
          </a>
        </div>

        <div className="menu-item px-3 my-0">
          <a
            className="menu-link px-3 py-2"
            data-nit-element="mode"
            data-nit-value="dark"
            onClick={() => handleThemeChange("dark")}
          >
            <span className="menu-icon" data-nit-element="icon">
              <i className="nit-dt nit-moon fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </span>
            <span className="menu-title"> Dark </span>
          </a>
        </div>
      </div>
    </>
  );
};
