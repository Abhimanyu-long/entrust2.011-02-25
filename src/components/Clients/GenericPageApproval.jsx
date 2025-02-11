import React, { useState, useEffect } from "react";
import GenericPage from "../genericpage/GenericPage";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export const GenericPageApproval = () => {
  const { getPaymentApprovalEstimates, sendApprovalEstimateData, getBankBalanceDashboard } = useAuth();

  const [caseData, setCaseData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [liveBalance, setLiveBalance] = useState(0);
  const [requiredFund, setRequiredFund] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const clientData = JSON.parse(sessionStorage.getItem("client_data")) || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const estimates = await getPaymentApprovalEstimates(clientData.client_id);
        const balanceResponse = await getBankBalanceDashboard(clientData.client_id);
        setCaseData(Array.isArray(estimates) ? estimates : []);
        setLiveBalance(balanceResponse?.data?.balance || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getPaymentApprovalEstimates, getBankBalanceDashboard, clientData.client_id]);

  useEffect(() => {
    if (caseData.length > 0) {
      setTabs([
        {
          label: "Pending Approvals",
          data: caseData,
          columns: getColumns(),
        },
      ]);
    }
  }, [caseData]);

  const handleRadioButtonChange = (rowData, value) => {
    setSelectedOptions((prevState) => {
      const prevAction = prevState[rowData.case_id];
      const updatedOptions = { ...prevState, [rowData.case_id]: value };

      let updatedBalance = liveBalance;

      if (prevAction === "1") {
        updatedBalance += rowData.amount;
      }

      if (value === "1") {
        updatedBalance -= rowData.amount;
      }

      let updatedRequiredFund = 0;
      if (updatedBalance < 0) {
        updatedRequiredFund = Math.abs(updatedBalance);
        updatedBalance = 0;
      }

      setLiveBalance(updatedBalance);
      setRequiredFund(updatedRequiredFund);

      return updatedOptions;
    });
  };

  const handleProceed = async () => {
    if (Object.keys(selectedOptions).length === 0) {
      toast.error("Please select an action for at least one case before proceeding.");
      return;
    }

    const approvalData = caseData
      .filter((caseItem) => selectedOptions[caseItem.case_id] && selectedOptions[caseItem.case_id] !== "0")
      .map((caseItem) => ({
        ...caseItem,
        action: parseInt(selectedOptions[caseItem.case_id]),
      }));

    try {
      await sendApprovalEstimateData(clientData.client_id, approvalData);
      toast.success("Selections processed successfully.");
      const updatedCaseData = caseData.filter((caseItem) => !selectedOptions[caseItem.case_id]);
      setCaseData(updatedCaseData);
      setSelectedOptions({});
    } catch (error) {
      console.error("Error processing selections:", error);
      toast.error("Failed to process selections. Please try again.");
    }
  };

  const radioButtonTemplate = (rowData) => (
    <div className="d-flex align-items-center gap-2">
      {["1", "2", "0"].map((value) => (
        <div key={value} className="d-flex align-items-center">
          <input
            type="radio"
            id={`option-${rowData.case_id}-${value}`}
            name={`option-${rowData.case_id}`}
            value={value}
            checked={selectedOptions[rowData.case_id] === value}
            onChange={() => handleRadioButtonChange(rowData, value)}
          />
          <label htmlFor={`option-${rowData.case_id}-${value}`} style={{ marginLeft: "5px" }}>
            {value === "1" ? "Approve" : value === "2" ? "Reject" : "No Action"}
          </label>
        </div>
      ))}
    </div>
  );

  const getColumns = () => [
    {
      field: "case_id",
      header: "Case ID",
      sortable: true,
    },
    {
      field: "case_title",
      header: "Title",
      sortable: true,
    },
    {
      field: "amount",
      header: "Amount ($)",
      body: (rowData) => `$${rowData.amount.toFixed(2)}`,
      sortable: true,
    },
    {
      field: "date",
      header: "Date",
      body: (rowData) => new Date(rowData.date).toLocaleDateString(),
      sortable: true,
    },
    {
      field: "description",
      header: "Description",
      sortable: false,
    },
    {
      field: "action",
      header: "Action",
      body: radioButtonTemplate,
    },
  ];

  return (
    <div className="card bg-light p-3">
      <GenericPage
        tabs={tabs}
        tableName="Approve Estimate For Cases"
        globalSearchFields={["case_id", "case_title", "amount", "description"]}
        onTabChange={(index) => console.log("Tab changed to:", index)}
      />
      <div className="mt-4 d-flex justify-content-between px-4">
        <strong>
          <span style={{ color: "#28a745" }}>Available fund:</span> ${liveBalance.toFixed(2)}
        </strong>
        <strong>
          <span style={{ color: "#dc3545" }}>Required fund:</span> ${requiredFund.toFixed(2)}
        </strong>
      </div>
      <div className="mt-3 text-center">
        <button
          className="btn btn-primary"
          onClick={handleProceed}
          style={{ backgroundColor: "#4fc9da", borderColor: "#4fc9da" }}
        >
          Proceed
        </button>
      </div>
      <Toaster />
    </div>
  );
};
