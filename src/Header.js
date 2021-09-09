// import logo from './logo.svg';

export default function Header() {
    return (
        <header>

            <div className="centered">

                {/* <img src={logo} alt="logo" id="logo" title="logo" /> */}
                <img src="/logo.png" alt="logo" id="logo" title="logo" width="186" height="66" />
                <img src="/mobile-logo.png" alt="logo" width="90" height="107" id="mobile-logo" title="logo" />

                <h1>Kyle O&apos;Connor<br />

                    <span className="sub-text">
                        Web Developer &amp; Designer
                    </span>
                </h1>
            </div>

        </header>

    );
}

