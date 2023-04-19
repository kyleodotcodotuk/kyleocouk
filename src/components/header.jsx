import Me from "../img/me.jpg";
// import Down from './icons/down.svg';
// import { Link } from "react-scroll";1

export default function Header() {
  return (
    <header>
      <div className="centered">
        <img
          src={Me}
          alt="Me"
          id="Me"
          class="blob"
          title="Me"
          height="350px"
          width="350px"
        />

        <div>
        <h1>
          Kyle<br /> O&apos;Connor
          <br />
          <span className="sub-text">
            UI<br /> developer <br />
          </span>
        </h1>
        <h2>London, UK</h2>
        </div>
      </div>

      {/* <Link className='scroll-down' href="/#welcome"
                activeClass="active" to="welcome"
                smooth={true} offset={0} duration={1000}
            ><img height="38px" width="38px" alt="Downwards Arrow" src={Down} /></Link> */}
    </header>
  );
}
