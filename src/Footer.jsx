import { useState, useRef } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const emailRef = useRef(null);

  const quickLinks = [
    { name: "Home", icon: "bi-house-door-fill", path: "/" },
    { name: "About Us", icon: "bi-info-circle-fill", path: "/about" },
    { name: "Services", icon: "bi-tools", path: "/services" },
    { name: "Shop Now", icon: "bi-bag-fill", path: "/shop" },
    { name: "Contact", icon: "bi-envelope-fill", path: "/contact" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      emailRef.current?.focus();
      return;
    }

    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer
      className="text-light"
      style={{
        background: "#101b2d",
      }}
    >
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-3 col-md-6">
            <h4 className="fw-bold mb-2">
              Marwat Gas Agency
            </h4>

            <p className="text-white-50">
              Safe, dependable and convenient LPG cylinder booking and
              delivery services for homes and businesses.
            </p>

            <div
              className="d-inline-flex align-items-center px-3 py-2 rounded-3"
              style={{ background: "rgba(255,193,7,.10)" }}
            >
              <i className="bi bi-shield-check text-warning me-2"></i>
              <span className="small">Safe LPG Service</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Quick Links</h6>

            <ul className="list-unstyled">
              {quickLinks.map((link) => (
                <li className="mb-2" key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white-50 text-decoration-none"
                  >
                    <i className={`bi ${link.icon} me-2`}></i>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Contact Us</h6>

            <p className="text-white-50 mb-2">
              <i className="bi bi-envelope-fill text-warning me-2"></i>
              support@gasreserve.com
            </p>

            <p className="text-white-50 mb-2">
              <i className="bi bi-telephone-fill text-warning me-2"></i>
              +92 98765 43210
            </p>

            <p className="text-white-50 mb-3">
              <i className="bi bi-geo-alt-fill text-warning me-2"></i>
              Pakistan
            </p>

            <div className="d-flex gap-3">
              <a href="#" className="text-white fs-5">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="#" className="text-white fs-5">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="#" className="text-white fs-5">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-3">
              Stay Updated
            </h6>

            <p className="text-white-50">
              Receive service updates and important announcements.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  ref={emailRef}
                  type="email"
                  className="form-control py-2"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  className="btn btn-warning fw-semibold px-4"
                  type="submit"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {subscribed && (
              <p className="small text-success mt-2 mb-0">
                <i className="bi bi-check-circle-fill me-1"></i>
                Subscription received.
              </p>
            )}
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-md-flex justify-content-between text-white-50 small">
          <p className="mb-2 mb-md-0">
            © {new Date().getFullYear()} Marwat Gas Agency. All rights
            reserved.
          </p>

          <p className="mb-0">
            Safe LPG delivery at your doorstep.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;