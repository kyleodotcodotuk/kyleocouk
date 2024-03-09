import GitHub from './../icons/github.svg';
import CodePen from './../icons/codepen.svg';

export default function Footer() {
  return (
    <footer>
      <div className="wrapper">

        <p>{new Date().getFullYear()} &middot; <a href="/docs/privacy_policy.pdf" target="_blank" rel="noreferrer">Privacy Policy</a>
        </p>
        
        <ul className="social-icons">
          <li><a href="https://github.com/kyleodotcodotuk" target="_blank" rel="noreferrer" className="social-icon" alt="GitHub" title="GitHub"> <img src={GitHub} className="fa fa-github" alt="GitHub" title="GitHub" /></a></li>
          <li><a href="https://codepen.io/kyleodotcodotuk" target="_blank" rel="noreferrer" className="social-icon" alt="Codepen" title="Codepen"> <img src={CodePen} className="fa fa-codepen" alt="Codepen" title="Codepen" /></a></li>
        </ul>

      </div>
    </footer>
  );
}