import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <center>
        <div className="homelogo show"></div>
        <p style={{ lineHeight: "30px" }}>
          You are not a question validator! You can request to be a question
          validator with necessary documents by contacting us via email:
          admin@proquiz.com
        </p>
        <button
          className="notfoundbutton"
          style={{
            padding: "0.5rem",
            background: "rgb(98, 11, 169)",
            color: "#fff",
            borderRadius: "30px",
            border: "none",
            marginTop: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard", { replace: "/dashboard" })}
        >
          Return to Home
        </button>
      </center>
    </>
  );
};

export default Unauthorized;
