import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../../assets/css/aggrement.css";
import sailesh from "../../assets/Images/sailesh_sign.png";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

export const UserAgreement = () => {
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

    // console.log("FormData:", formData);

    const token = sessionStorage.getItem("token");
    fetch(`${API_URL}/user/accept-agreement`, {
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
        toast.success("Agreement accepted successfully!");
        setTimeout(() => navigate("/"), 500);
      })
      .catch((error) => {
        if (error.message === "Unexpected end of input") {
          console.error("No JSON to parse, likely an empty response", error);
        } else {
          console.error("Error:", error);
        }
        toast.error("Failed to accept agreement");
      });
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

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
                  Service Agreement
                </h5>
              </div>

              <div className="agreement-body scrollable-container">
                <section className="agreement-section">
                  <p
                    style={{
                      textAlign: "center",
                    }}
                  >
                    This AGREEMENT FOR SERVICE made on, {currentDate},
                    (“Effective Date”).
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
                  United States. (hereinafter referred to as “SERVICE PROVIDER",
                  which expression shall, unless repugnant to the context
                  thereof, mean and include its successors and permitted
                  assigns), of the one part;
                  {/* </p> */}
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
                    {CompanyName}, having its registered office at {Address},{" "}
                    {Country}, (hereinafter referred to as “CLIENT”, which
                    expression shall, unless repugnant to the context thereof,
                    mean and include its successors and permitted assigns, of
                    the other part. WHEREAS, SERVICE PROVIDER is engaged inter
                    alia in the business of Medical-Legal, LPO, BPO, Voice, and
                    IT outsourcing ).
                  </p>
                  <p
                    style={{
                      textAlign: "justify",
                      lineHeight: 2,
                      fontSize: "10pt",
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    WHEREAS, SERVICE PROVIDER is engaged in the business of
                    Medical-Legal, LPO, BPO, Voice, and IT outsourcing.
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
                  <ol
                    style={{
                      lineHeight: 2,
                      fontSize: "10pt",
                      fontFamily: "Open Sans, sans-serif",
                    }}
                  >
                    <li>
                      <strong>Definitions</strong>
                    </li>
                    <p
                      className="MsoBodyText"
                      style={{
                        margin: "0in 0in .0001pt 21.3pt",
                        textAlign: "justify",
                        lineHeight: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10.0pt",
                        }}
                      >
                        As used throughout the body of this Agreement, when
                        capitalized, the following terms shall have the meanings
                        assigned to them below. When not capitalized, such words
                        shall be attributed their ordinary meaning. References
                        to the singular shall include references to the plural
                        and vice versa, and the following terms shall include
                        all grammatical variations thereof:
                      </span>
                    </p>
                    <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
                      <li>
                        1.1. “Agreement”: This Agreement and any amendments to
                        this Agreement executed by the Parties in writing
                      </li>
                      <li>
                        1.2. “Governmental Action”: An event brought about by
                        law, or order of a court of competent judicial or
                        quasi-judicial authority, or other governmental action.
                      </li>
                      <li>
                        1.3. “Party”: Either of the Authorized signatories to
                        act or plead or take decisions on behalf of the Parties
                        to this Agreement.
                      </li>
                      <li>
                        1.4. “Authorized user”: CLIENT's employees,
                        representatives, consultants, contractors, or agents who
                        are authorized to use the Service and have been supplied
                        user identifications and passwords by CLIENT.
                      </li>
                      <li>
                        1.5. “Business Day”: Any day from 9:30 a.m. to 5:30 p.m.
                        (Eastern Time)Monday through Friday, with the exception
                        of Federal holidays.
                      </li>
                      <li>
                        1.6. “Change of Control”: The direct or indirect
                        acquisition of either the majority of the voting stock,
                        or of all, or substantially all, of the assets, of a
                        party by another entity in a single transaction or a
                        series of transactions.
                      </li>
                      <li>
                        1.7. “Confidential Information”: Information that is
                        proprietary or confidential and is either clearly
                        labeled as such or identified as Confidential
                        Information.
                      </li>
                      <li>
                        1.8. “Customer Data”: The data inputted by the Customer,
                        Authorized Users, or the CLIENT on the CLIENT’s behalf
                        for the purpose of using the Services or facilitating
                        the CLIENT’s use of the Services.
                      </li>
                      <li>
                        1.9. “Documentation”: The document made available to the
                        CLIENT by the SERVICE PROVIDER online or such other web
                        address notified by the SERVICE PROVIDER to the CLIENT
                        from time to time, which sets out a description of the
                        Services and the user instructions for the Services.
                      </li>
                      <li>
                        1.10. “Effective Date”: Means-the date this agreement
                        went into effect.
                      </li>
                      <li>
                        1.11. “Services”: The services provided by the SERVICE
                        PROVIDER to the CLIENT under this agreement or any other
                        website notified to the CLIENT by the SERVICE PROVIDER
                        from time to time, as more particularly described in
                        Schedule “A”.
                      </li>
                      <li>
                        1.12. “Software”: The online software applications
                        provided by the SERVICE PROVIDER as part of the
                        Services.
                      </li>

                      <li>
                        1.13. “Data”: Any information provided by the CLIENT to
                        the SERVICE PROVIDER for processing, storage, or
                        delivery of services under this Agreement.
                      </li>

                      <li>
                        1.14. “Data Inactivity”: A period during which no
                        processing, access, or modification of CLIENT-provided
                        data occurs.
                      </li>
                    </ul>
                  </ol>
                  <div>
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>
                        <span
                          style={{
                            fontSize: "10pt",
                            fontFamily: "Open Sans, sans-serif",
                          }}
                        >
                          2. Term and Termination
                        </span>
                      </strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-21.25pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 42.55pt",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10pt",
                          fontFamily: "Open Sans, sans-serif",
                        }}
                      >
                        2.1. Term: This Agreement will commence on the Effective
                        Date and Continue till such period until terminated by
                        either party.
                      </span>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-21.25pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 42.55pt",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10pt",
                          fontFamily: "Open Sans, sans-serif",
                        }}
                      >
                        2.2. Termination on Notice: Either party may terminate
                        this Agreement without cause upon providing the other
                        party with thirty(30) days advance written notice.
                      </span>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-21.25pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 42.55pt",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10pt",
                          fontFamily: "Open Sans, sans-serif",
                        }}
                      >
                        2.3. Effect of Termination:
                        <br />
                        (a) Upon termination of this Agreement, SERVICE PROVIDER
                        is obligated to complete assigned projects as of the
                        date it receives termination notice.
                        <br />
                        (b) The CLIENT’s liability to SERVICE PROVIDER shall
                        continue upon the termination of the agreement for
                        unpaid service fees.
                        <br />
                        (c) In default of payment, late fee shall be charged not
                        more than 1.5% interest compounded monthly from the date
                        of invoice.
                      </span>
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
                      <strong>3. Specification of Work</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      SERVICE PROVIDER shall provide IT Services, Legal Support
                      Services, Medical-legal Services, and Paralegal Services
                      to CLIENT as specified in <strong>Schedule “A”.</strong>
                    </p>

                    <br />

                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>4. Remuneration</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      CLIENT shall pay fees to the SERVICE PROVIDER as specified
                      in Schedule “A”.
                    </p>

                    <br />

                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>5. Warranties and Representations</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      Each Party generally warrants and represents to the other
                      as follows:
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      5.1. Corporate power
                      <br />
                      Such Party is an
                      LLC/company/firm/partnership/proprietorship/professional
                      corporation, duly organized and validly existing under the
                      Territorial Law with full corporate power, authority, and
                      capability to do all acts contemplated herein and in the
                      manner and on the terms and conditions stated, and such
                      Party has obtained all necessary consents and approvals
                      therefore.
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      5.2. No conflict
                      <br />
                      The execution, delivery, and performance of this Agreement
                      and all acts necessary or incidental thereto, and the
                      consummation of this Agreement does not and shall not
                      constitute any of the following:
                      <br />
                      a. Contravention of any provisions of any document
                      relating to the incorporation or constitution of such
                      Party;
                      <br />
                      b. Breach of or default under (or an event which with
                      notice and/or lapse of time would constitute a breach of
                      or default under), any contract or law applicable to such
                      Party; and
                      <br />
                      c. Violation of any law, rule, or regulation applicable to
                      such Party, or any order, decree or direction of any
                      court, arbitral tribunal, or competent judicial authority
                      by which such Party may be bound.
                      <br />
                      5.3. Non-Solicitation of Employees <br />
                      “CLIENT” also covenants and agrees that during the term of
                      business with " SERVICE PROVIDER " and for twelve (12)
                      months after the termination thereof regardless of the
                      reason for the termination, “CLIENT” will not, directly or
                      indirectly, on own behalf or on behalf of or in
                      conjunction with any person or legal entity, recruit,
                      solicit, or induce, or attempt to recruit, solicit, or
                      induce, any present or past employee of the " SERVICE
                      PROVIDER".
                    </p>

                    <br />

                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>6. Confidentiality</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      As used in this agreement, the term “Confidential
                      Information” refers to; (i) the terms and conditions of
                      this Agreement; (ii) the Services and each component
                      thereof; (iii) each party’s trade secrets, business plans,
                      strategies, methods and/or practices; and (iv) other
                      information relating to either party that is not generally
                      known to the public, including information about either
                      party’s personnel, products, customers, marketing
                      strategies, services or future business plans. (v) SERVICE
                      PROVIDER will comply with Section II.B of the April 27,
                      2009 HHS guidance (74 Fed. Reg. 19006 at 19009-19010)
                      setting forth the technologies and methodologies for
                      rendering Protected Health Information unusable,
                      unreadable, or indecipherable to unauthorized individuals
                      such that breach notification is not required.
                      Notwithstanding the foregoing, the term “Confidential
                      Information” shall not include any information which is
                      (i) otherwise publicly available, (ii) in the receiving
                      party’s possession prior to disclosure hereunder, (ii)
                      rightfully received from a third party and not derived
                      directly or indirectly from any breach of a
                      confidentiality obligation, (iv) independently developed
                      by the recipient, or (v) disclosed pursuant to the receipt
                      by a party of written permission from the other party to
                      disclose. Unless agreed otherwise each party will (a)
                      disclose the other’s Confidential Information solely to
                      its authorized employees and legal/financial advisors, on
                      a need to know basis, to the extent necessary for them to
                      perform their business obligations; (b) protect the
                      other’s Confidential Information against disclosure with
                      the same degree of care as it protects its own, though in
                      no event will it exercise less than ordinary care; and (c)
                      notify the other of unauthorized use, disclosure theft, or
                      other loss of Confidential Information of which it learns.
                      If a party becomes legally compelled to disclose any of
                      the Confidential Information of the other party, such
                      party shall, where legally permissible, provide the other
                      party with prompt notice so that the other party may seek
                      a protective order or other appropriate remedy. This
                      clause will survive expiration or termination of this
                      Agreement by three (3) years. SERVICE PROVIDER shall not
                      release CLIENT’S information to any third party except if
                      compelled by a Court of Competent Jurisdiction, and in
                      such event, shall give CLIENT as much notice as possible
                      prior to disclosing such information and allowing CLIENT
                      an opportunity to obtain a court order or other lawful
                      directive stopping the compelled disclosure.
                      <br />
                      SERVICE PROVIDER will comply with all applicable laws
                      regarding data retention and deletion as outlined in
                      Section 25, ensuring that no CLIENT data is disclosed,
                      retained, or deleted contrary to confidentiality
                      obligations.
                    </p>
                    <br />
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>7. Responsibility for Users</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      CLIENT will be responsible and liable for the acts and
                      omissions of all its Users in connection with this
                      Agreement, website usage Terms and Conditions as well as
                      any and all access to and use of the Service by any User
                      or any other person logging in under a User ID registered
                      under CLIENT's account or providing and/or receiving
                      CLIENT Data or other information through the Service.
                      CLIENT acknowledges that CLIENT's access information,
                      including User IDs and passwords of its Users, will be
                      CLIENT's "key" to the Service and, accordingly, CLIENT
                      will be responsible for maintaining the confidentiality of
                      such access information. CLIENT will: (i) notify “SERVICE
                      PROVIDER" immediately of any unauthorized use of any
                      password or account or any other known or suspected breach
                      of security; (ii) report to “SERVICE PROVIDER" immediately
                      and use reasonable efforts to stop immediately any copying
                      or distribution of “SERVICE PROVIDER" that is known or
                      suspected by CLIENT or Client's Users; and (iii) not
                      impersonate another “SERVICE PROVIDER" user or provide
                      false identity information to gain access to or use the
                      Service.
                    </p>
                    <br />
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>
                        8. CLIENT Obligations and Service Revisions
                      </strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      The CLIENT agrees to provide all necessary Input Data,
                      including but not limited to documents, instructions,
                      training materials, and similar resources, to enable
                      SERVICE PROVIDER to deliver its services accurately and
                      efficiently. The CLIENT acknowledges that the quality and
                      accuracy of the services provided by the SERVICE PROVIDER
                      are dependent on the accuracy, completeness, and
                      timeliness of the Input Data supplied by the CLIENT.
                      <br />
                      <br />
                      SERVICE PROVIDER is committed to ensuring CLIENT
                      satisfaction and agrees to accommodate reasonable requests
                      for edits or changes to the services or deliverables. Such
                      requests for revisions must be communicated to the SERVICE
                      PROVIDER within one (1) month from the date of delivery of
                      the service or deliverable. Requests made after this
                      period may be subject to additional fees as mutually
                      agreed upon.
                    </p>
                    <br />
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>9. Indemnification</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      Each Party agrees to the fullest extent permitted by law
                      to indemnify the other party against any damages, claims,
                      charges, liens, or awarded in a final, non-appealable
                      judgment based on a finding that the other party breached
                      any covenant, representation, or warranty made herein.
                    </p>
                    <br />

                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>10. Data Retention and Deletion Policy</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      10.1. Archival of Data: The Service Provider will archive
                      all data after one year of inactivity unless otherwise
                      mandated by applicable laws, contractual obligations, or
                      specific CLIENT instructions.
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      10.2. Permanent Deletion of Data: The Service Provider
                      will permanently delete all data after three years from
                      the date of collection or last use, whichever is later,
                      unless required otherwise by applicable laws or specific
                      CLIENT instructions.
                    </p>

                    <br />

                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <strong>11. Escalation Levels and Contacts</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <center>
                        <table
                          style={{
                            border: "1px solid",
                            width: "100%",
                            borderCollapse: "collapse",
                          }}
                          cellSpacing="0"
                          cellPadding="5"
                        >
                          <thead>
                            <tr
                              style={{
                                backgroundColor: "#d6d6d6",
                                textAlign: "center",
                              }}
                            >
                              <th
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                }}
                              >
                                Escalation Level
                              </th>
                              <th
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                }}
                              >
                                Description of Issue
                              </th>
                              <th
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                }}
                              >
                                Response Time
                              </th>
                              <th
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                }}
                              >
                                Contact Person
                              </th>
                              <th
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                }}
                              >
                                Contact Details
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                <strong>Level 1</strong>
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                }}
                              >
                                Minor queries, document requests, or
                                clarifications
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                4 hours
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                Quality Representative
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                Via Entrust
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                <strong>Level 2</strong>
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                }}
                              >
                                Repeated issues, delayed document delivery
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                8 hours
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "left",
                                }}
                              >
                                <table
                                  style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                  }}
                                >
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      LPM - Team Leader
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      MPM - Team Leader
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      BPM - Team Leader
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: "5px" }}>
                                      VPM - Team Leader
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "left",
                                }}
                              >
                                <table
                                  style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                  }}
                                >
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      lpmteam@neuralit.com
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      mpmteam@neuralit.com
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      bpmteam@neuralit.com
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: "5px" }}>
                                      vpmteam@neuralit.com
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                <strong>Level 3</strong>
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                }}
                              >
                                Errors in documentation, moderate service
                                disruption
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                12 hours
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                Client Manager
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                mary.p@neuralit.com
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                <strong>Level 4</strong>
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                }}
                              >
                                Major errors, missed deadlines, high client
                                impact
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                24 hours
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "left",
                                }}
                              >
                                <table
                                  style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                  }}
                                >
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      LPM - HOD
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      MPM - HOD
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      BPM - HOD
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: "5px" }}>
                                      VPM - Manager
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "0",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "left",
                                }}
                              >
                                <table
                                  style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                  }}
                                >
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      imran.i@neuralit.com
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      amruta.p@neuralit.com
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        borderBottom: "1px solid",
                                        padding: "5px",
                                      }}
                                    >
                                      rohit.b@neuralit.com
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: "5px" }}>
                                      hiten.b@neuralit.com
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                <strong>Level 5</strong>
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                }}
                              >
                                Critical Legal Risk, Compliance Breach
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                Immediate
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                Data Protection Officer
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                dpo@neuralit.com
                              </td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <td
                                colSpan="5"
                                style={{
                                  border: "1px solid",
                                  padding: "8px",
                                  fontFamily: "verdana, geneva",
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                <strong>Contact us on # 844-NIT-TEAM</strong>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </center>
                    </p>
                    <br />
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>12. Limitation of Liability</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED IN THIS
                      AGREEMENT SERVICE PROVIDER'S AGGREGATE LIABILITY WITH
                      RESPECT TO THE SERVICES PROVIDED PURSUANT TO THIS
                      AGREEMENT, REGARDLESS OF THE FORM OF ACTION GIVING RISE TO
                      SUCH LIABILITY (WHETHER IN CONTRACT, TORT OR OTHERWISE),
                      SHALL NOT EXCEED THE TOTAL AMOUNT OF FIVE HUNDRED DOLLARS
                      ($500.00), EXCLUDING ANY PENDING FEES, IF APPLICABLE.
                      CLIENT AGREES TO INDEMNIFY SERVICE PROVIDER FROM ALL
                      CLAIMS, LIABILITIES AND COSTS, ARISING OUT OF GIVEN
                      INFORMATION BY THE CLIENT.
                    </p>
                    <br />
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>13. Governing Law and Venue</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      In the event of a dispute between the Parties relating to
                      or arising out of this Agreement, the Parties shall first
                      attempt to resolve the dispute personally and in good
                      faith. If the Personal resolution attempts fail, the
                      Parties shall then submit the dispute to binding
                      arbitration in the state of New York or another location
                      mutually agreeable to the parties. The arbitration shall
                      be conducted on a confidential basis pursuant to the
                      Commercial Arbitration Rules of the American Arbitration
                      Association. Any such arbitration shall be conducted by an
                      arbitrator having a law degree and prior experience as an
                      arbitrator and shall include a written record of the
                      arbitration hearing.
                    </p>
                    <br />
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>14. Limitation of Claim</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      14.1.Action arising under this agreement should be claimed
                      by the aggrieved party within a year period.
                      <br />
                      14.2.No claim by either of the PARTIES to the agreement
                      will be valid at any time more than one (1) year after the
                      incident occurred upon which the cause of action arose.
                    </p>
                    <br />
                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>15. Non-Exclusivity</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        marginLeft: "2rem",
                      }}
                    >
                      CLIENT and SERVICE PROVIDER hereby acknowledge and agree
                      that nothing contained herein is to establish an exclusive
                      relationship between Parties. SERVICE PROVIDER shall be
                      free to continue working for and taking new clients,
                      without regard to CLIENT. SERVICE PROVIDER does not need
                      client approval for any such work.
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        textIndent: "-14.2pt",
                        lineHeight: 2,
                        margin: "0in 0in .0001pt 21.3pt",
                      }}
                    >
                      <strong>16. Notices</strong>
                    </p>

                    <p
                      style={{
                        textAlign: "justify",
                        lineHeight: 2,
                        marginLeft: "2rem",
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
                      under the terms of this Agreement.{" "}
                    </p>
                  </div>
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
                  <br />
                  <div>
                    {/* Section 14: Amendment */}
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        margin: "10px 0",
                      }}
                    >
                      <strong>17. Amendment</strong>
                    </p>
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        textAlign: "justify",
                      }}
                    >
                      No modifications or amendments of this Agreement and no
                      waiver of any of the terms or conditions hereof, shall be
                      valid or binding unless made in writing and duly executed
                      by both Parties.{" "}
                    </p>
                    {/* Section 15: Waiver */}
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        margin: "10px 0",
                      }}
                    >
                      <strong>18. Waiver</strong>
                    </p>
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        textAlign: "justify",
                      }}
                    >
                      No provision of this Agreement shall be deemed to be
                      waived except by express written consent executed by the
                      Party, which is claimed to have waived the relevant
                      provision.
                    </p>

                    {/* Section 16: Consent */}
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        margin: "10px 0",
                      }}
                    >
                      <strong>19. Consent</strong>
                    </p>
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        textAlign: "justify",
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

                    {/* Section 17: Severability */}
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        margin: "10px 0",
                      }}
                    >
                      <strong>20. Severability</strong>
                    </p>
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        textAlign: "justify",
                      }}
                    >
                      It is intended that each section of this Agreement shall
                      be viewed as separate and divisible and in the event that
                      any section shall be held to be invalid or unenforceable,
                      the remaining sections shall continue to be in full force
                      and effect.{" "}
                    </p>

                    {/* Section 18: Assignable */}
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        margin: "10px 0",
                      }}
                    >
                      <strong>21. Assignable</strong>
                    </p>
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        textAlign: "justify",
                      }}
                    >
                      If any obligation of CLIENT under this Agreement is
                      assigned, delegated or otherwise transferred, whether by
                      agreement, operation of law or otherwise, this Agreement
                      shall bind CLIENT and its permitted successors and
                      assigns.{" "}
                    </p>

                    {/* Section 19: Force Majeure */}
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        margin: "10px 0",
                      }}
                    >
                      <strong>22. Force Majeure</strong>
                    </p>
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        textAlign: "justify",
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

                    {/* Section 20: Binding Effect */}
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        margin: "10px 0",
                      }}
                    >
                      <strong>23. Binding Effect</strong>
                    </p>
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        textAlign: "justify",
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

                    {/* Section 21: Relationship Between Parties */}
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        margin: "20px 0",
                      }}
                    >
                      <strong>24. Relationship between Parties</strong>
                    </p>
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        textAlign: "justify",
                        marginLeft: "2rem",
                      }}
                    >
                      24.1. This Agreement is not intended and shall not be
                      construed to confer on any person other than the Parties
                      hereto, any rights and/or remedies herein.
                    </p>
                    <p
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "10pt",
                        textAlign: "justify",
                        marginLeft: "2rem",
                      }}
                    >
                      24.2. No provision of this Agreement shall be deemed to
                      constitute a partnership between the Parties and neither
                      Party shall have any right or authority to bind the other
                      as the other’s agent or representative and neither Party
                      shall be deemed to be the agent of the other in any way.
                    </p>
                  </div>
                  {/* Section 23: Clause Headings */}
                  <p style={{ fontSize: "14px", marginTop: "20px" }}>
                    <strong>25. Clause Headings</strong>
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      marginLeft: "2rem",
                      textAlign: "justify",
                    }}
                  >
                    The section and clause headings contained in this Agreement
                    are for the convenience of the Parties and shall not affect
                    the meaning or interpretation of this Agreement.
                  </p>
                  {/* Section 24: Entire Agreement */}
                  <p style={{ fontSize: "14px", marginTop: "10px" }}>
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
                  {/* Conclusion */}
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
                  {/* Acknowledgment */}
                  <p
                    style={{
                      fontSize: "14px",
                      marginTop: "10px",
                      marginLeft: "2rem",
                      textAlign: "justify",
                    }}
                  >
                    I the undersigned, do hereby acknowledge that I have read
                    and understood the terms and conditions of the Service Level
                    Agreement and I am authorized to enter into such contracts
                    on behalf of my Firm.
                  </p>
                  {/* Signatures */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "20px",
                      gap: "20px",
                    }}
                  >
                    {/* Left Signature */}
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

                    {/* Right Signature */}
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
                        {/* Placeholder for user signature */}
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
                  <div>
                    {/* Title Section */}
                    <div
                      className="title pt-6"
                      style={{ textAlign: "center", marginBottom: "20px" }}
                    >
                      <h2
                        style={{
                          fontSize: "20px",
                          textDecoration: "underline",
                          fontFamily: "'Verdana', sans-serif",
                          letterSpacing: "1px",
                        }}
                      >
                        SCHEDULE A
                      </h2>
                    </div>

                    {/* Effective Date Section */}
                    <div
                      className="effective-date"
                      style={{ marginBottom: "20px" }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          fontFamily: "'Verdana', sans-serif",
                          lineHeight: "1.5",
                        }}
                      >
                        <strong style={{ textDecoration: "underline" }}>
                          Effective From: {today}
                        </strong>
                      </p>
                    </div>

                    {/* Entrust Account Balance Section */}
                    <div
                      className="account-balance-section"
                      style={{ marginBottom: "20px" }}
                    >
                      <h3
                        style={{
                          fontSize: "16px",
                          textDecoration: "underline",
                          fontFamily: "'Verdana', sans-serif",
                        }}
                      >
                        1. Entrust Account Balance
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          fontFamily: "'Verdana', sans-serif",
                          lineHeight: "1.6",
                          paddingLeft: "20px",
                        }}
                      >
                        Account Balance is a positive balance maintained by
                        CLIENT with SERVICE PROVIDER.
                      </p>

                      {/* Account Balance Details */}
                      <div
                        className="account-balance-details"
                        style={{ marginLeft: "20px" }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            fontFamily:
                              "'Verdana', sans-serif', lineHeight: '1.6'",
                          }}
                        >
                          1.1. CLIENT shall deposit with SERVICE PROVIDER an
                          amount, ("account balance"). SERVICE PROVIDER shall
                          hold the said account balance in trust until the
                          services are rendered, at which time the money shall
                          be used to pay the fees.
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontFamily:
                              "'Verdana', sans-serif', lineHeight: '1.6'",
                          }}
                        >
                          1.2. Account will be suspended if the CLIENT fails to
                          deposit ("account balance") with SERVICE PROVIDER
                          within one month from the date of signing of this
                          agreement.
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontFamily:
                              "'Verdana', sans-serif', lineHeight: '1.6'",
                          }}
                        >
                          1.3. CLIENT shall have the option of paying SERVICE
                          PROVIDER a minimum amount of $1,000.00 as the "account
                          balance", within a month's period from the date of
                          creating an account. The "account balance" will be
                          used towards all the services consumed as per the
                          rates listed in the agreement.
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontFamily:
                              "'Verdana', sans-serif', lineHeight: '1.6'",
                          }}
                        >
                          1.4. Upon account balance reaches $0.00 or any minimum
                          threshold amount fixed by CLIENT or if fees of
                          CLIENT'S assignments exceed the account balance, the
                          card on file will be auto swiped for $1,000.00 or the
                          required amount based on assignments, whichever is
                          higher.
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontFamily:
                              "'Verdana', sans-serif', lineHeight: '1.6'",
                          }}
                        >
                          1.5. In the event CLIENT fails to add to or replenish
                          account balance, SERVICE PROVIDER's responsibility
                          will be to complete work ONLY up to CLIENT's account
                          balance.
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontFamily:
                              "'Verdana', sans-serif', lineHeight: '1.6'",
                          }}
                        >
                          1.6. Any charges levied by the bank or any other
                          financial institution for remitting the amount due
                          shall be payable by the CLIENT.
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontFamily:
                              "'Verdana', sans-serif', lineHeight: '1.6'",
                          }}
                        >
                          1.7. SERVICE PROVIDER is entitled to propose revision
                          to the account balance, fees, rate per resource and
                          rate per document as laid out in Schedule "A". Upon
                          agreement by both SERVICE PROVIDER and CLIENT,
                          revision shall be applicable from the date as
                          mentioned in the revised Schedule "A".
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontFamily:
                              "'Verdana', sans-serif', lineHeight: '1.6'",
                          }}
                        >
                          1.8. Unless otherwise agreed between SERVICE PROVIDER
                          and CLIENT, balance in account will be valid for 1
                          year from last utilization date. Subsequently,
                          CLIENT's account shall be suspended and balance shall
                          be credited to SERVICE PROVIDER.
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontFamily:
                              "'Verdana', sans-serif', lineHeight: '1.6'",
                          }}
                        >
                          1.9. CLIENT is entitled to refund of account balance
                          subjected to written notice within one year of the
                          last activity in the account. SERVICE PROVIDER will
                          transfer the account balance within 90 (ninety) days
                          of receiving the written notice and subsequently will
                          deactivate the account.
                        </p>
                      </div>
                    </div>

                    <div className="free-services-section">
                      {/* Free Services Title */}
                      <div className="title" style={{ marginBottom: "15px" }}>
                        <h3
                          style={{
                            fontFamily: "'Verdana', sans-serif",
                            fontSize: "16px",
                            letterSpacing: "-0.2pt",
                            lineHeight: "1.5",
                          }}
                        >
                          2. Free Services
                        </h3>
                      </div>

                      {/* Free Services Description */}
                      <div
                        className="description"
                        style={{ marginBottom: "15px" }}
                      >
                        <p
                          style={{
                            fontFamily: "'Verdana', sans-serif",
                            fontSize: "14px",
                            textAlign: "justify",
                            lineHeight: "1.5",
                            paddingLeft: "20px",
                          }}
                        >
                          2.1. CLIENT is entitled to the following services
                          absolutely free:
                        </p>
                      </div>

                      {/* List of Free Services */}
                      <ul
                        style={{
                          fontFamily: "'Verdana', sans-serif",
                          fontSize: "14px",
                          lineHeight: "1.5",
                          paddingLeft: "40px",
                          marginBottom: "15px",
                        }}
                      >
                        <li>
                          2.1.1. 100 pages for Chronologies & Medical Summaries.
                        </li>
                        <li>
                          2.1.2. Two (2) Demand letters (limited up to 300 pages
                          of assignment per Demand Letter).
                        </li>
                        <li>
                          2.1.3. A Verified Bill of Particulars and Response to
                          Combined Demand.
                        </li>
                        <li>2.1.4. Five (5) Plaintiffs Fact Sheets (PFS).</li>
                        <li>2.1.5. Five (5) Mass tort cases.</li>
                      </ul>

                      {/* Suspended Account Information */}
                      <div
                        className="suspended-account-info"
                        style={{ marginBottom: "15px" }}
                      >
                        <p
                          style={{
                            fontFamily: "'Verdana', sans-serif",
                            fontSize: "14px",
                            textAlign: "justify",
                            lineHeight: "1.5",
                            paddingLeft: "20px",
                          }}
                        >
                          2.2. Suspended client account, after account
                          reactivation, can avail the unutilized free services.
                        </p>
                      </div>

                      {/* Disclaimer on Changes */}
                      <div className="changes-disclaimer">
                        <p
                          style={{
                            fontFamily: "'Verdana', sans-serif",
                            fontSize: "14px",
                            textAlign: "justify",
                            lineHeight: "1.5",
                            paddingLeft: "20px",
                          }}
                        >
                          2.3. The free services are subject to changes as per
                          service provider's discretion.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rate-chart-section">
                    {/* Title Section */}
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          fontFamily: "Open Sans, Geneva",
                        }}
                      >
                        <strong>NEURAL IT RATE CHART</strong>
                      </p>
                    </div>

                    {/* Section 1 Header */}
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <h4
                        style={{
                          fontSize: "16px",
                          fontFamily: "'Verdana', 'Geneva', sans-serif",
                          fontWeight: "bold",
                          color: "#333",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          borderBottom: "2px solid #ccc",
                          display: "inline-block",
                          paddingBottom: "5px",
                        }}
                      >
                        Services at Fixed Rate Per Case
                      </h4>
                    </div>

                    {/* Demand Letter Services Table */}
                    <div>
                      <h5
                        style={{
                          fontSize: "10px",
                          fontFamily: "Open Sans, Geneva",
                        }}
                      >
                        <strong>1. DEMAND LETTER SERVICES</strong>
                      </h5>
                      <table
                        style={{
                          border: "1px solid",
                          width: "100%",
                          borderCollapse: "collapse",
                          marginBottom: "20px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Service
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                                width: "150px",
                              }}
                            >
                              Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              First Claimant and 100 pages assignment
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $65.00
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Additional Claimants
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $50.00 per claimant
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Charges for 101-500 pages assignment
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.60 per page
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Charges for 501 pages assignment and above
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.30 per page
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              <strong>Verdict Analysis</strong>
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              <strong>$25.00 per analysis</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Images illustrating Injury in a Demand Letter
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $2.00 per image
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Table for Document Explaining an Injury */}
                      <table
                        style={{
                          border: "1px solid",
                          width: "100%",
                          borderCollapse: "collapse",
                          marginBottom: "20px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Service
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                                width: "150px",
                              }}
                            >
                              Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              A document explaining an Injury
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $25.00
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Section 2 Header */}
                    <div>
                      <h5
                        style={{
                          fontSize: "10px",
                          fontFamily: "Open Sans, Geneva",
                        }}
                      >
                        <strong>
                          2. MEDICAL RECORD RETRIEVAL SERVICES (MRR)
                        </strong>
                      </h5>

                      {/* Medical Record Retrieval Services Table */}
                      <table
                        style={{
                          border: "1px solid",
                          width: "100%",
                          borderCollapse: "collapse",
                          marginBottom: "20px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Service
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                                width: "150px",
                              }}
                            >
                              Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Per Request, per Medical Provider location - QC
                              for 200 pages included
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $30.00
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Rush Request Fees
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $15.00
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              QC Charge for every additional page above 200
                              pages
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.05
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Index Report for every page [Optional]
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.05
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Medical Provider Fees, Copy Service, Third Party
                              Release Fees (paid by Neural IT)
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Pass-Through
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Cancellation of Transaction charge per request
                              after 1 business day from request, <br />
                              and before the documents are obtained, for per
                              medical provider location.
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $15.00
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                textAlign: "center",
                              }}
                              colSpan="2"
                            >
                              <strong>
                                Pass-through fees are non-refundable.
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Section 3 Header */}
                    <div>
                      <h5>
                        <span
                          style={{
                            fontSize: "10px",
                            fontFamily: "Open Sans, geneva",
                          }}
                        >
                          <strong>
                            3. MEDICAL REVIEW - CHRONOLOGY SERVICES
                          </strong>
                        </span>
                      </h5>

                      {/* Table for Medical Review - Chronology Services */}
                      <table
                        style={{
                          border: "1px solid",
                          width: "100%",
                          borderCollapse: "collapse",
                          marginBottom: "20px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              ID
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Service
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                                width: "150px",
                              }}
                            >
                              Rate (Per Page)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              A
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Sectioning/Sorting Medical Records
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.10
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              B
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Hyperlinked Index Report
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.10
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              C
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Detailed Billing Summary
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.20
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              D
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Timeline in Excel or Word
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.25
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              E
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Narrative Summary
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.35
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              F
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Hyperlinked Timeline Narrative Summary with
                              Consolidated Medical Records MVA
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.50
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              G
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Hyperlinked Timeline Narrative Summary with
                              Consolidated Medical Records Medmal
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.70
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Section 4 Header */}
                    <div>
                      <h5>
                        <span
                          style={{
                            fontSize: "10px",
                            fontFamily: "Open Sans, geneva",
                          }}
                        >
                          <strong>
                            4. ADD ON PRODUCTS ALONG WITH ABOVE SERVICES
                          </strong>
                        </span>
                      </h5>

                      {/* Table for Add On Products */}
                      <table
                        style={{
                          border: "1px solid",
                          width: "100%",
                          borderCollapse: "collapse",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              ID
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Add On Product
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Rate
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              ID
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Add On Product
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              1
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Demonstrative Medical Images
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $2/image
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              12
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              ICD Codes and Diagnosis
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $5
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              2
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Medical Facilities/Providers Compilation
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $2
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              13
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Treatments with CPT/HCPCS codes
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $5
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              3
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Disability Score Interpretation
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $2
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              14
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Pain Score Chart
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $5
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              4
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Duties Under Duress (DUD)
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $2
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              15
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Range of Motion Chart
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $5
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              5
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Economic Damages
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $2
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              16
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Graphical Demonstrations
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $20
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              6
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Non-Economic Damages
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $2
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              17
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Pre and Post MVA Health Status
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $20
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              7
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Future Medical Expenses
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $2
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              18
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Color Coded Medical Records
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $20
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              8
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Loss of Enjoyment Section
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $2
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              19
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Treatment Gaps
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $20
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              9
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Past Medical Expenses Report
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $2
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              20
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Medical Expert Opinion
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $50
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              10
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Cast of Characters
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $5
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              21
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Medical Cost Projection
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $50
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              11
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Medical terminologies Legends
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $5
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              22
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Life Care Plan
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $100*
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p
                        style={{
                          fontSize: "10px",
                          fontFamily: "Open Sans, geneva",
                        }}
                      >
                        *Base start rate, may vary depending upon complexity of
                        case and signing specialty
                      </p>
                    </div>

                    {/* Section 5 Header */}
                    <div>
                      <h5>
                        <span
                          style={{
                            fontSize: "10px",
                            fontFamily: "Open Sans, geneva",
                          }}
                        >
                          <strong>
                            5. MEDICAL REVIEW - MASS TORT SERVICES
                          </strong>
                        </span>
                      </h5>

                      {/* Table for Medical Review - Mass Tort Services */}
                      <table
                        style={{
                          border: "1px solid",
                          width: "100%",
                          borderCollapse: "collapse",
                          marginBottom: "20px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Service
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                                width: "150px",
                              }}
                            >
                              Rate (Per Page)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Quick Claim Validation of Mass Torts Cases
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.20
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Mass Tort Review
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.40
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Mass Tort Detailed Review with Narrative Summary
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $0.60
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* Section 6 Header */}
                    <div>
                      <h5>
                        <span
                          style={{
                            fontSize: "10px",
                            fontFamily: "Open Sans, geneva",
                          }}
                        >
                          <strong>
                            6. PLAINTIFF FACT SHEETS-MASS TORT SERVICES
                          </strong>
                        </span>
                      </h5>

                      {/* Table for Plaintiff Fact Sheets-Mass Tort Services */}
                      <table
                        style={{
                          border: "1px solid",
                          width: "100%",
                          borderCollapse: "collapse",
                          marginBottom: "20px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Service
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                                width: "150px",
                              }}
                            >
                              Rate (Per Hour)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Mass Tort PFS Filling (Only MR Review)
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $15.00
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Mass Tort PFS Filling (MR Review and Calling
                              Plaintiffs)
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $25.00
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* Section 7 Header */}
                    <div>
                      <h5>
                        <span
                          style={{
                            fontSize: "10px",
                            fontFamily: "Open Sans, geneva",
                          }}
                        >
                          <strong>7. REBUTTALS DRAFTING</strong>
                        </span>
                      </h5>

                      {/* Table for Rebuttals Drafting */}
                      <table
                        style={{
                          border: "1px solid",
                          width: "100%",
                          borderCollapse: "collapse",
                          marginBottom: "20px",
                        }}
                      >
                        <thead>
                          <tr>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                              }}
                            >
                              Service
                            </th>
                            <th
                              style={{
                                border: "1px solid",
                                padding: "5px",
                                backgroundColor: "#d6d6d6",
                                width: "150px",
                              }}
                            >
                              Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              Rebuttals for IME/Peer Review
                            </td>
                            <td style={{ border: "1px solid", padding: "5px" }}>
                              $25.00
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      {/* Section 1 Header */}
                      <div>
                        <h5>
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "Open Sans, geneva",
                            }}
                          >
                            <strong>
                              8. Legal Services [Attorneys and Paralegals]
                            </strong>
                          </span>
                        </h5>

                        {/* Table for Legal Services */}
                        <table
                          style={{
                            border: "1px solid",
                            width: "100%",
                            borderCollapse: "collapse",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  border: "1px solid",
                                  padding: "5px",
                                  backgroundColor: "#d6d6d6",
                                }}
                              >
                                Service
                              </th>
                              <th
                                style={{
                                  border: "1px solid",
                                  padding: "5px",
                                  backgroundColor: "#d6d6d6",
                                  width: "150px",
                                }}
                              >
                                Rate
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                style={{ border: "1px solid", padding: "5px" }}
                              >
                                Legal Drafts (Summons & Complaint, Discovery,
                                Motion, etc.)
                              </td>
                              <td
                                style={{ border: "1px solid", padding: "5px" }}
                              >
                                $25.00
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{ border: "1px solid", padding: "5px" }}
                              >
                                Legal Research and Summarization – Case laws and
                                Articles
                              </td>
                              <td
                                style={{ border: "1px solid", padding: "5px" }}
                              >
                                $25.00
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{ border: "1px solid", padding: "5px" }}
                              >
                                Deposition Summary
                              </td>
                              <td
                                style={{ border: "1px solid", padding: "5px" }}
                              >
                                $25.00
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{ border: "1px solid", padding: "5px" }}
                              >
                                Paralegal Services (Intake, Data Entry,
                                Association, Case opening, Letter generation
                                etc.)
                              </td>
                              <td
                                style={{ border: "1px solid", padding: "5px" }}
                              >
                                $10.00
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        padding: "10px",
                        // border: "1px solid #ccc",
                        // backgroundColor: "#f9f9f9",
                      }}
                    >
                      {/* Left Div */}
                      <div style={{ width: "50%", padding: "10px" }}>
                        <div
                          style={{ textAlign: "center", marginBottom: "10px" }}
                        >
                          <img
                            src={sailesh}
                            alt="Sailesh Paul Peringatt"
                            width={94}
                            height={113}
                            style={{ display: "block", margin: "0 auto" }}
                          />
                        </div>
                        <div
                          style={{ textAlign: "center", marginBottom: "5px" }}
                        >
                          <span style={{ textDecoration: "underline" }}>
                            Sailesh Paul Peringatt
                          </span>
                        </div>
                        <div
                          style={{ textAlign: "center", marginBottom: "5px" }}
                        >
                          <span>(President)</span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <span>NEURAL IT LLC.</span>
                        </div>
                      </div>

                      {/* Right Div */}
                      <div style={{ width: "50%", padding: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f0f0f0",
                            border: "1px solid #ccc",
                            height: "115px",
                            width: "150px",
                            margin: "auto",
                          }}
                        ></div>
                        <div style={{ textAlign: "center", marginTop: "10px" }}>
                          <span style={{ textDecoration: "underline" }}>
                            {UserName}
                          </span>
                        </div>
                        <div style={{ textAlign: "center", marginTop: "5px" }}>
                          <span>{JobTitle}</span>
                        </div>
                        <div style={{ textAlign: "center", marginTop: "5px" }}>
                          <span>{CompanyName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2
                    style={{
                      color: "#0098ca",
                      padding: "0 0 2rem 0",
                      textAlign: "center",
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
