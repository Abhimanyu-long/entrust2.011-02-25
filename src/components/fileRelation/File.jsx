/////////////////

// Please Don't touch

/////////////////

import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import { Accordion } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Utility function to reorder lists
const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result.map((item, idx) => ({ ...item, order: idx + 1 }));
};

// ForwardRef allows the parent component to access child methods via ref
export const File = React.forwardRef(
  (
    { initialFiles = [], onExistingFilesChange, onUploadedFilesChange },
    ref
  ) => {
    // State to manage existing and uploaded files
    const [existingFiles, setExistingFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Initialize existgit config --global user.email "you@example.com"ingFiles from initialFiles prop
    useEffect(() => {
      if (initialFiles.length) {
        const mappedFiles = initialFiles.map((file, index) => ({
          ...file,
          newName: file.sf_filename ?? file.name ?? "Untitled",
          tempName: file.sf_filename ?? file.name ?? "Untitled",
          list: true,
          isEditing: false,
          id:
            file.id ||
            `${
              file.sf_filename ?? file.name ?? "file"
            }-${index}-${Math.random()}`,
          order: file.order || index + 1,
        }));
        setExistingFiles(mappedFiles);
      }
    }, [initialFiles]);

    // Handle file input changes (uploads)
    const handleFileChange = (e) => {
      const newFiles = Array.from(e.target.files);
      if (!newFiles.length) return;

      setUploadedFiles((prev) => {
        const startCount = prev.length;
        const filesToAdd = newFiles.map((fileObj, idx) => ({
          file: fileObj,
          newName: fileObj.name,
          tempName: fileObj.name,
          list: true,
          isEditing: false,
          id: `${fileObj.name}-${fileObj.lastModified}-${Math.random()}`,
          order: startCount + idx + 1,
        }));
        return [...prev, ...filesToAdd].map((f, i) => ({
          ...f,
          order: i + 1,
        }));
      });
    };

    // Toggle file selection
    const toggleFileSelection = (filesArr, setFilesArr, index) => {
      setFilesArr((prev) =>
        prev.map((file, i) =>
          i === index ? { ...file, list: !file.list } : file
        )
      );
    };

    // Initiate rename process
    const handleRenameClick = (filesArr, setFilesArr, index) => {
      setFilesArr((prev) => {
        const updated = [...prev];
        updated[index].isEditing = true;
        return updated;
      });
    };

    // Handle filename changes during editing
    const handleFileNameChange = (filesArr, setFilesArr, index, newName) => {
      setFilesArr((prev) =>
        prev.map((file, i) =>
          i === index ? { ...file, tempName: newName } : file
        )
      );
    };

    // Save the new filename
    // const handleSaveName = (filesArr, setFilesArr, index) => {
    //   setFilesArr((prev) =>
    //     prev.map((file, i) =>
    //       i === index
    //         ? {
    //             ...file,
    //             newName: file.tempName,
    //             isEditing: false,
    //           }
    //         : file
    //     )
    //   );
    // };

    const handleSaveName = (filesArr, setFilesArr, index) => {
      setFilesArr((prev) =>
        prev.map((file, i) => {
          if (i === index) {
            if (!(file.file instanceof Blob)) {
              console.error("Error: file.file is not a Blob", file.file);
              return file;
            }

            // Call the global `File` constructor via `window.File`
            const updatedFile = new window.File([file.file], file.tempName, {
              type: file.file.type,
              lastModified: file.file.lastModified,
            });

            return {
              ...file,
              file: updatedFile,
              newName: file.tempName,
              isEditing: false,
            };
          }
          return file;
        })
      );
    };
    

    // Cancel the rename process
    const handleCancelRename = (filesArr, setFilesArr, index) => {
      setFilesArr((prev) => {
        const updated = [...prev];
        updated[index].tempName = updated[index].newName;
        updated[index].isEditing = false;
        return updated;
      });
    };

    // Delete a file from the list
    const handleDeleteFile = (filesArr, setFilesArr, index) => {
      setFilesArr((prev) => {
        const newArr = prev.filter((_, i) => i !== index);
        return newArr.map((file, idx) => ({ ...file, order: idx + 1 }));
      });
    };

    // Handle drag-and-drop reordering
    const handleDragEnd = (result) => {
      if (!result.destination) return;
      const { source, destination } = result;

      if (source.droppableId === destination.droppableId) {
        if (source.droppableId === "existingFiles") {
          setExistingFiles((prev) =>
            reorder(prev, source.index, destination.index)
          );
        } else if (source.droppableId === "uploadedFiles") {
          setUploadedFiles((prev) =>
            reorder(prev, source.index, destination.index)
          );
        }
      }
    };

    // Expose a method to parent via ref for backward compatibility
    useImperativeHandle(ref, () => ({
      getFiles: () => ({ existingFiles, uploadedFiles }),
    }));

    // Effect to send updated existingFiles to parent via onExistingFilesChange callback
    useEffect(() => {
      if (onExistingFilesChange) {
        // console.log("Existing Files from File Component:", existingFiles); // Controlled Logging
        onExistingFilesChange(existingFiles);
      }
      // eslint-disable-next-liexistingFilesne react-hooks/exhaustive-deps
    }, [existingFiles]);

    // Effect to send updated uploadedFiles to parent via onUploadedFilesChange callback
    useEffect(() => {
      if (onUploadedFilesChange) {
        // console.log("Uploaded Files from File Component:", uploadedFiles); // Controlled Logging
        onUploadedFilesChange(uploadedFiles);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedFiles]);

    // Render the list of files within a Droppable area
    const renderDroppableList = (
      filesArr,
      droppableId,
      setFilesArr,
      sectionTitle
    ) => {
      if (!filesArr.length) return null;
      return (
        <div className="mt-3">
          <h5>{sectionTitle}</h5>
          <Droppable droppableId={droppableId}>
            {(provided) => (
              <ul
                className="list-group"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {filesArr.map((file, index) => (
                  <Draggable key={file.id} draggableId={file.id} index={index}>
                    {(provided) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {/* LEFT: Checkbox + Filename / Rename */}
                        <div className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={file.list}
                            onChange={() =>
                              toggleFileSelection(filesArr, setFilesArr, index)
                            }
                          />

                          {/* Display or edit filename */}
                          {!file.isEditing ? (
                            <>
                              <span>{file.newName}</span>
                              <button
                                type="button" // <-- IMPORTANT!
                                className="btn btn-link btn-sm ms-2"
                                onClick={() =>
                                  handleRenameClick(
                                    filesArr,
                                    setFilesArr,
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
                                value={file.tempName}
                                onChange={(e) =>
                                  handleFileNameChange(
                                    filesArr,
                                    setFilesArr,
                                    index,
                                    e.target.value
                                  )
                                }
                                className="form-control"
                              />
                              <button
                                type="button" // <-- IMPORTANT!
                                className="btn btn-success btn-sm ms-2"
                                onClick={() =>
                                  handleSaveName(filesArr, setFilesArr, index)
                                }
                              >
                                Save
                              </button>
                              <button
                                type="button" // <-- IMPORTANT!
                                className="btn btn-secondary btn-sm ms-2"
                                onClick={() =>
                                  handleCancelRename(
                                    filesArr,
                                    setFilesArr,
                                    index
                                  )
                                }
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>

                        {/* RIGHT: Delete button */}
                        <button
                          type="button" // <-- IMPORTANT!
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDeleteFile(filesArr, setFilesArr, index)
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
        </div>
      );
    };

    console.log("existingFiles= ", existingFiles);
    console.log("uploadedFiles= ", uploadedFiles);

    return (
      <Accordion
        defaultActiveKey="0"
        className="card card-flush accordionCard"
        id="section-files"
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <b className="fs-6 text-black">Files</b>
          </Accordion.Header>
          <Accordion.Body>
            <div className="mb-4">
              <label
                htmlFor="notifyAll"
                className="form-check-label fs-8 text-muted mb-2"
              >
                Changes made to the attachments are not permanent until you save
                this post. The first "listed" file will be included in RSS
                feeds. Files must be smaller than 10 GB and have one of the
                following extensions:
                <strong>
                  {" "}
                  au, avi, bzip2, csv, doc, docx, flv, gif, graffle, gz, htm,
                  html, iso, jpeg, jpg, kml, kmz, mov, mp2, mp3, mp4, odp, ods,
                  odt, pages, patch, pdf, png, pps, ppt, pptx, psd, rar, svg,
                  swf, template, tif, tgz, txt, vsd, wav, wmv, xls, xlsx, zip,
                  7z.
                </strong>
              </label>
              <input
                id="fileInput"
                type="file"
                className="form-control fs-8"
                multiple
                onChange={handleFileChange}
              />
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              {renderDroppableList(
                existingFiles,
                "existingFiles",
                setExistingFiles,
                "Existing Files:"
              )}
              {renderDroppableList(
                uploadedFiles,
                "uploadedFiles",
                setUploadedFiles,
                "Uploaded Files:"
              )}
            </DragDropContext>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
);
