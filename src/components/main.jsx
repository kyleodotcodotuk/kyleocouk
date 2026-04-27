import React, { useState, useEffect } from "react";
import { useContent } from "../contexts/ContentContext";
import Me from "../img/me.svg";
import Me2 from "../img/me.png";
import Code from "../img/code.png";
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getMeridian = (hour) => {
    return hour >= 12 ? "pm" : "am";
  };

  const formatTime = (time) => {
    const hours = time.getHours() % 12 || 12; // Handle 0 hour as 12 AM
    const minutes = time.getMinutes().toString().padStart(2, "0"); // Pad minutes with leading 0
    return `${hours}:${minutes} ${getMeridian(time.getHours())}`;
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <header>
      <div className="left-side">
        <h1>{content.personal.title}</h1>
        <h2>{content.personal.name}</h2>

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

        <p className="date-and-time">
          {content.personal.location}
          <br />
          <strong>{formatTime(currentTime)}</strong>
          &nbsp;&middot;&nbsp;
          {`${currentTime.getDate()}${ordinalSuffixOf(currentTime.getDate())} ${
            monthNames[currentTime.getMonth()]
          } ${currentTime.getFullYear()}`}
        </p>

        <div className="content-switcher">
          <ul>
            <li
              onClick={() => handleTabClick(0)}
              onKeyDown={(e) => e.key === "Enter" && handleTabClick(0)}
              className={activeTab === 0 ? "active" : ""}
              tabIndex="0"
            >
              Me
            </li>
            <li
              onClick={() => handleTabClick(1)}
              onKeyDown={(e) => e.key === "Enter" && handleTabClick(1)}
              className={activeTab === 1 ? "active" : ""}
              tabIndex="0"
            >
              Expertise
            </li>
          </ul>
          <div>
            {activeTab === 0 && (
              <div className="tab-content">
                <div>
                  {content.personal.bio.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))} 
                    <a
                      className="btn"
                      tabIndex="0"
                      href={`mailto:${content.personal.email}`}
                    >
                      {content.personal.email}
                    </a>
            
                    <a
                      className="btn"
                      tabIndex="0"
                      href="/portfolio"
                    >
                      View My Portfolio
                    </a> 
                    <a
                      className="btn"
                      tabIndex="0" href="/admin">See admin</a>
                </div>
                <img src={Me2} alt="Me" />
              </div>
            )}
            {activeTab === 1 && (
              <div className="tab-content">
                <div>
                  {content.expertise.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <img src={Code} alt="" />
              </div>
            )}
            {activeTab === 2 && (
              <div className="tab-content">
                <div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Praesent neque nisl, cursus a condimentum eu, posuere non
                    augue.
                  </p>
                </div>
                <img
                  width={200}
                  height={200}
                  src="https://picsum.photos/200"
                  alt=""
                />
              </div>
            )}
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
