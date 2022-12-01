import React from "react";

export default function TimeLine() {

    return (

        <section className="professional-timeline">

            <ul className="timeline">

                <li>
                    <div className="direction-r">
                        <div className="flag-wrapper">
                            <span className="flag">Unily</span>
                        </div>
                        <div className="desc">

                            <span>UI Developer &middot; Surrey</span>
                            <hr />
                            Working on the front end of intranet designs, fixing bugs, creating customised design packages.

                        </div>
                    </div>
                    <div className="direction-l"><span className="time">2022 &middot; PRESENT</span>
                    </div>
                </li>

                <li>
                    <div className="direction-l">
                        <div className="flag-wrapper">
                            <span className="flag flag-l">Resknow</span>
                        </div>
                        <div className="desc">
                            <span>Web Developer &middot; London</span>
                            <hr />
                            Working within a design agency, designing and developing websites, managing projects by meeting clients, giving clients training and management.
                        </div>
                    </div>
                    <div className="direction-r">
                        <span className="time">2021 &middot; 2022</span>
                    </div>
                </li>

                <li>
                    <div className="direction-r">
                        <div className="flag-wrapper">
                            <span className="flag">Vividise</span>
                        </div>
                        <div className="desc">
                            <span>Lead Developer &middot; London</span>
                            <hr />
                            Developing websites for mainly the education sector, taking designs and implementing them into the custom build CMS.
                        </div>
                    </div>
                    <div className="direction-l"><span className="time">2016 &middot; 2021</span>
                    </div>
                </li>

                <li>
                    <div className="direction-l">
                        <div className="flag-wrapper">
                            <span className="flag flag-l">RPA Design</span>
                        </div>
                        <div className="desc">
                            <span>Developer Internship &middot; West Yorkshire</span>
                            <hr />
                            Implementing a custom Wordpress theme, PHP bugs and miscellaneous tickets.
                        </div>
                    </div>
                    <div className="direction-r"><span className="time">2015 &middot; 2016</span>
                    </div>
                </li>

                <li>
                    <div className="direction-r">
                        <div className="flag-wrapper">
                            <span className="flag">University</span>
                        </div>
                        <div className="desc">
                            <span>Web Design Student &middot; West Yorkshire</span>
                            <hr />
                            Studying in my hometown at the University of Bradford on the subject of web design, putting my skills to use and developing know-how on the industry.
                        </div>
                    </div>
                    <div className="direction-l"><span className="time">2012 &middot; 2015</span>
                    </div>
                </li>

            </ul>


        </section>


    );
}

