import me from './img/me.png';

export default function Welcome() {
  return (

    <section id="welcome">
      <div className="wrapper">
        <h1>Hello world <i className="fa fa-home"></i></h1>

        <p>I am website developer from Yorkshire now living in London, I moved there in the summer of 2016 to start my career as a developer.
        </p>

        <p>After graduating with my degree in Web Design from the University of Bradford, I gained over 6 years of commercial experience. During which I have coded over 500 bespoke websites and templates with bespoke editable features.</p>

        <p>Currently full time employed at a digital agency as a developer, if you wish to enquire about a website, get in touch.</p>

        <a href="mailto:info@kyleo.co.uk" alt="" className='btn'>Contact</a>

        <img src={me} title="My Avatar" alt="My Avatar" id="welcome-image" width="300" height="300" />

      </div>
    </section>
  );
}