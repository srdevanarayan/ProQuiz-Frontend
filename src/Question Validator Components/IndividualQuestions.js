import React, { useState, useEffect } from "react";
import "../Component CSS/qbquestion.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import ReactStars from "react-rating-star-with-type";
import LoadingOverlay from "../LoadingOverlay";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Popup from "reactjs-popup";
import "../Component CSS/popupstyle.css";
const IndividualQuestions = ({
  question,
  options,
  answer,
  rating,
  usersrated,
  verified,
  qid,
  rated,
  reported,
  handleVerify,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [disabled, setDisabled] = useState(false);
  const [rateEditable, setRateEditable] = useState(true);
  const [reportable, setReportable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Getting quizzes...");
  const [popup, setPopup] = useState(false);
  const [ratingState, setRatingState] = useState(rating);
  const [added, setAdded] = useState(false);
  const [loadmsg, setLoadmsg] = useState();
  const [ratedUsersState, setRatedUsersState] = useState(usersrated);
  const [popupMessage, setPopupMessage] = useState(
    "You already rated this question!"
  );

  useEffect(() => {
    setTimeout(() => {
      setPopup(false);
    }, 5000);
  }, [popup]);

  const rateQuestion = async (newRating) => {
    setLoadmsg("Rating question...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.put(
        "/qb/rate",
        JSON.stringify({
          rating: newRating,
          qid: qid,
        })
      );
      setIsLoading(false);
      setRatingState((rating * usersrated + newRating) / (usersrated + 1));
      setRatedUsersState(usersrated + 1);
      setPopupMessage("Thank you for rating this question!");
      setPopup(true);
    } catch (err) {
      if (err) {
        setIsLoading(false);
        console.log(err);
        if (err.response?.status === 409) {
          setPopupMessage("You already rated this question!");
          setPopup(true);
        } else {
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    }
    setRateEditable(false);
    setIsLoading(false);
  };
  const handleReport = async () => {
    setLoadmsg("Reporting question...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.put(
        "/qb/report",
        JSON.stringify({
          qid: qid,
        })
      );
      setIsLoading(false);
      setPopupMessage("Thank you for reporting this question!");
      setPopup(true);
      setReportable(false);
    } catch (err) {
      if (err) {
        setIsLoading(false);
        console.log(err);
        if (err.response?.status === 409) {
          setPopupMessage("You already reported this question!");
          setPopup(true);
        } else {
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    }
  };
  const arr = [0, 1, 2, 3];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  /*  const handleAddqbquestion = async () => {
    setLoadingMessage("Adding question to quiz...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/question/add",
        JSON.stringify({
          quizid: quizid,
          qbquestion: "true",
          qbqid: qid,
        })
      );

      getQuestionfromQB(
        response.data.qid,
        question,
        options[0],
        options[1],
        options[2],
        options[3],
        answer
      );
      setAdded(true);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  }; */
  return (
    <>
      <Popup
        open={popup}
        position="right center"
        onClose={() => setPopup(false)}
      >
        <div>{popupMessage}</div>
      </Popup>
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null}
      <article className="qbindividualcontainer">
        <article className="qbindividualQuestions">
          <h1>{question}</h1>

          <span className="singleline">
            <p className={options[arr[0]] === answer ? "qbanswer" : null}>
              {options[arr[0]]}{" "}
            </p>
            <p className={options[arr[1]] === answer ? "qbanswer" : null}>
              {options[arr[1]]}
            </p>
            <p className={options[arr[2]] === answer ? "qbanswer" : null}>
              {options[arr[2]]}
            </p>
            <p className={options[arr[3]] === answer ? "qbanswer" : null}>
              {options[arr[3]]}
            </p>
          </span>
        </article>

        <div className="qbquestionattributes">
          <center>
            <div title="Rating" style={{ marginBottom: "10px" }}>
              <FontAwesomeIcon icon={faStar} /> {Math.round(ratingState)} (
              {ratedUsersState})
            </div>

            <div title="Verified" style={{ marginBottom: "10px" }}>
              <FontAwesomeIcon icon={faCircleCheck} /> {verified}
            </div>
          </center>
          {/* {rated === "true" ? null : (
            <ReactStars
              count={5}
              onChange={rateQuestion}
              size={24}
              inactiveColor={"#000"}
              activeColor={"rgb(255, 0, 0)"}
              isEdit={rateEditable}
            />
          )}
          {reported === "true" || reportable === false ? null : (
            <button disabled={!reportable} onClick={handleReport}>
              Report
            </button>
          )} */}
          {/*  <button disabled={added} onClick={handleAddqbquestion}>
            {added ? "Added" : "Add"}
          </button> */}
          <button
            disabled={disabled}
            onClick={() => {
              handleVerify(qid);
              setDisabled(true);
            }}
          >
            Verify
          </button>
        </div>
      </article>
    </>
  );
};

export default IndividualQuestions;
