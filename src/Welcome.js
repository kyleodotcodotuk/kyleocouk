import me from './img/me.png';

export default function Welcome() {
  return (
    <section id="welcome">
      <div className="wrapper">
        <h1>Hello world, I'm Kyle <i className="fa fa-home"></i></h1>

        <p>I am primarily a front end developer from Yorkshire now living in South London, I moved here in order to start my career as a developer.
        </p>

        <p>I have a degree in Web Design from the University of Bradford, over 5 years of commercial experience having coded over 500 bespoke websites and templates.</p>

        <p>
          I used to create websites for schools around the UK but now I'm working on websites for an array of businesses.<br />
        </p>

        <p>Currently employed as a Web Developer and Designer in Sidcup, this site is a means to keep in touch with JS frameworks.
        </p>

        {/* <a href="mailto:info@kyleo.co.uk" className="cta">Contact</a> */}

        <img src={me} title="My Avatar" alt="My Avatar" id="welcome-image" width="250" height="250" />

      </div>
    </section>
  );
}