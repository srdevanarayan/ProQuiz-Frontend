import React from "react";
import IndividualQuestions from "./IndividualQuestions";
import "../Component CSS/qbquestion.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const QBQuestion = ({
  qbquestions = [],
  pageNumber,
  changePageNumber,
  endOfResults,
  handleVerify,
}) => {
  /*   console.log(qbquestions.length);
  console.log(qbquestions); */

  const nextPage = () => {
    if (endOfResults) {
      return null;
    } else {
      changePageNumber(pageNumber + 1);
    }
  };

  const prvsPage = () => {
    if (pageNumber === 1) {
      return null;
    } else {
      changePageNumber(pageNumber - 1);
    }
  };
  return (
    <>
      <section className="qbquestionContainer" style={{ marginTop: "11px" }}>
        {qbquestions?.length == 0 ? (
          <p style={{ marginTop: "46px" }}>No questions</p>
        ) : null}
        {qbquestions.map((question) => {
          return (
            <IndividualQuestions
              question={question.question}
              key={question._id}
              options={question.options}
              answer={question.answer}
              rating={question.rating}
              usersrated={question.usersrated}
              verified={question.verified}
              qid={question._id}
              rated={question.rated}
              reported={question.reported}
              handleVerify={handleVerify}
            />
          );
        })}

        <center>
          <div className="bottomnav" style={{ margin: "1" }}>
            <FontAwesomeIcon icon={faArrowLeft} onClick={prvsPage} />
            {pageNumber}
            <FontAwesomeIcon
              disabled={endOfResults}
              onClick={nextPage}
              icon={faArrowRight}
            />
          </div>
        </center>
      </section>
    </>
  );
};

export default QBQuestion;
