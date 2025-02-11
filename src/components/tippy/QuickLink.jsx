import React from 'react'

export const QuickLink = () => {
  return (
    <>
      <div
    className="menu menu-sub menu-sub-dropdown menu-column w-250px w-lg-325px show rounded-top"
    data-nit-menu="true"
    data-popper-placement="bottom-end"
  >
    <div
      className="d-flex flex-column flex-center bgi-no-repeat  px-9 py-5"
      style={{
        backgroundImage:
          "url('src/assets/media/misc/menu-header-bg.jpg')",
      }}
    >
      <h3 className="text-white fw-semibold mb-3">
        Quick Links
      </h3>
    </div>

    <div className="row g-0">
      <div className="col-6">
        <a
          href="#"
          className="d-flex flex-column flex-center h-100 p-6 bg-hover-light border-end border-bottom"
        >
          <i className="nit-dt nit-dollar fs-3x text-primary mb-2">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
          </i>
          <span className="fs-5 fw-semibold text-gray-800 mb-0">
            Accounting
          </span>
          <span className="fs-7 text-gray-500">
            View Invoices
          </span>
        </a>
      </div>
      <div className="col-6">
        <a
          href="#"
          className="d-flex flex-column flex-center h-100 p-6 bg-hover-light border-bottom"
        >
          <i className="nit-dt nit-sms fs-3x text-primary mb-2">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <span className="fs-5 fw-semibold text-gray-800 mb-0">
            Administration
          </span>
          <span className="fs-7 text-gray-500">
            Manage Settings
          </span>
        </a>
      </div>
      <div className="col-6">
        <a
          href="#"
          className="d-flex flex-column flex-center h-100 p-6 bg-hover-light border-end"
        >
          <i className="nit-dt nit-abstract-41 fs-3x text-primary mb-2">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <span className="fs-5 fw-semibold text-gray-800 mb-0">
            Projects
          </span>
          <span className="fs-7 text-gray-500">
            My Cases
          </span>
        </a>
      </div>
      <div className="col-6">
        <a
          href="#"
          className="d-flex flex-column flex-center h-100 p-6 bg-hover-light"
        >
          <i className="nit-dt nit-briefcase fs-3x text-primary mb-2">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <span className="fs-5 fw-semibold text-gray-800 mb-0">
            Team
          </span>
          <span className="fs-7 text-gray-500">
            Manage Users
          </span>
        </a>
      </div>
    </div>
    <div className="py-2 text-center border-top">
      &nbsp;
    </div>
  </div>
    </>
  )
}
