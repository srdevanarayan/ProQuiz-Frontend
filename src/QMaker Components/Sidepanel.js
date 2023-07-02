import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { QuizTab } from "./QuizTab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay";
import Popup from "reactjs-popup";
import "../Component CSS/popupstyle.css";

import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
const Sidepanel = ({
  setQuizDetailsfn,
  setQuizQuestionsfn,
  refresh,
  triggerRefresh,
  quizQuestions,
}) => {
  const [selectedButton, setSelectedButton] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Getting quizzes...");
  const [quizdata, setQuizData] = useState([]);
  const [selectedquizdata, setselectedQuizData] = useState([]);
  const [noQuiz, setNoQuiz] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const pagesize = 1;
  let pageNumber = 1;

  const renderRan = useRef(false);
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    if (renderRan.current === true || process.env.NODE_ENV !== "development") {
      const getQuizzes = async () => {
        try {
          const response = await axiosPrivate.post(
            "/quiz/info",
            JSON.stringify({
              pagesize: pagesize,
              pagenumber: pageNumber,
              option: "customquizcreated",
            }),
            {
              signal: controller.signal,
            }
          );
          isMounted && setQuizData(response.data.quizzes);
          setselectedQuizData(response.data.quizzes);
          setNoQuiz(false);
        } catch (err) {
          if (err.response?.status === 404) {
            setNoQuiz(true);
          } else {
            navigate("/login", { state: { from: location }, replace: true });
          }
        }
        setIsLoading(false);
      };

      getQuizzes();
    }
    return () => {
      renderRan.current = true;
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const getQuizzes = async () => {
      try {
        const response = await axiosPrivate.post(
          "/quiz/info",
          JSON.stringify({
            pagesize: pagesize,
            pagenumber: pageNumber,
            option: "customquizcreated",
          })
        );
        setQuizData(response.data.quizzes);
        setselectedQuizData(response.data.quizzes);
        setNoQuiz(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setNoQuiz(true);
        } else {
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
      setIsLoading(false);
    };

    getQuizzes();
  }, [refresh]);

  const handleFilterButton = (cat) => {
    if (cat === "all") {
      setselectedQuizData(quizdata);
      return;
    }
    setselectedQuizData(quizdata.filter((data) => data.status === cat));
  };

  return (
    <>
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null}{" "}
      <div className="sidepanel">
        <div
          className="sidepanelHeader"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <center>
            <p
              style={{
                fontSize: "18px",
                color: "rgb(98, 11, 169)",
                paddingTop: "5px",
                paddingButtom: "10px",
              }}
            >
              {" "}
              Your Quizzes
            </p>
          </center>{" "}
          <FontAwesomeIcon
            onClick={triggerRefresh}
            className="refresh"
            icon={faArrowsRotate}
          />
        </div>
        <br />
        <div className="filterButtonGroup">
          <button
            onClick={() => {
              handleFilterButton("all");
              setSelectedButton(1);
            }}
            className={selectedButton === 1 ? "selectedButton" : ""}
          >
            All
          </button>
          <button
            onClick={() => {
              handleFilterButton("new");
              setSelectedButton(2);
            }}
            className={selectedButton === 2 ? "selectedButton" : ""}
          >
            New
          </button>
          <button
            onClick={() => {
              handleFilterButton("started");
              setSelectedButton(3);
            }}
            className={selectedButton === 3 ? "selectedButton" : ""}
          >
            Ongoing
          </button>
          <button
            onClick={() => {
              handleFilterButton("ended");
              setSelectedButton(4);
            }}
            className={selectedButton === 4 ? "selectedButton" : ""}
          >
            Ended
          </button>
        </div>

        {noQuiz ? <p>No quizzes</p> : null}
        {selectedquizdata.map((quiz) => {
          return (
            <QuizTab
              code={quiz.code}
              key={quiz.quizid}
              name={quiz.name}
              status={quiz.status}
              participants={quiz.participants}
              responses={quiz.responses}
              createdAt={quiz.createdAt}
              quizid={quiz.quizid}
              approvalrequired={quiz.approvalrequired}
              setQuizDetailsfn={setQuizDetailsfn}
              setQuizQuestionsfn={setQuizQuestionsfn}
              quizQuestions={quizQuestions}
              triggerRefresh={triggerRefresh}
            />
          );
        })}
      </div>
    </>
  );
};

export default Sidepanel;
