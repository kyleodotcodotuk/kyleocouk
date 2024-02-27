import Me from "../img/me.png";

export default function Header() {

  return (

    <header>

      <div className="centered">
        <img
          src={Me} alt="Me" id="Me"
          className="blob"
          title="A picture of me"
          height="330px"
          width="330px" loading='lazy'
        />


        <div>
          <h1>Kyle O'Connor</h1>
          <br />
          <h2>UI developer</h2>
        </div>
      </div>
    </header>
  );
}

