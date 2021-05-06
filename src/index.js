import React from 'react';
import ReactDOM from 'react-dom';
import './sass/sass_all.scss';
import Header from './Header';
import Welcome from './Welcome';
import Skills from './Skills';
import Footer from './Footer';
import BackgroundSlider from 'react-background-slider';
import image1 from './img/bgs/010.JPG';
import image2 from './img/bgs/020.JPG';
import image3 from './img/bgs/030.JPG';
import image4 from './img/bgs/040.JPG';
import image5 from './img/bgs/050.JPG';
import image6 from './img/bgs/060.JPG';
import image7 from './img/bgs/070.JPG';
import image8 from './img/bgs/080.JPG';
import image9 from './img/bgs/090.JPG';
import image10 from './img/bgs/100.JPG';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(

  <React.StrictMode>
    <BackgroundSlider
      images={[image1, image2, image3, image4, image5, image6, image7, image8, image9, image10]}
      duration={6} transition={2} />
    <Header />
    <Welcome />
    <Skills />
    <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
