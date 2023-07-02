import React, { useEffect } from "react";
import { useState, useRef } from "react";
import LoadingOverlay from "../LoadingOverlay";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Popup from "reactjs-popup";
import Navbar from "../QBViewer Components/Navbar";
import "../Component CSS/approval.css";
const Approval = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Getting quiz details..."
  );
  const [selectedOption, setSelectedOption] = useState("Requested");
  const handleChange = async (event) => {
    setItems([]);
    setLoadingMessage("Please wait...");
    setIsLoading(true);
    setSelectedOption(event.target.value);
    try {
      const response = await axiosPrivate.post(
        "/quiz/getparticipants",
        JSON.stringify({
          quizid: state.quizid,
          userclass: event.target.value.toLowerCase(),
        })
      );
      setItems(response.data.users);
      setapprovalAllowed(response.data.approval === "open" ? true : false);
      setSelectedOption(event.target.value);
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
              userclass: selectedOption.toLowerCase(),
            }),
            {
              signal: controller.signal,
            }
          );
          isMounted && setItems(response.data.users);
          setapprovalAllowed(response.data.approval === "open" ? true : false);
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
  const [checkedItems, setCheckedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [approvalAllowed, setapprovalAllowed] = useState(false);
  const [items, setItems] = useState([]);
  const handleSelectChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingMessage("Please wait...");
    setIsLoading(true);

    try {
      const response = await axiosPrivate.put(
        "/quiz/manageparticipants",
        JSON.stringify({
          quizid: state.quizid,
          userlist: Object.keys(checkedItems).filter(
            (key) => checkedItems[key]
          ),
          action: event.target.value.toLowerCase(),
        })
      );

      window.location.reload();
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
  const filteredItems = items.filter((item) =>
    item.user.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleApprovalChange = async (e) => {
    setLoadingMessage("Please wait...");
    setIsLoading(true);
    try {
      const response = await axiosPrivate.put(
        "/quiz/manageparticipants",
        JSON.stringify({
          quizid: state.quizid,
          status: e.target.checked ? "open" : "close",
        })
      );

      setapprovalAllowed(!approvalAllowed);
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
      {isLoading ? <LoadingOverlay text={loadingMessage} /> : null} <Navbar />
      <div className="approvalcontainer">
        <div className="approvalheader">
          <select
            className="approvalselect"
            value={selectedOption}
            onChange={handleChange}
          >
            <option value="Requested">Requested</option>
            <option value="Approved">Approved</option>
            <option value="Blocked">Blocked</option>
          </select>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <label style={{ fontSize: "18px" }}>Accept approval requests</label>
            <input
              style={{
                width: "30px",
                height: "30px",
                marginLeft: "10px",
              }}
              type="checkbox"
              checked={approvalAllowed}
              onChange={(e) => handleApprovalChange(e)}
            />
          </div>
        </div>

        <input
          disabled={!approvalAllowed}
          type="text"
          placeholder="Search"
          className="approvalsearch "
          onChange={handleSearch}
        />
        <div className="approvallist">
          <form disabled={!approvalAllowed}>
            <table>
              <thead></thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.user}>
                    <td className="tdvalue">{item.name}</td>
                    <td className="tdvalue">{item.user}</td>
                    <td>
                      <center
                        style={{
                          marginRight: "4px",
                        }}
                      >
                        <input
                          disabled={!approvalAllowed}
                          className="tdcheck"
                          type="checkbox"
                          name={item.user}
                          checked={checkedItems[item.user]}
                          onChange={handleSelectChange}
                        />
                      </center>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />
          </form>

          <style>{`
        table {
          border-collapse: collapse;
          width: 100%;
        }
tr{

  border-bottom:2px dashed rgb(98, 11, 169);
  margin-bottom:10px;
}
       
        td.tdvalue {
          font-size:18px;
          text-align: left;
          padding: 10px;
          border-right:2px solid rgb(98, 11, 169);
          padding-left:30px;
          
        }

        th {
          background-color: #f2f2f2;
        }
td.tdcheck{
padding:10px;
}

        td input[type='checkbox'] {
         
         margin-left:50px;
         margin-top:5px; 
        width:30px;
          height: 30px;
         
        }
        input[type=checkbox]:checked {
          accent-color: rgb(98, 11, 169);
        }
      `}</style>
        </div>
        <button
          onClick={handleSubmit}
          className="approvalbut"
          type="submit"
          value={
            selectedOption === "Requested"
              ? "Approve"
              : selectedOption === "Approved"
              ? "Block"
              : selectedOption === "Blocked"
              ? "Unblock"
              : null
          }
          disabled={
            !Object.values(checkedItems).includes(true) || !approvalAllowed
          }
        >
          {selectedOption === "Requested"
            ? "Approve"
            : selectedOption === "Approved"
            ? "Block"
            : selectedOption === "Blocked"
            ? "Unblock"
            : null}
        </button>
      </div>
    </>
  );
};

export default Approval;
