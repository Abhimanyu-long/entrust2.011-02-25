import React from "react";
import loader from "../../assets/Entrust_Loader.gif"; // Update this path as needed

const Loader = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.8)", // Light overlay background
      zIndex: 9999, // Ensure it overlays all other elements
    }}
  >
    <img style={{ height: "20vh" }} src={loader} alt="Loading..." />
  </div>
);

export default Loader;
