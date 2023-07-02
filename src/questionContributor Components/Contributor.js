import React from "react";
import Navbar from "../QBViewer Components/Navbar";
import "../Component CSS/contributor.css";
import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay";
import QuestionElement from "./QuestionElement";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import addQuestion from "./addQuestion";
const Contributor = () => {
  const [stats, setStats] = useState(0);
  const [cat, setCat] = useState([]);
  const [question, setQuestion] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const renderRan = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Getting quizzes...");
  const [selectedQuestion, setSelectedQuestion] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
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
              statsof: "contributed",
            }),
            {
              signal: controller.signal,
            }
          );
          isMounted && setStats(response.data["Questions Contributed"]);
          const response1 = await axiosPrivate.post("/qb/catandsubcat", {
            signal: controller.signal,
          });
          isMounted && setCat(response1.data);

          const questionsResponse = await axiosPrivate.post(
            "/qb/questions",
            JSON.stringify({
              pagesize: 1000,
              pagenumber: 1,
              option: "contributed",
              sortby: "created",
              getanswer: "true",
            }),
            {
              signal: controller.signal,
            }
          );

          isMounted && setQuestion(questionsResponse.data);
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
              statsof: "contributed",
            }),
            {
              signal: controller.signal,
            }
          );
          isMounted && setStats(response.data["Questions Contributed"]);
          const response1 = await axiosPrivate.post("/qb/catandsubcat", {
            signal: controller.signal,
          });
          isMounted && setCat(response1.data);

          const questionsResponse = await axiosPrivate.post(
            "/qb/questions",
            JSON.stringify({
              pagesize: 1000,
              pagenumber: 1,
              option: "contributed",
              sortby: "created",
              getanswer: "true",
            }),
            {
              signal: controller.signal,
            }
          );

          isMounted && setQuestion(questionsResponse.data);
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
  const refreshPage = () => {
    setRefresh(!refresh);
  };

  const handleEditQuestion = (q) => {
    setSelectedQuestion(q);
  };

  //addquestion states
  const categories = cat.map((obj) => {
    return {
      name: obj.category,
      subcategories: obj.subcategories,
    };
  });
  const difficultyProper = (() => {
    switch (selectedQuestion?.difficulty?.toLowerCase()) {
      case "easy":
        return "Easy";
      case "medium":
        return "Medium";
      case "hard":
        return "Hard";
      default:
        return "";
    }
  })();
  useEffect(() => {
    setCategory(selectedQuestion?.category || "");
    setSubcategory(selectedQuestion?.subcategory || "");
    setDifficulty(difficultyProper || "");
    setOptions(selectedQuestion?.options || ["", "", "", ""]);
    setSelectedOption(
      selectedQuestion?.options.indexOf(selectedQuestion.answer) > -1
        ? selectedQuestion?.options.indexOf(selectedQuestion.answer)
        : 0
    );
    setIsEditing(selectedQuestion ? true : false);
    setaQuestion(selectedQuestion?.question || "");
  }, [selectedQuestion]);

  const difficulties = ["Easy", "Medium", "Hard"];
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [aquestion, setaQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [selectedOption, setSelectedOption] = useState(-1);
  const [isDirty, setIsDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState();

  useEffect(() => {
    setTimeout(() => {
      setPopup(false);
    }, 5000);
  }, [popup]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setSubcategory("");
    setIsDirty(true);
  };

  const handleSubcategoryChange = (event) => {
    setSubcategory(event.target.value);
    setIsDirty(true);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
    setIsDirty(true);
  };
  const handleQuestionChange = (event) => {
    setaQuestion(event.target.value);
    setIsDirty(true);
  };

  const handleOptionChange = (event, index) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
    setIsDirty(true);
  };

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
    setIsDirty(true);
  };

  const handleAddClick = async () => {
    setIsDirty(false);
    setLoadingMessage("Adding question...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/qb/add",
        JSON.stringify({
          category: category,
          subcategory: subcategory,
          question: aquestion,
          answer: options[selectedOption],
          options: options,
          difficulty: difficulty.toLocaleLowerCase(),
        })
      );
      handleResetClick();
      refreshPage();
      setPopupMessage("Question Added!");
      setPopup(true);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };
  const handleEditClick = async () => {
    setIsEditing(false);
    setIsDirty(false);
    setLoadingMessage("Editing question...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.put(
        "/qb/edit",
        JSON.stringify({
          qid: selectedQuestion._id,
          category: category,
          subcategory: subcategory,
          question: aquestion,
          answer: options[selectedOption],
          options: options,
          difficulty: difficulty.toLocaleLowerCase(),
        })
      );
      handleResetClick();
      refreshPage();
      setPopupMessage("Question Edited!");
      setPopup(true);
    } catch (err) {
      if (err.response.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };

  const handleResetClick = () => {
    setIsDirty(false);
    setIsEditing(false);
    setSelectedQuestion();
    setCategory("");
    setSubcategory("");
    setDifficulty("");
    setaQuestion("");
    setOptions(["", "", "", ""]);
    setSelectedOption(-1);
  };

  const isAddEnabled =
    category !== "" &&
    subcategory !== "" &&
    difficulty !== "" &&
    aquestion !== "" &&
    options.every((option) => option !== "") &&
    selectedOption !== -1;
  const isEditEnabled =
    isDirty === true &&
    category !== "" &&
    subcategory !== "" &&
    difficulty !== "" &&
    aquestion !== "" &&
    options.every((option) => option !== "") &&
    selectedOption !== -1;
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
      <div className="contributorcontainer">
        <div className="contributorsidepanel">
          <div
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
            <p
              style={{
                fontSize: "18px",
                color: "rgb(98, 11, 169)",
                paddingTop: "5px",
                paddingButtom: "10px",
              }}
            >
              {" "}
              Questions Contributed ({stats})
            </p>
            <FontAwesomeIcon
              className="refresh"
              onClick={refreshPage}
              icon={faArrowsRotate}
            />
          </div>
          {question.map((q) => {
            return (
              <QuestionElement
                question={q}
                handleEditQuestion={handleEditQuestion}
                refreshPage={refreshPage}
              />
            );
          })}
        </div>
        <div className="contributormainscreen">
          <form>
            <label>
              <select value={category} onChange={handleCategoryChange}>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <select value={subcategory} onChange={handleSubcategoryChange}>
                <option value="">Select a subcategory</option>
                {categories
                  .find((cat) => cat.name === category)
                  ?.subcategories.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              <select value={difficulty} onChange={handleDifficultyChange}>
                <option value="">Select a difficulty level</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </label>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label>
                <br />

                <textarea
                  style={{
                    width: "100%",
                    height: "100px",
                    textAlign: "center",
                    marginBottom: "10px",
                    borderRadius: "30px",
                    border: "2px solid rgb(98, 11, 169)",
                    padding: "10px",
                    fontFamily: "Montserrat, sans-serif",
                    lineHeight: "150px",
                  }}
                  placeholder="Question"
                  type="text"
                  value={aquestion}
                  onChange={handleQuestionChange}
                />
              </label>
              {options.map((option, index) => (
                <div key={index} style={{ width: "100%" }}>
                  <input
                    type="radio"
                    name="options"
                    checked={selectedOption === index}
                    onChange={() => handleOptionSelect(index)}
                  />
                  <label>
                    <input
                      style={{ width: "95%" }}
                      placeholder={`Option ${index + 1}`}
                      type="text"
                      value={option}
                      onChange={(event) => handleOptionChange(event, index)}
                    />
                  </label>
                </div>
              ))}
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleEditClick}
                    disabled={!isEditEnabled}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleResetClick();
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAddClick}
                    disabled={!isAddEnabled}
                    style={{ marginTop: "25px" }}
                  >
                    Add
                  </button>
                  <button type="button" onClick={handleResetClick}>
                    Reset
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contributor;
