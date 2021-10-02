import React from "react";
import ReactDOM from "react-dom";
import BackgroundSlider from "react-background-slider";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { Overview, Services, Navigation, Portfolio } from "./components";
import Header from "./Header";
import WP from "./Posts";
import Welcome from "./Welcome";
import Footer from "./Footer";
import image1 from "./img/bgs/010.webp";
import image2 from "./img/bgs/020.webp";
import image3 from "./img/bgs/030.webp";
import image4 from "./img/bgs/040.webp";
import image5 from "./img/bgs/050.webp";
import "./sass/sass_all.scss";

ReactDOM.render(
  <React.StrictMode>
    <BackgroundSlider
      images={[image1, image2, image3, image4, image5]}
      duration={6}
      transition={2}
    />
    <Header />
    <Welcome />
    <WP />
    {/* <Router>
      <Navigation />
      <Switch>
        <Route path="/" exact component={() => <Overview />} />
        <Route path="/services" exact component={() => <Services />} />
        <Route path="/portfolio" exact component={() => <Portfolio />} />
      </Switch>
    </Router> */}
    <Footer />
  </React.StrictMode>,
  document.getElementById("root")
);
