import React from 'react';
import ReactDOM from 'react-dom';
import './sass/sass_all.scss';
import Header from './Header';
import Welcome from './Welcome';
import Skills from './Skills';
import Footer from './Footer';
import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <Welcome />
    <Skills />
    <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
