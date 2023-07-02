import React from "react";
import Navbar from "./Navbar";
import QBQuestion from "./QBQuestion";
import FilterAndSort from "./FilterAndSort";
import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
const QBViewer = () => {
  const renderRan = useRef(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState();
  const [qbquestions, setqbquestions] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [endOfResults, setEndOfResults] = useState(true);
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    if (renderRan.current === true || process.env.NODE_ENV !== "development") {
      const getUsers = async () => {
        try {
          const response = await axiosPrivate.get("/qb/categories", {
            signal: controller.signal,
          });
          isMounted && setCategories(response.data);
        } catch (err) {
          if (err) {
            navigate("/login", { state: { from: location }, replace: true });
          }
        }
      };

      getUsers();
    }
    return () => {
      renderRan.current = true;
      isMounted = false;
      controller.abort();
    };
  }, []);

  function handleQuestionFetch(questions) {
    setqbquestions(questions);
  }
  function changePageNumber(pgnumber) {
    setPageNumber(pgnumber);
  }
  function changeEndOfResults(status) {
    setEndOfResults(status);
  }

  return (
    <>
      <Navbar />
      <FilterAndSort
        categories={categories}
        handleQuestionFetch={handleQuestionFetch}
        pageNumber={pageNumber}
        changePageNumber={changePageNumber}
        endOfResults={endOfResults}
        changeEndOfResults={changeEndOfResults}
      />
      <QBQuestion
        qbquestions={qbquestions}
        pageNumber={pageNumber}
        changePageNumber={changePageNumber}
        endOfResults={endOfResults}
      />
    </>
  );
};

export default QBViewer;
