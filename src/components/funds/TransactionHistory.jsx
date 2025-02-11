import React, { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    useEffect(() => {
        // Simulated data fetching for transactions
        const fetchData = [
            { date: 'July 01, 2024', transactionId: 'TX12345', description: 'Payment Received', amount: '$200.00', status: 'Completed' },
            { date: 'June 27, 2024', transactionId: 'TX12344', description: 'Refund Issued', amount: '-$50.00', status: 'Refunded' },
            { date: 'June 20, 2024', transactionId: 'TX12343', description: 'Payment Received', amount: '$150.00', status: 'Completed' },
            { date: 'June 15, 2024', transactionId: 'TX12342', description: 'Chargeback', amount: '-$100.00', status: 'Chargeback' },
        ];
        setTransactions(fetchData);
    }, []);

    // Function to render the "Details" button and show dialog with transaction details on click
    const renderDetailsButton = (rowData) => {
        return (
            <button
                className="p-button p-button-sm p-button-outlined "
                onClick={() => {
                    setSelectedTransaction(rowData);
                    setIsDialogVisible(true);
                }}
            >
                Details
            </button>
        );
    };

    return (
        <div className="card bg-light">
            <h3>Transaction History</h3>
            <DataTable
                value={transactions}
                paginator
                rows={5}
                className="p-datatable-striped p-datatable-gridlines bg-light"
                emptyMessage="No transactions found."
            >
                <Column field="date" header="Date" sortable style={{ minWidth: '150px' }}></Column>
                <Column field="transactionId" header="Transaction ID" sortable style={{ minWidth: '150px' }}></Column>
                <Column field="description" header="Description" sortable style={{ minWidth: '250px' }}></Column>
                <Column field="amount" header="Amount $" sortable style={{ minWidth: '150px' }}></Column>
                <Column field="status" header="Status" sortable style={{ minWidth: '150px' }}></Column>
                <Column body={renderDetailsButton} header="Details" style={{ minWidth: '150px' }}></Column>
            </DataTable>

            {/* Transaction Details Dialog */}
            <Dialog
                header="Transaction Details"
                visible={isDialogVisible}
                style={{ width: '450px' }}
                onHide={() => setIsDialogVisible(false)}
                footer={<button onClick={() => setIsDialogVisible(false)} className="p-button">Close</button>}
                modal
            >
                {selectedTransaction ? (
                    <div className="bg-light">
                        <p><strong>Date:</strong> {selectedTransaction.date}</p>
                        <p><strong>Transaction ID:</strong> {selectedTransaction.transactionId}</p>
                        <p><strong>Description:</strong> {selectedTransaction.description}</p>
                        <p><strong>Amount:</strong> {selectedTransaction.amount}</p>
                        <p><strong>Status:</strong> {selectedTransaction.status}</p>
                    </div>
                ) : (
                    <p>Loading details...</p>
                )}
            </Dialog>
        </div>
    );
};

export default TransactionHistory;
