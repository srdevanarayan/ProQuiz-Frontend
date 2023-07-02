import React from "react";
import Navbar from "../QBViewer Components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import "../Component CSS/qtaker.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import LoadingOverlay from "../LoadingOverlay";
import Popup from "reactjs-popup";
import { useState, useRef, useEffect } from "react";
import Questiontab from "./Questiontab";
import Quizwindow from "./Quizwindow";
import Questiontab2 from "./Questiontab2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
const QTaker = () => {
  const renderRan = useRef(false);
  const [quiztobecompleted, setQuiztobecompleted] = useState([]);
  const [quizCompleted, setquizCompleted] = useState([]);
  const [genquizCompleted, setgenquizCompleted] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Getting questions...");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [popup, setPopup] = useState(false);
  const [instructionpopup, setinstructionPopup] = useState(false);
  const [generalpopup, setGeneralPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState();
  const [quizcode, setQuizCode] = useState();
  const [showQuizDetails, setShowQuizDetails] = useState(false);
  const [quizhistory, setQuizhistory] = useState([]);
  const [quizdetailsfromcode, setQuizdetailsfromcode] = useState();
  const [quizWindow, setQuizWindow] = useState(false);
  const [quizready, setQuizready] = useState();
  const [quizdata, setQuizdata] = useState();
  const [cat, setCat] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setPopup(false);
    }, 5000);
  }, [popup]);
  useEffect(() => {
    setLoadingMessage("Getting Quizzes...");
    setIsLoading(true);
    let isMounted = true;
    const controller = new AbortController();
    if (renderRan.current === true || process.env.NODE_ENV !== "development") {
      const getStats = async () => {
        try {
          const response = await axiosPrivate.post(
            "/quiz/info",
            JSON.stringify({
              pagenumber: 1,
              pagesize: 1000,
              option: "customquizanswered",
            }),
            {
              signal: controller.signal,
            }
          );
          isMounted && setquizCompleted(response.data.quizzes);
        } catch (err) {
          if (err.response?.status === 403) {
            navigate("/login", { state: { from: location }, replace: true });
          }
        }
        try {
          const response2 = await axiosPrivate.post(
            "/quiz/info",
            JSON.stringify({
              pagenumber: 1,
              pagesize: 1000,
              option: "generalquizanswered",
            }),
            {
              signal: controller.signal,
            }
          );

          isMounted && setgenquizCompleted(response2.data.quizzes);
          console.log(quizCompleted);
        } catch (err) {
          if (err.response?.status === 403) {
            navigate("/login", { state: { from: location }, replace: true });
          }
        }
        try {
          const response3 = await axiosPrivate.post(
            "/quiz/info",
            JSON.stringify({
              pagenumber: 1,
              pagesize: 1000,
              option: "quiztobecompleted",
            }),
            {
              signal: controller.signal,
            }
          );

          isMounted && setQuiztobecompleted(response3.data.quizzes);
          /* console.log(response3.data);
          console.log(quiztobecompleted); */
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
  const refreshPage = () => {
    setRefresh(!refresh);
  };
  const getQuizfromCode = async () => {
    setShowQuizDetails(false);
    setLoadingMessage("Getting Quiz details...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/quiz/quizfromcode",
        JSON.stringify({
          quizcode: quizcode,
        })
      );
      setQuizdetailsfromcode(response.data);
      setShowQuizDetails(true);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      } else if (err.response?.status === 404) {
        setPopupMessage("Quiz not found. Please check your code.");
        setPopup(true);
      } else if (err.response?.status === 401) {
        setPopupMessage("You cannot request to join a general quiz!");
        setPopup(true);
      }
    }
    setIsLoading(false);
  };

  const generalquizrequest = async () => {
    setLoadingMessage("Please wait...");
    setIsLoading(true);
    try {
      const response1 = await axiosPrivate.post("/qb/catandsubcat");
      setCat(response1.data);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
    setGeneralPopup(true);
  };
  let categories = [{}];
  categories = cat.map((obj) => {
    return {
      name: obj.category,
      subcategories: obj.subcategories,
    };
  });

  const [quizName, setQuizName] = useState("");
  const [timer, setTimer] = useState("");
  const [category, setCategory] = useState(categories[0]?.name || "");
  const [subcategory, setSubcategory] = useState(
    categories[0]?.subcategories[0] || ""
  );
  const [sortBy, setSortBy] = useState("Rating");
  const [easy, setEasy] = useState("");
  const [medium, setMedium] = useState("");
  const [hard, setHard] = useState("");
  const [avoidDuplicate, setAvoidDuplicate] = useState(false);
  const [minimumLimit, setMinimumLimit] = useState("");
  const [responsepopup, setresponsePopup] = useState(false);
  const [response, setResponse] = useState([]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setGeneralPopup(false);
    setLoadingMessage("Creating general quiz...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/quiz/creategeneralquiz",
        JSON.stringify({
          name: quizName,
          timer: timer,
          category: category,
          subcategory: subcategory,
          easy: easy,
          medium: medium,
          hard: hard,
          sortby: sortBy.toLowerCase(),
          avoidduplicate: avoidDuplicate === true ? "true" : "false",
          minimum: minimumLimit,
        })
      );
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      } else if (err.response?.status === 404) {
        setPopupMessage("Sorry! Not enough questions.");
        setPopup(true);
      }
    }
    setIsLoading(false);
    setGeneralPopup(false);
    setQuizName("");
    setTimer("");
    setCategory(categories[0]?.name || "");
    setSubcategory(categories[0]?.subcategories[0] || "");
    setSortBy("Rating");
    setEasy("");
    setMedium("");
    setHard("");
    setAvoidDuplicate(false);
    setMinimumLimit("");
  };

  function handleQuizNameChange(event) {
    setQuizName(event.target.value);
  }

  function handleTimerChange(event) {
    setTimer(event.target.value);
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
    setSubcategory(
      categories.find((cat) => cat.name === event.target.value)
        ?.subcategories[0]
    );
  }

  function handleSubcategoryChange(event) {
    setSubcategory(event.target.value);
  }

  function handleSortByChange(event) {
    setSortBy(event.target.value);
  }

  function handleEasyChange(event) {
    setEasy(event.target.value);
  }

  function handleMediumChange(event) {
    setMedium(event.target.value);
  }

  function handleHardChange(event) {
    setHard(event.target.value);
  }

  function handleAvoidDuplicateChange(event) {
    setAvoidDuplicate(event.target.checked);
  }

  function handleMinimumLimitChange(event) {
    setMinimumLimit(event.target.value);
  }

  const checkQuizStatus = async (quizid) => {
    setLoadingMessage("Checking quiz status");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/quiz/quizstatus",
        JSON.stringify({
          quizid: quizid,
        })
      );
      setinstructionPopup(true);
      setQuizready(quizid);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      } else if (err.response?.status === 404) {
        setPopupMessage("Quiz not ready");
        setPopup(true);
      }
    }
    setIsLoading(false);
  };

  const startQuiz = async () => {
    setinstructionPopup(false);
    setLoadingMessage("Starting Quiz...");
    setIsLoading(true);

    try {
      const response = await axiosPrivate.post(
        "/quiz/questions",
        JSON.stringify({
          quizid: quizready,
        })
      );
      setQuizdata(response.data);
      setQuizWindow(true);
      setinstructionPopup(false);
    } catch (err) {
      if (err.response?.status === 403) {
        setPopupMessage("Cannot participate in this quiz!");
        setPopup(true);
      } else if (err.response?.status === 404) {
        setPopupMessage("Quiz not found");
        setPopup(true);
      }
    }
    try {
      const response1 = await axiosPrivate.put(
        "/quiz/session/initialize",
        JSON.stringify({
          quizid: quizready,
        })
      );
    } catch (err) {
      if (err.response?.status === 403) {
        window.location.reload();
      }
    }
    setIsLoading(false);
  };

  const checkQuizresult = async (quizid, user) => {
    setLoadingMessage("Getting results...");
    setIsLoading(true);
    setResponse([]);
    try {
      const response = await axiosPrivate.post(
        "/quiz/getresponses",
        JSON.stringify({
          quizid: quizid,
          user: user,
        })
      );
      console.log(response.data);
      setResponse(response.data);
      setresponsePopup(true);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      } else if (err.response?.status === 404) {
        setPopupMessage("Response not found");
        setPopup(true);
      }
    }
    setIsLoading(false);
  };

  const approvalRequest = async () => {
    setLoadingMessage("Requesting approval...");
    setIsLoading(true);

    try {
      const response = await axiosPrivate.post(
        "/quiz/requestapproval",
        JSON.stringify({
          quizid: quizdetailsfromcode.quizid,
        })
      );
      setShowQuizDetails(false);
      setPopupMessage("Requested for approval");
      setPopup(true);
      setQuizCode();
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      } else if (err.response?.status === 409) {
        setPopupMessage(err.response.data.message);
        setPopup(true);
      } else if (err.response?.status === 401) {
        setPopupMessage(err.response.data.message);
        setPopup(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null}
      {quizWindow ? (
        <Quizwindow quizdata={quizdata} quizid={quizready} />
      ) : null}
      <Navbar />
      <Popup
        open={popup}
        position="right center"
        onClose={() => setPopup(false)}
      >
        <div>
          <center>{popupMessage}</center>
        </div>
      </Popup>
      <Popup
        open={responsepopup}
        position="right center"
        onClose={() => setresponsePopup(false)}
      >
        <div className="qtakerresponse">
          <p>Your Score : {response.score}</p>

          {response.length !== 0 ? (
            response.questions.map((q) => {
              return (
                <div className="responseindividual">
                  <p style={{ fontWeight: "bold" }}>
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
                    {q.question}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Answer : {q.answer}</p>
                    <p>Your answer : {q.useranswer}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No response found.</p>
          )}
        </div>
      </Popup>
      <Popup
        open={instructionpopup}
        position="right center"
        onClose={() => setinstructionPopup(false)}
        closeOnDocumentClick={false}
      >
        <div className="quizinstruction">
          <center>
            <h1 style={{ fontSize: "25px", marginBottom: "5px" }}>
              Instructions
            </h1>
          </center>
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>
            Do not refresh or go back during the quiz. If you do so, the quiz
            will be ended. You can click "End Quiz" to end the quiz early. If
            there is timer for the quiz, the quiz will automatically end when
            the timer runs out. Happy quizzing!
          </p>
          <center>
            <button
              className="qtakerbut"
              onClick={() => {
                setinstructionPopup(false);
                setQuizready();
              }}
            >
              Cancel
            </button>
            <button className="qtakerbut" onClick={startQuiz}>
              Start Quiz
            </button>
          </center>
        </div>
      </Popup>
      <Popup
        open={generalpopup}
        position="right center"
        onClose={() => setGeneralPopup(false)}
      >
        <div className="generalquizrequest">
          <center>
            <p style={{ marginBottom: "8px" }}>Create General Quiz</p>
          </center>
          <form onSubmit={handleSubmit}>
            <label>
              Quiz Name:
              <input
                type="text"
                value={quizName}
                onChange={handleQuizNameChange}
              />
            </label>
            <br />
            <label>
              Timer:
              <input type="number" value={timer} onChange={handleTimerChange} />
            </label>
            <br />
            <label>
              Category:
              <select value={category} onChange={handleCategoryChange}>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Subcategory:
              <select value={subcategory} onChange={handleSubcategoryChange}>
                {categories
                  .find((cat) => cat.name === category)
                  ?.subcategories.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
              </select>
            </label>
            <br />
            <label>
              Sort By:
              <select value={sortBy} onChange={handleSortByChange}>
                <option value="Rating">Rating</option>
                <option value="Created">Created</option>
                <option value="Verified">Verified</option>
              </select>
            </label>
            <br />
            <label>
              Easy:
              <input type="number" value={easy} onChange={handleEasyChange} />
            </label>
            <br />
            <label>
              Medium:
              <input
                type="number"
                value={medium}
                onChange={handleMediumChange}
              />
            </label>
            <br />
            <label>
              Hard:
              <input type="number" value={hard} onChange={handleHardChange} />
            </label>
            <br />
            <label>
              Avoid Duplicate:
              <input
                type="checkbox"
                checked={avoidDuplicate}
                onChange={handleAvoidDuplicateChange}
              />
            </label>
            <br />
            <label>
              Minimum Limit:
              <input
                type="number"
                value={minimumLimit}
                onChange={handleMinimumLimitChange}
              />
            </label>
            <br />
            <center style={{ marginTop: "15px" }}>
              <button
                className="qtakerbut"
                type="submit"
                disabled={
                  !quizName ||
                  !timer ||
                  !easy ||
                  !medium ||
                  !hard ||
                  !minimumLimit
                }
              >
                Submit
              </button>
              <button
                className="qtakerbut"
                type="button"
                onClick={() => setGeneralPopup(false)}
              >
                Cancel
              </button>
            </center>
          </form>
        </div>
      </Popup>
      <Navbar />
      <div className="qtakercontainer">
        <div className="qtakersidepanel1">
          <center>
            <p>Quiz History</p>
          </center>
          {quizCompleted.map((quiz) => {
            return (
              <Questiontab2
                quiz={quiz}
                key={quiz.quizid}
                checkQuizresult={checkQuizresult}
              />
            );
          })}
          {genquizCompleted.map((quiz) => {
            return (
              <Questiontab2
                quiz={quiz}
                key={quiz.quizid}
                checkQuizresult={checkQuizresult}
              />
            );
          })}
        </div>
        <div className="qtakermain">
          {showQuizDetails ? (
            <div className="quizdetailsfromcode">
              <p> Name : {quizdetailsfromcode.name}</p>
              <p> Code : {quizdetailsfromcode.code}</p>
              <p> Creator : {quizdetailsfromcode.quizmaker}</p>
              <button
                style={{ marginTop: "15px" }}
                className="qtakerbut"
                onClick={approvalRequest}
              >
                Request to Join
              </button>
              <button
                style={{ width: "130px" }}
                className="qtakerbut"
                onClick={() => {
                  setShowQuizDetails(false);
                  setQuizdetailsfromcode();
                  setQuizCode();
                }}
              >
                Cancel
              </button>
            </div>
          ) : null}

          <input
            className="qtakerquizcode"
            style={{ fontFamily: "Montserrat, sans-serif" }}
            type="text"
            placeholder="Quiz Code"
            value={quizcode}
            onChange={(e) => setQuizCode(e.target.value)}
          />
          <div className="qtakermainbuttons">
            <button className="qtakerbut" onClick={getQuizfromCode}>
              <p style={{ fontSize: "15px", width: "150px" }}>Join Quiz</p>
            </button>
          </div>
          <p style={{ marginBottom: "10px", fontSize: "15px" }}>Or</p>
          <div className="qtakermainbuttons">
            <button className="qtakerbut" onClick={generalquizrequest}>
              <p style={{ fontSize: "15px" }}>Create General Quiz</p>
            </button>
          </div>
        </div>
        <div className="qtakersidepanel2">
          <center>
            <p>Pending Quizzes</p>
          </center>
          {quiztobecompleted.map((quiz) => {
            return (
              <Questiontab
                quiz={quiz}
                key={quiz.quizid}
                checkQuizStatus={checkQuizStatus}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default QTaker;
