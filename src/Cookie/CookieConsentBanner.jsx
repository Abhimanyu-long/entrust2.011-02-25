import React, { useState } from "react";

const CookieConsentBanner = ({ onAccept, onSettings }) => {
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    onAccept();
    setVisible(false);
  };

  const handleSettings = () => {
    onSettings();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, width: "100%", background: "#f3f3f3", padding: "10px", boxShadow: "0px -2px 5px rgba(0,0,0,0.1)" }}>
      <p>We use cookies to enhance your experience. By clicking "Accept All," you consent to all cookies.</p>
      <button onClick={handleAccept}>Accept All</button>
      <button onClick={handleSettings}>Settings</button>
    </div>
  );
};

export default CookieConsentBanner;
