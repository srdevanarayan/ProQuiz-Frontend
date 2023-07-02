import React from "react";
import "../Component CSS/dashboard.css";
import Navbar from "./Navbar";
import SelectRole from "./SelectRoles";
const Dashboard = () => {
  return (
    <>
      <Navbar />

      <SelectRole />
    </>
  );
};

export default Dashboard;
