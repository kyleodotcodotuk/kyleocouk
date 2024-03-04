import React from "react";
import backgroundImageFirst from '../img/css.jpg';
import backgroundImageSecond from '../img/html.jpg';
import backgroundImageThird from '../img/javascript.jpg';

const first = {
  backgroundImage: `url(${backgroundImageFirst})`,
};

const second = {
  backgroundImage: `url(${backgroundImageSecond})`,
};

const third = {
  backgroundImage: `url(${backgroundImageThird})`,
};

export default function Skills() {
  return (
    <section className="Skills">
      <div>

        <h2>Key skills</h2>
        
      <div className="card">
          <div className="front" style={first}>
            <h3 className="title">CSS</h3>
          </div>
          <div className="back">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla felis erat, efficitur in pellentesque quis, fermentum non mauris. </p>
            <a className="btn" href="/example.com">Learn</a>
          </div>
        </div>

        <div className="card">
          <div className="front" style={second}>
            <h3 className="title">HTML</h3>
          </div>
          <div className="back">
            <p>Lorem ipsum is for romans</p>
            <a className="btn" href="/example.com">Learn</a>
          </div>
        </div>

        <div className="card">
          <div className="front" style={third}>
            <h3 className="title">JavaScript</h3>
          </div>
          <div className="back">
            <p>Lorem ipsum is for romans</p>
            <a className="btn" href="/example.com">Learn</a>
          </div>
        </div>

        <div className="card">
          <div className="front" style={first}>
            <h3 className="title">React</h3>
          </div>
          <div className="back">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla felis erat, efficitur in pellentesque quis, fermentum non mauris. </p>
            <a className="btn" href="/example.com">Learn</a>
          </div>
        </div>

        <div className="card">
          <div className="front" style={second}>
            <h3 className="title">PHP</h3>
          </div>
          <div className="back">
            <p>Lorem ipsum is for romans</p>
            <a className="btn" href="/example.com">Learn</a>
          </div>
        </div>

        <div className="card">
          <div className="front" style={third}>
            <h3 className="title">Angular</h3>
          </div>
          <div className="back">
            <p>Lorem ipsum is for romans</p>
            <a className="btn" href="/example.com">Learn</a>
          </div>
        </div>

      </div>
    </section>
  );
}
