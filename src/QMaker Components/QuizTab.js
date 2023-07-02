import React from "react";
import { useState } from "react";
import LoadingOverlay from "../LoadingOverlay";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faUser,
  faArrowRight,
  faArrowLeft,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import Popup from "reactjs-popup";
import "../Component CSS/popupstyle.css";
import QuizDetails from "./QuizDetails";
export const QuizTab = ({
  quizQuestions,
  code,
  name,
  status,
  participants,
  responses,
  createdAt,
  quizid,
  approvalrequired,
  setQuizDetailsfn = { setQuizDetailsfn },
  setQuizQuestionsfn = { setQuizQuestionsfn },
  triggerRefresh,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Getting quiz details..."
  );
  const [questions, setQuestions] = useState();
  const [timer, setTimer] = useState(0);
  const [popup, setPopup] = useState(false);
  const [popupDeleteConfirmation, setPopupDeleteConfirmation] = useState(false);
  const [popupStartConfirmation, setPopupStartConfirmation] = useState(false);
  const [popupEndConfirmation, setPopupEndConfirmation] = useState(false);
  const [popupMessage, setPopupMessage] = useState(
    "You already rated this question!"
  );
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const date = new Date(createdAt);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const editQuiz = async () => {
    setLoadingMessage("Getting quiz details...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/quiz/questionsandanswers",
        JSON.stringify({
          quizid: quizid,
        })
      );
      setQuizDetailsfn({
        name: response.data.name,
        approvalrequired: !response.data.approvalrequired ? false : true,
        timer: response.data.timer,
        quizid: quizid,
      });
      setTimer(response.data.timer);
      setQuizQuestionsfn(response.data.questions);
      setQuestions(response.data.questions);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };

  const viewDetails = async () => {
    setLoadingMessage("Getting quiz details...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/quiz/questionsandanswers",
        JSON.stringify({
          quizid: quizid,
        })
      );
      setTimer(response.data.timer);
      setQuestions(response.data.questions);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
  };

  const copyQuiz = async () => {
    setLoadingMessage("Copying quiz...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/quiz/copy",
        JSON.stringify({
          quizid: quizid,
        })
      );
      triggerRefresh();
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };

  const deleteQuiz = async () => {
    setLoadingMessage("Deleting quiz...");
    setPopupDeleteConfirmation(false);
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/quiz/delete",
        JSON.stringify({
          quizid: quizid,
        })
      );
      triggerRefresh();
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };

  const startQuiz = async () => {
    setLoadingMessage("Starting quiz...");
    setPopupStartConfirmation(false);
    setIsLoading(true);
    try {
      const response = await axiosPrivate.put(
        "/quiz/start",
        JSON.stringify({
          quizid: quizid,
        })
      );
      triggerRefresh();
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };
  const endQuiz = async () => {
    setLoadingMessage("Ending quiz...");
    setPopupEndConfirmation(false);
    setIsLoading(true);
    try {
      const response = await axiosPrivate.put(
        "/quiz/end",
        JSON.stringify({
          quizid: quizid,
        })
      );
      triggerRefresh();
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };

  const handleApprovals = () => {
    navigate("/approval", { state: { quizid } });
  };
  const handleResponses = () => {
    navigate("/response", { state: { quizid } });
  };
  return (
    <>
      <Popup
        closeOnDocumentClick={false}
        open={popup}
        position="right center"
        onClose={() => setPopup(false)}
      >
        <QuizDetails
          key={code}
          code={code}
          name={name}
          timer={timer}
          status={status}
          participants={participants}
          responses={responses}
          approvalrequired={approvalrequired}
          created={createdAt}
          questions={questions}
          closePopup={closePopup}
        />
      </Popup>
      <Popup
        closeOnDocumentClick={false}
        open={popupDeleteConfirmation}
        position="right center"
        onClose={() => setPopupDeleteConfirmation(false)}
      >
        <center>
          <p>Do you want to delete this quiz and all associated data?</p>
          <button
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: "rgb(98, 11, 169)",
              color: "white",
              borderRadius: "30px",
              border: "2px solid rgb(98, 11, 169)",
            }}
            onClick={() => setPopupDeleteConfirmation(false)}
          >
            Cancel
          </button>

          <button
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: "rgb(98, 11, 169)",
              color: "white",
              borderRadius: "30px",
              border: "2px solid rgb(98, 11, 169)",
            }}
            onClick={deleteQuiz}
          >
            Confirm
          </button>
        </center>
      </Popup>
      <Popup
        closeOnDocumentClick={false}
        open={popupStartConfirmation}
        position="right center"
        onClose={() => setPopupStartConfirmation(false)}
      >
        <center>
          <p>Do you want to start this quiz?</p>
          <button
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: "rgb(98, 11, 169)",
              color: "white",
              borderRadius: "30px",
              border: "2px solid rgb(98, 11, 169)",
            }}
            onClick={() => setPopupStartConfirmation(false)}
          >
            Cancel
          </button>
          <button
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: "rgb(98, 11, 169)",
              color: "white",
              borderRadius: "30px",
              border: "2px solid rgb(98, 11, 169)",
            }}
            onClick={startQuiz}
          >
            Confirm
          </button>
        </center>
      </Popup>
      <Popup
        closeOnDocumentClick={false}
        open={popupEndConfirmation}
        position="right center"
        onClose={() => setPopupEndConfirmation(false)}
      >
        <center>
          <p>Do you want to end this quiz?</p>
          <button
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: "rgb(98, 11, 169)",
              color: "white",
              borderRadius: "30px",
              border: "2px solid rgb(98, 11, 169)",
            }}
            onClick={() => setPopupEndConfirmation(false)}
          >
            Cancel
          </button>
          <button
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: "rgb(98, 11, 169)",
              color: "white",
              borderRadius: "30px",
              border: "2px solid rgb(98, 11, 169)",
            }}
            onClick={endQuiz}
          >
            Confirm
          </button>
        </center>
      </Popup>
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null}
      <div className="quiztab">
        <div className="quizstats">
          <h2 style={{ fontSize: "28px" }}>{name}</h2>
          <p style={{ fontSize: "18px", fontStyle: "italic" }}>{code}</p>
          <p
            style={{
              fontSize: "16px",
              border: "2px solid black",
              padding: "3px",
              borderRadius: "10px",
              marginTop: "7px",
              marginBottom: "7px",
            }}
            className="quizstatus"
            title="Status of Quiz"
          >
            {status === "started"
              ? "Ongoing"
              : status === "new"
              ? "New"
              : status === "ended"
              ? "Ended"
              : ""}
          </p>
          <p className="quizparticipants">
            <FontAwesomeIcon
              icon={faUser}
              style={{ height: "20px", marginTop: "8px" }}
            />{" "}
            {participants}
          </p>
          {approvalrequired === true ? (
            <p className="quizcreated" style={{ fontSize: "18px" }}>
              <FontAwesomeIcon
                icon={faClock}
                style={{ height: "20px", marginTop: "8px" }}
              />{" "}
              {`${day}/${month}/${year}`}
            </p>
          ) : null}

          {status === "ended" ? (
            <p className="quizresponses">
              <FontAwesomeIcon
                icon={faSquareCheck}
                style={{ height: "20px", marginTop: "8px" }}
              />{" "}
              {responses}
            </p>
          ) : null}
        </div>
        <div className="quizbuttons">
          {status === "new" ? <button onClick={editQuiz}>Edit</button> : null}
          {status !== "started" ? (
            <button onClick={copyQuiz}>Copy</button>
          ) : null}

          {status !== "started" ? (
            <button onClick={() => setPopupDeleteConfirmation(true)}>
              Delete
            </button>
          ) : null}
          {status === "new" && approvalrequired === true ? (
            <button onClick={handleApprovals}>Approve</button>
          ) : null}
          {status === "started" ? (
            <button onClick={() => setPopupEndConfirmation(true)}>End</button>
          ) : null}
          {status === "ended" ? (
            <button onClick={handleResponses}>View Responses</button>
          ) : null}
          {status === "new" ? (
            <button onClick={() => setPopupStartConfirmation(true)}>
              Start
            </button>
          ) : null}
          <button onClick={viewDetails}>View</button>
        </div>
      </div>
    </>
  );
};
