import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, Card, Row, Col } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./../../assets/css/case.css";
import { WithoutProjectCaseCreate } from "./WithoutProjectCaseCreate";
import RoleBasedElement from "../rolebaseaccess/RoleBasedElement";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Loader from "../Loader/Loader";
import debounce from "lodash.debounce";
import Notification from "./Notification";

export const AddClientCase = () => {
  // only for client side
  const navigate = useNavigate();
  const { createCase, userinformation, checkCaseNameAvailability } = useAuth();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [priority, setPriority] = useState(1);
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // New state variables for validation and similar cases
  const [isCaseNameAvailable, setIsCaseNameAvailable] = useState(null);
  const [similarCases, setSimilarCases] = useState([]);
  const [selectedSimilarCase, setSelectedSimilarCase] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  // Define the function to handle project selection
  const handleProjectSelect = (project) => {
    setSelectedProject(project); // Update the selected project state
    setShowProjectModal(false); // Hide the project modal
  };

  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleSelectedUsers = (users) => {
    setSelectedUsers(users);
    // console.log("Selected Users from Child: ", users);
    // passing data to bk  dataToSend.append("notified_user", JSON.stringify(selectedUsers || []));
  };

  useEffect(() => {
    if (selectedProject) {
    }
  }, [selectedProject]);

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    navigate("/");
  };

  useEffect(() => {
    const storedRoles = JSON.parse(sessionStorage.getItem("roles"));
    const userRole = storedRoles?.[0]?.role_name || "";
    // console.log("Current user role:", userRole);
    if (userRole) {
      if (userRole === "Client Admin" || userRole === "Client Case Manager" || userRole === "Client Finance Manager" || userRole === "Client Accountant") {
        setShowProjectModal(true);
      }
    }
  }, []);

  const clientId = userinformation.clientId;
  const projectId = selectedProject?.projectId;

  const handleSave = async () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set errors and stop submission
      return;
    }
    setIsLoading(true); // Show loader at start
    try {
      // Prepare the data object
      const data = {
        case_title: title,
        case_sub_title: subtitle,
        case_priority: priority,
        file_hash: fileName,
        file_data: {},
        case_body: body,
        derived_from_case_id: selectedSimilarCase
          ? selectedSimilarCase.case_id
          : null,
        notification_user_ids: selectedUsers || [],
      };

      // console.log("data=>",data);

      const formData = new FormData();

      files.forEach(({ file, newName, selected, sequence }) => {
        // Append each file to FormData under 'files'
        const renamedFile = new File([file], newName, { type: file.type });
        formData.append("files", renamedFile);

        // Build file_data
        data.file_data[newName] = {
          list: selected ? 2 : 0,
          order: sequence,
        };
      });

      // Append params as a JSON string
      formData.append("params", JSON.stringify(data));

      if (selectedSimilarCase && selectedSimilarCase.case_id !== undefined) {
        formData.append("derived_case_id", selectedSimilarCase.case_id);
      }

      // console.log(formData);

      const response = await createCase(clientId, projectId, formData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Case created successfully!");
        setTimeout(() => {
          navigate("/mycase");
        }, 200);
      } else {
        toast.error("Failed to save the case. Please try again.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file, index) => ({
      file,
      newName: file.name,
      selected: true,
      isEditing: false,
      tempName: file.name,
      id: `${file.name}-${file.lastModified}-${Math.random()}`, // Unique ID
      sequence: files.length + index + 1, // Set sequence number
    }));
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      // Update sequence numbers
      return updatedFiles.map((fileItem, idx) => ({
        ...fileItem,
        sequence: idx + 1,
      }));
    });
  };

  // Handle file name change
  const handleFileNameChange = (index, newName) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index].tempName = newName;
      return updatedFiles;
    });
  };

  // Handle rename click
  const handleRenameClick = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index].isEditing = true;
      return updatedFiles;
    });
  };

  // Handle save new name
  const handleSaveName = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index].newName = updatedFiles[index].tempName;
      updatedFiles[index].isEditing = false;
      return updatedFiles;
    });
  };

  // Handle cancel rename
  const handleCancelRename = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index].tempName = updatedFiles[index].newName;
      updatedFiles[index].isEditing = false;
      return updatedFiles;
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index].selected = !updatedFiles[index].selected;
      return updatedFiles;
    });
  };

  // Handle file removal
  const removeFile = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      // Update sequence numbers
      return updatedFiles.map((fileItem, idx) => ({
        ...fileItem,
        sequence: idx + 1,
      }));
    });
  };

  // Handle drag and drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedFiles = Array.from(files);
    const [movedFile] = reorderedFiles.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, movedFile);

    // Update sequence numbers
    const updatedFiles = reorderedFiles.map((fileItem, index) => ({
      ...fileItem,
      sequence: index + 1,
    }));

    setFiles(updatedFiles);
  };

  const formData = new FormData();
  const fileData = {};

  files.forEach(({ file, newName, selected }, index) => {
    if (selected) {
      const renamedFile = new File([file], newName, { type: file.type });
      formData.append("files", renamedFile);

      fileData[newName] = {
        list: selected ? 1 : 0,
        order: index + 1,
      };
    }
  });

  const titleRef = useRef(null);
  const caseInfoRef = useRef(null);
  const projectRef = useRef(null);
  const bodyRef = useRef(null);
  const attachFilesRef = useRef(null);

  const handleSidebarClick = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Debounced function to validate case name
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedValidateCaseName = useRef(
    debounce(async (caseName) => {
      try {
        const data = await checkCaseNameAvailability(clientId, caseName);

        // Find exact match (case-insensitive)
        const exactMatch = data.similar_cases.some(
          (caseItem) =>
            caseItem.case_name.toLowerCase() === caseName.toLowerCase()
        );

        setIsCaseNameAvailable(!exactMatch);
        setSimilarCases(data.similar_cases || []);
        setShowSuggestions(data.similar_cases.length > 0);
        // Set an error if the case name is not available
        if (exactMatch) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            title: "Case name already exists. Please choose another name.",
          }));
        } else {
          setErrors((prevErrors) => {
            const { title, ...rest } = prevErrors; // Clear error if no exact match
            return rest;
          });
        }
      } catch (error) {
        console.error("Error validating case name:", error);
      }
    }, 500)
  ).current;

  // Handle title input change
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    if (errors.title) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: null, // Clear error on input change
      }));
    }

    // Only show suggestions if no similar case has been selected
  if (value.trim() && !selectedSimilarCase) {
    debouncedValidateCaseName(value.trim());
  } else {
    setIsCaseNameAvailable(null);
    setSimilarCases([]);
    setShowSuggestions(false);
  }
    // if (value.trim()) {
    //   debouncedValidateCaseName(value.trim());
    // } else {
    //   setIsCaseNameAvailable(null);
    //   setSimilarCases([]);
    //   setShowSuggestions(false);
    // }

  };

  useEffect(() => {
    if (title.trim()) {
      debouncedValidateCaseName(title.trim());
    } else {
      setIsCaseNameAvailable(null);
      setSimilarCases([]);
      setShowSuggestions(false);
    }
  }, [title]);

  // const handleCaseNameSelect = (caseItem) => {
  //   const prefixedName = `${caseItem.case_name} NITCase-${caseItem.case_id}`;
  //   setSelectedSimilarCase(caseItem);
  //   setTitle(prefixedName); // Update the title with the prefixed name
  //   setShowSuggestions(false); // Hide suggestions
  // };

  const handleCaseNameSelect = (caseItem) => {
    const prefixedName = `${caseItem.case_name} NITCase-${caseItem.case_id}`;
    setSelectedSimilarCase(caseItem); // Set the selected similar case
    setTitle(prefixedName); // Update the title with the prefixed name
    setShowSuggestions(false); // Hide suggestions dropdown
    setIsCaseNameAvailable(true); // Mark the case name as available
    setSimilarCases([]); // Clear similar cases
  };

  const priorityOptions = ["Normal", "High", "Low"];

  const validateFields = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required.";
    } else if (!isCaseNameAvailable) {
      newErrors.title = "Case name already exists. Please choose another name.";
    }
    if (!subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required.";
    }
    if (!body.trim()) {
      newErrors.body = "Case description is required.";
    }
    return newErrors;
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* this is for role based access */}
          <RoleBasedElement allowedRoles={["Client Admin", "Client Case Manager", "Client Finance Manager", "Client Accountant"]}>
            <WithoutProjectCaseCreate
              show={showProjectModal}
              onHide={handleCloseProjectModal}
              onProjectSelect={handleProjectSelect}
            />
          </RoleBasedElement>

          <RoleBasedElement allowedRoles={["Client Admin", "Client Case Manager", "Client Finance Manager", "Client Accountant"]}>
            <div className="container my-4">
              <Card className="p-4 shadow-lg border-0">
                <Row>
                  <Col
                    lg={9}
                    md={8}
                    style={{ height: "100vh", overflowY: "scroll" }}
                  >
                    <h2
                      className="mb-4 form-title text-center pt-3 text-black"
                      // style={{  color: "#3f4254", }}
                    >
                      Create New Case
                    </h2>
                    <Card className="p-4 shadow-lg border-0">
                      {/* Title Section */}
                      {/* <Accordion
                        defaultActiveKey="0"
                        className="mb-4"
                        id="section-title"
                      >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <h5 className="required modal-title w-100 font-weight-bold text-black">
                              Title
                            </h5>
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="position-relative">
                              {/* Input Field 
                              <input
                                type="text"
                                name="title"
                                required
                                className={`form-control mb-2 fs-8 p-2 ${
                                  errors.title ? "is-invalid" : ""
                                }`}
                                placeholder="Case Title"
                                value={title}
                                onChange={handleTitleChange}
                                // onChange={(e) => setTitle(e.target.value)}
                                onFocus={() =>
                                  setShowSuggestions(similarCases.length > 0)
                                }
                                // onBlur={() => setShowSuggestions(false)}
                              />
                              {errors.title && (
                                <div className="invalid-feedback">
                                  {errors.title}
                                </div>
                              )}
                              {/* Availability Message 
                              {title.trim() &&
                                isCaseNameAvailable !== null &&
                                !showSuggestions && (
                                  <div
                                    className={`mt-2 ${
                                      isCaseNameAvailable
                                        ? "text-green"
                                        : "text-danger"
                                    }`}
                                  >
                                    {isCaseNameAvailable
                                      ? "✅ Case name is available."
                                      : ""}
                                  </div>
                                )}

                              {/* Suggestions Dropdown 
                              {showSuggestions && similarCases.length > 0 && (
                                <div
                                  className="dropdown-menu show w-100 overflow-auto"
                                  style={{ maxHeight: "150px" }}
                                >
                                  {similarCases.map((caseItem) => (
                                    <button
                                      key={caseItem.case_id}
                                      className="dropdown-item text-wrap text-truncate"
                                      onClick={() =>
                                        handleCaseNameSelect(caseItem)
                                      }
                                    >
                                      {caseItem.case_name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion> */}

<Accordion defaultActiveKey="0" className="mb-4" id="section-title">
  <Accordion.Item eventKey="0">
    <Accordion.Header>
      <h5 className="required modal-title w-100 font-weight-bold text-black">
        Title
      </h5>
    </Accordion.Header>
    <Accordion.Body>
      <div className="position-relative">
        {/* Input Field */}
        <input
          type="text"
          name="title"
          required
          className={`form-control mb-2 fs-8 p-2 ${
            errors.title ? "is-invalid" : ""
          }`}
          placeholder="Case Title"
          value={title}
          onChange={handleTitleChange}
          onFocus={() => {
            // Only show suggestions if no similar case has been selected
            if (!selectedSimilarCase) {
              setShowSuggestions(similarCases.length > 0);
            }
          }}
        />
        {errors.title && (
          <div className="invalid-feedback">{errors.title}</div>
        )}
        {/* Availability Message */}
        {title.trim() &&
          isCaseNameAvailable !== null &&
          !showSuggestions && (
            <div
              className={`mt-2 ${
                isCaseNameAvailable ? "text-green" : "text-danger"
              }`}
            >
              {isCaseNameAvailable
                ? "✅ Case name is available."
                : ""}
            </div>
          )}

        {/* Suggestions Dropdown */}
        {showSuggestions && similarCases.length > 0 && (
          <div
            className="dropdown-menu show w-100 overflow-auto"
            style={{ maxHeight: "150px" }}
          >
            {similarCases.map((caseItem) => (
              <button
                key={caseItem.case_id}
                className="dropdown-item text-wrap text-truncate"
                onClick={() => handleCaseNameSelect(caseItem)}
              >
                {caseItem.case_name}
              </button>
            ))}
          </div>
        )}
      </div>
    </Accordion.Body>
  </Accordion.Item>
</Accordion>

                      {/* Case Information Section */}
                      <Accordion
                        defaultActiveKey="0"
                        className="card card-flush accordionCard"
                        id="section-case-info"
                        ref={caseInfoRef}
                      >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <h5 className=" modal-title  w-100 font-weight-bold text-black">
                              Case Information
                            </h5>
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="row">
                              <div className="col-12 col-md-4 mb-3">
                                <label className="form-label fs-7 required">
                                  Sub Title
                                </label>
                                <input
                                  type="text"
                                  name="subtitle"
                                  required
                                  className={`form-control mb-2 fs-8 p-2 ${
                                    errors.subtitle ? "is-invalid" : ""
                                  }`}
                                  placeholder="Case SubTitle"
                                  value={subtitle}
                                  // onChange={(e) => setSubtitle(e.target.value)}
                                  onChange={(e) => {
                                    setSubtitle(e.target.value);
                                    if (errors.subtitle)
                                      setErrors((prev) => ({
                                        ...prev,
                                        subtitle: null,
                                      }));
                                  }}
                                  readOnly={isLocked}
                                />
                                {errors.subtitle && (
                                  <div className="invalid-feedback">
                                    {errors.subtitle}
                                  </div>
                                )}
                              </div>

                              <div className="col-12 col-md-4 mb-3">
                                <label className="form-label  fs-7">File</label>
                                <input
                                  type="text"
                                  name="file"
                                  className="form-control mb-2 fs-8 p-2"
                                  placeholder="File"
                                  value={fileName}
                                  onChange={(e) => setFileName(e.target.value)}
                                  readOnly={isLocked}
                                />
                              </div>

                              <div className="col-12 col-md-4 mb-3">
                                <label className="form-label fs-7">
                                  Priority:
                                  {isLocked && (
                                    <i className="fas fa-lock ms-1" />
                                  )}
                                </label>
                                <select
                                  className="form-select fs-8 p-2"
                                  value={priority}
                                  onChange={(e) => setPriority(e.target.value)}
                                  disabled={isLocked}
                                >
                                  <option value="2">Normal</option>
                                  <option value="1">High</option>
                                  <option value="3">Low</option>
                                </select>
                              </div>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>

                      {/* Project Section */}
                      <Accordion
                        defaultActiveKey="0"
                        className="card card-flush accordionCard"
                        id="section-project"
                        ref={projectRef}
                      >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <h5 className="required modal-title w-100 font-weight-bold text-black">
                              Project
                            </h5>
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="mb-2">
                              <label className="form-label fs-7">
                                Project Name:
                              </label>
                              <input
                                type="text"
                                name="project"
                                required
                                className="form-control mb-2 fs-8 p-2"
                                placeholder="project name"
                                value={
                                  selectedProject
                                    ? selectedProject.projectName
                                    : ""
                                }
                                readOnly
                              />
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>

                      {/* Case Body Section */}
                      <Accordion
                        defaultActiveKey="0"
                        className="card card-flush accordionCard"
                        id="section-body"
                        ref={bodyRef}
                      >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <h5 className="required modal-title w-100 font-weight-bold text-black">
                              Case Description
                            </h5>
                          </Accordion.Header>
                          <Accordion.Body>
                            <div>
                              {/* CKEditor with Validation Highlighting */}
                              <div
                                className={`ck-editor-wrapper ${
                                  errors.body ? "ck-invalid" : ""
                                }`}
                              >
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={body}
                                  onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setBody(data);
                                    if (errors.body) {
                                      setErrors((prev) => ({
                                        ...prev,
                                        body: null,
                                      }));
                                    }
                                  }}
                                />
                              </div>

                              {/* Show Error Message Below CKEditor */}
                              {errors.body && (
                                <div className="text-danger mt-1">
                                  {errors.body}
                                </div>
                              )}
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>

                      <Notification
                        selectedUsers={selectedUsers}
                        onSelectedUsersChange={handleSelectedUsers}
                        id="section-notify"
                      />
                      {/* Attach Files Section */}
                      <Accordion
                        defaultActiveKey="0"
                        className="card card-flush accordionCard"
                        id="section-files"
                        ref={attachFilesRef}
                      >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <h5 className=" modal-title  w-100 font-weight-bold text-black">
                              Attach Files To This Case
                            </h5>
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="mb-4">
                              <label
                                htmlFor="notifyAll"
                                className="form-check-label fs-8 text-muted"
                              >
                                Changes made to the attachments are not
                                permanent until you save this post. The first
                                "listed" file will be included in RSS feeds.
                                Files must be smaller than 10 GB and have one of
                                the following extensions:
                                <strong>
                                  {" "}
                                  au, avi, bzip2, csv, doc, docx, flv, gif,
                                  graffle, gz, htm, html, iso, jpeg, jpg, kml,
                                  kmz, mov, mp2, mp3, mp4, odp, ods, odt, pages,
                                  patch, pdf, png, pps, ppt, pptx, psd, rar,
                                  svg, swf, template, tif, tgz, txt, vsd, wav,
                                  wmv, xls, xlsx, zip, 7z.
                                </strong>
                              </label>
                              <div className="pt-3">
                                <input
                                  type="file"
                                  id="myfile"
                                  required
                                  name="myfile"
                                  className="form-control fs-8"
                                  multiple
                                  style={{ width: "100%" }}
                                  onChange={handleFileChange}
                                />
                              </div>
                            </div>
                            {/* Display Existing Files */}
                            {existingFiles.length > 0 && (
                              <div className="mt-3">
                                <h5 className="text-primary">
                                  Existing Files:
                                </h5>
                                <ul className="list-group">
                                  {existingFiles.map((file) => (
                                    <li
                                      key={file.file_id}
                                      className="list-group-item"
                                    >
                                      {file.filename} (
                                      {(file.filesize / 1024).toFixed(2)} KB)
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* Display New Files */}
                            {files.length > 0 && (
                              <div className="mt-3">
                                <h5 className="text-primary">
                                  Files to be uploaded:
                                </h5>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                  <Droppable droppableId="files">
                                    {(provided) => (
                                      <ul
                                        className="list-group"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {files.map((fileItem, index) => (
                                          <Draggable
                                            key={fileItem.id}
                                            draggableId={fileItem.id}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <li
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                              >
                                                <div className="d-flex align-items-center">
                                                  {/* Checkbox */}
                                                  <input
                                                    type="checkbox"
                                                    className="form-check-input me-2"
                                                    checked={fileItem.selected}
                                                    onChange={() =>
                                                      handleCheckboxChange(
                                                        index
                                                      )
                                                    }
                                                  />
                                                  {/* File Name and Rename Button */}
                                                  {!fileItem.isEditing ? (
                                                    <>
                                                      <span>
                                                        {fileItem.newName}
                                                      </span>
                                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                                      <button
                                                        className="btn btn-link btn-sm ms-2"
                                                        onClick={() =>
                                                          handleRenameClick(
                                                            index
                                                          )
                                                        }
                                                      >
                                                        Rename
                                                      </button>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <input
                                                        type="text"
                                                        value={
                                                          fileItem.tempName
                                                        }
                                                        onChange={(e) =>
                                                          handleFileNameChange(
                                                            index,
                                                            e.target.value
                                                          )
                                                        }
                                                        className="form-control"
                                                        style={{
                                                          width: "auto",
                                                        }}
                                                      />
                                                      <button
                                                        className="btn btn-success btn-sm ms-2"
                                                        onClick={() =>
                                                          handleSaveName(index)
                                                        }
                                                      >
                                                        Save
                                                      </button>
                                                      <button
                                                        className="btn btn-secondary btn-sm ms-2"
                                                        onClick={() =>
                                                          handleCancelRename(
                                                            index
                                                          )
                                                        }
                                                      >
                                                        Cancel
                                                      </button>
                                                    </>
                                                  )}
                                                </div>
                                                {/* Remove Button */}
                                                <button
                                                  className="btn btn-danger btn-sm fs-4"
                                                  onClick={() =>
                                                    removeFile(index)
                                                  }
                                                >
                                                  &times;
                                                </button>
                                              </li>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </ul>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                              </div>
                            )}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>

                      <div className="text-end">
                        <Button
                          onClick={handleSave}
                          className="mt-4 custom-btn btn-sm fw-bold text-black"
                          style={{
                            background: "#4fc9da",
                          }}
                        >
                          Save Case
                        </Button>
                      </div>
                    </Card>
                  </Col>

                  <Col
                    lg={3}
                    md={4}
                    sm={12}
                    className={`sidebar-container ${
                      showSidebar ? "d-block" : "d-none d-md-block"
                    }`}
                  >
                    <ul className="nav flex-column  pt-15">
                      <li className="nav-item">
                        <a
                          className="nav-link d-flex align-items-center cursor-pointer"
                          onClick={() => handleSidebarClick(titleRef)}
                          href="#section-title"
                          style={{ color: "#4fc9da" }}
                        >
                          <i
                            className="fas fa-heading me-2 "
                            style={{ color: "#4fc9da" }}
                          ></i>
                          <b>Title</b>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#section-case-info"
                          className="nav-link d-flex align-items-center cursor-pointer"
                          onClick={() => handleSidebarClick(caseInfoRef)}
                          style={{ color: "#4fc9da" }}
                        >
                          <i
                            className="fas fa-info-circle me-2"
                            style={{ color: "#4fc9da" }}
                          ></i>
                          <b>Case Information</b>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#section-project"
                          className="nav-link d-flex align-items-center cursor-pointer"
                          onClick={() => handleSidebarClick(projectRef)}
                          style={{ color: "#4fc9da" }}
                        >
                          <i
                            className="fas fa-project-diagram me-2"
                            style={{ color: "#4fc9da" }}
                          ></i>
                          <b>Project</b>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#section-body"
                          className="nav-link d-flex align-items-center cursor-pointer"
                          onClick={() => handleSidebarClick(bodyRef)}
                          style={{ color: "#4fc9da" }}
                        >
                          <i
                            className="fas fa-align-left me-2"
                            style={{ color: "#4fc9da" }}
                          ></i>
                          <b>Case Description</b>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#section-notify"
                          className="nav-link d-flex align-items-center cursor-pointer"
                          onClick={() => handleSidebarClick(bodyRef)}
                          style={{ color: "#4fc9da" }}
                        >
                          <i
                            className="fas fa-align-left me-2"
                            style={{ color: "#4fc9da" }}
                          ></i>
                          <b>Notification</b>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#section-files"
                          className="nav-link d-flex align-items-center cursor-pointer"
                          onClick={() => handleSidebarClick(attachFilesRef)}
                          style={{ color: "#4fc9da" }}
                        >
                          <i
                            className="fas fa-paperclip me-2"
                            style={{ color: "#4fc9da" }}
                          ></i>
                          <b>Attach Files</b>
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Card>

              <Toaster />
            </div>
          </RoleBasedElement>
        </>
      )}
    </>
  );
};

{
  /* <Accordion
    defaultActiveKey="0"
    className="card card-flush accordionCard"
    id="section-body"
    ref={bodyRef}
  >
    <Accordion.Item eventKey="0">
      <Accordion.Header>
        <h5 className="required modal-title w-100 font-weight-bold text-black">
          Case Description
        </h5>
      </Accordion.Header>
      <Accordion.Body>
        <div>
          {/* <textarea
            name="body"
            required
            className={`form-control mb-2 fs-8 p-2 ${errors.body ? "is-invalid" : ""
              }`}
            placeholder="Case Description"
            value={body}
            // onChange={(e) => setBody(e.target.value)}
            onChange={(e) => {
              setBody(e.target.value);
              if (errors.body)
                setErrors((prev) => ({
                  ...prev,
                  body: null,
                }));
            }}
          /> 

          <CKEditor
            editor={ClassicEditor}
            config={{
              toolbar: [
                "undo",
                "redo",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "blockQuote",
              ],
              height: 200,
              removePlugins: ["CKEditorInspector"],
            }}
            data={body} // Bind CKEditor content to `body`
            onChange={(event, editor) => {
              const data = editor.getData(); // Get updated data from CKEditor
              setBody(data); // Update state with new data
              if (errors.body) {
                // Clear the error if one exists
                setErrors((prev) => ({
                  ...prev,
                  body: null,
                }));
              }
            }}
            className={`form-control mb-2 fs-8 p-2 ${errors.body ? "is-invalid" : ""
            }`}
          />

          {errors.body && (
            <div className="invalid-feedback">
              {errors.body}
            </div>
          )}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion> */
}
