import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import "./../../assets/css/termsandcondition.css";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

export const TermsAndCondition = () => {
  const headlineStyle = {
    fontFamily: "Open Sans, sans-serif",
    color: "#0098ca",
  };

  const headerStyle = {
    fontFamily: "Open Sans, sans-serif",
    fontSize: "14px",
    color: "#0098CA",
  };

  const ParagraphsStyle = {
    fontFamily: "Open Sans, sans-serif",
    fontSize: "12px",
    textAlign: "justify",
  };

  const [loading, setLoading] = useState(false); // For API request loading
  const [isPageLoading, setIsPageLoading] = useState(true); // For initial page loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = () => {
      let userDetails = sessionStorage.getItem("user_details");

      if (!userDetails) {
        console.warn("user_details is null. Initializing default values.");
        userDetails = JSON.stringify({
          termsAccepted: false,
          is_authorized_signatory: 0,
        });
        sessionStorage.setItem("user_details", userDetails);
      }

      const parsedUserDetails = JSON.parse(userDetails);

      // console.log("parsedUserDetails===========", parsedUserDetails);

      if (parsedUserDetails.termsAccepted) {
        if (parsedUserDetails.is_authorized_signatory === 1) {
          navigate("/useragreement");
        } else {
          navigate("/");
        }
      }
      setIsPageLoading(false); // Stop the page loader once logic completes
    };

    fetchUserDetails();
  }, [navigate]);

  const termsandCondition = () => {
    setLoading(true); // Show loader for API request

    const token = sessionStorage.getItem("token");
    let userDetails = sessionStorage.getItem("user_details");

    if (!userDetails) {
      console.warn("user_details is null. Initializing default values.");
      userDetails = JSON.stringify({
        termsAccepted: false,
        is_authorized_signatory: 0,
      });
      sessionStorage.setItem("user_details", userDetails);
    }

    const parsedUserDetails = JSON.parse(userDetails);

    fetch(`${API_URL}/user/accept-terms`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        parsedUserDetails.termsAccepted = true;
        sessionStorage.setItem(
          "user_details",
          JSON.stringify(parsedUserDetails)
        );

        // Show success message and navigate
        toast.success("Terms accepted successfully!");
        if (parsedUserDetails.is_authorized_signatory === 1) {
          navigate("/useragreement");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to accept terms. Please try again.");
      })
      .finally(() => {
        setLoading(false); // Stop loader after request completes
      });
  };

  // If the page is still loading, show the Loader component
  if (isPageLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className=" container-fluid height">
        <div className="row">
          <div className="condition scroll-container">
            <div className="pt-12 d-flex flex-center flex-column flex-column-fluid">
              <div className="condition-box" data-spy="scroll">
                <div className="container mt-5">
                  <div className="text-center">
                    <h2>
                      <strong style={headlineStyle}>
                        <b>Terms &amp; Conditions</b>
                      </strong>
                    </h2>
                  </div>

                  <div className="pt-3">
                    <div>
                      <h5 style={headerStyle}>
                        <strong>Website Usage:</strong>
                      </h5>
                      <p style={ParagraphsStyle}>
                        Welcome to our website, Entrust. If you continue to
                        browse and use this website, you agree to comply with
                        and be bound by the following terms and conditions of
                        use, which together with our privacy policy govern
                        "ENTRUST's" relationship with you in relation to this
                        website. If you disagree with any part of these terms
                        and conditions, please do not use our website.
                      </p>

                      <p style={ParagraphsStyle}>
                        The term "ENTRUST" or 'us' or 'we' refers to the owner
                        of the website NEURAL IT LLC., a New York corporation
                        having registered office located at 100 Duffy Avenue,
                        Suite 510, Hicksville, NY 11801, United States; a wholly
                        owned subsidiary of NEURAL IT PVT. LTD. has a registered
                        office located at Vishal House, 1<sup>st</sup> Floor,
                        Plot No. 33, Sector 19C, Vashi, Navi Mumbai - 400705 and
                        place of India business (operations) at Suite 3, Floor
                        8, Bldg. 3, Mindspace SEZ, Airoli, Navi Mumbai-400708,
                        Maharashtra, India.
                      </p>

                      <p style={ParagraphsStyle}>
                        The term 'you or your' refers to the user or viewer of
                        our website.
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>1. ACCEPTANCE OF TERMS</strong>
                      </h5>

                      <p style={ParagraphsStyle}>
                        1.1. Your access to and use of{" "}
                        <a
                          href="https://entrust.neuralit.com"
                          style={{ textDecoration: "underline" }}
                        >
                          https://entrust.neuralit.com
                        </a>{" "}
                        and the Services outlined in Clause 2, are subject
                        exclusively to these Terms and Conditions. You will not
                        use the Website/Services for any purpose that is
                        unlawful or prohibited by these Terms and Conditions. By
                        using the Website/Services you are fully accepting the
                        terms, conditions, and disclaimers contained in this
                        notice. If you do not accept these Terms and Conditions
                        you must immediately stop using the Website/Services.
                      </p>

                      <p style={ParagraphsStyle}>
                        1.2. "ENTRUST" reserves the right to update or amend
                        these Terms and Conditions at any time and your
                        continued use of the Website/Services following any
                        changes shall be deemed to be your acceptance of such
                        change. It is therefore your responsibility to check the
                        Terms and Conditions regularly for any changes.
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>2. THE SERVICES</strong>
                      </h5>

                      <p style={ParagraphsStyle}>
                        "ENTRUST" provides the following services:
                        <ul
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          <li>Medical - Legal Services</li>
                          <li>Legal Services</li>
                          <li>Paralegal Services</li>
                          <li>Voice-based Customer Services</li>
                          <li>IT Services</li>
                        </ul>
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>3. USER ACCOUNT, PASSWORD, AND SECURITY</strong>
                      </h5>

                      <p style={ParagraphsStyle}>
                        The service requires you to open an account. It will
                        require you to complete the registration process by
                        providing certain information and registering a username
                        and password for use with the Services. You are
                        responsible for maintaining the confidentiality of the
                        username and password and also for all activities that
                        take place under your account. You agree to immediately
                        notify Entrust of any unauthorized use of your password
                        or account or any other breach of security. In no event
                        will Entrust be liable for any indirect or consequential
                        loss or damage whatsoever resulting from the disclosure
                        of your username and/or password. You may not use
                        another person's account at any time, without the
                        express permission of the account holder.
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>4. DATA PRIVACY POLICY</strong>
                      </h5>
                      <p style={ParagraphsStyle}>
                        "ENTRUST" treats the shared data of its Website users
                        with the utmost respect and confidentiality. We take
                        reasonable steps to ensure that data is stored securely
                        and accurately. Should you have any queries or comments
                        about our use of your shared data then please contact us
                        by e-mail at{" "}
                        <a href="mailto:entrust@neuralit.com">
                          entrust@neuralit.com
                        </a>
                        . The following information details how we collect store
                        and use the shared data of our Website users in general:
                      </p>

                      <p style={ParagraphsStyle}>
                        4.1. We follow strict security procedures to make sure
                        that your personal information is not damaged,
                        destroyed, or disclosed to a third party without your
                        permission and to prevent unauthorized access to it. Our
                        storage computers are kept in a secure facility and we
                        use secure firewalls and other measures to restrict
                        electronic access.
                      </p>

                      <p style={ParagraphsStyle}>
                        4.2. You may request a copy of the data we hold about
                        you by e-mailing us at{" "}
                        <a href="mailto:entrust@neuralit.com">
                          entrust@neuralit.com
                        </a>{" "}
                        and you may ask us to make any changes required to
                        ensure that this information is accurate.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.3. All of the information we collect or record is
                        restricted to our premises and only members of staff who
                        need the information to perform their specific job are
                        granted access to your data.
                      </p>

                      <p style={ParagraphsStyle}>
                        4.4. Where you have consented, we may use your
                        information to contact you about any other services we
                        offer that may be of interest to you. If you change your
                        mind about being contacted in the future, please email
                        us at{" "}
                        <a href="mailto:entrust@neuralit.com">
                          entrust@neuralit.com
                        </a>
                        .
                      </p>

                      <p style={ParagraphsStyle}>
                        4.5. We use the information we collect about you to
                        update you about new products and services, to improve
                        the services we offer,and also to support our marketing
                        efforts.
                      </p>

                      <p style={ParagraphsStyle}>
                        4.6. When you visit our Website and/or register with us
                        and/or use the services on this Website, you may be
                        asked to provide certain information about yourself.
                        This could include your name and contact details.
                      </p>

                      <p style={ParagraphsStyle}>
                        4.7. We may collect information about the way you use
                        our Website. This information allows us to identify
                        patterns which help us develop and improve our services.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.8. We use 'cookies' to enable us to personalize your
                        visits to this website, monitor preferences,and track
                        usage of this Website. Cookies are small pieces of
                        information that are stored on the hard drive of a
                        computer by an internet browser. You may prevent cookies
                        being used via the settings section of your browser,
                        however you should note that this may reduce the
                        functionality of this Website and other websites you may
                        visit.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.9. As with all websites, we automatically record 'log
                        files' which contain information about our website
                        traffic, for example IP address, pages viewed and amount
                        of time spent on the website. These log files build
                        pictures of how our site is used so we can monitor and
                        improve our service. We are unable to identify you from
                        your log files.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.10. You may be required to co-operate with our
                        security checks before we disclose information to you.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.11. We will retain your information for a reasonable
                        period of time or for as long as is required by law.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.12. We reserve the right to disclose your information
                        should we enter into a sale or merger with another
                        business. We will not otherwise disclose, sell or
                        distribute your information to any third party without
                        your permission unless we are required to do so by law
                        or for the purpose of fraud prevention.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.13. We may change our Privacy Policy from time to
                        time. Any changes to our policy will be posted on this
                        page of our Website.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.14. We reserve the right to use and share information
                        about our users, including your IP address, with law
                        enforcement authorities and/or other companies in the
                        same industry as "ENTRUST" for the purpose of fraud
                        prevention.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.15. We may use your information to contact you for
                        your views on our services and to notify you from time
                        to time about important changes to our services.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.16. We maintain reasonable administrative, technical
                        and physical safeguards designed to protect the
                        information that you provide on this website. However,
                        no security system is impenetrable and we cannot
                        guarantee the security of our website, nor can we
                        guarantee that the information you supply will not be
                        intercepted while being transmitted to us over the
                        Internet, and we are not liable for the illegal acts of
                        third parties such as criminal hackers.
                      </p>
                      <p style={ParagraphsStyle}>
                        4.17. We may share personal information in response to a
                        court order, subpoena, search warrant, law or
                        regulation. We may cooperate with law enforcement
                        authorities in investigating and prosecuting activities
                        that are illegal, violate our rules, or may be harmful
                        to other visitors.
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>5. INTELLECTUAL PROPERTY RIGHTS</strong>
                      </h5>
                      <p style={ParagraphsStyle}>
                        The Website and its content (including without
                        limitation the Website design, text, graphics and all
                        software and source codes connected with the Website and
                        the Services) are protected by copyright, trademarks,
                        patents and other intellectual property rights and laws.
                        In accessing the Website you agree that you will access
                        the contents solely for the services mentioned in
                        clauses 2.
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>6. LIMITATION OF LIABILITY</strong>
                      </h5>
                      <p style={ParagraphsStyle}>
                        The Website is provided on an "AS IS" and "AS AVAILABLE"
                        basis without any representation or endorsement made and
                        without warranty of any kind whether express or implied,
                        including but not limited to the implied warranties of
                        satisfactory quality, fitness for a particular purpose,
                        non-infringement, compatibility, security and accuracy.
                        To the extent permitted by law, "ENTRUST" will not be
                        liable for any indirect or consequential loss or damage
                        whatever (including without limitation loss of business,
                        opportunity, data, profits) arising out of or in
                        connection with the use of the Website. "ENTRUST" makes
                        no warranty that the functionality of the Website will
                        be uninterrupted or error free, that defects will be
                        corrected or that the Website or the server that makes
                        it available are free of viruses or anything else which
                        may be harmful or destructive.
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>7. INDEMNITY</strong>
                      </h5>
                      <p style={ParagraphsStyle}>
                        You agree to indemnify and hold "ENTRUST" and its
                        employees and agents harmless from and against any
                        breach by you of these Terms and Conditions and any
                        claim or demand brought against "ENTRUST" by any third
                        party arising out of your use of the Services and/or any
                        Content submitted, posted or transmitted through the
                        Services, including without limitation, all claims,
                        actions, proceedings, losses, liabilities, damages,
                        costs, expenses (including reasonable legal costs and
                        expenses) howsoever suffered or incurred by "ENTRUST" in
                        consequence of your breach of these Terms and
                        Conditions.
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>8. SEVERABILITY</strong>
                      </h5>
                      <p style={ParagraphsStyle}>
                        In the event that any provision of this Agreement is
                        declared by any judicial or other competent authority to
                        be void, voidable, illegal or otherwise unenforceable or
                        indications of the same are received by either you or us
                        from any relevant competent authority, we shall amend
                        that provision in such reasonable manner as achieves the
                        intention of the parties without illegality or, at our
                        discretion, such provision may be severed from this
                        Agreement and the remaining provisions of this Agreement
                        shall remain in full force and effect.
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>9. TERMINATION</strong>
                      </h5>
                      <p style={ParagraphsStyle}>
                        "ENTRUST" has the right to terminate your access to any
                        or all of the Services at any time, without notice, for
                        any reason, including without limitation, breach of
                        these Terms and Conditions. "ENTRUST" may also at any
                        time, at its sole discretion, discontinue the
                        Website/Services or any part thereof without prior
                        notice and you agree that "ENTRUST" shall not be liable
                        to you or any third party for any termination of your
                        access to the Website/Services.{" "}
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>10. INTERNATIONAL USE</strong>
                      </h5>
                      <p style={ParagraphsStyle}>
                        You agree to comply with all applicable laws regarding
                        the transmission of technical data exported from the
                        India or the country in which you reside (if different)
                        and with all local laws and rules regarding acceptable
                        use of and conduct on the Internet.{" "}
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>11. APPLICABLE LAW AND DISPUTE</strong>
                      </h5>
                      <p style={ParagraphsStyle}>
                        All claims and disputes arising under or relating to
                        this Agreement are to be settled by binding arbitration
                        in the state of New York or another location mutually
                        agreeable to the parties. The arbitration shall be
                        conducted on a confidential basis pursuant to the
                        Commercial Arbitration Rules of the American Arbitration
                        Association. Any decision or award as a result of any
                        such arbitration proceeding shall be in writing and
                        shall provide an explanation for all conclusions of law
                        and fact and shall include the assessment of costs,
                        expenses, and reasonable attorneys' fees. Any such
                        arbitration shall be conducted by an arbitrator having a
                        law degree and prior experience as an arbitrator and
                        shall include a written record of the arbitration
                        hearing. The parties reserve the right to object to any
                        individual who shall be employed by or affiliated with a
                        competing organization or entity. An award of
                        arbitration may be confirmed in a court of competent
                        jurisdiction.{" "}
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong>12. ENTIRE AGREEMENT</strong>
                      </h5>
                      <p style={ParagraphsStyle}>
                        <a name="_GoBack" /> These terms and conditions together
                        with any documents expressly referred to in them,
                        contain the entire Agreement between us relating to the
                        subject matter covered and supersede any previous
                        Agreements, arrangements, undertakings or proposals,
                        written or oral: between us in relation to such matters.
                        No oral explanation or oral information given by any
                        party shall alter the interpretation of these terms and
                        conditions. In agreeing to these terms and conditions,
                        you have not relied on any representation other than
                        those expressly stated in these terms and conditions and
                        you agree that you shall have no remedy in respect of
                        any misrepresentation, which has not been made expressly
                        in this Agreement.{" "}
                      </p>
                    </div>

                    <div>
                      <h5 style={headerStyle}>
                        <strong style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
                          HIPAA CONFIDENTIALITY POLICY
                        </strong>
                      </h5>

                      <p style={ParagraphsStyle}>
                        "NEURAL IT LLC." agree to maintain the confidentiality
                        of 'you or your client' information and affairs. All
                        records containing your client names, addresses and
                        other information can be surrendered upon termination of
                        service; upon request. Except as required in the
                        performance of services hereunder, "NEURAL IT LLC."
                        shall not, during the term of service or after
                        termination, use or disclose any confidential or
                        proprietary information of 'you or your client', or
                        Client's patients, without first obtaining the consent
                        of you and, where appropriate, your client and patient.
                        In addition, "NEURAL IT LLC." agrees to maintain the
                        confidentiality of all you and your client information
                        and affairs. To the extent that "NEURAL IT LLC." an
                        Company may qualify as a " business associate" as
                        defined by the Health Insurance Portability and
                        Accountability Act of 1996 ("HIPAA"), and privacy
                        regulations published by the U.S. Department of Health
                        and Human Services contained at 45 CFR §§ 160 and 164
                        ("HIPAA Regulations"), which may be periodically revised
                        or amended, and other applicable laws, Employee and
                        Company agree to protect and provide for the privacy and
                        security of Protected Health Information ("PHI"), as
                        defined by HIPAA. The parties agree as follows:
                      </p>

                      <ol type="a">
                        <li>
                          <p style={ParagraphsStyle}>
                            "NEURAL IT LLC." and or/agents shall use appropriate
                            safeguards to prevent the use and/or disclosure of
                            all PHI related to patients, patients' family
                            members, your clients' employees, your Company's
                            employees and other healthcare providers - made
                            available by or obtained from Patient, Client or
                            Company.
                          </p>
                        </li>
                        <li>
                          <p style={ParagraphsStyle}>
                            "NEURAL IT LLC." disclosure of PHI shall be limited
                            to only those purposes that are necessary to perform
                            its service obligations and specifically detailed in
                            "NEURAL IT LLC.'s" job responsibilities, unless
                            otherwise agreed by the Parties.
                          </p>
                        </li>
                        <li>
                          <p style={ParagraphsStyle}>
                            "NEURAL IT LLC." shall not:
                            <ol type="i">
                              <li>
                                <p style={ParagraphsStyle}>
                                  Use or further disclose any PHI except as
                                  provided with prior written approval of
                                  Company and Client; or
                                </p>
                              </li>
                              <li>
                                <p style={ParagraphsStyle}>
                                  Use or further disclose any PHI in a manner
                                  that would violate the provision of HIPAA or
                                  its regulations. "NEURAL IT LLC." shall
                                  immediately report to you or your client in a
                                  timely manner any unauthorised use or disclose
                                  of PHI of which the "NEURAL IT LLC." become
                                  aware;
                                </p>
                              </li>
                            </ol>
                          </p>
                        </li>

                        <li>
                          <p style={ParagraphsStyle}>
                            <span >Data Retention and Deletion Policy</span>
                          </p>
                          <ol type="i">
                            <li>
                              <p style={ParagraphsStyle}>
                                <span >All Protected Health Information (PHI) maintained by "NEURAL IT LLC." will be archived after one year of inactivity unless otherwise mandated by applicable laws or contractual obligations.</span>
                              </p>
                            </li>
                            <li>
                              <p style={ParagraphsStyle}>
                                <span >PHI will be permanently deleted after three years from the date of collection or last use, whichever is later, unless required otherwise by law or specific agreements.</span>
                              </p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <p style={ParagraphsStyle}>
                            Upon termination service, "NEURAL IT LLC." shall
                            return all PHI that "NEURAL IT LLC." maintains in
                            any form and retain no copies of such PHI without
                            the prior written approval of you and your client or
                            else "NEURAL IT LLC." shall destroy all PHI,
                            regardless of whether its form is paper or
                            electronic.
                          </p>
                        </li>
                      </ol>

                      <p style={ParagraphsStyle}>
                        This provision is intended only to outline the "NEURAL
                        IT LLC.'s" general duties as required by HIPAA. "NEURAL
                        IT LLC." recognizes that they are fully subject to all
                        provisions of HIPAA, regardless of whether these
                        provisions are outline in the above provision. This
                        HIPAA provision shall survive the termination of this
                        Agreement.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    className="sign_up_submit"
                    style={{
                      display: "inline-block",
                      margin: "0 auto",
                      width: "100px",
                      backgroundColor: "#0098ca",
                      border: "none",
                      borderRadius: "12px",
                      padding: "10px",
                    }}
                    onClick={termsandCondition}
                  >
                    <span
                      className="indicator-label"
                      style={{
                        color: "#FFFFFF",
                        fontSize: "14px",
                        fontFamily: "Open Sans, sans-serif",
                      }}
                    >
                      <b>I Agree</b>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};
