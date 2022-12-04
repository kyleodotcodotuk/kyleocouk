import me from './img/me.png';

export default function Welcome() {
  return (

    <section id="welcome">
      <div className="wrapper">
        <h1>Hello world </h1>

        <p>I am a professional website developer from Yorkshire now living in London, I moved there in the summer of 2016 to start my career as a developer.
        </p>

        <p>After graduating with my degree in Web Design from the University of Bradford, I have gained over 6 years of commercial experience. During which I have coded over 500 bespoke websites and templates with editable features.</p>

        <p>Currently full time employed and awesome at UI.</p>

        <img src={me} title="My Avatar" alt="My Avatar" id="welcome-image" width="330" height="330" />

      </div>
    </section>

  );
}