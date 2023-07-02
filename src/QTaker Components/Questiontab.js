import React from "react";

const Questiontab = ({ quiz, checkQuizStatus }) => {
  return (
    <div className="quiztakerquiztab">
      <p>{quiz.name}</p>
      <p
        style={{
          fontSize: "18px",
          padding: "3px",
          borderRadius: "10px",
          fontStyle: "italic",
        }}
      >
        {quiz.code}
      </p>
      <p
        style={{
          fontSize: "14px",
          border: "2px solid black",
          padding: "3px",
          borderRadius: "10px",
          margin: "5px 0px",
        }}
      >
        {quiz.type}
      </p>
      <button
        style={{ alignSelf: "center", width: "100%", marginTop: "5px" }}
        className="qtakerbut"
        onClick={() => checkQuizStatus(quiz.quizid)}
      >
        Start
      </button>
    </div>
  );
};

export default Questiontab;
