
import React, { Suspense, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "../../assets/css/notebook.css";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

export const Notebook = ({ onShareboxId }) => {
  const { getShareNoteBook } = useAuth();
  const [notebooks, setNotebooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]); // Track expanded IDs
  const navigate = useNavigate();

  const client = JSON.parse(sessionStorage.getItem("client_data"));
  const client_ID = client?.client_id;

  useEffect(() => {
    const fetchShareBoxDetail = async () => {
      setLoading(true);
      try {
        const response = await getShareNoteBook(client_ID);
        if (response.status === 1) {
          setNotebooks(response.message);
        } else {
          setError(
            "We couldn’t load your notebook right now. Please check your connection and try again."
          );
        }
      } catch (error) {
        console.error("Error fetching notebook data:", error);
        setError(
          "Something went wrong while loading your notebook. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (client_ID) {
      fetchShareBoxDetail();
    }
  }, [getShareNoteBook, client_ID]);

  const toggleExpand = (id) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((expandedId) => expandedId !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  // Helper function to get children for a given ID
  const getChildren = (parentId) => {
    return notebooks.filter((note) => note.parent_id === parentId);
  };

  // const handleItemClick = (sharebox_id) => {
  //   onShareboxId(sharebox_id);
  // };

  const handleItemClick = (sharebox_id, s_project_id) => {
    if (s_project_id > 0) {
      navigate(`/myprojects/${s_project_id}`);
    } else {
      onShareboxId(sharebox_id);
    }
  };

  // Recursive Component to Render Notebook Items
  const renderNotebookItem = (item) => {
    const children = getChildren(item.sharebox_id);
    const isExpanded = expandedItems.includes(item.sharebox_id);

    return (
      <li key={item.sharebox_id} className="notebook-item">
        <div
          className={`d-flex align-items-center notebook-item-header ${
            children.length > 0 ? "has-children" : ""
          }`}
        >
          {children.length > 0 && (
            <span
              className={`toggle-icon ${
                isExpanded ? "expanded" : "collapsed"
              }`}
              onClick={() => toggleExpand(item.sharebox_id)}
            >
              {isExpanded ? "➖" : "➕"}
            </span>
          )}
          <span
            className="notebook-item-title"
            // onClick={() => handleItemClick(item.sharebox_id)}
            onClick={() => handleItemClick(item.sharebox_id, item.s_project_id)}
          >
            📄 {item.title}
          </span>
        </div>
        {isExpanded && children.length > 0 && (
          <ul className="notebook-children">
            {children.map((child) => renderNotebookItem(child))}
          </ul>
        )}
      </li>
    );
  };

  // Error is displayed
  // if (error) {
  //   return <div className="text-danger text-center">{error}</div>;
  // }

  if (loading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
    <div className="notebook">
      <div className="notebook-header">
        <h3 className="text-primary">Notebook</h3>
      </div>
      <div className="notebook-body">
        {notebooks.length === 0 ? (
          <p className="text-center text-muted">No notes available.</p>
        ) : (
          <ul className="notebook-list">
            {notebooks
              .filter((note) => note.parent_id === 0)
              .map((parent) => renderNotebookItem(parent))}
          </ul>
        )}
      </div>
    </div>
     </Suspense>
  );
};
