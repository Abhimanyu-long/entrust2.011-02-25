import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./components/startlogin/Register";
import Login from "./components/startlogin/Login";
import { Dashboard } from "./Pages/Dashboard";
import { AuthProvider } from "../context/AuthContext";
import { VerifyEmail } from "./Pages/VerifyEmail";
import { UserAgreement } from "./components/useragreement/UserAgreement";
import { TermsAndCondition } from "./components/useragreement/TermsAndCondition";
import ForgotPassword from "./components/startlogin/ForgotPassword";
import Protected from "../services/Protected";
import Unauthorized from "./Pages/Unauthorized"; 
import "@fontsource/open-sans/400.css";
import SuccessCard from "./components/models/Success";
import { ReferralAgreement } from "./components/useragreement/ReferralAgreement";



function App() {
  // Listen for storage events to update sessionStorage
  useEffect(() => {
    const handleStorageEvent = (event) => {
      if (event.key === "sessionSync" && event.newValue) {
        const sessionData = JSON.parse(event.newValue);
        if (sessionData.token) {
          sessionStorage.setItem("token", sessionData.token);
        }
        if (sessionData.userData) {
          sessionStorage.setItem("user_data", sessionData.userData);
        }
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    // Manual synchronization on load
    const sessionSyncData = localStorage.getItem("sessionSync");
    if (sessionSyncData) {
      const sessionData = JSON.parse(sessionSyncData);
      if (sessionData.token) {
        sessionStorage.setItem("token", sessionData.token);
      }
      if (sessionData.userData) {
        sessionStorage.setItem("user_data", sessionData.userData);
      }
    }

    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path="/useragreement" element={<UserAgreement />} />
        <Route path="/termsandcondition" element={<TermsAndCondition />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/referralagreement" element={<ReferralAgreement />} />
    
        {/* Unauthorized route */}
        <Route path="/not-authorized" element={<Unauthorized />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <Protected component={Dashboard} componentName="Dashboard" />
          }
        />
        <Route
          path="/success"
          element={
            <Protected
              component={SuccessCard}
              componentName="AutoChargeHistory"
            />
          }
        />

      </Routes>
    </AuthProvider>
  );
}

export default App;
