import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";

export function useNotifications() {
  const { getNotifications, deleteNotification, clearAllNotifications  } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 5;

  const [noMoreData, setNoMoreData] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0); // Total count of notifications

  const fetchNotifications = useCallback(
    async (isLoadMore = false) => {
      try {
        isLoadMore ? setLoadingMore(true) : setLoading(true);
        setError(null);

        // Fetch data from the backend
        const data = await getNotifications(limit, offset);

        if (!Array.isArray(data)) {
          setNoMoreData(true);
        } else {
          if (data.length < limit) {
            setNoMoreData(true);
          }

          // Update notifications
          setNotifications((prev) =>
            isLoadMore ? [...prev, ...data] : data
          );

          // Update total count (calculate based on loaded notifications)
          setTotalCount((prevCount) =>
            isLoadMore ? prevCount + data.length : data.length
          );
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load notifications. Please try again.");
        if (!isLoadMore) {
          setNotifications([]);
          setTotalCount(0); // Reset total count on error
        }
      } finally {
        isLoadMore ? setLoadingMore(false) : setLoading(false);
      }
    },
    [getNotifications, limit, offset]
  );

  // Fetch on component mount or offset change
  useEffect(() => {
    fetchNotifications(offset !== 0);
  }, [offset, fetchNotifications]);

  const loadMore = () => {
    if (!noMoreData && !loadingMore) {
      setOffset((prev) => prev + limit);
    }
  };

  // const singleDeleteNotification = (id) => {
  //   setNotifications((prev) =>
  //     prev.filter((notification) => notification.user_notification_id !== id)
  //   );
  //   setTotalCount((prevCount) => prevCount - 1);
  // };

  // const clearNotifications = () => {
  //   setNotifications([]);
  //   setTotalCount(0);
  //   setNoMoreData(false);
  // };


   // Handle Delete Notification
   const singleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id); // Call backend to delete notification
      setNotifications((prev) =>
        prev.filter((notification) => notification.user_notification_id !== id)
      );
      setTotalCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Failed to delete notification:", error);
      setError("Failed to delete notification. Please try again.");
    }
  };

  // Handle Clear All Notifications
  const clearNotifications = async () => {
    try {
      await clearAllNotifications(); // Call backend to clear all notifications
      setNotifications([]);
      setOffset(0);
      setNoMoreData(false);
      setTotalCount(0);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      setError("Failed to clear notifications. Please try again.");
    }
  };

  return {
    notifications,
    loading,
    loadingMore,
    noMoreData,
    error,
    loadMore,
    setNotifications,
    setError,
    setNoMoreData,
    totalCount,
    singleDeleteNotification,
    clearNotifications,
  };
}











// // useNotifications.js
// import { useState, useEffect, useCallback } from "react";
// import { useAuth } from "../../../context/AuthContext";

// export function useNotifications() {
//   const { getNotifications } = useAuth();
//   const [notifications, setNotifications] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const limit = 5; // or pass it as a param if needed

//   const [noMoreData, setNoMoreData] = useState(false);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);

//   const [totalCount, setTotalCount] = useState(0);


//   const fetchNotifications = useCallback(
//     async (isLoadMore = false) => {
//       try {
//         isLoadMore ? setLoadingMore(true) : setLoading(true);
//         setError(null);

//         // Call backend with offset & limit
//         const data = await getNotifications(limit, offset);
//         // data should be the chunk of notifications for [offset, offset+limit)

//         console.log(data);

//         if (!Array.isArray(data)) {
//           // handle error
//           setNoMoreData(true);
//         } else {
//           // if the returned data is less than 'limit', assume no more data
//           if (data.length < limit) {
//             setNoMoreData(true);
//           }
//           // Important: append if this is a "load more" call
//           setNotifications((prev) =>
//             isLoadMore ? [...prev, ...data] : data
//           );
//           setTotalCount((prevCount) => isLoadMore ? prevCount + data.length : data.length);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load notifications. Please try again.");
//         if (!isLoadMore) setNotifications([]);
//       } finally {
//         isLoadMore ? setLoadingMore(false) : setLoading(false);
//       }
//     },
//     [getNotifications, limit, offset]
//   );

//   // Fetch on initial mount (offset = 0)
//   useEffect(() => {
//     fetchNotifications(false);
//   }, [fetchNotifications]);

//   // If offset changes from 0 -> 5 -> 10, etc., fetch more
//   useEffect(() => {
//     if (offset !== 0) {
//       fetchNotifications(true);
//     }
//   }, [offset, fetchNotifications]);

//   // Trigger an offset increment
//   const loadMore = () => {
//     if (!noMoreData && !loadingMore) {
//       setOffset((prev) => prev + limit);
//     }
//   };

//   return {
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
//   };
// }













// import { useState, useEffect, useCallback } from "react";
// import { useAuth } from "../../../context/AuthContext";

// export function useNotifications() {
//   const { getNotifications } = useAuth();
//   const [notifications, setNotifications] = useState([]);
//   const [offset, setOffset] = useState(0);
//   const [limit] = useState(5);
//   const [noMoreData, setNoMoreData] = useState(false);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);

//   const fetchNotifications = useCallback(
//     async (isLoadMore = false) => {
//       try {
//         isLoadMore ? setLoadingMore(true) : setLoading(true);
//         setError(null);

//         const data = await getNotifications(limit, offset);

//         if (!Array.isArray(data)) {
//           console.error("Fetched data is not an array");
//           if (!isLoadMore) setNotifications([]);
//           setNoMoreData(true);
//         } else {
//           if (data.length < limit) {
//             setNoMoreData(true);
//           }

//           setNotifications((prev) =>
//             isLoadMore ? [...prev, ...data] : data
//           );
//         }
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//         setError("Failed to load notifications. Please try again.");
//         if (!isLoadMore) setNotifications([]);
//       } finally {
//         isLoadMore ? setLoadingMore(false) : setLoading(false);
//       }
//     },
//     [getNotifications, limit, offset]
//   );

//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   useEffect(() => {
//     if (offset !== 0) {
//       fetchNotifications(true);
//     }
//   }, [offset, fetchNotifications]);

//   const loadMore = () => {
//     if (!noMoreData && !loadingMore) {
//       setOffset((prev) => prev + limit);
//     }
//   };

//   return {
//     notifications,
//     loading,
//     loadingMore,
//     noMoreData,
//     error,
//     loadMore,
//     setNotifications,
//     setError,
//     setNoMoreData,
//   };
// }
