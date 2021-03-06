import React from "react";
import ReactDOM from "react-dom";
import BackgroundSlider from "react-background-slider";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Overview } from "./components";
import Header from "./Header";
import Welcome from "./Welcome";
import Posts from "./Posts";
import Footer from "./Footer";
import { CookieBanner } from "@palmabit/react-cookie-law";
import image1 from "./img/bgs/010.webp";
import image2 from "./img/bgs/020.webp";
import image3 from "./img/bgs/030.webp";
import image4 from "./img/bgs/040.webp";
import image5 from "./img/bgs/050.webp";
import "./sass/_all.scss";

ReactDOM.render(
  <React.StrictMode>
    <BackgroundSlider
      images={[image1, image2, image3, image4, image5]}
      duration={6}
      transition={2}
    />
    <Header />
    <Welcome />
    <Posts />
    <Router>
      {/* <Navigation /> */}
      <Switch>
        <Route path="/" exact component={() => <Overview />} />
        {/* <Route path="/services" exact component={() => <Services />} /> */}
        {/* <Route path="/blogfeed" exact component={() => <Blogfeed />} /> */}
      </Switch>
    </Router>
    <Footer />
    <CookieBanner
      message="This website uses cookies."
      wholeDomain={true}
      policyLink="/docs/privacy_policy.pdf"
      onAccept={() => { }}
      managePreferencesButtonText="Manage cookies"
      onAcceptPreferences={() => { }}
      onAcceptStatistics={() => { }}
      onAcceptMarketing={() => { }}
    />

  </React.StrictMode>,
  document.getElementById("root")
);
