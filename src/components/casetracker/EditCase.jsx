import React, { useEffect, useRef, useState } from "react";
import { Accordion, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import "./../../assets/css/case.css";

export const EditCase = () => {
 
  const { clientId, projectId } = useParams();
  // console.log("clientId", clientId, projectId);
  const navigate = useNavigate();
  const { createCase, uploadFile, getAllUser } = useAuth();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [fileName, setFileName] = useState("");

  const [assignedTo, setAssignedTo] = useState("Unassigned");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("Task");
  const [dueDate, setDueDate] = useState("");
  const [dateDelivered, setDateDelivered] = useState("");

  const [estimatedTime, setEstimatedTime] = useState("");

  const [error, setError] = useState(null);
  const [userassignedTo, setUserAssignedTo] = useState([]);

  const [body, setBody] = useState("");

  const fetchRoles = async () => {
    try {
      const response = await getAllUser();
      setUserAssignedTo(response || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [getAllUser]);

  const [isFreeCase, setIsFreeCase] = useState(false);
  const [isSampleCase, setIsSampleCase] = useState(false);
  const [pageCount, setPageCount] = useState("");
  const [variableValues, setVariableValues] = useState({
    fixedValue: "",
    variable1: "",
    variable2: "",
    variable3: "",
    variable4: "",
    variable5: "",
    variable6: "",
    variable7: "",
  });
  const [finalizeCaseEstimate, setFinalizeCaseEstimate] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariableValues({
      ...variableValues,
      [name]: value,
    });
  };

  const [base, setBase] = useState("");
  const [benchmark, setBenchmark] = useState("");

  const [files, setFiles] = useState([]);


  const [selectedOptions, setSelectedOptions] = useState([]);
  const options = ["Service 1", "Service 2", "Service 3", "Service 4","Service 5", "Service 6", "Service 7", "Service 8","Service 9", "Service 10", "Service 11", "Service 12"];

  const handleSelectChange = (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(selectedValues);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Handle file upload
  const handleSubmit = async () => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    // Append the filepath to the FormData object
    formData.append("filepath", "/home/neuralit/TestingUploads");

    try {
      const response = await uploadFile(formData);
      toast.success("Files uploaded successfully");
      // console.log("Upload response:", response);
    } catch (error) {
      toast.error("Error uploading files");
      console.error("Upload error:", error);
    }
  };

  const handleSave = async () => {
    handleSubmit();

    try {
      const data = {
        case_title: title,
        case_sub_title: subtitle,
        file: fileName,
        due_date: dueDate,
        date_delivered: dateDelivered,
        assign_to: assignedTo,
        case_status: status,
        case_priority: priority,
        type: type,
        time_estimated: estimatedTime,
        benchmarking: {
          base,
          benchmark,
        },
        Service_type: selectedOptions,
        is_free_case: isFreeCase,
        is_sample_case: isSampleCase,
        page_count: pageCount,
        variable_values: variableValues,
        finalize_case_estimate: finalizeCaseEstimate,
        follow_up_date: followUpDate,
        case_body: body,
      };

      // console.log(data);

      const response = await createCase(clientId, projectId, data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Case created successfully!");
        setTimeout(() => {
          navigate("/");
        }, 100);
      } else {
        toast.error("Failed to save the case. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(`Failed to process: ${error.message}`);
    }
  };

  const titleRef = useRef(null);
  const caseInfoRef = useRef(null);
  const projectRef = useRef(null);
  const timeEstimatedRef = useRef(null);
  const customFieldsRef = useRef(null);
  const bodyRef = useRef(null);
  const attachFilesRef = useRef(null);

  const handleSidebarClick = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
  <>
    <div className="container my-4">
        <Card className="p-4 shadow-lg border-0">
          <Row>
            <Col lg={9} md={8} style={{ height: "100vh", overflowY: "scroll" }}>
              <h2
                className="mb-4 form-title text-center pt-3"
                style={{ color: "#0098ca" }}
              >
                Edit Case
              </h2>
              <Card className="p-4 shadow-lg border-0">
                <Accordion
                  defaultActiveKey="0"
                  className="card card-flush accordionCard"
                  id="section-title"
                  ref={titleRef}
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <label className="required form-label fs-6">Title</label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <input
                        type="text"
                        name="title"
                        className="form-control mb-2 fs-8 p-2"
                        placeholder="Case Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion
                  defaultActiveKey="0"
                  className="card card-flush accordionCard"
                  id="section-case-info"
                  ref={caseInfoRef}
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <label className="required form-label fs-6">
                        Case Information
                      </label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="row">
                        <div className="col-6">
                          <label className="required form-label fs-7">
                            Sub Title
                          </label>
                          <input
                            type="text"
                            name="subtitle"
                            className="form-control mb-2 fs-8 p-2"
                            placeholder="Additional Information Related To The Current Task"
                            value={subtitle}
                            // style={{height:"30%"}}
                            onChange={(e) => setSubtitle(e.target.value)}
                          />
                        </div>

                        <div className="col-6">
                          <label className="required form-label fs-7">
                            File
                          </label>
                          <input
                            type="text"
                            name="file"
                            className="form-control mb-2 fs-8 p-2"
                            placeholder="File"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="row pt-2 d-flex align-items-center ">
                        {/* <div className=""> */}
                        <div className="col-6">
                          <label className="required form-label fs-7">
                            Due Date
                          </label>
                          <br />
                          <input
                            type="date"
                            name="due date"
                            title="The due date for this case"
                            placeholder="Project Name"
                            className="form-control fs-8 p-2"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                          />
                        </div>
                        <div className="col-6">
                          <label className="required form-label fs-7">
                            Date Delivered
                          </label>
                          <br />
                          <input
                            type="date"
                            name="due date"
                            title="The delivery date for this case"
                            placeholder="Project Name"
                            className="form-control fs-8 p-2"
                            value={dateDelivered}
                            onChange={(e) => setDateDelivered(e.target.value)}
                          />
                        </div>
                        {/* </div> */}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion
                  defaultActiveKey="0"
                  className="card card-flush accordionCard"
                  id="section-project"
                  ref={projectRef}
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <label className="required form-label fs-6">
                        Project
                      </label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="row">
                        <div className="form-group mb-3 col-3">
                          <label className="form-label fs-7">Assign To:</label>
                          <select
                            className="form-select fs-8 p-2"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            required
                          >
                            <option value="Unassigned">Unassigned</option>
                            {userassignedTo.length > 0 ? (
                              userassignedTo.map((user) => (
                                <option
                                  key={user.user_id}
                                  value={user.user_name}
                                >
                                  {user.user_name}
                                </option>
                              ))
                            ) : (
                              <option disabled>Loading users...</option>
                            )}
                          </select>
                        </div>

                        <div className="form-group mb-3 col-3">
                          <label className="form-label fs-7">Status:</label>
                          <select
                            className="form-select fs-8 p-2"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>

                        <div className="form-group mb-3 col-3">
                          <label className="form-label fs-7">Priority:</label>
                          <select
                            className="form-select fs-8 p-2"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                          >
                            <option value="2">Normal</option>
                            <option value="1">High</option>
                            <option value="3">Low</option>
                          </select>
                        </div>

                        <div className="form-group mb-3 col-3">
                          <label className="form-label fs-7">Type:</label>
                          <select
                            className="form-select fs-8 p-2"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                          >
                            <option value="Task">Task</option>
                            <option value="Bug">Bug</option>
                            <option value="Feature">Feature</option>
                          </select>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion
                  defaultActiveKey="0"
                  className="card card-flush accordionCard"
                  id="section-time"
                  ref={timeEstimatedRef}
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <label className="required form-label fs-6">
                        Time Estimated
                      </label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <input
                        type="text"
                        className="form-control fs-8 p-2"
                        placeholder="Estimated Time"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion
                  defaultActiveKey="0"
                  className="card card-flush accordionCard"
                  id="section-custom-field"
                  ref={customFieldsRef}
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <label className="form-label fs-7">Custom Fields</label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="custom-fields">
                        <Accordion
                          defaultActiveKey="0"
                          className="card card-flush accordionCard"
                        >
                          <Accordion.Item>
                            <Accordion.Header>
                              <label className=" form-label fs-7">
                                Benchmarking
                              </label>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="row">
                                <div className="col-6 form-group mb-3">
                                  <label className="form-label fs-7">
                                    Base:
                                  </label>
                                  <select
                                    className="form-select fs-7 p-2"
                                    value={base}
                                    onChange={(e) => setBase(e.target.value)}
                                  >
                                    <option value="">Choose</option>
                                    <option value="Option1">Option 1</option>
                                    <option value="Option2">Option 2</option>
                                  </select>
                                </div>

                                <div className="form-group mb-3 col-6">
                                  <label className="form-label fs-7">
                                    Benchmark:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control fs-8 p-2"
                                    value={benchmark}
                                    onChange={(e) =>
                                      setBenchmark(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>

                      <div>
                        <Accordion
                          defaultActiveKey="0"
                          className="card card-flush accordionCard"
                        >
                          <Accordion.Item>
                            <Accordion.Header>
                              <label className=" form-label fs-7"> Service Type</label>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="d-flex align-items-start gap-3">
                                <select
                                  multiple
                                  value={selectedOptions}
                                  onChange={handleSelectChange}
                                  style={{width:"200px" ,height:"130px"}}
                                >
                                  <option disabled value="">
                                    Choose
                                  </option>
                                  {options.map((option, index) => (
                                    <option key={index} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                <div
                                  className="border p-2 rounded"
                                  style={{ minWidth: "200px" }}
                                >
                                  <strong>Selected Services:</strong>
                                  <div>
                                    {selectedOptions.length > 0
                                      ? selectedOptions.join(", ")
                                      : "No services selected"}
                                  </div>
                                </div>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </div>

                      <div className="row form-section">
                        {/* <div className="row"> */}
                        <div className="col-4 form-check mb-3">
                          <input
                            type="checkbox"
                            id="isFreeCase"
                            className="form-check-input fs-8"
                            checked={isFreeCase}
                            onChange={() => setIsFreeCase(!isFreeCase)}
                          />
                          <label
                            htmlFor="isFreeCase"
                            className="form-check-label"
                          >
                            Is Free Case
                          </label>
                        </div>

                        <div className="col-4 form-check mb-3">
                          <input
                            type="checkbox"
                            id="isSampleCase"
                            className="form-check-input fs-8"
                            checked={isSampleCase}
                            onChange={() => setIsSampleCase(!isSampleCase)}
                          />
                          <label
                            htmlFor="isSampleCase"
                            className="form-check-label"
                          >
                            Is Sample Case
                          </label>
                        </div>
                        {/* </div> */}

                        <div className="form-group mb-3">
                          <label className="form-label fs-7">Page Count:</label>
                          <input
                            type="text"
                            className="form-control fs-8 p-2"
                            value={pageCount}
                            onChange={(e) => setPageCount(e.target.value)}
                          />
                        </div>

                        <div className="form-group mb-3">
                          <label className="form-label fs-7">
                            Case Plus Variable Values:
                          </label>

                          {/* First Row */}
                          <div className="row">
                            <div className="col-md-3 mb-2">
                              <input
                                type="text"
                                name="fixedValue"
                                className="form-control fs-8 p-2"
                                placeholder="Fixed Value"
                                value={variableValues.fixedValue}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <input
                                type="text"
                                name="variable1"
                                className="form-control fs-8 p-2"
                                placeholder="Variable Value 1"
                                value={variableValues.variable1}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <input
                                type="text"
                                name="variable2"
                                className="form-control fs-8 p-2"
                                placeholder="Variable Value 2"
                                value={variableValues.variable2}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <input
                                type="text"
                                name="variable3"
                                className="form-control fs-8 p-2"
                                placeholder="Variable Value 3"
                                value={variableValues.variable3}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          {/* Second Row */}
                          <div className="row">
                            <div className="col-md-3 mb-2">
                              <input
                                type="text"
                                name="variable4"
                                className="form-control fs-8 p-2"
                                placeholder="Variable Value 4"
                                value={variableValues.variable4}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <input
                                type="text"
                                name="variable5"
                                className="form-control fs-8 p-2"
                                placeholder="Variable Value 5"
                                value={variableValues.variable5}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <input
                                type="text"
                                name="variable6"
                                className="form-control fs-8 p-2"
                                placeholder="Variable Value 6"
                                value={variableValues.variable6}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-md-3 mb-2">
                              <input
                                type="text"
                                name="variable7"
                                className="form-control fs-8 p-2"
                                placeholder="Variable Value 7"
                                value={variableValues.variable7}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          {/* Checkbox */}
                          <div className="form-check mt-3">
                            <input
                              type="checkbox"
                              id="finalizeCaseEstimate"
                              className="form-check-input fs-8 p-2"
                              checked={finalizeCaseEstimate}
                              onChange={() =>
                                setFinalizeCaseEstimate(!finalizeCaseEstimate)
                              }
                            />
                            <label
                              htmlFor="finalizeCaseEstimate"
                              className="form-check-label fs-8"
                            >
                              Finalize Case Estimate
                            </label>
                          </div>
                        </div>

                        <div style={{ width: "169px" }}>
                          <label className="required form-label fs-7">
                            Followup Date:
                          </label>
                          <input
                            type="date"
                            className="form-control fs-8 p-2"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion
                  defaultActiveKey="0"
                  className="card card-flush accordionCard"
                  id="section-body"
                  ref={bodyRef}
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <label className="required form-label fs-6">Body</label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div>
                        <textarea
                          name="body"
                          className="form-control mb-2 fs-8 p-2"
                          placeholder="Project Message"
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                        />
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion
                  defaultActiveKey="0"
                  className="card card-flush accordionCard"
                  id="section-files"
                  ref={attachFilesRef}
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      <label className="form-label fs-6">
                        Attach Files To This Case
                      </label>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div>
                        <label
                          htmlFor="notifyAll"
                          className="form-check-label fs-8"
                        >
                          Changes made to the attachments are not permanent
                          until you save this post. The first "listed" file will
                          be included in RSS feeds. Files must be smaller than
                          10 GB and have one of the following extensions: au
                          avi bzip2 csv doc docx flv gif graffle gz htm html iso
                          jpeg jpg kml kmz mov mp2 mp3 mp4 odp ods odt pages
                          patch pdf png pps ppt pptx psd rar svg swf template
                          tif tgz txt vsd wav wmv xls xlsx zip 7z.
                        </label>
                        <div className="pt-3">
                          <input
                            type="file"
                            id="myfile"
                            name="myfile"
                            className="fs-8"
                            multiple
                            style={{ width: "30%" }}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      {files.length > 0 && (
                        <div>
                          <p>Files to be uploaded:</p>
                          <ul>
                            {Array.from(files).map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <div className="text-end">
                  <Button onClick={handleSave} className="mt-4 custom-btn">
                    <b>Save Case</b>
                  </Button>
                </div>
              </Card>
            </Col>

           
            <Col lg={3} md={4} className="bg-light">
              <ul className="nav flex-column sidebar-links pt-10">
                <li className="nav-item">
                  <a
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", titleRef)}
                    href="#section-title"
                  >
                    <i className="fas fa-heading me-2"style={{color:"#ffffff"}}></i>
                    Title
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-case-info"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", caseInfoRef)}
                  >
                    <i className="fas fa-info-circle me-2"style={{color:"#ffffff"}}></i>
                    Case Information
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-project"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", projectId)}
                  >
                    <i className="fas fa-project-diagram me-2"style={{color:"#ffffff"}}></i>
                    Project
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-time"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", timeEstimatedRef)}
                  >
                    <i className="fas fa-clock me-2" style={{color:"#ffffff"}}></i>
                    Time Estimated
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-case-info"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", customFieldsRef)}
                  >
                    <i className="fas fa-cogs me-2"style={{color:"#ffffff"}}></i>
                    Custom Field
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-body"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", bodyRef)}
                  >
                    <i className="fas fa-align-left me-2" style={{color:"#ffffff"}}></i>
                    Body
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-files"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", attachFilesRef)}
                  >
                    <i className="fas fa-paperclip me-2"style={{color:"#ffffff"}}></i>
                    Attach Files
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Card>

        <Toaster />
      </div>
  </>
  )
}
