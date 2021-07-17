import React from 'react';
import ReactDOM from 'react-dom';
import './sass/sass_all.scss';
import Header from './Header';
import Welcome from './Welcome';
import Skills from './Skills';
import Footer from './Footer';
import BackgroundSlider from 'react-background-slider';
import image1 from './img/bgs/010.webp';
import image2 from './img/bgs/020.webp';
import image3 from './img/bgs/030.webp';
import image4 from './img/bgs/040.webp';
import image5 from './img/bgs/050.webp'; 

ReactDOM.render(

  <React.StrictMode>
    <BackgroundSlider
      images={[image1, image2, image3, image4, image5]}
      duration={6} transition={2} />
    <Header />
    <Welcome />
    <Skills />
    <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);