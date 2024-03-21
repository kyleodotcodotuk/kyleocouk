import React, { useState, useEffect } from 'react';
import Me from "../img/me.png"; 

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
            {`${monthNames[currentTime.getMonth()]} ${currentTime.getDate()}, ${currentTime.getFullYear()}`}
          </p>
        </div>
      </div>
    </header>
  );
}