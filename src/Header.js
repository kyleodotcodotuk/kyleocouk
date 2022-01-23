import tempLogo from './logo.svg';

export default function Header() {
    return (
        <header>

            <div className="centered">

                <img src={tempLogo} alt="Logo" id="logo" title="Logo" />
                {/* <img src="/logo.png" alt="logo" id="logo" title="logo" width="186" height="66" /> */}
                <img src={tempLogo} alt="Logo" width="200" height="220" id="mobile-logo" title="logo" />

                <h1>Kyle O&apos;Connor<br />

                    <span className="sub-text">
                        Web developer &amp; designer.
                    </span>
                </h1>
                <hr />
            </div>

        </header>

    );
}

