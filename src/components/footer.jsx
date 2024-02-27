import GitHub from './../icons/github.svg';

export default function Footer() {
  return (
    <footer>
      <div className="wrapper">

        <p>{new Date().getFullYear()} &middot; Kyle O'Connor<br />
          Tameside, Greater Manchester<br />
          United Kingdom
        </p>
        <ul className="social-icons">
          <li><a href="https://github.com/kyleodotcodotuk" target="_blank" rel="noreferrer" className="social-icon" alt="GitHub" title="GitHub"> <img src={GitHub} className="fa fa-github" alt="GitHub" title="GitHub" /></a></li>
        </ul>

      </div>
    </footer>
  );
}