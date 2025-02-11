import React from 'react'

export const AllocateCase = ({ availableFunds, neededFunds, mainCase, transactionLogs }) => {
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3>Total Available Funds: $501</h3>
          <h4>Approximate Fund Needed: $204</h4>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="thead-light">
                <tr>
                  <th>Case ID</th>
                  <th>Case Title</th>
                  <th>Project Name</th>
                  <th>Rate/Min</th>
                  <th>Estimate</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Allocation State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>12345</td>
                  <td>Example Case Title</td>
                  <td>Example Project</td>
                  <td>500</td>
                  <td>25 hours</td>
                  <td>John Doe</td>
                  <td>In Progress</td>
                  <td>$12,500</td>
                  <td>Allocated</td>
                  <td>De-Allocate</td>
                </tr>
              </tbody>
            </table>

            {/* Transaction Log Table */}
            <h4>Transaction Log:</h4>
            <table className="table table-striped table-bordered align-middle">
              <thead className="thead-light">
                <tr>
                  <th>Case ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Payment Source</th>
                  <th>Transaction Type</th>
                  <th>Date/Time</th>
                </tr>
              </thead>
              <tbody>
                  <tr>
                    <td>12345</td>
                    <td>vinod</td>
                    <td>$521</td>
                    <td>description</td>
                    <td>$523</td>
                    <th>Transaction Type</th>
                    <th>Date/Time</th>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
