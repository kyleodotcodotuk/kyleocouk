
function Footer() {
  return (
    <footer>
      <div className="wrapper">

        <p>London, UK <img src="./svg/contact-ic.svg" alt="location" /><br />
        Kyle O'Connor &middot; https://kyleo.co.uk &middot; <a href="/legal" alt="legal">Legal Notice</a><br />
        2021 &middot; My own photographs &middot; Coded with <a target="_blank" href="https://github.com/kyleodotcodotuk" rel="noreferrer">React</a></p>

        <ul class="social-icons">
          <li><a href="https://twitter.com/kyleocouk" class="social-icon" alt=""> <i class="fa fa-twitter"></i></a></li>
          <li><a href="mailto:kyle@kyleo.co.uk" class="social-icon" alt=""> <i class="fa fa-envelope"></i></a></li>
          <li><a href="https://github.com/kyleodotcodotuk" class="social-icon" alt=""> <i class="fa fa-github"></i></a></li>
        </ul>

      </div>
    </footer>


  );
}

export default Footer;
