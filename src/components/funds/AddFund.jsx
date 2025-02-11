import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./../../assets/css/main.css";
import Loader from "../Loader/Loader";
import { encryptData } from "../common/crypto";
// import { PayByCard } from "./PayByCard";
// Utility to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

const FROENTEND_URL = import.meta.env.VITE_BASE_FRONTEND_URL;
// import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_FRONTEND_PORT;

export const AddFund = () => {
  const {
    getToBePaidInvoices,
    getStripePaymentMethods,
    getStripePaymentMethodsLink,
    getBankTransactions,
    getBankBalanceDashboard,
    convertTrialToPrepaid,
  } = useAuth();
  const navigate = useNavigate();
  const query = useQuery();

  // Fetching client data
  const clientDataString = sessionStorage.getItem("client_data");
  if (!clientDataString) throw new Error("Client data not found.");
  const clientData = JSON.parse(clientDataString);
  const clientIdFromStorage = clientData.client_id;
  const stripeCustomerId = clientData.stripe_customer_id;
  const ClientPayType = clientData.client_pay_type;
  const clientWalletBalance = clientData.client_balance;

  // States
  const [paymentType, setPaymentType] = useState("1");
  const [invoices, setInvoices] = useState([]);
  const [casewise, setCasewise] = useState([]);
  const [minAmount, setMinAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [amount, setAmount] = useState(1);
  const [cards, setCards] = useState([]);
  const [paymentSuccessHandled, setPaymentSuccessHandled] = useState(false); // Flag to handle success
  // New state for transactions
  const [transactions, setTransactions] = useState([]);
  const [liveBalance, setLiveBalance] = useState(0.0);

  // Handle Success and Filtering
  useEffect(() => {
    const success = query.get("success") === "true";
    const paidInvoices = query.get("paidInvoices");
    const paidCases = query.get("paidCases");
    const paidAmountParam = query.get("amount");

    // Retrieve amount from query params
    if (success && !paymentSuccessHandled) {
      // setPaymentSuccessHandled(true);
      // Remove or comment out the existing toast.success here
      // toast.success("Payment Successful!", { duration: 5000 });
      // console.log("Payment Successful Fired Successfully!");

      let allPaidInvoices = sessionStorage.getItem("paid_invoices");
      allPaidInvoices = allPaidInvoices ? JSON.parse(allPaidInvoices) : [];
      let allPaidCases = sessionStorage.getItem("paid_cases");
      allPaidCases = allPaidCases ? JSON.parse(allPaidCases) : [];

      if (paidInvoices) {
        const parsedPaidInvoices = JSON.parse(decodeURIComponent(paidInvoices));
        // console.log("Parsed Paid Invoices:", parsedPaidInvoices);
        allPaidInvoices = [...allPaidInvoices, ...parsedPaidInvoices];
        sessionStorage.setItem(
          "paid_invoices",
          JSON.stringify(allPaidInvoices)
        );
      }
      if (paidCases) {
        const parsedPaidCases = JSON.parse(decodeURIComponent(paidCases));
        // console.log("Parsed Paid Cases:", parsedPaidCases);
        allPaidCases = [...allPaidCases, ...parsedPaidCases];
        sessionStorage.setItem("paid_cases", JSON.stringify(allPaidCases));
      }

      // Retrieve the amount from query params
      const paidAmount = parseFloat(paidAmountParam) || 0;
      // console.log("Paid Amount from Query Params:", paidAmount);

      const handleTransaction = async () => {
        // Existing handleTransaction code with the added toast.success in Postpaid
        if (ClientPayType === "Postpaid") {
          try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${API_URL}/bank/transaction`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                client_id: clientIdFromStorage,
                amount: paidAmount,
                currency: clientData.currency.type || "USD",
                source: "Stripe",
                transaction_type: "deposit",
              }),
            });
            const stripePaymentIntent =
              sessionStorage.getItem("stripe_payment_intent") || "";
            await fetch(`${API_URL}/transactions`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                case_id: 0,
                t_transaction_code: "funds",
                t_amount: paidAmount,
                t_our_reference: "AddFundBankTransaction",
                t_bank_reference: "Stripe",
                t_balance: liveBalance.toFixed(2),
                t_proc_fee: 0,
                t_client_id: clientIdFromStorage,
                t_description: `$${paidAmount} successfully processed via Stripe and deposited in Entrust.`,
                t_payment_source: "Stripe",
                t_payment_status: 1,
                stripe_payment_intent: stripePaymentIntent,
              }),
            });

            if (response.ok) {
              toast.success("Payment Successful!");
            } else {
              toast.error("Payment failed. Please try again.");
            }
          } catch (error) {
            console.error("Error calling transaction API:", error);
            toast.error("An error occurred while processing the payment.");
          }
        } else {
          try {
            if (paidAmount === minAmount) {
              // console.log("Paid Amount Same", paidAmount);
              const token = sessionStorage.getItem("token");
              // Call the add transaction API for minimum funds
              await fetch(`${API_URL}/bank/transaction`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  client_id: clientIdFromStorage,
                  amount: paidAmount,
                  currency: clientData.currency.type || "USD",
                  source: "Stripe",
                  transaction_type: "deposit",
                }),
              });
              const stripePaymentIntent =
                sessionStorage.getItem("stripe_payment_intent") || "";
              await fetch(`${API_URL}/transactions`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  case_id: 0,
                  t_transaction_code: "funds",
                  t_amount: paidAmount,
                  t_our_reference: "AddFundBankTransaction",
                  t_bank_reference: "Stripe",
                  t_balance: liveBalance.toFixed(2),
                  t_proc_fee: 0,
                  t_client_id: clientIdFromStorage,
                  t_description: `$${paidAmount} successfully processed via Stripe and deposited in Entrust.`,
                  t_payment_source: "Stripe",
                  t_payment_status: 1,
                  stripe_payment_intent: stripePaymentIntent,
                }),
              });

              toast.success("Transaction completed successfully.");
            } else if (paidAmount > minAmount) {
              const extraAmount = paidAmount - minAmount;
              // console.log("Paid Amount Different", paidAmount, extraAmount);
              const token = sessionStorage.getItem("token");
              // Call the deposit API with extraAmount
              await fetch(`${API_URL}/bank/deposit`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  client_id: clientIdFromStorage,
                  amount: extraAmount,
                  currency: clientData.currency.type || "USD",
                  source: "Stripe",
                }),
              });
              // Call the add transaction API for minimum funds
              await fetch(`${API_URL}/bank/transaction`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  client_id: clientIdFromStorage,
                  amount: extraAmount,
                  currency: clientData.currency.type || "USD",
                  source: "Stripe",
                  transaction_type: "deposit",
                }),
              });
              const stripePaymentIntent =
                sessionStorage.getItem("stripe_payment_intent") || "";
              await fetch(`${API_URL}/transactions`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  case_id: 0,
                  t_transaction_code: "funds",
                  t_amount: extraAmount,
                  t_our_reference: "AddFundBankTransaction",
                  t_bank_reference: "Stripe",
                  t_balance: liveBalance.toFixed(2),
                  t_proc_fee: 0,
                  t_client_id: clientIdFromStorage,
                  t_description: `$${extraAmount} successfully processed via Stripe and deposited in Entrust.`,

                  t_payment_source: "Stripe",
                  t_payment_status: 1,
                  stripe_payment_intent: stripePaymentIntent,
                }),
              });

              handleConvertTrialToPrepaid();

              toast.success("Transaction and deposit completed successfully.");
            } else {
              toast.error(`Amount must be at least $${minAmount}.`);
            }
          } catch (error) {
            console.error("Error handling transaction:", error);
            toast.error("Error processing transaction.");
          }
        }
      };

      handleTransaction();
      navigate("/managefunds", { replace: true });
      setPaymentSuccessHandled(true);
    }
  }, [
    query,
    paymentSuccessHandled,
    navigate,
    ClientPayType,
    minAmount, // Add minAmount as a dependency
    clientIdFromStorage,
    clientData.currency.type,
  ]);
  // Fetch and Filter Invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const response = await getToBePaidInvoices(clientIdFromStorage);
        const stripeResponse = await getStripePaymentMethods(stripeCustomerId);

        // console.log("this is stripe detail",stripeResponse.data.length);//need one time to ask
        setCards(stripeResponse.data || []);

        // Parse the JSON string in response.data
        const parsedData = JSON.parse(response.data);
        // console.log("Parsed API Response Data:", parsedData);
        const invoiceWise = parsedData?.invoice_wise || {};
        const caseWiseData = parsedData?.casewise || {};
        // console.log("InvoiceWise Data: ", invoiceWise);
        // console.log("CaseWise Data: ", caseWiseData);

        if (
          !Object.keys(invoiceWise).length &&
          !Object.keys(caseWiseData).length
        ) {
          console.warn("No invoice or casewise data available.");
        }

        let formattedInvoices = Object.keys(invoiceWise)
          .filter((key) => invoiceWise[key]?.invoice_id)
          .map((key) => ({
            id: invoiceWise[key]?.invoice_id || "",
            invoiceNo: invoiceWise[key]?.invoice_no || "",
            invoiceDate: invoiceWise[key]?.invoice_date || "",
            invoiceAmount: invoiceWise[key]?.invoice_amount || "",
            paidAmount: invoiceWise[key]?.paid_amount || "",
            pendingAmount: invoiceWise[key]?.pending_amount || "",
            invoiceLink: invoiceWise[key]?.download_path || "#",
          }));

        let formattedCasewise = Object.keys(caseWiseData)
          .filter((key) => caseWiseData[key]?.case_id)
          .map((key) => ({
            invoiceNo: caseWiseData[key]?.invoice_no || "",
            invoiceDate: caseWiseData[key]?.invoice_date || "",
            caseId: caseWiseData[key]?.case_id || "",
            caseTitle: caseWiseData[key]?.case_title || "",
            amount: caseWiseData[key]?.amount || "0",
            invoiceLink: caseWiseData[key]?.download_path || "#",
            caseLink: caseWiseData[key]?.case_link || "#", // Ensure this field exists
          }));

        // Retrieve already paid invoices from sessionStorage
        let allPaidInvoices = sessionStorage.getItem("paid_invoices");
        allPaidInvoices = allPaidInvoices ? JSON.parse(allPaidInvoices) : [];

        // Retrieve already paid cases from sessionStorage
        let allPaidCases = sessionStorage.getItem("paid_cases");
        allPaidCases = allPaidCases ? JSON.parse(allPaidCases) : [];

        // Filter out paid invoices
        formattedInvoices = formattedInvoices.filter(
          (invoice) => !allPaidInvoices.includes(invoice.id)
        );

        // Filter out paid cases
        formattedCasewise = formattedCasewise.filter(
          (caseData) => !allPaidCases.includes(caseData.caseId)
        );

        setInvoices(formattedInvoices);
        setCasewise(formattedCasewise);
        // setCards(stripeResponse.data || []); // Correctly assign the array itself

        // console.log("Payment Methods", stripeResponse);
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [stripeCustomerId, clientIdFromStorage]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const stripeResponse = await getStripePaymentMethods(stripeCustomerId);
        setCards(stripeResponse.data || []);
        if (stripeResponse?.data?.length === 0) {
          setCards([]); // Explicitly set an empty array
        }
        // console.log("Payment Methods", stripeResponse);
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      }
    };
  });

  const handleInnerPaymentSubmit = async (e) => {
    e.preventDefault();
    if (amount < minAmount) {
      toast.error(`Please pay at least $${minAmount}.`);
      return;
    }

    if (minAmount < 1) {
      setAmount("1");
    }

    const sessionData = {
      success_url: `${FROENTEND_URL}/managefunds?success=true&paidInvoices=${encodeURIComponent(
        JSON.stringify(selectedInvoices)
      )}&paidCases=${encodeURIComponent(
        JSON.stringify(selectedCases)
      )}&amount=${encodeURIComponent(amount === 0 ? 1 : amount)}
      &stripe_payment_intent={PAYMENT_INTENT_ID_GOES_HERE}`, // Include amount here
      cancel_url: `${FROENTEND_URL}/managefunds`,
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Payment",
            },
            unit_amount: amount * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card", "us_bank_account"],
      payment_method_options: {
        card: {
          setup_future_usage: "off_session",
        },
        us_bank_account: {
          setup_future_usage: "off_session",
        },
      },
    };

    try {
      const sessionResponse = await getStripePaymentMethodsLink(
        clientIdFromStorage,
        sessionData
      );
      if (sessionResponse.data && sessionResponse.data.url) {
        sessionStorage.setItem(
          "stripe_payment_intent",
          sessionResponse.data.payment_intent
        );

        window.location.href = sessionResponse.data.url; // Redirects to Stripe Checkout
      } else {
        console.error("Stripe session creation failed");
        toast.error("Stripe session creation failed.");
      }
    } catch (error) {
      console.error("Error in payment submission:", error);
      toast.error("Error in payment submission.");
    }
  };

  const handleAddPaymentMethod = async () => {
    const sessionData = {
      success_url: `${FROENTEND_URL}/managefunds?success=true&paidInvoices=${encodeURIComponent(
        JSON.stringify([])
      )}&paidCases=${encodeURIComponent(
        JSON.stringify([])
      )}&amount=${encodeURIComponent(1)}`,
      cancel_url: `${FROENTEND_URL}/managefunds`,
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Add Payment Method" },
            unit_amount: 100, // $1 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card"],
    };

    try {
      const sessionResponse = await getStripePaymentMethodsLink(
        clientIdFromStorage,
        sessionData
      );
      if (sessionResponse?.data?.url) {
        sessionStorage.setItem(
          "stripe_payment_intent",
          sessionResponse.data.payment_intent
        );

        window.location.href = sessionResponse.data.url;
      } else {
        console.error("Stripe session creation failed");
      }
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      toast.error("Error creating Stripe session.");
    }
  };

  const handleInvoiceSelection = (e, id) => {
    const updatedSelection = e.target.checked
      ? [...selectedInvoices, id]
      : selectedInvoices.filter((item) => item !== id);
    setSelectedInvoices(updatedSelection);
    const totalAmount = invoices
      .filter((invoice) => updatedSelection.includes(invoice.id))
      .reduce(
        (sum, invoice) => sum + parseFloat(invoice.pendingAmount || 0),
        0
      );
    setAmount(totalAmount.toFixed(2));
  };

  const handleCaseSelection = (e, caseId) => {
    const updatedSelection = e.target.checked
      ? [...selectedCases, caseId]
      : selectedCases.filter((item) => item !== caseId);
    setSelectedCases(updatedSelection);
    const totalAmount = casewise
      .filter((caseData) => updatedSelection.includes(caseData.caseId))
      .reduce((sum, caseData) => sum + parseFloat(caseData.amount || 0), 0);
    setAmount(totalAmount.toFixed(2));
  };

  const checkAllInvoices = (e) => {
    const updatedSelection = e.target.checked
      ? invoices.map((item) => item.id)
      : [];
    setSelectedInvoices(updatedSelection);
    const totalAmount = invoices
      .filter((invoice) => updatedSelection.includes(invoice.id))
      .reduce(
        (sum, invoice) => sum + parseFloat(invoice.pendingAmount || 0),
        0
      );
    setAmount(totalAmount.toFixed(2));
  };

  const checkAllCases = (e) => {
    const updatedSelection = e.target.checked
      ? casewise.map((item) => item.caseId)
      : [];
    setSelectedCases(updatedSelection);
    const totalAmount = casewise
      .filter((caseData) => updatedSelection.includes(caseData.caseId))
      .reduce((sum, caseData) => sum + parseFloat(caseData.amount || 0), 0);
    setAmount(totalAmount.toFixed(2));
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setSelectedInvoices([]);
    setSelectedCases([]);
    setAmount("00.0");
  };

  useEffect(() => {
    const fetchMinAmount = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `${API_URL}/${encryptData(
            clientIdFromStorage
          )}/get_balance_adjusted_estimate_sum`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch minimum amount");
        }
        const data = await response.json();
        setMinAmount(data.adjusted_balance || 0);
        if (ClientPayType === ("Prepaid" || "Trail") && amount === 0) {
          setAmount(data.adjusted_balance);
        }
      } catch (error) {
        console.error("Error fetching minimum amount:", error);
        setMinAmount(1);
        if (ClientPayType === ("Prepaid" || "Trail") && amount === 0) {
          setAmount(1);
        }
      }
    };
    fetchMinAmount();
  }, [ClientPayType, clientIdFromStorage, amount]);

  // New useEffect to fetch last 5 transactions
  useEffect(() => {
    const clientDataString = sessionStorage.getItem("client_data");
    if (!clientDataString) return;

    const clientData = JSON.parse(clientDataString);
    const clientIdFromStorage = clientData.client_id;

    const fetchTransactions = async () => {
      try {
        const response = await getBankTransactions(clientIdFromStorage);
        setTransactions(response.slice(0, 5)); // Get last 5 transactions
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, [getBankTransactions, clientIdFromStorage]);

  // New useEffect to fetch Bank Balance
  useEffect(() => {
    const clientDataString = sessionStorage.getItem("client_data");
    if (!clientDataString) return;

    const clientData = JSON.parse(clientDataString);
    const clientIdFromStorage = clientData.client_id;

    const fetchLiveBalance = async () => {
      try {
        const response = await getBankBalanceDashboard(clientIdFromStorage);
        setLiveBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLiveBalance(0);
      }
    };

    fetchLiveBalance();
  }, [getBankTransactions, clientIdFromStorage]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const sessionData = {
      success_url:
        `${FROENTEND_URL}/managefunds?success=true&paidInvoices=${encodeURIComponent(
          JSON.stringify(selectedInvoices)
        )}&paidCases=${encodeURIComponent(JSON.stringify(selectedCases))}` +
        `&amount=${encodeURIComponent(amount === 0 ? 1 : amount)}`,
      cancel_url: `${FROENTEND_URL}/managefunds`,
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Payment" },
            unit_amount: parseFloat(amount) * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card", "us_bank_account"],
      payment_method_options: {
        card: {
          setup_future_usage: "off_session",
        },
        us_bank_account: {
          setup_future_usage: "off_session",
        },
      },
    };

    try {
      const sessionResponse = await getStripePaymentMethodsLink(
        clientIdFromStorage,
        sessionData
      );
      if (sessionResponse.data && sessionResponse.data.url) {
        sessionStorage.setItem(
          "stripe_payment_intent",
          sessionResponse.data.payment_intent
        );

        window.location.href = sessionResponse.data.url; // Redirects to Stripe Checkout
      } else {
        console.error("Stripe session creation failed");
      }
    } catch (error) {
      console.error("Error in payment submission:", error);
    }
  };

  const handleConvertTrialToPrepaid = async () => {
    try {
      const data = await convertTrialToPrepaid(clientIdFromStorage);

      // Assuming the API returns a 200 status if successful
      if (data?.status === 200) {
        const clientData = JSON.parse(
          sessionStorage.getItem("client_data") || "{}"
        );
        clientData.client_pay_type = "Prepaid"; // Update the payment type
        sessionStorage.setItem("client_data", JSON.stringify(clientData)); // Save it back to session storage
        console.log(
          "Successfully converted to prepaid and updated session data:",
          clientData
        );
      } else {
        console.warn("Conversion successful but status not 200");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container mt-4 rounded">
        <div className="fieldset-content clear-block ">
          <table className="table  table-responsive table-bordered table-striped table-hover">
            <tbody>
              {/* <tr>
                <td>
                  <div className="form-item">
                    <div className="p-3">
                      <p>
                        <b>Available Fund: </b>
                        <span className="text-primary">
                          ${clientWalletBalance}
                        </span>
                      </p>
                    </div>
                  </div>
                </td>
              </tr> */}
              {/* <tr>
                <td>
                  <div
                    className="form-item d-flex align-items-center justify-content-between border p-3 rounded text-grey-800 fs-4"
                    style={{
                      background: "#4fc9da",
                      // "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <strong>Available Fund:</strong>
                      <span
                        className="text-black fw-bold"
                        style={{ fontSize: "1.25rem" }}
                      >
                        ${liveBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
      {/* this is for pay */}
      <div className="container mt-4">
        {/* Pay By Card Section */}
        <fieldset className="fieldset titled collapsible border rounded p-4">
          <div className="fieldset-content clear-block">
            <div>
              <div className="form-item">
                <div className="app">
                  <div className="overlay active">
                    <div className="panel">
                      <div className="yield">
                        <div className="checkout-step">
                          <div className="payment">
                            {ClientPayType === "Postpaid" && (
                              <>
                                <div>
                                  <div className="number pay_by_ach_section mb-4 mt-4">
                                    <label
                                      className="mb-4 fw-semibold"
                                      style={{
                                        color: "#003F73",
                                        fontSize: "1.5rem",
                                      }}
                                    >
                                      <b> Payment By</b>
                                    </label>
                                    <br />
                                    <div>
                                      <div className="form-check form-check-inline">
                                        <input
                                          type="radio"
                                          name="payment_by_ach"
                                          value="1"
                                          checked={paymentType === "1"}
                                          onChange={handlePaymentTypeChange}
                                          className="form-check-input"
                                          style={{
                                            border: "1px solid #003F73",
                                          }}
                                        />
                                        <label className="form-check-label text-black">
                                          Invoicewise
                                        </label>
                                      </div>
                                      <div className="form-check form-check-inline">
                                        <input
                                          type="radio"
                                          name="payment_by_ach"
                                          value="2"
                                          checked={paymentType === "2"}
                                          onChange={handlePaymentTypeChange}
                                          className="form-check-input "
                                          style={{
                                            border: "1px solid #003F73",
                                          }}
                                        />
                                        <label className="form-check-label text-black">
                                          Casewise
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  {paymentType === "1" && (
                                    <div className="number payment_by_invoice pay_by_ach_section mt-3">
                                      <table className="table table-responsive table-bordered table-striped table-hover">
                                        <thead
                                          style={{
                                            color: "ffffff",
                                            background: "#4fc9da",
                                            // "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",
                                          }}
                                        >
                                          <tr>
                                            <th
                                              style={{
                                                textAlign: "center",
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={
                                                  selectedInvoices.length ===
                                                  invoices.length
                                                }
                                                onChange={(e) =>
                                                  checkAllInvoices(e)
                                                }
                                              />
                                            </th>
                                            <th
                                              className="text-black text-center"
                                              style={{ width: "20%" }}
                                            >
                                              Invoice&nbsp;No
                                            </th>
                                            <th
                                              className="text-black text-center"
                                              style={{ width: "20%" }}
                                            >
                                              Invoice&nbsp;Date
                                            </th>
                                            <th className="text-black text-center">
                                              Invoice Amount
                                            </th>
                                            <th className="text-black text-center">
                                              Paid&nbsp;Amount
                                            </th>
                                            <th className="text-black text-center">
                                              Pending&nbsp;Amount
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {Array.isArray(invoices) &&
                                            invoices.length > 0 ? (
                                            invoices.map((invoice) => (
                                              <tr key={invoice.id}>
                                                <td
                                                  className="text-center"
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  <input
                                                    type="checkbox"
                                                    value={invoice.id}
                                                    checked={selectedInvoices.includes(
                                                      invoice.id
                                                    )}
                                                    onChange={(e) =>
                                                      handleInvoiceSelection(
                                                        e,
                                                        invoice.id
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td className="text-center">
                                                  <a
                                                    href={invoice.invoiceLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    {invoice.invoiceNo}
                                                  </a>
                                                </td>
                                                <td className="text-center">
                                                  {invoice.invoiceDate}
                                                </td>
                                                <td className="text-center">
                                                  {invoice.invoiceAmount}
                                                </td>
                                                <td className="text-center">
                                                  {invoice.paidAmount}
                                                </td>
                                                <td className="text-center">
                                                  {invoice.pendingAmount}
                                                </td>
                                              </tr>
                                            ))
                                          ) : (
                                            <tr className="text-center">
                                              <td colSpan="6">
                                                No invoices available.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                      <p>
                                        Total Selected Invoices ::{" "}
                                        {selectedInvoices.length}
                                      </p>
                                    </div>
                                  )}
                                  {paymentType === "2" && (
                                    <div className="number pay_by_ach_section mt-3">
                                      <table className="table  table-responsive table-bordered table-striped table-hover">
                                        <thead
                                          style={{
                                            color: "ffffff",
                                            background:
                                              "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",
                                          }}
                                        >
                                          <tr>
                                            <th style={{ textAlign: "center" }}>
                                              <input
                                                type="checkbox"
                                                name="check_all_case"
                                                onChange={(e) =>
                                                  checkAllCases(e)
                                                }
                                                checked={
                                                  selectedCases.length ===
                                                  casewise.length
                                                }
                                              />
                                            </th>
                                            <th
                                              className="text-black text-center"
                                              style={{ width: "20%" }}
                                            >
                                              Invoice No
                                            </th>
                                            <th
                                              className="text-black text-center"
                                              style={{ width: "15%" }}
                                            >
                                              Invoice&nbsp;Date
                                            </th>
                                            <th className="text-black text-center">
                                              Case&nbsp;ID
                                            </th>
                                            <th
                                              className="text-black text-center"
                                              style={{ width: "25%" }}
                                            >
                                              Case&nbsp;Title
                                            </th>
                                            <th className="text-black text-center">
                                              Amount&nbsp;$
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {casewise.length > 0 ? (
                                            casewise.map((caseData) => (
                                              <tr key={caseData.caseId}>
                                                <td
                                                  className="text-center"
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  <input
                                                    type="checkbox"
                                                    value={caseData.caseId}
                                                    checked={selectedCases.includes(
                                                      caseData.caseId
                                                    )}
                                                    onChange={(e) =>
                                                      handleCaseSelection(
                                                        e,
                                                        caseData.caseId
                                                      )
                                                    }
                                                    className="text-center"
                                                  />
                                                </td>
                                                <td className="text-center">
                                                  <a
                                                    href={caseData.invoiceLink}
                                                    target="_blank"
                                                    title="Download Invoice"
                                                    rel="noopener noreferrer"
                                                    className="text-center"
                                                  >
                                                    {caseData.invoiceNo}
                                                  </a>
                                                </td>
                                                <td className="text-center">
                                                  {caseData.invoiceDate}
                                                </td>
                                                <td className="text-center">
                                                  {caseData.caseId}
                                                </td>
                                                <td className="text-center">
                                                  <a
                                                    href={caseData.caseLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    {caseData.caseTitle}
                                                  </a>
                                                </td>
                                                <td className="text-center">
                                                  {caseData.amount}
                                                </td>
                                              </tr>
                                            ))
                                          ) : (
                                            <tr className="text-center">
                                              <td colSpan="6">
                                                No casewise data available.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                      <p>
                                        Total Selected Cases ::{" "}
                                        {selectedCases.length}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <div className="number">
                                  <label htmlFor="txt_amount">Amount $</label>
                                  <input
                                    type="text"
                                    className="stripe_amt form-control"
                                    id="txt_amount"
                                    name="txt_amount"
                                    value={amount}
                                    readOnly
                                  />
                                </div>
                              </>
                            )}
                            {(ClientPayType === "Prepaid" ||
                              ClientPayType === "Trial") && (
                                <>
                                  <form onSubmit={handleInnerPaymentSubmit}>
                                    <div className="payment-form-container mt-3">

                                      <div
                                        className="form-item d-flex align-items-center justify-content-between border rounded p-2"
                                        style={{
                                          backgroundColor: "#4fc9da",
                                        }}
                                      >
                                        <div
                                          className="d-flex justify-content-center flex-grow-1"
                                          style={{ position: "relative" }}
                                        >
                                          <h5 className="modal-title text-center w-100 font-weight-bold text-black">
                                            Available Fund: $
                                            {liveBalance.toFixed(2)}
                                          </h5>
                                        </div>
                                      </div>
                                      <div className="form-group pt-4">
                                        <label
                                          htmlFor="amount"
                                          className="form-label "
                                          style={{ color: "#3f4254" }}
                                        >
                                          Amount $
                                        </label>
                                        <input
                                          type="number"
                                          id="amount"
                                          value={amount}
                                          onChange={(e) =>
                                            setAmount(Number(e.target.value))
                                          }
                                          step="0.01"
                                          min={minAmount || 1}
                                          required
                                          className="form-control"
                                          placeholder={`Enter Amount (min: $${minAmount || 0
                                            })`}
                                        />
                                        <small className="form-text text-muted">
                                          Minimum amount: ${minAmount || 1}
                                        </small>
                                      </div>
                                      {/* Payment Button */}
                                      <div className="mt-3 text-center">
                                        <button
                                          type="submit"
                                          disabled={amount === 0 || loading}
                                          id="btn_payment_submit"
                                          className="btn btn-primary btn-sm"
                                          style={{
                                            background: "#4fc9da",
                                            // "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",
                                            color: "#000000",
                                          }}
                                        >
                                          {loading ? (
                                            <>
                                              <span
                                                className="spinner-border spinner-border-sm text-bold"
                                                role="status"
                                                aria-hidden="true"
                                              ></span>
                                              Processing...
                                            </>
                                          ) : (
                                            "Pay Here"
                                          )}
                                        </button>
                                        {amount === 0 && (
                                          <p className="text-danger mt-2">
                                            Pay at least $
                                            {minAmount > 0 ? minAmount : 1}.
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </form>
                                </>
                              )}

                            {ClientPayType === "Postpaid" && (
                              <div className="mt-3">
                                <button
                                  id="btn_payment_submit"
                                  className="btn btn-primary btn-sm text-white"
                                  style={{
                                    background: "#4fc9da",
                                    // "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",
                                  }}
                                  onClick={handlePaymentSubmit}
                                  disabled={parseFloat(amount) === 0 || loading}
                                >
                                  {loading ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      Processing...
                                    </>
                                  ) : (
                                    <b>Pay Here</b>
                                  )}
                                </button>
                                {parseFloat(amount) === 0 && (
                                  <p className="text-danger mt-2">
                                    Pay at least $1.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {cards.length === 0 ? (
              <p>
                No payment methods available. Please add a new card from
                <a
                  href={`${FROENTEND_URL}/managefunds`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleInnerPaymentSubmit(e);
                  }}
                >
                  {" "}
                  here.{" "}
                </a>
                While payment, please select 'Save card details for future
                payments' checkbox.
              </p>
            ) : (
              <div>{/* Do nothing if payment methods found. */}</div>
            )}
          </div>
        </fieldset>
      </div>
      {/* <PayByCard /> */}
      {/* this is last five transaction */}
      <div className="container mt-4">
        <fieldset className="fieldset titled collapsible tao-processed border p-3 rounded shadow-sm">

          <div
            className="form-item d-flex align-items-center justify-content-between border rounded p-2"
            style={{
              backgroundColor: "#4fc9da",
            }}
          >
            <div
              className="d-flex justify-content-center flex-grow-1"
              style={{ position: "relative" }}
            >
              <h5 className="modal-title text-center w-100 font-weight-bold text-black">
                Last Five Transactions
              </h5>
            </div>
          </div>
          <div className="fieldset-content pt-5">
            <div className="table-responsive">
              <table className="table table-responsive table-bordered table-striped pt-5">
                <thead
                  style={{
                    color: "ffffff",
                    backgroundColor: "#e3f2fd",
                    zIndex: 1,
                    // "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",
                  }}
                >
                  <tr className="text-center">
                    <th className="text-black">Sr&nbsp;No</th>
                    <th className="text-black">Case&nbsp;ID</th>
                    <th className="text-black">Transaction&nbsp;ID</th>
                    <th className="text-black">Amount&nbsp;$</th>
                    <th className="text-black">Payment&nbsp;Source</th>
                    <th className="text-black">Transaction&nbsp;Type</th>
                    <th className="text-black">Date/Time</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={transaction.transaction_id || index}>
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
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(transaction.date).toLocaleString()}
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
          </div>
        </fieldset>
      </div>
    </>
  );
};
