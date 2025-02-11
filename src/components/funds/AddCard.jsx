import React, { useState } from "react";

export const AddCard = ({ onClose }) => {
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
    saveCard: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here, you can store the data or send it to an API
    // console.log("Form Data Submitted:", formData);

    // Example of sending to an API
    /*
    try {
      const response = await fetch('/api/save-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log("Card saved successfully", result);
      // Handle success
    } catch (error) {
      console.error("Error saving card:", error);
      // Handle error
    }
    */

    // Close modal after submission
    onClose();
  };

  return (
    <>
      <div
        className="modal fade show"
        id="nit_modal_new_card"
        tabIndex="-1"
        style={{ display: "block", background: "rgba(0, 0, 0, 0.5)", margin: "0px" }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered mw-650px">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Card</h2>
              <div className="btn btn-sm btn-icon btn-active-color-primary" data-bs-dismiss="modal">
                <i className="nit-dt nit-cross fs-1" onClick={onClose}>
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
              </div>
            </div>
            <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
              <form
                id="nit_modal_new_card_form"
                className="form fv-plugins-bootstrap5 fv-plugins-framework"
                onSubmit={handleSubmit}
              >
                <div className="d-flex flex-column mb-7 fv-row fv-plugins-icon-container">
                  <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                    <span className="required">Name On Card</span>
                    <span className="ms-1" data-bs-toggle="tooltip" aria-label="Specify a card holder's name">
                      <i className="nit-dt nit-information-5 text-gray-500 fs-6">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-solid"
                    placeholder="Name"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex flex-column mb-7 fv-row fv-plugins-icon-container">
                  <label className="required fs-6 fw-semibold form-label mb-2">Card Number</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="Enter card number"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                    <div className="position-absolute translate-middle-y top-50 end-0 me-5">
                      <img src="src/assets/media/widgets/visa.png" alt="" className="h-25px" />
                      <img src="src/assets/media/widgets/mastercard.png" alt="" className="h-25px" />
                      <img src="src/assets/media/widgets/american-express.png" alt="" className="h-25px" />
                    </div>
                  </div>
                </div>

                <div className="row mb-10">
                  <div className="col-md-8 fv-row">
                    <label className="required fs-6 fw-semibold form-label mb-2">Expiration Date</label>
                    <div className="row fv-row">
                      <div className="col-6">
                        <select
                          name="expirationMonth"
                          className="form-select form-select-solid"
                          value={formData.expirationMonth}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Months</option>
                          <option value="1">January</option>
                          <option value="2">February</option>
                          <option value="3">March</option>
                          <option value="4">April</option>
                          <option value="5">May</option>
                          <option value="6">June</option>
                          <option value="7">July</option>
                          <option value="8">August</option>
                          <option value="9">September</option>
                          <option value="10">October</option>
                          <option value="11">November</option>
                          <option value="12">December</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <select
                          name="expirationYear"
                          className="form-select form-select-solid"
                          value={formData.expirationYear}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 50 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return <option key={year} value={year}>{year}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 fv-row">
                    <label className="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                      <span className="required">CVV</span>
                      <span
                        className="ms-1"
                        data-bs-toggle="tooltip"
                        aria-label="Enter a card CVV code"
                      >
                        <i className="nit-dt nit-information-5 text-gray-500 fs-6">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </span>
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        placeholder="CVV"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                      />
                      <div className="position-absolute translate-middle-y top-50 end-0 me-3">
                        <i className="nit-dt nit-credit-cart fs-2hx">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-stack">
                  <div className="me-5">
                    <label className="fs-6 fw-semibold form-label">Save Card for further billing?</label>
                    <div className="fs-7 fw-semibold text-muted">
                      Card will be auto-charge based on schedule.
                    </div>
                  </div>
                  <label className="form-check form-switch form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="saveCard"
                      checked={formData.saveCard}
                      onChange={handleChange}
                    />
                    <span className="form-check-label fw-semibold text-muted">
                      Save Card
                    </span>
                  </label>
                </div>

                <div className="text-center pt-15">
                  <button
                    type="reset"
                    id="nit_modal_new_card_cancel"
                    className="btn btn-light me-3"
                    onClick={onClose}
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    id="nit_modal_new_card_submit"
                    className="btn btn-primary"
                  >
                    <span className="indicator-label">Submit</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
