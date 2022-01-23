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

        <section className='blogfeed'>

            <h1>Projects</h1>
            {projects.slice(0, 3).map((project, index) => (
                <div key={index}>
                    <article>
                        <img alt="" src={project._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url} />
                        <h2>{project.acf.project}</h2>
                        <p> {project.acf.project_desc} </p>
                        <p> {project.acf.year} </p>
                        <a href={project.acf.domain}>{project.acf.domain}</a>
                    </article>
                </div>
            ))}
        </section>

    );
}

