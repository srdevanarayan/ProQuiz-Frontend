import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Component CSS/qtaker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faClock } from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import LoadingOverlay from "../LoadingOverlay";

const Quizwindow = ({ quizdata, quizid }) => {
  const [totalQuestions, setTotalQuestions] = useState(
    quizdata.questions.length
  );
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState(quizdata.questions);
  const [index, setIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(questions[0].options);
  const [answer, setAnswer] = useState("");
  const [timer, setTimer] = useState(quizdata.timer);
  const [loading, setLoading] = useState(false);
  const [hasTimer, setHasTimer] = useState(false);
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  let a = [0, 1, 2, 3];
  shuffleArray(a);

  const renderRan = useRef(false);

  useEffect(() => {
    if (timer > 0) {
      setHasTimer(true);
      const timer1 = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timer1);
    }
    if ((timer === 0) & hasTimer) {
      window.location.reload();
    }
  }, [timer]);

  const submitAnswer = async (e) => {
    setLoading(true);
    if (index === totalQuestions - 1) {
      try {
        const response = await axiosPrivate.put(
          "/quiz/session/submit",
          JSON.stringify({
            quizid: quizid,
            answer: e.target.value,
            qid: questions[index].qid,
          })
        );

        const shuffledArray = shuffleArray([0, 1, 2, 3]);
        setOptions(
          questions[index + 1].options.map(
            (option, i) => questions[index + 1].options[shuffledArray[i]]
          )
        );
        window.location.reload();
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        window.location.reload();
      }
    } else {
      setLoading(true);

      try {
        const response = await axiosPrivate.put(
          "/quiz/session/submit",
          JSON.stringify({
            quizid: quizid,
            answer: e.target.value,
            qid: questions[index].qid,
          })
        );

        const shuffledArray = shuffleArray([0, 1, 2, 3]);
        setOptions(
          questions[index + 1].options.map(
            (option, i) => questions[index + 1].options[shuffledArray[i]]
          )
        );
        setIndex((prevIndex) => prevIndex + 1);
        setLoading(false);
      } catch (err) {
        console.log(err);
        window.location.reload();
      }
    }
  };

  return (
    <div className="quizsessionwindow">
      <div className="quizsessionheader">
        <div className="logo"></div>
        <p
          style={{
            background: "rgb(98, 11, 169)",
            padding: "10px",
            borderRadius: "20px",
            color: "white",
          }}
        >
          {index + 1}/{totalQuestions}
        </p>
        <p style={{ marginRight: "15px" }}>
          <FontAwesomeIcon icon={faClock} style={{ marginRight: "7px" }} />
          {timer}s
        </p>
      </div>

      <div className="questionoptionwindow">
        <p>{questions[index].question}</p>
        <div className="optgrp">
          {options.map((option, i) => (
            <button
              key={i}
              className={loading ? "disabled" : null}
              disabled={loading}
              onClick={submitAnswer}
              value={option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={loading}
        className="quizsessionendquiz"
        onClick={() => window.location.reload()}
      >
        End Quiz
      </button>
    </div>
  );
};

export default Quizwindow;
