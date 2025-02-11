import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './../../assets/css/AutoChargeHistory.css';

const AutoChargeHistory = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [globalFilter, setGlobalFilter] = useState("");
    const [charges, setCharges] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    useEffect(() => {
        const fetchData = [
            { date: 'July 01, 2024', card: '**** 1679', description: 'Auto Charge Scheduled', amount: '$123.79' },
            { date: 'June 27, 2024', card: '**** 1679', description: 'Auto Charge Scheduled', amount: '$123.79' },
            { date: 'June 20, 2024', card: '**** 1679', description: 'Auto Charge Scheduled', amount: '$123.79' },
            { date: 'June 15, 2024', card: '**** 1679', description: 'Auto Charge Scheduled', amount: '$123.79' },
        ];
        setCharges(fetchData);
    }, []);

    const renderReceiptButton = () => {
        return <button className="p-button p-button-sm">View</button>;
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const header = (
        <div className="table-header">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className="p-inputtext-sm"
                />
            </span>
        </div>
    );

    return (
        <div className="mt-4 m-3">
            <div className="card">
                <div className="card-header card-header-stretch" style={{
                    backgroundColor: "#0098CA",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}>
                    <div className="card-title">
                        <h3 style={{ color: "#ffffff", fontSize: "1.2rem" }}>Auto Charge History</h3>
                    </div>
                </div>

                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel>
                        <DataTable
                            value={charges}
                            paginator
                            rows={rows}
                            rowsPerPageOptions={[5, 10, 20]}
                            totalRecords={charges.length}
                            first={first}
                            onPage={onPageChange}
                            sortField="date"
                            sortOrder={-1}
                            globalFilter={globalFilter}
                            header={header}
                            className="p-datatable-striped p-datatable-gridlines"
                            emptyMessage="No charges found."
                        >
                            <Column field="date" header="Date" sortable style={{ minWidth: '150px' }}></Column>
                            <Column field="card" header="Card" sortable style={{ minWidth: '150px' }}></Column>
                            <Column field="description" header="Description" sortable style={{ minWidth: '250px' }}></Column>
                            <Column field="amount" header="Amount $" sortable style={{ minWidth: '150px' }}></Column>
                            <Column body={renderReceiptButton} header="Receipt" style={{ minWidth: '150px' }}></Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel>
                        <DataTable
                            value={charges}
                            paginator
                            rows={rows}
                            rowsPerPageOptions={[5, 10, 20]}
                            totalRecords={charges.length}
                            first={first}
                            onPage={onPageChange}
                            sortField="date"
                            sortOrder={-1}
                            globalFilter={globalFilter}
                            header={header}
                            className="p-datatable-striped p-datatable-gridlines"
                            emptyMessage="No charges found."
                        >
                            <Column field="date" header="Date" sortable style={{ minWidth: '150px' }}></Column>
                            <Column field="card" header="Card" sortable style={{ minWidth: '150px' }}></Column>
                            <Column field="description" header="Description" sortable style={{ minWidth: '250px' }}></Column>
                            <Column field="amount" header="Amount" sortable style={{ minWidth: '150px' }}></Column>
                            <Column body={renderReceiptButton} header="Receipt" style={{ minWidth: '150px' }}></Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel>
                        <DataTable
                            value={charges}
                            paginator
                            rows={rows}
                            rowsPerPageOptions={[5, 10, 20]}
                            totalRecords={charges.length}
                            first={first}
                            onPage={onPageChange}
                            sortField="date"
                            sortOrder={-1}
                            globalFilter={globalFilter}
                            header={header}
                            className="p-datatable-striped p-datatable-gridlines"
                            emptyMessage="No charges found."
                        >
                            <Column field="date" header="Date" sortable style={{ minWidth: '150px' }}></Column>
                            <Column field="card" header="Card" sortable style={{ minWidth: '150px' }}></Column>
                            <Column field="description" header="Description" sortable style={{ minWidth: '250px' }}></Column>
                            <Column field="amount" header="Amount" sortable style={{ minWidth: '150px' }}></Column>
                            <Column body={renderReceiptButton} header="Receipt" style={{ minWidth: '150px' }}></Column>
                        </DataTable>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};

export default AutoChargeHistory;
