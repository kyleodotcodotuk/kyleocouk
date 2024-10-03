import React, { useState, useEffect } from "react";
import Me from "../img/me.svg";
import Github from "../icons/github.svg";

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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getMeridian = (hour) => {
    return hour >= 12 ? "PM" : "AM";
  };

  const formatTime = (time) => {
    const hours = time.getHours() % 12 || 12; // Handle 0 hour as 12 AM
    const minutes = time.getMinutes().toString().padStart(2, "0"); // Pad minutes with leading 0
    return `${hours}:${minutes} ${getMeridian(time.getHours())}`;
  };

  return (
    <header>
      <div className="left-side">
        <h1>Kyle O'Connor</h1>
        <h2>UI Developer</h2>

        <ul className="social-icons">
          <li>
            <a href="/" alt="#">
              <img src={Github} alt="" />
            </a>
          </li>
        </ul>

        <p className="date-and-time">
          Manchester &middot; United Kingdom
          <br />
          {formatTime(currentTime)}
          &nbsp;&middot;&nbsp;
          {`${currentTime.getDate()}${ordinalSuffixOf(currentTime.getDate())} ${
            monthNames[currentTime.getMonth()]
          } ${currentTime.getFullYear()}`}
        </p>
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
