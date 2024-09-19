import React, { useState, useEffect } from "react";
import Me from "../img/me.svg";
import GitHub from "./../icons/github.svg";

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
        <img
          src={Me}
          alt="Me"
          id="Me"
          title="A picture of me"
          height="330px"
          width="330px"
          loading="lazy"
        />
        <h1>Kyle O'Connor</h1>
        <h2>UI Developer</h2>
        
        <ul className="social-icons">
          <li>
            <a
              href="https://github.com/kyleodotcodotuk"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              alt="GitHub"
              title="GitHub"
            >
              <img
                src={GitHub}
                className="fa fa-github"
                alt="GitHub"
                title="GitHub"
              />
            </a>
          </li>
        </ul>
        <div className="date-and-time">
          <p>
            <strong>{formatTime(currentTime)}</strong>
            <span>|</span>
            {`${currentTime.getDate()}${ordinalSuffixOf(
              currentTime.getDate()
            )} ${
              monthNames[currentTime.getMonth()]
            } ${currentTime.getFullYear()}`}
          </p>
        </div>
      </div>

      <div className="blurb">
        <p>
          With vast expertise in front-end development including the likes of
          React, JavaScript and PHP. I am well-equipped to tackle a wide range
          of web development projects, including my current positon where I work
          primarily with software.
        </p>
        <p>
          With several years and experience in different areas, my experience
          has given me a unique perspective and adaptability to work in diverse
          environments and different types of businesses.
        </p>
      </div>
    </header>
  );
}
