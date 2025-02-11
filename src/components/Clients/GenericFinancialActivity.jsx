import React, { useState, useEffect, Suspense, lazy } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useParams } from "react-router-dom"; // Import useParams
const GenericPage = lazy(() => import("../genericpage/GenericPage"));
const Loader = lazy(() => import("../Loader/Loader"));
const GenericFinancialActivity = () => {
  const { getBankTransactions } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null); // Error state
  const [tabs, setTabs] = useState([]);
  const { clientId } = useParams(); // Get clientId from route parameters
  const [loading, setLoading] = useState(true); // Loading state


  // Retrieve client data from session storage
  const clientDataString = sessionStorage.getItem("client_data");
  if (!clientDataString) {
    console.error("Client data not found in sessionStorage.");
    setError("Client data not found. Please log in again.");
    return null;
  }

  const clientData = JSON.parse(clientDataString);
  const clientIdFromStorage = clientData.client_id;

  // Fallback if clientId from URL is not defined
  const resolvedClientId = clientId || clientIdFromStorage;

  if (!resolvedClientId) {
    console.error("Client ID is missing in both URL and sessionStorage.");
    setError("Client ID not found. Please log in again.");
    return null;
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await getBankTransactions(resolvedClientId);
        setTransactions(Array.isArray(response) ? response : []); // Ensure response is an array
        setError(null); // Reset error if successful
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
        setError("Failed to load transactions. Please try again later."); // Set error message
      }finally {
        setLoading(false); // Stop loading
      }
    };

    fetchTransactions();
  }, [getBankTransactions, resolvedClientId]);

  useEffect(() => {
    if (transactions.length > 0) {
      setTabs([
        {
          label: "Transaction History",
          data: transactions,
          columns: getColumns(),
        },
      ]);
    }
  }, [transactions]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getColumns = () => [
    {
      field: "sr_no",
      header: "Sr\u00A0No",
      sortable: false, // Serial numbers shouldn't be sortable
      body: (_, { rowIndex }) => <span>{rowIndex + 1}</span>, // Use rowIndex for serial numbers
    },
    
    {
      field: "case_id",
      header: "Case\u00A0ID",
      sortable: true,
      body: (rowData) => {
        return rowData.case_id === 0 ? (
          <span>{rowData.case_id}</span>
        ) : (
          <a
            href={`/allclients/client/${resolvedClientId}/case/${rowData.case_id}`}
            className="text-decoration-none text-info"
          >
            {rowData.case_id}
          </a>
        );
      },
    },
    {
      field: "username",
      header: "Name",
      sortable: true,
    },
    {
      field: "amount",
      header: "Amount",
      sortable: true,
    },
    {
      field: "description",
      header: "Description",
      sortable: true,
      body: (rowData) => {
        const sanitizedDescription = rowData.description
          .replace(/<a /g, "<span ") // Replace <a> with <span>
          .replace(/<\/a>/g, "</span>"); // Replace </a> with </span>
    
        return (
          <div
            className="card-text"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        );
      },
    },
    {
      field: "source",
      header: "Payment\u00A0Source",
      sortable: true,
    },
    {
      field: "type",
      header: "Transaction\u00A0Type",
      sortable: true,
    },
    {
      field: "date",
      header: "Date",
      sortable: true,
      body: (rowData) => formatDate(rowData.date),
    },
  ];
  

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }
 
  if (loading) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Loader />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <GenericPage
      tabs={tabs}
      tableName="Transaction History"
      globalSearchFields={[  
        "case_id",
        "username",
        "description",
        "amount",
        "source",
        "type",
        "date",
      ]}
      searchPlaceholder="Search by Case ID, Name, Amount, Description, Type and Date"
      showExportButton={true}
      enableColumnFilters={true}
      rowsPerPageOptions={[10, 20, 50, 100]}
    /** NEW: Customize Excel export columns & order */
    exportOptions={{
      // EXACT columns & order you want in the Excel
      columns: [
        { field: "case_id", header: "Case ID" },
        { field: "username", header: "User" },
        { field: "amount", header: "Amount" },
        { field: "description", header: "Description" },
        { field: "source", header: "Payment Source"},
        { field: "type", header: "Transaction Type" },
        { field: "date", header: "Date/Time"},
      ],
      // (Optional) Provide a custom file name instead of "Case Details.xlsx"
      fileName: "Transaction History",
    }}
    />
    </Suspense>
  );
};

export default GenericFinancialActivity;

