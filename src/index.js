import React from 'react';
import ReactDOM from 'react-dom/client';
import { Header, Welcome, Content, Posts, Timeline, Footer } from "./components";
import "./sass/_all.scss";

const website = ReactDOM.createRoot(document.getElementById('website'));
website.render(
  <React.StrictMode> 
    <Header />
    <Welcome />
    <Posts />
    <Timeline />
    <Content />
    <Footer />
  </React.StrictMode>
);