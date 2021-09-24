import React from "react";
import projectOne from "./../img/portfolio/example1.jpg";
import projectTwo from "./../img/portfolio/example1.jpg";
import projectThree from "./../img/portfolio/example3.jpg";

export default function Portfolio() {
  return (
    <section id="skillset">
      <div className="wrapper">
        <main className="portfolio">
          <h2>Portfolio</h2>

          <p>
            I have been working with front-end website coding for over 6 years,
            I studied Web Development and Design at University before starting
            my career in London.
          </p>

          <p>
            I wish to become proficient & experienced in all aspects of
            front-end web development with further interest in becoming
            full-stack.
          </p>

          <p className="legal-notice">
            I do not own these websites and have no particular affiliation with
            the business, school or charity.
          </p>

          <ul>
            <li>
              <img src={projectOne} alt="" />
              <h3>Crofton Anne Dale Federation</h3>
              <p>
                An example of a colourful website I coded from a wireframe,
                integrated with a CMS. Dynamic news and diary items with a small
                dynamic gallery.
              </p>

              <span className="html-brand">HTML5</span>
              <span className="sass-brand">SASS</span>
              <span className="javascript-brand">JavaScript</span>
              <span className="asp-brand">ASP</span>
            </li>

            <li>
              <img src={projectTwo} alt="" />
              <h3>Name of project</h3>
              <p>Short description of work</p>

              <span className="html-brand">HTML5</span>
              <span className="sass-brand">SASS</span>
              <span className="wordpress-brand">WordPress</span>
              <span className="javascript-brand">JavaScript</span>
              <span className="react-brand">React</span>
              <span className="cloudflare-brand">Cloudflare</span>
              <span className="php-brand">PHP</span>
              <span className="asp-brand">ASP</span>
            </li>

            <li>
              <img src={projectThree} alt="" />
              <h3>Woodcote High School</h3>
              <p>
                Another example of a school website, with full screen video
                background, curriculum popups, animated statistics, editable via
                CMS.
              </p>

              <span className="html-brand">HTML5</span>
              <span className="sass-brand">SASS</span>
              <span className="javascript-brand">JavaScript</span>
              <span className="asp-brand">ASP</span>
            </li>
          </ul>
        </main>
      </div>
    </section>
  );
}
