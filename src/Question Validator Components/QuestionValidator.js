import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../QBViewer Components/Navbar";
import "../Component CSS/validator.css";
import QBViewer from "./QBViewer";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import LoadingOverlay from "../LoadingOverlay";
import Popup from "reactjs-popup";
import QuestionElement from "./QuestionElement";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
const QuestionValidator = () => {
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Getting questions...");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState();
  const [stats, setStats] = useState(0);
  const [verifiedQuestions, setVerifiedQuestions] = useState([]);
  const renderRan = useRef(false);
  useEffect(() => {
    setLoadingMessage("Getting Questions...");
    setIsLoading(true);
    let isMounted = true;
    const controller = new AbortController();
    if (renderRan.current === true || process.env.NODE_ENV !== "development") {
      const getStats = async () => {
        try {
          const response = await axiosPrivate.post(
            "/stats",
            JSON.stringify({
              statsof: "verified",
            }),
            {
              signal: controller.signal,
            }
          );
          isMounted && setStats(response.data["Questions Verified"]);

          const questionsResponse = await axiosPrivate.post(
            "/qb/questions",
            JSON.stringify({
              pagesize: 1000,
              pagenumber: 1,
              option: "verified",
              sortby: "created",
            }),
            {
              signal: controller.signal,
            }
          );

          isMounted && setVerifiedQuestions(questionsResponse.data);
        } catch (err) {
          if (err.response?.status === 403) {
            navigate("/login", { state: { from: location }, replace: true });
          }
        }
        setIsLoading(false);
      };

      getStats();
    }
    return () => {
      renderRan.current = true;
      isMounted = false;
      controller.abort();
    };
  }, []);
  useEffect(() => {
    setLoadingMessage("Getting Questions...");
    setIsLoading(true);
    let isMounted = true;
    const controller = new AbortController();
    if (renderRan.current === true || process.env.NODE_ENV !== "development") {
      const getStats = async () => {
        try {
          const response = await axiosPrivate.post(
            "/stats",
            JSON.stringify({
              statsof: "verified",
            }),
            {
              signal: controller.signal,
            }
          );
          isMounted && setStats(response.data["Questions Verified"]);

          const questionsResponse = await axiosPrivate.post(
            "/qb/questions",
            JSON.stringify({
              pagesize: 1000,
              pagenumber: 1,
              option: "verified",
              sortby: "created",
            }),
            {
              signal: controller.signal,
            }
          );

          isMounted && setVerifiedQuestions(questionsResponse.data);
        } catch (err) {
          if (err.response?.status === 403) {
            navigate("/login", { state: { from: location }, replace: true });
          }
        }
        setIsLoading(false);
      };

      getStats();
    }
    return () => {
      renderRan.current = true;
      isMounted = false;
      controller.abort();
    };
  }, [refresh]);
  useEffect(() => {
    setTimeout(() => {
      setPopup(false);
    }, 5000);
  }, [popup]);
  const refreshPage = () => {
    setRefresh(!refresh);
  };

  const handleUnverifyQuestion = async (q) => {
    setLoadingMessage("Unverifying Question...");
    setIsLoading(true);
    try {
      const questionsResponse = await axiosPrivate.put(
        "/qb/unverify",
        JSON.stringify({
          qid: q._id,
        })
      );
      setPopupMessage("Question unverified");
      setPopup(true);
      refreshPage();
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };
  const handleVerify = async (q) => {
    setLoadingMessage("Verifying Question...");
    setIsLoading(true);
    try {
      const questionsResponse = await axiosPrivate.put(
        "/qb/verify",
        JSON.stringify({
          qid: q,
        })
      );
      setPopupMessage("Question Verified");
      setPopup(true);
      refreshPage();
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null} <Navbar />
      <Popup
        open={popup}
        position="right center"
        onClose={() => setPopup(false)}
      >
        <div>{popupMessage}</div>
      </Popup>
      <Navbar />
      <div className="ValidatorScreen">
        <div className="validatorsidepanel">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <b>
              <p
                style={{
                  fontSize: "18px",
                  color: "rgb(98, 11, 169)",
                  paddingTop: "5px",
                  paddingButtom: "10px",
                }}
              >
                Questions Verified ({stats})
              </p>
            </b>
            <FontAwesomeIcon
              className="refresh"
              onClick={refreshPage}
              icon={faArrowsRotate}
            />
          </div>
          {verifiedQuestions.map((q) => {
            return (
              <QuestionElement
                question={q}
                refreshPage={refreshPage}
                handleUnverifyQuestion={handleUnverifyQuestion}
              />
            );
          })}
        </div>
        <div className="qbcontainer">
          <QBViewer handleVerify={handleVerify} />
        </div>
      </div>
    </>
  );
};

export default QuestionValidator;
