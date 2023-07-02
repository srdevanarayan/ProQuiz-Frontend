import Register from "./Register Components/Register";
import Login from "./Login Components/Login";
import RequireAuth from "./RequireAuth";
import Layout from "./Layout";
import { useNavigate, useLocation } from "react-router-dom";
import PersistLogin from "./PersistLogin";
import Home from "./HomeComponents/Home";
import Dashboard from "./Dashboard Components/Dashboard";
import QBViewer from "./QBViewer Components/QBViewer";
import Verify from "./Verify Components/Verify";
import QMaker from "./QMaker Components/QMaker";
import ChangePassword from "./Change Password Components/ChangePassword";
import { Route, Routes } from "react-router-dom";
import Approval from "./approvalComponents/Approval";
import Contributor from "./questionContributor Components/Contributor";
import "./index.css";
import QuestionValidator from "./Question Validator Components/QuestionValidator";
import Unauthorized from "./Unauthorized";
import QTaker from "./QTaker Components/QTaker";
import Response from "./response Components.js/Response";
const ROLES = {
  Admin: 5150,
  Expert: 1984,
  User: 2001,
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/changepassword" element={<ChangePassword />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            {/* Add protected routes here */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/viewqb" element={<QBViewer />} />
            <Route path="/qmaker" element={<QMaker />} />
            <Route path="/approval" element={<Approval />} />
            <Route path="/response" element={<Response />} />
            <Route path="/contributor" element={<Contributor />} />
            <Route path="/qtaker" element={<QTaker />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Expert]} />}>
            <Route path="/validator" element={<QuestionValidator />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <>
              <center>
                <div className="homelogo show"></div> <p>Page not found!</p>
                <button
                  className="notfoundbutton"
                  style={{
                    padding: "0.5rem",
                    background: "rgb(98, 11, 169)",
                    color: "#fff",
                    borderRadius: "30px",
                    border: "none",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/dashboard")}
                >
                  Return to Home
                </button>
              </center>
            </>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
