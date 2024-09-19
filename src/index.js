import React, { useState } from 'react';
import ReactDOM from 'react-dom/client'; 
import { Header, Timeline, Footer } from "./components";
import './sass/_all.scss'; 

function Website() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <React.StrictMode>
      <div className={`${isDarkMode ? 'light-theme' : 'default'}`}>
        <button className="theme-changer" onClick={toggleTheme}>
          Switch theme to: {isDarkMode ? 'Dark' : 'Pastel'}
        </button>
        <Header />
        <Timeline/> 
        <Footer />
      </div>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('website'));
root.render(<Website />);