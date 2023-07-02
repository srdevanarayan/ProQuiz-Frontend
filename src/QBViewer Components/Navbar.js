import React from "react";
import DropDown from "./DropDown";
import "../Component CSS/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Navbar = () => {
  const navigate = useNavigate();
  const goback = () => {
    navigate("/dashboard", { replace: true });
  };
  return (
    <nav className="dashboard-nav">
      <div className="logo-dashboard"></div>
      <div className="backhome" onClick={goback}>
        Back to Dashboard
      </div>
      <DropDown />
    </nav>
  );
};

export default Navbar;
