// Breadcrumbs.js
import { Link, useLocation } from "react-router-dom";
import "../../assets/css/breadcrumbs.css";

export const Breadcrumbs = ({ clientName, caseTitle }) => {
  const location = useLocation();

  // Split the pathname into segments
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Map of route segments to display names
  const segmentNameMap = {
    allclients: "Clients",
    client: "Client",
    case: "Case",
    usermanager: "User Manager",
    userapprovals: "User Approvals",
    rolepermission: "Role Permissions",
    addcase: "Add Case",
    mycase: "My Case",
    managefunds: "Manage Funds",
    approvalestimate: "Approval Estimate",
    myprojects: "My Projects",
    mymembers: "My Members",
    myinvoices: "My Invoices",
    financialactivity: "Financial Activity",
    // Add other mappings as needed

  };

  // Process the pathnames
  const processedPathnames = pathnames.map((path, index) => {
    if (!isNaN(Number(path))) {
      const previousPath = pathnames[index - 1];
      if (previousPath === "client" && clientName) {
        return clientName;
      } else if (previousPath === "case" && caseTitle) {
        return caseTitle;
      } else {
        return path;
      }
    } else {
      // Use case-insensitive matching for segmentNameMap
      const mappedName = segmentNameMap[path.toLowerCase()];
      if (mappedName) {
        return mappedName;
      } else {
        // Replace underscores with spaces and capitalize each word
        return path
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
  });

  // Set the title to the last segment
  const title = processedPathnames[processedPathnames.length - 1] || "Home";
  const client_data = JSON.parse(sessionStorage.getItem("client_data")) || {}; // Default to empty object if null
  let client_localstorage_name = "administrator";

  // Check if client_data is empty, null, or undefined
  if (client_data && Object.keys(client_data).length > 0 && client_data.client_name) {
    client_localstorage_name = client_data.client_name;
  }

  // console.log("Yooo", client_data, typeof client_data, client_localstorage_name);
  return (
    // <div className="breadcrumb-container">
    //   <Link className="breadcrumb-title" style={{color: "#003F73",fontSize:"25px"}}>{client_localstorage_name}</Link>
    //   {/* <Link className="breadcrumb-title">{clientName}</Link> */}
    //   {/* <nav aria-label="breadcrumb" className="breadcrumb-title mt-1">
    //     <ul className="breadcrumb" style={{ fontSize: "14px" }}>
    //       <li className="breadcrumb-item">
    //         <Link to="/" className="breadcrumb-link">
    //           Home
    //         </Link>
    //       </li>
    //       {processedPathnames.map((pathname, index) => {
    //         const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
    //         const isLast = index === processedPathnames.length - 1;
    //         return (
    //           <li className="breadcrumb-item" key={index}>
    //             {!isLast ? (
    //               <Link to={routeTo} className="breadcrumb-link">
    //                 {pathname}
    //               </Link>
    //             ) : (
    //               <span className="breadcrumb-current">{pathname}</span>
    //             )}
    //           </li>
    //         );
    //       })}
    //     </ul>
    //   </nav> */}

    // </div>

    <div 
    className="breadcrumb-container" 
    style={{
      // background: "linear-gradient(145deg, rgb(0, 63, 115), rgb(17, 72, 108))",
      color: "#003F73",
      borderRadius: "8px",
      padding: "10px 15px",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      maxWidth: "100%", // Ensures it doesn’t overflow its parent container
      flexWrap: "wrap"
    }}
  >
    <Link 
      className="breadcrumb-title text-gray-900 " 
      style={{
        // color: "#4fc9da",
        fontSize: "25px",
        fontWeight: "bold",
        whiteSpace: "normal", 
        wordBreak: "break-word", 
        maxWidth: "100%", 
        textAlign: "left", 
        lineHeight: "1.5"
      }}
    >
   {client_localstorage_name} </Link>
  </div>
  
  );
};



