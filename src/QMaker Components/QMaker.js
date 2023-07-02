import React, { useState } from "react";
import DropDown from "../QBViewer Components/DropDown";
import Navbar from "../QBViewer Components/Navbar";
import "../Component CSS/qmaker.css";
import Sidepanel from "./Sidepanel";
import CreateEditQuizWindow from "./CreateEditQuizWindow";

import LoadingOverlay from "../LoadingOverlay";
const QMaker = () => {
  const [quizDetails, setQuizDetails] = useState();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const setQuizDetailsfn = (details) => {
    setQuizDetails(details);
  };
  const setQuizQuestionsfn = (details) => {
    setQuizQuestions(details);
  };
  const triggerRefresh = () => {
    setRefresh(!refresh);
  };
  return (
    <>
      <Navbar />
      <div className="qmakercontainer">
        <Sidepanel
          setQuizDetailsfn={setQuizDetailsfn}
          setQuizQuestionsfn={setQuizQuestionsfn}
          refresh={refresh}
          quizQuestions={quizQuestions}
          triggerRefresh={triggerRefresh}
        />
        <CreateEditQuizWindow
          quizDetails={quizDetails}
          quizQuestions={quizQuestions}
          refresh={refresh}
          triggerRefresh={triggerRefresh}
        />
      </div>
    </>
  );
};

export default QMaker;
