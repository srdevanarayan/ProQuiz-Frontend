import useLogout from "../hooks/useLogout";
import edit from "../icons/edit.png";
import { useNavigate } from "react-router-dom";
import logouticon from "../icons/log-out.png";
import "../Component CSS/dropdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import LoadingOverlay from "../LoadingOverlay";
import React, { useState, useEffect, useRef } from "react";
const DropDown = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const [loading, setLoading] = useState(false);
  const signOut = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigate("/login");
  };
  const [open, setOpen] = useState(false);
  const changePassword = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigate("/changepassword");
  };
  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return (
    <div>
      {loading && <LoadingOverlay text="Logging out..." />}
      <div className="menu-container" ref={menuRef}>
        <div
          className="menu-trigger"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <div className="usericoncircle">
            <FontAwesomeIcon icon={faUser} className="usericon" />
          </div>
        </div>

        <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
          <ul>
            <DropdownItem
              img={edit}
              text={"Change Password"}
              onClick={changePassword}
            />
            <DropdownItem img={logouticon} text={"Logout"} onClick={signOut} />
          </ul>
        </div>
      </div>
    </div>
  );
};

function DropdownItem(props) {
  return (
    <li className="dropdownItem">
      <img src={props.img}></img>
      <a onClick={props.onClick}> {props.text} </a>
    </li>
  );
}

export default DropDown;
