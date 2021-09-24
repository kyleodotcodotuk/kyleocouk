import React from "react";
// import Popup from "reactjs-popup";
import serviceOne from "./../img/bgs/busbg.jpg";
import serviceTwo from "./../img/bgs/letbg.jpg";

export default function Services() {
  return (
    <section id="skillset">
      <div className="wrapper">
        <h2>Services</h2>

        <div className="service-boxes">
          <p>
            <img src={serviceOne} alt="" />
            <span>Business card design</span>
            Need a business card design that’s impactful and memorable? An
            eye-catching design is key to that and I can provide that for you.
          </p>

          <p>
            <img src={serviceTwo} alt="" />
            <span>Letterhead design</span>
            Despite an ever growing digital world of business, a letterhead is
            still one of the most professional ways to have your documents
            formatted.
          </p>

          <p>
            <span>Website Advice</span>
            I’ve made over 500 websites in recent years and worked in a few
            different studio and developer environments, if you need some help
            getting started and what to expect, or you want to enquire on a
            price your may have been quoted, I can help you with that.
          </p>

          <p>
            <span>Website Design</span>
            For a website to be at its full potential, it needs to stand out
            online. Depending on your needs or the business’ purpose, I can
            create a design that’s bespoke and perfect for you.
          </p>

          {/* <p>
            I can provide you with certain services subject to permission of my
            current employer regarding conflict of interest. My full time
            employment takes priority, if you happen to be a client of my
            employer I am afraid I will refuse any kind offers.
          </p>

          <p>
            I wish to provide a quality service, my prices will be priced based
            upon time considerations, availability and personal experience. I am
            good at what I do and I aim to provide good customer service,
            reliability and communication.
          </p> */}

          {/* <Popup
            trigger={<div className="cta-btn">Business Cards</div>}
            position="top center"
          >
            <h2>Card Design</h2>

            <p>
              Need a business card design that’s impactful and informative? An
              good design is key to that and I can provide that for you.
            </p>
          </Popup>

          <Popup
            trigger={<div className="cta-btn">Business Cards</div>}
            position="top center"
          >
            <h2>Popup content here !!</h2>
          </Popup> */}
        </div>
      </div>
    </section>
  );
}
