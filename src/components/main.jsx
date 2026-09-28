import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../contexts/ContentContext";
import useDocumentTitle, { SITE_NAME } from "../hooks/useDocumentTitle";
import Me from "../img/me.svg";
import Github from "../icons/github.svg";
import Email from "../icons/email.svg";
import Linkedin from "../icons/linkedin.svg";
import Cv from "../icons/cv.svg";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const roles = [
  "Developer",
  "Wizard",
  "Expert",
  "Engineer",
  "Designer",
  "Architect",
  "Specialist",
  "Lead",
  "Mentor",
  "Consultant",
  "Innovator",
  "Problem Solver",
  "Creator",
  "Strategist",
  "Technologist",
  "Professional",
];

const effectiveRoles = roles;

const ordinalSuffixOf = (i) => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
};

export default function Header() {
  const { content } = useContent();
  const { personal, social } = content;
  // Matches the <title> in public/index.html, restored when coming back from the CMS
  useDocumentTitle(`Professional Web Developer and Designer | ${SITE_NAME}`);
  const skills = (personal.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotate roles automatically every 6 seconds.
  useEffect(() => {
    const len = effectiveRoles.length || 1;
    const roleTimer = setInterval(() => {
      setRoleIndex((index) => (index + 1) % len);
    }, 6000);

    return () => clearInterval(roleTimer);
  }, []);

  const getMeridian = (hour) => {
    return hour >= 12 ? "pm" : "am";
  };

  const formatTime = (time) => {
    const hours = time.getHours() % 12 || 12; // Handle 0 hour as 12 AM
    const minutes = time.getMinutes().toString().padStart(2, "0"); // Pad minutes with leading 0
    return `${hours}:${minutes} ${getMeridian(time.getHours())}`;
  };

  return (
    <header>
      <div className="left-side">
        {/* Screen readers get the real job title; the rotating word is decorative */}
        <h1>
          <span className="visually-hidden">{personal.title}</span>
          <span aria-hidden="true">
            UI {effectiveRoles[roleIndex % effectiveRoles.length]}
          </span>
        </h1>

        <h2>{personal.name}</h2>

        <p className="tagline">{personal.tagline}</p>

        {skills.length > 0 && (
          <ul className="skills" aria-label="What I focus on">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        )}

        <p className="date-and-time">
          {personal.location}
          <br />
          <time dateTime={currentTime.toISOString()}>
            <strong>{formatTime(currentTime)}</strong>
            &nbsp;&middot;&nbsp;
            {`${currentTime.getDate()}${ordinalSuffixOf(currentTime.getDate())} ${
              monthNames[currentTime.getMonth()]
            } ${currentTime.getFullYear()}`}
          </time>
          <span className="visually-hidden"> (my local time)</span>
        </p>

        <ul className="contact-links">
          {social.github && (
            <li>
              <a
                className="icon-link"
                href={social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub (opens in a new tab)"
              >
                <img src={Github} alt="" />
              </a>
            </li>
          )}
          <li>
            <a
              className="icon-link"
              href="mailto:info@kyleo.co.uk"
              aria-label="Email me"
            >
              <img src={Email} alt="" />
            </a>
          </li>
          {social.linkedin && (
            <li>
              <a
                className="icon-link"
                href={social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn (opens in a new tab)"
              >
                <img src={Linkedin} alt="" />
              </a>
            </li>
          )}
          {social.cv && (
            <li>
              <a
                className="icon-link"
                href={social.cv}
                target="_blank"
                rel="noreferrer"
                aria-label="CV (opens in a new tab)"
              >
                <img src={Cv} alt="" />
              </a>
            </li>
          )}
        </ul>

        <Link className="btn btn-secondary btn-static-bottom-right" to="/login">
          See my component work <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="right-side">
        <div className="image-wrapper">
          <img
            src={Me}
            alt={`Illustration of ${personal.name}`}
            height="360"
            width="360"
            fetchpriority="high"
          />
        </div>
      </div>
    </header>
  );
}
