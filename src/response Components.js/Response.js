import React, { useEffect } from "react";
import { useState, useRef } from "react";
import LoadingOverlay from "../LoadingOverlay";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Popup from "reactjs-popup";
import Navbar from "../QBViewer Components/Navbar";
import "../Component CSS/response.css";
import ReponseTab from "./ReponseTab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
const Response = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Getting quiz details..."
  );
  const [response, setResponse] = useState();
  const [responselist, setResponselist] = useState([]);
  const renderRan = useRef(false);
  useEffect(() => {
    setLoadingMessage("Getting details...");
    setIsLoading(true);
    let isMounted = true;
    const controller = new AbortController();
    if (renderRan.current === true || process.env.NODE_ENV !== "development") {
      const initialize = async () => {
        if (!state?.quizid) {
          navigate("/qmaker", { replace: "/dashboard" });
        }
        try {
          const response = await axiosPrivate.post(
            "/quiz/getparticipants",
            JSON.stringify({
              quizid: state.quizid,
              userclass: "responded",
            }),
            {
              signal: controller.signal,
            }
          );
          isMounted && setResponselist(response.data.users);
        } catch (err) {
          if (err.response?.status === 403) {
            navigate("/login", {
              state: { from: location },
              replace: "/qmaker",
            });
          }
        }
        setIsLoading(false);
      };

      initialize();
    }
    return () => {
      renderRan.current = true;
      isMounted = false;
      controller.abort();
    };
  }, []);

  const viewResponse = async (user) => {
    setLoadingMessage("Getting response...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/quiz/getresponses",
        JSON.stringify({
          quizid: state.quizid,
          user: user,
        })
      );
      console.log(response.data);
      setResponse(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login", {
          state: { from: location },
          replace: "/qmaker",
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null}
      <Navbar />
      <div className="responsecontainer">
        <div className="responsesidepanel">
          <center>
            <p
              style={{
                marginBottom: "5px",
                marginTop: "5px",
                fontSize: "23px",
              }}
            >
              Responses
            </p>
          </center>

          {responselist.map((user) => {
            return (
              <ReponseTab
                name={user.name}
                email={user.user}
                score={user.score}
                key={user.user}
                viewResponse={viewResponse}
              />
            );
          })}
        </div>
        {response ? (
          <div className="responsewindow">
            <h2 style={{ fontSize: "30px", marginBottom: "10px" }}>
              Total Score: {response.score} / {response.questions.length}
            </h2>
            <p>Questions & Answers</p>
            {response.questions.map((q, index) => {
              return (
                <div className="questionsandanswers">
                  <p>
                    {q.answer === q.useranswer ? (
                      <FontAwesomeIcon
                        className="checkicon"
                        icon={faCircleCheck}
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="crossicon"
                        icon={faCircleXmark}
                      />
                    )}{" "}
                    Q) {q.question}
                  </p>
                  <div className="pflex">
                    <p>Correct answer : {q.answer}</p>
                    <p>User answer : {q.useranswer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Response;
