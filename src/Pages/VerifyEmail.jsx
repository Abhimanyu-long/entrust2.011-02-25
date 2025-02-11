import React from "react";
import { Link } from "react-router-dom";

export const VerifyEmail = () => {
  return (
    <>
      <div
        className="VerifyEmail"
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          className="card"
          style={{
            borderRadius: "20px",
            maxWidth: "480px",
            width: "90%",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            padding: "25px",
            textAlign: "center",
            background: "#fff",
            transition: "all 0.3s ease",
          }}
        >
          <h2
            style={{
              color: "#0098ca",
              fontSize: "1.8rem",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Welcome to Entrust!
          </h2>

          <div
            className="alert"
            style={{
              backgroundColor: "#e3f2fd",
              color: "#0d47a1",
              padding: "15px",
              borderRadius: "10px",
              fontSize: "1rem",
              margin: "10px 0",
              boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, 0.05)",
            }}
          >
            Your login details have been sent to your email. Please check your inbox.
          </div>

          <p
            style={{
              fontSize: "1rem",
              color: "#333",
              lineHeight: "1.6",
              margin: "20px 0",
            }}
          >
            If you find the email in your <strong>Spam</strong> or <strong>Junk</strong> folder, mark it as “not spam” and add{" "}
            <a
              href="mailto:entrust@neuralit.com"
              style={{
                color: "#007bff",
                fontWeight: "500",
                textDecoration: "underline",
              }}
            >
              entrust@neuralit.com
            </a>{" "}
            to your contacts.
          </p>

          <p
            style={{
              fontSize: "1rem",
              color: "#333",
              lineHeight: "1.6",
            }}
          >
            For queries, email{" "}
            <a
              href="mailto:entrust@neuralit.com"
              style={{
                color: "#007bff",
                fontWeight: "500",
                textDecoration: "underline",
              }}
            >
              entrust@neuralit.com
            </a>{" "}
            or call us at{" "}
            <a
              href="tel:+18446488326"
              style={{
                color: "#007bff",
                fontWeight: "500",
                textDecoration: "underline",
              }}
            >
              +1-844-NIT-TEAM (648-8326)
            </a>.
          </p>

          <p
            style={{
              fontSize: "1rem",
              color: "#666",
              marginTop: "30px",
            }}
          >
            Sincerely,<br />
            The Neural IT Team
          </p>

          <div className="text-center pt-5">
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                className="btn btn-sm"
                style={{
                  backgroundColor: "#0098CA",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0098CA")}
              >
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 600px) {
          .VerifyEmail {
            display: block;
            padding: 15px;
          }

          .card {
            width: 100%;
            padding: 15px;
            box-shadow: none;
            border-radius: 10px;
          }

          h2 {
            font-size: 1.5rem;
          }

          .alert {
            font-size: 0.9rem;
          }

          p {
            font-size: 0.9rem;
          }

          button {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
};



// import React from "react";
// import { Link } from "react-router-dom";

// export const VerifyEmail = () => {
//   return (
//     <>
//       <div className="VerifyEmail" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "'Poppins', sans-serif" }}>
//         <div className="card" style={{ borderRadius: "20px", maxWidth: "480px", width: "90%", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", padding: "25px", textAlign: "center", background: "#fff" }}>

//           <h2 style={{ color: "#0098ca", fontSize: "1.8rem", fontWeight: "600", marginBottom: "20px" }}>
//             Welcome to Entrust!
//           </h2>

//           <div className="alert" style={{ backgroundColor: "#e3f2fd", color: "#0d47a1", padding: "15px", borderRadius: "10px", fontSize: "1rem", margin: "10px 0", boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, 0.05)" }}>
//             Your login details have been sent to your email. Please check your inbox.
//           </div>

//           <p style={{ fontSize: "1rem", color: "#333", lineHeight: "1.6", margin: "20px 0" }}>
//             If you find the email in your <strong>Spam</strong> or <strong>Junk</strong> folder, mark it as “not spam” and add{" "}
//             <a href="mailto:entrust@neuralit.com" style={{ color: "#007bff", fontWeight: "500", textDecoration: "underline" }}>entrust@neuralit.com</a> to your contacts.
//           </p>

//           <p style={{ fontSize: "1rem", color: "#333", lineHeight: "1.6" }}>
//             For queries, email{" "}
//             <a href="mailto:entrust@neuralit.com" style={{ color: "#007bff", fontWeight: "500", textDecoration: "underline" }}>entrust@neuralit.com</a> or call us at{" "}
//             <a href="tel:+18446488326" style={{ color: "#007bff", fontWeight: "500", textDecoration: "underline" }}>+1-844-NIT-TEAM (648-8326)</a>.
//           </p>

//           <p style={{ fontSize: "1rem", color: "#666", marginTop: "30px" }}>
//             Sincerely,<br />
//             The Neural IT Team
//           </p>

//           <div className="text-center pt-5">
//             <Link to="/login" style={{ textDecoration: "none" }}>
//               <button
//                 className="btn btn-sm"
//                 style={{
//                   backgroundColor: "#0098CA",
//                   color: "#FFFFFF",
//                   border: "none",
//                   padding: "12px 24px",
//                   borderRadius: "12px",
//                   fontSize: "1rem",
//                   fontWeight: "bold",
//                   boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.3)",
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                 }}
//                 onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
//                 onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0098CA")}

//               >
//                 Back to Login
//               </button>
//             </Link>
//           </div>

//         </div>
//       </div>

//     </>
//   );
// };
