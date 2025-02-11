import React from "react";

export const FloatingPage = ({ show, onClose }) => {
  return (
    <>
      <div
        id="modal_quick_action_upload"
        tabIndex="-1"
        className={`modal fade ${show ? 'show' : ''}`} 
        style={{ display: show ? 'block' : 'none', zIndex: 1050, zIndex: "1050 !important" }}
        aria-hidden={!show}
      >
        <div className="modal-dialog modal-fullscreen p-9">
          <div className="modal-content modal-rounded">
            <div className="modal-header">
              <h2>Upload Files</h2>

              <div
                className="btn btn-sm btn-icon btn-active-color-primary"
                data-bs-dismiss="modal"
                onClick={onClose}
              >
                <i className="nit-dt nit-cross fs-1">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
              </div>
            </div>

            <div className="modal-body py-lg-10 px-lg-10">
              <div className="fv-row mb-8">
                <label className="fs-6 fw-semibold mb-2">
                  Enter Case Number
                </label>
                <input
                  type="text"
                  className="form-control form-control-solid"
                  placeholder="Type to search cases..."
                  name="selected_case_id"
                />
              </div>

              <div className="fv-row mb-8">
                <div
                  className="dropzone"
                  id="nit_modal_create_project_settings_logo"
                >
                  <div className="dz-message needsclick">
                    <i className="nit-dt nit-file-up fs-3hx text-primary">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>

                    <div className="ms-4">
                      <h3 className="dfs-3 fw-bold text-gray-900 mb-1">
                        Drop files here or click to upload.
                      </h3>
                      <span className="fw-semibold fs-4 text-muted">
                        Upload up to 10 files
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="fs-6 fw-semibold mb-2">Uploaded File</label>

                <div className="mh-300px scroll-y me-n7 pe-7">
                  <div className="d-flex flex-stack py-4 border border-top-0 border-left-0 border-right-0 border-dashed">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px">
                        <img src="assets/media/files/pdf.svg" alt="icon" />
                      </div>

                      <div className="ms-6">
                        <a
                          href="#"
                          className="fs-5 fw-bold text-gray-900 text-hover-primary mb-2"
                        >
                          Anthony Galloway - Medical Records
                        </a>
                        <div className="fw-semibold text-muted">5.2 MB</div>
                      </div>
                    </div>

                    <div className="min-w-100px">
                      <select
                        className="form-select form-select-solid form-select-sm"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder="Action"
                      >
                        <option></option>
                        <option value="1">Rename</option>
                        <option value="2">Delete</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex flex-stack py-4 border border-top-0 border-left-0 border-right-0 border-dashed">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px">
                        <img src="assets/media/files/doc.svg" alt="icon" />
                      </div>

                      <div className="ms-6">
                        <a
                          href="#"
                          className="fs-5 fw-bold text-gray-900 text-hover-primary mb-2"
                        >
                          Anthony Galloway - Bills
                        </a>
                        <div className="fw-semibold text-muted">3.6 MB</div>
                      </div>
                    </div>

                    <div className="min-w-100px">
                      <select
                        className="form-select form-select-solid form-select-sm"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder="Action"
                      >
                        <option></option>
                        <option value="1">Rename</option>
                        <option value="2">Delete</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex flex-stack py-4 border border-top-0 border-left-0 border-right-0 border-dashed">
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px">
                        <img src="assets/media/files/pdf.svg" alt="icon" />
                      </div>

                      <div className="ms-6">
                        <a
                          href="#"
                          className="fs-5 fw-bold text-gray-900 text-hover-primary mb-2"
                        >
                          Anthony Galloway - Documents
                        </a>
                        <div className="fw-semibold text-muted">2.5 MB</div>
                      </div>
                    </div>

                    <div className="min-w-100px">
                      <select
                        className="form-select form-select-solid form-select-sm"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder="Action"
                      >
                        <option></option>
                        <option value="1">Rename</option>
                        <option value="2">Delete</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
