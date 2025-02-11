import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import ConfirmationModal from "../popupmodal/ConfirmationMessage";

// const cards = [
//   {
//     id: 1,
//     cardNumber: `****${'\u00A0'}****${'\u00A0'}****${'\u00A0'}4006`,
//     cardType: "American Express",
//     savedOn: "2021-09-23 22:07:10",
//     autoPay: true,
//     amountToCharge: 200,
//     maxAmount: 20000,
//   },
//   {
//     id: 2,
//     cardNumber: `****${'\u00A0'}****${'\u00A0'}****${'\u00A0'}4006`,
//     cardType: "American Express",
//     savedOn: "2022-01-03 22:10:58",
//     autoPay: false,
//     amountToCharge: 0,
//     maxAmount: 20000,
//   },
// ];

export const PayByCard = () => {
  const {
    getClientMinimumFund,
    enableAutoPay,
    disableAutoPay,
    getStripePaymentMethods,
  } = useAuth();

  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [autoPayMinFund, setAutoPayMinFund] = useState("0.00");
  const [autoPayChargeAmount, setAutoPayChargeAmount] = useState("0.00");
  const [error, setError] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [cards, setCards] = useState([]);
  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false); // Controls visibility
  const [modalMessage, setModalMessage] = useState(""); // Modal message

  // save card
  const [isSaveCard, setSaveCard] = useState();

  // Fetching client data
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("client_data")) || {};
    if (!data.client_pay_type) {
    }
    // const stripeCustomerId = clientData.stripe_customer_id;
    setClientData(data);
  }, []);

  // Fetch Payment Methods
  const fetchPaymentMethods = async () => {
    if (!clientData || !clientData.client_id) return;

    try {
      const response = await getClientMinimumFund(clientData.client_id);
      // console.log("response getClientMinimumFund:", response.data);
      setAutoPayEnabled(response.data.success);
      setAutoPayMinFund(response.data.minimum_fund);
      setAutoPayChargeAmount(response.data.charge_amount);
      setCards(response.data.cards || []);
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      // setError("Failed to load payment methods.");
    }
  };
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("client_data")) || {};
    setClientData(data);
  }, []);

  // Fetch save card Methods
  const fetchSaveCardMethods = async () => {
    if (!clientData || !clientData.stripe_customer_id) {
      console.error("Client Stripe Customer ID is missing.");
      return;
    }

    try {
      const response = await getStripePaymentMethods(
        clientData.stripe_customer_id
      );
      console.log("Stripe Response => ", response); // Debug the response
      setCards(response.data || []); // Set cards state
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      setError("Failed to load saved cards.");
    }
  };

  // Fetch autopay details
  useEffect(() => {
    if (clientData) {
      fetchPaymentMethods();
      fetchSaveCardMethods();
    }
  }, [clientData]);

  // const handleAutoPayToggle = () => {
  //   setAutoPayEnabled((prevState) => !prevState);
  // };

  const handleAutoPayToggle = () => {
    if (autoPayEnabled) {
      setModalMessage("Are you sure you want to disable Auto Pay?");
      setIsModalVisible(true); // Show the modal
    } else {
      setAutoPayEnabled(true); // Check the checkbox and enable AutoPay
    }
  };

  const handleEnableAutoPay = async (e, cardId) => {
    e.preventDefault();
  
    if (!clientData || !clientData.client_id) {
      setError("Client data is missing.");
      return;
    }
  
    // Validate fields
    const { minFund, amountToCharge } = editableFields;
    if (!minFund || !amountToCharge) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    const requestData = {
      data: {
        client_id: clientData.client_id,
        card_id: cardId, // Add card-specific ID
        minimum_fund: parseFloat(minFund),
        charge_amount: parseFloat(amountToCharge),
      },
    };
  
    try {
      const response = await enableAutoPay(requestData);
      if (response.status === 200) {
        toast.success("AutoPay settings updated successfully!");
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === cardId ? { ...card, autoPay: true, ...editableFields } : card
          )
        );
        setEditableCardId(null); // Exit edit mode
        setAutoPayChanged(false); // Reset change tracking
      } else {
        toast.error("Unexpected response from the server. Please try again.");
      }
    } catch (err) {
      console.error("Error enabling AutoPay:", err);
      toast.error("Failed to update AutoPay settings. Please try again later.");
    }
  };
  

  const handleConfirmDisableAutoPay = () => {
    callDisableAutoPayAPI(); // Your API call to disable AutoPay here
    setAutoPayEnabled(false); // Disable AutoPay and uncheck the checkbox
    setIsModalVisible(false); // Close the modal
  };

  const handleCancelDisableAutoPay = () => {
    setAutoPayEnabled(true); // Keep the checkbox checked
    setIsModalVisible(false); // Close the modal
  };

  // Function to call the API for disabling AutoPay
  const callDisableAutoPayAPI = async () => {
    if (!clientData || !clientData.client_id) {
      setError("Client data is missing.");
      return;
    }

    try {
      const response = await disableAutoPay(clientData.client_id);
      // console.log(response);
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

  const [editableCardId, setEditableCardId] = useState(null); // Track which card is being edited
  const [editableFields, setEditableFields] = useState({});
  const [autoPayChanged, setAutoPayChanged] = useState(false);

  const handleAutoPayChange = (cardId, event) => {
    console.log("event-", event.target.checked);

    if (event.target.checked) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? { ...card, autoPay: !card.autoPay } // Toggle `autoPay`
            : { ...card, autoPay: false } // Uncheck others
        )
      );

      const selectedCard = cards.find((card) => card.id === cardId);
      if (selectedCard) {
        setEditableFields({
          minFund: selectedCard.minFund || "",
          amountToCharge: selectedCard.amountToCharge || "",
          authorizedBy: selectedCard.authorizedBy || "",
          authorizedOn: selectedCard.authorizedOn || "",
        });
        setEditableCardId(cardId); // Set the card in edit mode
      } else {
        setEditableFields({});
        setEditableCardId(null);
      }
      setAutoPayChanged(true);
    } else {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? { ...card, autoPay: false }
            : { ...card, autoPay: false }
        )
      );
      setEditableCardId(null);
      setEditableFields({});
      setAutoPayChanged(false); // Mark that Auto Pay state has changed
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
    if (fieldName == "amountToCharge") {
      setAutoPayChargeAmount(value);
    } else if (fieldName == "minFund") {
      setAutoPayMinFund(value);
    }
    setAutoPayChanged(true); // Mark that changes have been made
  };
  const handleSave = (cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, ...editableFields } : card
      )
    );
    setEditableCardId(null); // Exit edit mode
    setAutoPayChanged(false); // Reset change tracking
  };
  const handleDiscard = (event, cardId) => {
    event.preventDefault();
    const originalCard = cards.find((card) => card.id === cardId);
    setEditableFields({
      minFund: originalCard?.minFund || "",
      amountToCharge: originalCard?.amountToCharge || "",
      authorizedBy: originalCard?.authorizedBy || "",
      authorizedOn: originalCard?.authorizedOn || "",
    });
    setEditableCardId(null); // Exit edit mode
    setAutoPayChanged(false); // Reset change tracking
  };

  return (
    <>
      {error && <div className="alert alert-danger mx-4">{error}</div>}

      <div className="m-4">
        <form

          className="container  p-4 border rounded"
        >
          <fieldset className="mb-4">


            {autoPayEnabled && (
              <>
                <div className="">

                  <br />
                  <br />
                  {/* this is for save card */}
                  {/* <div
                    className="form-item d-flex align-items-center justify-content-center border rounded "

                    style={{
                      backgroundColor: "#4fc9da",
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <h5 className="modal-title text-center w-100 font-weight-bold text-black">
                      Pay By Card
                    </h5>
                  </div> */}
                  <div>
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
                          Pay By Card
                        </h5>
                      </div>
                      {autoPayChanged && (
                        <div className="d-flex justify-content-center align-items-center">
                          <button
                            className="btn btn-success btn-sm me-2 p-2" // Use 'me-2' for margin-right
                            onClick={(e) => handleEnableAutoPay(e, editableCardId)}

                          >
                            Save
                          </button>
                          <button
                            className="btn btn-danger btn-sm p-2"
                            onClick={(e) => handleDiscard(e, card.id)}
                          >
                            Discard
                          </button>
                        </div>
                      )}
                    </div>


                    <div className=" table-responsive pt-5">
                      <table className="table table-responsive  table-bordered table-striped table-hover">
                        <thead
                          style={{
                            color: "ffffff",
                            backgroundColor: "#e3f2fd",
                            zIndex: 1,
                            // "linear-gradient(145deg, rgb(0, 63, 115) 0%, rgb(17, 72, 108) 100%)",
                          }}
                        >
                          <tr className="text-center">
                            <th>Card</th>
                            <th className="text-black">Card{'\u00A0'}Type</th>
                            <th className="text-black">Saved{'\u00A0'}On</th>
                            <th className="text-black">Use{'\u00A0'}this{'\u00A0'}Card</th>
                            <th className="text-black">Remove{'\u00A0'}Card</th>
                            <th className="text-black">Auto{'\u00A0'}Pay?</th>
                            <th className="text-black">Min{'\u00A0'}Fund</th>
                            <th className="text-black">Amount{'\u00A0'}to{'\u00A0'}Charge</th>
                            <th className="text-black">Authorized{'\u00A0'}By</th>
                            <th className="text-black">Authorized{'\u00A0'}On</th>
                          </tr>
                        </thead>
                        {/* <tbody>
                        {cards.length > 0 ? (
                          cards.map((card) => (
                            <tr key={card.id}>
                              <td>****{'\u00A0'}****{'\u00A0'}****{'\u00A0'}{card.card.last4}</td>
                              <td className="text-center">{card.card.brand}</td>
                              <td className="text-center">
                                {new Date(
                                  card.created * 1000
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                <a href=""

                                  onClick={() => handleUseCard(card.id)}
                                >
                                  Use{'\u00A0'}this{'\u00A0'}Card
                                </a>
                              </td>
                              <td>
                                <a href=""

                                  onClick={() => handleRemoveCard(card.id)}
                                >
                                  Remove{'\u00A0'}Card
                                </a>
                              </td>


                              <td className="d-flex justify-content-center align-items-center border-0">
                                <input
                                  type="checkbox"
                                  checked={card.autoPay}
                                  className="form-check-input p-2"
                                  readOnly
                                />
                              </td>
                              <td>
                                {card.minFund || ""}

                              </td>
                              <td>
                                {card.amountToCharge || ""}

                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No cards available.
                            </td>
                          </tr>
                        )}
                      </tbody> */}
                        <tbody>
                          {cards.length > 0 ? (
                            cards.map((card) => (
                              <tr key={card.id} className="align-middle">
                                <td className="text-center">****{'\u00A0'}****{'\u00A0'}****{'\u00A0'}{card.card.last4}</td>
                                <td className="text-center">{card.card.brand}</td>
                                <td className="text-center">
                                  {new Date(card.created * 1000).toLocaleDateString()}
                                </td>
                                <td className="text-center">
                                  <a href="#" className="text-decoration-none text-primary" onClick={() => console.log("Use Card:", card.id)}>
                                    Use this Card
                                  </a>
                                </td>
                                <td className="text-center">
                                  <a href="#" className="text-decoration-none text-danger" onClick={() => console.log("Remove Card:", card.id)}>
                                    Remove Card
                                  </a>
                                </td>
                                <td className="text-center">
                                  <input
                                    type="checkbox"
                                    checked={card.autoPay}
                                    onChange={(e) => handleAutoPayChange(card.id, e)}
                                    className="form-check-input"
                                  />
                                </td>
                                {card.id === editableCardId ? (
                                  <>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control p-1 fs-8"
                                        value={autoPayMinFund}
                                        onChange={(e) => handleFieldChange("minFund", e.target.value)}
                                      />
                                    </td>
                                    <td className="align-middle">
                                      {card.id === editableCardId ? (
                                        <div className="d-flex flex-column pt-4">
                                          <input
                                            type="text"
                                            className="form-control mb-1 p-1 fs-8"
                                            value={autoPayChargeAmount}
                                            onChange={(e) =>
                                              handleFieldChange("amountToCharge", e.target.value)
                                            }
                                            placeholder="Enter Amount"
                                          />
                                          <small className="text-muted fs-9">Max $20,000.00</small>
                                        </div>
                                      ) : (
                                        card.amountToCharge || "--"
                                      )}
                                    </td>

                                    <td className="text-center">{card.authorizedBy || "--"}</td>
                                    <td className="text-center">
                                      {card.authorizedOn
                                        ? new Date(card.authorizedOn).toLocaleString()
                                        : "--"}
                                    </td>

                                  </>
                                ) : (
                                  <>
                                    <td className="text-center">{card.minFund}</td>
                                    <td className="text-center">{card.amountToCharge}</td>
                                    <td className="text-center">{card.authorizedBy}</td>
                                    <td className="text-center">
                                      {card.authorizedOn ? new Date(card.authorizedOn).toLocaleString() : ""}
                                    </td>

                                  </>
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="11" className="text-center text-muted">
                                No cards available.
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

          <button
            type="submit"
            className="btn text-black btn-sm"
            style={{
              background: "#4fc9da",
            }}
          >
            <b>Submit</b>
          </button>
        </form>
      </div>

      <ConfirmationModal
        show={isModalVisible}
        onConfirm={handleConfirmDisableAutoPay}
        onCancel={handleCancelDisableAutoPay}
        message={modalMessage}
      />

      <Toaster />
    </>
  );
};
