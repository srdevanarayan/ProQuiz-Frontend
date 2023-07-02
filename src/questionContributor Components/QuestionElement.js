import React from "react";
import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay";
import Popup from "reactjs-popup";
const QuestionElement = ({ question, handleEditQuestion, refreshPage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [popup, setPopup] = useState(false);
  const [infopopup, setinfoPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState();
  const [infopopupmsg, setinfoPopupMessage] = useState();
  useEffect(() => {
    setTimeout(() => {
      setPopup(false);
    }, 5000);
  }, [infopopup]);
  const handleDeleteQuestion = async () => {
    setPopup(false);
    setLoadingMessage("Deleting question...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/qb/remove",
        JSON.stringify({
          qid: question._id,
        })
      );
      refreshPage();
      setinfoPopupMessage("Question Removed!");
      setinfoPopup(true);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };
  return (
    <>
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null}
      <Popup
        open={popup}
        position="right center"
        onClose={() => setPopup(false)}
      >
        <div>
          <p>Do you want to delete this question?</p>
          <center>
            <button
              style={{
                padding: "10px",
                margin: "10px",
                backgroundColor: "rgb(98, 11, 169)",
                color: "white",
                borderRadius: "30px",
                border: "2px solid rgb(98, 11, 169)",
              }}
              onClick={() => setPopup(false)}
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
              onClick={handleDeleteQuestion}
            >
              Confirm
            </button>
          </center>
        </div>
      </Popup>
      <Popup
        open={infopopup}
        position="right center"
        onClose={() => setPopup(false)}
      >
        {infopopupmsg}
      </Popup>
      <div className="contributersidepanelblocks">
        <p style={{ fontSize: "18px" }}>{question.question}</p>
        <div
          style={{ justifyContent: "space-between", alignItems: "center" }}
          className="contributersidepanelblockscol"
        >
          <p
            style={{
              fontSize: "14px",
              border: "2px solid black",
              padding: "3px",
              borderRadius: "10px",
            }}
          >
            {question.category}
          </p>
          <div>
            <button
              className="contbuttons"
              onClick={() => handleEditQuestion(question)}
            >
              Edit
            </button>
            <button className="contbuttons" onClick={() => setPopup(true)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionElement;
