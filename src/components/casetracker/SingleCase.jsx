import { encryptData } from "../common/crypto";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Accordion from "react-bootstrap/Accordion";
import { EditCase } from "./EditCase";
import "./../../assets/css/case.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import Loader from "../Loader/Loader";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Notification from "./Notification";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

export const SingleCase = () => {
  const { clientId, caseId } = useParams();

  const getRoleIdsFromLocalStorage = () => {
    const roles = JSON.parse(sessionStorage.getItem("roles") || "[]");
    return roles.map((role) => role.role_id);
  };

  const roleIds = getRoleIdsFromLocalStorage();
  const clientSpecificRoleIds =
    import.meta.env.VITE_CLIENT_SPECIFIC_ROLES || "[]";
  const shouldHideComponents = roleIds.some((roleId) =>
    clientSpecificRoleIds.includes(roleId)
  );

  const { getSingleCase, handleDownloadFile } = useAuth();
  const [detailCase, setDetailCase] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedTime, setLoggedTime] = useState(519 * 60 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const [highlightedCommentId, setHighlightedCommentId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentBody, setEditingCommentBody] = useState("");
  const [token, setToken] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [replySelectedFiles, setReplySelectedFiles] = useState([]);
  const [editingSelectedFiles, setEditingSelectedFiles] = useState([]);
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [newFilesToAdd, setNewFilesToAdd] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedFileLog, setSelectedFileLog] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const fileInputRef = useRef(null);

  const handleSelectedUsers = (updatedUsers) => {
    setSelectedUsers(updatedUsers);
  };

  const FILE_BASE_URL = API_URL;

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchCaseDetail = async () => {
      setLoading(true);
      try {
        const caseDetails = await getSingleCase(
          encryptData(clientId),
          encryptData(caseId)
        );
        setDetailCase(caseDetails);
        setDetailCase(caseDetails);
      } catch (error) {
        console.error("Error fetching case details:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseDetail();
  }, [caseId, clientId, getSingleCase]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (highlightedCommentId !== null) {
      const timer = setTimeout(() => {
        setHighlightedCommentId(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [highlightedCommentId]);

  function decodeHtmlEntities(html) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  }

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setLoggedTime((prevLoggedTime) => prevLoggedTime + elapsedTime);
      setElapsedTime(0);
    }
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const generateCaseDetailTable = (
    CaseDetail,
    shouldHideComponents = false
  ) => {
    if (!CaseDetail) {
      return <div>No case data available</div>;
    }

    return (
      <div className="card border rounded mt-2">
        <div className="card-body p-2 shadow-sm border rounded">
          <table className="table table-bordered table-striped table-sm">
            <tbody>
              {Object.entries(CaseDetail).map(([key, value], idx) => {
                if (shouldHideComponents && key === "Estimate Time") {
                  return null;
                }

                let displayValue = value;
                if (key === "Free Case" || key === "POI") {
                  displayValue = value ? "Yes" : "No";
                }

                if (key === "Allocation Status") {
                  const cellClass =
                    displayValue === "Not Allocated"
                      ? "bg-danger"
                      : "bg-warning";
                  return (
                    <tr key={idx}>
                      <td style={{ width: "50%" }}>{key}</td>
                      <td className={cellClass}>
                        {displayValue || "Not Allocated"}
                      </td>
                    </tr>
                  );
                }

                if (displayValue && displayValue.replace("$", "") == "0.00") {
                  return null;
                }

                if (key == "Rate") {
                  key = "Fixed";
                }

                return (
                  <tr key={idx}>
                    <td style={{ width: "50%" }}>
                      {key.replace("Rate", "").trim()}
                    </td>
                    <td>{displayValue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const isImage = (file) => {
    if (!file) return false;
    if (file.filetype) {
      return file.filetype.startsWith("image/");
    }
    if (file.file && file.file.type) {
      return file.file.type.startsWith("image/");
    }
    if (file.type) {
      return file.type.startsWith("image/");
    }
    return false;
  };

  // Convert newly selected files into objects with rename/reorder fields
  const convertFiles = (filesArray) => {
    return filesArray.map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      file,
      name: file.name,
      list: 1,
      isEditing: false,
      tempName: file.name,
    }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validated_files = files.filter(validateFile);

    const newFiles = convertFiles(validated_files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleReplyFileChange = (event, commentId) => {
    const files = convertFiles(Array.from(event.target.files));
    setReplySelectedFiles((prev) => ({
      ...prev,
      [commentId]: [...(prev[commentId] || []), ...files],
    }));
  };

  const handleViewLog = (file) => {
    setSelectedFileLog(file); // Assuming log details are part of the file object
    setShowLogModal(true);
  };

  // const handleNewFilesChange = (event) => {
  //   const files = convertFiles(Array.from(event.target.files));
  //   setNewFilesToAdd((prev) => [...prev, ...files]);
  // };

  useEffect(() => {
    if (!token) return;
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/cases/${caseId}/comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const commentsArray = Array.isArray(response.data) ? response.data : [];
        setComments(commentsArray);
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      }
    };
    fetchComments();
  }, [caseId, token]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please add a comment.");
      return;
    }
    // const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
    // const invalidFiles = selectedFiles.filter(
    //   (file) => !allowedFileTypes.includes(file.file.type)
    // );

    // if (invalidFiles.length > 0) {
    //   toast.error(
    //     `Invalid file type(s) detected: ${invalidFiles
    //       .map((file) => file.name)
    //       .join(", ")}. Only JPEG, PNG, and PDF are allowed.`
    //   );
    //   return;
    // }

    try {
      const formData = new FormData();
      formData.append("comment", newComment);
      const finalFiles = selectedFiles;
      for (let i = 0; i < finalFiles.length; i++) {
        // rename file if changed
        const newFile = new File([finalFiles[i].file], finalFiles[i].name, {
          type: finalFiles[i].file.type,
        });
        formData.append("files", newFile);
      }

      const fileMetadata = {};
      finalFiles.forEach((f, i) => {
        fileMetadata[f.name] = {
          show_in_comment: true,
          order: i + 1,
          list: f.list,
        };
      });
      formData.append("file_metadata", JSON.stringify(fileMetadata));
      formData.append("notified_user", JSON.stringify(selectedUsers || []));
      await axios.post(`${API_URL}/cases/${caseId}/comments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset state after success
      setNewComment("");
      setSelectedFiles([]);
      setSelectedUsers([]);
      toast.success("Comment added successfully!");
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Reset file input
      }
      // Refresh comments
      const commentsResponse = await axios.get(
        `${API_URL}/cases/${caseId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const commentsArray = Array.isArray(commentsResponse.data)
        ? commentsResponse.data
        : [];
      console.log("commentsResponse", commentsResponse);

      setComments(commentsArray);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(
        error.response.data.detail || "Failed to add comment. Please try again."
      );
    }
  };

  const handleEditComment = (commentId) => {
    const comment = comments.find((c) => c.comment_id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditingCommentBody(comment.comment);
      setEditingSelectedFiles(comment.files_attached || []);
      setFilesToRemove([]);
      setNewFilesToAdd([]);
    }
  };

  const handleRemoveFile = (index) => {
    const fileToRemove = editingSelectedFiles[index];
    if (fileToRemove.file_id) {
      setFilesToRemove((prev) => [...prev, fileToRemove.file_id]);
    }
    setEditingSelectedFiles((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  };

  const handleRemoveNewFile = (index) => {
    setNewFilesToAdd((prev) => prev.filter((_, i) => i !== index));
  };

  const submitEditComment = async () => {
    if (!editingCommentBody.trim()) {
      // alert("Comment body cannot be empty.");
      toast.error(error.message || "Comment body cannot be empty.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("comment", editingCommentBody);

      if (filesToRemove.length > 0) {
        formData.append("files_to_remove", JSON.stringify(filesToRemove));
      }

      // Handle renamed/reordered new files
      for (let i = 0; i < newFilesToAdd.length; i++) {
        const fileObj = newFilesToAdd[i];
        const newFile = new File([fileObj.file], fileObj.name, {
          type: fileObj.file.type,
        });
        formData.append("files", newFile);
      }

      const fileMetadata = {};
      newFilesToAdd.forEach((file, index) => {
        fileMetadata[file.name] = {
          show_in_comment: true,
          order: index + 1,
          list: file.list,
        };
      });
      if (newFilesToAdd.length > 0) {
        formData.append("file_metadata", JSON.stringify(fileMetadata));
      }

      const fileData = {};
      newFilesToAdd.forEach((file, index) => {
        fileData[file.name] = {
          show_in_comment: true,
          order: index + 1,
          list: file.list,
        };
      });

      const params = {
        comment: editingCommentBody,
        file_data: fileData,
      };

      formData.append("params", JSON.stringify(params));

      await axios.patch(
        `${API_URL}/cases/${caseId}/comments/${editingCommentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Comment updated successfully!");
      setEditingCommentId(null);
      setEditingCommentBody("");
      setEditingSelectedFiles([]);
      setFilesToRemove([]);
      setNewFilesToAdd([]);

      example();

      const commentsResponse = await axios.get(
        `${API_URL}/cases/${caseId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const commentsArray = Array.isArray(commentsResponse.data)
        ? commentsResponse.data
        : [];
      setComments(commentsArray);
    } catch (error) {
      console.error("Error updating comment:", error.detail);
      toast.error(
        error.detail || "Failed to update comment. Please try again."
      );
    }
  };

  // const handleDeleteComment = async (commentId) => {
  //   try {
  //     await axios.delete(`${API_URL}/cases/${caseId}/comments/${commentId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setComments(comments.filter((c) => c.comment_id !== commentId));
  //   } catch (error) {
  //     console.error("Error deleting comment:", error.message);
  //   }
  // };

  const formatFileSize = (sizeInBytes) => {
    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    let size = sizeInBytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const handleReplyComment = (commentId) => {
    setReplyingCommentId(commentId);
    setReplyContent("");
    setReplySelectedFiles((prevFiles) => ({
      ...prevFiles,
      [commentId]: [],
    }));
  };

  const handleRepliedToClick = (sr_number) => {
    const commentElement = document.getElementById(sr_number);
    if (commentElement) {
      commentElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedCommentId(sr_number);
    }
  };

  const cancelReply = () => {
    setReplyingCommentId(null);
    setReplyContent("");
  };

  function example() {
    setTimeout(function () {}, 10000);
  }

  const handleSubmitReply = async (parentCommentId) => {
    if (!replyContent.trim()) {
      toast.error("Please add a comment to reply.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("comment", replyContent);
      formData.append("reply_to", parentCommentId);

      const finalReplyFiles = replySelectedFiles[parentCommentId] || [];
      for (let i = 0; i < finalReplyFiles.length; i++) {
        const f = finalReplyFiles[i];
        const newFile = new File([f.file], f.name, {
          type: f.file.type,
        });
        formData.append("files", newFile);
      }

      const fileMetadata = {};
      finalReplyFiles.forEach((f, i) => {
        fileMetadata[f.name] = {
          show_in_comment: true,
          order: i + 1,
          list: f.list,
        };
      });
      formData.append("file_metadata", JSON.stringify(fileMetadata));

      await axios.post(`${API_URL}/cases/${caseId}/comments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setReplyContent("");
      setReplySelectedFiles((prevFiles) => ({
        ...prevFiles,
        [parentCommentId]: [],
      }));
      setReplyingCommentId(null);

      example();

      const commentsResponse = await axios.get(
        `${API_URL}/cases/${caseId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const commentsArray = Array.isArray(commentsResponse.data)
        ? commentsResponse.data
        : [];
      setComments(commentsArray);
    } catch (error) {
      console.error("Error adding reply:", error.message);
    }
  };

  const parseDownloadedBy = (downloadedByString) => {
    if (!downloadedByString) return [];
    const entries = downloadedByString.split(",").map((e) => e.trim());
    return entries
      .map((entry) => {
        const match = entry.match(/^(.*?) \((.*?)\)$/);
        if (match && match.length === 3) {
          return { user: match[1], timestamp: match[2] };
        }
        return null;
      })
      .filter(Boolean);
  };

  const findReplyCommentId = (replyId, comments) => {
    const foundComment = comments.find(
      (item) => item.comment_id === Number(replyId)
    );
    if (foundComment) {
      return {
        comment_id: foundComment.comment_id,
        sr_number: foundComment.sr_number,
      };
    } else {
      return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || isNaN(new Date(timestamp))) {
      // Handle null, undefined, or invalid date
      return "NA";
    }
    return new Date(timestamp)
      .toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .replace(",", "");
  };

  // Generic handlers for renaming, toggling checkbox, drag-and-drop reordering
  const handleFileNameChange = (files, setFiles, index, newName) => {
    const file = files[index];
    const validationMessage = validateFileName(newName, file.name);
    if (validationMessage) {
      console.log(validationMessage);
      return;
    }
    const updated = [...files];
    updated[index].tempName = newName;
    setFiles(updated);
  };

  const toggleEditFileName = (files, setFiles, index) => {
    const updated = [...files];
    updated[index].isEditing = !updated[index].isEditing;
    if (!updated[index].isEditing) {
      updated[index].tempName = updated[index].name;
    }
    setFiles(updated);
  };

  const handleSaveName = (files, setFiles, index) => {
    const file = files[index];
    const validationMessage = validateFileName(file.tempName, file.name);
    if (validationMessage) {
      alert(validationMessage);
      return;
    }
    const updated = [...files];
    updated[index].name = updated[index].tempName;
    updated[index].isEditing = false;
    setFiles(updated);
  };

  const removeFileGeneric = (files, setFiles, index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
  };

  const toggleFileCheckbox = (files, setFiles, index) => {
    const updated = [...files];
    updated[index].list = updated[index].list === 1 ? 0 : 1;
    setFiles(updated);
  };

  const handleDragEnd = (result, files, setFiles) => {
    if (!result.destination) return;
    const reordered = Array.from(files);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setFiles(reordered);
  };

  const validateFileName = (fileName, originalFileName) => {
    const trimmedFileName = fileName.trim();
    if (!trimmedFileName) {
      return "File name cannot be empty";
    }

    const fileNameParts = trimmedFileName.split(".");
    if (fileNameParts.length < 2) {
      return "File name must include an extension";
    }

    const originalExtension = originalFileName.split(".").pop();
    const newExtension = fileNameParts.pop();

    if (originalExtension !== newExtension) {
      return "You cannot change the file extension";
    }

    const baseName = fileNameParts.join(".");
    const invalidChars = /[^a-zA-Z0-9-_ ]/;
    if (invalidChars.test(baseName)) {
      return "File name contains invalid characters. Only letters, numbers, spaces, hyphens, and underscores are allowed.";
    }

    return null;
  };

  const renderFileList = (files, setFiles) => {
    return (
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result, files, setFiles)}
      >
        <Droppable droppableId="files">
          {(provided) => (
            <ul
              className="list-unstyled mt-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {files.map((file, index) => (
                <Draggable key={file.id} draggableId={file.id} index={index}>
                  {(provided) => (
                    <li
                      className="d-flex align-items-center mb-3 p-2 border rounded shadow-sm"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="d-flex align-items-center w-100 justify-content-between">
                        <div className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={file.list === 1}
                            onChange={() =>
                              toggleFileCheckbox(files, setFiles, index)
                            }
                          />
                          {isImage(file) ? (
                            <img
                              src={
                                file.file ? URL.createObjectURL(file.file) : ""
                              }
                              alt={file.name}
                              className="img-thumbnail"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                marginRight: "15px",
                              }}
                            />
                          ) : (
                            <i
                              className="bi bi-file-earmark-text"
                              style={{
                                fontSize: "30px",
                                marginRight: "15px",
                              }}
                            ></i>
                          )}
                          {!file.isEditing ? (
                            <>
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "200px" }}
                              >
                                {file.name}
                              </span>
                              <button
                                className="btn btn-link btn-sm ms-2"
                                onClick={() =>
                                  toggleEditFileName(files, setFiles, index)
                                }
                              >
                                Rename
                              </button>
                            </>
                          ) : (
                            <>
                              <input
                                type="text"
                                value={file.tempName}
                                onChange={(e) =>
                                  handleFileNameChange(
                                    files,
                                    setFiles,
                                    index,
                                    e.target.value
                                  )
                                }
                                className="form-control"
                                style={{ width: "auto" }}
                              />
                              <button
                                className="btn btn-success btn-sm ms-2"
                                onClick={() =>
                                  handleSaveName(files, setFiles, index)
                                }
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm ms-2"
                                onClick={() =>
                                  toggleEditFileName(files, setFiles, index)
                                }
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                        <button
                          className="btn btn-danger btn-sm fs-4"
                          onClick={() =>
                            removeFileGeneric(files, setFiles, index)
                          }
                        >
                          &times;
                        </button>
                      </div>

                      {file.error && (
                        <div className="text-danger mt-1">{file.error}</div>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  const renderReplyFileList = (commentId) => {
    const files = replySelectedFiles[commentId] || [];
    const setFiles = (updatedFiles) =>
      setReplySelectedFiles((prev) => ({ ...prev, [commentId]: updatedFiles }));
    return renderFileList(files, setFiles);
  };

  console.log("detailCase-===>", detailCase);
  const MAX_FILE_SIZE_MB = 1000; // Maximum file size in MB
  const ALLOWED_EXTENSIONS = [
    "au",
    "avi",
    "bzip2",
    "csv",
    "doc",
    "docx",
    "flv",
    "gif",
    "graffle",
    "gz",
    "htm",
    "html",
    "iso",
    "jpeg",
    "jpg",
    "kml",
    "kmz",
    "mov",
    "mp2",
    "mp3",
    "mp4",
    "odp",
    "ods",
    "odt",
    "pages",
    "patch",
    "pdf",
    "png",
    "pps",
    "ppt",
    "pptx",
    "psd",
    "rar",
    "svg",
    "swf",
    "template",
    "tif",
    "tgz",
    "txt",
    "vsd",
    "wav",
    "wmv",
    "xls",
    "xlsx",
    "zip",
    "7z",
  ];

  // Function to validate file
  const validateFile = (file) => {
    const fileSizeInMB = file.size / (1024 * 1024);
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      toast.error(
        `${file.name} exceeds the maximum size of ${MAX_FILE_SIZE_MB} MB.`
      );
      document.getElementById("fileUpload").value = "";
      return false;
    }

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      toast.error(
        `${
          file.name
        } has an unsupported file type. Allowed extensions: ${ALLOWED_EXTENSIONS.join(
          ", "
        )}`
      );
      document.getElementById("fileUpload").value = "";
      return false;
    }

    return true;
  };

  // Modified handleFileChange
  // const handleFileChange = (event) => {
  //   const newFiles = Array.from(event.target.files);
  //   const validatedFiles = newFiles.filter(validateFile); // Validate each file

  //   if (validatedFiles.length > 0) {
  //     setSelectedFiles((prevFiles) => [...prevFiles, ...convertFiles(validatedFiles)]);
  //   }
  // };

  // Modified handleReplyFileChange
  // const handleReplyFileChange = (event, commentId) => {
  //   const newFiles = Array.from(event.target.files);
  //   const validatedFiles = newFiles.filter(validateFile); // Validate each file

  //   if (validatedFiles.length > 0) {
  //     setReplySelectedFiles((prevFiles) => ({
  //       ...prevFiles,
  //       [commentId]: [...(prevFiles[commentId] || []), ...convertFiles(validatedFiles)],
  //     }));
  //   }
  // };

  // Modified handleNewFilesChange for editing comments
  const handleNewFilesChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const validatedFiles = newFiles.filter(validateFile); // Validate each file

    if (validatedFiles.length > 0) {
      setNewFilesToAdd((prevFiles) => [
        ...prevFiles,
        ...convertFiles(validatedFiles),
      ]);
    }
  };

  return !loading ? (
    <>
      <div className="project-details">
        {isEditing ? (
          <EditCase clientId={clientId} caseId={caseId} />
        ) : (
          <>
            {detailCase ? (
              <div className="card mb-3 p-3" id="nit_profile_details_view">
                <div
                  className="form-item d-flex align-items-center justify-content-center border rounded "
                  style={{
                    backgroundColor: "#4fc9da",
                    padding: "0.75rem 1rem",
                  }}
                >
                  <h5 className="modal-title text-center w-100 font-weight-bold text-black">
                    Case Details
                  </h5>
                </div>
                <div className=" bg-light ">
                  <div className="container mt-5 p-4 shadow-sm border rounded w-100">
                    <div className="card border rounded mt-2">
                      <div
                        className=" shadow-sm mt-4  row p-3"
                        style={{ display: "flex" }}
                      >
                        <div className="task-details-column col-md-6">
                          <p className="case-title fw-bold">
                            {detailCase.case_title}
                          </p>
                          <p>
                            <strong>{detailCase.status_name}</strong>
                          </p>
                          <p className="fw-bold">{detailCase.project_name}</p>
                        </div>
                        <div className="task-details-column col-md-6">
                          <p>
                            <strong>Due Date: </strong>
                            <span>{formatTimestamp(detailCase.due_date)}</span>
                          </p>
                          <p>
                            <strong>Priority: </strong>
                            <span>{detailCase.priority_name || "NA"}</span>
                          </p>
                          <p>
                            <strong>Creation Date: </strong>
                            <span>
                              {/* {detailCase?.created_at || "NA"} */}
                              {formatTimestamp(detailCase.created_at)}
                            </span>
                          </p>
                          <p>
                            <strong>Date Delivered: </strong>
                            <span>
                              {formatTimestamp(detailCase.date_delivered)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    {generateCaseDetailTable(
                      detailCase.table,
                      shouldHideComponents
                    )}

                    {detailCase.files && detailCase.files.length > 0 && (
                      <Accordion
                        className="card card-flush mt-4 custom-accordion"
                        defaultActiveKey="0"
                      >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <h5 className="modal-title w-100 font-weight-bold text-black">
                              Case Files
                            </h5>
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="card-body p-2 shadow-sm border rounded">
                              <table className="table table-bordered table-striped table-sm">
                                <thead>
                                  <tr>
                                    <th>File ID</th>
                                    <th>File Name</th>
                                    <th>File Size</th>
                                    <th>File Type</th>
                                    <th>Uploaded By</th>
                                    <th>Uploaded On</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detailCase.files.map((file) => (
                                    <tr key={file.file_id}>
                                      <td>{file.file_id}</td>
                                      <td>
                                        <button
                                          onClick={() =>
                                            handleDownloadFile(
                                              file.filepath,
                                              file.file_id
                                            )
                                          }
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
                                          {file.filename}
                                        </button>
                                      </td>
                                      <td>{formatFileSize(file.filesize)}</td>
                                      <td>{file.filetype}</td>
                                      <td>{file.uploaded_by_username}</td>
                                      <td>
                                        {formatTimestamp(file.uploaded_on)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    )}

                    <Accordion
                      className="card card-flush mt-4"
                      defaultActiveKey="0"
                    >
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          <h5 className="modal-title w-100 font-weight-bold text-black">
                            Case Description
                          </h5>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div
                            className="card-text"
                            dangerouslySetInnerHTML={{
                              __html: detailCase?.case_body,
                            }}
                          />
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <div className="mt-5">
                      <Accordion
                        className="card card-flush mt-4"
                        defaultActiveKey="0"
                      >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <h5 className="modal-title w-100 font-weight-bold text-black">
                              Post New Comment
                            </h5>
                          </Accordion.Header>
                          <Accordion.Body>
                            <h5 className="modal-title w-100 font-weight-bold text-black required">
                              Comment
                            </h5>
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
                              data={newComment}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setNewComment(data);
                              }}
                            />
                            <small
                              id="commentHelp"
                              className="form-text text-muted"
                            >
                              Your comment will be visible to others.
                            </small>

                            <div>
                              <div className="mt-3">
                                <label className="form-label fw-bold fs-6 mb-2">
                                  Attach Files:
                                </label>
                                <div className="input-group col-md-5">
                                  <input
                                    type="file"
                                    className="form-control p-2 fs-7 border rounded-start"
                                    id="fileUpload"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    aria-label="File upload"
                                    multiple
                                    style={{ borderRight: "none" }}
                                  />
                                </div>
                                {selectedFiles && selectedFiles.length > 0 && (
                                  <>
                                    {renderFileList(
                                      selectedFiles,
                                      setSelectedFiles
                                    )}
                                  </>
                                )}
                              </div>

                              <div className="mt-3">
                                <Notification
                                  selectedUsers={selectedUsers}
                                  onSelectedUsersChange={handleSelectedUsers}
                                />
                              </div>

                              <div className="text-start mt-3">
                                <button
                                  className="btn btn-sm px-4 py-2 fw-bold text-black"
                                  onClick={handleAddComment}
                                  style={{
                                    backgroundColor: "#4fc9da",
                                    borderRadius: "10px",
                                    cursor:
                                      detailCase?.is_disabled === 1
                                        ? "not-allowed"
                                        : "pointer",
                                  }}
                                  disabled={detailCase?.is_disabled === 1}
                                >
                                  Post Comment
                                </button>
                              </div>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>

                      {showComments && (
                        <div className="comments mt-3">
                          {comments.length > 0 ? (
                            comments.map((comment, index) => (
                              <div
                                key={comment.comment_id}
                                className={`card mb-3 shadow-sm ${
                                  highlightedCommentId === comment.sr_number
                                    ? "highlighted-comment"
                                    : ""
                                }`}
                                id={comment.sr_number}
                                style={{
                                  backgroundColor:
                                    index % 2 === 0
                                      ? "rgb(255, 255, 230)"
                                      : "rgba(177, 220, 228, 0.57)",
                                  borderRadius: "5px",
                                }}
                              >
                                <div
                                  className="p-0 d-flex justify-content-between align-items-center"
                                  style={{
                                    backgroundColor: "#4fc9da",
                                    borderRadius: "10px",
                                    border: "1px solid #4fc9da",
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  <div>
                                    <h5
                                      className="mb-1 text-white m-2"
                                      id={comment.sr_number}
                                    >
                                      Comment #{comment.sr_number}
                                    </h5>
                                    {comment.status_changes && (
                                      <p>
                                        Status:
                                        <span className="text-primary">
                                          {" "}
                                          {
                                            comment.status_changes
                                              .sc_status_old_name
                                          }
                                        </span>
                                        &nbsp;»&nbsp;
                                        <span style={{ color: "blue" }}>
                                          {" "}
                                          {
                                            comment.status_changes
                                              .sc_status_new_name
                                          }
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-end">
                                    <p className="mb-0 small fw-bold text-grey-900 m-2">
                                      {comment.created_by} {""}
                                      {formatTimestamp(comment.created_at)}
                                    </p>
                                  </div>
                                </div>

                                <div className="card-body p-2">
                                  {editingCommentId === comment.comment_id ? (
                                    <>
                                      <CKEditor
                                        editor={ClassicEditor}
                                        data={editingCommentBody}
                                        onChange={(event, editor) => {
                                          const data = editor.getData();
                                          setEditingCommentBody(data);
                                        }}
                                      />

                                      <div className="mt-0">
                                        <h6>Previously Attached Files:</h6>
                                        {editingSelectedFiles.length > 0 ? (
                                          <ul className="list-unstyled">
                                            {editingSelectedFiles.map(
                                              (file, idx) => (
                                                <li
                                                  key={idx}
                                                  className="d-flex align-items-center mb-2"
                                                >
                                                  {isImage(file) ? (
                                                    file.file_path ? (
                                                      <img
                                                        src={`${FILE_BASE_URL}${file.file_path}`}
                                                        alt={file.file_name}
                                                        className="img-thumbnail"
                                                        style={{
                                                          width: "60px",
                                                          height: "60px",
                                                          objectFit: "cover",
                                                          marginRight: "15px",
                                                        }}
                                                      />
                                                    ) : (
                                                      <img
                                                        src={URL.createObjectURL(
                                                          file
                                                        )}
                                                        alt={file.name}
                                                        className="img-thumbnail"
                                                        style={{
                                                          width: "60px",
                                                          height: "60px",
                                                          objectFit: "cover",
                                                          marginRight: "15px",
                                                        }}
                                                      />
                                                    )
                                                  ) : (
                                                    <i
                                                      className="bi bi-file-earmark-text me-2"
                                                      style={{
                                                        fontSize: "30px",
                                                      }}
                                                    ></i>
                                                  )}
                                                  <span
                                                    className="text-truncate"
                                                    style={{
                                                      maxWidth: "200px",
                                                    }}
                                                  >
                                                    {file.file_name ||
                                                      file.name}
                                                  </span>
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger ms-3"
                                                    onClick={() =>
                                                      handleRemoveFile(idx)
                                                    }
                                                  >
                                                    Remove
                                                  </button>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        ) : (
                                          <p className="text-muted">
                                            No files attached.
                                          </p>
                                        )}
                                      </div>

                                      <div className="form-group mt-3">
                                        <label className="form-label fw-bold fs-6 mb-2">
                                          Attach New Files:
                                        </label>
                                        <input
                                          type="file"
                                          className="form-control"
                                          onChange={handleNewFilesChange}
                                          multiple
                                        />
                                        {newFilesToAdd.length > 0 && (
                                          <>
                                            {renderFileList(
                                              newFilesToAdd,
                                              setNewFilesToAdd
                                            )}
                                          </>
                                        )}
                                      </div>

                                      <div className="mt-3 text-end">
                                        <button
                                          className="btn btn-success btn-sm me-2"
                                          onClick={submitEditComment}
                                        >
                                          Save
                                        </button>
                                        <button
                                          className="btn btn-secondary btn-sm"
                                          onClick={() =>
                                            setEditingCommentId(null)
                                          }
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        className="comment-content mb-3"
                                        style={{ lineHeight: "1.5em" }}
                                        dangerouslySetInnerHTML={{
                                          __html: decodeHtmlEntities(comment?.comment),
                                        }}
                                      />
                                        {comment.files_attached &&
                                        comment.files_attached.length > 0 && (
                                          <div className="mt-0">
                                            <h6
                                              className="mb-1 fw-bold text-black"
                                              // style={{ color: "#4fc9da" }}
                                            >
                                              Attachments
                                            </h6>

                                            <table
                                              className="table table-striped table-bordered table-responsive fs-7"
                                              style={{
                                                tableLayout: "fixed",
                                                width: "100%",
                                              }}
                                            >
                                              <thead
                                                style={{
                                                  backgroundColor: "#e9ecef",
                                                }}
                                              >
                                                <tr className="text-center">
                                                  <th
                                                    style={{
                                                      width: "50%",
                                                      whiteSpace: "nowrap",
                                                    }}
                                                  >
                                                    File Name
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "25%",
                                                      whiteSpace: "nowrap",
                                                    }}
                                                  >
                                                    Size
                                                  </th>
                                                  <th
                                                    style={{
                                                      width: "25%",
                                                      whiteSpace: "nowrap",
                                                    }}
                                                  >
                                                    View Log
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {comment.files_attached.map(
                                                  (file, idx) => (
                                                    <tr
                                                      key={idx}
                                                      className="text-center"
                                                    >
                                                      <td
                                                        style={{
                                                          overflow: "hidden",
                                                          textOverflow:
                                                            "ellipsis",
                                                          whiteSpace: "nowrap",
                                                        }}
                                                      >
                                                        <button
                                                          onClick={() =>
                                                            handleDownloadFile(
                                                              file.file_path,
                                                              file.file_id
                                                            )
                                                          }
                                                          style={{
                                                            background: "none",
                                                            border: "none",
                                                            color: "blue",
                                                            textDecoration:
                                                              "underline",
                                                            cursor: "pointer",
                                                            padding: 0,
                                                            font: "inherit",
                                                          }}
                                                        >
                                                          {file.file_name}
                                                        </button>
                                                      </td>
                                                      <td>
                                                        {formatFileSize(
                                                          file.file_size
                                                        )}
                                                      </td>
                                                      <td>
                                                        <a
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                          className="text-primary"
                                                          onClick={() =>
                                                            handleViewLog(file)
                                                          }
                                                        >
                                                          View Log
                                                        </a>
                                                      </td>
                                                    </tr>
                                                  )
                                                )}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}

                                      <div className="d-flex justify-content-between align-items-center mb-0 mt-0">
                                        {comment.reply_to !== null &&
                                          comment.reply_to !== undefined &&
                                          (() => {
                                            const replyDetails =
                                              findReplyCommentId(
                                                comment.reply_to,
                                                comments
                                              );
                                            return replyDetails ? (
                                              <div className="bg-light p-2 rounded d-flex align-items-center">
                                                <button
                                                  className="btn btn-link p-0 text-decoration-underline"
                                                  style={{ color: "#4fc9da" }}
                                                  onClick={() =>
                                                    handleRepliedToClick(
                                                      replyDetails.sr_number
                                                    )
                                                  }
                                                >
                                                  Replied to{" "}
                                                  <b className="text-primary">
                                                    #{replyDetails.sr_number}
                                                  </b>
                                                </button>
                                              </div>
                                            ) : null;
                                          })()}

                                        <div className="ms-auto">
                                          <a
                                            className="me-2 text-primary"
                                            style={{
                                              cursor:
                                                detailCase?.is_disabled === 1
                                                  ? "not-allowed"
                                                  : "pointer",
                                              color: "#003F73",
                                            }}
                                            onClick={() => {
                                              if (
                                                detailCase?.is_disabled !== 1
                                              ) {
                                                handleReplyComment(
                                                  comment.comment_id
                                                );
                                              }
                                            }}
                                            // Prevent default link behavior when disabled
                                            aria-disabled={
                                              detailCase?.is_disabled === 1
                                            }
                                          >
                                            Reply
                                          </a>
                                        </div>
                                      </div>

                                      {replyingCommentId ===
                                        comment.comment_id && (
                                        <div className="reply-form mt-3 p-3 border rounded">
                                          <h6 className="fw-bold required">
                                            Reply to Comment #
                                            {comment.sr_number}
                                          </h6>
                                          <div className="form-group mb-3">
                                            <CKEditor
                                              editor={ClassicEditor}
                                              data={replyContent}
                                              onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setReplyContent(data);
                                              }}
                                            />
                                          </div>

                                          <div className="form-group ">
                                            <label className="form-label fw-bold fs-6 mb-2">
                                              Attach Files:
                                            </label>
                                            <div className="input-group col-md-5">
                                              <input
                                                type="file"
                                                className="form-control p-2 fs-7 border rounded-start"
                                                id={`replyFileUpload-${comment.comment_id}`}
                                                onChange={(e) =>
                                                  handleReplyFileChange(
                                                    e,
                                                    comment.comment_id
                                                  )
                                                }
                                                aria-label="File upload"
                                                multiple
                                                style={{ borderRight: "none" }}
                                              />
                                            </div>
                                            {replySelectedFiles[
                                              comment.comment_id
                                            ] &&
                                              replySelectedFiles[
                                                comment.comment_id
                                              ].length > 0 && (
                                                <>
                                                  {renderReplyFileList(
                                                    comment.comment_id
                                                  )}
                                                </>
                                              )}
                                          </div>

                                          <div>
                                            <Notification
                                              selectedUsers={selectedUsers}
                                              onSelectedUsersChange={
                                                handleSelectedUsers
                                              }
                                            />
                                          </div>

                                          <div className="text-start mt-2">
                                            <button
                                              className="btn btn-sm"
                                              onClick={() =>
                                                handleSubmitReply(
                                                  comment.comment_id
                                                )
                                              }
                                              style={{
                                                backgroundColor: "#4fc9da",
                                                // color: "#fff",
                                              }}
                                            >
                                              <b>Post Reply</b>
                                            </button>
                                            <button
                                              className="btn btn-sm btn-secondary ms-2"
                                              onClick={() => cancelReply()}
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>No comments to display.</p>
                          )}
                        </div>
                      )}

                      <Modal
                        show={showLogModal}
                        onHide={() => setShowLogModal(false)}
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>File Log Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {selectedFileLog ? (
                            <div className="m-3">
                              <div className="mb-3">
                                <p className="mb-1">
                                  <strong>Uploaded By: </strong>{" "}
                                  {selectedFileLog.uploaded_by}
                                </p>
                                <p className="mb-1">
                                  <strong>Uploaded On: </strong>{" "}
                                  {formatTimestamp(selectedFileLog.uploaded_on)}
                                </p>
                              </div>

                              {selectedFileLog.download_count > 0 && (
                                <div className="mt-3">
                                  <table className="table table-bordered table-sm">
                                    <thead className="table-light">
                                      <tr>
                                        <th>Downloaded By</th>
                                        <th>Downloaded On</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {parseDownloadedBy(
                                        selectedFileLog.downloaded_by
                                      ).map((entry, idx) => (
                                        <tr key={idx}>
                                          <td>{entry.user}</td>
                                          <td>
                                            {formatTimestamp(entry.timestamp)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p>No log details available.</p>
                          )}
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => setShowLogModal(false)}
                          >
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
                <p className="lead mb-5">
                  Sorry, the page you're looking for doesn't exist.
                </p>
                <a href="/" className="btn btn-lg btn-primary">
                  Back to Home
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  ) : (
    <Loader />
  );
};

// <label
// className="input-group-text btn p-2 fs-7 rounded-end"
// htmlFor={`replyFileUpload-${comment.comment_id}`}
// style={{
//   backgroundColor: "#4fc9da",
// }}
// >
// Browse
// </label>
