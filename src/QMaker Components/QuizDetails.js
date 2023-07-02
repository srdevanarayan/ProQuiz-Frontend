import React from "react";

const QuizDetails = ({
  code,
  name,
  timer,
  status,
  participants,
  responses,
  approvalrequired,
  created,
  questions,
  closePopup,
}) => {
  const date = new Date(created);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return (
    <div className="quizdetails">
      <div className="header">
        <p style={{ fontSize: "28px" }}>{name}</p>{" "}
        <button
          style={{
            padding: "10px 15px",
            margin: "10px",
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "rgb(98, 11, 169)",
            color: "white",
            borderRadius: "30px",
            border: "2px solid rgb(98, 11, 169)",
          }}
          onClick={closePopup}
        >
          X
        </button>
      </div>
      <div className="quizdetailsrest">
        <div className="quizdetailscol" style={{ marginRight: "50px" }}>
          <p style={{ fontSize: "18px", fontStyle: "italic" }}>Code : {code}</p>
          <br />
          <p
            style={{
              fontSize: "16px",
              border: "2px solid black",
              padding: "3px 10px",
              borderRadius: "10px",
              marginTop: "7px",
              marginBottom: "7px",
              width: "100px",
              textAlign: "center",
            }}
          >
            {" "}
            {status}
          </p>
          <br />
          <p style={{ fontSize: "18px" }}>Timer : {timer}</p>
        </div>
        <div className="quizdetailscol" style={{ marginLeft: "50px" }}>
          <p style={{ fontSize: "18px" }}>
            Approval Required : {approvalrequired === true ? "true" : "false"}
            <br />
            Participants : {participants}
            <br />
            Reponses : {responses}
            <br />
            Created :{`${day}/${month}/${year}`}
          </p>
        </div>
      </div>
      <div className="quizdetailsquestions">
        {questions.map((item) => {
          return (
            <div
              class="quizdetailsindividualquestions"
              style={{ width: "100%" }}
            >
              <p className="quizdetailsindividualquestionsp">{item.question}</p>
              <div className="quizdetailsquestionsoptions">
                {item.options.map((opt) => (
                  <p
                    className={
                      item.answer === opt
                        ? "quizdetailsquestionsansweroption"
                        : null
                    }
                  >
                    {opt}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizDetails;
