import React from "react";
import "../Component CSS/register.css";
import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      //console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, roles, accessToken });
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (
        err.response?.status === 401 &&
        err.response.data.message === "User not verified."
      ) {
        setErrMsg("User not verified");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
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
        <center>
          {" "}
          <h1 style={{ marginTop: "2rem", marginBottom: "0 rem" }}>Sign In</h1>
        </center>

        <form className="registerform" onSubmit={handleSubmit}>
          <input
            className="valid"
            placeholder="User Email"
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
          />

          <input
            className="valid"
            placeholder="Password"
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <button>
            Sign In {loading && <FontAwesomeIcon icon={faSpinner} spin />}
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
            <span className="line" style={{ marginTop: "7px" }}>
              {/*put router link here*/}
              <Link to="/verify">Verify your account</Link>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link to="/changepassword">Forgot password?</Link>
            </span>
            <br style={{ marginBottom: "15px" }} />
            <Link to="/">Back to Home</Link>
          </p>
        </center>
      </section>
    </>
  );
};

export default Login;
