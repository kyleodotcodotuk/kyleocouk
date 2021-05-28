import ReactGA from 'react-ga';
// import auth from './auth.ts'; // Sample authentication provider

const trackingId = "UA-72070431-1"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(trackingId);
ReactGA.set({
    // userId: auth.currentUserId(),
    // any data that is relevant to the user session
    // that you would like to track with google analytics
})

function Header() {
    return (
        <header>

            <img src="./logo.png" alt="logo" id="logo" title="logo" width="186" height="66" />
            <img src="./mobile-logo.png" alt="logo" width="90" height="107" id="mobile-logo" title="logo" />

            <h1>Kyle O&apos;Connor</h1>

            <h2 className="sub-text">
                Web Developer &amp; Designer
            </h2>

        </header>



    );
}

export default Header;

