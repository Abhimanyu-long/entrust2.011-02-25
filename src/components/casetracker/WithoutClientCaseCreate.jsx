import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { useAuth } from '../../../context/AuthContext';


export const WithoutClientCaseCreate = ({ show, handleClose, handleNext }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const { getAllClients } = useAuth();

  const [clientOptions, setClientOptions] = useState([
    { value: 'Client1', label: 'Client 1' },
    { value: 'Client2', label: 'Client 2' },
  ]);


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getAllClients();
        const options = clients.map(client => ({
          value: client.client_id,
          label: client.client_name,
        }));
        setClientOptions(options);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);


  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedClient) {
      handleNext(selectedClient);
    } else {
      alert('Please select a client.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formClientName">
            <Form.Label>Select Client Name</Form.Label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={selectedClient}
              isClearable
              isSearchable
              name="client"
              onChange={handleClientChange}
              options={clientOptions}
            />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit" disabled={!selectedClient}>
            Next
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
