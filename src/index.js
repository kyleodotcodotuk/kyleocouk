import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState } from 'react';
import { Header, Welcome, Content, Posts, Timeline, Footer } from "./components";
import "./sass/_all.scss";

const Website = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const buttonText = isDarkMode ? 'Default Theme' : 'Light Theme';

  return (
    <React.StrictMode>
      <div className={!isDarkMode ? 'default ' : 'light-theme'}>
        <button className='theme-changer' onClick={handleToggleTheme}>Switch theme to: {buttonText}</button>
        <Header />
        <Welcome />
        <Posts />
        <Timeline />
        <Content />
        <Footer />
      </div>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('website'));
root.render(<Website />);
