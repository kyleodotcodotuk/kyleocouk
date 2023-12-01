import React from 'react';
import ReactDOM from 'react-dom/client';
import { Header, Welcome, Content, Posts, Timeline, Footer } from "./components";
import CookieBanner from 'react-cookie-banner';
import "./sass/_all.scss";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <Welcome />
    <Posts />
    <Timeline />
    <Content />
    <Footer />
    <CookieBanner
      message="I don't use cookies"
      onAccept={() => {}}
      dismissOnScroll={false}
      cookie="user-has-accepted-cookies"
      buttonMessage="Close" />
  </React.StrictMode>
);