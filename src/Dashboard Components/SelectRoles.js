import { Link } from "react-router-dom";
import "../Component CSS/dashboard.css";
const SelectRole = () => {
  return (
    <main className="SelectRole">
      <p className="SelectRole-p">Continue As</p>
      <section className="SelectRole-row1">
        <Link to="/qmaker">
          <button className="SelectRole-QM" type="button">
            Quiz Maker
          </button>
        </Link>
        <Link to="/qtaker">
          <button className="SelectRole-QT" type="button">
            Quiz Taker
          </button>
        </Link>
      </section>
      <section className="SelectRole-row2">
        <Link to="/contributor">
          <button className="SelectRole-QC" type="button">
            Question Contributer
          </button>
        </Link>
        <Link to="/validator">
          <button className="SelectRole-QV" type="button">
            Question Validator
          </button>
        </Link>
      </section>
      <p className="SelectRole-p">Or</p>
      <section className="SelectRole-row3">
        <Link to="/viewqb">
          <button className="SelectRole-browseQB" type="button">
            Browse Question Bank
          </button>
        </Link>
      </section>
    </main>
  );
};
export default SelectRole;
