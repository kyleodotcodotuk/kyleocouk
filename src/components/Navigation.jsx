import React from "react";
import { Link, withRouter } from "react-router-dom";

function Navigation(props) {
  return (
    <nav className="navigation">
      <ul className="wrapper">
        <li
          className={`nav  ${props.location.pathname === "/" ? "active" : ""}`}
        >
          <Link to="/">
            Expertise
            <span className="sr-only">(current)</span>
          </Link>
        </li>
        <li
          className={`nav  ${
            props.location.pathname === "/blogfeed" ? "active" : ""
          }`}
        >
          <Link to="/blogfeed">Blog Feed</Link>
        </li>

        {/* <li
          className={`nav  ${
            props.location.pathname === "/portfolio" ? "active" : ""
          }`}
        >
          <Link to="/portfolio">Recent Work</Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default withRouter(Navigation);
