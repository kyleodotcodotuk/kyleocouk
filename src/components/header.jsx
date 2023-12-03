import Me from "../img/me.jpg";

export default function Header() {
  return (
    <header>
      
      <div className="centered">
        <img
          src={Me}
          alt="Me"
          id="Me"
          className="blob"
          title="Me"
          height="350px"
          width="350px"
        />

        <div>
          <h1>
            Kyle
            <br /> O&apos;Connor
            <br />
            <span className="sub-text">
              UI developer <br />
            </span>
          </h1>
          <h2>Greater Manchester, UK</h2>
        </div>
      </div>
    </header>
  );
}
