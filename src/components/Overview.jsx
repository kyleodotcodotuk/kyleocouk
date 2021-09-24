import React from "react";
import devImage from "./../img/bgs/devbg.jpg";
import desImage from "./../img/bgs/desbg.jpg";

export default function Overview() {
  return (
    <section id="skillset">
      <div className="wrapper">
        <div className="skill">
          <div className="skill-box">
            <img src={devImage} alt="" />
            <h2>
              Development <i className="fa fa-code"></i>
            </h2>

            <p>
              Proficient with front-end, capable with back-end. Over 500 bespoke
              websites and customisable templates in my experience.
            </p>
            <p>
              Through my career I have created templates, maintained codebases,
              repositories and documentation.
            </p>
            <p>I also managed the dev department as a lead developer.</p>
          </div>

          <div className="skill-box">
            <img src={desImage} alt="" />
            <h2>
              Design <i className="fa fa-paint-brush"></i>
            </h2>
            <p>
              You want your brand and website to look good, be impactful,
              memorable and last but not least consistent.
            </p>
            <p>
              When people use websites, they don't want websites to be difficult
              to use, design is the key to that. Making sure users easily
              understand what they want to do or find.
            </p>
            <p>Your website looks good, you look good.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
