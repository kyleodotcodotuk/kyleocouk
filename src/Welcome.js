import me from './img/me.png';

function Welcome() {
  return (
    <section id="welcome">
      <div className="wrapper">
        <h2>Hello world, I'm Kyle <i className="fa fa-home"></i></h2>

        <p>I am primarily a front end developer from Yorkshire now living in London, I moved here in order to start my career as a developer.
        </p>

        <p>I have a degree in Web Design from the University of Bradford, over 5 years of commercial experience having coded over 500 bespoke websites and templates.</p>

        <p>
          I used to primarily create websites for schools but now I'm working on websites for an array of businesses.
        </p>

        <p>Over the years I have worked on maintaining wireframes, created templates, fixed bugs, setup development environments and sourced/created code snippets.<br />
        My duties also extend to communicating with other departments & directing the development department with training and meetings.</p>

        <p>Currently employed as a Web Developer and Designer in London, this site is currently serving testing purposes.</p>

        <img src={me} title="My Avatar" alt="" id="welcome-image" width="250" height="250" />

      </div>
    </section>
  );
}

export default Welcome;
