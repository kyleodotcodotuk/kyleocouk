import React from "react";

export default function Footer() {

  return (
    <footer>
      <div className="wrapper">

        <p>Kyle O'Connor &middot; London, UK &nbsp;<i className="fa fa-map-pin"></i><br />
          {new Date().getFullYear()}&nbsp;&middot;&nbsp;
          <a href="/docs/privacy_policy.pdf" target="_blank" alt="Privacy Policy" title="Privacy Policy">Privacy Policy</a>  &nbsp;<i className="fa fa-legal"></i>  </p>

        <ul className="social-icons">
          <li><a href="https://twitter.com/kyleocouk" rel="noreferrer" target="_blank" className="social-icon" alt="Twitter" title="Twitter"> <i className="fa fa-twitter"></i></a></li>
          <li><a href="mailto:info@kyleo.co.uk" target="_blank" rel="noreferrer" className="social-icon" alt="Email" title="Email"> <i className="fa fa-envelope"></i></a></li>
          <li><a href="https://github.com/kyleodotcodotuk" target="_blank" rel="noreferrer" className="social-icon" alt="GitHub" title="GitHub"> <i className="fa fa-github"></i></a></li>
        </ul>

      </div>
    </footer>

  );
}


