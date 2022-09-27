import React from "react";

console.log(process.env.REACT_APP_SECRET_NAME);

export default class FetchRandomUser extends React.Component {
    state = {
        loading: true,
        person: null
    };

    async componentDidMount() {
        const url = "https://api.randomuser.me/";
        const response = await fetch(url);
        const data = await response.json();
        this.setState({ person: data.results[0], loading: false });
    }

    render() {
        if (this.state.loading) {
            return <div>loading...</div>;
        }

        if (!this.state.person) {
            return <div>didn't get a person</div>;
        }

        return (
            <div>
                <div>{process.env.REACT_APP_SECRET_NAME}</div>
                <div>{this.state.person.name.first}</div>
                <div>{this.state.person.name.last}</div>
                <img alt="" src={this.state.person.picture.large} />
            </div>
        );
    }
}