import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../contexts/ContentContext";
import Me from "../img/me.svg";
import Github from "../icons/github.svg";
import Bitcoin from "../icons/bitcoin.svg";

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

const roles = ["Developer", "Expert", "Professional", "Engineer", "Specialist" , "Wizard"];

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

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function Header() {
  const { content } = useContent();
  const { personal, social } = content;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const roleTimer = setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length);
    }, 5000);

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
          <span aria-hidden="true">UI {roles[roleIndex]}</span>
        </h1>

        <h2>{personal.name}</h2>

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
        </p>

        <ul className="social-icons">
          {social.github && (
            <li>
              <a
                href={social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub (opens in a new tab)"
              >
                <img src={Github} alt="" />
              </a>
            </li>
          )}
          {social.bitcoin && (
            <li>
              <a
                href={social.bitcoin}
                target="_blank"
                rel="noreferrer"
                aria-label="Tip me in Bitcoin (opens in a new tab)"
              >
                <img src={Bitcoin} alt="" />
              </a>
            </li>
          )}
        </ul>

        <div className="bio-area">
          <p>{personal.bio}</p>
          <div className="button-wrapper">
            <a className="btn btn-secondary" href={`mailto:${personal.email}`}>
              {personal.email}
            </a>
            <Link className="btn btn-secondary" to="/login">
              Explore the CMS demo
            </Link>
          </div>
        </div>
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
