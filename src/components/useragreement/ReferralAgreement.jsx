import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../../assets/css/aggrement.css";
import sailesh from "../../assets/Images/sailesh_sign.png";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

export const ReferralAgreement = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setCurrentDate(formattedDate);
  }, []);

  // full name
  const user_details = JSON.parse(sessionStorage.getItem("user_details")) || {};

  console.log(user_details);
  const UserName = user_details.fullname || "Default Name";
  const JobTitle = user_details.job_title || "Default Job Title";
  const CompanyName = user_details.organization_firm || "Default Company";
  const Email = user_details.email_address || "Default Email";
  const Address =
    `${user_details.address_line1}, ${user_details.city}, ${user_details.state}, ${user_details.country}, ${user_details.postal_code}` ||
    "Default Address";
  const Country = user_details.country || "Default Country";

  const [nameSignature, setNameSignature] = useState("");
  const [uploadedFile, setUploadedFile] = useState();
  const sigCanvas = useRef(null);

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setNameSignature(newName);
    updateCanvasWithName(newName);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPG and PNG are allowed.");
        e.target.value = "";
        setUploadedFile(null);
        return;
      }
      setUploadedFile(file);
      toast.success("File uploaded successfully!");
    }
  };

  const updateCanvasWithName = (name) => {
    if (sigCanvas.current) {
      clearSignature();
      const ctx = sigCanvas.current.getCanvas().getContext("2d");
      ctx.font = "24px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(name, 10, 40);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form...");
    // Check if there's any valid input
    const isFileUploaded = uploadedFile && uploadedFile.name;
    const hasNameSignature = nameSignature.trim().length > 0;
    const hasCanvasSignature =
      sigCanvas.current && !sigCanvas.current.isEmpty();

    if (!hasNameSignature && !isFileUploaded && !hasCanvasSignature) {
      toast.error(
        "Oops! Please add a name, upload a signature, or draw your signature."
      );
      return;
    }
    console.log("Submitting form...111");
    const formData = new FormData();

    // Append base64_signature only if there's a name or drawn signature
    if (hasNameSignature || hasCanvasSignature) {
      // Ensure the canvas reflects the typed name as the signature
      if (hasNameSignature && sigCanvas.current) {
        const ctx = sigCanvas.current.getCanvas().getContext("2d");
        ctx.clearRect(
          0,
          0,
          sigCanvas.current.getCanvas().width,
          sigCanvas.current.getCanvas().height
        ); // Clear existing content
        ctx.font = "24px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(nameSignature.trim(), 10, 40);
      }

      // Append the canvas signature
      const signatureData = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      formData.append("base64_signature", signatureData);
    }

    // Append the uploaded file if it exists
    if (isFileUploaded) {
      formData.append("uploaded_file", uploadedFile);
    }
    console.log("Submitting form...222");
    // console.log("FormData:", formData);

    const token = sessionStorage.getItem("token");
    fetch(`${API_URL}/user/accept-referral-agreement`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Referral agreement accepted successfully!");
        setTimeout(() => navigate("/"), 500);
      })
      .catch((error) => {
        if (error.message === "Unexpected end of input") {
          console.error("No JSON to parse, likely an empty response", error);
        } else {
          console.error("Error:", error);
        }
        toast.error("Failed to accept referral agreement");
      });
      console.log("Submitting form...333");
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
  };
  console.log("Submitting form...444");
  return (
    <div className=" container-fluid height">
      <div className="row">
        <div className="aggrement scroll-container">
          <div className="m-3  ">
            <div className="agreement-container">
              <Toaster />
              <div
                className="border-1 d-flex justify-content-center align-items-center py-3"
                style={{
                  background: "#0098ca",
                  borderRadius: "10px 10px 0 0",
                  color: "white",
                }}
              >
                <h5 className="mb-0 fw-bold" style={{ color: "#fff" }}>
                  Client's Referral Agreement
                </h5>
              </div>

              <div className="agreement-body scrollable-container">
                <section className="agreement-section">
                  <p
                    style={{
                      textAlign: "center",
                    }}
                  >
                    This AGREEMENT is made on, {currentDate}, (“Effective
                    Date”).
                  </p>
                  <p
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <b> BY AND BETWEEN</b>
                  </p>
                  NEURAL IT LLC, a New York corporation having registered office
                  located at 100 Duffy Avenue, Suite 510, Hicksville, NY 11801,
                  United States, (hereinafter referred to as “COMPANY” , which
                  expression shall, unless repugnant to the context thereof,
                  mean and include its successors and permitted assigns), of the
                  one part
                  <p
                    style={{
                      textAlign: "justify",
                      lineHeight: 2,
                      fontSize: "10pt",
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    <b>AND</b>
                  </p>
                  <p
                    style={{
                      textAlign: "justify",
                      lineHeight: 2,
                      fontSize: "10pt",
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    {CompanyName}, having its mailing address at {Address},{" "}
                    {Country}, (hereinafter referred to as “CLIENT”). <br />
                    WHEREAS, the COMPANY is engaged inter alia in the business
                    of Medical-Legal, LPO, BPO, Voice & IT outsourcing services.{" "}
                    <br />
                    WHEREAS, {CompanyName}, is a reputed law firm in the{" "}
                    {Country} that focuses on {currentDate}.
                  </p>
                  <p
                    style={{
                      textAlign: "justify",
                      lineHeight: 2,
                      fontSize: "10pt",
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    NOW, THEREFORE, in consideration of the foregoing and other
                    good and valuable consideration, and intending to be legally
                    bound, the parties hereto agree as follows:
                  </p>
                  <p
                    style={{
                      textAlign: "justify",
                      lineHeight: 2,
                      fontSize: "10pt",
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    NOW THE PARTIES HEREBY AGREE AS FOLLOWS:
                  </p>
                  <div>
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>1. Agreement and its Termination</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      This Agreement shall commence on the date specified
                      hereinabove and shall continue until such time it is
                      terminated by either Party in accordance with this
                      Agreement. Either party may terminate the Agreement at any
                      time and for any reason on thirty (30) days advance
                      written notice.
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>2. Responsibilities</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      2.1. CLIENT will identify possible Potential referrals for
                      COMPANY and introduce these Potential referrals to
                      COMPANY, with the purpose of turning these referrals into
                      potential Customer.
                    </p>
                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      2.2. COMPANY will have responsibility for drafting and
                      submitting proposal to new referrals, signing the service
                      agreements; setting up and delivering the Services. All
                      service agreements will be signed exclusively and directly
                      between COMPANY and the new/Potential referrals.
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      2.3. COMPANY will be responsible for the actual delivery
                      and management of its services to its Potentialreferrals
                      and CLIENT has no responsibility or liability related to
                      the actual delivery of COMPANY’s services.
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      2.4. For the duration of this Agreement, CLIENT will not
                      enter into a similar sales agreement with any
                      organization, which by the nature of its business would be
                      in competition with COMPANY.
                    </p>
                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      2.5. In referring Potential referrals to COMPANY, the
                      CLIENT agrees that it shall:
                      <ol
                        type="a"
                        style={{
                          textAlign: "justify",
                          lineHeight: 2,
                        }}
                      >
                        <li>
                          Not distribute any documents other than those provided
                          by COMPANY or alter any document provided by COMPANY,
                          other than as expressly authorized by COMPANY in
                          writing.
                        </li>
                        <li>
                          Not use any name or logo of COMPANY or of any related
                          body corporate other than as expressly authorized by
                          COMPANY in writing.
                        </li>
                        <li>
                          Not have any discussions with, or reveal any
                          information to, any media or advertising
                          representatives in relation to the Services unless
                          COMPANY provides its express written consent to such
                          discussions or disclosure.
                        </li>
                        <li>
                          Not accept, or hold himself out as authorized to
                          receive or accept, any funds to be placed under the
                          Services provided by COMPANY.
                        </li>
                        <li>
                          Not make any representations, statements, or
                          warranties, including without limitation in relation
                          to the experience or expertise of COMPANY or any of
                          the Services provided by COMPANY, except as set out in
                          the information/documents received by the CLIENT
                          pursuant to this Agreement for Potential referrals to
                          COMPANY or as authorized by COMPANY in writing.
                        </li>
                        <li>
                          The COMPANY shall not be under any obligations to
                          provide services to the Potential referrals unless a
                          formal agreement is entered between Potential
                          referrals and COMPANY. COMPANY will have the sole
                          discretion to enter into or not enter into an
                          agreement with Potential referrals.
                        </li>
                        <li>
                          CLIENT agrees that it will not act in a manner which
                          would, in the opinion of a reasonable person, damage
                          the good name and reputation of COMPANY or bodies
                          corporate affiliated with COMPANY or result in adverse
                          or negative publicity for COMPANY or its Group in
                          general.
                        </li>
                        <li>
                          Not make any statements, decisions, or take any action
                          on behalf of COMPANY that falls outside the scope of
                          referring new business to COMPANY.
                        </li>
                        <li>
                          Not to make decisions or communicate definitively to
                          Potential referrals on pricing, terms of Services, or
                          Service delivery without seeking confirmation and/or
                          approval from COMPANY first.
                        </li>
                        <li>
                          Not to present himself as a director, shareholder, or
                          employee of COMPANY.
                        </li>
                      </ol>
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>3. Revenue Sharing and Payment</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      3.1. In return for referring Potential referralsto
                      COMPANY, and COMPANY accepting the same as qualified
                      referral, COMPANY will pay CLIENT a Monthly Revenue Share.
                    </p>
                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      3.2. COMPANY will pay CLIENT a Monthly Revenue Share of
                      10% of the cumulative Service Fees for each month based on
                      the actual number of revenue generated from the
                      Potentialreferrals referred by CLIENT.
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      3.3. COMPANY will pay CLIENT Monthly Revenue Share within
                      15 days after receiving payment from the Potential
                      referrals referred by CLIENT.
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      3.4. In case Potential referrals raises a billing dispute
                      or any other event transpires that impacts the revenue
                      received for any given billing month, then the CLIENT’s
                      Monthly Revenue Share for the next payment round will be
                      used to adjust for the change in revenue.
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      3.5. COMPANY will pay CLIENT the Monthly Revenue Share for
                      a period of 24 consecutive billing months, per referral.
                      After this period no further Monthly Share will be paid.
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      3.6. COMPANY will only pay CLIENT based on actual revenue
                      received against an invoice. No monthly Revenue Share or
                      other payments to CLIENT will be due in case Referred
                      Client terminates its engagement with COMPANY prior to the
                      completion of 24 monthly billing cycles.
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      3.7. A payment of referral fee shall be made by the
                      COMPANY as per the discretion of CLIENT, by depositing an
                      amount in US Dollars,either:
                      <ol
                        type="i"
                        style={{
                          textAlign: "justify",
                          lineHeight: 2,
                          paddingLeft: "40px",
                          counterReset: "list-counter",
                        }}
                      >
                        <li>
                          To the CLIENT’s entrust account held with the COMPANY;
                          Or
                        </li>
                        <li>Directly to CLIENT.</li>
                      </ol>
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>4. Non-Solicitation</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      CLIENT covenants and agrees that during the term of
                      business with COMPANY and for twelve (12) months after the
                      termination thereof, regardless of the reason for the
                      termination,CLIENT will not directly and indirectly
                      solicit business from, or attempt to sell, license or
                      provide the same or similar product or services as are now
                      provided toany customer or client of COMPANY, nor shall
                      use COMPANY’s existing client’s demographic and
                      confidential information to solicit and provide quotes
                      and/or transfer business to any competing entity. Further,
                      CLIENT will not, directly or indirectly, on own behalf or
                      on behalf of or in conjunction with any person or legal
                      entity, recruit, solicit, or induce, or attempt to
                      recruit, solicit, or induce, any present or past employee
                      of the “COMPANY”.
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>5. Privacy and Confidentiality</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      All information, materials and technology provided by one
                      Party to the other Party under this Agreement, are
                      strictly confidential to the disclosing Party and is to be
                      treated as “Confidential Information” by the receiving
                      Party. Confidential Information may not be disclosed in
                      whole or in part to any third party except as explicitly
                      authorized hereunder. COMPANY and CLIENT shall be
                      permitted to disclose such Information to their
                      accountants, legal, financial and marketing
                      representatives, and employees as necessary for the
                      performance of their respective duties, and for no other
                      purpose. The receiving Party agrees and undertakes to
                      treat the Confidential Information as confidential in the
                      above-described manner and as required by law or any
                      government regulatory authority, during the Agreement
                      period and thereafter for next 3 years.
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>6. Indemnification</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 10.3pt",
                      }}
                    >
                      <ol
                        type="a"
                        style={{
                          textAlign: "justify",
                          lineHeight: 2,
                        }}
                      >
                        <li>
                          Notwithstanding anything contained in this Clause 5;
                          CLIENT further understands and agrees that any/all
                          Potential referrals madeand newLegal referrals
                          introduced by the CLIENTshall be deemed to have been
                          made in its professional role, position or
                          organization that CLIENT may be a part of. COMPANY
                          excludes all liability arising from any referrals made
                          or purported to have been made by the CLIENT in its
                          professional capacity. The CLIENT explicitly affirms
                          and agrees to indemnify COMPANY for any/all actions,
                          suits, claims, proceedings, judgments, demands and all
                          losses, damages, liabilities, penalties, costs and
                          expenses arising thereto by its Potential referralsor
                          any third party as a result of any/all acts by CLIENT
                          as contemplated in this Clause 5; Both Parties
                          aggregate liability for whether in tort, contract or
                          otherwise, shall not exceed the actual amount of total
                          Referral Fees paid or payable to the CLIENT under this
                          Agreement.
                        </li>
                        <li>
                          CLIENT hereby indemnifies and shall always keep
                          indemnified COMPANY against all costs, actions,
                          claims, losses, damages, suits, prosecutions,
                          including all consequential loss and legal fees which
                          COMPANY may suffer/ incur on account of failure or
                          default on part of the CLIENT to comply in whole or
                          any part of any of the terms and conditions of this
                          Agreement, or on account of any omission on part of
                          the CLIENT to obtain the necessary authorization and
                          permits under the terms of this Agreement, or any
                          other Agreement.
                        </li>
                        <li>
                          CLIENT agrees that they shall co-operate and help
                          COMPANY in redressing grievances of Potential
                          referralsintroduced by them.
                        </li>
                      </ol>
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>7. Governing Law and Venue</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      All claims and disputes arising under or relating to this
                      Agreement are to be settled by binding arbitration in the
                      state of New York or another location mutually agreeable
                      to the parties. The arbitration shall be conducted on a
                      confidential basis pursuant to the Commercial Arbitration
                      Rules of the American Arbitration Association. Any such
                      arbitration shall be conducted by an arbitrator having a
                      law degree and prior experience as an arbitrator and shall
                      include a written record of the arbitration hearing.
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                     style={{
                      textAlign: "justify",
                      textIndent: "-14.2pt",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      <strong>8. Notices</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      Any notice and other communication given or required to be
                      given under this Agreement shall be in writing and shall
                      be sent by recognized courier or by facsimile, provided
                      that where such notice is sent by facsimile, a
                      confirmation copy shall be sent by pre-paid post or by
                      recognized courier within five days of the transmission by
                      facsimile, only at the following address of the receiving
                      Party, or at such other address as may be notified by the
                      receiving Party to the other in writing, provided such
                      change of address has been notified at least ten days
                      prior to the date on which such notice has been given
                      under the terms of this Agreement.
                    </p>

                    <p>
                      <table
                        style={{
                          marginLeft: "23.6pt",
                          borderCollapse: "collapse",
                          width: "95%",
                          height: "195px",
                        }}
                      >
                        <tbody>
                          <tr style={{ height: "19.95pt" }}>
                            <td
                              style={{
                                width: "208.05pt",
                                border: "1px solid black",
                                borderTop: "0.5px solid black",
                                padding: "5.4pt",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  marginBottom: 0,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "10pt",
                                    fontFamily: "Open Sans, sans-serif",
                                  }}
                                >
                                  NEURAL IT LLC.
                                </span>
                              </p>
                            </td>
                            <td
                              style={{
                                width: "213.75pt",
                                border: "1px solid black",
                                padding: "5.4pt",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  marginBottom: 0,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "10pt",
                                    fontFamily: "Open Sans, sans-serif",
                                  }}
                                >
                                  {CompanyName}
                                </span>
                              </p>
                            </td>
                          </tr>

                          <tr style={{ height: "110.3pt" }}>
                            <td
                              style={{
                                width: "208.05pt",
                                borderLeft: "1px solid black",
                                borderBottom: "1px solid black",
                                padding: "5.4pt",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  margin: "0 0 8.1pt",
                                }}
                              >
                                Sailesh Paul Peringatt,
                              </p>
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  margin: "0 0 8.8pt",
                                }}
                              >
                                President,
                              </p>
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  margin: "0 0 8.8pt",
                                }}
                              >
                                100 Duffy Avenue, Suite 510,
                              </p>
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  margin: "0 0 8.8pt",
                                }}
                              >
                                Hicksville, NY 11801,
                              </p>
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  margin: "0 0 8.8pt",
                                }}
                              >
                                United States.
                              </p>
                            </td>

                            <td
                              style={{
                                width: "208.05pt",
                                border: "1px solid black",
                                padding: "5.4pt",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  margin: "0 0 8.1pt",
                                }}
                              >
                                {UserName},
                              </p>
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  margin: "0 0 8.8pt",
                                }}
                              >
                                {JobTitle},
                              </p>
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  margin: "0 0 8.8pt",
                                }}
                              >
                                Email: {Email},
                              </p>
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  margin: "0 0 8.8pt",
                                }}
                              >
                                {Address},
                              </p>
                              <p
                                style={{
                                  textAlign: "justify",
                                  lineHeight: "25px",
                                  margin: "0 0 8.8pt",
                                }}
                              >
                                {Country}.
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </p>
                  </div>
        
                  <div>
                    <p
                     style={{
                      textAlign: "justify",
                      textIndent: "-14.2pt",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      <strong>9. Amendment</strong>
                    </p>
                    <p
                     style={{
                      textAlign: "justify",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      No modifications or amendments of this Agreement and no
                      waiver of any of the terms or conditions hereof, shall be
                      valid or binding unless made in writing and duly executed
                      by both Parties.
                    </p>
                  </div>
                <br />
                  <div>
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>10. Waiver</strong>
                    </p>
                    <p
                     style={{
                      textAlign: "justify",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      No provision of this Agreement shall be deemed to be
                      waived except by express written consent executed by the
                      Party, which is claimed to have waived the relevant
                      provision.
                    </p>
                  </div>
                 <br />
                  <div>
                    <p
                     style={{
                      textAlign: "justify",
                      textIndent: "-14.2pt",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      <strong>11. Consent</strong>
                    </p>
                    <p
                     style={{
                      textAlign: "justify",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      Neither Party shall issue any press release, promotional
                      material or other public announcement related to this
                      Agreement & services, written or oral; without the prior
                      written consent of the other party, which consent may not
                      be unreasonably withheld, conditioned, or delayed. <br />
                      CLIENT reserves the right to instruct the SERVICE PROVIDER
                      to delete specific data in compliance with applicable
                      regulations or contractual obligations
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                     style={{
                      textAlign: "justify",
                      textIndent: "-14.2pt",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      <strong>12. Severability</strong>
                    </p>
                    <p
                     style={{
                      textAlign: "justify",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      It is intended that each section of this Agreement shall
                      be viewed as separate and divisible and in the event that
                      any section shall be held to be invalid or unenforceable,
                      the remaining sections shall continue to be in full force
                      and effect.{" "}
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                     style={{
                      textAlign: "justify",
                      textIndent: "-14.2pt",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      <strong>13. Assignable</strong>
                    </p>
                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      If any obligation of CLIENT under this Agreement is
                      assigned, delegated or otherwise transferred, whether by
                      agreement, operation of law or otherwise, this Agreement
                      shall bind CLIENT and its permitted successors and
                      assigns.{" "}
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                     style={{
                      textAlign: "justify",
                      textIndent: "-14.2pt",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      <strong>14. Force Majeure</strong>
                    </p>
                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      SERVICE PROVIDERwill not be responsible for any failure to
                      fulfill its obligations hereunder due to causes beyond its
                      reasonable control, including without limitation acts or
                      omissions of government or military authority, acts of
                      God, shortages of material, transportation delays, fires,
                      floods, labor disturbances, riots or wars or plague,
                      epidemic, pandemic, outbreaks of infectious disease or any
                      other public health crisis, including quarantine or other
                      employee restrictions. It is however understood that data
                      storage and back-up shall be done in such a way as to
                      ensure no event at a single location could cause the loss
                      of data.
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>15. Binding Effect</strong>
                    </p>
                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      The Parties intend that the provisions of this Agreement
                      shall be binding on them to the extent and in the manner
                      stated herein. In the event CLIENT sells, assigns or in
                      any manner transfers to any person the whole or any part
                      of its undertaking, CLIENT shall require and ensure that
                      such purchaser, assignee or transferee, as the case may
                      be, shall be bound by the provisions of this Agreement.{" "}
                    </p>
                  </div>
                  <br />
                  <div>
                    <p
                     style={{
                      textAlign: "justify",
                      textIndent: "-14.2pt",
                      lineHeight: 2,
                      margin: "0in 0in .0001pt 21.3pt",
                    }}
                    >
                      <strong>16. Relationship between Parties</strong>
                    </p>
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        textAlign: "justify",
                        marginLeft: "2rem",
                      }}
                    >
                      No provision of this Agreement shall be deemed to
                      constitute a partnership between the Parties and neither
                      Party shall have any right or authority to bind the other,
                      as the other’s agent or representative, and neither Party
                      shall be deemed to be the agent of the other in any way.
                    </p>
                  </div>
                  <br />
                  <div>
                    <p style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}>
                      <strong>25. Clause headings & Third Party Rights</strong>
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        marginLeft: "2rem",
                        textAlign: "justify",
                      }}
                    >
                      The section and clause headings contained in this
                      Agreement are for the convenience of the Parties and shall
                      not affect the meaning or interpretation of this
                      Agreement. This Agreement is not intended and shall not be
                      construed to confer on any person other than the Parties
                      hereto, any rights and/or remedies herein.
                    </p>
                  </div>
                  <br />
                  <div>
                    <p style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}>
                      <strong>26. Entire Agreement</strong>
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        marginLeft: "2rem",
                        textAlign: "justify",
                      }}
                    >
                      This Agreement and the Schedules annexed constitute the
                      entire Agreement of the parties and supersedes all prior
                      communications, understandings, and Agreements relating to
                      the subject matter hereof, whether oral or written.
                    </p>

                    <p
                      style={{
                        fontSize: "14px",
                        marginTop: "20px",
                        marginLeft: "2rem",
                        textAlign: "justify",
                      }}
                    >
                      IN WITNESS, WHEREOF THE PARTIES HERETO HAVE EXECUTED THESE
                      PRESENTS THE DAY AND YEAR FIRST INDICATED ABOVE
                    </p>

                    <p
                      style={{
                        fontSize: "14px",
                        marginTop: "10px",
                        marginLeft: "2rem",
                        textAlign: "justify",
                      }}
                    >
                      I the undersigned, do hereby acknowledge that I have read
                      and understood the terms and conditions of the Service
                      Level Agreement and I am authorized to enter into such
                      contracts on behalf of my Firm.
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "20px",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "20px",
                        backgroundColor: "transparent",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <img
                        src={sailesh}
                        alt="Sailesh Paul Peringatt Signature"
                        width={150}
                        height={50}
                        style={{ marginBottom: "15px" }}
                      />
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          margin: "0",
                          textDecoration: "underline",
                        }}
                      >
                        Sailesh Paul Peringatt
                      </p>
                      <p style={{ fontSize: "12px", margin: "5px 0" }}>
                        (President)
                      </p>
                      <p style={{ fontSize: "12px", margin: "5px 0" }}>
                        NEURAL IT LLC.
                      </p>
                    </div>

                    <div
                      style={{
                        flex: 1,
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "20px",
                        backgroundColor: "transparent",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div
                        style={{
                          width: "150px",
                          height: "50px",
                          border: "1px solid #ccc",
                          margin: "0 auto 15px",
                          backgroundColor: "#f9f9f9",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "4px",
                        }}
                      >
                        <span style={{ fontSize: "12px", color: "#888" }}>
                          [Your Signature]
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          margin: "0",
                          textDecoration: "underline",
                        }}
                      >
                        {UserName || "Default Name"}
                      </p>
                      <p style={{ fontSize: "12px", margin: "5px 0" }}>
                        {JobTitle || "Default Job Title"}
                      </p>
                      <p style={{ fontSize: "12px", margin: "5px 0" }}>
                        {CompanyName || "Default Company"}
                      </p>
                    </div>
                  </div>

     <section>
                  <h2
                    style={{
                      color: "#0098ca",
                      padding: "0 0 2rem 0",
                      textAlign: "center",
                      marginTop:"2rem"
                    }}
                  >
                    Signature Panel
                  </h2>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="col-5"></div>
                      <div className="signature-draw">
                        <h5
                          style={{ color: "#0098ca", padding: "0 0 0.5rem 0" }}
                        >
                          DRAW SIGNATURE:
                        </h5>
                        <SignatureCanvas
                          ref={sigCanvas}
                          penColor="#151d67"
                          canvasProps={{
                            className: "sigCanvas",
                            style: {
                              border: "1px solid #ddd",
                              backgroundColor: "white",
                            },
                          }}
                        />
                        <button
                          onClick={clearSignature}
                          style={{
                            marginTop: "10px",
                            padding: "0.5rem 1.5rem",
                            backgroundColor: "#f44336",
                            color: "#fff",
                            border: "none",
                            borderRadius: "15px",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          Clear Signature
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="signature-upload">
                        <h5
                          style={{ color: "#0098ca", padding: "0 0 0.5rem 0" }}
                        >
                          Upload Signature:
                        </h5>
                        <input
                          type="file"
                          accept=".jpg,.png"
                          onChange={handleFileChange}
                        />
                        <p>Upload a file, allowed file types: jpg,png</p>
                      </div>

                      <h5 style={{ color: "#0098ca", padding: "0 0 0.5rem 0" }}>
                        Add Name Signature:
                      </h5>
                      <input
                        type="text"
                        placeholder="Enter name for signature"
                        value={nameSignature}
                        onChange={handleNameChange}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="custom-button"
                      style={{
                        padding: "0.7rem 2rem",
                        backgroundColor: "#0098ca",
                        color: "white",
                        fontSize: "1.1rem",
                        border: "none",
                        borderRadius: "15px",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      I Agree
                    </button>
                  </div>
                </section>

                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};