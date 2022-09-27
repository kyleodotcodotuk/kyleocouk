import React, { useEffect, useState } from 'react';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        async function loadProjects() {
            const response = await fetch('https://kyle.resknow.co/wp-json/wp/v2/projects?_embed');
            if (!response.ok) {
                // oups! something went wrong
                return;
            }

            const projects = await response.json();
            setProjects(projects);
        }

        loadProjects();
    }, [])
    return (

        <section className='portfolioFeed'>

            <h2>Projects</h2>
            <p>Take a look at some of my recent websites.</p>

            <div className='port-grid'>
                {projects.slice(0, 6).map((project, index) => (
                    <article key={index}>

                        <h3>{project.acf.project}</h3>
                        <img alt={project.acf.project} title={project.acf.project} className='project-preview' height="200px" src={project.acf.project_image} />
                        <p>{project.acf.project_desc}</p>
                        <span>Live: {project.acf.year}</span> &middot; <span>Codebase: {project.acf.code}</span>
                        <a href={project.acf.domain} alt="">Visit site</a>

                    </article>
                ))}
            </div>

            <p className='disclaimer'>Disclosure: Most listed websites are simply examples of my coding abilities. They are not owned or hosted by me and the intellectual property, code and design resources are from the respective employers.<br /> I am not personally involved or representative of any of these businesses, charities or schools. </p>
        </section>

    );
}

