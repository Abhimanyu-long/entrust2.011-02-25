// GenericCases.jsx
import React, { useState, useEffect, useRef } from "react";
import GenericPage from "../genericpage/GenericPage";
import { Button } from "primereact/button";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Toaster, toast } from "react-hot-toast";
import "../../assets/css/genericCases.css";
import { useAuth } from "../../../context/AuthContext";
import { encryptData, decryptData } from "../../components/common/crypto";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
import Notification from "./Notification";
import Loader from "../Loader/Loader";

const GenericCases = () => {
  const { syncSessionStorage, handleDownloadFile } = useAuth();
  const [tabData, setTabData] = useState([]);
  const [caseFiles, setCaseFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedCaseData, setSelectedCaseData] = useState({});
  const [newComment, setNewComment] = useState("");
  const fileUploadRef = useRef(null);
  const [commentError, setCommentError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const { clientId: routeClientId } = useParams();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [closedCases, setClosedCases] = useState([]);
  const closedCasesRef = useRef(null);
  const [tabState, setTabState] = useState("");
  const handleSelectedUsers = (updatedUsers) => {
    setSelectedUsers(updatedUsers);
  };

  const client_data = sessionStorage.getItem("client_data");
  const clientID =
    routeClientId || (client_data && JSON.parse(client_data).client_id);
  const BASE_URL =
    import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;
  const API_URL = BASE_URL;

  const apiClient = axios.create({
    baseURL: API_URL,
  });
  apiClient.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // State to track loaded tabs (optional if using single API call)
  const [loadedTabs, setLoadedTabs] = useState({
    all: false,
    delivered: false,
    wip: false,
    pending: false,
    awaitingfunds: false,
    awaitinginfo: false,
  });

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  useEffect(() => {
    const fetchAllCases = async () => {
      // `${API_URL}/clients/${encryptData(clientId)}/cases`,
      try {
        const response = await apiClient.get(
          `/clients/${encryptData(clientID)}/cases`
        );
        const allCases = response.data || [];

         // Format updated_at for export only
      const formattedCases = allCases.map((caseItem) => ({
        ...caseItem,
        updated_at: caseItem.updated_at ? caseItem.updated_at.split("T")[0] : "",
      }));

        const all = allCases;
        let closedCasesList = all[0]?.closed_parent_cases_id || [];
        setClosedCases((prevState) => {
          return closedCasesList;
        });

        const delivered = allCases.filter(
          (caseItem) =>
            caseItem.status_name?.toLowerCase() === "delivered" ||
            caseItem.status_name?.toLowerCase() === "closed"
        );
        const wip = allCases.filter(
          (caseItem) => caseItem.status_name?.toLowerCase() === "wip"
        );
        const pending = allCases.filter(
          (caseItem) =>
            caseItem.status_name?.toLowerCase() === "on-hold" ||
            caseItem.status_name?.toLowerCase() === "pending"
        );

        const awaitingfunds = allCases.filter(
          (caseItem) => caseItem.status_name?.toLowerCase() === "awaiting fund"
        );

        const awaitinginfo = allCases.filter(
          (caseItem) => caseItem.status_name?.toLowerCase() === "awaiting info"
        );

        setTabData([
          {
            label: "All Cases",
            status: "all",
            data: formattedCases,
            columns: getColumns(),
          },
          {
            label: "Delivered Cases",
            status: "delivered",
            data: delivered,
            columns: getColumns(),
          },
          {
            label: "WIP Cases",
            status: "wip",
            data: wip,
            columns: getColumns(),
          },
          {
            label: "On Hold Cases",
            status: "pending",
            data: pending,
            columns: getColumns(),
          },
          {
            label: "Awaiting Funds",
            status: "awaitingfund",
            data: awaitingfunds,
            columns: getColumns(),
          },
          {
            label: "Awaiting Info",
            status: "awaitinginfo",
            data: awaitinginfo,
            columns: getColumns(),
          },
        ]);

        setLoadedTabs((prev) => ({
          ...prev,
          all: true,
          delivered: true,
          wip: true,
          pending: true,
        }));
      } catch (error) {
        handleError(error, "Error fetching All Cases");
      } finally {
        setIsDataLoaded(true);
      }
    };

    fetchAllCases();
  }, [clientID]);

  useEffect(() => {
    closedCasesRef.current = closedCases;
  }, [closedCases, tabState]);

  const handleError = (error, customMessage) => {
    const message =
      error.response?.data?.message || error.message || customMessage;
    console.error(message);
    toast.error(message);
  };

  // Callback for when a tab is changed (optional if using single API call)
  const handleTabChange = (index, tab) => {
    // Determine status based on tab label
    let status = "";
    const label = tab.label.toLowerCase();
    if (label === "all cases") status = "all";
    else if (label === "delivered cases") status = "delivered";
    else if (label === "wip cases") status = "wip";
    else if (label === "on hold cases") status = "on-hold";
    else if (label === "awaiting funds") status = "awaiting-funds";
    else if (label === "awaiting info") status = "awaiting-info";
    console.log("tab is: ", tab);
    setTabState(tab.status);
    // If the tab's data hasn't been loaded yet, fetch it
    // if (status && !loadedTabs[status]) {
    //   fetchCasesByStatus(status);
    // }
  };

  // Function to handle file selection
  const handleFileSelect = (event, caseId, projectId, rowData) => {
    if (!event.files || event.files.length === 0) {
      toast.error("No files selected.");
      return;
    }
    const files = event.files.map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      name: file.name,
      file,
      order: index + 1,
      list: 0,
      isEditing: false,
    }));
    setCaseFiles((prev) => ({
      ...prev,
      [caseId]: {
        oldFiles: prev[caseId]?.oldFiles || [],
        newFiles: files,
      },
    }));
    setSelectedCaseId(caseId);
    setSelectedProjectId(projectId);
    setSelectedCaseData(rowData);
    setShowModal(true);
  };

  const handleConfirmAndAddComment = () => {
    // Validation for required fields
    const isCommentEmpty = !newComment.trim();
    const isFileEmpty =
      !caseFiles[selectedCaseId]?.newFiles ||
      caseFiles[selectedCaseId].newFiles.length === 0;

    if (isCommentEmpty) {
      setCommentError(true);
      toast.error("Comment cannot be empty.");
      return;
    }

    if (isFileEmpty) {
      setFileError(true);
      toast.error("At least one file must be uploaded.");
      return;
    }

    // Check for cases with 'Closed' or 'Delivered' status
    if (
      selectedCaseData.status_name === "Closed" ||
      selectedCaseData.status_name === "Delivered"
    ) {
      setShowConfirmationDialog(true);
    } else {
      handleAddComment();
    }
  };

  // const handleConfirmAndAddComment = () => {
  //   if (
  //     selectedCaseData.status_name === "Closed" ||
  //     selectedCaseData.status_name === "Delivered"
  //   ) {
  //     setShowConfirmationDialog(true);
  //   } else {
  //     handleAddComment();
  //   }
  // };

  const handleAddComment = async () => {
    console.log("notify users = > ", selectedUsers);

    console.log(
      "Handle add comment contains case data as follows: ",
      selectedCaseData
    );

    setCommentError(false);
    setFileError(false);

    const isCommentEmpty = !newComment.trim();
    const isFileEmpty =
      !caseFiles[selectedCaseId]?.newFiles ||
      caseFiles[selectedCaseId].newFiles.length === 0;
    console.log("isemptycomment value: ", isCommentEmpty);
    console.log("isfileempty value", isFileEmpty);
    if (isCommentEmpty || isFileEmpty) {
      setCommentError(true);
      setFileError(true);
      return;
    }

    try {
      const formData = new FormData();
      if (!isCommentEmpty) {
        formData.append("comment", newComment);
      }

      const selectedFiles = caseFiles[selectedCaseId]?.newFiles || [];
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i].file);
      }

      formData.append("notified_user", JSON.stringify(selectedUsers || []));

      const fileMetadata = {};
      for (let i = 0; i < selectedFiles.length; i++) {
        fileMetadata[selectedFiles[i].name] = {
          show_in_comment: true,
          order: i + 1,
        };
      }
      formData.append("file_metadata", JSON.stringify(fileMetadata));

      if (
        selectedCaseData.status_name === "Closed" ||
        selectedCaseData.status_name === "Delivered"
      ) {
        console.log("Selected case data is: ", selectedCaseData);

        const data = {
          derived_case_id: selectedCaseData.case_id,
          client_id: clientID,
          project_id: selectedCaseData.project_id,
          params: {
            case_title:
              selectedCaseData.case_title +
              " NITCase-" +
              selectedCaseData.case_id,
            case_sub_title: selectedCaseData.case_sub_title,
            case_body: selectedCaseData.case_body,
          },
        };

        formData.append("child_case_data", JSON.stringify(data));
      }

      console.log("Form data to send is: ", formData);

      await apiClient.post(`/cases/${selectedCaseId}/comments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewComment("");
      setCaseFiles((prev) => ({
        ...prev,
        [selectedCaseId]: {
          oldFiles: [...prev[selectedCaseId].oldFiles, ...selectedFiles],
          newFiles: [],
        },
      }));

      if (fileUploadRef.current) {
        fileUploadRef.current.clear();
      }

      setShowModal(false);
      setCaseFiles({});
      toast.success("Files uploaded successfully");
    } catch (error) {
      handleError(error, "Failed to upload files and comment");
    }
  };

  // Function to handle file name changes
  const handleFileNameChange = (index, newName) => {
    setCaseFiles((prev) => {
      const updated = prev[selectedCaseId].newFiles.map((file, idx) =>
        idx === index ? { ...file, tempName: newName } : file
      );
      return {
        ...prev,
        [selectedCaseId]: {
          ...prev[selectedCaseId],
          newFiles: updated,
        },
      };
    });
  };

  // Function to open the modal displaying uploaded files
  const openModal = async (caseId) => {
    try {
      const response = await apiClient.get(
        `/clients/${encryptData(clientID)}/cases/${encryptData(
          caseId
        )}/get_case_all_files`
      );
      const oldFiles = response.data.files.map((file) => ({
        id: file.file_id,
        name: file.filename,
        filepath: file.filepath,
      }));
      setCaseFiles((prev) => ({
        ...prev,
        [caseId]: {
          oldFiles,
          newFiles: prev[caseId]?.newFiles || [],
        },
      }));
      setSelectedCaseId(caseId);
      setShowFilesModal(true);
    } catch (error) {
      handleError(error, "Error fetching case files");
    }
  };

  // Function to close the uploaded files modal
  const closeFilesModal = () => {
    setSelectedCaseId(null);
    setShowFilesModal(false);
  };

  // const closeModal = () => {
  //   setCaseFiles((prev) => {
  //     if (!selectedCaseId) return prev;
  //     const { oldFiles = [] } = prev[selectedCaseId] || {};
  //     return {
  //       ...prev,
  //       [selectedCaseId]: {
  //         oldFiles,
  //         newFiles: [],
  //       },
  //     };
  //   });
  //   setNewComment(""); // Reset the comment
  //   setSelectedCaseId(null);
  //   setCaseFiles([]);
  //   setShowModal(false);
  //   setCommentError(false);

  //   if (fileUploadRef.current) {
  //     fileUploadRef.current.clear();
  //   }
  // };

  const closeModal = () => {
    setCaseFiles((prev) => {
      console.log("Before update:", prev);

      if (!selectedCaseId || !prev[selectedCaseId]) return prev;

      const oldFiles = prev[selectedCaseId]?.oldFiles || [];
      const newFiles = prev[selectedCaseId]?.newFiles || [];

      console.log("Clearing newFiles for case:", selectedCaseId);

      const updated = {
        ...prev,
        [selectedCaseId]: {
          oldFiles: [...oldFiles],
          newFiles: [],
        },
      };

      console.log("After update:", updated);
      return updated;
    });

    setNewComment("");
    setSelectedCaseId(null);
    setShowModal(false);
    setCommentError(false);

    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  // Function to save the edited file name
  const handleSaveName = (index) => {
    setCaseFiles((prev) => {
      const updated = prev[selectedCaseId].newFiles.map((file, idx) => {
        if (idx === index) {
          const newFile = new File([file.file], file.tempName, {
            type: file.file.type,
          });
          return {
            ...file,
            name: file.tempName,
            file: newFile,
            isEditing: false,
          };
        }
        return file;
      });
      return {
        ...prev,
        [selectedCaseId]: {
          ...prev[selectedCaseId],
          newFiles: updated,
        },
      };
    });
  };

  // Function to remove a file from the upload list
  const removeFile = (index) => {
    setCaseFiles((prev) => {
      const updated = prev[selectedCaseId].newFiles.filter(
        (_, idx) => idx !== index
      );
      return {
        ...prev,
        [selectedCaseId]: {
          ...prev[selectedCaseId],
          newFiles: updated,
        },
      };
    });
  };

  // Function to toggle the edit state for a file name
  const toggleEditFileName = (index) => {
    setCaseFiles((prev) => {
      const updated = prev[selectedCaseId].newFiles.map((file, idx) =>
        idx === index
          ? {
              ...file,
              isEditing: !file.isEditing,
              tempName: file.isEditing ? file.name : file.tempName || file.name,
            }
          : file
      );
      return {
        ...prev,
        [selectedCaseId]: {
          ...prev[selectedCaseId],
          newFiles: updated,
        },
      };
    });
  };

  // Function to handle drag-and-drop reordering of files
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(caseFiles[selectedCaseId].newFiles);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setCaseFiles((prev) => ({
      ...prev,
      [selectedCaseId]: {
        ...prev[selectedCaseId],
        newFiles: reordered,
      },
    }));
  };

  // Function to toggle the checkbox state for a file
  const toggleFileCheckbox = (index) => {
    setCaseFiles((prev) => {
      const updated = prev[selectedCaseId].newFiles.map((file, idx) =>
        idx === index ? { ...file, list: file.list === 0 ? 1 : 0 } : file
      );
      return {
        ...prev,
        [selectedCaseId]: {
          ...prev[selectedCaseId],
          newFiles: updated,
        },
      };
    });
  };

  // Function to render the modal displaying uploaded files
  const renderUploadedFilesModal = () => {
    if (!selectedCaseId || !caseFiles[selectedCaseId]) return null;
    const { oldFiles = [] } = caseFiles[selectedCaseId];

    return (
      <Dialog
        visible={showFilesModal}
        onHide={closeFilesModal}
        header="Uploaded Case Files"
        style={{ width: "50vw" }}
      >
        <ul className="list-group">
          {oldFiles.map((file) => (
            <li
              key={file.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <i className="pi pi-file" style={{ marginRight: "10px" }}></i>
                <span>{file.name}</span>
              </div>

              {/* <a
                href={file.filepath}
                download={file.name}
                className="btn btn-primary btn-sm"
                title="Download File"
              >
                <i className="pi pi-download"></i>
              </a> */}

              <button
                onClick={() => handleDownloadFile(file.filepath, file.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                  padding: 0,
                  font: "inherit",
                }}
              >
                <i className="pi pi-download"></i>
              </button>
            </li>
          ))}
        </ul>
      </Dialog>
    );
  };

  const fileInputRef = useRef();

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      // Append new files to the existing `newFiles`
      setCaseFiles((prev) => {
        const existingFiles = prev[selectedCaseId]?.newFiles || [];
        const updatedFiles = [
          ...existingFiles,
          ...selectedFiles.map((file, index) => ({
            id: `${file.name}-${index}-${Date.now()}`,
            name: file.name,
            file,
            order: existingFiles.length + index + 1,
            list: 0,
            isEditing: false,
          })),
        ];
        return {
          ...prev,
          [selectedCaseId]: {
            ...prev[selectedCaseId],
            newFiles: updatedFiles,
          },
        };
      });

      // Reset the file input value
      event.target.value = "";
    }
  };

  const renderAdditionalUploadedFilesModal = () => {
    if (!selectedCaseId || !caseFiles[selectedCaseId]) return null;
    const { newFiles = [] } = caseFiles[selectedCaseId];

    return (
      <Dialog
        visible={showModal}
        onHide={closeModal}
        header="Manage Uploaded Files"
        style={{ width: "50vw" }}
        footer={
          <div className="d-flex justify-content-end">
            <Button
              label="Upload"
              icon="pi pi-check"
              onClick={handleConfirmAndAddComment}
              className="p-button-success mr-2"
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={closeModal}
              className="p-button-secondary"
            />
          </div>
        }
      >
        <h5 className="text-primary">
          Files to be Uploaded{" "}
          <span style={{ color: "red", fontSize: "12px" }}>*</span>
        </h5>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="files">
            {(provided) => (
              <ul
                className="list-group"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {newFiles.map((file, index) => (
                  <Draggable key={file.id} draggableId={file.id} index={index}>
                    {(provided) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={file.list === 1}
                            onChange={() => toggleFileCheckbox(index)}
                          />
                          {!file.isEditing ? (
                            <>
                              <span>{file.name}</span>
                              <button
                                className="btn btn-link btn-sm ms-2"
                                onClick={() => toggleEditFileName(index)}
                              >
                                Rename
                              </button>
                            </>
                          ) : (
                            <>
                              <input
                                type="text"
                                value={file.tempName || file.name}
                                onChange={(e) =>
                                  handleFileNameChange(index, e.target.value)
                                }
                                className="form-control"
                                style={{ width: "auto" }}
                              />
                              <button
                                className="btn btn-success btn-sm ms-2"
                                onClick={() => handleSaveName(index)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm ms-2"
                                onClick={() => toggleEditFileName(index)}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                        <button
                          className="btn btn-danger btn-sm fs-4"
                          onClick={() => removeFile(index)}
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

        {/* Button to upload more files */}
        <div className="mt-3">
          <Button
            label="Upload More Files"
            icon="pi pi-upload"
            className="p-button-info"
            onClick={handleFileInputClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <div className="mt-4">
          <h5 className="text-primary">
            Add a Comment{" "}
            <span style={{ color: "red", fontSize: "12px" }}>*</span>
          </h5>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="form-control"
            rows="3"
            placeholder="Enter your comment here..."
          ></textarea>
        </div>
        <br />
        <Notification
          selectedUsers={selectedUsers}
          onSelectedUsersChange={handleSelectedUsers}
        />
      </Dialog>
    );
  };

  const renderConfirmationDialog = () => {
    return (
      <Dialog
        visible={showConfirmationDialog}
        onHide={() => setShowConfirmationDialog(false)}
        header="Confirmation Required"
        style={{ width: "30vw" }}
        footer={
          <div className="d-flex justify-content-end">
            <Button
              label="Yes"
              icon="pi pi-check"
              className="p-button-success mr-2"
              onClick={() => {
                setShowConfirmationDialog(false);
                handleAddComment();
              }}
            />
            <Button
              label="No"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => {
                setShowConfirmationDialog(false);

                if (fileUploadRef.current) {
                  fileUploadRef.current.clear();
                }
                closeModal;
                setNewComment("");
                setCommentError(false);
                setFileError(false);
                setShowModal(false);
                setCaseFiles({});
              }}
            />
          </div>
        }
      >
        <p>
          This case is either <strong>Delivered</strong> or{" "}
          <strong>Closed</strong>. Adding a new comment or files will create a
          new case, which will include all the data from the original case. Do
          you wish to proceed?
        </p>
      </Dialog>
    );
  };

  // Function to render the file upload button and view files button
  const fileUploadTemplate = (rowData) => (
    <div className="d-flex align-items-center">
      <FileUpload
        ref={fileUploadRef}
        mode="basic"
        name="files[]"
        auto
        multiple
        accept="*/*"
        customUpload
        disabled={closedCasesRef.current.includes(rowData.case_id)}
        chooseLabel="Upload"
        onSelect={(e) =>
          handleFileSelect(e, rowData.case_id, rowData.project_id, rowData)
        }
        uploadHandler={(e) =>
          handleFileSelect(e, rowData.case_id, rowData.project_id, rowData)
        }
        // working on this
      />
      <Button
        label={`View\u00A0Files`}
        icon="pi pi-eye"
        className="p-button-text ml-2 mx-2"
        // style={{ background: "#4fc9da" }}
        onClick={() => openModal(rowData.case_id)}
      />
    </div>
  );

  // Function to define the columns for the DataTable
  const getColumns = () => [
    {
      field: "project_name",
      bodyStyle: {
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      header: "Project",
      headerStyle: { textAlign: "center" }, // Center-align header

      sortable: true,
      filter: true,
      body: (rowData) => (
        // <Link
        //   to={`/myprojects/${rowData.project_id}`}
        //   // to={`/myprojects/${encryptData(rowData.project_id)}`}
        //   className="text-black text-center mx-3 customHover"
        //   style={{ textDecoration: 'none' }}
        //   onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
        //   onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        // >
        //   {rowData.project_name}
        // </Link>
        <Link
          to={`/myprojects/${rowData.project_id}`}
          className="text-black customHover"
          style={{ textDecoration: "none", color: "black" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
            e.currentTarget.style.color = "blue";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
            e.currentTarget.style.color = "black";
          }}
        >
          {rowData.project_name}
        </Link>
      ),
    },
    // {
    //   field: "case_id",
    //   header: "Case ID",
    //   sortable: true,
    //   filter: false,
    //   body: (rowData) => (
    //     <Link
    //       to={`/allclients/client/${clientID}/case/${rowData.case_id}`}
    //       className="text-decoration-none text-info text-center mx-3"
    //     >
    //       {rowData.case_id}
    //     </Link>
    //   ),
    // },
    {
      field: "case_id",
      header: "Case\u00A0ID",
      sortable: true,
      filter: false,
      headerStyle: { textAlign: "center" }, // Center-align header
      body: (rowData) => {
        // console.log("clientID", VITE_SECRET_KEY);
        // const encryptedClientID = encryptData(clientID, VITE_SECRET_KEY); // Renamed variable
        // const encryptedCaseID = encryptData(rowData.case_id, VITE_SECRET_KEY); // Renamed variable
        return (
          <Link
            to={`/allclients/client/${clientID}/case/${rowData.case_id}`}
            className="text-black customHover"
            style={{ textDecoration: "none" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
              e.currentTarget.style.color = "blue";
            }}
            onMouseLeave={(e) =>
              (e.currentTarget.style.textDecoration = "none")
            }
          >
            {rowData.case_id}
          </Link>
        );
      },
    },
    {
      field: "case_title",
      header: "Title",
      bodyStyle: { textAlign: "center" }, // Center-align column data
      headerStyle: { textAlign: "center" }, // Center-align header
      sortable: true,
      filter: true,
      filterType: "text",
      body: (rowData) => {
        // console.log("clientID", VITE_SECRET_KEY);
        // const encryptedClientID = encryptData(clientID, VITE_SECRET_KEY); // Renamed variable
        // const encryptedCaseID = encryptData(rowData.case_id, VITE_SECRET_KEY); // Renamed variable
        return (
          <Link
            to={`/allclients/client/${clientID}/case/${rowData.case_id}`}
            className="text-black customHover"
            style={{ textDecoration: "none" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.textDecoration = "none")
            }
          >
            {rowData.case_title}
          </Link>
        );
      },
    },
    {
      field: "due_date",
      header: "Due\u00A0Date",
      sortable: true,
      filter: false,
      headerStyle: { textAlign: "center" }, // Center-align header
      body: (rowData) =>
        rowData.due_date
          ? new Date(rowData.due_date).toLocaleDateString()
          : "N/A",
    },
    {
      field: "date_delivered",
      header: "Date\u00A0Delivered",
      sortable: true,
      filter: false,
      body: (rowData) =>
        rowData.date_delivered
          ? new Date(rowData.date_delivered).toLocaleDateString()
          : "N/A",
    },
    {
      field: "created_at",
      header: "Creation\u00A0Date",
      bodyStyle: { textAlign: "center" }, // Center-align column data
      sortable: true,
      filter: false,
      body: (rowData) =>
        rowData.created_at
          ? new Date(rowData.created_at).toLocaleDateString()
          : "N/A",
    },
    {
      field: "status_name",
      header: "Status",
      headerStyle: { textAlign: "center" }, // Center-align header
      sortable: true,
      filter: false,
    },
    {
      header: "Actions",
      headerStyle: { textAlign: "center" }, // Center-align header
      body: fileUploadTemplate,
    },
  ];

  const date = new Date();
  const latestDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  // Time components (12-hour format)
let hours = date.getHours();
const period = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
const formattedHours = String(hours).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');

// Combine date and time
const latestDateTime = `${formattedHours}-${minutes} ${period}`;
  
  return isDataLoaded ? (
    <>
      <GenericPage
        tabs={tabData}
        showPagination={true}
        showExportButton={true}
        globalSearchFields={[
          "case_id",
          "case_title",
          "status_name",
          "priority_name",
          "project_name",
        ]}
        searchPlaceholder="Search by Case ID, Title, Case Status..."
        tableName="Case Details"
          enableColumnFilters={true}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onTabChange={handleTabChange}
        /** NEW: Customize Excel export columns & order */
        exportOptions={{
          // EXACT columns & order you want in the Excel
          columns: [
            { field: "project_name", header: "Project" },
            { field: "created_by_username", header: "Created By" },
            { field: "created_at", header: "Created Date" },
            { field: "case_id", header: "Case ID" },
            { field: "case_title", header: "Title" },
            { field: "case_sub_title", header: "Sub Title" },
            { field: "file_hash", header: "File #" },
            { field: "page_count", header: "Page Count" },
            { field: "free_case", header: "Free Case" },
            { field: "time_estimate", header: "Time Estimate" },
            { field: "estimate_finalized", header: "Estimate Finalized" },
            { field: "assigned_user", header: "Assigned" },
            { field: "status_name", header: "Status" },
            { field: "due_date", header: "Due Date" },
            { field: "updated_at", header: "Last Updated" },
            { field: "last_comment", header: "Last Comment" },
            // { field: "case_type", header: "Case Type" },
            // { field: "priority_name", header: "Priority" },
            // { field: "case_additional", header: "Case Additional" },
          ],
          // (Optional) Provide a custom file name instead of "Case Details.xlsx"
          fileName: `Cases ${latestDate}_${latestDateTime}`,

          // (Optional) You could add XLSX styling to all cells:
          // styles: {
          //   font: { name: "Arial", sz: 12, bold: false },
          //   alignment: { horizontal: "center", vertical: "center" }
          // },

          // (Optional) You could also transform data rows before writing:
          // customTransform: (rows) => rows.map((r) => {
          //   // Example: Prefix case_id with "CT-"
          //   if (r["Case ID"]) {
          //     r["Case ID"] = `CT-${r["Case ID"]}`;
          //   }
          //   return r;
          // }),
        }}
      />
      {renderAdditionalUploadedFilesModal()}
      {renderUploadedFilesModal()}
      {renderConfirmationDialog()}
      <Toaster />
    </>
  ) : (
    <Loader />
  );
};

export default GenericCases;
