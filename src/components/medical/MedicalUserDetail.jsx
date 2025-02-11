import React, { useState } from 'react'
import { Modal, Button } from "react-bootstrap";

export const MedicalUserDetail = () => {
    const [formData, setFormData] = useState({
        specialAttention: "",
        providerType: "MR",
        startDate: "",
        endDate: "",
        usePresentDate: false,
        getAllRecords: false,
    });

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    //   const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(formData); 
    //   };

    // this is for model 
    // const handleSave = async () => {
    //     alert("you are working")
    // };


    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            alert("No files selected!");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("files[]", file);
        });

        try {
            const response = await fetch("YOUR_API_ENDPOINT_URL", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                // console.log("File uploaded successfully:", data);
                alert("File uploaded successfully");
            } else {
                console.error("Upload failed:", response.statusText);
                alert("Upload failed, please try again.");
            }
        } catch (error) {
            console.error("Error during file upload:", error);
            alert("Error uploading file. Please try again.");
        }
    };


    const handleRemoveFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleAddMore = () => {
        document.getElementById("fileInput").click();
    };


    return (
        <>
            <div className="mb-3">
                <label className="form-label">Name:</label>
                <p>{"dummy name"}</p>
            </div>

            <div>
                <label className="form-label">Address:</label>
                <p>{"dummy address"}</p>
            </div>

            <div>
                <label className="form-label">City:</label>
                <p>{"dummy city"}</p>
            </div>

            <div>
                <label className="form-label">State:</label>
                <p>{"dummy state"}</p>
            </div>

            <div>
                <label className="form-label">Zip:</label>
                <p>{"dummy zip"}</p>
            </div>

            <div>
                <label className="form-label">Phone:</label>
                <p>{"dummy phone"}</p>
            </div>

            <div>
                <label className="form-label">Fax:</label>
                <p>{"dummy fax"}</p>
            </div>


            <div className="mb-3">
                <label className="form-label">Special Attention:</label>
                <textarea
                    name="specialAttention"
                    value={formData.specialAttention}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                ></textarea>
            </div>

            <div>
                <label className="form-label">Provider Type:</label>
                <div className="form-check form-check-custom form-check-solid me-10">
                    <input
                        className="form-check-input h-15px w-15px"
                        type="radio"
                        name="providerType"
                        value="MR"
                        checked={formData.providerType === "MR"}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="providerType">MR</label>
                </div>

                <div className="form-check form-check-custom form-check-solid mb-2">
                    <input
                        className="form-check-input h-15px w-15px"
                        type="radio"
                        name="providerType"
                        value="BR"
                        checked={formData.providerType === "BR"}
                        onChange={handleChange}
                        id="providerTypeBR"
                    />
                    <label className="form-check-label" htmlFor="providerTypeBR">BR</label>
                </div>
                <div className="form-check form-check-custom form-check-solid mb-2">
                    <input
                        className="form-check-input h-15px w-15px"
                        type="radio"
                        name="providerType"
                        value="MR & BR"
                        checked={formData.providerType === "MR & BR"}
                        onChange={handleChange}
                        id="providerTypeMRBR"
                    />
                    <label className="form-check-label" htmlFor="providerTypeMRBR">MR & BR</label>
                </div>
                <div className="form-check form-check-custom form-check-solid mb-2">
                    <input
                        className="form-check-input h-15px w-15px"
                        type="radio"
                        name="providerType"
                        value="Others"
                        checked={formData.providerType === "Others"}
                        onChange={handleChange}
                        id="providerTypeOthers"
                    />
                    <label className="form-check-label" htmlFor="providerTypeOthers">Others</label>
                </div>

            </div >

            <div>
                <label className="form-label">Date Range of Records:</label>
                <div className="mb-2">
                    <label className="form-label">Start Date:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">End Date:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-check form-check-custom form-check-solid mb-2">
                    <input
                        className="form-check-input h-20px w-20px"
                        type="checkbox"
                        name="usePresentDate"
                        checked={formData.usePresentDate}
                        onChange={handleChange}
                        id="usePresentDate"
                    />
                    <label className="form-check-label" htmlFor="usePresentDate">
                        Use Present Date as ending date
                    </label>
                </div>

                <div className="form-check form-check-custom form-check-solid mb-4">
                    <input
                        className="form-check-input h-20px w-20px"
                        type="checkbox"
                        name="getAllRecords"
                        checked={formData.getAllRecords}
                        onChange={handleChange}
                        id="getAllRecords"
                    />
                    <label className="form-check-label" htmlFor="getAllRecords">
                        Get all records
                    </label>
                </div>

                <button type="button" className="btn btn-primary mb-4" onClick={handleShow}>
                    Manage file(s)
                </button>
                <br />
                <button type="submit" className="btn btn-primary">
                    Save
                </button>
            </div>



            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Manage File(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Upload File:</label>
                        <input
                            type="file"
                            className="form-control"
                            id="fileInput"
                            multiple
                            accept=".pdf,.tif"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        {selectedFiles.length > 0 && (
                            <ul className="list-group mb-3">
                                {selectedFiles.map((file, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        {file.name}
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="mb-3">
                        <small className="text-muted">
                            Please upload only .pdf and .tif extensions
                        </small>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-secondary" onClick={handleAddMore}>
                            Add
                        </button>
                        <button className="btn btn-primary" onClick={handleUpload}>
                            Upload File(s)
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
