import React from "react";
import DropDown from "./DropDown";
import { useState } from "react";
const Navbar = () => {
  return (
    <nav className="dashboard-nav">
      <div className="logo-dashboard"></div>
      <DropDown />
    </nav>
  );
};

export default Navbar;
