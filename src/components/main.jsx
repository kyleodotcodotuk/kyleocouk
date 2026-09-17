import React, { useState, useEffect } from "react";
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

export default function Header() {
  const { content } = useContent();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
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
        <h1>UI {roles[roleIndex]}</h1>

        <h2>Kyle O'Connor</h2>

        <p className="date-and-time">
          {content.personal.location}
          <br />
          <strong>{formatTime(currentTime)}</strong>
          &nbsp;&middot;&nbsp;
          {`${currentTime.getDate()}${ordinalSuffixOf(currentTime.getDate())} ${
            monthNames[currentTime.getMonth()]
          } ${currentTime.getFullYear()}`}
        </p>

        
        <ul className="social-icons">
          {content.social.github && (
            <li>
              <a
                href={content.social.github}
                target="_blank"
                rel="noreferrer"
                alt="Scrutinise me"
              >
                <img src={Github} alt="github icon" />
              </a>
            </li>
          )}
          {content.social.bitcoin && (
            <li>
              <a
                href={content.social.bitcoin}
                target="_blank"
                rel="noreferrer"
                alt="Gimmie gimmie gimmie"
              >
                <img src={Bitcoin} alt="bitcoin icon" />
              </a>
            </li>
          )}
        </ul>

        <div className="bio-area">
          <p>
            Hello, I am Kyle O'Connor! Currently a UI developer, AKA a front end
            developer, web designer or other similar terminology. I live in
            Tameside, more well known as a part of Greater Manchester. With a
            remote based job for a company in Surrey. Interested in any
            services, I'll see what I can do for you, email me.
          </p>
          <div className="button-wrapper">
          <a
            className="btn btn-secondary"
            tabIndex="0"
            href={`mailto:${content.personal.email}`}
          >
            {content.personal.email}
          </a>
          <a className="btn btn-secondary" tabIndex="0" href="/admin">
            See admin
          </a>
        </div>
        </div>
      </div>

      <div className="right-side">
        <div className="image-wrapper">
          <img
            src={Me}
            alt="Me"
            title="A picture of me"
            height="360px"
            width="360px"
            loading="lazy"
          />
        </div>
      </div>
    </header>
  );
}
