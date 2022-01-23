import React, { Component } from 'react';

class resources extends Component {
    constructor() {
        super();
        this.state = {
            resources: []
        }
    }
    componentDidMount() {
        let dataURL = "https://kyle.resknow.co/wp-json/wp/v2/resources?_embed";
        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    resources: res
                })
            })
    }
    render() {
        let resources = this.state.resources.map((resource, index) => {
            return <div key={index}>
                <h1>Title</h1>
                <article>
                    <h2>{resource.acf.name}</h2>
                    <p> {resource.acf.description} </p>
                    <p> {resource.acf.url} </p>
                </article>
            </div>
        });
        return (
            <div>
                {resources}
            </div>
        )
    }
}
export default resources;