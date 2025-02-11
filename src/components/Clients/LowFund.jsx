import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Card, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

function LowFundNotificationSettings() {
  const [lowFundNotification, setLowFundNotification] = useState(true);
  const [notifyPeriod, setNotifyPeriod] = useState('Daily');
  const [minFundNotification, setMinFundNotification] = useState(0.0);
  const [autoPay, setAutoPay] = useState(true);
  const [minFundAutoPay, setMinFundAutoPay] = useState(0.0);
  const [amountToCharge, setAmountToCharge] = useState(0.0);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Settings Saved");
    alert('Settings saved!');
    
  };

  return (
    <div className="container mt-4">
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0" className="bg-primary text-white">
            <h5 className="mb-0">Low Fund Notification Settings</h5>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="enableLowFundNotification"
                    checked={lowFundNotification}
                    onChange={() => setLowFundNotification(!lowFundNotification)}
                  />
                  <label className="form-check-label" htmlFor="enableLowFundNotification">
                    Enable Low Fund Notification
                  </label>
                </div>

                <div className="form-group">
                  <label>Notify Period:</label>
                  <div>
                    {['Daily', 'Weekly', 'Monthly'].map((period) => (
                      <div className="form-check form-check-inline" key={period}>
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`notify${period}`}
                          value={period}
                          checked={notifyPeriod === period}
                          onChange={() => setNotifyPeriod(period)}
                        />
                        <label className="form-check-label" htmlFor={`notify${period}`}>
                          {period}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Min Fund:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={minFundNotification}
                    onChange={(e) => setMinFundNotification(parseFloat(e.target.value))}
                  />
                </div>

                <hr />

                <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="enableAutoPay"
                  checked={autoPay}
                  onChange={() => setAutoPay(!autoPay)}
                  disabled={clientData?.client_pay_type === "Postpaid"}
                />
                <label className="form-check-label" htmlFor="enableAutoPay">
                  Enable Auto Pay
                </label>
                </div>

                <div className="form-group">
                  <label>Min Fund for Auto Pay:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={minFundAutoPay}
                    onChange={(e) => setMinFundAutoPay(parseFloat(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>Saved Cards:</label>
                  <p className="text-muted">
                    No saved card found. Please add a new card from the <a href="#">Add Fund</a> screen.
                    While making a payment, please select the ‘Save card details for future payments’ checkbox.
                  </p>
                </div>

                <div className="form-group">
                  <label>Amount to Charge:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amountToCharge}
                    onChange={(e) => setAmountToCharge(parseFloat(e.target.value))}
                  />
                </div>

                <Button type="submit" variant="primary" className="mt-3 w-100">
                  Submit
                </Button>
              </form>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}

export default LowFundNotificationSettings;
