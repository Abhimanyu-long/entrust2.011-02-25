import React from "react";
import { useNotifications } from "./useNotifications";

export const Notification = () => {
  const {
    notifications,
    loading,
    loadingMore,
    noMoreData,
    error,
    loadMore,
    singleDeleteNotification,
    clearNotifications,
    totalCount,
  } = useNotifications();

  const formatDateWithoutYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-light fw-semibold fs-6 w-lg-300px show"
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        backgroundColor: "#ebfcff",
      }}
    >
      {/* Header */}
      <div
        className="d-flex flex-column flex-center bgi-no-repeat rounded-top px-6 py-4"
        style={{
          backgroundColor: "#008abb",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <h4 className="text-white fw-semibold mb-1">
          Notifications{" "}
          <span className="fs-8 opacity-75 ps-2">
            {totalCount} {totalCount === 1 ? "record" : "records"}
          </span>
        </h4>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger m-2 p-2" role="alert">
          {error}
        </div>
      )}

      {/* Notifications List */}
      <div
        className="p-3"
        style={{
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {loading && notifications.length === 0 ? (
          <div className="text-center text-muted">
            <i className="fas fa-spinner fa-spin fs-3 mb-2"></i>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-muted">
            <i className="fas fa-bell-slash fs-3 mb-2"></i>
            <p>No new notifications at the moment!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              className="d-flex align-items-center py-2 mb-2 bg-light notification-item"
              key={notification.user_notification_id}
              style={{
                borderRadius: "0.375rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                padding: "8px",
              }}
            >
              {/* Icon */}
              <div>
                <i
                  className={`me-3 ${notification.icon || "fas fa-info-circle"}`}
                  style={{
                    fontSize: "1.25rem",
                    color:
                      notification.status === "badge-danger"
                        ? "#e74c3c"
                        : "#28a745",
                  }}
                />
              </div>

              {/* Message and Date */}
              <div className="d-flex flex-column w-100">
                <div className="d-flex justify-content-between align-items-start">
                  <span
                    className="text-dark fw-semibold"
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: "1.2",
                      wordBreak: "break-word",
                      maxWidth: "80%",
                    }}
                  >
                    {notification.message || "Notification"}
                  </span>
                  <span
                    className="fs-8 text-grey"
                    style={{
                      fontSize: "0.75rem",
                    }}
                  >
                    {notification.notification_created_at
                      ? formatDateWithoutYear(notification.notification_created_at)
                      : "Just now"}
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <button
                className="btn btn-sm btn-light-danger ms-2"
                onClick={() => singleDeleteNotification(notification.user_notification_id)}
                aria-label="Delete notification"
                style={{
                  borderRadius: "50%",
                  padding: "4px",
                  width: "20px",
                  height: "20px",
                }}
              >
                &times;
              </button>
            </div>
          ))
        )}

        {loadingMore && (
          <div className="text-center text-muted my-2">
            <i className="fas fa-spinner fa-spin fs-4"></i>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end justify-content-md-between align-items-center p-2">
        {!noMoreData && notifications.length > 0 && (
          <button
            className="btn btn-primary btn-sm fs-9 me-md-2"
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              borderRadius: "0.375rem",
              padding: "4px 12px",
            }}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        )}
        <button
          className={`btn btn-danger btn-sm fs-9 ${
            !noMoreData && notifications.length > 0 ? "" : "ms-auto"
          }`}
          onClick={clearNotifications}
          disabled={loading || loadingMore || notifications.length === 0}
          style={{
            borderRadius: "0.375rem",
            padding: "4px 12px",
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};















// import React from "react";
// import { useAuth } from "../../../context/AuthContext";
// import { useNotifications } from "./useNotifications";

// export const Notification = () => {
//   const { deleteNotification, clearAllNotifications } = useAuth();
//   const {
//     notifications,
//     loading,
//     loadingMore,
//     noMoreData,
//     error,
//     loadMore,
//     setNotifications,
//     setError,
//     setNoMoreData,
//     totalCount,
//   } = useNotifications(); // Your custom hook
  

//   // Delete notification
//   const handleDeleteNotification = async (id) => {
//     try {
//       await deleteNotification(id);
//       setNotifications((prev) =>
//         prev.filter((item) => item.user_notification_id !== id)
//       );
//     } catch (err) {
//       console.error("Failed to delete notification:", err);
//       setError("Failed to delete notification. Please try again.");
//     }
//   };

//   // Clear all notifications
//   const clearNotifications = async () => {
//     try {
//       await clearAllNotifications();
//       setNotifications([]); // Clear local state
//       setNoMoreData(false); // Reset so the user can load again if needed
//     } catch (err) {
//       console.error("Failed to clear notifications:", err);
//       setError("Failed to clear notifications. Please try again.");
//     }
//   };

//   // Format date
//   const formatDateWithoutYear = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString(undefined, {
//       month: "short",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   return (
//     <div
//       className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-light fw-semibold fs-6 w-lg-300px show"
//       style={{
//         border: "1px solid #e0e0e0",
//         borderRadius: "8px",
//         overflow: "hidden",
//         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//         backgroundColor: "#ebfcff",
//       }}
//     >
//       {/* Header */}
//       <div
//         className="d-flex flex-column flex-center bgi-no-repeat rounded-top px-6 py-4"
//         style={{
//           backgroundColor: "#008abb",
//           borderBottom: "1px solid #e0e0e0",
//         }}
//       >
//         <h4 className="text-white fw-semibold mb-1">
//           Notifications{" "}
//           <span className="fs-8 opacity-75 ps-2">
//             {/* {notifications.length} {notifications.length === 1 ? "record" : "records"} */}
//             {totalCount} {totalCount === 1 ? "record" : "records"}
//           </span>
//         </h4>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="alert alert-danger m-2 p-2" role="alert">
//           {error}
//         </div>
//       )}

//       {/* Notifications List */}
//       <div
//         className="p-3"
//         style={{
//           maxHeight: "300px",
//           overflowY: "auto",
//         }}
//       >
//         {/* Loading State */}
//         {loading && notifications.length === 0 ? (
//           <div className="text-center text-muted">
//             <i className="fas fa-spinner fa-spin fs-3 mb-2"></i>
//             <p>Loading notifications...</p>
//           </div>
//         ) : notifications.length === 0 ? (
//           <div className="text-center text-muted">
//             <i className="fas fa-bell-slash fs-3 mb-2"></i>
//             <p>No new notifications at the moment!</p>
//           </div>
//         ) : (
//           notifications.map((notification) => (
//             <div
//               className="d-flex align-items-center py-2 mb-2 bg-light notification-item"
//               key={notification.user_notification_id}
//               style={{
//                 borderRadius: "0.375rem",
//                 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
//                 padding: "8px",
//               }}
//             >
//               {/* Icon */}
//               <div>
//                 <i
//                   className={`me-3 ${notification.icon || "fas fa-info-circle"}`}
//                   style={{
//                     fontSize: "1.25rem",
//                     color: notification.status === "badge-danger" ? "#e74c3c" : "#28a745",
//                   }}
//                 />
//               </div>

//               {/* Message and Date */}
//               <div className="d-flex flex-column w-100">
//                 <div className="d-flex justify-content-between align-items-start">
//                   <span
//                     className="text-dark fw-semibold"
//                     style={{
//                       fontSize: "0.875rem",
//                       lineHeight: "1.2",
//                       wordBreak: "break-word",
//                       maxWidth: "80%",
//                     }}
//                   >
//                     {notification.message || "Notification"}
//                   </span>
//                   <span
//                     className="fs-8 text-grey"
//                     style={{
//                       fontSize: "0.75rem",
//                     }}
//                   >
//                     {notification.notification_created_at
//                       ? formatDateWithoutYear(notification.notification_created_at)
//                       : "Just now"}
//                   </span>
//                 </div>
//               </div>

//               {/* Delete Button */}
//               <button
//                 className="btn btn-sm btn-light-danger ms-2"
//                 onClick={() => handleDeleteNotification(notification.user_notification_id)}
//                 aria-label="Delete notification"
//                 style={{
//                   borderRadius: "50%",
//                   padding: "4px",
//                   width: "20px",
//                   height: "20px",
//                 }}
//               >
//                 &times;
//               </button>
//             </div>
//           ))
//         )}

//         {/* Load More Spinner */}
//         {loadingMore && (
//           <div className="text-center text-muted my-2">
//             <i className="fas fa-spinner fa-spin fs-4"></i>
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="d-flex justify-content-end justify-content-md-between align-items-center p-2">
//   {
//     // Show "Load More" only if there's more data to load
//     !noMoreData && notifications.length > 0 && (
//       <button
//         className="btn btn-primary btn-sm fs-9 me-md-2"
//         onClick={loadMore}
//         disabled={loadingMore}
//         style={{
//           borderRadius: "0.375rem",
//           padding: "4px 12px",
//         }}
//       >
//         {loadingMore ? "Loading..." : "Load More"}
//       </button>
//     )
//   }
//   <button
//     className={`btn btn-danger btn-sm fs-9 ${!noMoreData && notifications.length > 0 ? "" : "ms-auto"}`}
//     onClick={clearNotifications}
//     disabled={loading || loadingMore || notifications.length === 0}
//     style={{
//       borderRadius: "0.375rem",
//       padding: "4px 12px",
//     }}
//   >
//     Clear All
//   </button>
// </div>

     
//     </div>
//   );
// };












{/* <div className="d-flex justify-content-between p-2">
{
  // Show "Load More" only if there's more data to load
  !noMoreData && notifications.length > 0 && (
    <button
      className="btn btn-primary btn-sm fs-9"
      onClick={loadMore}
      disabled={loadingMore}
      style={{
        borderRadius: "0.375rem",
        padding: "4px 12px",
      }}
    >
      {loadingMore ? "Loading..." : "Load More"}
    </button>
  )
}
<button
  className="btn btn-danger btn-sm fs-9 text-end"
  onClick={clearNotifications}
  disabled={loading || loadingMore || notifications.length === 0}
  style={{
    borderRadius: "0.375rem",
    padding: "4px 12px",
    position:"relative"
  }}
>
  Clear All
</button>
</div> */}











// import React, { useState, useEffect, useCallback } from "react";
// import { useAuth } from "../../../context/AuthContext";

// export const Notification = () => {
//   const { getNotifications, deleteNotification, clearAllNotifications } = useAuth();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [offset, setOffset] = useState(0);
//   const [limit] = useState(5);
//   const [noMoreData, setNoMoreData] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch Notifications
//   const fetchNotifications = useCallback(
//     async (isLoadMore = false) => {
//       try {
//         isLoadMore ? setLoadingMore(true) : setLoading(true);
//         setError(null);
//         const data = await getNotifications(limit, offset);

//         if (!Array.isArray(data)) {
//           console.error("Fetched data is not iterable. Using empty array as fallback.");
//           setNotifications(isLoadMore ? prev => prev : []);
//           setNoMoreData(true);
//         } else {
//           if (data.length < limit) {
//             setNoMoreData(true);
//           }
//           setNotifications(prevNotifications =>
//             isLoadMore ? [...prevNotifications, ...data] : data
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//         setError("Failed to load notifications. Please try again.");
//         setNotifications(isLoadMore ? prev => prev : []);
//       } finally {
//         isLoadMore ? setLoadingMore(false) : setLoading(false);
//       }
//     },
//     [getNotifications, limit, offset]
//   );

//   // Initial Fetch
//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   // Handle Load More
//   const loadMoreNotifications = () => {
//     if (!noMoreData && !loadingMore) {
//       setOffset(prevOffset => prevOffset + limit);
//     }
//   };

//   // Fetch more when offset changes
//   useEffect(() => {
//     if (offset === 0) return; // Skip initial fetch
//     fetchNotifications(true);
//   }, [offset, fetchNotifications]);

//   // Handle Delete Notification
//   const handleDeleteNotification = async id => {
//     try {
//       await deleteNotification(id);
//       setNotifications(prevNotifications =>
//         prevNotifications.filter(notification => notification.user_notification_id !== id)
//       );
//     } catch (error) {
//       console.error("Failed to delete notification:", error);
//       setError("Failed to delete notification. Please try again.");
//     }
//   };

//   // Handle Clear All Notifications
//   const clearNotifications = async () => {
//     try {
//       await clearAllNotifications();
//       setNotifications([]);
//       setOffset(0);
//       setNoMoreData(false);
//     } catch (error) {
//       console.error("Failed to clear notifications:", error);
//       setError("Failed to clear notifications. Please try again.");
//     }
//   };

//   // Format Date
//   const formatDateWithoutYear = dateString => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-IN", {
//       month: "short",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   return (
//     <div
      // className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-light fw-semibold fs-6 w-lg-300px show"
      // style={{
      //   border: "1px solid #e0e0e0",
      //   borderRadius: "8px",
      //   overflow: "hidden",
      //   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      //   backgroundColor: "#ebfcff",
      // }}
//     >
//       {/* Header */}
//       <div
//         className="d-flex flex-column flex-center bgi-no-repeat rounded-top px-6 py-4"
//         style={{
//           backgroundColor: "#008abb",
//           borderBottom: "1px solid #e0e0e0",
//         }}
//       >
//         <h4 className="text-white fw-semibold mb-1">
//           Notifications
//           <span className="fs-8 opacity-75 ps-2">
//             {notifications.length} {notifications.length === 1 ? "record" : "records"}
//           </span>
//         </h4>
//       </div>

//       {/* Notifications List */}
//       <div
//         className="p-3"
//         style={{
//           maxHeight: "300px", // Increased height for better UX
//           overflowY: "auto",
//           scrollbarWidth: "none",
//           msOverflowStyle: "none",
//         }}
//       >
//         {/* Hide scrollbar */}
//         <style>
//           {`
//             .p-3::-webkit-scrollbar {
//               display: none;
//             }
//           `}
//         </style>

//         {/* Error Message */}
//         {error && (
//           <div className="alert alert-danger p-2" role="alert">
//             {error}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && notifications.length === 0 ? (
//           <div className="text-center text-muted">
//             <i className="fas fa-spinner fa-spin fs-3 mb-2"></i>
//             <p>Loading notifications...</p>
//           </div>
//         ) : notifications.length === 0 ? (
//           <div className="text-center text-muted">
//             <i className="fas fa-bell-slash fs-3 mb-2"></i>
//             <p>No new notifications at the moment!</p>
//           </div>
//         ) : (
//           notifications.map(notification => (
//             <div
//               className="d-flex align-items-center py-2 mb-2 bg-light notification-item"
//               key={notification.user_notification_id}
//               style={{
//                 borderRadius: "0.375rem",
//                 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
//                 transition: "all 0.3s ease",
//                 padding: "8px",
//               }}
//             >
//               {/* Notification Icon */}
//               <div>
//                 <i
//                   className={`me-3 ${notification.icon || "fas fa-info-circle"}`}
//                   style={{
//                     fontSize: "1.25rem",
//                     color:
//                       notification.status === "badge-danger" ? "#e74c3c" : "#28a745",
//                   }}
//                 ></i>
//               </div>

//               {/* Notification Message and Date */}
//               <div className="d-flex flex-column w-100">
//                 <div
//                   className="d-flex justify-content-between align-items-start"
//                   style={{
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   <span
//                     className="text-dark fw-semibold"
//                     style={{
//                       fontSize: "0.875rem",
//                       marginRight: "10px",
//                       lineHeight: "1.2",
//                       wordBreak: "break-word",
//                       whiteSpace: "normal",
//                       maxWidth: "calc(100% - 30px)",
//                     }}
//                   >
//                     {notification.message || "Notification"}
//                   </span>
//                   <span
//                     className="fs-8 mt-1 text-grey"
//                     style={{
//                       marginTop: "4px",
//                       fontSize: "0.75rem",
//                     }}
//                   >
//                     {notification.notification_created_at
//                       ? formatDateWithoutYear(notification.notification_created_at)
//                       : "Just now"}
//                   </span>
//                 </div>
//               </div>

//               {/* Delete Button */}
//               <div>
//                 <button
//                   className="btn btn-sm btn-light-danger"
//                   onClick={() =>
//                     handleDeleteNotification(notification.user_notification_id)
//                   }
//                   style={{
//                     borderRadius: "50%",
//                     padding: "4px",
//                     cursor: "pointer",
//                     transition: "background-color 0.2s ease",
//                     height: "20px",
//                     width: "20px",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     flexShrink: 0,
//                     flexGrow: 0,
//                   }}
//                 >
//                   &times;
//                 </button>
//               </div>
//             </div>
//           ))
//         )}

//         {/* Load More Indicator */}
//         {loadingMore && (
//           <div className="text-center text-muted my-2">
//             <i className="fas fa-spinner fa-spin fs-4"></i>
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="d-flex justify-content-between p-2">
//         {!noMoreData && notifications.length > 0 && (
//           <button
//             className="btn btn-primary btn-sm fs-9"
//             onClick={loadMoreNotifications}
//             disabled={loadingMore}
//             style={{
//               borderRadius: "0.375rem",
//               padding: "4px 12px",
//               transition: "background-color 0.3s ease",
//             }}
//           >
//             {loadingMore ? "Loading..." : "Load More"}
//           </button>
//         )}
//         <button
//           className="btn btn-danger btn-sm fs-9"
//           onClick={clearNotifications}
//           disabled={loading || loadingMore || notifications.length === 0}
//           style={{
//             borderRadius: "0.375rem",
//             padding: "4px 12px",
//             transition: "background-color 0.3s ease",
//           }}
//         >
//           Clear All
//         </button>
//       </div>
//     </div>
//   );
// };
