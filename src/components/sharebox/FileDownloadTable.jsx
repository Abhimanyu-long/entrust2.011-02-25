
import React, { useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FileLogDetails } from "./FileLogDetails";
import { useAuth } from "../../../context/AuthContext";

const API_URL =import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

const FileDownloadTable = ({ files,shareboxName }) => {


  const { downloadShareBoxFile } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  if (!files || files.length === 0) {
    return <p>No files available</p>;
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFiles(files.map((file) => file.sf_id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleFileSelect = (fileId) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId)
        : [...prevSelected, fileId]
    );
  };

  // This works for single-file download
  const handleSingleDownload = async (fileId) => {
    try {
      // Re-use your existing single-file logic
      const file = files.find((f) => f.sf_id === fileId);
      if (!file || !file.sf_filepath) {
        console.error("Invalid file or file path");
        return;
      }
      const filePath = [file.sf_filepath];
      const fileIds = [fileId];
      await downloadShareBoxFile(filePath, fileIds);
      // console.log("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

 // Download multiple files as a ZIP
 const handleDownloadAsZip = async () => {
  if (selectedFiles.length === 0) {
    alert("Please select at least one file to download.");
    return;
  }

  try {
    const zip = new JSZip();
    const token = sessionStorage.getItem("token");

    for (const fileId of selectedFiles) {
      const file = files.find((f) => f.sf_id === fileId);
      if (!file || !file.sf_filepath) {
        console.error("Invalid file or file path");
        continue;
      }

      // Adjust to your actual API base URL if needed:
      const url = `${API_URL}/sharebox/download?file_path=${encodeURIComponent(
        file.sf_filepath
      )}&file_id=${encodeURIComponent(fileId)}`;

      // Fetch each file as an arraybuffer
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer", // <--- Important
      });

      // Determine a suitable filename
      let fileName = file.sf_filename || `file_${fileId}`;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      // Add the downloaded data directly to JSZip
      zip.file(fileName, response.data);
    }

    // Generate the ZIP blob
    const zipBlob = await zip.generateAsync({ type: "blob" });
    // Download the ZIP file
    saveAs(zipBlob, `${shareboxName}.zip`);
  } catch (error) {
    console.error("Error downloading files:", error);
  }
};

  const handleLogsDetails = (fileId) => {
    setSelectedLog(fileId);
  };

  return (
    <>
      <div className="mt-4">
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover mb-0 bg-light">
            <thead>
              <tr style={{ background: "rgba(177, 220, 228, 0.57)" }}>
                <th className="text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedFiles.length === files.length && files.length > 0
                    }
                  />
                </th>
                <th className="text-center">Filename</th>
                {/* <th className="text-center">Count</th> */}
                <th className="text-center">Last Downloaded</th>
                <th className="text-center">Size</th>
                <th className="text-center">View Log</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.sf_id}>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.sf_id)}
                      onChange={() => handleFileSelect(file.sf_id)}
                    />
                  </td>
                  <td onClick={() => handleSingleDownload(file.sf_id)}>
                    <a href="#">{file.sf_filename}</a>
                  </td>
                  {/* <td className="text-center">{file.sf_count || 2}</td> */}
                  <td className="text-center">
                    {new Date(file.sf_uploaded_on).toLocaleString()}
                  </td>
                  <td className="text-center">
                    {(file.sf_filesize / 1024).toFixed(2)} KB
                  </td>
                  <td className="text-center">
                    <span
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={() => handleLogsDetails(file.sf_id)}
                    >
                      View
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="btn btn-primary mb-0 mt-2"
          onClick={handleDownloadAsZip}
          disabled={selectedFiles.length === 0}
        >
          Download as Zip
        </button>
      </div>

      {selectedLog && (
        <FileLogDetails
          fileId={selectedLog}
          show={!!selectedLog}
          onHide={() => setSelectedLog(null)}
        />
      )}
    </>
  );
};

export default FileDownloadTable;



// prompt will come to when we will open in alert mode
// const handleDownloadAsZip = async () => {
//   if (selectedFiles.length === 0) {
//     alert("Please select at least one file to download.");
//     return;
//   }

//   try {
//     const zip = new JSZip();
//     const token = sessionStorage.getItem("token");

//     for (const fileId of selectedFiles) {
//       const file = files.find((f) => f.sf_id === fileId);
//       if (!file || !file.sf_filepath) {
//         console.error("Invalid file or file path");
//         continue;
//       }

//       const url = `${API_URL}/sharebox/download?file_path=${encodeURIComponent(
//         file.sf_filepath
//       )}&file_id=${encodeURIComponent(fileId)}`;

//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: "arraybuffer",
//       });

//       let fileName = file.sf_filename || `file_${fileId}`;
//       const contentDisposition = response.headers["content-disposition"];
//       if (contentDisposition) {
//         const match = contentDisposition.match(/filename="?(.+)"?/);
//         if (match && match[1]) {
//           fileName = match[1];
//         }
//       }

//       zip.file(fileName, response.data);
//     }

//     const zipBlob = await zip.generateAsync({ type: "blob" });

//     // Prompt the user for a ZIP filename
//     const defaultFileName = "NeuralITfiles.zip";
//     const newFileName = prompt(
//       "Enter a name for the ZIP file (without .zip):",
//       defaultFileName.replace(".zip", "")
//     );

//     // Fallback to the default name if the user cancels or doesn't enter a name
//     const finalFileName = newFileName ? `${newFileName}.zip` : defaultFileName;

//     // Download the ZIP file
//     saveAs(zipBlob, finalFileName);
//   } catch (error) {
//     console.error("Error downloading files:", error);
//   }
// };

//  time 6:01  date 8/01/25
// import React, { useState } from "react";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import { FileLogDetails } from "./FileLogDetails";
// import { useAuth } from "../../../context/AuthContext";

// const FileDownloadTable = ({ files }) => {
//   const { downloadShareBoxFile } = useAuth();
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [selectedLog, setSelectedLog] = useState(null);

//   if (!files || files.length === 0) {
//     return <p>No files available</p>;
//   }

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedFiles(files.map((file) => file.sf_id));
//     } else {
//       setSelectedFiles([]);
//     }
//   };

//   const handleFileSelect = (fileId) => {
//     setSelectedFiles((prevSelected) =>
//       prevSelected.includes(fileId)
//         ? prevSelected.filter((id) => id !== fileId)
//         : [...prevSelected, fileId]
//     );
//   };

//   const handleDownloadAsZip = async () => {
//     if (selectedFiles.length === 0) {
//       alert("Please select at least one file to download.");
//       return;
//     }
  
//     try {
//       // Prepare file paths and file IDs for a single file download, like in the curl example
//       const filePaths = selectedFiles.map((fileId) => {
//         const file = files.find((f) => f.sf_id === fileId);
//         return file?.sf_filepath; // Collect valid file paths
//       });
  
//       const fileIds = selectedFiles; // Use selected file IDs directly
  
//       // Call the download API
//       const responseData = await downloadShareBoxFile(filePaths, fileIds);
  
//       // console.log("Response data =>", responseData);

//     } catch (error) {
//       console.error("Error downloading files:", error);
//     }
//   };

//   const handleLogsDetails = (fileId) => {
//     setSelectedLog(fileId); 
//   };


//   const handleSingleDownload = async (fileId) => {
//     try {
//       // Find the file in the `files` array by its ID
//       const file = files.find((f) => f.sf_id === fileId);
//       if (!file || !file.sf_filepath) {
//         console.error("Invalid file or file path");
//         return;
//       }
  
//       // Prepare file path and file ID for download
//       const filePath = [file.sf_filepath]; // Ensure it's an array
//       const fileIds = [fileId]; // Ensure it's an array
  
//       // Call the download API
//       await downloadShareBoxFile(filePath, fileIds);
  
//       // Optional: Log or handle the result if needed
//       console.log("File downloaded successfully");
//     } catch (error) {
//       console.error("Error downloading file:", error);
//     }
//   };
  

//   return (
//     <>
//       <div className="mt-4">
//         <div className="table-responsive">
//           <table className="table table-bordered border table-striped table-hover mb-0 bg-light">
//             <thead>
//               <tr style={{ background: "rgba(177, 220, 228, 0.57)" }}>
//                 <th className="text-center">
//                   <input
//                     type="checkbox"
//                     onChange={handleSelectAll}
//                     checked={
//                       selectedFiles.length === files.length && files.length > 0
//                     }
//                   />
//                 </th>
//                 <th className="text-center">Filename</th>
//                 <th className="text-center">Count</th>
//                 <th className="text-center">Last Downloaded</th>
//                 <th className="text-center">Size</th>
//                 <th className="text-center">View Log</th>
//               </tr>
//             </thead>
//             <tbody>
//               {files.map((file) => (
//                 <tr key={file.sf_id}>
//                   <td className="text-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedFiles.includes(file.sf_id)}
//                       onChange={() => handleFileSelect(file.sf_id)}
//                     />
//                   </td>
//                   <td onClick={(e)=>handleSingleDownload(file.sf_id)}> <a href="#">{file.sf_filename}</a> </td>
//                   <td className="text-center">{file.sf_count || 2}</td>
//                   <td className="text-center">
//                     {new Date(file.sf_uploaded_on).toLocaleString()}
//                   </td>
//                   <td className="text-center">
//                     {(file.sf_filesize / 1024).toFixed(2)} KB
//                   </td>
//                   <td className="text-center">
//                     <span
//                       style={{ cursor: "pointer", color: "blue" }}
//                       onClick={() => handleLogsDetails(file.sf_id)}
//                     >
//                       View
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <button
//           className="btn btn-primary mb-0 mt-2"
//           onClick={handleDownloadAsZip}
//           disabled={selectedFiles.length === 0}
//         >
//           Download as Zip
//         </button>
//       </div>

//       {selectedLog && (
//         <FileLogDetails
//           fileId={selectedLog}
//           show={!!selectedLog}
//           onHide={() => setSelectedLog(null)}
//         />
//       )}
//     </>
//   );
// };

// export default FileDownloadTable;



// latest 5:12 min  date 8/01/25
 // const handleDownloadAsZip = async () => {
  //   if (selectedFiles.length === 0) {
  //     alert("Please select at least one file to download as zip.");
  //     return;
  //   }

  //   try {
  //     // Prepare file paths and file IDs
  //     const filePaths = selectedFiles.map((fileId) => {
  //       const file = files.find((f) => f.sf_id === fileId);
  //       return file?.sf_filepath; // Collect valid file paths
  //     });

  //     const fileIds = selectedFiles; // Use selected file IDs directly

  //     // Call batch download API
  //     const responseData = await downloadShareBoxFile(filePaths, fileIds);

  //     console.log("i am response => ",responseData);

  //     // Process API response and create ZIP
  //     const zip = new JSZip();
  //     const filePromises = Object.values(responseData.data).map(async (file) => {
  //       if (file.status === 1) {
  //         const fileObj = file.file_obj;

  //         // Fetch the file blob using the file path
  //         const fileResponse = await fetch(fileObj.path);
  //         const blob = await fileResponse.blob();
  //         zip.file(fileObj.filename, blob); // Add file to ZIP
  //       }
  //     });

  //     // Wait for all files to be added to the ZIP
  //     await Promise.all(filePromises);

  //     // Generate and download the ZIP
  //     zip.generateAsync({ type: "blob" }).then((content) => {
  //       saveAs(content, "files.zip");
  //     });
  //   } catch (error) {
  //     console.error("Error creating ZIP:", error);
  //   }
  // };
  {/* <table className="table table-bordered border table-striped table-hover mb-0 bg-light">
          <thead>
            <tr style={{ background: "rgba(177, 220, 228, 0.57)" }}>
              <th className="text-center" style={{ width: "auto" }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedFiles.length === files.length && files.length > 0}
                />
              </th>
              <th className="text-center" style={{ width: "auto" }}>Filename</th>
              <th className="text-center" style={{ width: "auto" }}>Count</th>
              <th className="text-center" style={{ width: "auto" }}>Last Downloaded</th>
              <th className="text-center" style={{ width: "auto" }}>Size</th>
              <th className="text-center" style={{ width: "auto" }}>View Log</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.sf_id}>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.sf_id)}
                    onChange={() => handleFileSelect(file.sf_id)}
                  />
                </td>
                <td>{file.sf_filename}</td>
                <td className="text-center">{file.sf_count || 2}</td>
                <td className="text-center">
                  {new Date(file.sf_uploaded_on).toLocaleString()}
                </td>
                <td className="text-center">
                  {(file.sf_filesize / 1024).toFixed(2)} KB
                </td>
                <td className="text-center">
                  <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handleLogsDetails(file.sf_id)}
                  >
                    View
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}




// latest 1:12 min  date 8/01/25
// import React, { useState } from "react";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import { FileLogDetails } from "./FileLogDetails";

// const FileDownloadTable = ({ files }) => {
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [selectedLog, setSelectedLog] = useState(null);

//   if (!files || files.length === 0) {
//     return <p>No files available</p>;
//   }

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedFiles(files.map((file) => file.sf_id));
//     } else {
//       setSelectedFiles([]);
//     }
//   };

//   const handleFileSelect = (fileId) => {
//     setSelectedFiles((prevSelected) =>
//       prevSelected.includes(fileId)
//         ? prevSelected.filter((id) => id !== fileId)
//         : [...prevSelected, fileId]
//     );
//   };

//   const handleDownloadAsZip = async () => {
//     if (selectedFiles.length === 0) {
//       alert("Please select at least one file to download as zip.");
//       return;
//     }

//     const zip = new JSZip();
//     const filePromises = selectedFiles.map((fileId) => {
//       const file = files.find((f) => f.sf_id === fileId);
//       return fetch(file.sf_filepath)
//         .then((response) => response.blob())
//         .then((blob) => {
//           zip.file(file.sf_filename, blob);
//         });
//     });

//     await Promise.all(filePromises);
//     zip.generateAsync({ type: "blob" }).then((content) => {
//       saveAs(content, "files.zip");
//     });
//   };

//   const handleLogsDetails = (fileId) => {
//     setSelectedLog(fileId); // Pass the file ID directly
//   };

//   return (
//     <>
//     <div className="mt-4">
//       <table className="table table-bordered border table-striped table-hover mb-0 bg-light">
//         <thead>
//           <tr style={{ background: "rgba(177, 220, 228, 0.57)" }}>
//             <th className="text-center" style={{ width: "auto" }}>
//               <input
//                 type="checkbox"
//                 onChange={handleSelectAll}
//                 checked={selectedFiles.length === files.length && files.length > 0}
//               />
//             </th>
//             <th className="text-center" style={{ width: "auto" }}>Filename</th>
//             <th className="text-center" style={{ width: "auto" }}>Count</th>
//             <th className="text-center" style={{ width: "auto" }}>Last Downloaded</th>
//             <th className="text-center" style={{ width: "auto" }}>Size</th>
//             <th className="text-center" style={{ width: "auto" }}>View Log</th>
//           </tr>
//         </thead>
//         <tbody>
//           {files.map((file) => (
//             <tr key={file.sf_id}>
//               <td className="text-center">
//                 <input
//                   type="checkbox"
//                   checked={selectedFiles.includes(file.sf_id)}
//                   onChange={() => handleFileSelect(file.sf_id)}
//                 />
//               </td>
//               <td>{file.sf_filename}</td>
//               <td className="text-center">{file.sf_count || 2}</td>
//               <td className="text-center">
//                 {new Date(file.sf_uploaded_on).toLocaleString()}
//               </td>
//               <td className="text-center">
//                 {(file.sf_filesize / 1024).toFixed(2)} KB
//               </td>
//               <td className="text-center">
//               <span
//                   style={{ cursor: "pointer", color: "blue" }}
//                   onClick={() => handleLogsDetails(file.sf_id)}
//                 >
//                   View
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button
//         className="btn btn-primary mb-0 mt-2"
//         onClick={handleDownloadAsZip}
//         disabled={selectedFiles.length === 0}
//       >
//         Download as Zip
//       </button>

//     </div>

//     {selectedLog && (
//   <FileLogDetails
//     fileId={selectedLog}
//     show={!!selectedLog}
//     onHide={() => setSelectedLog(null)}
//   />
// )}

//     </>
//   );
// };

// export default FileDownloadTable;
