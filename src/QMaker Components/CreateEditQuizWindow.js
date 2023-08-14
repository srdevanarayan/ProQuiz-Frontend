import React, { useEffect } from "react";
import { useState } from "react";
import QuestionComponent from "./QuestionComponent";
import { faHourglass1 } from "@fortawesome/free-solid-svg-icons";
import LoadingOverlay from "../LoadingOverlay";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import Popup from "reactjs-popup";
import QBViewer from "./QBViewer";
const CreateEditQuizWindow = ({
  quizDetails,
  quizQuestions,
  triggerRefresh,
}) => {
  const [popup, setPopup] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [newQuiz, setNewQuiz] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Getting quizzes...");
  const [quizid, setQuizid] = useState();
  const [quizName, setQuizName] = useState("");
  const [approval, setApproval] = useState(false);
  const [timer, setTimer] = useState(0);
  const [addQuestionEnabled, setAddQuestionEnabled] = useState(false);
  const [showAddQuestionWindow, setshowAddQuestionWindow] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [addQuizDetails, setAddQuizDetails] = useState(true);
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [selectedOption, setSelectedOption] = useState();
  const [components, setComponents] = useState([]);
  const deleteQuestion = async (qid) => {
    setLoadingMessage("Deleting question from quiz...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/question/delete",
        JSON.stringify({
          quizid: quizid,
          qid: qid,
        })
      );
      setComponents(components.filter((item) => item.qid !== qid));
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (quizDetails) {
      setAddQuizDetails(true);
      setQuestion("");
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setSelectedOption();
      setshowAddQuestionWindow(false);
      setAddQuestionEnabled(true);
      setNewQuiz(false);
      setIsDirty(false);
      setApproval(false);
      setTimer(0);
      setQuizName();
      setQuizid(quizDetails?.quizid);
      setQuizName(quizDetails?.name);
      setApproval(quizDetails?.approvalrequired);
      setTimer(quizDetails?.timer);
    }
  }, [quizDetails]);
  useEffect(() => {
    if (quizQuestions) {
      setComponents((prevComponents) => {
        let newComponents = [];
        quizQuestions.forEach((question) => {
          newComponents.push({
            qid: question.qid,
            question: question.question,
            option1: question.options[0],
            option2: question.options[1],
            option3: question.options[2],
            option4: question.options[3],
            selectedOption: question.answer,
          });
        });
        return newComponents;
      });
    } else {
      setComponents([]);
    }
  }, [quizQuestions]);

  const addCustomQuestion = () => {
    setshowAddQuestionWindow(true);
    setAddQuestionEnabled(false);
  };

  const handleAddQuestion = async (event) => {
    event.preventDefault();
    setLoadingMessage("Adding question to quiz...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/question/add",
        JSON.stringify({
          quizid: quizid,
          question: question,
          options: [option1, option2, option3, option4],
          answer: selectedOption,
        })
      );
      setComponents([
        ...components,
        {
          qid: response.data.qid,
          question: question,
          option1: option1,
          option2: option2,
          option3: option3,
          option4: option4,
          selectedOption: selectedOption,
        },
      ]);
      setQuestion("");
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setSelectedOption();
      setshowAddQuestionWindow(false);
      setAddQuestionEnabled(true);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };
  const addQBQuestion = async () => {
    setPopup(true);
  };
  const cancelEditQuizChanges = () => {
    setIsDirty(false);
    setQuizName(quizDetails?.name);
    setApproval(quizDetails?.approvalrequired);
    setTimer(quizDetails?.timer);
  };

  const editQuizDetails = async () => {
    setLoadingMessage("Editing quiz...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.put(
        "/quiz/edit",
        JSON.stringify({
          quizid: quizid,
          name: quizName,
          approvalrequired: approval,
          timer: timer,
        })
      );
      setIsDirty(false);
      setAddQuestionEnabled(true);
      triggerRefresh();
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };
  const createQuiz = async () => {
    setAddQuizDetails(false);
    setLoadingMessage("Creating quiz...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/quiz/create",
        JSON.stringify({
          name: quizName,
          approvalrequired: approval ? "true" : "false",
          timer: timer,
        })
      );
      setQuizid(response.data.quizid);
      setAddQuestionEnabled(true);
      triggerRefresh();
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };

  const closeQbViewer = () => {
    setPopup(false);
  };
  const getQuestionfromQB = (
    qid,
    question,
    option1,
    option2,
    option3,
    option4,
    selectedOption
  ) => {
    setComponents([
      ...components,
      {
        qid: qid,
        question: question,
        option1: option1,
        option2: option2,
        option3: option3,
        option4: option4,
        selectedOption: selectedOption,
      },
    ]);
    setQuestion("");
    setOption1("");
    setOption2("");
    setOption3("");
    setOption4("");
    setSelectedOption();
    setshowAddQuestionWindow(false);
    setAddQuestionEnabled(true);
  };
  return (
    <>
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null}{" "}
      {popup ? (
        <>
          <div className="addqbquestions">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h1
                style={{
                  fontSize: "25px",
                  marginTop: "5px",
                  marginLeft: "10px",
                }}
              >
                Select question from question bank
              </h1>

              <button
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "rgb(98, 11, 169)",
                  color: "white",
                  border: "none",
                }}
                onClick={() => setPopup(false)}
              >
                X
              </button>
            </div>
            <QBViewer
              getQuestionfromQB={getQuestionfromQB}
              closeQbViewer={closeQbViewer}
              quizid={quizid}
            />
          </div>
        </>
      ) : null}
      <div className="createquizwindow">
        <center>
          {newQuiz ? (
            <p className="createquiztitle">Create New Quiz</p>
          ) : (
            <p className="createquiztitle">Edit Quiz</p>
          )}
        </center>
        <form
          className="createquizform"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label>
            Quiz Name :
            <input
              style={{ width: "200px", marginTop: "20px" }}
              required
              type="text"
              value={quizName}
              onChange={(event) => {
                setQuizName(event.target.value);
                let trash = !newQuiz ? setIsDirty(true) : null;
              }}
            />
          </label>
          <br />

          <label>
            Approval required :
            <input
              style={{ width: "20px", height: "20px" }}
              type="checkbox"
              checked={approval}
              onChange={(event) => {
                setApproval(event.target.checked);
                let trash = !newQuiz ? setIsDirty(true) : null;
              }}
            />
          </label>
          <br />
          <label>
            Timer (s) :
            <input
              type="number"
              value={timer}
              onChange={(event) => {
                setTimer(event.target.value);
                let trash = !newQuiz ? setIsDirty(true) : null;
              }}
            />
          </label>

          <br />
          {newQuiz ? (
            <button
              disabled={!quizName || !addQuizDetails}
              type="submit"
              onClick={createQuiz}
              style={{ marginBottom: "30px" }}
            >
              Submit
            </button>
          ) : (
            <>
              <button disabled={!isDirty} onClick={editQuizDetails}>
                Save
              </button>
              <button disabled={!isDirty} onClick={cancelEditQuizChanges}>
                Reset
              </button>
              <button
                style={{ marginBottom: "30px" }}
                onClick={() => {
                  setAddQuestionEnabled(false);
                  setshowAddQuestionWindow(false);
                  setComponents((prevComponents) => {
                    let newComponents = [];
                    return newComponents;
                  });
                  setQuestion("");
                  setOption1("");
                  setOption2("");
                  setOption3("");
                  setOption4("");
                  setSelectedOption();
                  setIsDirty(false);
                  setNewQuiz(true);
                  setComponents([]);
                  setQuizName("");
                  setApproval(false);
                  setTimer(0);
                }}
              >
                Cancel Editing
              </button>
            </>
          )}
        </form>
        {components.map((question) => {
          return (
            <QuestionComponent
              key={question.qid}
              qid={question.qid}
              passedquestion={question.question}
              passedoption1={question.option1}
              passedoption2={question.option2}
              passedoption3={question.option3}
              passedoption4={question.option4}
              passedanswer={question.selectedOption}
              deleteFunction={deleteQuestion}
              quizid={quizid}
            />
          );
        })}
        {showAddQuestionWindow === true ? (
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
                  minWidth: "500px",
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
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
            </label>
            <br />
            <div className="optionsrow" style={{ width: "100%" }}>
              <label>
                <input
                  type="radio"
                  name="option"
                  value={option1}
                  checked={selectedOption === "option1" ? "checked" : null}
                  onChange={(event) => {
                    setSelectedOption(event.target.value);
                    setOption1(event.target.value);
                  }}
                />
                <input
                  placeholder="Option 1"
                  required
                  type="text"
                  value={option1}
                  onChange={(event) => setOption1(event.target.value)}
                />
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="option"
                  value={option2}
                  checked={selectedOption === "option2" ? "checked" : null}
                  onChange={(event) => {
                    setSelectedOption(event.target.value);
                    setOption2(event.target.value);
                  }}
                />
                <input
                  placeholder="Option 2"
                  required
                  type="text"
                  value={option2}
                  onChange={(event) => setOption2(event.target.value)}
                />
              </label>
            </div>
            <br />
            <div className="optionsrow" style={{ width: "100%" }}>
              <label>
                <input
                  type="radio"
                  name="option"
                  value={option3}
                  checked={selectedOption === "option3" ? "checked" : null}
                  onChange={(event) => {
                    setSelectedOption(event.target.value);
                    setOption3(event.target.value);
                  }}
                />
                <input
                  placeholder="Option 3"
                  required
                  type="text"
                  value={option3}
                  onChange={(event) => setOption3(event.target.value)}
                />
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="option"
                  value={option4}
                  checked={selectedOption === "option4" ? "checked" : null}
                  onChange={(event) => {
                    setSelectedOption(event.target.value);
                    setOption4(event.target.value);
                  }}
                />
                <input
                  placeholder="Option 4"
                  required
                  type="text"
                  value={option4}
                  onChange={(event) => setOption4(event.target.value)}
                />
              </label>
            </div>
            <br />
            <div
              className="createquizaddquesbutgrp"
              style={{ marginBottom: "20px" }}
            >
              <button
                style={{ width: "130px" }}
                disabled={
                  !(
                    question &&
                    option1 &&
                    option2 &&
                    option3 &&
                    option4 &&
                    selectedOption
                  )
                }
                onClick={handleAddQuestion}
              >
                Save
              </button>
              <button
                style={{ width: "130px" }}
                onClick={(e) => {
                  setshowAddQuestionWindow(false);
                  setAddQuestionEnabled(true);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
        <button
          style={{ width: "260px" }}
          onClick={addCustomQuestion}
          disabled={!addQuestionEnabled}
        >
          Add Custom Question
        </button>
        <button disabled={!addQuestionEnabled} onClick={addQBQuestion}>
          Add Question From Question Bank
        </button>
      </div>
    </>
  );
};

export default CreateEditQuizWindow;
