import React, { useEffect, useState } from "react";
import { Accordion, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

export const EditProject = ({ onSave, onCancel }) => {
  const { clientId, projectId } = useParams();

  const { getSingleProject, updateProject } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [excludeFromReferralInvoice, setExcludeFromReferralInvoice] = useState(false);
  const [billStatementFor, setBillStatementFor] = useState("All");
  const [setValue, setSetValue] = useState(0);
  const [splitEstimate, setSplitEstimate] = useState(false);
  const [enableTimeEstimateSetup, setEnableTimeEstimateSetup] = useState(false);
  const [invoiceOption, setInvoiceOption] = useState("NA");
  const [groupName, setGroupName] = useState("");
  const [threshold, setThreshold] = useState("0");
  const [isSigningEnabled, setIsSigningEnabled] = useState(false);
  const [matterType1, setMatterType1] = useState("");
  const [isCasebodyDefaultOpen, setIsCasebodyDefaultOpen] = useState(false);
  const [isCaseBillingChecked, setIsCaseBillingChecked] = useState(false);
  const [commentLimitValue, setCommentLimitValue] = useState(0);
  const [isBatchable, setIsBatchable] = useState(false);
  const [billingType, setBillingType] = useState("Resource Based");
  const [ratePerMin, setRatePerMin] = useState("");
  const [rateCaseMin, setRateCaseMin] = useState("");
  // this is for condition
  const [fixedRate, setFixedRate] = useState("");
  const [variable1, setVariable1] = useState("");
  const [variable2, setVariable2] = useState("");
  const [variable3, setVariable3] = useState("0.00");
  const [variable4, setVariable4] = useState("");
  const [variable5, setVariable5] = useState("");
  const [variable6, setVariable6] = useState("");
  const [variable7, setVariable7] = useState("0.00");

  const [fixedRateCaption, setFixedRateCaption] = useState("Fixed Count");
  const [variable1RateCaption, setVariable1RateCaption] = useState("Variable 1 Count");
  const [variable2RateCaption, setVariable2RateCaption] = useState("Variable 2 Count");
  const [variable3RateCaption, setVariable3RateCaption] = useState("Variable 3 Count");
  const [variable4RateCaption, setVariable4RateCaption] = useState("Variable 4 Count");
  const [variable5RateCaption, setVariable5RateCaption] = useState("Variable 5 Count");
  const [variable6RateCaption, setVariable6RateCaption] = useState("Variable 6 Count");
  const [variable7RateCaption, setVariable7RateCaption] = useState("Variable 7 Rate");

  const [fixedCountCaption, setFixedCountCaption] = useState("Fixed Count");
  const [variable1CountCaption, setVariable1CountCaption] = useState("Variable 1 Count");
  const [variable2CountCaption, setVariable2CountCaption] = useState("Variable 2 Count");
  const [variable3CountCaption, setVariable3CountCaption] = useState("Variable 3 Count");
  const [variable4CountCaption, setVariable4CountCaption] = useState("Variable 4 Count");
  const [variable5CountCaption, setVariable5CountCaption] = useState("Variable 5 Count");
  const [variable6CountCaption, setVariable6CountCaption] = useState("Variable 6 Count");
  const [variable7CountCaption, setVariable7CountCaption] = useState("Variable 7 Count");

  const [fixedRateDefault, setFixedRateDefault] = useState("0.00");
  const [variable1Default, setVariable1Default] = useState("0.00");
  const [variable2Default, setVariable2Default] = useState("0.00");
  const [variable3Default, setVariable3Default] = useState("0.00");
  const [variable4Default, setVariable4Default] = useState("0.00");
  const [variable5Default, setVariable5Default] = useState("0.00");
  const [variable6Default, setVariable6Default] = useState("0.00");
  const [variable7Default, setVariable7Default] = useState("0.00");

  // this is for 3 condition

  const [saasCharges, setSaasCharges] = useState("");
  const [saasChargesCaption, setSaasChargesCaption] = useState("");
  const [salesTaxRate, setSalesTaxRate] = useState("0.0000");

  // condition 4

  const [rate, setRate] = useState("123.0000");
  const [cappingAmount, setCappingAmount] = useState("0.0000");
  const [cancellationCharge, setCancellationCharge] = useState("0.0000");
  const [enableQC, setEnableQC] = useState(false);
  const [freePagesThreshold, setFreePagesThreshold] = useState("0");
  const [qcCharge, setQcCharge] = useState("0.0000");

  // //////////////////////////////////////////

  const [freeMaxCases, setFreeMaxCases] = useState("0");
  const [caseReopen, setCaseReopen] = useState("No");
  const [separateInvoice, setSeparateInvoice] = useState("No");
  const [newTimerView, setNewTimerView] = useState("No");
  const [splitComment, setSplitComment] = useState("No");
  const [displayTimerSeconds, setDisplayTimerSeconds] = useState("Disabled");
  const [dueDateNotification, setDueDateNotification] = useState("Disabled");
  const [commentFetchDocuments, setCommentFetchDocuments] =
    useState("Disabled");
  const [caseMRRRequest, setCaseMRRRequest] = useState("Disabled");
  const [fileDeliveryCheck, setFileDeliveryCheck] = useState("Disabled");
  const [caseClosureDeliveryCheck, setCaseClosureDeliveryCheck] =
    useState("Disabled");

  const [enableBookmarkModule, setEnableBookmarkModule] = useState(false);
  const [sourceTag, setSourceTag] = useState("");
  const [backupTag, setBackupTag] = useState("");
  const [restrictedTag, setRestrictedTag] = useState("");
  const [destinationTag, setDestinationTag] = useState("");
  const [enableReviewSheet, setEnableReviewSheet] = useState(false);
  const [matterType2, setMatterType2] = useState("");
  const [enablePFSModule, setEnablePFSModule] = useState(false);
  const [pfsMatterType, setPfsMatterType] = useState("");
  const [pfsDestTag, setPfsDestTag] = useState("");
  const [checkList, setCheckList] = useState("");
  const [file, setFile] = useState(null);
  const [matterType, setMatterType] = useState("");
  const [mrsType, setMrsType] = useState("MRS Live");
  const [bateType, setBateType] = useState("NIT Bate");
  const [nitBatePrefix, setNitBatePrefix] = useState("NIT-[case_id]-");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSave = async () => {
    const data = {
      title,
      body,
      notifications: selectedTags.map((tag) => users.indexOf(tag) + 1),
      no_notifications: selectedTags.length === 0,
      exclude_from_referral_invoice: excludeFromReferralInvoice,
      bill_statement_for: billStatementFor,
      set_value: setValue,
      split_estimate: splitEstimate,
      enable_time_estimate_setup: enableTimeEstimateSetup,
      configure_for: invoiceOption,
      project_group_config: groupName,
      enable_signing: isSigningEnabled,
      pfs_matter_type: matterType1 || null,
      open_casebody_default: isCasebodyDefaultOpen,
      case_billing_check: isCaseBillingChecked,
      comments_limit: parseInt(commentLimitValue),
      is_batchable: isBatchable,
      billing_type: billingType,
      ratemin: ratePerMin || null,
      free_max_cases: freeMaxCases,
      case_reopen: caseReopen === "Yes",
      separate_invoice: separateInvoice === "Yes",
      new_timer_view: newTimerView === "Yes",
      enable_quality_check: splitComment === "Yes(Mandatory)",
      display_timer_seconds: displayTimerSeconds === "Enabled",
      due_date_notification: dueDateNotification === "Enabled",
      comment_fetch_documents: commentFetchDocuments === "Enabled",
      case_mrr_request: caseMRRRequest === "Enabled",
      file_delivery_check: fileDeliveryCheck === "Enabled",
      case_closure_delivery_check: caseClosureDeliveryCheck === "Enabled",
      enable_review_sheet: enableReviewSheet,
      enable_pfs_module: enablePFSModule,
      krqnnq: null,
      checklist_message: checkList,
      checklist_file: null,
    };

    // console.log("this is the response data ===> ", data);
    // console.log("this is project id ==> ", projectId);

    try {
      const response = await updateProject(clientId, projectId, data);
      // console.log(response);
      toast.success(
        `Project Updated successfully! ID: ${response.project_id}`
      );
      onSave();
    } catch (error) {
      toast.error(`Failed to create project: ${error.message}`);
    }
  };

  const [project, setProject] = useState(null);
  const fetchProject = async () => {
    try {
      const projectData = await getSingleProject(clientId, projectId);

      setTitle(projectData.title);
      setBody(projectData.body);
      setSelectedTags(projectData.selected_tags || []);
      setExcludeFromReferralInvoice(!!projectData.exclude_from_referral_invoice);
      setBillStatementFor(projectData.bill_statement_for || "All");
      setSetValue(projectData.set_value || 0);
      setSplitEstimate(!!projectData.split_estimate);
      setEnableTimeEstimateSetup(!!projectData.enable_time_estimate_setup);
      setInvoiceOption(projectData.configure_for || "NA");
      setGroupName(projectData.project_group_config || "");
      setIsSigningEnabled(!!projectData.enable_signing);
      setMatterType1(projectData.pfs_matter_type || "");
      setIsCasebodyDefaultOpen(!!projectData.open_casebody_default);
      setIsCaseBillingChecked(!!projectData.case_billing_check);
      setCommentLimitValue(projectData.comments_limit || 0);
      setIsBatchable(!!projectData.is_batchable);
      setBillingType(projectData.billing_type || "Resource Based");
      setRatePerMin(projectData.ratemin || "");
      setFreeMaxCases(projectData.free_max_cases || "0");
      setCaseReopen(projectData.case_reopen ? "Yes" : "No");
      setSeparateInvoice(projectData.separate_invoice ? "Yes" : "No");
      setNewTimerView(projectData.new_timer_view ? "Yes" : "No");
      setSplitComment(
        projectData.enable_quality_check ? "Yes(Mandatory)" : "No"
      );
      setDisplayTimerSeconds(
        projectData.display_timer_seconds ? "Enabled" : "Disabled"
      );
      setDueDateNotification(
        projectData.due_date_notification ? "Enabled" : "Disabled"
      );
      setCommentFetchDocuments(
        projectData.comment_fetch_documents ? "Enabled" : "Disabled"
      );
      setCaseMRRRequest(projectData.case_mrr_request ? "Enabled" : "Disabled");
      setFileDeliveryCheck(
        projectData.file_delivery_check ? "Enabled" : "Disabled"
      );
      setCaseClosureDeliveryCheck(
        projectData.case_closure_delivery_check ? "Enabled" : "Disabled"
      );
      setEnableReviewSheet(!!projectData.enable_review_sheet);
      setEnablePFSModule(!!projectData.enable_pfs_module);
      setCheckList(projectData.checklist_message || "");
      setMatterType(projectData.matter_type || "");
      setMrsType(projectData.mrs_type || "MRS Live");
      setBateType(projectData.bate_type || "NIT Bate");
      setNitBatePrefix(projectData.nit_bate_prefix || "NIT-[case_id]-");

      setProject(projectData);
    } catch (error) {
      console.error("Error fetching project details:", error.message);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [clientId, projectId]);

  // console.log("this is project data==> ", project);

  return (
    <>
      <div className="container my-4">
        <Card className="p-4 shadow-lg border-0">
          <Row>
            <Col lg={9} md={8} style={{ height: "100vh", overflowY: "scroll" }}>
              <h2
                className="mb-4 form-title text-center pt-3"
                style={{ color: "#0098ca" }}
              >
                Edit Project
              </h2>
              <div className="m-2">
                <Card className="p-4 shadow-lg border-0">
                  <div className="m-2">
                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"  id="section-title"
                    >
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          <label className="required form-label fs-7 p-0 ">Title</label>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div>
                            <input
                              type="text"
                              name="title"
                              className="form-control mb-2 p-2 fs-8"
                              placeholder="Project Name"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                      defaultActiveKey="0"
                      id="section-body" 
                      className="card card-flush accordionCard"
                    >
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                        <label className="required form-label fs-7">Body</label>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div>
                            <input
                              type="text"
                              name="body"
                                  className="form-control mb-2 p-2 fs-8"
                              placeholder="Project Message"
                              value={body}
                              onChange={(e) => setBody(e.target.value)}
                            />
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    {/* Additional settings accordions */}
                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"
                      id="section-project-referral" 
                    >
                      {/* Referral Invoice */}
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                        <label className="required form-label fs-7">Project Referral</label>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="form-check">
                            <input
                                className="form-check-input p-2 fs-8"
                              type="checkbox"
                              checked={excludeFromReferralInvoice}
                              onChange={(e) => setExcludeFromReferralInvoice(e.target.checked)}
                            />
                           <span className="form-check-label fw-semibold text-gray-700 fs-8">
                              Exclude from Referral Invoice
                            </span>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"
                      id="section-define-billable-statement"
                    >
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>
                        <label className="required form-label fs-7">
                            Define Billable Statement
                          </label>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="billable-statement form-check-custom mb-4">
                            <input
                             className="form-check-input fs-8 p-2 "
                              type="radio"
                              id="all"
                              name="billStatement"
                              value="all"
                              checked={billStatementFor === "All"}
                              onChange={(e) => setBillStatementFor(e.target.value)}
                            />
                            <label htmlFor="all">All</label>
                          </div>
                          <div>
                            <input
                              className="form-check-input p-2 fs-8"
                              type="radio"
                              id="delivered"
                              name="billStatement"
                              value="Delivered Only"
                              checked={billStatementFor === "Delivered Only"}
                              onChange={(e) => setBillStatementFor(e.target.value)}
                            />
                            <label htmlFor="delivered">Delivered Only</label>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"
                      id="section-estimate-unit"
                    >
                      {/* Estimate Unit */}
                      <Accordion.Item eventKey="2">
                        <Accordion.Header>
                        <label className="required form-label fs-7">Estimate Unit</label>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="mb-4">
                          <label htmlFor="setValue" className="fs-8">Set Value</label> <br />
                            <input
                              type="text"
                              id="setValue"
                              // className="form-control mb-2 w-25"
                                className="form-control mb-2 fs-8 p-2"
                              placeholder="0"
                              value={setValue}
                              onChange={(e) => setSetValue(Number(e.target.value))}
                            />
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id="splitEstimate"
                              className="form-check-input fs-8 p-2"
                              checked={splitEstimate}
                              onChange={(e) => setSplitEstimate(e.target.checked)}
                            />
                            <label htmlFor="splitEstimate">Split Estimate</label>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"
                      id="section-time-estimate-approval-setup"
                    >
                      {/* Time Estimate Approval Setup */}
                      <Accordion.Item eventKey="3">
                        <Accordion.Header>
                        <label className="required form-label fs-7">
                            Time Estimate Approval Setup
                          </label>
                        </Accordion.Header>
                        <Accordion.Body>
                          <input
                                className="form-check-input p-1 fs-8 form-check-sm"
                            type="checkbox"
                            checked={enableTimeEstimateSetup}
                            onChange={(e) => setEnableTimeEstimateSetup(e.target.checked)}
                          />
                         <span className="form-check-label fw-semibold text-gray-700 fs-8">
                            Enable Setup
                          </span>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"
                      id="section-project-wise-invoice-configuration"
                    >
                      {/* Project Wise Invoice Configuration */}
                      <Accordion.Item eventKey="4">
                        <Accordion.Header>
                        <label className="required form-label fs-7 ">
                            Project Wise Invoice Configuration
                          </label>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="form-group">
                          <label className="mb-4 fs-8">CONFIGURE FOR</label>
                            <div className="mb-4">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="na"
                                name="invoiceConfig"
                                value="NA"
                                checked={invoiceOption === "NA"}
                                onChange={(e) => setInvoiceOption(e.target.value)}
                              />
                               <label htmlFor="na" className="fs-8 mx-2">NA</label>
                            </div>
                            <div className="mb-4">
                              <input
                              className="form-check-input fs-8"
                                type="radio"
                                id="individual"
                                name="invoiceConfig"
                                value="Individual Invoice"
                                checked={invoiceOption === "Individual Invoice"}
                                onChange={(e) => setInvoiceOption(e.target.value)}
                              />
                               <label htmlFor="individual" className="fs-8 mx-2">Individual Invoice</label>
                            </div>
                            <div className="mb-4">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="projectGroup"
                                name="invoiceConfig"
                                value="Project-Group Invoice"
                                checked={invoiceOption === "Project-Group Invoice"}
                                onChange={(e) => setInvoiceOption(e.target.value)}
                              />
                                 <label htmlFor="projectGroup" className="fs-8 mx-2">Project-Group Invoice</label>
                            </div>
                          </div>

                          {invoiceOption === "Project-Group Invoice" && (
                            <div className="form-group fs-8">
                              <label>CREATE NEW PROJECT-GROUP & CONFIGURE</label>
                              <br />
                              <div className="form-group fs-8 pt-2">
                              <input
                                type="text"
                                  className="form-control w-25 fs-8 p-2 "
                                placeholder="Enter project group name"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                              />
                              </div>
                            </div>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"
                      id="section-mrr-setting"
                    >
                      {/* MRR Setting */}
                      <Accordion.Item eventKey="5">
                        <Accordion.Header>
                        <label className="required form-label fs-7">MRR Setting</label>
                        </Accordion.Header>
                        <Accordion.Body>
                        <div className="form-group fs-8">
                        <label className="fs-8">RESERVED CHARGE THRESHOLD:</label> <br />
                            <input
                              type="text"
                              className="form-control w-25 fs-8 p-2"
                              placeholder="Enter threshold value"
                              value={threshold}
                              onChange={(e) => setThreshold(e.target.value)}
                            />
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"
                       id="section-e-signature-setting"
                    >
                      {/* E-Signature Setting */}
                      <Accordion.Item eventKey="6">
                        <Accordion.Header>
                        <label className="required form-label fs-8">E-Signature Setting</label>
                        </Accordion.Header>
                        <Accordion.Body>
                        <div className="form-group fs-8">
                            <label>
                              <input
                                 className="form-check-input fs-8"
                                type="checkbox"
                                checked={isSigningEnabled}
                                onChange={(e) => setIsSigningEnabled(e.target.checked)}
                              />
                              Enable Signing
                            </label>
                          </div>
                          <div className="form-group fs-8">
                          <label className="fs-8s">PFS MATTER TYPE:</label>
                          <div className="pt-2">
                            <select
                              value={matterType1}
                              onChange={(e) => setMatterType1(e.target.value)}
                              disabled={!isSigningEnabled}
                            >
                              <option value="">Choose</option>
                              <option value="Risperdal - SF">Risperdal - SF</option>
                              <option value="Invega">Invega</option>
                              <option value="Fluoroquinolone">Fluoroquinolone</option>
                              <option value="Risperdal-Invega">Risperdal-Invega</option>
                              <option value="Xarelto">Xarelto</option>
                              <option value="TVM">TVM</option>
                              <option value="Ethicon">Ethicon</option>
                              <option value="Bard">Bard</option>
                              <option value="Boston">Boston</option>
                              <option value="AMS">AMS</option>
                              <option value="Januvia">Januvia</option>
                            </select>
                          </div>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"
                      id="section-case-setting"
                    >
                      {/* Case Setting */}
                      <Accordion.Item eventKey="7">
                        <Accordion.Header>
                        <label className="required form-label fs-7">Case Setting</label>
                        </Accordion.Header>
                        <Accordion.Body>
                        <div className="form-group fs-8">
                          <label className="fs-8">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={isCasebodyDefaultOpen}
                                onChange={(e) => setIsCasebodyDefaultOpen(e.target.checked)}
                              />
                              Open Casebody Default?
                            </label>
                          </div>
                          <div className="form-group">
                          <label className="fs-8">
                              <input
                                className="form-check-input fs-8"
                                type="checkbox"
                                checked={isCaseBillingChecked}
                                onChange={(e) => setIsCaseBillingChecked(e.target.checked)}
                              />
                              Case Billing Check?
                            </label>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"
                       id="section-comment-setting"
                    >
                      {/* Comment Settings */}
                      <Accordion.Item eventKey="8">
                        <Accordion.Header>
                        <label className="required form-label fs-7">Comment Settings</label>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="form-group">
                          <label className="fs-8">COMMENTS LIMIT:</label> <br />
                            <input
                              type="number"
                             
                              className="form-control w-25 fs-8 p-2"
                              placeholder="Enter comments limit"
                              value={commentLimitValue}
                              onChange={(e) => setCommentLimitValue(e.target.value)}
                            />
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                      defaultActiveKey="0"
                      className="card card-flush accordionCard"
                      id="section-checklist-setting"
                    >
                      {/* Checklist Settings */}
                      <Accordion.Item eventKey="9">
                        <Accordion.Header>
                        <label className="required form-label fs-7">Checklist Settings</label>
                        </Accordion.Header>
                        <Accordion.Body>
                          {/* <input
                            type="text"
                            name="checklist_message"
                            className="form-control mb-2"
                            placeholder="Checklist Message"
                            value={checkList}
                            onChange={(e) => setCheckList(e.target.value)}
                          />
                          <div>
                            <label className="required form-label">File</label> <br />
                            <input
                              type="file"
                              name="file"
                              placeholder="File"
                              required
                              onChange={handleFileChange}
                            />
                          </div> */}
                             <div className="row">
                          <div className="col-md-6">
                            <label className="required form-label fs-8 pt-2">Checklist Message</label> <br />
                            <input
                              type="text"
                              name="checklist_message"
                              className="form-control mb-2 p-2 fs-8"
                              placeholder="Checklist Message"
                              value={checkList}
                              onChange={(e) => setCheckList(e.target.value)}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="required form-label fs-8 pt-2 ">File</label> <br />
                            <input
                              type="file"
                              name="file"
                              placeholder="File"
                              required
                              className="form-control p-2 fs-8 mb-2"
                              onChange={handleFileChange}
                            />
                          </div>

                        </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <Accordion
                    defaultActiveKey="0"
                    className="card card-flush accordionCard shadow-sm" id="section-project-setting"
                  >
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <b>Project Settings</b>
                      </Accordion.Header>
                      <Accordion.Body className="bg-light">
                        <div className="row g-4">
                          <div className="col-md-4">
                            <label className="fs-8">
                              <input
                                className="form-check-input fs-8 p-2"
                                type="checkbox"
                                checked={isBatchable}
                                onChange={() => setIsBatchable(!isBatchable)}
                              />
                              Is Batchable?
                            </label>
                          </div>
                        </div>
                        <hr />
                        <div className="row ">
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-7"><b>BILLING TYPE:</b></Form.Label>
                              <Form.Select
                                name="payType"
                                className="p-2 fs-8"
                                value={billingType}
                                onChange={(e) => setBillingType(e.target.value)}
                              >
                                <option value="Resource Based">Resource Based</option>
                                <option value="Case">Case</option>
                                <option value="Case Plus Variable">Case Plus Variable</option>
                                <option value="SAAS Based">SAAS Based</option>
                                <option value="MRR Based">MRR Based</option>
                              </Form.Select>
                              {/* Conditional rendering based on selected billing type */}
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-7">FREE MAX CASES:</Form.Label>
                              <Form.Control
                                type="text"
                                className="form-control  fs-8 p-2"
                                placeholder="Enter free max cases"
                                value={freeMaxCases}
                                onChange={(e) => setFreeMaxCases(e.target.value)}
                              />
                            </Form.Group>
                          </div>

                        </div>
                        <div className="row ">
                          {billingType === "Resource Based" && (
                            <>
                              <div className="col-4 form-group">
                                <br />
                                <label className="fs-8"><b>RATE/MIN:</b></label> <br />
                                <input
                                  type="text"
                                  className="form-control p-2 fs-8"
                                  placeholder="Enter rate per min"
                                  value={ratePerMin}
                                  onChange={(e) => setRatePerMin(e.target.value)}
                                />
                              </div>
                            </>
                          )}

                          {billingType === "Case" && (
                            <>
                              <div className="col-4 form-group">
                                <br />
                                <label className="fs-8">RATE/CASE:</label> <br />
                                <input
                                  type="text"
                                  className="form-control  fs-8 p-2"
                                  placeholder="Enter rate per min"
                                  value={rateCaseMin}
                                  onChange={(e) => setRateCaseMin(e.target.value)}
                                />
                              </div>
                            </>
                          )}

                          {billingType === "Case Plus Variable" && (
                            <>
                              <div className="container">
                                <br />
                                {/* Row 1: Fixed Rate and Variables */}
                                <div className="row">
                                  <div className="col-3">
                                    <div className="form-group fs-8">
                                      <label className="fs-8">FIXED RATE:</label>
                                      <input
                                        type="text"
                                        className="form-control fs-8 p-2"
                                        placeholder="Enter fixed rate"
                                        value={fixedRate}
                                        onChange={(e) => setFixedRate(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 1:</label>
                                      <input
                                        type="text"
                                        className="form-control fs-8 p-2"
                                        placeholder="Enter variable 1"
                                        value={variable1}
                                        onChange={(e) => setVariable1(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 2:</label>
                                      <input
                                        type="text"
                                        className="form-control fs-8 p-2"
                                        placeholder="Enter variable 2"
                                        value={variable2}
                                        onChange={(e) => setVariable2(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 3:</label>
                                      <input
                                        type="text"
                                        className="form-control fs-8 p-2"
                                        placeholder="Enter variable 3"
                                        value={variable3}
                                        onChange={(e) => setVariable3(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Row 2: Variables 4 to 7 */}
                                <div className="row">
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 4:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter variable 4"
                                        className="form-control fs-8 p-2"
                                        value={variable4}
                                        onChange={(e) => setVariable4(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 5:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter variable 5"
                                        className="form-control fs-8 p-2"
                                        value={variable5}
                                        onChange={(e) => setVariable5(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 6:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter variable 6"
                                        className="form-control fs-8 p-2"
                                        value={variable6}
                                        onChange={(e) => setVariable6(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 7:</label>
                                      <input
                                        type="text"
                                        placeholder="Enter variable 7"
                                        className="form-control fs-8 p-2"
                                        value={variable7}
                                        onChange={(e) => setVariable7(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Row 3: Rate Captions */}
                                <div className="row">
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">FIXED RATE CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Fixed Rate Caption"
                                        className="form-control fs-8 p-2"
                                        value={fixedRateCaption}
                                        onChange={(e) => setFixedRateCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 1 RATE CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 1 Rate Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable1RateCaption}
                                        onChange={(e) => setVariable1RateCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 2 RATE CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 2 Rate Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable2RateCaption}
                                        onChange={(e) => setVariable2RateCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 3 RATE CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 3 Rate Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable3RateCaption}
                                        onChange={(e) => setVariable3RateCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Row 4: Rate Captions Continued */}
                                <div className="row">
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 4 RATE CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 4 Rate Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable4RateCaption}
                                        onChange={(e) => setVariable4RateCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 5 RATE CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 5 Rate Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable5RateCaption}
                                        onChange={(e) => setVariable5RateCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 6 RATE CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 6 Rate Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable6RateCaption}
                                        onChange={(e) => setVariable6RateCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 7 RATE CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 7 Rate Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable7RateCaption}
                                        onChange={(e) => setVariable7RateCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Row 5: Count Captions */}
                                <div className="row">
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">FIXED COUNT CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Fixed Count Caption"
                                        className="form-control fs-8 p-2"
                                        value={fixedCountCaption}
                                        onChange={(e) => setFixedCountCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 1 COUNT CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 1 Count Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable1CountCaption}
                                        onChange={(e) => setVariable1CountCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 2 COUNT CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 2 Count Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable2CountCaption}
                                        onChange={(e) => setVariable2CountCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 3 COUNT CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 3 Count Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable3CountCaption}
                                        onChange={(e) => setVariable3CountCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Row 6: Count Captions Continued */}
                                <div className="row">
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 4 COUNT CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 4 Count Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable4CountCaption}
                                        onChange={(e) => setVariable4CountCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 5 COUNT CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 5 Count Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable5CountCaption}
                                        onChange={(e) => setVariable5CountCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 6 COUNT CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 6 Count Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable6CountCaption}
                                        onChange={(e) => setVariable6CountCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 7 COUNT CAPTION:</label>
                                      <input
                                        type="text"
                                        placeholder="Variable 7 Count Caption"
                                        className="form-control fs-8 p-2"
                                        value={variable7CountCaption}
                                        onChange={(e) => setVariable7CountCaption(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Row 7: Defaults */}
                                <div className="row">
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">FIXED RATE DEFAULT:</label>
                                      <input
                                        type="text"
                                        placeholder="0.00"
                                        className="form-control fs-8 p-2"
                                        value={fixedRateDefault}
                                        onChange={(e) => setFixedRateDefault(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 1 DEFAULT:</label>
                                      <input
                                        type="text"
                                        placeholder="0.00"
                                        value={variable1Default}
                                        className="form-control fs-8 p-2"
                                        onChange={(e) => setVariable1Default(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 2 DEFAULT:</label>
                                      <input
                                        type="text"
                                        placeholder="0.00"
                                        value={variable2Default}
                                        className="form-control fs-8 p-2"
                                        onChange={(e) => setVariable2Default(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 3 DEFAULT:</label>
                                      <input
                                        type="text"
                                        placeholder="0.00"
                                        value={variable3Default}
                                        className="form-control fs-8 p-2"
                                        onChange={(e) => setVariable3Default(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Row 8: Defaults Continued */}
                                <div className="row">
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 4 DEFAULT:</label>
                                      <input
                                        type="text"
                                        placeholder="0.00"
                                        className="fs-8 p-2"
                                        value={variable4Default}
                                        onChange={(e) => setVariable4Default(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 5 DEFAULT:</label>
                                      <input
                                        type="text"
                                        placeholder="0.00"
                                        value={variable5Default}
                                        className="form-control fs-8 p-2"
                                        onChange={(e) => setVariable5Default(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 6 DEFAULT:</label>
                                      <input
                                        type="text"
                                        placeholder="0.00"
                                        className="form-control fs-8 p-2"
                                        value={variable6Default}
                                        onChange={(e) => setVariable6Default(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="form-group">
                                      <label className="fs-8">VARIABLE 7 DEFAULT:</label>
                                      <input
                                        type="text"
                                        placeholder="0.00"
                                        className="form-control fs-8 p-2"
                                        value={variable7Default}
                                        onChange={(e) => setVariable7Default(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}


                          {billingType === "SAAS Based" && (
                            <>
                              <div className="container">
                                <br />
                                <div className="row">
                                  <div className=" col-md-4 form-group">
                                    <label className="fs-8"><b>SAAS CHARGES:</b></label> <br />
                                    <input
                                      type="text"
                                      placeholder="Enter SAAS charges"
                                      className="form-control fs-8 p-2"
                                      value={saasCharges}
                                      onChange={(e) => setSaasCharges(e.target.value)}

                                    />
                                  </div>

                                  <div className="col-4 form-group">
                                    <label className="fs-8"><b>SAAS CHARGES CAPTION:</b></label> <br />
                                    <input
                                      type="text"
                                      placeholder="Enter SAAS charges caption"
                                      className="form-control fs-8 p-2"
                                      value={saasChargesCaption}
                                      onChange={(e) => setSaasChargesCaption(e.target.value)}
                                    />
                                  </div>

                                  <div className="col-4 form-group">
                                    <label className="fs-8"><b>SALES TAX RATE:</b></label> <br />
                                    <input
                                      type="text"
                                      placeholder="0.0000"
                                      className="form-control fs-8 p-2"
                                      value={salesTaxRate}
                                      onChange={(e) => setSalesTaxRate(e.target.value)}
                                    />
                                  </div>
                                </div>

                              </div>
                            </>
                          )}

                          {billingType === "MRR Based" && (
                            <>
                              <div className="container">
                                <br />
                                <div className="row">
                                  {/* RATE input */}
                                  <div className="col">
                                    <div className="form-group">
                                      <label className="fs-8"><b>RATE:</b></label> <br />
                                      <input
                                        type="text"
                                        placeholder="Enter rate"
                                        className="form-control fs-8 p-2"
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                      />
                                    </div>
                                  </div>

                                  {/* CAPPING AMOUNT input */}
                                  <div className="col">
                                    <div className="form-group">
                                      <label className="fs-8"><b>CAPPING AMOUNT:</b></label> <br />
                                      <input
                                        type="text"
                                        placeholder="Enter capping amount"
                                        className="form-control fs-8 p-2"
                                        value={cappingAmount}
                                        onChange={(e) => setCappingAmount(e.target.value)}
                                      />
                                    </div>
                                  </div>

                                  {/* CANCELLATION CHARGE input */}
                                  <div className="col">
                                    <div className="form-group">
                                      <label className="fs-8"><b>CANCELLATION CHARGE:</b></label> <br />
                                      <input
                                        type="text"
                                        placeholder="Enter cancellation charge"
                                        className="form-control fs-8 p-2"
                                        value={cancellationCharge}
                                        onChange={(e) =>
                                          setCancellationCharge(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Enable QC checkbox */}
                                <div className="form-group">
                                  <input
                                    type="checkbox"
                                    checked={enableQC}
                                    onChange={(e) => setEnableQC(e.target.checked)}
                                  />
                                  <label>Enable QC</label>
                                </div>

                                {/* Conditional fields for QC */}
                                {enableQC && (
                                  <div className="row">
                                    {/* FREE PAGES THRESHOLD FOR QC input */}
                                    <div className="col">
                                      <div className="form-group">
                                        <label className="fs-8"><b>FREE PAGES THRESHOLD FOR QC:</b></label> <br />
                                        <input
                                          type="text"
                                          placeholder="Enter free pages threshold for QC"
                                          className="fs-8 p-2"
                                          value={freePagesThreshold}
                                          onChange={(e) =>
                                            setFreePagesThreshold(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>

                                    {/* QC CHARGE input */}
                                    <div className="col">
                                      <div className="form-group">
                                        <label className="fs-8"><b>QC CHARGE:</b></label> <br />
                                        <input
                                          type="text"
                                          placeholder="Enter QC charge"
                                          className="fs-8 p-2"
                                          value={qcCharge}
                                          onChange={(e) => setQcCharge(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>


                        {/* // till here i have done  */}

                        <hr />
                        {/* <div className="row g-3">
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">
                                CASE REOPEN?:
                              </Form.Label>

                              <div className="d-flex align-items-center">
                                <div className="form-check me-2">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="caseReopenYes"
                                    name="caseReopen"
                                    value="Yes"
                                    checked={caseReopen === "Yes"}
                                    onChange={() => setCaseReopen("Yes")}
                                  />
                                  <label htmlFor="caseReopenYes" className="form-check-label fs-7 mx-2">
                                    Yes
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="caseReopenNo"
                                    name="caseReopen"
                                    value="No"
                                    checked={caseReopen === "No"}
                                    onChange={() => setCaseReopen("No")}
                                  />
                                  <label tmlFor="caseReopenNo" className="fs-8 mx-2">
                                    No
                                  </label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                        
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">
                                SEPARATE INVOICE?:
                              </Form.Label>
                              <div className="d-flex align-items-center">
                                <div className="form-check me-2">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="separateInvoiceYes"
                                    name="separateInvoice"
                                    value="Yes"
                                    checked={separateInvoice === "Yes"}
                                    onChange={() => setSeparateInvoice("Yes")}
                                  />
                                  <label htmlFor="separateInvoiceYes" className="form-check-label fs-7 mx-2">
                                    Yes
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="separateInvoiceNo"
                                    name="separateInvoice"
                                    value="No"
                                    checked={separateInvoice === "No"}
                                    onChange={() => setSeparateInvoice("No")}
                                  />
                                  <label htmlFor="separateInvoiceNo" className="fs-8 mx-2">
                                    No
                                  </label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">
                                NEW TIMER VIEW?:
                              </Form.Label>
                              <div className="d-flex align-items-center">
                                <div className="form-check me-2">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="newTimerViewYes"
                                    name="newTimerView"
                                    value="Yes"
                                    checked={newTimerView === "Yes"}
                                    onChange={() => setNewTimerView("Yes")}
                                  />
                                  <label htmlFor="newTimerViewYes" className="fs-8 mx-2">Yes</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="newTimerViewNo"
                                    name="newTimerView"
                                    value="No"
                                    checked={newTimerView === "No"}
                                    onChange={() => setNewTimerView("No")}
                                  />
                                  <label htmlFor="newTimerViewNo" className="fs-8 mx-2">No</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">
                                ENABLE SPLIT COMMENT:
                              </Form.Label>
                              <div className="d-flex align-items-center">
                                <div className="form-check me-2">
                                  <input
                                    className="form-check-input fs-8"
                                    type="radio"
                                    id="splitCommentNo"
                                    name="splitComment"
                                    value="No"
                                    checked={splitComment === "No"}
                                    onChange={() => setSplitComment("No")}
                                  />
                                  <label htmlFor="splitCommentNo" className="fs-8 mx-2">No</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="splitCommentYes"
                                    name="splitComment"
                                    value="Yes(Mandatory)"
                                    checked={splitComment === "Yes(Mandatory)"}
                                    onChange={() => setSplitComment("Yes(Mandatory)")}
                                  />
                                  <label htmlFor="splitCommentYes" className="fs-8 mx-2">Yes(Mandatory)</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">
                                DISPLAY TIMER SECOND(S):
                              </Form.Label>
                              <div className="d-flex align-items-center">
                                <div className="form-check me-2">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="displayTimerDisabled"
                                    name="displayTimerSeconds"
                                    value="Disabled"
                                    checked={displayTimerSeconds === "Disabled"}
                                    onChange={() => setDisplayTimerSeconds("Disabled")}
                                  />
                                  <label htmlFor="displayTimerDisabled" className="fs-8 mx-2">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="displayTimerEnabled"
                                    name="displayTimerSeconds"
                                    value="Enabled"
                                    checked={displayTimerSeconds === "Enabled"}
                                    onChange={() => setDisplayTimerSeconds("Enabled")}
                                  />
                                  <label htmlFor="displayTimerEnabled" className="fs-8 mx-2">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">
                                DUE DATE NOTIFICATION:
                              </Form.Label>
                              <div className="d-flex align-items-center">
                                <div className="form-check me-2">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="dueDateNotificationDisabled"
                                    name="dueDateNotification"
                                    value="Disabled"
                                    checked={dueDateNotification === "Disabled"}
                                    onChange={() => setDueDateNotification("Disabled")}
                                  />
                                  <label htmlFor="dueDateNotificationDisabled" className="fs-8 mx-2">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="dueDateNotificationEnabled"
                                    name="dueDateNotification"
                                    value="Enabled"
                                    checked={dueDateNotification === "Enabled"}
                                    onChange={() => setDueDateNotification("Enabled")}
                                  />
                                  <label htmlFor="dueDateNotificationEnabled" className="fs-8 mx-2">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">
                                COMMENT FETCH DOCUMENTS:
                              </Form.Label>
                              <div className="d-flex align-items-center">
                                <div className="form-check me-2">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="commentFetchDisabled"
                                    name="commentFetchDocuments"
                                    value="Disabled"
                                    checked={commentFetchDocuments === "Disabled"}
                                    onChange={() => setCommentFetchDocuments("Disabled")}
                                  />
                                  <label htmlFor="commentFetchDisabled" className="fs-8 mx-2">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="commentFetchEnabled"
                                    name="commentFetchDocuments"
                                    value="Enabled"
                                    checked={commentFetchDocuments === "Enabled"}
                                    onChange={() => setCommentFetchDocuments("Enabled")}
                                  />
                                  <label htmlFor="commentFetchEnabled" className="fs-8 mx-2">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">
                                CASE MRR REQUEST:
                              </Form.Label>
                              <div className="d-flex align-items-center">
                                <div className="form-check me-2">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="caseMRRDisabled"
                                    name="caseMRRRequest"
                                    value="Disabled"
                                    checked={caseMRRRequest === "Disabled"}
                                    onChange={() => setCaseMRRRequest("Disabled")}
                                  />
                                  <label htmlFor="caseMRRDisabled" className="fs-8 mx-2">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="caseMRREnabled"
                                    name="caseMRRRequest"
                                    value="Enabled"
                                    checked={caseMRRRequest === "Enabled"}
                                    onChange={() => setCaseMRRRequest("Enabled")}
                                  />
                                  <label htmlFor="caseMRREnabled" className="fs-8 mx-2">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">
                                FILE DELIVERY CHECK:
                              </Form.Label>
                              <div className="d-flex align-items-center">
                                <div className="form-check me-2">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="fileDeliveryDisabled"
                                    name="fileDeliveryCheck"
                                    value="Disabled"
                                    checked={fileDeliveryCheck === "Disabled"}
                                    onChange={() => setFileDeliveryCheck("Disabled")}
                                  />
                                  <label htmlFor="fileDeliveryDisabled" className="fs-8 mx-2">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="fileDeliveryEnabled"
                                    name="fileDeliveryCheck"
                                    value="Enabled"
                                    checked={fileDeliveryCheck === "Enabled"}
                                    onChange={() => setFileDeliveryCheck("Enabled")}
                                  />
                                  <label htmlFor="fileDeliveryEnabled" className="fs-8 mx-2">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-7">
                                CASE CLOSURE DELIVERY CHECK:
                              </Form.Label>
                              <div className="d-flex align-items-center">
                                <div className="form-check me-2">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="caseClosureDeliveryDisabled"
                                    name="caseClosureDeliveryCheck"
                                    value="Disabled"
                                    checked={caseClosureDeliveryCheck === "Disabled"}
                                    onChange={() => setCaseClosureDeliveryCheck("Disabled")}
                                  />
                                  <label htmlFor="caseClosureDeliveryDisabled" className="fs-8 mx-2">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input fs-7"
                                    type="radio"
                                    id="caseClosureDeliveryEnabled"
                                    name="caseClosureDeliveryCheck"
                                    value="Enabled"
                                    checked={caseClosureDeliveryCheck === "Enabled"}
                                    onChange={() => setCaseClosureDeliveryCheck("Enabled")}
                                  />
                                  <label htmlFor="caseClosureDeliveryEnabled" className="fs-8">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>





                        </div> */}


                        <div className="row g-3">
                          {/* CASE REOPEN */}
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">CASE REOPEN?</Form.Label>
                              <div className="d-flex">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="caseReopenYes"
                                    name="caseReopen"
                                    value="Yes"
                                    checked={caseReopen === "Yes"}
                                    onChange={() => setCaseReopen("Yes")}
                                  />
                                  <label htmlFor="caseReopenYes" className="form-check-label fs-8">Yes</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="caseReopenNo"
                                    name="caseReopen"
                                    value="No"
                                    checked={caseReopen === "No"}
                                    onChange={() => setCaseReopen("No")}
                                  />
                                  <label htmlFor="caseReopenNo" className="form-check-label fs-8">No</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>

                          {/* SEPARATE INVOICE */}
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">SEPARATE INVOICE?</Form.Label>
                              <div className="d-flex">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="separateInvoiceYes"
                                    name="separateInvoice"
                                    value="Yes"
                                    checked={separateInvoice === "Yes"}
                                    onChange={() => setSeparateInvoice("Yes")}
                                  />
                                  <label htmlFor="separateInvoiceYes" className="form-check-label fs-8">Yes</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="separateInvoiceNo"
                                    name="separateInvoice"
                                    value="No"
                                    checked={separateInvoice === "No"}
                                    onChange={() => setSeparateInvoice("No")}
                                  />
                                  <label htmlFor="separateInvoiceNo" className="form-check-label fs-8">No</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>

                          {/* NEW TIMER VIEW */}
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">NEW TIMER VIEW?</Form.Label>
                              <div className="d-flex">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="newTimerViewYes"
                                    name="newTimerView"
                                    value="Yes"
                                    checked={newTimerView === "Yes"}
                                    onChange={() => setNewTimerView("Yes")}
                                  />
                                  <label htmlFor="newTimerViewYes" className="form-check-label fs-8">Yes</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="newTimerViewNo"
                                    name="newTimerView"
                                    value="No"
                                    checked={newTimerView === "No"}
                                    onChange={() => setNewTimerView("No")}
                                  />
                                  <label htmlFor="newTimerViewNo" className="form-check-label fs-8">No</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>

                          {/* ENABLE SPLIT COMMENT */}
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">ENABLE SPLIT COMMENT</Form.Label>
                              <div className="d-flex">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="splitCommentNo"
                                    name="splitComment"
                                    value="No"
                                    checked={splitComment === "No"}
                                    onChange={() => setSplitComment("No")}
                                  />
                                  <label htmlFor="splitCommentNo" className="form-check-label fs-8">No</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="splitCommentYes"
                                    name="splitComment"
                                    value="Yes(Mandatory)"
                                    checked={splitComment === "Yes(Mandatory)"}
                                    onChange={() => setSplitComment("Yes(Mandatory)")}
                                  />
                                  <label htmlFor="splitCommentYes" className="form-check-label fs-8">Yes (Mandatory)</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>

                          {/* DISPLAY TIMER SECONDS */}
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">DISPLAY TIMER SECONDS</Form.Label>
                              <div className="d-flex">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="displayTimerDisabled"
                                    name="displayTimerSeconds"
                                    value="Disabled"
                                    checked={displayTimerSeconds === "Disabled"}
                                    onChange={() => setDisplayTimerSeconds("Disabled")}
                                  />
                                  <label htmlFor="displayTimerDisabled" className="form-check-label fs-8">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="displayTimerEnabled"
                                    name="displayTimerSeconds"
                                    value="Enabled"
                                    checked={displayTimerSeconds === "Enabled"}
                                    onChange={() => setDisplayTimerSeconds("Enabled")}
                                  />
                                  <label htmlFor="displayTimerEnabled" className="form-check-label fs-8">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>

                          {/* DUE DATE NOTIFICATION */}
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">DUE DATE NOTIFICATION</Form.Label>
                              <div className="d-flex">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="dueDateNotificationDisabled"
                                    name="dueDateNotification"
                                    value="Disabled"
                                    checked={dueDateNotification === "Disabled"}
                                    onChange={() => setDueDateNotification("Disabled")}
                                  />
                                  <label htmlFor="dueDateNotificationDisabled" className="form-check-label fs-8">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="dueDateNotificationEnabled"
                                    name="dueDateNotification"
                                    value="Enabled"
                                    checked={dueDateNotification === "Enabled"}
                                    onChange={() => setDueDateNotification("Enabled")}
                                  />
                                  <label htmlFor="dueDateNotificationEnabled" className="form-check-label fs-8">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>

                          {/* COMMENT FETCH DOCUMENTS */}
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">COMMENT FETCH DOCUMENTS</Form.Label>
                              <div className="d-flex">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="commentFetchDisabled"
                                    name="commentFetchDocuments"
                                    value="Disabled"
                                    checked={commentFetchDocuments === "Disabled"}
                                    onChange={() => setCommentFetchDocuments("Disabled")}
                                  />
                                  <label htmlFor="commentFetchDisabled" className="form-check-label fs-8">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="commentFetchEnabled"
                                    name="commentFetchDocuments"
                                    value="Enabled"
                                    checked={commentFetchDocuments === "Enabled"}
                                    onChange={() => setCommentFetchDocuments("Enabled")}
                                  />
                                  <label htmlFor="commentFetchEnabled" className="form-check-label fs-8">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>

                          {/* CASE MRR REQUEST */}
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">CASE MRR REQUEST</Form.Label>
                              <div className="d-flex">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="caseMRRDisabled"
                                    name="caseMRRRequest"
                                    value="Disabled"
                                    checked={caseMRRRequest === "Disabled"}
                                    onChange={() => setCaseMRRRequest("Disabled")}
                                  />
                                  <label htmlFor="caseMRRDisabled" className="form-check-label fs-8">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="caseMRREnabled"
                                    name="caseMRRRequest"
                                    value="Enabled"
                                    checked={caseMRRRequest === "Enabled"}
                                    onChange={() => setCaseMRRRequest("Enabled")}
                                  />
                                  <label htmlFor="caseMRREnabled" className="form-check-label fs-8">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>

                          {/* FILE DELIVERY CHECK */}
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">FILE DELIVERY CHECK</Form.Label>
                              <div className="d-flex">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="fileDeliveryDisabled"
                                    name="fileDeliveryCheck"
                                    value="Disabled"
                                    checked={fileDeliveryCheck === "Disabled"}
                                    onChange={() => setFileDeliveryCheck("Disabled")}
                                  />
                                  <label htmlFor="fileDeliveryDisabled" className="form-check-label fs-8">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="fileDeliveryEnabled"
                                    name="fileDeliveryCheck"
                                    value="Enabled"
                                    checked={fileDeliveryCheck === "Enabled"}
                                    onChange={() => setFileDeliveryCheck("Enabled")}
                                  />
                                  <label htmlFor="fileDeliveryEnabled" className="form-check-label fs-8">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>

                          {/* CASE CLOSURE DELIVERY CHECK */}
                          <div className="col-md-4">
                            <Form.Group>
                              <Form.Label className="fs-8">CASE CLOSURE DELIVERY CHECK</Form.Label>
                              <div className="d-flex">
                                <div className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="caseClosureDeliveryDisabled"
                                    name="caseClosureDeliveryCheck"
                                    value="Disabled"
                                    checked={caseClosureDeliveryCheck === "Disabled"}
                                    onChange={() => setCaseClosureDeliveryCheck("Disabled")}
                                  />
                                  <label htmlFor="caseClosureDeliveryDisabled" className="form-check-label fs-8">Disabled</label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id="caseClosureDeliveryEnabled"
                                    name="caseClosureDeliveryCheck"
                                    value="Enabled"
                                    checked={caseClosureDeliveryCheck === "Enabled"}
                                    onChange={() => setCaseClosureDeliveryCheck("Enabled")}
                                  />
                                  <label htmlFor="caseClosureDeliveryEnabled" className="form-check-label fs-8">Enabled</label>
                                </div>
                              </div>
                            </Form.Group>
                          </div>
                        </div>

                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>



                  <Accordion defaultActiveKey="0" className="card card-flush accordionCard" id="section-mrs-integration-setting">
                    {/* MRS Integration Settings */}
                    <Accordion.Item eventKey="11">
                      <Accordion.Header>
                        <label className="required form-label fs-7">
                          MRS Integration Settings
                        </label>
                      </Accordion.Header>
                      <Accordion.Body className="bg-light">
                        <div className="container">
                          {/* Enable Bookmark Module Checkbox */}
                          <div className="form-group">
                            <label className="fs-8">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={enableBookmarkModule}
                                onChange={() =>
                                  setEnableBookmarkModule(!enableBookmarkModule)
                                }
                              />
                              Enable Bookmark Module
                            </label>
                          </div>

                          {/* Conditionally render the form fields if checkbox is checked */}
                          {enableBookmarkModule && (
                            <>
                              {/* SOURCE TAG input */}
                              <div className="row">
                                <div className="col-md-6 form-group">
                                  <label className="fs-8"><b>SOURCE TAG:</b></label>
                                  <input
                                    type="text"
                                    placeholder="Enter source tag"
                                    className="form-control fs-8 p-3"
                                    value={sourceTag}
                                    onChange={(e) => setSourceTag(e.target.value)}
                                  />
                                </div>

                                {/* BACKUP TAG input */}
                                <div className="col-md-6 form-group">
                                  <label className="fs-8"><b>BACKUP TAG:</b></label>
                                  <input
                                    type="text"
                                    placeholder="Enter backup tag"
                                    className="form-control fs-8 p-3"
                                    value={backupTag}
                                    onChange={(e) => setBackupTag(e.target.value)}
                                  />
                                </div>

                                {/* RESTRICTED TAG input */}
                                <div className="col-md-6 form-group">
                                  <label className="fs-8"><b>RESTRICTED TAG:</b></label>
                                  <input
                                    type="text"
                                    placeholder="Enter restricted tag"
                                    className="form-control fs-8 p-3"
                                    value={restrictedTag}
                                    onChange={(e) => setRestrictedTag(e.target.value)}
                                  />
                                </div>

                                {/* DESTINATION TAG input */}
                                <div className="col-md-6 form-group">
                                  <label className="fs-8"><b>DESTINATION TAG:</b></label>
                                  <input
                                    type="text"
                                    placeholder="Enter destination tag"
                                    className="form-control fs-8 p-3"
                                    value={destinationTag}
                                    onChange={(e) => setDestinationTag(e.target.value)}
                                  />
                                </div>
                              </div>
                              {/* <div className="container"> */}
                              {/* BATE TYPE select */}
                              <div className="row">
                                <div className="col-md-6 form-group">
                                  <label className="fs-8"><b>BATE TYPE:</b></label>
                                  <select
                                    value={bateType}
                                    onChange={(e) => setBateType(e.target.value)}
                                    className="p-3 fs-8"
                                  >
                                    <option value="NIT Bate">NIT Bate</option>
                                    <option value="Source Bate">Source Bate</option>
                                    {/* Add more options if needed */}
                                  </select>
                                </div>

                                {/* Conditionally render NIT BATE PREFIX input if 'NIT Bate' is selected */}
                                {bateType === "NIT Bate" && (
                                  <div className="col-md-6 form-group">
                                    <label className="fs-8"><b>NIT BATE PREFIX:</b></label>
                                    <input
                                      type="text"
                                      placeholder="Enter NIT Bate Prefix"
                                      className="form-control p-3 fs-8"
                                      value={nitBatePrefix}
                                      onChange={(e) => setNitBatePrefix(e.target.value)}
                                    />
                                  </div>
                                )}


                                {/* MATTER TYPE select */}
                                <div className="container">
                                  {/* MATTER TYPE select */}
                                  <div className="col-md-6 form-group">
                                    <label className="fs-8"><b>MATTER TYPE:</b></label>
                                    <select
                                      value={matterType}
                                      onChange={(e) => setMatterType(e.target.value)}
                                    >
                                      <option value="CAMG - Mirena">CAMG - Mirena</option>
                                      <option value="CAMG - Mirena">CAMG - Mirena</option>
                                      <option value="CAMG - Mirena">CAMG - Mirena</option>
                                      <option value="CAMG - Mirena">CAMG - Mirena</option>
                                      <option value="CAMG - Mirena">CAMG - Mirena</option>
                                      {/* Add more options as needed */}
                                    </select>
                                  </div>
                                </div> </div>
                              {/* MRS TYPE radio buttons */}
                              <div className="col-md-6 form-group">

                                <label className="mb-2 fw-bold fs-8">MRS TYPE:</label>
                                <div className="d-flex gap-3">
                                  <div className="form-check">
                                    <input
                                      type="radio"
                                      className="form-check-input"
                                      id="mrsLive"
                                      name="mrsType"
                                      value="MRS Live"
                                      checked={mrsType === "MRS Live"}
                                      onChange={(e) => setMrsType(e.target.value)}
                                    />
                                    <label className="fs-8" htmlFor="mrsLive">
                                      MRS Live
                                    </label>
                                  </div>

                                  <div className="form-check">
                                    <input
                                      type="radio"
                                      className="form-check-input"
                                      id="mrsLocal"
                                      name="mrsType"
                                      value="MRS Local"
                                      checked={mrsType === "MRS Local"}
                                      onChange={(e) => setMrsType(e.target.value)}
                                    />
                                    <label className="fs-8" htmlFor="mrsLocal">
                                      MRS Local
                                    </label>
                                  </div>
                                </div>
                              </div>
                              {/* </div> */}
                            </>
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>


                  <Accordion defaultActiveKey="0" className="card card-flush accordionCard" id="section-review-sheet-integration-setting">
                    {/* Review Sheet Integration Settings */}
                    <Accordion.Item eventKey="12">
                      <Accordion.Header>
                        <label className="required form-label fs-7">
                          Review Sheet Integration Settings
                        </label>
                      </Accordion.Header>
                      <Accordion.Body className="bg-light">
                        <div className="container">
                          {/* Enable Review Sheet Checkbox */}
                          <div className="form-group">
                            <label className="fs-8">
                              <input
                                className="form-check-input fs-8"
                                type="checkbox"
                                checked={enableReviewSheet}
                                onChange={() => setEnableReviewSheet(!enableReviewSheet)}
                              />
                              Enable Review Sheet?
                            </label>
                          </div>

                          {/* Conditionally render the Matter Type dropdown if checkbox is checked */}
                          {enableReviewSheet && (
                            <div
                              className="col-md-6 form-item form-item-labeled"
                              id="rs_matter_type-wrapper"
                            >
                              <label htmlFor="rs_matter_type" className="fs8"><b>Matter Type:</b> </label>
                              <select
                                name="rs_matter_type"
                                className="form-select fs-8 p-3"
                                id="rs_matter_type"
                                value={matterType2}
                                onChange={(e) => setMatterType2(e.target.value)}
                              >
                                <option value="">Choose</option>
                                <option value="1">Wnl - Nexium PPI</option>
                                <option value="2">Talc</option>
                                <option value="3">Hernia Mesh</option>
                                <option value="4">PPI Data Entry</option>
                                <option value="5">Hip Review</option>
                                <option value="6">Essure Data Entry</option>
                                <option value="7">IVC</option>
                                <option value="8">Benicar</option>
                                <option value="9">CAMG - Mirena</option>
                                <option value="10">TRT</option>
                                <option value="12">Essure Review</option>
                                <option value="14">AWKO Data Entry</option>
                                <option value="15">CAMR Hernia Mesh Data Entry</option>
                                <option value="16">MRR QC</option>
                                <option value="17">TVM Review</option>
                                <option value="18">Round Up Review</option>
                                <option value="19">Talcum Powder Review</option>
                                <option value="21">Taxotere Review</option>
                                <option value="22">3M Plug Review</option>
                                <option value="23">B&amp;B - PPI</option>
                                <option value="24">TDF Review sheet</option>
                                <option value="26">B&amp;A Hernia_CV</option>
                                <option value="28">B&amp;B TVM_Review</option>
                                <option value="30">Demo Tvm Test</option>
                                <option value="32">Zantac Review</option>
                                <option value="36">Pain Score Chart</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <Accordion defaultActiveKey="0" className="card card-flush accordionCard" id="section-pfs-integration-setting">
                    {/* PFS Integration Settings */}
                    <Accordion.Item eventKey="13">
                      <Accordion.Header>
                        <label className="required form-label fs-7">PFS Integration Settings</label>
                      </Accordion.Header>
                      <Accordion.Body className="bg-light">
                        <div className="container">
                          <div className="row g-3">
                            {/* Enable PFS Module Checkbox */}
                            <div className="col-md-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="enablePFSModule"
                                  checked={enablePFSModule}
                                  onChange={() => setEnablePFSModule(!enablePFSModule)}
                                />
                                <label className="form-check-label fs-8" htmlFor="enablePFSModule">
                                  Enable PFS Module
                                </label>
                              </div>
                            </div>

                            {/* Conditionally render PFS Module fields */}
                            {enablePFSModule && (
                              <div id="pfs_wrapper" className="col-12">
                                <div className="row g-3 pt-2">
                                  {/* PFS Matter Type Dropdown */}
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label htmlFor="pfs_matter_type" className="form-label fs-8">
                                        <b>PFS Matter Type:</b>
                                      </label>
                                      <select
                                        className="form-select fs-8 p-3"
                                        id="pfs_matter_type"
                                        value={pfsMatterType}
                                        onChange={(e) => setPfsMatterType(e.target.value)}
                                      >
                                        <option value="">Choose</option>
                                        <option value="1">Risperdal - SF</option>
                                        <option value="2">Invega</option>
                                        <option value="16">Fluoroquinolone</option>
                                        <option value="20">Risperdal-Invega</option>
                                        <option value="21">Xarelto</option>
                                        <option value="22">TVM</option>
                                        <option value="23">Ethicon</option>
                                        <option value="24">Bard</option>
                                        <option value="25">Boston</option>
                                        <option value="26">AMS</option>
                                        <option value="27">Januvia</option>
                                        <option value="29">Low-T</option>
                                        <option value="30">Zofran</option>
                                        <option value="32">Risperdal - LF</option>
                                        <option value="31">IVC Bard</option>
                                        <option value="34">Benicar</option>
                                        <option value="37">Talcum Powder</option>
                                        <option value="40">Taxotere</option>
                                        <option value="36">Bair Hugger</option>
                                        <option value="33">IVC Cook</option>
                                        <option value="44">Essure</option>
                                        <option value="43">IVC-Cordis</option>
                                        <option value="45">TVM-Ethicon</option>
                                        <option value="46">TVM-Bard</option>
                                        <option value="48">PPI-Nexium</option>
                                        <option value="47">Demand-Letter</option>
                                        <option value="49">Rebuttal</option>
                                        <option value="39">Hip-DePuy Pinnacle</option>
                                        <option value="50">Hernia</option>
                                        <option value="54">Motions</option>
                                        <option value="53">Bills of Particulars</option>
                                        <option value="51">Arbitration</option>
                                        <option value="52">Authorization</option>
                                        <option value="55">Summons</option>
                                        <option value="56">Lipitor</option>
                                        <option value="58">Intake form</option>
                                        <option value="59">Talc Intake form</option>
                                        <option value="60">Round Up Intake Form</option>
                                        <option value="61">Talc Lead Intake Form</option>
                                        <option value="62">Essure Intake Form</option>
                                        <option value="63">TDF Toxicity Intake Form</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Destination Tag Input */}
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label htmlFor="pfs_dest_tag" className="form-label fs-8">
                                        <b>Destination Tag:</b>
                                      </label>
                                      <input
                                        type="text"
                                        maxLength="128"
                                        className="form-control fs-8 p-3"
                                        id="pfs_dest_tag"
                                        value={pfsDestTag}
                                        onChange={(e) => setPfsDestTag(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>


                  </div>


                  <div className="form-group text-end">
                    <button onClick={handleSave} className="btn btn-sm btn-primary me-2">
                      <b>Submit</b>
                    </button>
                  </div>
                </Card>
              </div>
            </Col>


            <Col lg={3} md={4} className="sidebar">
              <ul className="nav flex-column sidebar-links pt-10">
                <li className="nav-item">
                  <a
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", titleRef)}
                    href="#section-title"
                  >
                    <i className="fas fa-heading me-2"></i>
                    Title
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-body"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", bodyRef)}
                  >
                    <i className="fas fa-info-circle me-2"></i>
                    Body
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-project-referral"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", projectreferralRef)}
                  >
                    <i className="fas fa-project-diagram me-2"></i>
                    Project Referral
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-define-billable-statement"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", billablestatementRef)}
                  >
                    <i className="fas fa-clock me-2"></i>
                    Define Billable Statement
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-estimate-unit"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", estimateunitRef)}
                  >
                    <i className="fas fa-cogs me-2"></i>
                    Estimate Unit
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-time-estimate-approval-setup"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", Time_Estimate_ApprovalsetupRef)}
                  >
                    <i className="fas fa-align-left me-2"></i>
                    Time Estimate Approval Setup
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-project-wise-invoice-configuration"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", Project_Wise_Invoice_Configuration)}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    Project Wise Invoice Configuration
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-mrr-setting"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", MRR_Setting)}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    MRR Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-e-signature-setting"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", ESignatureSetting)}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    E-Signature Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-case-setting"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", CaseSetting)}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    Case Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-comment-setting"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", CommentSetting)}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    Comment Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-checklist-setting"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", ChecklistSetting)}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    Checklist Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-project-setting"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", ProjectSetting)}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    Project Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-mrs-integration-setting"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", MRSIntegrationSetting)}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    MRS Integration Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-review-sheet-integration-setting"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", Review_Sheet_Integration_Settings)}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    Review Sheet Integration Setting
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#section-pfs-integration-setting"
                    className="nav-link d-flex align-items-center cursor-pointer"
                    onClick={() => handleSidebarClick("0", attachFilesRef)}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    PFS Integration Setting
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Card>
      </div>
      <Toaster />
    </>
  );
};








