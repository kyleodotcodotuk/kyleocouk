import Logo from './logo.svg';
import Down from './icons/down.svg';
import { Link } from "react-scroll";


export default function Header() {

    return (
        <header>

            <div className="centered">

                <img src={Logo} alt="Logo" id="logo" title="Logo" height="325px" width="325px" />

                <h1>Kyle O&apos;Connor<br />

                    <span className="sub-text">
                        Web developer &amp; designer.
                    </span>
                </h1>
                <hr />
            </div>

            <Link className='scroll-down' href="/#welcome"
                activeClass="active" to="welcome"
                smooth={true} offset={0} duration={1000}
            ><img height="38px" width="38px" alt="Downwards Arrow" src={Down} /></Link>

        </header >

    );
}

