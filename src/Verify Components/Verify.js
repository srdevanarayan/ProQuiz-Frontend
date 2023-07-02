import React from "react";
import "../Component CSS/register.css";
import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
const OTP_URL = "/requestotp/";
const VERIFY_URL = "/verify/";

const Verify = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const userRef = useRef();
  const errRef = useRef();
  const sucRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [sucMsg, setSucMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [otploading, setotpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enable, setEnable] = useState(false);
  useEffect(() => {
    let timer;
    if (enable) {
      timer = setTimeout(() => {
        setEnable(false);
        setSucMsg("");
        setPwd("");
      }, 180000);
    }
    return () => clearTimeout(timer);
  }, [enable]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleOtpRequest = async () => {
    setotpLoading(true);
    setErrMsg("");
    setSucMsg("");
    try {
      const response = await axios.post(
        `${OTP_URL}${user}`,

        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      //console.log(JSON.stringify(response?.data));
      setEnable(true);
      setSucMsg("OTP sent to mail. You can request a new one in 3 minutes.");
      setErrMsg("");
      //navigate("/Verify");
    } catch (err) {
      setSucMsg("");
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Wait for 3 mins to request OTP again.");
      } else if (err.response?.status === 401) {
        setErrMsg("User not found");
      } else if (err.response?.status === 422) {
        setErrMsg("User already verified");
      } else {
        setErrMsg("Verification failed");
      }
      errRef.current.focus();
    }
    setotpLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    setErrMsg("");
    setSucMsg("");
    try {
      const response = await axios.post(`${VERIFY_URL}${user}/${pwd}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      //console.log(JSON.stringify(response?.data));
      setSucMsg("Successfully verified account.");
      setErrMsg("");
      navigate("/login");
    } catch (err) {
      setSucMsg("");
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 401) {
        setErrMsg("OTP doesn't match.");
      } else {
        setErrMsg("Verification failed");
      }
      errRef.current.focus();
    }
    setLoading(false);
  };
  return (
    <>
      <div className="logo"></div>
      <section className="registersection">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <p
          ref={sucRef}
          className={sucMsg ? "sucmsg" : "offscreen"}
          aria-live="assertive"
        >
          {sucMsg}
        </p>
        <center>
          {" "}
          <h1 style={{ marginTop: "2rem", marginBottom: "0 rem" }}>
            Verify Account
          </h1>
        </center>

        <form
          className="registerform"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            disabled={enable}
            className="valid"
            placeholder="User Email"
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
            style={{ marginBottom: "0px" }}
          />
          <button
            disabled={enable}
            style={{ marginTop: "0px" }}
            onClick={(e) => handleOtpRequest()}
          >
            Send OTP {otploading && <FontAwesomeIcon icon={faSpinner} spin />}
          </button>

          <input
            className="valid"
            placeholder="OTP"
            type="password"
            maxLength="6"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            style={{
              marginBottom: "0px",
              opacity: enable ? 1 : 0.5,
            }}
            disabled={!enable}
          />
          <button
            style={{
              marginTop: "0px",
            }}
            disabled={!enable}
            onClick={handleVerify}
          >
            Verify {loading && <FontAwesomeIcon icon={faSpinner} spin />}
          </button>
        </form>
        <center>
          <p className="othertext">
            Need an Account? &nbsp;
            <span className="line">
              {/*put router link here*/}
              <Link to="/register">Sign Up</Link>
            </span>
            <br />
            <br />
            <Link to="/">Back to Home</Link>
          </p>
        </center>
      </section>
    </>
  );
};

export default Verify;
