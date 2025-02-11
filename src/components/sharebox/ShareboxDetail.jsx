import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../Loader/Loader.jsx";
import FileDownloadTable from "./FileDownloadTable.jsx";
import "../../assets/css/sharebox.css";

export const ShareboxDetail = ({
  shareboxId,
  onDataUpdate,
  handleKeywordClick,
}) => {

// console.log(" shareboxId onDataUpdate handleKeywordClick", shareboxId);


  const { getShareBoxDetail } = useAuth();
  const [isDetail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const client = JSON.parse(sessionStorage.getItem("client_data"));
  const client_ID = client?.client_id;

  const handleTagKeyword = (keyword) => {
    // console.log("Keyword clicked:", keyword);
    handleKeywordClick(keyword);
  };

  useEffect(() => {
    const fetchShareBoxDetail = async () => {
      if (!client_ID || !shareboxId) return;

      try {
        setLoading(true);
        const response = await getShareBoxDetail(client_ID, shareboxId);

        // console.log("i am from response",response);

        if (response.status === 1) {
          setDetail(response.data);
          onDataUpdate(response.data);
        } else {
          setError("Failed to fetch sharebox details.");
        }
      } catch (error) {
        console.error("Error fetching sharebox details:", error);
        setError("An error occurred while fetching sharebox details.");
      } finally {
        setLoading(false);
      }
    };

    fetchShareBoxDetail();
  }, [getShareBoxDetail, client_ID, shareboxId]);

  // console.log("this is from overview sharebox =>",isDetail);
     // Scroll to the top of the page when isDetail changes
  useEffect(() => {
    if (isDetail) {
      window.scrollTo(0, 0);
    }
  }, [isDetail]);

  if (loading) {
    return <Loader />;
  }

  // if (error) {
  //   return <div>No details available.</div>;
  // }

  // if (!isDetail) {
  //   return <div>No details available.</div>;
  // }

  if (error && !isDetail) {
    return <div>No details available.</div>;
  } else if (!isDetail) {
    return <div>No details available.</div>;
  }

  // console.log("isDetail",isDetail);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="card-title">
          <a href="#" className="text-decoration-none text-primary">
            {isDetail.s_title}
          </a>
        </h5>
        <p className="d-flex flex-column justify-content-between align-items-left">
          <span>{isDetail.created_by}</span>
          <span className="text-muted small">
            {new Date(isDetail.s_created_on).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </p>
      </div>

      {isDetail.keywords && isDetail.keywords.length > 0 ? (
        <p className="shareboxDetailTags">
          <strong>Tagged:</strong>{" "}
          {isDetail.keywords.map((keyword, index) => (
            <span
              key={index}
              onClick={(e) => handleTagKeyword(keyword)}
              className="shareboxDetailTagsList"
            >
              {keyword}
              {index < isDetail.keywords.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      ) : (
        ""
      )}

      {/* Body Content */}
      {isDetail.s_body !== "null" && isDetail.s_body ? (
        <>
          <div
            className="card-text"
            dangerouslySetInnerHTML={{
              __html: isDetail?.s_body,
            }}
          />
        </>
      ) : (
        <></>
      )}

      {/* file Content */}
      {isDetail.files && isDetail.files.length > 0 ? (
        <div>
          <FileDownloadTable files={isDetail.files} shareboxName={isDetail.s_title}/>
        </div>
      ) : null}
    </div>
  );
};
