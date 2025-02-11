// EditShareBox.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Accordion, Card } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Notification from "../casetracker/Notification";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";

// Import the File component
import { File } from "../fileRelation/File";

export const EditShareBox = ({ shareboxData, handlecloseEditClosed }) => {
  const { updateShareBox, getShareNoteBook } = useAuth();

  // console.log("shareboxData==>", shareboxData);

  const ShareBoxID = shareboxData?.s_id;

  // Reference to our child File component (for backward compatibility)
  const fileRef = useRef();

  // State to store files received from the child component via callbacks
  const [existingFiles, setExistingFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // console.log(shareboxData?.s_parent_id);

  // Local form data
  const [formData, setFormData] = useState({
    title: shareboxData?.s_title || "",
    description: shareboxData?.s_body || "",
    parent_id: shareboxData?.s_parent_id || "0",
    files: Array.isArray(shareboxData?.files) ? shareboxData.files : [],
    notified_user: shareboxData?.notified_user || [],
    keywords: Array.isArray(shareboxData?.keywords)
      ? shareboxData.keywords.join(", ")
      : shareboxData?.keywords || "",
  });

  const [shareOption, setShareOption] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(formData.notified_user);

  const client = JSON.parse(sessionStorage.getItem("client_data"));
  const client_ID = client?.client_id;

  // Notification child -> parent
  const handleSelectedUsers = (users) => {
    setSelectedUsers(users);
    setFormData((prev) => ({
      ...prev,
      notified_user: users,
    }));
  };

  // Fetch outline (notebooks)
  useEffect(() => {
    const fetchShareBoxDetail = async () => {
      try {
        const response = await getShareNoteBook(client_ID);
        if (response.status === 1) {
          const combinedOptions = [
            ...response.message,
            ...response.default_projects.map((project) => ({
              sharebox_id: project.project_id,
              title: project.project_title,
              parent_id: 0,
            })),
          ];
          setShareOption(combinedOptions);

          // setShareOption(response.message);
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

  // Handle text changes in form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Memoized callback to handle existingFiles from child component
  const handleExistingFilesChange = useCallback((files) => {
    setExistingFiles(files);
  }, []);

  // Memoized callback to handle uploadedFiles from child component
  const handleUploadedFilesChange = useCallback((files) => {
    setUploadedFiles(files);
  }, []);

  // for nested child remove function
  function filterSharebox(data, excludeParentId) {
    const childMap = {};
    // Build a mapping of parent_id to child sharebox_ids
    data.forEach((item) => {
      if (!childMap[item.parent_id]) {
        childMap[item.parent_id] = [];
      }
      childMap[item.parent_id].push(item.sharebox_id);
    });

    // Recursive function to gather all descendants
    function getAllDescendants(parentId) {
      const descendants = [];
      if (childMap[parentId]) {
        for (const childId of childMap[parentId]) {
          descendants.push(childId);
          descendants.push(...getAllDescendants(childId));
        }
      }
      return descendants;
    }

    // Gather all excluded IDs (descendants + parent itself)
    const excludedIds = new Set(getAllDescendants(excludeParentId));
    excludedIds.add(excludeParentId);

    // Filter out excluded IDs  // Previous logic
    // return data.filter((item) => !excludedIds.has(item.sharebox_id));

    // Filter out excluded IDs and items with s_project_id > 0   // aaditya told  after that logic
    return data.filter(
      (item) => !excludedIds.has(item.sharebox_id) && item.s_project_id <= 0
    );
  }

  const filteredOptions = filterSharebox(shareOption, shareboxData.s_id);

  // --------
  // SUBMIT
  // --------
  const handleEditSubmit = async (e) => {
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

    // Retrieve existingFiles and uploadedFiles from state
    // console.log("Existing Files in EditShareBox:", existingFiles);
    // console.log("Uploaded Files in EditShareBox:", uploadedFiles);

    const keywordList = formData.keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword);

    // Build form data
    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("description", formData.description || null);

    // Add `s_project_id` or `parent_id` based on type
    if (isNaN(formData.parent_id)) {
      dataToSend.append("s_project_id", formData.parent_id); // Add string
    } else {
      dataToSend.append("parent_id", formData.parent_id); // Add integer
    }
    // dataToSend.append("book_outline", formData.parent_id);

    dataToSend.append("keywords", JSON.stringify(keywordList));

    // Convert array of user IDs (selectedUsers) to JSON
    dataToSend.append("notified_user", JSON.stringify(selectedUsers || []));

    // Append all existing files metadata to FormData if needed
    //  existingFiles.forEach((file) => {
    //    dataToSend.append("exists_files", JSON.stringify(file));
    //  });

    // dataToSend.append("exists_files",existingFiles);

    // Format existingFiles array to the desired structure
    const formattedExistingFiles = existingFiles.map((file, index) => ({
      id: file.sf_id,
      name: file.newName,
      order: file.sequence,
      list: file.selected ? 0 : 1,
    }));

    // Append formatted existing files as JSON
    dataToSend.append("exists_files", JSON.stringify(formattedExistingFiles));

    // Append all uploaded files to FormData
    uploadedFiles.forEach((file) => {
      if (file.file) {
        dataToSend.append("files", file.file);
      }
    });

    try {
      setIsLoading(true);
      const response = await updateShareBox(client_ID, ShareBoxID, dataToSend);
      // console.log("Response:", response);

      setIsLoading(false);

      if (response.status === 200) {
        toast.success("ShareBox Updated successfully.");
        handlecloseEditClosed();
      } else {
        setError(
          "We couldn’t update the ShareBox right now. Please check your connection and try again."
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating ShareBox:", error);
      setError("An error occurred while updating. Please try again.");
    }
  };

  // Display loader while submitting
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container my-4">
        <Card className="p-4 shadow-lg border-0">
          <h2
            className="mb-4 form-title text-center pt-3"
            style={{ color: "black" }}
          >
            Edit Book Page
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleEditSubmit}>
            {/* Title Section */}
            <Accordion defaultActiveKey="0" className="mb-4" id="section-title">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <b className="required fs-6 text-black">Title</b>
                </Accordion.Header>
                <Accordion.Body>
                  <div className={!formData.title ? "editor-error" : ""}>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      // required
                      className="p-2 form-control mb-2 fs-8"
                      placeholder="Title"
                    />
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {/* Body Section with CKEditor */}
            <Accordion
              defaultActiveKey="0"
              className="card card-flush accordionCard"
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <b className="fs-6 text-black required">
                    Share Box Description
                  </b>
                </Accordion.Header>
                <Accordion.Body>
                  <div className={!formData.description ? "editor-error" : ""}>
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
            {/* Book Outline Section */}
            <Accordion
              defaultActiveKey="0"
              className="card card-flush accordionCard"
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <b className="fs-6 text-black">Book Outline</b>
                </Accordion.Header>
                <Accordion.Body>
                  <select
                    id="book"
                    name="parent_id"
                    value={formData.parent_id}
                    onChange={handleChange}
                    className="form-select p-2 w-50"
                  >
                    <option value="0">&lt;create a new book&gt;</option>
                    {/* {shareOption
                      .filter(
                        (option) =>
                          !shareboxData.heirarchy.some(
                            (item) => item.s_id === option.sharebox_id
                          )
                      )
                      .map((option) => (
                        <option
                          key={option.sharebox_id}
                          value={option.sharebox_id}
                        >
                          {option.title}
                        </option>
                      ))} */}

                    {filteredOptions.map((option) => (
                      <option
                        key={option.sharebox_id}
                        value={option.sharebox_id}
                      >
                        {option.title}
                      </option>
                    ))}
                  </select>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {/* File Attachments Section (Child Component) */}
            <File
              ref={fileRef}
              initialFiles={formData.files}
              onExistingFilesChange={handleExistingFilesChange} // Callback for existingFiles
              onUploadedFilesChange={handleUploadedFilesChange} // Callback for uploadedFiles
            />
            {/* Notifications Section */}
            <Notification
              selectedUsers={selectedUsers}
              onSelectedUsersChange={handleSelectedUsers}
            />
            {/* Keywords Section */}
            <Accordion
              defaultActiveKey="0"
              className="mb-4"
              id="section-keyword"
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <b className="fs-6 text-black">Keywords</b>
                </Accordion.Header>
                <Accordion.Body>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    className="p-2 form-control mb-2 fs-8"
                    placeholder="keywords"
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {/* Privacy Info Section */}
            <Accordion defaultActiveKey="0" className="mb-4 pt-2">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <b className="fs-6 text-black">Privacy</b>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="text-muted mb-0">
                    A post of this type is <strong>private</strong>. Only
                    members of this group will be able to see it.
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {/* Form Buttons */}
            <button
              type="submit" // Changed from onClick to type="submit" for proper form handling
              className="btn btn-sm text-black fw-bold"
              style={{ backgroundColor: "#4fc9da" }}
            >
              Submit
            </button>
            &nbsp;
            <button
              type="button" // Changed to type="button" to prevent form submission
              onClick={handlecloseEditClosed}
              className="btn btn-sm text-black fw-bold"
              style={{ backgroundColor: "#4fc9da" }}
            >
              Cancel
            </button>
          </form>
        </Card>
      </div>

      {/* Toaster for notifications */}
      <Toaster />
    </>
  );
};

// import React, { useEffect, useRef, useState, forwardRef } from "react";
// import { Accordion, Card } from "react-bootstrap";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import Notification from "../casetracker/Notification";
// import { useAuth } from "../../../context/AuthContext";
// import toast, { Toaster } from "react-hot-toast";
// import Loader from "../Loader/Loader";
// import { File } from "../fileRelation/File";

// export const EditShareBox = ({ shareboxData, handlecloseEditClosed }) => {
//   const { updateShareBox, getShareNoteBook } = useAuth();

//   console.log(shareboxData);
//   const ShareBoxID = shareboxData?.s_id;
//   const fileRef = useRef();
//   const [formData, setFormData] = useState({
//     title: shareboxData?.s_title || "",
//     description: shareboxData?.s_body || "",
//     parent_id: shareboxData?.s_parent_id || "0",
//     files: Array.isArray(shareboxData?.files) ? shareboxData.files : [],
//     notified_user: shareboxData?.notified_user || [],
//     keyword: shareboxData?.keywords || "",
//   });

//   const [shareOption, setShareOption] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedUsers, setSelectedUsers] = useState(formData.notified_user);

//   const handleSelectedUsers = (users) => {
//     setSelectedUsers(users);
//     setFormData((prev) => ({
//       ...prev,
//       notified_user: users,
//     }));
//   };
//   const client = JSON.parse(sessionStorage.getItem("client_data"));
//   const client_ID = client?.client_id;
//   useEffect(() => {
//     const fetchShareBoxDetail = async () => {
//       try {
//         const response = await getShareNoteBook(client_ID);
//         if (response.status === 1) {
//           setShareOption(response.message);
//         } else {
//           setError("Failed to fetch notebook data.");
//         }
//       } catch (error) {
//         console.error("Error fetching notebook data:", error);
//         setError("An error occurred while fetching notebook data.");
//       }
//     };

//     if (client_ID) {
//       fetchShareBoxDetail();
//     }
//   }, [getShareNoteBook, client_ID]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // const handleGetFiles = () => {
//   //   const allFiles = fileRef.current.getFiles();
//   //   console.log("Combined Files:", allFiles);
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//    // Retrieve combined files from the File component
//    const allFiles = fileRef.current.getFiles();
//    console.log("Combined Files:", allFiles);

//    const dataToSend = new FormData();
//    dataToSend.append("title", formData.title);
//    dataToSend.append("description", formData.description || null);
//    dataToSend.append("book_outline", formData.parent_id);
//    dataToSend.append("keyword", formData.keyword);
//    dataToSend.append("notified_user", JSON.stringify(selectedUsers || []));

//    // Append all files to FormData
//    allFiles.forEach((file) => {
//      dataToSend.append("files", file.file);
//    });

//    // Debugging: Log FormData contents
//    for (let [key, value] of dataToSend.entries()) {
//      console.log(key, value);
//    }

//     console.log(dataToSend);

//     try {
//       setIsLoading(true);
//       const response = await updateShareBox(client_ID, ShareBoxID, dataToSend);
//       console.log("Response:", response);
//       setIsLoading(false);

//       if (response.status === 201 || 200) {
//         toast.success("ShareBox Updated successfully.");
//         handlecloseEditClosed();
//       } else {
//         setError(
//           "We couldn’t able to update ShareBox right now. Please check your connection and try again."
//         );
//       }
//     } catch (error) {
//       setIsLoading(false);
//       console.error("Error creating ShareBox:", error);
//     }
//   };

//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <>
//       <div className="container my-4">
//         <Card className="p-4 shadow-lg border-0">
//           <h2
//             className="mb-4 form-title text-center pt-3"
//             style={{ color: "black" }}
//           >
//             Edit Book Page
//           </h2>
//           {error && <div className="alert alert-danger">{error}</div>}
//           <form onSubmit={handleSubmit}>
//             <Accordion defaultActiveKey="0" className="mb-4" id="section-title">
//               <Accordion.Item eventKey="0">
//                 <Accordion.Header>
//                   <b className="required fs-6 text-black">Title</b>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <input
//                     type="text"
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     required
//                     className="p-2 form-control mb-2 fs-8"
//                     placeholder="Title"
//                   />
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Accordion>
//             <Accordion
//               defaultActiveKey="0"
//               className="card card-flush accordionCard"
//             >
//               <Accordion.Item eventKey="0">
//                 <Accordion.Header>
//                   <b className="fs-6 text-black">Body</b>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <CKEditor
//                     editor={ClassicEditor}
//                     data={formData.description}
//                     onChange={(event, editor) => {
//                       const data = editor.getData();
//                       setFormData((prevData) => ({
//                         ...prevData,
//                         description: data,
//                       }));
//                     }}
//                   />
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Accordion>
//             <Accordion
//               defaultActiveKey="0"
//               className="card card-flush accordionCard"
//             >
//               <Accordion.Item eventKey="0">
//                 <Accordion.Header>
//                   <b className="fs-6 text-black">Book Outline</b>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <select
//                     id="book"
//                     name="parent_id"
//                     value={formData.parent_id}
//                     onChange={handleChange}
//                     className="form-select p-2 w-50"
//                   >
//                     <option value="0">&lt;create a new book&gt;</option>
//                     {shareOption.map((option) => (
//                       <option
//                         key={option.sharebox_id}
//                         value={option.sharebox_id}
//                       >
//                         {option.title}
//                       </option>
//                     ))}
//                   </select>
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Accordion>

//             {/* file  */}
//             <File ref={fileRef} initialFiles={formData.files} />

//             {/* notification */}
//             <Notification
//               selectedUsers={selectedUsers}
//               onSelectedUsersChange={handleSelectedUsers}
//             />
//             <Accordion
//               defaultActiveKey="0"
//               className="mb-4"
//               id="section-keyword"
//             >
//               <Accordion.Item eventKey="0">
//                 <Accordion.Header>
//                   <b className="fs-6 text-black">Keywords</b>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <div className="">
//                     <input
//                       type="text"
//                       id="keyword"
//                       name="keyword"
//                       value={formData.keyword}
//                       onChange={handleChange}
//                       className="p-2 form-control mb-2 fs-8"
//                       placeholder="keyword"
//                     />
//                   </div>
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Accordion>
//             <Accordion defaultActiveKey="0" className="mb-4 pt-2">
//               <Accordion.Item eventKey="0">
//                 <Accordion.Header>
//                   <b className="fs-6 text-black">Privacy</b>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <p className="text-muted mb-0">
//                     A post of this type is <strong>private</strong>. Only
//                     members of this group will be able to see it.
//                   </p>
//                 </Accordion.Body>
//               </Accordion.Item>
//             </Accordion>
//             <button
//               type="submit"
//               className="btn btn-sm text-black fw-bold"
//               style={{ backgroundColor: "#4fc9da" }}
//             >
//               Submit
//             </button>
//             &nbsp;
//             <button
//               onClick={handlecloseEditClosed}
//               className="btn btn-sm text-black fw-bold"
//               style={{ backgroundColor: "#4fc9da" }}
//             >
//               Cancel
//             </button>
//           </form>
//         </Card>
//       </div>

//       <Toaster />
//     </>
//   );
// };

// Include existing files (optional, if the backend supports it)
// if (formData.files) {
//   formData.files.forEach((file) => {
//     if (file.sf_filepath) {
//       // Existing files, include as metadata
//       dataToSend.append("existing_files[]", JSON.stringify(file));
//     } else {
//       // Newly uploaded files
//       dataToSend.append("files", file);
//     }
//   });
// }

{
  /* <Accordion
              defaultActiveKey="0"
              className="card card-flush accordionCard"
            >
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <b className="fs-6 text-black">
                    Attach files to this book page
                  </b>
                </Accordion.Header>
                <Accordion.Body>
                  <div>
                    <input
                      type="file"
                      id="myfile"
                      name="files"
                      className="form-control fs-8 p-2"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>

                  {formData.files && formData.files.length > 0 && (
                    <div className="mt-2">
                      <h6>Existing Files:</h6>
                      <ul>
                        {formData.files.map((file, index) => (
                          <li
                            key={index}
                            className="d-flex align-items-center mb-2"
                          >
                            <a
                              href={file.sf_filepath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="me-2"
                            >
                              {file.sf_filename}
                            </a>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveFile(index)}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion> */
}
