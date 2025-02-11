import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

export const FinancialActivity = () => {
  const { getBankTransactions } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null); // Error state
  const [searchTerm, setSearchTerm] = useState("");

  const clientDataString = sessionStorage.getItem("client_data");
  if (!clientDataString) {
    console.error("Client data not found in sessionStorage.");
    setError("Client data not found. Please log in again.");
    return;
  }
  const clientData = JSON.parse(clientDataString);
  const clientIdFromStorage = clientData.client_id;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getBankTransactions(clientIdFromStorage);
        // console.log("getBankTransactions response:", response);
        setTransactions(Array.isArray(response) ? response : []); // Ensure response is an array
        setError(null); // Reset error if successful
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
        setError("Failed to load transactions. Please try again later."); // Set error message
      }
    };

    fetchTransactions();
  }, [getBankTransactions]);

  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter(
        (transaction) =>
          transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.currency.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="container mt-5">
        <div className="card shadow-lg">
          <div
            className="border-1 text-white d-flex justify-content-center align-items-center py-3"
            style={{
              background:
                "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <h5 className="mb-0 fw-bold text-white"   style={{ fontSize: "1.25rem" }}>Transaction History</h5>
          </div>

          <div className="card-body p-0">
            {error ? (
              <div
                className="alert alert-danger text-center"
                style={{ margin: "20px" }}
              >
                {error}
              </div>
            ) : (
              <div className="table-responsive">
               
                <table className="table table-bordered border table-striped table-hover mb-0 bg-light">
                  <thead>
                    <tr style={{ background: "rgba(177, 220, 228, 0.57)" }}>
                      <th className="text-center" style={{ width: "auto" }}>
                        Sr No
                        
                      </th>
                      <th className="text-center" style={{ width: "auto" }}>
                        Case ID
                      </th>
                      <th className="text-center" style={{ width: "auto" }}>
                        Transaction ID
                      </th>
                      <th className="text-center" style={{ width: "auto" }}>
                        Amount $
                      </th>
                      <th className="text-center" style={{ width: "auto" }}>
                        Payment Source
                      </th>
                      <th className="text-center" style={{ width: "auto" }}>
                        Transaction Type
                      </th>
                      <th className="text-center" style={{ width: "auto" }}>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            {transaction.case_id === 0 ? (
                              <span>{transaction.case_id}</span>
                            ) : (
                              <a
                                href={`allclients/client/${clientIdFromStorage}/case/${transaction.case_id}`}
                              >
                                {transaction.case_id}
                              </a>
                            )}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            {transaction.transaction_id}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            {transaction.amount}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            {transaction.source}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            {transaction.type}
                          </td>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "center",
                            }}
                          >
                            {formatDate(transaction.date)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          No transactions available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
