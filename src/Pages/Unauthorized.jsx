// src/Pages/Unauthorized.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/'); // Redirect to the dashboard or any other accessible route
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Access Denied</h1>
      <p>You do not have the necessary permissions to view this page.</p>
      <button onClick={handleGoBack} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Go Back to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;
