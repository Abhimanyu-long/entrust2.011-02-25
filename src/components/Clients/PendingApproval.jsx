
import React, { useState, useEffect ,Suspense,lazy} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton"; 
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast"; 
import "primereact/resources/themes/saga-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons
import "../../assets/css/genericCases.css";
import "../../assets/css/genericPage.css";
import "../../assets/css/TransactionHistory.css";
const Loader = lazy(() => import("../Loader/Loader"));

export const PendingApproval = () => {
  const { getPaymentApprovalEstimates, sendApprovalEstimateData, getBankBalanceDashboard } = useAuth();

  const [caseData, setCaseData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({}); // Track selected option for each row
  const [liveBalance, setLiveBalance] = useState(0); // Tracks available funds
  const [requiredFund, setRequiredFund] = useState(0); // Tracks extra funds required

  const clientData = JSON.parse(sessionStorage.getItem("client_data")) || {};
  const [loading, setLoading] = useState(false); // Loader state



  useEffect(() => {

    const fetchEstimates = async () => {
      setLoading(true); 
      try {
          const estimates = await getPaymentApprovalEstimates(clientData.client_id);
          console.log("estimates", estimates);
          if (Array.isArray(estimates)) {
              setCaseData(estimates); // request_id should now be part of caseData
          } else {
              console.error("Invalid data format received:", estimates);
              setCaseData([]);
          }
      } catch (err) {
          console.error("Error fetching payment approval estimates:", err);
          setCaseData([]);
          toast.error("Unable to fetch data. Please check your connection or try again later.");
      } finally {
          setLoading(false);
      }
  };
  
   
    const fetchLiveBalance = async () => {
      try {
        const response = await getBankBalanceDashboard(clientData.client_id);
        setLiveBalance(response.data.balance); // Set initial available funds
      } catch (error) {
        console.error("Error fetching balance:", error);
        setLiveBalance(0);
      }
    };

    fetchEstimates();
    fetchLiveBalance();
  }, [getPaymentApprovalEstimates, getBankBalanceDashboard, clientData.client_id]);

  // Handle radio button selection change and update the balance accordingly
  const onRadioButtonChange = (rowData, value) => {
    setSelectedOptions((prevState) => {
      const prevAction = prevState[rowData.case_id]; // Get the previous action for this row
      const updatedOptions = { ...prevState, [rowData.case_id]: value }; // Update the selected option

      // Adjust the balance based on the new action
      let adjustedBalance = liveBalance;

      if (prevAction === "1") {
        adjustedBalance += rowData.amount; // Revert the deduction if the previous action was "Approve"
      }

      if (value === "1") {
        adjustedBalance -= rowData.amount; // Deduct if the new action is "Approve"
      }

      // Update balance and required fund if needed
      let adjustedRequiredFund = 0;
      if (adjustedBalance < 0) {
        adjustedRequiredFund = Math.abs(adjustedBalance);
        adjustedBalance = 0;
      }

      setLiveBalance(adjustedBalance);
      setRequiredFund(adjustedRequiredFund);

      return updatedOptions;
    });
  };

  const radioButtonTemplate = (rowData) => {
    return (
      <div className="d-flex align-items-center gap-2 p-2 rounded">
        <div className="d-flex align-items-center">
          <RadioButton
            inputId={`approve-${rowData.case_id}`}
            name={`option-${rowData.case_id}`}
            value="1"
            checked={selectedOptions[rowData.case_id] === "1"}
            onChange={() => onRadioButtonChange(rowData, "1")}
            style={{
              accentColor: selectedOptions[rowData.case_id] === "1" ? "green" : undefined,
            }}
          />
          <label htmlFor={`approve-${rowData.case_id}`} style={{ color: selectedOptions[rowData.case_id] === "1" ? "green" : "inherit" }}>
            Approve
          </label>
        </div>
        <div className="d-flex align-items-center">
          <RadioButton
            inputId={`reject-${rowData.case_id}`}
            name={`option-${rowData.case_id}`}
            value="2"
            checked={selectedOptions[rowData.case_id] === "2"}
            onChange={() => onRadioButtonChange(rowData, "2")}
            style={{
              accentColor: selectedOptions[rowData.case_id] === "2" ? "red" : undefined,
            }}
          />
          <label htmlFor={`reject-${rowData.case_id}`} style={{ color: selectedOptions[rowData.case_id] === "2" ? "red" : "inherit" }}>
            Reject
          </label>
        </div>
        <div className="d-flex align-items-center">
          <RadioButton
            inputId={`no-action-${rowData.case_id}`}
            name={`option-${rowData.case_id}`}
            value="0"
            checked={selectedOptions[rowData.case_id] === "0"}
            onChange={() => onRadioButtonChange(rowData, "0")}
          />
          <label htmlFor={`no-action-${rowData.case_id}`} style={{ cursor: "pointer" }}>
            No Action
          </label>
        </div>
      </div>
    );
  };

  const handleProceed = async () => {
    if (Object.keys(selectedOptions).length === 0) {
      toast.error("Please select an action for at least one case before proceeding.");
      return;
    }
  
    // Filter and map data for the payload, excluding request_id
    const approvalData = caseData
      .filter((caseItem) => selectedOptions[caseItem.case_id] && selectedOptions[caseItem.case_id] !== "0") 
      .map(({ request_id, ...caseItem }) => ({
        ...caseItem,
        action: parseInt(selectedOptions[caseItem.case_id]), 
      }));

      console.log("approvalData", approvalData);  
  
    try {
      const response = await sendApprovalEstimateData(clientData.client_id, approvalData);
  
      if (response.ok) {
        // Handle success
        let actions = [];
        approvalData.forEach((item) => {
          if (item.action === 1) {
            actions.push("Approved");
          } else if (item.action === 2) {
            actions.push("Rejected");
          }
        });
  
        const actionMessage = [...new Set(actions)].join("/");
        toast.success(`Estimate ${actionMessage} successfully!`);
  
        // Remove processed cases from the table
        const updatedCaseData = caseData.filter((caseItem) => !selectedOptions[caseItem.case_id]);
        setCaseData(updatedCaseData);
        setSelectedOptions({});
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error sending approval data:", err);
      toast.error("Failed to process selections. Please try again.");
    }
  };
  
  

  const amountTemplate = (rowData) => {
    return `$${rowData.amount.toFixed(2)}`;
  };

  const dateTemplate = (rowData) => {
    return new Date(rowData.date).toLocaleDateString();
  };
  const paginatorTemplate = {
    layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
    FirstPageLink: (options) => (
      <button onClick={options.onClick} disabled={options.disabled} className="btn btn-sm btn-outline-primary me-1">
      <i className="bi bi-chevron-double-left"></i>
    </button>
    ),
    PrevPageLink: (options) => (
      <button onClick={options.onClick} disabled={options.disabled} className="btn btn-sm btn-outline-primary me-1">
        <i className="bi bi-chevron-left"></i>
      </button>
    ),
    PageLinks: (options) => (
      <button
        onClick={options.onClick}
        className={`btn btn-sm ${options.className}`}
        disabled={options.disabled}
        style={{
          fontSize: "12px",
          padding: "0.25rem 0.5rem",
          backgroundColor: options.active ? "#4fc9da" : "#4fc9da",
          color: options.active ? "white" : "black",
          border: options.active ? "none" : "1px solid #ccc",
        }}
      >
        {options.page + 1}
      </button>
    ),
    NextPageLink: (options) => (
      <button
        onClick={options.onClick}
        disabled={options.disabled}
        className="btn btn-sm btn-outline-primary ms-1"
        style={{ fontSize: "12px", padding: "0.25rem 0.5rem" }}
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    ),
    LastPageLink: (options) => (
      <button
        onClick={options.onClick}
        disabled={options.disabled}
        className="btn btn-sm btn-outline-primary ms-1"
        style={{ fontSize: "12px", padding: "0.25rem 0.5rem" }}
      >
        <i className="bi bi-chevron-double-right"></i>
      </button>
    ),
  };

  if (loading) {
    return <Loader />;
  }

  console.log("caseData", caseData);

  return (
    <>
     <Suspense fallback={<div>Loading...</div>}>
     <div className="container">
        <div
          className="form-item d-flex align-items-center justify-content-center border rounded "
          style={{
            backgroundColor: "#4fc9da",
            padding: "0.75rem 1rem",
          }}
        >
          <h5 className="modal-title text-center w-100 font-weight-bold text-black">
            Approve Estimate For Cases
          </h5>
        </div>
      
       <div className="table-responsive">
        <DataTable value={caseData}   paginator paginatorTemplate={paginatorTemplate} rows={10}  emptyMessage="No data found." scrollable   className="custom-table">
          <Column  header={`Sr${'\u00A0'}No`}  body={(rowData, { rowIndex }) => rowIndex + 1} />
          <Column field="case_id"   headerStyle={{ textAlign: "center" }}  header={`Case${'\u00A0'}ID`}  />
          <Column field="request_id" header="Request ID"  headerStyle={{ textAlign: "center" }} body={(rowData) => rowData.request_id || "NA"}  />
          <Column field="case_title" header="Title"  headerStyle={{ textAlign: "center" }}  />
          <Column field="amount"  header="Amount $" headerStyle={{ textAlign: "center" }}  body={amountTemplate} />
          <Column field="description" header="Description"  headerStyle={{ textAlign: "center" }} body={(rowData) => rowData.request_id || "NA"} />
          <Column header="Action" body={radioButtonTemplate} />
        </DataTable>
        </div>
    
            <div className="mt-3 d-flex justify-content-between">
            <strong>Available Fund: ${liveBalance.toFixed(2)}</strong>
            <strong>Required Fund: ${requiredFund.toFixed(2)}</strong>
          </div>
        <div className="mt-4 text-center">
          <Button label="Proceed" icon="pi pi-check" className="" onClick={handleProceed} style={{ backgroundColor: "#4fc9da" }} />
        </div>
      </div>
</Suspense>
      <Toaster />
    </>
  );
};




