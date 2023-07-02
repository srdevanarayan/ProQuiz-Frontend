import React from "react";
import { useState, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import LoadingOverlay from "../LoadingOverlay";
const Questiontab = ({ quiz, checkQuizresult }) => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Getting questions...");
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [popup, setPopup] = useState(false);
  const deleteGeneralQuiz = async () => {
    setLoadingMessage("Deleting quiz...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/quiz/delete",
        JSON.stringify({
          quizid: quiz.quizid,
        })
      );
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };
  return (
    <>
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null}
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
          onClick={() =>
            checkQuizresult(
              quiz.quizid,
              Array.isArray(auth.user)
                ? auth.user.join("")
                : auth.user.toString()
            )
          }
        >
          View Result
        </button>
        {quiz.type === "general" ? (
          <button
            style={{ alignSelf: "center", width: "100%", marginTop: "0px" }}
            className="qtakerbut"
            onClick={deleteGeneralQuiz}
          >
            Delete Quiz
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Questiontab;
