import { Link } from "react-router-dom";
import "../Component CSS/home.css";
import { useState, useEffect } from "react";
const Home = () => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    setShowLogo(true);
  }, []);
  return (
    <main className="Home">
      <center>
        <div className={`homelogo ${showLogo ? "show" : ""}`}></div>
        <p
          className={`homep ${showLogo ? "show" : ""}`}
          style={{ marginTop: "15px" }}
        >
          Strive for progress, not perfection.
        </p>
      </center>
      <ul className="Home-list">
        <li>
          <Link to="/login">
            <button className={`Home-signinButton ${showLogo ? "show" : ""}`}>
              Sign In
            </button>
          </Link>
        </li>
        <li>
          <Link to="/register">
            <button className={`Home-signupButton ${showLogo ? "show" : ""}`}>
              Register
            </button>
          </Link>
        </li>
      </ul>
    </main>
  );
};
export default Home;
