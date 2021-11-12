import React from "react";
import banner from "../../assets/shockbyte_banner.webp";
import "./brading.style.css";

function Branding() {
  return (
    <div className="img-container">
      <img src={banner} alt="ShockByte logo" width="300px" height="auto" />
      <h1>Server Dashboard</h1>
    </div>
  );
}

export default Branding;
