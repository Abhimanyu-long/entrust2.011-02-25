import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../Loader/Loader";

export const ReviewInvoice = () => {
  const [invoiceHTML, setInvoiceHTML] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getInvoice } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching
      try {
        const client_data = sessionStorage.getItem("client_data");
        const clientId = JSON.parse(client_data)?.client_id;
        if (!clientId) throw new Error("Client ID not found.");
        
        const response = await getInvoice(clientId);
        setInvoiceHTML(response?.data?.invoice_content || ""); 
      } catch (error) {
        console.error("Error fetching invoice:", error.message);
        setError(error.message);
        toast.error("Failed to fetch invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container">
      <div
        className="form-item d-flex flex-column flex-md-row align-items-center justify-content-between border rounded p-2"
        style={{ backgroundColor: "#4fc9da" }}
      >
        <div className="d-flex justify-content-center flex-grow-1 mb-2 mb-md-0" style={{ textAlign: "center" }}>
          <h5 className="modal-title font-weight-bold text-black">Invoices</h5>
        </div>
        <div className="w-100 w-md-auto">
          <button
            className="btn btn-sm add-member-btn w-100"
            onClick={() => navigate("/previousinvoice")}
            style={{
              background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
              fontSize: "12px",
              padding: "6px 12px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              color: "#003F73",
            }}
          >
            <b>Previous{"\u00A0"}Invoices</b>
          </button>
        </div>
      </div>

      <div className="card m-4 p-4">
        {error ? (
          <div className="error-message text-center">
            <p>We couldn't fetch the invoice at the moment. Please try again later.</p>
          </div>
        ) : invoiceHTML ? (
          <div dangerouslySetInnerHTML={{ __html: invoiceHTML }} style={{ fontSize: "12px" }} />
        ) : (
          <div>No Invoice</div>
        )}
      </div>
    </div>
  );
};





// import React, { Suspense, useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../../../context/AuthContext";
// import Loader from "../Loader/Loader";

// export const ReviewInvoice = () => {
//   const [invoiceHTML, setInvoiceHTML] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState({});
//   const { clientId } = useParams();
//   const { getInvoice } = useAuth();
//   const navigate = useNavigate();
//   useEffect(() => {
//     const fetchInvoice = async () => {
//       setLoading(true);
//       try {
//         const client_data = sessionStorage.getItem("client_data");
//         const clientId = JSON.parse(client_data).client_id;
//         const response = await getInvoice(clientId);
//         console.log("response", response);
//         setInvoiceHTML(response?.data?.invoice_content); // Update based on your API response structure
//       } catch (error) {
//         console.error("Error fetching invoice:", error.message);
//         setError(error.message);
//         toast.error("Failed to fetch invoice.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvoice();
//   }, [clientId]);

//   if (error) {
//     return (
//       <div className="error-message text-center">
//         <p>
//           We couldn't fetch the invoice at the moment. This might be due to a missing page or a problem with the server.
//         </p>
//         <p>
//           Please check back after some time and try again later.
//         </p>
//       </div>
//     );
//   }
  
//   // If loading, show loader
//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <Suspense fallback={<Loader />}>
//     <div className="container">
//          <div
//           className="form-item d-flex flex-column flex-md-row align-items-center justify-content-between border rounded p-2"
//           style={{ backgroundColor: "#4fc9da" }}
//         >
//           {/* Buttons Section */}
        

//           {/* Title Section */}
//           <div
//             className="d-flex justify-content-center flex-grow-1 mb-2 mb-md-0"
//             style={{ textAlign: "center" }}
//           >
//             <h5 className="modal-title font-weight-bold text-black">Invoices</h5>
//           </div>

//           {/* Add Member Button */}
//           <div className="w-100 w-md-auto">
//             <button
//               className="btn btn-sm add-member-btn w-100"
//               onClick={() => navigate("/previousinvoice")}
//               style={{
//                 background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
//                 fontSize: "12px",
//                 padding: "6px 12px",
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//                 color: "#003F73",
//               }}
//             >
//               <b>Previous{"\u00A0"}Invoices</b>
//             </button>
//           </div>

//         </div>
     
//       <div className="card m-4 p-4">
//         {invoiceHTML ? (
//           <div dangerouslySetInnerHTML={{ __html: invoiceHTML }} style={{ fontSize: "12px" }} />
//         ) : (
//           <div>No Invoice </div>
//         )}
//       </div>
//     </div>
//     </Suspense>
//   );
// };
