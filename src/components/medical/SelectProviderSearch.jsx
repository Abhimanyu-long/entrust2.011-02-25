import React, { useState } from 'react'
import { Form } from "react-bootstrap";

export const SelectProviderSearch = () => {
    const [formData, setFormData] = useState({
        drFacility: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        fax: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement your search functionality here
        // console.log(formData);
    };

    const handleClear = () => {
        setFormData({
            drFacility: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            fax: ''
        });
    };
    return (
        <>
            <Form>
                <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                        {/* Dr/Facility */}
                        <div className="col-md-6">
                            <label htmlFor="drFacility">Dr/Facility:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="drFacility"
                                name="drFacility"
                                value={formData.drFacility}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Address */}
                        <div className="col-md-6">
                            <label htmlFor="address">Address:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        {/* City */}
                        <div className="col-md-6">
                            <label htmlFor="city">City:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>

                        {/* State */}
                        <div className="col-md-6">
                            <label htmlFor="state">State:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        {/* ZIP */}
                        <div className="col-md-6">
                            <label htmlFor="zip">ZIP:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="zip"
                                name="zip"
                                placeholder="xxxxx or xxxxx-xxxx"
                                value={formData.zip}
                                onChange={handleChange}
                            />
                            <small className="form-text text-muted">
                                Format xxxxx or xxxxx-xxxx
                            </small>
                        </div>

                        {/* Phone */}
                        <div className="col-md-6">
                            <label htmlFor="phone">Phone:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                name="phone"
                                placeholder="xxx-xxx-xxxx"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <small className="form-text text-muted">
                                Format xxx-xxx-xxxx
                            </small>
                        </div>
                    </div>

                    <div className="form-group row">
                        {/* FAX */}
                        <div className="col-md-6">
                            <label htmlFor="fax">FAX:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fax"
                                name="fax"
                                placeholder="(xxx) xxx-xxxx"
                                value={formData.fax}
                                onChange={handleChange}
                            />
                            <small className="form-text text-muted">
                                Format (xxx) xxx-xxxx
                            </small>
                        </div>
                    </div>

                    <div className="form-group mt-3">
                        <p>Enter At Least One Search Criterion: Dr/Facility, Zip, Phone</p>
                    </div>

                    {/* Buttons */}
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary mr-2">
                            Search for Provider
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClear}
                        >
                            Clear Form
                        </button>
                    </div>
                </form>
            </Form>

            {/* dynamic table will come */}

            <div className="card">
                <div className="tab-content">
                    <div
                        id="nit_billing_months"
                        className="card-body p-0 tab-pane fade active show"
                        role="tabpanel"
                        aria-labelledby="nit_billing_months"
                    >
                        <div className="table-responsive">
                            <table className="table table-row-bordered align-middle gy-4 gs-9">
                                <thead className="border-bottom border-gray-200 fs-6 text-gray-600 fw-bold bg-light bg-opacity-75">
                                    <tr>
                                        <th style={{ width: "auto" }}>Id</th>
                                        <th style={{ width: "auto" }}>Name</th>
                                        <th style={{ width: "auto" }}>Address</th>
                                        <th style={{ width: "auto" }}>City</th>
                                        <th style={{ width: "auto" }}>State</th>
                                        <th style={{ width: "auto" }}>Zip</th>
                                        <th style={{ width: "auto" }}>Phone</th>
                                        <th style={{ width: "auto" }}>Fax</th>
                                        <th style={{ width: "auto" }}>Action</th>
                                    </tr>
                                </thead>

                                <tbody className="fw-semibold text-gray-600">
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No Search Provider available.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
