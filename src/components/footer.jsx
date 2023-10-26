import Twitter from './../icons/twitter.svg';
import GitHub from './../icons/github.svg';

export default function Footer() {
  return (
    <footer>
      <div className="wrapper">

        <p>Kyle O'Connor<br />
          {new Date().getFullYear()}&nbsp;&middot;&nbsp; Greater Manchester, UK<br />
          <a href="/docs/privacy_policy.pdf" target="_blank" alt="Privacy Policy" title="Privacy Policy">Privacy Policy</a>   
        
        </p>
        <br />
        <ul className="social-icons">
          <li><a href="https://twitter.com/kyleocouk" rel="noreferrer" target="_blank" className="social-icon" alt="Twitter" title="Twitter"> <img src={Twitter} className="fa fa-twitter" alt="Twitter" title="Twitter" /> </a></li>
          <li><a href="https://github.com/kyleodotcodotuk" target="_blank" rel="noreferrer" className="social-icon" alt="GitHub" title="GitHub"> <img src={GitHub} className="fa fa-github" alt="GitHub" title="GitHub" /></a></li>
        </ul> 

      </div>
    </footer>
  );
}