
import logo from './assets/logo.png';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        {/* Brand / Logo */}
        <a className="navbar-brand fw-bold text-uppercase d-flex align-items-center" href="#">
          <img
            src={logo}
            alt="Logo"
            width="40"
            height="40"
            className="me-2 rounded-circle"
          />
          Marwat Gas Agency
        </a>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-2">
              <a className="nav-link text-light" href="#">Home</a>
            </li>

            <li className="nav-item mx-2">
              <a className="nav-link text-light" href="#">About Us</a>
            </li>

            <li className="nav-item mx-2">
              <a className="nav-link text-light" href="#">Services</a>
            </li>

            <li className="nav-item mx-2">
              <a className="nav-link text-light" href="#">Shop Now</a>
            </li>

            <li className="nav-item mx-2">
              <a className="nav-link text-light" href="#">Contact</a>
            </li>

            {/* Login Button */}
            <li className="nav-item mx-2">
             <a href="/register"> <button className="btn btn-warning text-dark fw-semibold">
                Login
              </button>
            </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
