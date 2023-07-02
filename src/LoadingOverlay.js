import React from "react";
import "./Component CSS/loading.css";

function Loading(props) {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <div className="loading-text">{props.text || "Loading..."}</div>
    </div>
  );
}

export default Loading;
