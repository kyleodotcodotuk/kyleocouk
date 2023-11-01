import WelcomeImage from "../img/me.svg";

export default function Welcome() {
  return (

    <section id="welcome">
      <div className="wrapper">

        <div className="welcome-panel">
         
          <div className="content-half">
            <div>
            <h1>Hello world </h1>
              <p>Originally from Yorkshire, I have gained valuable experience over the years. After living in London for 8 years, I have now settled in Manchester.</p>

              <p>
                With expertise/experience in front-end development including the likes of React, JavaScript and PHP. I am well-equipped to tackle a wide range of web development projects, including my current positon where I work primarily with software.
                With several years and experience in different areas, my experience has given me a unique perspective and adaptability to work in diverse environments and different types of businesses.</p>

              <p>As a UI developer, my focus is on creating/tweaking user interfaces that are visually appealing, intuitive, and user-friendly.<br />
                I work closely with designers and other developers to implement the front-end components of a website or application.</p>

            </div>

            <img
              src={WelcomeImage}
              alt="Welcome"
              id="Welcome"
              title="Welcome"
              height="300px"
              width="300px"
            />
          </div>
        </div>

      </div>
    </section>

  );
}