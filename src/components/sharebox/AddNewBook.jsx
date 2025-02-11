import React, { useCallback, useEffect, useRef, useState } from "react";
import { Accordion, Card } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Notification from "../casetracker/Notification";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { File } from "../fileRelation/File";
import "../../assets/css/main.css";
export const AddNewBook = ({ handlecloseAddClosed }) => {
  const { createShareBox, getShareNoteBook } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  // const fileRef = useRef();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    parent_id: "0",
    files: "",
    notified_user: [],
    keyword: "",
  });
  const [shareOption, setShareOption] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const handleSelectedUsers = (users) => {
    setSelectedUsers(users);
    // console.log("Selected Users from Child: ", users);
  };

  const client = JSON.parse(sessionStorage.getItem("client_data"));
  const client_ID = client?.client_id;
  useEffect(() => {
    const fetchShareBoxDetail = async () => {
      try {
        const response = await getShareNoteBook(client_ID);
        if (response.status === 1) {
          const filteredMessage = response.message.filter(
            (item) => item.s_project_id === 0
          );
          const combinedOptions = [
            ...filteredMessage,
            ...response.default_projects.map((project) => ({
              sharebox_id: project.project_id,
              title: project.project_title,
              parent_id: 0,
            })),
          ];
          setShareOption(combinedOptions);
        } else {
          setError("Failed to fetch notebook data.");
        }
      } catch (error) {
        console.error("Error fetching notebook data:", error);
        setError("An error occurred while fetching notebook data.");
      }
    };

    if (client_ID) {
      fetchShareBoxDetail();
    }
  }, [getShareNoteBook, client_ID]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     files: selectedFiles,
  //   }));
  // };

  const handleUploadedFilesChange = useCallback((files) => {
    setUploadedFiles(files);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the description is empty
    if (!formData.title || formData.title.trim() === "") {
      toast.error("title is required.");
      return;
    }
    if (!formData.description || formData.description.trim() === "") {
      toast.error("Description is required.");
      return;
    }

    // Retrieve combined files from the File component
    // const allFiles = fileRef.current.getFiles();
    // console.log("Combined Files:", allFiles);
    // this is for keywords
    const keywordList = formData.keyword
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword);

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("description", formData.description || null);

    // Add `s_project_id` or `parent_id` based on type
    if (isNaN(formData.parent_id)) {
      dataToSend.append("s_project_id", formData.parent_id); // Add string
    } else {
      dataToSend.append("parent_id", formData.parent_id); // Add integer
    }

    dataToSend.append("keywords", JSON.stringify(keywordList));

    // allFiles.forEach((file) => {
    //   dataToSend.append("files", file.file);
    // });

    // if (formData.files && formData.files.length > 0) {
    //   formData.files.forEach((file) => {
    //     dataToSend.append("files", file);
    //   });
    // }

    uploadedFiles.forEach((file) => {
      if (file.file) {
        dataToSend.append("files", file.file);
      }
    });

    dataToSend.append("notified_user", JSON.stringify(selectedUsers || []));

    // console.log(dataToSend);

    try {
      setIsLoading(true);
      const response = await createShareBox(client_ID, dataToSend);
      setIsLoading(false);
      if (response.status === 201) {
        toast.success("ShareBox created successfully.");
        handlecloseAddClosed();
      } else {
        setError(
          "We couldn’t able to create ShareBox right now. Please check your connection and try again."
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating ShareBox:", error);
      setError("Failed to create ShareBox. Please try again.");
    }
  };

  // console.log("file log =>",uploadedFiles);

  return (
    <>
      <div className="d-flex flex-wrap flex-lg-nowrap">
        {/* Sidebar */}

        {/* Main Content */}
        <div className="container-fluid my-4 px-4">
          <Card className="p-4 shadow-lg border-0">
            <h2 className="text-center mb-4" style={{ color: "#333" }}>
              Create Book
            </h2>
            <form onSubmit={handleSubmit}>
              <Accordion
                defaultActiveKey="0"
                className="mb-4"
                id="section-title"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <h5 className="modal-title w-100 font-weight-bold text-black required">
                      Title
                    </h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className={!formData.title ? "editor-error" : ""}>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="p-2 form-control mb-2 fs-8"
                        placeholder="Title"
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <Accordion
                defaultActiveKey="0"
                className="card card-flush accordionCard"
                id="share-box-description"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <h5 className="modal-title  w-100 font-weight-bold text-black required">
                      Share Box Description
                    </h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div
                      className={!formData.description ? "editor-error" : ""}
                    >
                      <CKEditor
                        editor={ClassicEditor}
                        data={formData.description}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setFormData((prevData) => ({
                            ...prevData,
                            description: data,
                          }));
                        }}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <Accordion
                defaultActiveKey="0"
                className="card card-flush accordionCard"
                id="book-outline"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <h5 className="modal-title w-100 font-weight-bold text-black">
                      Book Outline
                    </h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div>
                      <label htmlFor="book">Select Book:</label>
                      <select
                        id="book"
                        name="parent_id"
                        value={formData.parent_id}
                        onChange={handleChange}
                        className="form-select p-2 w-50"
                      >
                        <option value="0">&lt;create a new book&gt;</option>
                        {shareOption.map((option) => (
                          <option
                            key={option.sharebox_id}
                            value={option.sharebox_id}
                          >
                            {option.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <File
                // ref={fileRef}
                // initialFiles={formData.files}
                // onExistingFilesChange={handleExistingFilesChange}
                onUploadedFilesChange={handleUploadedFilesChange}
                id="section-files"
              />
              {/* this is notification */}
              <Notification
                selectedUsers={selectedUsers}
                onSelectedUsersChange={handleSelectedUsers}
                id="section-notification"
              />
              <Accordion
                defaultActiveKey="0"
                className="mb-4"
                id="section-keyword"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <h5 className="modal-title w-100 font-weight-bold text-black">
                      Keywords
                    </h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="">
                      <input
                        type="text"
                        id="keyword"
                        name="keyword"
                        value={formData.keyword}
                        onChange={handleChange}
                        className="p-2 form-control mb-2 fs-8"
                        placeholder="keyword"
                        title="Enter tags related to your post."
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <Accordion
                defaultActiveKey="0"
                className="mb-4 pt-2"
                id="privacy"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <h5 className="modal-title w-100 font-weight-bold text-black">
                      Privacy
                    </h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="text-muted mb-0">
                      A post of this type is <strong>private</strong>. Only
                      members of this group will be able to see it.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <button
                type="submit"
                className="btn btn-sm text-black fw-bold "
                style={{ backgroundColor: "#4fc9da" }}
              >
                Submit
              </button>{" "}
              &nbsp;
              <button
                onClick={handlecloseAddClosed}
                className="btn btn-sm text-black fw-bold "
                style={{ backgroundColor: "#4fc9da" }}
              >
                Cancel
              </button>
            </form>
          </Card>
        </div>

        <div className="pt-4 sider-navbar">
          <nav className="sidebar pt-6" style={{ minWidth: "250px" }}>
            <ul className="nav flex-column sticky-top">
              {/* Title Section */}
              <li className="nav-item mb-3">
                <a
                  className="nav-link text-primary d-flex align-items-center"
                  href="#section-title"
                >
                  <i className="fas fa-book me-2"></i>
                  <b>Title</b>
                </a>
              </li>

              {/* Share Box Description */}
              <li className="nav-item mb-3">
                <a
                  className="nav-link text-primary d-flex align-items-center"
                  href="#share-box-description"
                >
                  <i className="fas fa-pen-alt me-2"></i>
                  <b>Share Box Description</b>
                </a>
              </li>

              {/* Book Outline */}
              <li className="nav-item mb-3">
                <a
                  className="nav-link text-primary d-flex align-items-center"
                  href="#book-outline"
                >
                  <i className="fas fa-list-alt me-2"></i>
                  <b>Book Outline</b>
                </a>
              </li>

              {/* Files */}
              <li className="nav-item mb-3">
                <a
                  className="nav-link text-primary d-flex align-items-center"
                  href="#section-body"
                >
                  <i className="fas fa-folder-open me-2"></i>
                  <b>Files</b>
                </a>
              </li>

              {/* Notifications */}
              <li className="nav-item mb-3">
                <a
                  className="nav-link text-primary d-flex align-items-center"
                  href="#section-notification"
                >
                  <i className="fas fa-bell me-2"></i>
                  <b>Notifications</b>
                </a>
              </li>

              {/* Keywords */}
              <li className="nav-item mb-3">
                <a
                  className="nav-link text-primary d-flex align-items-center"
                  href="#section-keyword"
                >
                  <i className="fas fa-tags me-2"></i>
                  <b>Keywords</b>
                </a>
              </li>

              {/* Privacy */}
              <li className="nav-item mb-3">
                <a
                  className="nav-link text-primary d-flex align-items-center"
                  href="#privacy"
                >
                  <i className="fas fa-lock me-2"></i>
                  <b>Privacy</b>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <Toaster />
    </>
  );
};
