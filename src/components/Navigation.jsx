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
            Overview
            <span className="sr-only">(current)</span>
          </Link>
        </li>
        <li
          className={`nav  ${
            props.location.pathname === "/services" ? "active" : ""
          }`}
        >
          <Link to="/services">Services</Link>
        </li>

        <li
          className={`nav  ${
            props.location.pathname === "/portfolio" ? "active" : ""
          }`}
        >
          <Link to="/portfolio">Portfolio</Link>
        </li>

        <li
          className={`nav  ${
            props.location.pathname === "/what" ? "active" : ""
          }`}
        >
          <Link to="/what">Coding</Link>
        </li>
      </ul>
    </nav>
  );
}

export default withRouter(Navigation);
