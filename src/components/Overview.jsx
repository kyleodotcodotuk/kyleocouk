import React from "react";
import devImage from "./../img/bgs/devbg.jpg";
import desImage from "./../img/bgs/desbg.jpg";

export default function Overview() {
  return (
    <section id="skillset">
      <div className="wrapper">
        <div className="skill">
          <div className="skill-box">
            <img src={devImage} alt="" width="100%" height="100%" />
            <h2>
              Development <i className="fa fa-code"></i>
            </h2>

            <p>
              Proficient with frontend languages like JavaScript and
              knowledgeable with backend. Over 6 years commerical experience
              making websites for a range of businesses.
            </p>
            <p>
              Through my years of experience I have handled a range of duties
              such as, creating templates, website maintenance and producing
              documentation.
            </p>
          </div>

          <div className="skill-box">
            <img src={desImage} alt="" width="100%" height="100%" />
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
