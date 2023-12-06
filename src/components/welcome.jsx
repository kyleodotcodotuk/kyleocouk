import WelcomeImage from "../img/me.svg";

export default function Welcome() {
  return (

    <section id="welcome">
      <div className="wrapper">

        <div className="welcome-panel">
         
          <div className="content-half">
            <div>
            <h2>Hello world!</h2>
              <p>Originally from West Yorkshire, I moved to London after graduating from University to find work. Unfortunately, all the opportunities seem to be in the capital. After living in London for over 8 years and starting my career, now I have settled in Manchester, closer to home since I now work from home.</p>

              <p>
                With expertise/experience in front-end development including the likes of React, JavaScript and PHP. I am well-equipped to tackle a wide range of web development projects, including my current positon where I work primarily with software.
                With several years and experience in different areas, my experience has given me a unique perspective and adaptability to work in diverse environments and different types of businesses.</p>

              <p>As a UI developer, my focus is on creating/tweaking user interfaces that are visually appealing, intuitive, and user-friendly.<br />
                I work closely with designers and other developers to implement the front-end components of a website or application.</p>

            </div>

            <img
              src={WelcomeImage}
              alt="Welcome"
              id="welcome-img"
              title="Welcome"
              height="300px"
              width="300px" loading='lazy'
            />
          </div>
        </div>

      </div>
    </section>

  );
}