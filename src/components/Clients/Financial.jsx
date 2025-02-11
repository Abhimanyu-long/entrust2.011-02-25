import React, { useState, useEffect } from "react";
import "../../assets/css/main.css";
import { Accordion, Form, Button, Card, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useAuth } from "../../../context/AuthContext";
import { Link, useParams } from "react-router-dom";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export const Financial = () => {
  const { clientId } = useParams();
  // console.log(clientId);
  const { getClientSettings, updateClientSettings, updateClientSetup } = useAuth();
  // make the usestate for every input
  const [payType, setPayType] = useState("Choose");
  const [clientManager, setClientManager] = useState("mary.p");
  const [operationalManager, setOperationalManager] = useState("imran.i");
  const [currencyType, setCurrencyType] = useState("1");
  const [clientCode, setClientCode] = useState("");
  const [expectedBilling, setExpectedBilling] = useState("");

  // useState for each radio button group
  const [notifyExternalUser, setNotifyExternalUser] = useState("");
  const [invoiceAttachments, setInvoiceAttachments] = useState("");
  const [sendInvoiceExcel, setSendInvoiceExcel] = useState("");
  const [disableAutopay, setDisableAutopay] = useState("");
  const [smsNotifications, setSmsNotifications] = useState("");
  const [batchwiseBilling, setBatchwiseBilling] = useState("");
  const [groupProjectionReport, setGroupProjectionReport] = useState("");
  const [demandLetterClient, setDemandLetterClient] = useState("");
  const [restrictDomain, setRestrictDomain] = useState("");
  const [enableInvoiceComment, setEnableInvoiceComment] = useState("");
  const [slipInvoiceOutstandingBalance, setSlipInvoiceOutstandingBalance] = useState("");
  const [outstandingBalanceFollowup, setOutstandingBalanceFollowup] = useState("");
  const [enableSecondsBilling, setEnableSecondsBilling] = useState("");
  const [paymentAcknowledgeMail, setPaymentAcknowledgeMail] = useState("");
  const [showInvoiceMonth, setShowInvoiceMonth] = useState("");
  const [generateBatchwiseInvoice, setGenerateBatchwiseInvoice] = useState("");
  const [attachSupportingDocuments, setAttachSupportingDocuments] = useState("");

  const [invoiceType, setInvoiceType] = useState("");
  const [billingFooter, setBillingFooter] = useState("");
  const [invoiceToEmails, setInvoiceToEmails] = useState({
    dorsayDejam: false,
    paralegal: false,
    mary: false,
  });
  const [invoiceCcEmails, setInvoiceCcEmails] = useState({
    dorsayDejam: false,
    paralegal: false,
    mary: false,
  });
  const [excludeFromNITLLC, setExcludeFromNITLLC] = useState(false);

  // client setup
  const [groupType, setGroupType] = useState("Choose");
  const [isMRRClient, setIsMRRClient] = useState(false);
  const [parentGroup, setParentGroup] = useState("");
  const [mrrSupplier, setMrrSupplier] = useState("");
  const [carrierCode, setCarrierCode] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [mrrRequestMapping, setMrrRequestMapping] = useState("");
  const [mrrMinimumBalance, setMrrMinimumBalance] = useState("");
  const [mrrProviderCapping, setMrrProviderCapping] = useState("");
  const [referralClient, setReferralClient] = useState("");
  const [percentage, setPercentage] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");

  // State for "Skip Date Setting" checkbox
  const [isMrrClient, setIsMrrClient] = useState(false);
  const [referralCashbackType, setReferralCashbackType] = useState("");
  const [initialFunds, setInitialFunds] = useState("");

  const [discounts, setDiscounts] = useState([]);
  // State for the new discount input fields
  const [newDiscount, setNewDiscount] = useState({
    startDate: "",
    endDate: "",
    discount: "",
  });

  // this is for react select
  const [selectedOptionComments, setSelectedOptionComments] = useState([]);
  const [selectedOptionCase, setSelectedOptionCase] = useState([]);

  const [isSetupEnabled, setIsSetupEnabled] = useState(false);
  const [years, setYears] = useState("");
  const [notes, setNotes] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contractType, setContractType] = useState("yearly");

  // Function to handle the change in select field
  const handlePayTypeChange = (e) => {
    setPayType(e.target.value);
  };
  const handleClientManagerChange = (e) => {
    setClientManager(e.target.value);
  };
  const handleOperationalManagerChange = (e) => {
    setOperationalManager(e.target.value);
  };
  const handleCurrencyTypeChange = (e) => {
    setCurrencyType(e.target.value);
  };
  const handleClientCodeChange = (e) => {
    setClientCode(e.target.value);
  };
  const handleExpectedBillingChange = (e) => {
    setExpectedBilling(e.target.value);
  };

  // Handlers for each radio button group
  const handleNotifyExternalUserChange = (e) => {
    setNotifyExternalUser(e.target.value);
  };
  const handleInvoiceAttachmentsChange = (e) => {
    setInvoiceAttachments(e.target.value);
  };
  const handleSendInvoiceExcelChange = (e) => {
    setSendInvoiceExcel(e.target.value);
  };
  const handleDisableAutopayChange = (e) => {
    setDisableAutopay(e.target.value);
  };
  const handleSmsNotificationsChange = (e) => {
    setSmsNotifications(e.target.value);
  };
  const handleBatchwiseBillingChange = (e) => {
    setBatchwiseBilling(e.target.value);
  };
  const handleGroupProjectionReportChange = (e) => {
    setGroupProjectionReport(e.target.value);
  };
  const handleDemandLetterClientChange = (e) => {
    setDemandLetterClient(e.target.value);
  };
  const handleRestrictDomainChange = (e) => {
    setRestrictDomain(e.target.value);
  };
  const handleEnableInvoiceCommentChange = (e) => {
    setEnableInvoiceComment(e.target.value);
  };
  const handleSlipInvoiceOutstandingBalanceChange = (e) => {
    setSlipInvoiceOutstandingBalance(e.target.value);
  };

  const handleOutstandingBalanceFollowupChange = (e) => {
    setOutstandingBalanceFollowup(e.target.value);
  };

  const handleEnableSecondsBillingChange = (e) => {
    setEnableSecondsBilling(e.target.value);
  };

  const handlePaymentAcknowledgeMailChange = (e) => {
    setPaymentAcknowledgeMail(e.target.value);
  };

  const handleShowInvoiceMonthChange = (e) => {
    setShowInvoiceMonth(e.target.value);
  };

  const handleGenerateBatchwiseInvoiceChange = (e) => {
    setGenerateBatchwiseInvoice(e.target.value);
  };

  const handleAttachSupportingDocumentsChange = (e) => {
    setAttachSupportingDocuments(e.target.value);
  };

  const handleInvoiceTypeChange = (e) => {
    setInvoiceType(e.target.value);
  };

  const handleBillingFooterChange = (e) => {
    setBillingFooter(e.target.value);
  };

  const handleInvoiceToEmailsChange = (e) => {
    const { name, checked } = e.target;
    setInvoiceToEmails((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleInvoiceCcEmailsChange = (e) => {
    const { name, checked } = e.target;
    setInvoiceCcEmails((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleExcludeFromNITLLCChange = (e) => {
    setExcludeFromNITLLC(e.target.checked);
  };

  // client setup
  const handleGroupTypeChange = (e) => {
    setGroupType(e.target.value);
  };
  const handleIsMRRClientChange = (e) => {
    setIsMRRClient(e.target.checked);
  };

  const handleParentGroupChange = (e) => setParentGroup(e.target.value);
  const handleMrrSupplierChange = (e) => setMrrSupplier(e.target.value);
  const handleCarrierCodeChange = (e) => setCarrierCode(e.target.value);
  const handleSourceCodeChange = (e) => setSourceCode(e.target.value);
  const handleNotificationEmailChange = (e) =>
    setNotificationEmail(e.target.value);
  const handleMrrRequestMappingChange = (e) =>
    setMrrRequestMapping(e.target.value);
  const handleMrrMinimumBalanceChange = (e) =>
    setMrrMinimumBalance(e.target.value);
  const handleMrrProviderCappingChange = (e) =>
    setMrrProviderCapping(e.target.value);
  const handleReferralClientChange = (e) => setReferralClient(e.target.value);
  const handlePercentageChange = (e) => setPercentage(e.target.value);
  const handlePeriodFromChange = (e) => setPeriodFrom(e.target.value);
  const handlePeriodToChange = (e) => setPeriodTo(e.target.value);

  const handleIsMrrClientChange = (e) => {
    setIsMrrClient(e.target.checked);
  };
  const handleReferralCashbackTypeChange = (e) => {
    setReferralCashbackType(e.target.value);
  };
  const handleInitialFundsChange = (e) => {
    setInitialFunds(e.target.value);
  };

  const handleAddDiscount = () => {
    if (newDiscount.startDate && newDiscount.endDate && newDiscount.discount) {
      setDiscounts([...discounts, newDiscount]);
      setNewDiscount({ startDate: "", endDate: "", discount: "" });
    }
  };
  const handleRemoveDiscount = (indexToRemove) => {
    const updatedDiscounts = discounts.filter(
      (_, index) => index !== indexToRemove
    );
    setDiscounts(updatedDiscounts);
  };

  // this is react select
  const handleChangereactSelect = (selectedOption, type) => {
    if (type === "comments") {
      setSelectedOptionComments(selectedOption);
    } else {
      setSelectedOptionCase(selectedOption);
    }
  };

  // Handle checkbox change
  const handleSetupChange = (e) => {
    setIsSetupEnabled(e.target.checked);
  };

  useEffect(() => {
    const fetchClientSetting = async () => {
      try {
        const response = await getClientSettings(clientId);
        // console.log("Fetched client settings:", response);
        if (response) {
          setPayType(response.cs_pay_type?.toString() || "Choose");
          setClientManager(response.cs_client_manager?.toString() || "mary.p");
          setOperationalManager(response.cs_operational_manager?.toString() || "imran.i");
          setCurrencyType(response.cs_currency_type?.toString() || "1");
          setClientCode(response.cs_invoice_code || "");
          setExpectedBilling(response.cs_expected_billing || "");

          // Adjust boolean values to strings "yes"/"no"
          setNotifyExternalUser(response.cs_notify_external_on_comment_edit ? "yes" : "no");
          setInvoiceAttachments(response.cs_send_invoice_attachments ? "yes" : "no");
          setSendInvoiceExcel(response.cs_excel_invoice_flag ? "yes" : "no");
          setDisableAutopay(response.cs_disable_autopay_calculation ? "yes" : "no");
          setSmsNotifications(response.sms_notifications ? "yes" : "no");
          setBatchwiseBilling(response.cs_batchwise_billing ? "yes" : "no");
          setDemandLetterClient(response.cs_demand_letter_client ? "yes" : "no");
          setRestrictDomain(response.cs_domain_restricted ? "yes" : "no");
          setEnableInvoiceComment(response.cs_invoice_comment_status ? "yes" : "no");
          setSlipInvoiceOutstandingBalance(response.cs_split_opening_balance ? "yes" : "no");
          setOutstandingBalanceFollowup(response.cs_oustanding_followup ? "yes" : "no");
          setEnableSecondsBilling(response.cs_enable_seconds_billing ? "yes" : "no");
          setPaymentAcknowledgeMail(response.cs_payment_acknowledge ? "yes" : "no");
          setShowInvoiceMonth(response.cs_show_invoice_month ? "yes" : "no");
          setGenerateBatchwiseInvoice(response.cs_batchwise_billing ? "yes" : "no");
          setAttachSupportingDocuments(response.attach_supporting_documents ? "yes" : "no");
          setExcludeFromNITLLC(Boolean(response.cs_is_excluded));
        }
      } catch (error) {
        console.error("Error fetching client settings:", error.message);
      }
    };
    fetchClientSetting();
  }, [clientId, getClientSettings]);


  const handleUpdateClientSettings = async () => {
    const clientSettingsUpdated = {
      cs_client_id: clientId,
      cs_pay_type: payType,
      cs_client_manager: clientManager,
      cs_operational_manager: operationalManager,
      cs_currency_type: currencyType,
      cs_invoice_code: clientCode,
      cs_expected_billing: expectedBilling,
      cs_notify_external_on_comment_edit: notifyExternalUser === "yes" ? 1 : 0,
      cs_send_invoice_attachments: invoiceAttachments === "yes" ? 1 : 0,
      cs_excel_invoice_flag: sendInvoiceExcel === "yes" ? 1 : 0,
      cs_disable_autopay_calculation: disableAutopay === "yes" ? 1 : 0,
      sms_notifications: smsNotifications === "yes" ? 1 : 0,
      cs_batchwise_billing: batchwiseBilling === "yes" ? 1 : 0,
      cs_demand_letter_client: demandLetterClient === "yes" ? 1 : 0,
      cs_domain_restricted: restrictDomain === "yes" ? 1 : 0,
      cs_invoice_comment_status: enableInvoiceComment === "yes" ? 1 : 0,
      cs_split_opening_balance: slipInvoiceOutstandingBalance === "yes" ? 1 : 0,
      cs_oustanding_followup: outstandingBalanceFollowup === "yes" ? 1 : 0,
      cs_enable_seconds_billing: enableSecondsBilling === "yes" ? 1 : 0,
      cs_payment_acknowledge: paymentAcknowledgeMail === "yes" ? 1 : 0,
      cs_show_invoice_month: showInvoiceMonth === "yes" ? 1 : 0,
      attach_supporting_documents: attachSupportingDocuments === "yes" ? 1 : 0,
      cs_invoice_type: invoiceType,
      cs_billing_footer: billingFooter,
      cs_invoice_to_email: invoiceToEmails,
      cs_invoice_cc_email: invoiceCcEmails,
      cs_is_excluded: excludeFromNITLLC ? 1 : 0,
    };

    try {
      const response = await updateClientSettings(clientId, clientSettingsUpdated);
      // console.log("Client settings updated successfully:", response);
    } catch (error) {
      console.error("Error updating client settings:", error.message);
    }
  };


  const handleUpdateClientSetup = async () => {
    const clientSetupUpdated = {
      cs_group_type: groupType,
      cs_client_with_mrr: isMRRClient,
      cs_mrr_parent: parentGroup,
      cs_mrr_supplier: mrrSupplier,
      cs_mrr_carrier_code: carrierCode,
      cs_mrr_source_code: sourceCode,
      cs_mrr_notification_mail: notificationEmail,
      cs_mrr_request_mapping: mrrRequestMapping,
      cs_mrr_prov_capping: mrrProviderCapping,
      cs_mrr_min_fund: mrrMinimumBalance,
      ref_client: referralClient,
      ref_client_share: percentage,
      ref_period_from: periodFrom,
      ref_period_to: periodTo,
      ref_skip_period: isMrrClient,
      ref_cashback_type: referralCashbackType,
      cs_initial_funds: initialFunds,
    };
    try {
      const response = await updateClientSetup(clientId, clientSetupUpdated);
      // console.log("Client settings updated successfully:", response);
    } catch (error) {
      console.error("Error updating client settings:", error.message);
    }
  };


  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className="container my-4">
        <Card className="p-4 shadow-lg border-0">
          <Row>
            <Col lg={9} md={4} style={{ height: "100vh", overflowY: "scroll" }}>
              {/* Client Settings Section  */}
              <Accordion
                defaultActiveKey="0"
                className="card card-flush accordionCard shadow-sm"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <b>Client Settings </b>
                  </Accordion.Header>
                  <Accordion.Body id="clientSettings">
                    <div className="row g-4">
                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">Pay Type</Form.Label>
                          <Form.Select
                            name="payType"
                            className="p-2 fs-8"
                            value={payType}
                            onChange={handlePayTypeChange}
                          >
                            <option value="Choose">Choose</option>
                            <option value="Prepaid">Prepaid</option>
                            <option value="Postpaid">Postpaid</option>
                            <option value="Trial">Trial</option>
                            <option value="Suspend">Suspend</option>
                          </Form.Select>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Client Manager
                          </Form.Label>
                          <Form.Select
                            name="clientManager"
                            className="p-2 fs-8"
                            value={clientManager}
                            onChange={handleClientManagerChange}
                          >
                            <option value="mary.p">mary.p</option>
                            <option value="other.manager">other.manager</option>
                          </Form.Select>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Operational Manager
                          </Form.Label>
                          <Form.Select
                            name="operationalManager"
                            className="p-2 fs-8"
                            value={operationalManager}
                            onChange={handleOperationalManagerChange}
                          >
                            <option value="imran.i">imran.i</option>
                            <option value="other.manager">other.manager</option>
                          </Form.Select>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Currency Type
                          </Form.Label>
                          <Form.Select
                            name="currencyType"
                            className="p-2 fs-8"
                            value={currencyType}
                            onChange={handleCurrencyTypeChange}
                          >
                            <option value="">Choose</option>
                            <option value="1">USD ($)</option>
                            <option value="2">INR (₹)</option>
                            <option value="3">POUND (£)</option>
                          </Form.Select>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Client Code for Invoice
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="clientCode"
                            placeholder="Enter client code"
                            className="p-2 fs-8"
                            value={clientCode}
                            onChange={handleClientCodeChange}
                          />
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Expected Billing
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="expectedBilling"
                            placeholder="Enter expected billing"
                            className="fs-8 p-2"
                            value={expectedBilling}
                            onChange={handleExpectedBillingChange}
                          />
                        </Form.Group>
                      </div>

                      {/* // till here i have done  */}

                      <hr />

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Notify External User on Comment Edit:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="notifyExternalUser"
                                value="yes"
                                checked={notifyExternalUser === "yes"}
                                onChange={handleNotifyExternalUserChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="notifyExternalUser"
                                value="no"
                                checked={notifyExternalUser === "no"}
                                onChange={handleNotifyExternalUserChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Invoice Attachments:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="invoiceAttachments"
                                value="yes"
                                checked={invoiceAttachments === "yes"}
                                onChange={handleInvoiceAttachmentsChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="invoiceAttachments"
                                value="no"
                                checked={invoiceAttachments === "no"}
                                onChange={handleInvoiceAttachmentsChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Send Invoice Excel to Email:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="sendInvoiceExcel"
                                value="yes"
                                checked={sendInvoiceExcel === "yes"}
                                onChange={handleSendInvoiceExcelChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="sendInvoiceExcel"
                                value="no"
                                checked={sendInvoiceExcel === "no"}
                                onChange={handleSendInvoiceExcelChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Disable Calculation for Autopay:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="disableAutopay"
                                value="yes"
                                checked={disableAutopay === "yes"}
                                onChange={handleDisableAutopayChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="disableAutopay"
                                value="no"
                                checked={disableAutopay === "no"}
                                onChange={handleDisableAutopayChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            SMS Notifications:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="smsNotifications"
                                value="yes"
                                checked={smsNotifications === "yes"}
                                onChange={handleSmsNotificationsChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="smsNotifications"
                                value="no"
                                checked={smsNotifications === "no"}
                                onChange={handleSmsNotificationsChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Enable Batchwise Billing:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="batchwiseBilling"
                                value="yes"
                                checked={batchwiseBilling === "yes"}
                                onChange={handleBatchwiseBillingChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="batchwiseBilling"
                                value="no"
                                checked={batchwiseBilling === "no"}
                                onChange={handleBatchwiseBillingChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Is 'Demand Letter' Client?:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="demandLetterClient"
                                value="yes"
                                checked={demandLetterClient === "yes"}
                                onChange={handleDemandLetterClientChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="demandLetterClient"
                                value="no"
                                checked={demandLetterClient === "no"}
                                onChange={handleDemandLetterClientChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Restrict Domain for Group-Users?:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="restrictDomain"
                                value="yes"
                                checked={restrictDomain === "yes"}
                                onChange={handleRestrictDomainChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="restrictDomain"
                                value="no"
                                checked={restrictDomain === "no"}
                                onChange={handleRestrictDomainChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Enable Invoice Comment?:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="enableInvoiceComment"
                                value="yes"
                                checked={enableInvoiceComment === "yes"}
                                onChange={handleEnableInvoiceCommentChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="enableInvoiceComment"
                                value="no"
                                checked={enableInvoiceComment === "no"}
                                onChange={handleEnableInvoiceCommentChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Split invoice outstanding balance:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="slipInvoiceOutstandingBalance"
                                value="yes"
                                checked={
                                  slipInvoiceOutstandingBalance === "yes"
                                }
                                onChange={
                                  handleSlipInvoiceOutstandingBalanceChange
                                }
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="slipInvoiceOutstandingBalance"
                                value="no"
                                checked={slipInvoiceOutstandingBalance === "no"}
                                onChange={
                                  handleSlipInvoiceOutstandingBalanceChange
                                }
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Outstanding Balance Followup:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="outstandingBalanceFollowup"
                                value="yes"
                                checked={outstandingBalanceFollowup === "yes"}
                                onChange={
                                  handleOutstandingBalanceFollowupChange
                                }
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="outstandingBalanceFollowup"
                                value="no"
                                checked={outstandingBalanceFollowup === "no"}
                                onChange={
                                  handleOutstandingBalanceFollowupChange
                                }
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Enable Seconds Billing:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="enableSecondsBilling"
                                value="yes"
                                checked={enableSecondsBilling === "yes"}
                                onChange={handleEnableSecondsBillingChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="enableSecondsBilling"
                                value="no"
                                checked={enableSecondsBilling === "no"}
                                onChange={handleEnableSecondsBillingChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Payment Acknowledge Mail:
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="paymentAcknowledgeMail"
                                value="yes"
                                checked={paymentAcknowledgeMail === "yes"}
                                onChange={handlePaymentAcknowledgeMailChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="paymentAcknowledgeMail"
                                value="no"
                                checked={paymentAcknowledgeMail === "no"}
                                onChange={handlePaymentAcknowledgeMailChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Billing Particulars: Show Invoice Month?
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="showInvoiceMonth"
                                value="yes"
                                checked={showInvoiceMonth === "yes"}
                                onChange={handleShowInvoiceMonthChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="showInvoiceMonth"
                                value="no"
                                checked={showInvoiceMonth === "no"}
                                onChange={handleShowInvoiceMonthChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Generate Batchwise Invoice?
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="generateBatchwiseInvoice"
                                value="yes"
                                checked={generateBatchwiseInvoice === "yes"}
                                onChange={handleGenerateBatchwiseInvoiceChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="generateBatchwiseInvoice"
                                value="no"
                                checked={generateBatchwiseInvoice === "no"}
                                onChange={handleGenerateBatchwiseInvoiceChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <div className="col-md-4">
                        <Form.Group>
                          <Form.Label className="fs-7">
                            Attach Supporting Document(s)?
                          </Form.Label>
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="attachSupportingDocuments"
                                value="yes"
                                checked={attachSupportingDocuments === "yes"}
                                onChange={handleAttachSupportingDocumentsChange}
                              />
                              <label className="form-check-label fs-7">
                                Yes
                              </label>
                            </div>
                            <div className="form-check form-check-sm form-check-solid me-2">
                              <input
                                className="form-check-input fs-7"
                                type="radio"
                                name="attachSupportingDocuments"
                                value="no"
                                checked={attachSupportingDocuments === "no"}
                                onChange={handleAttachSupportingDocumentsChange}
                              />
                              <label className="form-check-label fs-7">
                                No
                              </label>
                            </div>
                          </div>
                        </Form.Group>
                      </div>

                      <hr />

                      <div className="row">
                        {/* Invoice Type Radio Buttons */}
                        <div className="col-md-3 form-check form-check-sm">
                          <Form.Group>
                            <Form.Label className="fs-7">
                              Invoice Type
                            </Form.Label>
                            <div>
                              <Form.Check
                                type="radio"
                                label="USA"
                                name="invoiceType"
                                value="USA"
                                checked={invoiceType === "USA"}
                                onChange={handleInvoiceTypeChange}
                              />
                              <Form.Check
                                type="radio"
                                label="India"
                                name="invoiceType"
                                value="India"
                                checked={invoiceType === "India"}
                                onChange={handleInvoiceTypeChange}
                                className="pt-1"
                              />
                              <Form.Check
                                type="radio"
                                label="United Kingdom"
                                name="invoiceType"
                                value="United Kingdom"
                                checked={invoiceType === "United Kingdom"}
                                onChange={handleInvoiceTypeChange}
                                className="pt-1"
                              />
                            </div>
                          </Form.Group>
                        </div>

                        {/* NeuralIT Billing Footer Radio Buttons */}
                        <div className="col-md-3 form-check form-check-sm">
                          <Form.Group>
                            <Form.Label className="fs-7">
                              NeuralIT Billing Footer:
                            </Form.Label>
                            <div>
                              <Form.Check
                                type="radio"
                                label="USA"
                                name="billingFooter"
                                value="USA"
                                checked={billingFooter === "USA"}
                                onChange={handleBillingFooterChange}
                              />
                              <Form.Check
                                type="radio"
                                label="Airoli"
                                name="billingFooter"
                                value="Airoli"
                                checked={billingFooter === "Airoli"}
                                onChange={handleBillingFooterChange}
                                className="pt-1"
                              />
                              <Form.Check
                                type="radio"
                                label="Vashi"
                                name="billingFooter"
                                value="Vashi"
                                checked={billingFooter === "Vashi"}
                                onChange={handleBillingFooterChange}
                                className="pt-1"
                              />
                            </div>
                          </Form.Group>
                        </div>

                        {/* Invoice to Emails Checkboxes */}
                        <div className="col-md-3 form-check form-check-sm">
                          <Form.Group>
                            <Form.Label className="fs-7">
                              Invoice to Emails
                            </Form.Label>
                            <div>
                              <Form.Check
                                type="checkbox"
                                label="Dorsay Dejam"
                                name="dorsayDejam"
                                checked={invoiceToEmails.dorsayDejam}
                                onChange={handleInvoiceToEmailsChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="Paralegal"
                                name="paralegal"
                                checked={invoiceToEmails.paralegal}
                                onChange={handleInvoiceToEmailsChange}
                                className="pt-1"
                              />
                              <Form.Check
                                type="checkbox"
                                label="mary.p"
                                name="mary"
                                checked={invoiceToEmails.mary}
                                onChange={handleInvoiceToEmailsChange}
                                className="pt-1"
                              />
                            </div>
                          </Form.Group>
                        </div>

                        {/* Invoice CC Emails Checkboxes */}
                        <div className="col-md-3 form-check form-check-sm">
                          <Form.Group>
                            <Form.Label className="fs-7">
                              Invoice CC Emails
                            </Form.Label>
                            <div>
                              <Form.Check
                                type="checkbox"
                                label="Dorsay Dejam"
                                name="dorsayDejam"
                                checked={invoiceCcEmails.dorsayDejam}
                                onChange={handleInvoiceCcEmailsChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="Paralegal"
                                name="paralegal"
                                checked={invoiceCcEmails.paralegal}
                                onChange={handleInvoiceCcEmailsChange}
                                className="pt-1"
                              />
                              <Form.Check
                                type="checkbox"
                                label="mary.p"
                                name="mary"
                                checked={invoiceCcEmails.mary}
                                onChange={handleInvoiceCcEmailsChange}
                                className="pt-1"
                              />
                            </div>
                          </Form.Group>
                        </div>

                        {/* Exclude from NIT-LLC Invoice Checkbox */}
                        <div className="col-md-4 pt-3">
                          <div className="form-check form-check-sm">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="excludeCheckbox"
                              checked={excludeFromNITLLC}
                              onChange={handleExcludeFromNITLLCChange}
                            />
                            <label
                              className="form-check-label fs-8"
                              htmlFor="excludeCheckbox"
                            >
                              Exclude from NIT-LLC Invoice?
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-end mt-3">
                      <Button
                        type="submit"
                        className="px-4 btn btn-sm btn-primary"
                        onClick={handleUpdateClientSettings}
                      >
                       <b> Submit</b>
                      </Button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* Client Setup Section  */}
              <Accordion
                defaultActiveKey="0"
                className="card card-flush accordionCard shadow-sm"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <b>Client Setup</b>
                  </Accordion.Header>
                  <Accordion.Body id="clientSetup">
                    <div className=" p-4">
                      <div className="row g-3">
                        <div className="row">
                          <div className="col-md-4 me-12">
                            <label className="form-label fs-7">
                              Group Type
                            </label>
                            <select
                              className="form-select fs-8 p-2"
                              name="groupType"
                              value={groupType}
                              onChange={handleGroupTypeChange}
                            >
                              <option value="Choose">Choose</option>
                              <option value="Prepaid">Client</option>
                              <option value="Postpaid">MRR</option>
                              <option value="mrr-supplier">MRR-Supplier</option>
                            </select>
                          </div>

                          <div className="col-md-4 pt-8 form-check form-check-sm">
                            <input
                              className="form-check-input fs-8"
                              type="checkbox"
                              id="excludeCheckbox"
                              checked={isMRRClient}
                              onChange={handleIsMRRClientChange}
                            />
                            <label
                              className="form-check-label fs-8"
                              htmlFor="excludeCheckbox"
                            >
                              Is MRR Client?
                            </label>
                          </div>
                        </div>

                        <hr className="m-4" />

                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label fs-7">
                              Parent Group
                            </label>
                            <select
                              className="form-select fs-8 p-2"
                              name="parentGroup"
                              value={parentGroup}
                              onChange={handleParentGroupChange}
                            >
                              <option value="zeshan.z">zeshan.z</option>
                              <option value="other.manager">
                                other.manager
                              </option>
                            </select>
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fs-7">
                              MRR-Supplier
                            </label>
                            <select
                              className="form-select fs-8 p-2"
                              name="mrrSupplier"
                              value={mrrSupplier}
                              onChange={handleMrrSupplierChange}
                            >
                              <option value="madhura.d">Choose</option>
                              <option value="other.manager">
                                Neural IT MRR
                              </option>
                            </select>
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fs-7">
                              Carrier Code
                            </label>
                            <input
                              className="form-control fs-8 p-2"
                              type="text"
                              name="carrierCode"
                              value={carrierCode}
                              onChange={handleCarrierCodeChange}
                              placeholder="Enter carrier code"
                            />
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fs-7">
                              Source Code
                            </label>
                            <input
                              className="form-control fs-8 p-2"
                              type="text"
                              name="sourceCode"
                              value={sourceCode}
                              onChange={handleSourceCodeChange}
                              placeholder="Enter source code"
                            />
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fs-7">
                              Notification Email
                            </label>
                            <input
                              className="form-control fs-8 p-2"
                              type="email"
                              name="notificationEmail"
                              value={notificationEmail}
                              onChange={handleNotificationEmailChange}
                              placeholder="Enter notification email"
                            />
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fs-7">
                              MRR Request Mapping:
                            </label>
                            <select
                              className="form-control fs-8 p-2"
                              name="mrrRequestMapping"
                              value={mrrRequestMapping}
                              onChange={handleMrrRequestMappingChange}
                            >
                              <option value="1:1">1 : 1</option>
                              <option value="1:M">1 : M</option>
                            </select>
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fs-7">
                              MRR Minimum Balance
                            </label>
                            <input
                              className="form-control fs-8 p-2"
                              type="text"
                              name="mrrMinimumBalance"
                              value={mrrMinimumBalance}
                              onChange={handleMrrMinimumBalanceChange}
                              placeholder="MRR Minimum Balance"
                            />
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fs-7">
                              MRR Provider Capping
                            </label>
                            <input
                              className="form-control fs-8 p-2"
                              type="text"
                              name="mrrProviderCapping"
                              value={mrrProviderCapping}
                              onChange={handleMrrProviderCappingChange}
                              placeholder="MRR Provider Capping"
                            />
                          </div>

                          <hr className="m-4" />

                          <div className="col-md-4">
                            <label className="form-label fs-7">
                              Referral Client
                            </label>
                            <select
                              className="form-select fs-8 p-2"
                              name="referralClient"
                              value={referralClient}
                              onChange={handleReferralClientChange}
                            >
                              <option value="Choose">Choose</option>
                              <option value="Aarogya Diagnostics Center">
                                Aarogya Diagnostics Center
                              </option>
                            </select>
                          </div>

                          <div className="col-md-4">
                            <label className="form-label fs-7">
                              Percentage
                            </label>
                            <input
                              className="form-control fs-8 p-2"
                              type="text"
                              name="percentage"
                              value={percentage}
                              onChange={handlePercentageChange}
                              placeholder="Percentage"
                            />
                          </div>

                          <hr className="m-4" />

                          <div className="form-group col-md-4">
                            <label className="form-label fs-7">
                              Period From:
                            </label>
                            <input
                              type="date"
                              className="form-control fs-8 p-2"
                              name="periodFrom"
                              value={periodFrom}
                              onChange={handlePeriodFromChange}
                            />
                          </div>

                          <div className="form-group col-md-4">
                            <label className="form-label fs-7">
                              Period To:
                            </label>
                            <input
                              type="date"
                              className="form-control fs-8 p-2"
                              name="periodTo"
                              value={periodTo}
                              onChange={handlePeriodToChange}
                            />
                          </div>
                        </div>

                        <hr className="m-4" />

                        <div className="col-md-3 form-check form-check-sm">
                          <input
                            className="form-check-input form-check-sm"
                            type="checkbox"
                            name="isMrrClient"
                            id="isMrrClient"
                            checked={isMrrClient}
                            onChange={handleIsMrrClientChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="isMrrClient"
                          >
                            Skip Date Setting
                          </label>
                        </div>

                        <hr className="m-4" />

                        <div className="col-md-4">
                          <div className="d-flex align-items-center">
                            <label className="form-label fs-7 me-3">
                              Referral Cashback Type:
                            </label>
                            <div className="form-check me-3">
                              <input
                                className="form-check-input fs-8"
                                type="radio"
                                name="referralCashbackType"
                                value="yes"
                                checked={referralCashbackType === "yes"}
                                onChange={handleReferralCashbackTypeChange}
                              />
                              <label className="form-check-label fs-8">
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input fs-8"
                                type="radio"
                                name="referralCashbackType"
                                value="no"
                                checked={referralCashbackType === "no"}
                                onChange={handleReferralCashbackTypeChange}
                              />
                              <label className="form-check-label fs-8">
                                No
                              </label>
                            </div>
                          </div>
                        </div>

                        <hr className="m-4" />

                        <div className="form-group col-md-4">
                          <label className="form-label fs-7">
                            Initial Funds:
                          </label>
                          <input
                            type="text"
                            className="form-control fs-8 p-2 w-25"
                            name="initialFunds"
                            value={initialFunds}
                            onChange={handleInitialFundsChange}
                            placeholder="Enter initial funds"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm mt-4 text-end"
                        onClick={handleUpdateClientSetup}
                      >
                        <b>Save Setup</b>
                      </button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* Invoice Cashback section */}
              <Accordion
                defaultActiveKey="0"
                className="card card-flush accordionCard shadow-sm"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <b>Invoice Cashback</b>
                  </Accordion.Header>
                  <Accordion.Body id="invoiceCashback">
                    <div className="container">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>START DATE</th>
                            <th>END DATE</th>
                            <th>DISCOUNT(%)</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discounts.map((item, index) => (
                            <tr key={index}>
                              <td>{item.startDate}</td>
                              <td>{item.endDate}</td>
                              <td>{item.discount}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-link btn-sm"
                                  onClick={() => handleRemoveDiscount(index)}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="row">
                        <div className="col-md-3">
                          <label>Date Start:</label>
                          <input
                            type="date"
                            className="form-control p-2 fs-8"
                            value={newDiscount.startDate}
                            onChange={(e) =>
                              setNewDiscount({
                                ...newDiscount,
                                startDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-3">
                          <label>Date End:</label>
                          <input
                            type="date"
                            className="form-control p-2 fs-8"
                            value={newDiscount.endDate}
                            onChange={(e) =>
                              setNewDiscount({
                                ...newDiscount,
                                endDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-3">
                          <label>[%] Discount Allowed:</label>
                          <input
                            type="number"
                            className="form-control p-2 fs-8"
                            value={newDiscount.discount}
                            onChange={(e) =>
                              setNewDiscount({
                                ...newDiscount,
                                discount: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mt-4 p-2">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm me-2"
                          onClick={handleAddDiscount}
                        >
                          <b>Add Discount</b>
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() =>
                            setNewDiscount({
                              startDate: "",
                              endDate: "",
                              discount: "",
                            })
                          }
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* Client Comment Notification section */}
              <Accordion
                defaultActiveKey="0"
                className="card card-flush accordionCard shadow-sm"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <b>
                      Client Comment & Case Notification
                    </b>
                  </Accordion.Header>
                  <Accordion.Body id="clientCommentCaseNotification">
                    <div className="row">
                      <div className="col-md-6">
                        <b>Client Comment Notification</b>
                        <div className="container">
                          <label htmlFor="groupmember">Group Members:</label>
                          <Select
                            isMulti
                            value={selectedOptionComments}
                            onChange={(selectedOption) =>
                              handleChangereactSelect(
                                selectedOption,
                                "comments"
                              )
                            }
                            options={options}
                          />
                          {selectedOptionComments && (
                            <div className="mt-3">
                              <strong>Selected Option:</strong>{" "}
                              {selectedOptionComments
                                .map((option) => option.label)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <b>Client Case Notification</b>
                        <div className="container">
                          <label htmlFor="groupmember">Group Members:</label>
                          <Select
                            isMulti
                            value={selectedOptionCase}
                            onChange={(selectedOption) =>
                              handleChangereactSelect(selectedOption, "case")
                            }
                            options={options}
                          />
                          {selectedOptionCase && (
                            <div className="mt-3">
                              <strong>Selected Option:</strong>{" "}
                              {selectedOptionCase
                                .map((option) => option.label)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 mt-4">
                      <button className="btn btn-primary btn-sm"><b>Configure</b></button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* Contract Renewal Notification */}
              <Accordion
                defaultActiveKey="0"
                className="card card-flush accordionCard shadow-sm"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <b>Contract Renewal Notification</b>
                  </Accordion.Header>
                  <Accordion.Body id="contractRenewalNotification">
                    <div className="mb-3 form-check form-check-sm">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        id="enableSetup"
                        checked={isSetupEnabled}
                        onChange={handleSetupChange}
                      />
                      <label className="form-check-label" htmlFor="enableSetup">
                        Enable setup?
                      </label>
                    </div>

                    {isSetupEnabled === true ? (
                      <>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <b>Contract Start Date:</b>
                            <input
                              type="date"
                              className="form-control fs-8 p-2 w-50"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                            <small className="text-muted">
                              Format: YYYY-MM-DD
                            </small>
                          </div>

                          <div className="col-md-6">
                            <b>Contract End Date:</b>
                            <input
                              type="date"
                              className="form-control fs-8 p-2 w-50"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                            <small className="text-muted">
                              Format: YYYY-MM-DD
                            </small>
                          </div>
                        </div>

                        <div className="form-group mb-3">
                          <b>Contract Type:</b>
                          <div>
                            <div className="form-check form-check-sm">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="yearly"
                                name="contractType"
                                value="yearly"
                                checked={contractType === "yearly"}
                                onChange={(e) =>
                                  setContractType(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="yearly"
                              >
                                Yearly
                              </label>
                            </div>
                            <div className="form-check form-check-sm">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="monthly"
                                name="contractType"
                                value="monthly"
                                checked={contractType === "monthly"}
                                onChange={(e) =>
                                  setContractType(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="monthly"
                              >
                                Monthly
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}

                    {/* Years Input */}
                    <div className="form-group mb-3">
                      <b>YEARS:</b>
                      <input
                        type="text"
                        className="form-control fs-8 p-2 w-25"
                        id="years"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        placeholder="Enter years"
                      />
                    </div>

                    {/* Notes Textarea */}
                    <div className="form-group mb-3">
                      <b>NOTES:</b>
                      <textarea
                        className="form-control"
                        id="notes"
                        rows="4"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter your notes"
                      ></textarea>
                    </div>

                    {/* Configure Button */}
                    <button type="submit" className="btn btn-primary btn-sm">
                      <b>Configure</b>
                    </button>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* MRR Auth Template */}
              <Accordion
                defaultActiveKey="0"
                className="card card-flush accordionCard shadow-sm"
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <b>MRR Auth Template</b>
                  </Accordion.Header>
                  <Accordion.Body id="mrrAuthTemplate">
                    <div className="row">
                    <div className="mb-3 col-6">
                      <label className="form-label fs-7">
                        HITECH AUTH FILE:
                      </label>
                      <div className="input-group">
                        <input
                          type="file"
                          className="form-control fs-8 p-3"
                          accept=".docx"
                        />
                        <span className="input-group-text">
                          <i className="bi bi-paperclip"></i>
                        </span>
                      </div>
                    </div>
                    <div className="mb-3 col-6">
                      <label className="form-label fs-7">
                        HIPPA AUTH FILE:
                      </label>
                      <div className="input-group">
                        <input
                          type="file"
                          className="form-control fs-8 p-3"
                          accept=".docx"
                        />
                        <span className="input-group-text">
                          <i className="bi bi-paperclip"></i>
                        </span>
                      </div>
                    </div>
                    </div>
                   
                    <button type="button" className="btn btn-primary btn-sm me-2">
                      <b>Upload</b>
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm">
                     <b> Clear</b>
                    </button>
                    <div className="mt-2">
                      {/* Placeholder for progress or success messages */}
                      <p className="text-success">
                        Files uploaded successfully!
                      </p>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>

            <Col lg={3} md={4} className="sidebar bg-light shadow-sm">
              <div className="sidebar-header text-center py-4">
                <h4 className="text-primary">Financial Settings</h4>
              </div>
              <ul className="nav flex-column sidebar-links pt-3">
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center text-dark"
                    onClick={() => scrollToSection('clientSettings')}
                    style={{ cursor: 'pointer' }} // Change cursor to pointer
                  >
                    <i className="fas fa-cog me-2"></i>
                    Client Settings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center text-dark"
                    onClick={() => scrollToSection('clientSetup')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Client Setup
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center text-dark"
                    onClick={() => scrollToSection('invoiceCashback')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fas fa-money-bill-wave me-2"></i>
                    Invoice Cashback
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center text-dark"
                    onClick={() => scrollToSection('clientCommentCaseNotification')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fas fa-comment-dots me-2"></i>
                    Client Comment & Case Notification
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center text-dark"
                    onClick={() => scrollToSection('contractRenewalNotification')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fas fa-file-contract me-2"></i>
                    Contract Renewal Notification
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center text-dark"
                    onClick={() => scrollToSection('mrrAuthTemplate')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fas fa-file-alt me-2"></i>
                    MRR Auth Template
                  </Link>
                </li>
              </ul>
            </Col>
          </Row>
        </Card>
      </div>
   

    
    </>
  );
};


// response getting from backend
// {
//   "cs_pay_type": 2,
//   "cs_client_manager": 863,
//   "cs_operational_manager": 69,
//   "cs_currency_type": 1,
//   "cs_invoice_code": "BS-NF",
//   "cs_expected_billing": "0.00",
//   "cs_notify_external_on_comment_edit": 0,
//   "cs_send_invoice_attachments": 1,
//   "cs_excel_invoice_flag": 0,
//   "cs_disable_autopay_calculation": 0,
//   "sms_notifications": null,
//   "cs_batchwise_billing": 0,
//   "cs_demand_letter_client": 0,
//   "cs_domain_restricted": 0,
//   "cs_invoice_comment_status": 0,
//   "cs_split_opening_balance": 0,
//   "cs_oustanding_followup": 0,
//   "cs_enable_seconds_billing": 0,
//   "cs_payment_acknowledge": 0,
//   "cs_show_invoice_month": 1,
//   "attach_supporting_documents": null,
//   "cs_invoice_type": 0,
//   "cs_billing_footer": 0,
//   "cs_invoice_to_email": "Karla Leon <KLeon@BAKERSANDERS.COM>",
//   "cs_invoice_cc_email": "Krystina Morrone <KMorrone@bakersanders.com>, Douglas Sanders <DSanders@BAKERSANDERS.COM>",
//   "cs_is_excluded": 0
// }


{/* <div className="col-md-4">
<Form.Group>
  <Form.Label className="fs-7">
    Add Group to 'Projection Report'?:
  </Form.Label>
  <div className="d-flex align-items-center">
    <div className="form-check form-check-sm form-check-solid me-2">
      <input
        className="form-check-input fs-7"
        type="radio"
        name="groupProjectionReport"
        value="yes"
        checked={groupProjectionReport === "yes"}
        onChange={handleGroupProjectionReportChange}
      />
      <label className="form-check-label fs-7">
        Yes
      </label>
    </div>
    <div className="form-check form-check-sm form-check-solid me-2">
      <input
        className="form-check-input fs-7"
        type="radio"
        name="groupProjectionReport"
        value="no"
        checked={groupProjectionReport === "no"}
        onChange={handleGroupProjectionReportChange}
      />
      <label className="form-check-label fs-7">
        No
      </label>
    </div>
  </div>
</Form.Group>
</div> */}














  // const clientSettingsUpdated = {
    //   cs_client_id: clientId,
    //   cs_pay_type: payType,
    //   cs_client_manager: clientManager,
    //   cs_operational_manager: operationalManager,
    //   cs_currency_type: currencyType,
    //   cs_invoice_code: clientCode,
    //   cs_expected_billing: expectedBilling,
    //   cs_notify_external_on_comment_edit: notifyExternalUser,
    //   cs_send_invoice_attachments: invoiceAttachments,
    //   cs_excel_invoice_flag: sendInvoiceExcel,
    //   cs_disable_autopay_calculation: disableAutopay,
    //   sms_notifications: smsNotifications,
    //   cs_batchwise_billing: batchwiseBilling,
    //   cs_demand_letter_client: demandLetterClient,
    //   cs_domain_restricted: restrictDomain,
    //   cs_invoice_comment_status: enableInvoiceComment,
    //   cs_split_opening_balance: slipInvoiceOutstandingBalance,
    //   cs_oustanding_followup: outstandingBalanceFollowup,
    //   s_enable_seconds_billing: enableSecondsBilling,
    //   cs_payment_acknowledge: paymentAcknowledgeMail,
    //   cs_show_invoice_month: showInvoiceMonth,
    //   cs_batchwise_billing: generateBatchwiseInvoice,
    //   attach_supporting_documents: attachSupportingDocuments,
    //   cs_invoice_type: invoiceType,
    //   cs_billing_footer: billingFooter,
    //   cs_invoice_to_email: invoiceToEmails,
    //   cs_invoice_cc_email: invoiceCcEmails,
    //   cs_is_excluded: excludeFromNITLLC,
    // };
    // console.log(clientSettingsUpdated);
