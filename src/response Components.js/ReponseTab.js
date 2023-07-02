import React from "react";

const ReponseTab = ({ name, email, score, viewResponse }) => {
  return (
    <>
      <div onClick={() => viewResponse(email)} className="responsetab">
        <p style={{ fontSize: "20px" }}>{name}</p>
        <p style={{ fontSize: "18px", fontStyle: "italic" }}>{email}</p>
        <center>
          <p
            style={{
              fontSize: "18px",
              border: "2px solid rgb(98, 11, 169)",
              borderRadius: "30px",
              padding: "2px 10px",
              marginTop: "5px",
              backgroundColor: "rgb(98, 11, 169)",
              color: "white",
            }}
          >
            Score : {score}
          </p>
        </center>
      </div>
    </>
  );
};

export default ReponseTab;
