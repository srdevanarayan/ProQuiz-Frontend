import React, { useEffect } from "react";
import { useState, useRef } from "react";
import "../Component CSS/qbquestion.css";
import Select from "react-select";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import makeAnimated from "react-select/animated";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay";
import Popup from "reactjs-popup";
import "../Component CSS/popupstyle.css";

const FilterAndSort = ({
  categories = [],
  handleQuestionFetch,
  pageNumber,
  endOfResults,
  changePageNumber,
  changeEndOfResults,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const categoryOptions = categories.map((category) => {
    return { value: category, label: category };
  });
  const sortbyOptions = [
    { value: "rating", label: "Rating" },
    { value: "created", label: "Created" },
    { value: "verified", label: "Verified" },
  ];
  const difficultyOptions = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];
  const [subcatoptions, setSubcatoptions] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [subcategoryLoading, setSubCategoryLoading] = useState(false);
  const [categoryOption, setCategoryOption] = useState();
  const [subcategoryOption, setsubcategoryOption] = useState();
  const [value, setValue] = useState("");
  const [difficultyOption, setdifficultyOption] = useState("easy");
  const [sortbyOption, setsortbyOption] = useState("rating");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Fetching questions...");

  const [optionchanged, setoptionschanged] = useState(false);

  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(
    "You already rated this question!"
  );
  const pagesize = 5;
  const renderRan = useRef(0);
  useEffect(() => {
    if (optionchanged === true) {
      return;
    }
    let isMounted = true;
    if (
      renderRan.current > 1 ||
      (process.env.NODE_ENV !== "development" && renderRan.current > 0)
    ) {
      getqbquestions();
    }
    return () => {
      renderRan.current = renderRan.current + 1;
      isMounted = false;
    };
  }, [pageNumber]);

  useEffect(() => {
    const setcategoryLoading = () => {
      if (categoryOptions) setCategoryLoading(undefined);
    };
    setcategoryLoading();
  }, [categoryOptions]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    if (renderRan.current === true || process.env.NODE_ENV !== "development") {
      if (categoryOption) {
        setValue("");
        setsubcategoryOption();
        const getsubcats = async () => {
          try {
            const response = await axiosPrivate.post(
              "/qb/subcategories",
              JSON.stringify({ category: categoryOption?.value }),
              {
                signal: controller.signal,
              }
            );

            if (isMounted) {
              let subcatsarray = response.data;
              setSubcatoptions(
                subcatsarray.map((subcategory) => {
                  return { value: subcategory, label: subcategory };
                })
              );
            }
          } catch (err) {
            if (err) {
              navigate("/login", { state: { from: location }, replace: true });
            }
          }
        };
        getsubcats();
      }
    }
    return () => {
      renderRan.current = true;
      isMounted = false;
      controller.abort();
    };
  }, [categoryOption]);

  const getqbquestions = async (event) => {
    if (event?.target.id === "searchButton") {
      setoptionschanged(true);
      changePageNumber(1);
    }
    setoptionschanged(false);
    setIsLoading(true);
    setLoadingMessage("Fetching questions...");
    try {
      const response = await axiosPrivate.post(
        "/qb/questions",
        JSON.stringify({
          category: categoryOption?.value,
          subcategory: subcategoryOption?.value,
          difficulty: difficultyOption.value || "easy",
          sortby: sortbyOption.value || "rating",
          pagesize: pagesize,
          pagenumber: event?.target.id === "searchButton" ? 1 : pageNumber,
          getanswer: "true",
        })
      );
      /* console.log(
        categoryOption?.value,
        subcategoryOption?.value,
        difficultyOption.value,
        sortbyOption.value,
        pagesize,
        pageNumber
      ); */
      handleQuestionFetch(response.data);
      if (response?.data?.length === 0) {
        changeEndOfResults(true);
        setPopupMessage(
          "There are no more questions to fetch at this time. Please check back later for more questions."
        );
        setPopup(true);
      } else if (response?.data.length < pagesize) {
        changeEndOfResults(true);
        setPopupMessage(
          "End of questions. Please check back later for more questions."
        );
        setPopup(true);
      } else {
        changeEndOfResults(false);
      }
    } catch (err) {
      if (err) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setPopup(false);
    }, 10000);
  }, [popup]);
  return (
    <>
      <Popup
        open={popup}
        position="right center"
        onClose={() => setPopup(false)}
      >
        <div>{popupMessage}</div>
      </Popup>
      ;{isLoading ? <LoadingOverlay text={loadingMessage} /> : null}
      <nav className="filterandsort">
        <div className="filterandsortcontainer">
          Filter by
          <Select
            style={{ marginLeft: "20px" }}
            options={categoryOptions}
            placeholder="Category"
            defaultValue={categoryOptions[0]}
            isLoading={categoryLoading}
            noOptionsMessage={() => {
              return <p style={{ fontSize: "15px" }}>Not found</p>;
            }}
            onChange={(selectedOption) => {
              setCategoryOption(selectedOption);
            }}
            isSearchable="true"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderRadius: "30px",
                fontSize: "15px",
              }),
              option: (base) => ({
                ...base,
                border: "1px solid black",
                height: "100%",
                color: "black",
                fontSize: "15px",
                transition: "0.3s",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: "rgb(165, 71, 242)",
                primary: "darkviolet",
              },
              spacing: {
                ...theme.spacing,
                controlHeight: 30,
                baseUnit: 3,
              },
            })}
          />
          <Select
            options={subcatoptions}
            placeholder="Subcategory"
            defaultValue={subcatoptions[0]}
            isDisabled={!categoryOption ? true : false}
            isLoading={subcategoryLoading}
            value={value}
            noOptionsMessage={() => {
              return <p style={{ fontSize: "15px" }}>Not found</p>;
            }}
            onChange={(selectedOption) => {
              setsubcategoryOption(selectedOption);
              setValue(selectedOption);
            }}
            isSearchable="true"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderRadius: "30px",
                fontSize: "15px",
              }),
              option: (base) => ({
                ...base,
                border: "1px solid black",
                height: "100%",
                color: "black",
                fontSize: "15px",
                transition: "0.3s",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: "rgb(165, 71, 242)",
                primary: "darkviolet",
              },
              spacing: {
                ...theme.spacing,
                controlHeight: 30,
                baseUnit: 3,
              },
            })}
          />
          <Select
            options={difficultyOptions}
            placeholder="Difficulty"
            defaultValue={difficultyOptions[0]}
            onChange={(selectedOption) => {
              setdifficultyOption(selectedOption);
            }}
            noOptionsMessage={() => {
              return <p style={{ fontSize: "15px" }}>Not found</p>;
            }}
            isSearchable="true"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderRadius: "30px",
                fontSize: "15px",
              }),
              option: (base) => ({
                ...base,
                border: "1px solid black",
                height: "100%",
                color: "black",
                fontSize: "15px",
                transition: "0.3s",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: "rgb(165, 71, 242)",
                primary: "darkviolet",
              },
              spacing: {
                ...theme.spacing,
                controlHeight: 30,
                baseUnit: 3,
              },
            })}
          />
        </div>
        <div className="filterandsortcontainer" style={{ width: "30%" }}>
          Sort by
          <Select
            options={sortbyOptions}
            placeholder="Rating"
            defaultValue={sortbyOptions[0]}
            onChange={(selectedOption) => {
              setsortbyOption(selectedOption);
            }}
            noOptionsMessage={() => {
              return <p style={{ fontSize: "15px" }}>Not found</p>;
            }}
            isSearchable="true"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderRadius: "30px",
                fontSize: "15px",
              }),
              option: (base) => ({
                ...base,
                border: "1px solid black",
                height: "100%",
                color: "black",
                fontSize: "15px",
                transition: "0.3s",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: "rgb(165, 71, 242)",
                primary: "darkviolet",
              },
              spacing: {
                ...theme.spacing,
                controlHeight: 30,
                baseUnit: 3,
              },
            })}
          />
        </div>
        <div
          className="filterandsortcontainer"
          style={{ justifySelf: "flex-end", width: "20%" }}
        >
          <button
            id="searchButton"
            disabled={!categoryOption || !subcategoryOption ? true : false}
            onClick={getqbquestions}
          >
            Search
          </button>
        </div>
      </nav>
    </>
  );
};

export default FilterAndSort;
