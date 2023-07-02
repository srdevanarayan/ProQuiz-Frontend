import React from "react";
import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay";
import Popup from "reactjs-popup";
const QuestionElement = ({ question, refreshPage, handleUnverifyQuestion }) => {
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
          <button onClick={() => setPopup(false)}>Cancel</button>
          <button onClick={handleDeleteQuestion}>Confirm</button>
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
          className="contributersidepanelblockscol"
          style={{ justifyContent: "space-between", alignItems: "center" }}
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
              className="unverifybutton"
              onClick={() => handleUnverifyQuestion(question)}
            >
              Unverify
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionElement;
