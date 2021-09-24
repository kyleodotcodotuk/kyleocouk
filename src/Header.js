import tempLogo from './logo.svg';

export default function Header() {
    return (
        <header>

            <div className="centered">

                <img src={tempLogo} alt="Logo" id="logo" title="Logo" />
                {/* <img src="/logo.png" alt="logo" id="logo" title="logo" width="186" height="66" /> */}
                <img src={tempLogo} alt="Logo" width="90" height="107" id="mobile-logo" title="logo" />

                <h1>Kyle O&apos;Connor<br />

                    <span className="sub-text">
                        Web Developer &amp; Designer
                    </span>
                </h1>
            </div>

        </header>

    );
}

