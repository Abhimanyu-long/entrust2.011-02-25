// import React from "react";

// export const GlobalError = ({ error }) => {
//   if (!error) return null; 

//   const isServerError =
//     error.includes("ERR_CONNECTION_REFUSED") ||
//     error.toLowerCase().includes("server is down");

//   return (
//     <div
//       style={{
//         backgroundColor: "#ffdddd",
//         color: "#d8000c",
//         padding: "20px",
//         margin: "20px 0",
//         border: "1px solid #d8000c",
//         borderRadius: "5px",
//       }}
//     >
//       <p>
//         <strong>Error:</strong>{" "}
//         {isServerError
//           ? "The server is down or unavailable. Please try again later."
//           : error}
//       </p>
//     </div>
//   );
// };



import React from "react";

export const GlobalError = () => {

  return (
    <div
      style={{
        backgroundColor: "#ffdddd",
        color: "#d8000c",
        padding: "20px",
        margin: "20px 2rem",
        border: "1px solid #d8000c",
        borderRadius: "5px",
      }}
    >
      <p>
        <strong>Error:</strong>{" "}
        {
         "The server is down or unavailable. Please try again later."
          }
      </p>
    </div>
  );
};

