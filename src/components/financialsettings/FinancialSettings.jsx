// =============================== 31/01/25 ================================

import React, { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Loader from "../Loader/Loader";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

const FROENTEND_URL = import.meta.env.VITE_BASE_FRONTEND_URL;

// Lazy-load ConfirmationModal
const ConfirmationModal = lazy(() => import("../popupmodal/ConfirmationMessage"));

export const FinancialSettings = () => {
  const {
    getClientMinimumFund,
    getAutopayDetails,
    enableAutoPay,
    disableAutoPay,
    getStripePaymentMethods,
    getStripePaymentMethodsLink,
  } = useAuth();

  const clientDataString = sessionStorage.getItem("client_data");
  if (!clientDataString) throw new Error("Client data not found.");
  const clientDataID = JSON.parse(clientDataString);
  const clientIdFromStorage = clientDataID.client_id;
  const stripeCustomerId = clientDataID.stripe_customer_id;

  // State variables
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [autoPayMinFund, setAutoPayMinFund] = useState("0");
  const [autoPayChargeAmount, setAutoPayChargeAmount] = useState("0");
  const [error, setError] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [backendCards, setBackendCards] = useState([]);
  const [stripeCards, setStripeCards] = useState([]);
  const [isStatusCheck, setStatusCheck] = useState(null);
  const [amount, setAmount] = useState(1);
  const [minAmount, setMinAmount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(true); // Initialize as true
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isCardConfirmVisible, setIsCardConfirmVisible] = useState(false);
  const [cardModalMessage, setCardModalMessage] = useState("");
  const [pendingSelectedCard, setPendingSelectedCard] = useState(null);

  // Combine all cards
  const allCards = [...stripeCards, ...backendCards];
  console.log("All Cards:", allCards);

  // CONFIRMATION for Selecting a Card as Default
  const handleSelectCardRadio = (cardId) => {
    setPendingSelectedCard(cardId);
    setCardModalMessage("Are you sure you want to set this card as the default payment method?");
    setIsCardConfirmVisible(true);
  };

  const handleCancelSetCard = () => {
    setIsCardConfirmVisible(false);
    setPendingSelectedCard(null);
  };

  const handleConfirmSetCard = async () => {
    if (!pendingSelectedCard || !clientData?.client_id) {
      setIsCardConfirmVisible(false);
      return;
    }

    try {
      await setDefaultPaymentMethod(clientData.client_id, pendingSelectedCard);
      toast.success("Default payment method updated successfully");
      setSelectedCardId(pendingSelectedCard);
    } catch (err) {
      toast.error("Failed to set default payment method");
    } finally {
      setIsCardConfirmVisible(false);
      setPendingSelectedCard(null);
    }
  };

  // BACKEND CALLS
  async function getDefaultPaymentMethod(clientId) {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/${clientId}/default_payment_method`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching default payment method:", err);
      throw err;
    }
  }

  async function setDefaultPaymentMethod(clientId, paymentMethodId) {
    const token = sessionStorage.getItem("token");
    try {
      const url = `${API_URL}/${clientId}/default_payment_method`;
      const response = await axios.post(
        `${url}?customer_id=${encodeURIComponent(stripeCustomerId)}&payment_method_id=${encodeURIComponent(paymentMethodId)}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error setting default payment method:", err.response?.data || err);
      throw err;
    }
  }

  // Fetch Payment Methods from Backend
  const fetchPaymentMethods = async () => {
    if (!clientData || !clientData.client_id) return;
    const response = await getClientMinimumFund(clientData.client_id);
    setBackendCards(response.data.cards || []);
    console.log("Backend Cards:", response.data.cards || []);
    setAutoPayEnabled(response.data.success);
    setAutoPayMinFund(response.data.minimum_fund);
    setAutoPayChargeAmount(response.data.charge_amount);
  };

  // Fetch Saved Card Methods from Stripe
  const fetchSaveCardMethods = async () => {
    if (!clientData || !clientData.stripe_customer_id) {
      console.error("Client Stripe Customer ID is missing.");
      return;
    }
    const response = await getStripePaymentMethods(clientData.stripe_customer_id);
    setStripeCards(response.data || []);
    console.log("Stripe Cards:", response.data || []);
  };

  // Fetch Autopay Status
  const fetchischeckStatus = async () => {
    const response = await getAutopayDetails(clientData.client_id);
    console.log("Autopay Status:", response);
    setStatusCheck(response.status || []);
  };

  // Handle AutoPay Toggle
  const handleAutoPayToggle = (e) => {
    const isStatusCheckLocal = e.target.checked ? 1 : 0;
    if (isStatusCheckLocal === 1) {
      setAutoPayEnabled(true);
    } else if (isStatusCheckLocal === 0) {
      setModalMessage("Are you sure you want to disable Auto Pay?");
      setIsModalVisible(true);
      setAutoPayEnabled(false);
    }
  };

  // Submit / Enable AutoPay
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientData || !clientData.client_id) {
      setError("Client data is missing.");
      return;
    }

    // Validate Minimum Fund
    if (autoPayEnabled && (!autoPayMinFund || isNaN(autoPayMinFund) || parseFloat(autoPayMinFund) <= 0)) {
      toast.error("Please enter a Minimum Fund Amount");
      document.getElementById("txt_min_fund").focus();
      return;
    }

    // Validate Charge Amount
    if (autoPayEnabled && (!autoPayChargeAmount || isNaN(autoPayChargeAmount) || parseFloat(autoPayChargeAmount) <= 0)) {
      toast.error("Please enter a Charge Amount");
      document.getElementById("txt_charge_amount").focus(); 
      return;
    }

    if (autoPayEnabled && !selectedCardId) {
      toast.error("Please select a card before enabling Auto Pay.");
      return;
    }

    const requestData = {
      data: {
        client_id: clientData.client_id,
        minimum_fund: parseFloat(autoPayMinFund),
        charge_amount: parseFloat(autoPayChargeAmount),
        default_payment_method_id: selectedCardId,
      },
    };

    setLoading(true);
    try {
      const response = await enableAutoPay(requestData);
      if (response.status === 200) {
        toast.success("AutoPay settings updated successfully!");
      } else {
        toast.error("Unexpected response from the server. Please try again.");
      }
    } catch (err) {
      console.error("Error enabling AutoPay:", err);
      setError("An error occurred while updating AutoPay settings.");
      toast.error("Failed to update AutoPay settings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Confirm Disable AutoPay
  const handleConfirmDisableAutoPay = async () => {
    setLoading(true);
    try {
      await callDisableAutoPayAPI();
      setAutoPayEnabled(false);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleCancelDisableAutoPay = () => {
    setAutoPayEnabled(true);
    setIsModalVisible(false);
  };

  const callDisableAutoPayAPI = async () => {
    if (!clientData || !clientData.client_id) {
      setError("Client data is missing.");
      return;
    }

    try {
      const response = await disableAutoPay(clientData.client_id);
      if (response.status === 200) {
        toast.success("AutoPay has been disabled successfully.");
      } else {
        toast.error("Failed to disable AutoPay. Please try again later.");
      }
    } catch (err) {
      console.error("Error disabling AutoPay:", err);
      setError("An error occurred while disabling AutoPay.");
      toast.error("Failed to disable AutoPay. Please try again later.");
    }
  };

  // Handle Inner Payment Submit (for adding a new card)
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
      success_url: `${FROENTEND_URL}/managefunds?success=true&amount=${encodeURIComponent(amount === 0 ? 1 : amount)}
      &stripe_payment_intent={PAYMENT_INTENT_ID_GOES_HERE}`,
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

        window.location.href = sessionResponse.data.url; // Redirect to Stripe Checkout
      } else {
        console.error("Stripe session creation failed");
        toast.error("Stripe session creation failed.");
      }
    } catch (error) {
      console.error("Error in payment submission:", error);
      toast.error("Error in payment submission.");
    }
  };

  // Fetch Client Data on Initial Render
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("client_data")) || {};
    setClientData(data);
  }, []);

  // Fetch Cards and Autopay Status when clientData changes
  useEffect(() => {
    if (clientData) {
      const fetchData = async () => {
        setLoading(true);
        try {
          await Promise.all([
            fetchSaveCardMethods(),
            fetchischeckStatus(),
            fetchPaymentMethods(),
          ]);
          // Fetch Default Payment Method after cards are loaded
          if (clientData.client_id) {
            const res = await getDefaultPaymentMethod(clientData.client_id);
            if (res.default_payment_method) {
              setSelectedCardId(res.default_payment_method.id);
            }
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load financial settings.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [clientData]);

  // If loading, show loader
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        {error && <div className="alert alert-danger mx-4">{error}</div>}

        <div className="m-4">
          <form onSubmit={handleSubmit} className="container mt-4 p-4 border rounded">
            <fieldset className="mb-4">
              <div
                className="form-item d-flex align-items-center justify-content-between border rounded p-2"
                style={{ backgroundColor: "#4fc9da" }}
              >
                <div
                  className="d-flex justify-content-center flex-grow-1"
                  style={{ position: "relative" }}
                >
                  <h5 className="modal-title text-center font-weight-bold text-black">
                    Financial Settings
                  </h5>
                </div>
              </div>

              <div
                className="form-check mb-2 pt-8 position-relative"
                style={{ fontSize: "0.85rem", color: "black" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input text-black"
                  id="chk_auto_fund_text"
                  checked={autoPayEnabled}
                  onChange={handleAutoPayToggle}
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "1px solid #000000",
                  }}
                  disabled={clientData?.client_pay_type === "Postpaid"}
                />
                <label
                  className="form-check-label text-black"
                  htmlFor="chk_auto_fund_text"
                >
                  Enable Auto Pay
                </label>
              </div>

              {autoPayEnabled && (
                <>
                  {/* Auto Pay Settings */}
                  <div className="container mt-4">
                    <div className="row">
                      <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <label htmlFor="txt_min_fund" className="form-label required">
                          Minimum Fund: $
                        </label>
                        <input
                          type="text"
                          className="form-control w-100"
                          placeholder="0"
                          id="txt_min_fund"
                          value={
                            autoPayMinFund && autoPayMinFund !== "None" ? autoPayMinFund : ""
                          }
                          onChange={(e) => setAutoPayMinFund(e.target.value)}
                        />
                      </div>

                      <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <label htmlFor="txt_charge_amount" className="form-label required">
                          Charge Amount: $
                        </label>
                        <input
                          type="text"
                          className="form-control w-100"
                          placeholder="0"
                          id="txt_charge_amount"
                          value={
                            autoPayChargeAmount && autoPayChargeAmount !== "None"
                              ? autoPayChargeAmount
                              : ""
                          }
                          onChange={(e) => setAutoPayChargeAmount(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Saved Cards Section */}
                    <div className="pt-5">
                      <div
                        className="form-item d-flex align-items-center justify-content-between border rounded p-2"
                        style={{ backgroundColor: "#4fc9da" }}
                      >
                        <div
                          className="d-flex justify-content-center flex-grow-1"
                          style={{ position: "relative" }}
                        >
                          <h5 className="modal-title text-center font-weight-bold text-black">
                            Saved{"\u00A0"}Cards
                          </h5>
                        </div>
                      </div>

                      <div className="table-responsive pt-5">
                        <table className="table table-responsive table-bordered table-striped table-hover">
                          <thead
                            style={{
                              color: "#ffffff",
                              backgroundColor: "#e3f2fd",
                              zIndex: 1,
                            }}
                          >
                            <tr className="text-center">
                              <th>Card</th>
                              <th className="text-black">Card{"\u00A0"}Type</th>
                              <th className="text-black">Saved{"\u00A0"}On</th>
                              <th className="text-black">Saved{"\u00A0"}By</th>
                              <th className="text-black">Use{"\u00A0"}this{"\u00A0"}Card</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allCards.length > 0 ? (
                              allCards.map((card) => (
                                <tr key={card.id} className="align-middle">
                                  <td className="text-center">
                                    ****{"\u00A0"}****{"\u00A0"}****{"\u00A0"}{card.card?.last4 || card.last4}
                                  </td>
                                  <td className="text-center">
                                    {card.card?.brand || card.brand || "N/A"}
                                  </td>
                                  <td className="text-center">
                                    {new Date(card.created * 1000).toLocaleDateString()}
                                  </td>
                                  <td className="text-center">
                                    {card.billing_details?.name || "N/A"}
                                  </td>
                                  <td className="text-center">
                                    <input
                                      type="radio"
                                      id={`use-card-${card.id}`}
                                      name="selectedCard"
                                      value={card.id}
                                      checked={selectedCardId === card.id}
                                      onChange={() => handleSelectCardRadio(card.id)}
                                    />
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center text-muted">
                                  No cards available.
                                  <p className="mt-2">
                                    No saved cards found. To set up AutoPay, a card should be added and saved. 
                                    Please add a new card from 
                                    <a
                                      href={`${FROENTEND_URL}/financialsettings`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleInnerPaymentSubmit(e);
                                      }}
                                      className="ms-1"
                                    >
                                      here.
                                    </a>
                                    <br />
                                    While payment, please select 'Save card details for future payments' checkbox.
                                  </p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </fieldset>

            {autoPayEnabled && (
              <button
                type="submit"
                className="btn text-black btn-sm"
                style={{
                  background: "#4fc9da",
                  cursor: autoPayEnabled && !selectedCardId ? "not-allowed" : "pointer",
                }}
                disabled={autoPayEnabled && !selectedCardId}
                title={
                  autoPayEnabled && !selectedCardId
                    ? "Please select a card to enable Auto Pay"
                    : ""
                }
              >
                <b>Submit</b>
              </button>
            )}
          </form>
        </div>

        {/* Confirmation Modal for DISABLING Auto Pay */}
        <ConfirmationModal
          show={isModalVisible}
          onConfirm={handleConfirmDisableAutoPay}
          onCancel={handleCancelDisableAutoPay}
          message={modalMessage}
          confirmButtonLabel="Yes, Disable"
          cancelButtonLabel="Cancel"
        />

        {/* Confirmation Modal for SELECTING a card as default */}
        <ConfirmationModal
          show={isCardConfirmVisible}
          onConfirm={handleConfirmSetCard}
          onCancel={handleCancelSetCard}
          message={cardModalMessage}
          confirmButtonLabel="Yes"
          cancelButtonLabel="No"
        />
      </Suspense>

      <Toaster />
    </>
  );
};
