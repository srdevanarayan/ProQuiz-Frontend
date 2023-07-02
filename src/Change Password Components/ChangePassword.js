import React from "react";
import "../Component CSS/register.css";
import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
const OTP_URL = "/requestotp/";
const VERIFY_URL = "/resetpassword";
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
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

  const [pwd1, setPwd1] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd1));
    setValidMatch(pwd1 === matchPwd);
  }, [pwd1, matchPwd]);

  useEffect(() => {
    let timer;
    if (enable) {
      timer = setTimeout(() => {
        setEnable(false);
        setSucMsg("");
        setPwd("");
        setPwd1("");
        setMatchPwd("");
      }, 180000);
    }
    return () => clearTimeout(timer);
  }, [enable]);

  useEffect(() => {
    setLoading(false);
    setotpLoading(false);
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
    if (user) {
      setSucMsg("");
    }
  }, [user, pwd]);

  const handleOtpRequest = async () => {
    setotpLoading(true);
    setErrMsg("");
    setSucMsg("");
    setMatchPwd("");
    setPwd1("");
    setPwd("");
    try {
      const response = await axios.post(
        `${OTP_URL}${user}`,
        JSON.stringify({ pwdchange: "true" }),
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
    setPwd("");
    const v1 = user;
    const v2 = PWD_REGEX.test(pwd1);
    if (!v1 || !v2 || !pwd) {
      setErrMsg("Invalid Entry");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        VERIFY_URL,
        JSON.stringify({ user, otp: pwd, pwd: pwd1 }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      //console.log(JSON.stringify(response?.data));
      setUser("");
      setPwd1("");
      setMatchPwd("");
      setSucMsg("Successfully Changed Password.");
      setEnable(false);
    } catch (err) {
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
          <h1 style={{ marginTop: "0.5rem", marginBottom: "0 rem" }}>
            Change Password
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
            style={{ marginBottom: "0.75rem" }}
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
              marginBottom: "0.75rem",
              opacity: enable ? 1 : 0.5,
            }}
            disabled={!enable}
          />
          <input
            className={validPwd || !pwd1 ? "valid" : "invalid"}
            placeholder="Enter New Password"
            type="password"
            id="password"
            onChange={(e) => setPwd1(e.target.value)}
            value={pwd1}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
            disabled={!enable}
            style={{ opacity: enable ? 1 : 0.5 }}
          />
          <p
            id="pwdnote"
            className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase & lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{" "}
            <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span>{" "}
            <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span>{" "}
            <span aria-label="percent">%</span>
          </p>

          <input
            className={validMatch || !matchPwd ? "valid" : "invalid"}
            placeholder="Confirm Password"
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
            disabled={!enable}
            style={{ opacity: enable ? 1 : 0.5 }}
          />
          <p
            id="confirmnote"
            className={matchFocus && !validMatch ? "instructions" : "offscreen"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
          </p>
          <button
            style={{
              marginTop: "0px",
            }}
            disabled={
              !enable || !validPwd || !pwd || !validMatch ? true : false
            }
            onClick={handleVerify}
          >
            Change Password{" "}
            {loading && <FontAwesomeIcon icon={faSpinner} spin />}
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
