import React from "react";
import { useState } from "react";
import Popup from "reactjs-popup";
import "../Component CSS/popupstyle.css";
import LoadingOverlay from "../LoadingOverlay";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
const QuestionComponent = ({
  qid,
  passedquestion,
  passedoption1,
  passedoption2,
  passedoption3,
  passedoption4,
  passedanswer,
  deleteFunction,
  quizid,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(
    "You already rated this question!"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Getting quizzes...");
  const [isDirty, setIsDirty] = useState(false);
  const [editQuestionEnabled, setEditQuestionEnabled] = useState(false);
  const [showSaveCancel, setShowSaveCancel] = useState(false);
  const [question, setQuestion] = useState(passedquestion);
  const [option1, setOption1] = useState(passedoption1);
  const [option2, setOption2] = useState(passedoption2);
  const [option3, setOption3] = useState(passedoption3);
  const [option4, setOption4] = useState(passedoption4);
  const [selectedOption, setSelectedOption] = useState(
    passedanswer === passedoption1
      ? "option1"
      : passedanswer === passedoption2
      ? "option2"
      : passedanswer === passedoption3
      ? "option3"
      : passedanswer === passedoption4
      ? "option4"
      : ""
  );

  const editQuestion = () => {
    setEditQuestionEnabled(true);
    setShowSaveCancel(true);
  };
  const saveEditQuestion = async () => {
    setLoadingMessage("Editing question...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.put(
        "/question/edit",
        JSON.stringify({
          quizid: quizid,
          qid: qid,
          question: question,
          options: [option1, option2, option3, option4],
          answer: selectedOption,
        })
      );
      setEditQuestionEnabled(false);
      setShowSaveCancel(false);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };
  const CancelEditQuestion = () => {
    setQuestion(passedquestion);
    setOption1(passedoption1);
    setOption2(passedoption2);
    setOption3(passedoption3);
    setOption4(passedoption4);
    setSelectedOption(
      passedanswer === option1
        ? "option1"
        : passedanswer === option2
        ? "option2"
        : passedanswer === option3
        ? "option3"
        : passedanswer === option4
        ? "option4"
        : ""
    );
    setIsDirty(false);
    setEditQuestionEnabled(false);
    setShowSaveCancel(false);
  };

  const deleteQuestion = () => {
    deleteFunction(qid);
  };

  return (
    <>
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null}{" "}
      <Popup
        open={popup}
        position="right center"
        onClose={() => setPopup(false)}
      >
        <div>{popupMessage}</div>
      </Popup>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label style={{ width: "100%" }}>
          <textarea
            style={{
              width: "100%",
              height: "50px",
              textAlign: "center",
              marginBottom: "10px",
              borderRadius: "30px",
              border: "2px solid rgb(98, 11, 169)",
              padding: "10px",
              fontFamily: "Montserrat, sans-serif",
            }}
            placeholder="Question"
            required
            disabled={!editQuestionEnabled}
            type="text"
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);
              setIsDirty(true);
            }}
          />
        </label>
        <br />
        <div className="optionsrow" style={{ width: "100%" }}>
          <label>
            <input
              disabled={!editQuestionEnabled}
              type="radio"
              name="option"
              value={option1}
              checked={selectedOption === "option1" ? "checked" : null}
              onChange={(event) => {
                setSelectedOption(event.target.value);
                setOption1(event.target.value);
                setIsDirty(true);
              }}
            />
            <input
              placeholder="Option 1"
              required
              disabled={!editQuestionEnabled}
              type="text"
              value={option1}
              onChange={(event) => {
                setOption1(event.target.value);
                setIsDirty(true);
              }}
            />
          </label>
          <br />
          <label>
            <input
              disabled={!editQuestionEnabled}
              type="radio"
              name="option"
              value={option2}
              checked={selectedOption === "option2" ? "checked" : null}
              onChange={(event) => {
                setSelectedOption(event.target.value);
                setOption2(event.target.value);
                setIsDirty(true);
              }}
            />
            <input
              placeholder="Option 2"
              required
              disabled={!editQuestionEnabled}
              type="text"
              value={option2}
              onChange={(event) => {
                setOption2(event.target.value);
                setIsDirty(true);
              }}
            />
          </label>
        </div>
        <br />
        <div className="optionsrow">
          <label>
            <input
              disabled={!editQuestionEnabled}
              type="radio"
              name="option"
              value={option3}
              checked={selectedOption === "option3" ? "checked" : null}
              onChange={(event) => {
                setSelectedOption(event.target.value);
                setOption3(event.target.value);
                setIsDirty(true);
              }}
            />
            <input
              placeholder="Option 3"
              required
              disabled={!editQuestionEnabled}
              type="text"
              value={option3}
              onChange={(event) => {
                setOption3(event.target.value);
                setIsDirty(true);
              }}
            />
          </label>
          <br />
          <label>
            <input
              disabled={!editQuestionEnabled}
              type="radio"
              name="option"
              value={option4}
              checked={selectedOption === "option4" ? "checked" : null}
              onChange={(event) => {
                setSelectedOption(event.target.value);
                setOption4(event.target.value);
                setIsDirty(true);
              }}
            />
            <input
              placeholder="Option 4"
              required
              disabled={!editQuestionEnabled}
              type="text"
              value={option4}
              onChange={(event) => {
                setOption4(event.target.value);
                setIsDirty(true);
              }}
            />
          </label>
        </div>
        <br />
        <div
          className="createquizaddquesbutgrp"
          style={{ marginBottom: "20px" }}
        >
          {showSaveCancel ? (
            <>
              <button
                style={{ width: "130px" }}
                disabled={
                  !isDirty ||
                  !(
                    question &&
                    option1 &&
                    option2 &&
                    option3 &&
                    option4 &&
                    selectedOption
                  )
                }
                onClick={saveEditQuestion}
              >
                Save
              </button>
              <button style={{ width: "130px" }} onClick={CancelEditQuestion}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button style={{ width: "130px" }} onClick={editQuestion}>
                Edit
              </button>
              <button style={{ width: "130px" }} onClick={deleteQuestion}>
                Delete
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default QuestionComponent;
