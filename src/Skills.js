import React from "react";
import devImage from "./img/bgs/devbg.jpg";
import desImage from "./img/bgs/desbg.jpg";
// import Popup from 'reactjs-popup';

export default function Skills() {
  return (
    <section id="skillset">
      <div className="wrapper">
        <div className="skill">
          <div className="skill-box">
            <img src={devImage} alt="" />
            <h2>
              Web Development <i className="fa fa-html5"></i>
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
              Web Design <i className="fa fa-apple"></i>
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
          </div>
        </div>

        {/* <Popup trigger={<button>Business Cards</button>} position="top center">
                    <h2>Popup content here !!</h2>
                </Popup> */}
      </div>
    </section>
  );
}
