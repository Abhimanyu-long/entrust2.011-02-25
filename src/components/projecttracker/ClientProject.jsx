// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useAuth } from "../../../context/AuthContext";
// import { Link } from "react-router-dom";

// export const ClientProject = () => {
//   let clientId;
//   try {
//     const clientData = localStorage.getItem("client_data");
//     if (!clientData) {
//       throw new Error("No client data found in local storage.");
//     }
//     const clientObject = JSON.parse(clientData);
//     if (!clientObject.client_id) {
//       throw new Error("client_id is missing in the client data.");
//     }
//     clientId = clientObject.client_id;
//     console.log("Client ID from local storage is:", clientId);
//   } catch (error) {
//     console.error("An error occurred:", error.message);
//   }

//   const [projects, setProjects] = useState([]);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const { getAllProjects } = useAuth();
//   const observerRef = useRef(null);

//   // Fetch projects based on the current page and clientId
//   const fetchProjects = useCallback(async () => {
//     if (!hasMore || isLoading) return;

//     setIsLoading(true);
//     try {
//       //   const projectData = await getAllProjects(clientId, 1);
//       //   if (Array.isArray(projectData) && projectData.length > 0) {
//       //     setProjects((prevProjects) => [...prevProjects, ...projectData]);
//       //     setPage((prevPage) => prevPage + 1);
//       //   } else {
//       //     setHasMore(false);
//       //   }
//       const projectData = await getAllProjects(clientId, 1);
//       if (Array.isArray(projectData) && projectData.length > 0) {
//         setProjects(projectData.slice(0, 10));
//       }
//     } catch (error) {
//       console.error("Error fetching projects:", error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [clientId, getAllProjects, hasMore, isLoading]);

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) fetchProjects();
//       },
//       { threshold: 1.0 }
//     );
//     if (observerRef.current) observer.observe(observerRef.current);

//     return () => {
//       if (observerRef.current) observer.unobserve(observerRef.current);
//     };
//   }, []);

//   return (
//     <>
//       <div className="card mx-4">  
//         <div className="tab-content">
//           <div
//             id="nit_billing_months"
//             className="card-body p-0 tab-pane fade active show"
//             role="tabpanel"
//             aria-labelledby="nit_billing_months"
//           >
//             <div className="table-responsive">
//               <table className="table table-row-bordered align-middle gy-4 gs-9">
//                 <thead className="border-bottom border-gray-200 fs-6 fw-bold  " style={{ backgroundColor: "#0098ca" }}>
//                   <tr>
//                     <td className="min-w-150px">Project ID</td>
//                     <td className="min-w-150px">Title</td>
//                     <td className="min-w-150px">Body</td>
//                     <td className="min-w-250px">Created At</td>
//                     <td className="min-w-150px">Updated At</td>
//                     {/* <td className="min-w-150px">View</td> */}
//                   </tr>
//                 </thead>
//                 <tbody className="fw-semibold text-gray-600">
//                   {projects.length > 0 ? (
//                     projects.map((project) => (
//                       <tr key={project.project_id}>
//                         <td>
//                           <Link to={`/myprojects/${project.project_id}`}>
//                             {project.project_id}
//                           </Link>
//                         </td>
//                         <td>{project.title}</td>
//                         <td>{project.body}</td>
//                         <td>{new Date(project.created_at).toLocaleString()}</td>
//                         <td>{new Date(project.updated_at).toLocaleString()}</td>
//                         {/* <td>
//                           <Link
//                             to={`/myprojects/${project.project_id}`}
//                             className="btn btn-sm btn-light btn-active-light-primary"
//                             style={{backgroundColor:"#0097ca"}}
//                           >
//                             View
//                           </Link>
//                         </td> */}
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center">
//                         No projects available.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//               {/* <div ref={observerRef} className="text-center py-3">
//                 {isLoading ? "Loading more projects..." : ""}
//               </div> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };



import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export const ClientProject = () => {
  let clientId;
  try {
    const clientData = sessionStorage.getItem("client_data");
    if (!clientData) {
      throw new Error("No client data found in local storage.");
    }
    const clientObject = JSON.parse(clientData);
    if (!clientObject.client_id) {
      throw new Error("client_id is missing in the client data.");
    }
    clientId = clientObject.client_id;
  } catch (error) {
    console.error("An error occurred:", error.message);
  }

  const [projects, setProjects] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { getAllProjects } = useAuth();

  const fetchProjects = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const projectData = await getAllProjects(clientId, page);
      if (Array.isArray(projectData) && projectData.length > 0) {
        const pageSize = 10;
        setProjects(projectData.slice(0, pageSize));
        setTotalRecords(100); // Replace with actual data or estimation
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [clientId, getAllProjects]);

  useEffect(() => {
    fetchProjects(page);
  }, [page]);

  const onPageChange = (newPage) => {
    setPage(newPage);
    fetchProjects(newPage);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
      <div className="border-1  text-white d-flex justify-content-center align-items-center py-3"
      style={{background:"linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",borderRadius: "10px 10px 0 0",}}>
          <h5 className="mb-0 fw-bold text-white">Client Projects</h5>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover mb-0 bg-light">
              <thead className=" bg-light" >
                <tr style={{background:"rgba(177, 220, 228, 0.57)"}}>
                  <th className="text-center" style={{ width: "10%" }}>Project ID</th>
                  <th className="text-center" style={{ width: "20%" }}>Title</th>
                  <th className="text-center" style={{ width: "45%" }}>Body</th>
                  <th className="text-center" style={{ width: "15%" }}>Created At</th>
                  <th className="text-center" style={{ width: "15%" }}>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </td>
                  </tr>
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                    <tr key={project.project_id}>
                      <td className="text-center">
                        <Link to={`/myprojects/${project.project_id}`} className="text-primary text-center">
                          {project.project_id}
                        </Link>
                      </td>
                      <td>{project.title}</td>
                      <td>{project.body}</td>
                      <td>{new Date(project.created_at).toLocaleString()}</td>
                      <td>{new Date(project.updated_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No projects available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* <div className="card-footer">
          <nav>
            <ul className="pagination justify-content-center mb-0">
              {[...Array(Math.ceil(totalRecords / 10)).keys()].map((_, idx) => (
                <li key={idx} className={`page-item ${page === idx + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => onPageChange(idx + 1)}>
                    {idx + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div> */}
      </div>
    </div>
  );
};
