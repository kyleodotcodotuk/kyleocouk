import React, { Component } from 'react';

class Projects extends Component {
    constructor() {
        super();
        this.state = {
            projects: []
        }
    }
    componentDidMount() {
        let dataURL = "https://kyle.resknow.co/wp-json/wp/v2/projects?_embed";
        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    projects: res
                })
            })
    }
    render() {
        let projects = this.state.projects.map((project, index) => {
            return <div className='whitebg' key={index}>
                {/* <img alt="" src={project._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url} />
                <h2>{project.acf.project}</h2>
                <p> {project.acf.project_desc} </p>
                <p> Live in: {project.acf.year} </p>
                <p> Live at: {project.acf.domain} </p> */}
            </div>
        });
        return (
            <div>
                {projects}
            </div>
        )
    }
}
export default Projects;