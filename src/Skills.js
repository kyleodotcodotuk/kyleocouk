import React from 'react';
// import Popup from 'reactjs-popup';


export default function Skills() {
    return (
        <section id="skillset">
            <div className="wrapper">

                <div className="skill">
                    <div className="skill-box">
                        <h2>Web Development <i className="fa fa-html5"></i></h2>

                        <p>
                            Proficient with front-end, with over 500 bespoke websites and templates.<br />
                            Through my career I have created templates, maintained codebases and managed a small department as a lead developer.
                        </p>
                    </div>

                    <div className="skill-box">
                        <h2>Web Design <i className="fa fa-apple"></i></h2>

                        <p>
                            Knowing a websites capabilities within a browser gives me a good balance of design and function.<br />
                            I like consistency and simplicity, the devil is in the details.
                        </p>
                    </div>
                </div>

                {/* <Popup trigger={<button>Business Cards</button>} position="top center">
                    <h2>Popup content here !!</h2>
                </Popup> */}


            </div>
        </section>


    );
} 
