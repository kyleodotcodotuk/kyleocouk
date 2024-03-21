import React, { useState, useEffect } from 'react';
import Me from "../img/me.png"; 

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
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
}

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header>
      <div className="centered">
        <img
          src={Me}
          alt="Me"
          id="Me"
          title="A picture of me"
          height="330px"
          width="330px"
          loading="lazy"
        />

        <div>
          <h1>Kyle O'Connor</h1>
          <br />
          <h2>UI Developer</h2>
        </div>

        <div className="date-and-time">
          <p>
            <strong>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            <span>|</span>
            {`${currentTime.getDate()}${ordinalSuffixOf(currentTime.getDate())} ${monthNames[currentTime.getMonth()]} ${currentTime.getFullYear()}`}
          </p>
        </div>
      </div>
    </header>
  );
}
