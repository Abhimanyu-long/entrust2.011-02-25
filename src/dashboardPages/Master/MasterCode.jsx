import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Editor } from "@tinymce/tinymce-react";
import Accordion from "react-bootstrap/Accordion";

// import 'bootstrap/dist/css/bootstrap.min.css';
export const MasterCode = () => {
  const { getMasterScreen, updateMasterScreen } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dynamicType, setDynamicType] = useState("contract");
  const [contents, setContents] = useState({});
  const [blocks, setBlocks] = useState([]); // State to manage editor blocks

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMasterScreen(dynamicType);
        if (isMounted) {
          setData(response);
          setBlocks(response.map((item) => item.id)); // Initialize blocks with IDs from fetched data
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dynamicType, getMasterScreen]);

  const handleEditorChange = (content, id) => {
    setContents((prevState) => ({
      ...prevState,
      [id]: content,
    }));
    // console.log("Content updated for editor", id, content);
  };

  const handleSaveChanges = async () => {
    const updatedData = data.map((item) => ({
      id: item.id,
      name: item.name,
      field_type: item.field_type,
      content: contents[item.id] || item.content,
    }));

    try {
      setLoading(true);
      const response = await updateMasterScreen(dynamicType, updatedData);
      // console.log("Update success:", response);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new block
  const addBlock = () => {
    const newId = `new_${blocks.length + 1}`;
    setBlocks([...blocks, newId]);
    setContents((prevState) => ({
      ...prevState,
      [newId]: "", // Initialize the new content as empty
    }));
  };

  // Function to remove a block
  const removeBlock = (id) => {
    setBlocks(blocks.filter((block) => block !== id));
    setContents((prevState) => {
      const { [id]: _, ...rest } = prevState; // Remove content for the deleted block
      return rest;
    });
  };

  // Loader and error handling
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    // <div className="container d-flex flex-column align-items-center my-5">
    //   {blocks.map((id) => (


    //     <Accordion
    //       defaultActiveKey="1"
    //       className="card card-flush accordionCard"
    //       style={{ width: "100%", backgroundColor: "#73d3f2" }}
    //     >
    //       <Accordion.Item eventKey="1">
    //         <Accordion.Header>
    //           <h5 className="card-title text-center mb-2">
    //             Content Block {id}
    //           </h5>
    //         </Accordion.Header>
    //         <Accordion.Body>
    //           <div className="card-body p-2">
    //             <Editor
    //               apiKey="2yspzclcy8ud89wegf45rh94uadtkdlxke1zrdqgv43uijvh"
    //               initialValue={contents[id] || ""}
    //               init={{
    //                 height: 400,
    //                 menubar: false,
    //                 branding: false,
    //                 forced_root_block: false, // Prevent <p> tag insertion
    //                 plugins: [
    //                   "advlist autolink lists link image charmap print preview anchor",
    //                   "searchreplace visualblocks fullscreen",
    //                 ],
    //                 toolbar:
    //                   "undo redo | formatselect | bold italic backcolor | " +
    //                   "alignleft aligncenter alignright alignjustify | " +
    //                   "bullist numlist outdent indent | removeformat | help",
    //               }}
    //               onEditorChange={(content) => handleEditorChange(content, id)}
    //               style={{ display: "block" }}
    //             />
    //             {/* <button
    //               onClick={() => removeBlock(id)}
    //               className="btn btn-danger mt-5"
    //             >
    //               Remove Block
    //             </button>
    //             <button
    //               onClick={() => removeBlock(id)}
    //               className="btn-primary mt-4 px-5 py-3"
    //               style={{
    //                 backgroundColor: "#007bff",
    //                 borderRadius: "50px",
    //                 fontWeight: "bold",
    //                 fontSize: "1.2rem",
    //                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    //                 transition: "background-color 0.3s, transform 0.2s"}}
    //             >
    //               Save
    //             </button> */}
    //           <div className="d-flex justify-content-between mt-5">
    // <button
    //   onClick={() => removeBlock(id)}
    //   className="btn btn-danger"
    //   style={{
    //     // backgroundColor: "#007bff",
     
    //     fontWeight: "bold",
    //     fontSize: "1.2rem",
    //     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    //     transition: "background-color 0.3s, transform 0.2s",
    //   }}
    // >
    //  <b>Remove Block</b> 
    // </button>
    // <button
    //   onClick={() => saveBlock(id)} // Assume you have a saveBlock function
    //   className="btn btn-primary"
    //   style={{
    //     // backgroundColor: "#007bff",
    //    width:"77px",
    //     fontWeight: "bold",
    //     fontSize: "1.2rem",
    //     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    //     transition: "background-color 0.3s, transform 0.2s",
    //   }}
    // >
    //   Save
    // </button>
    //     </div>
    //           </div>
    //         </Accordion.Body>
    //       </Accordion.Item>
    //     </Accordion>



    //   ))}

    //   <button
    //     onClick={handleSaveChanges}
    //     className="btn btn-primary mt-4 px-5 py-3"
    //     style={{
    //       backgroundColor: "#0098ca",
    //       borderRadius: "13px",
    //       fontWeight: "bold",
    //       fontSize: "1.2rem",
    //       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    //       transition: "background-color 0.3s, transform 0.2s",
    //     }}
    //     onMouseEnter={(e) =>
    //       (e.currentTarget.style.backgroundColor = "#0098ca")
    //     }
    //     onMouseLeave={(e) =>
    //       (e.currentTarget.style.backgroundColor = "#007bff")
    //     }
    //   >
    //   Add Block
    //   </button>
    // </div>


<div>
  <div
    className="container my-5"
    style={{
      backgroundColor: "#f0f4f8", // Light grey-blue for better contrast and less strain on the eyes
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    }}
  >
    <div className="d-flex flex-column align-items-center">
      {blocks.map((id) => (
        <Accordion
          key={id} // Ensure unique key for each block
          className="w-100 mb-4 shadow-sm bg-white"
          style={{ borderRadius: "8px", overflow: "hidden" }} // Smooth borders for the accordion
        >
          <Accordion.Item eventKey={id} className="border-0">
            <Accordion.Header>
              <h5
                className="card-title text-center mb-0 w-100"
                style={{
                  color: "#004d80", // Dark navy blue for titles
                  fontWeight: "bold",
                }}
              >
                Content Block {id}
              </h5>
            </Accordion.Header>
            <Accordion.Body className="bg-light rounded-3 p-3">
              <div className="p-2">
                <Editor
                  apiKey="2yspzclcy8ud89wegf45rh94uadtkdlxke1zrdqgv43uijvh"
                  initialValue={contents[id] || ""}
                  init={{
                    height: 400,
                    menubar: false,
                    branding: false,
                    forced_root_block: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks fullscreen",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic backcolor | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | removeformat | help",
                  }}
                  onEditorChange={(content) => handleEditorChange(content, id)}
                  style={{ display: "block" }}
                />

                <div className="d-flex justify-content-between mt-4">
                  <button
                    onClick={() => removeBlock(id)}
                    className="btn btn-danger shadow btn-sm"
                    style={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      // padding: "10px 20px",
                      // borderRadius: "8px",
                      backgroundColor: "#e74c3c", // Slightly more modern red
                      transition: "transform 0.2s ease-in-out, background-color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <b>Remove Block</b>
                  </button>
                  <button
                    onClick={() => saveBlock(id)}
                    className="btn btn-primary shadow btn-sm rounded-4"
                    style={{
                      fontWeight: "bold",
                      // fontSize: "1rem",
                      // padding: "10px 20px",
                      // borderRadius: "8px",
                      backgroundColor: "#007bff", // Consistent blue
                      transition: "transform 0.2s ease-in-out, background-color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Save
                  </button>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}

      <button
        onClick={handleSaveChanges}
        className="btn btn-primary mt-4 px-5 py-3"
        style={{
          backgroundColor: "#0098ca",
          borderRadius: "13px",
          fontWeight: "bold",
          fontSize: "1.2rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "background-color 0.3s, transform 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#0098ca")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#007bff")
        }
      >
      Add Block
      </button>
    </div>
  </div>
</div>



  );
};
