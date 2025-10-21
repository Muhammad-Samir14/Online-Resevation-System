import { useState, useRef } from "react";

function Footer() {
  // ✅ useState for newsletter subscription
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // ✅ useRef for input focus control
  const emailRef = useRef(null);

  // ✅ Links and Socials using map()
  const quickLinks = [
    { name: "Home", icon: "bi-house-door-fill", href: "#" },
    { name: "About Us", icon: "bi-info-circle-fill", href: "#about" },
    { name: "Services", icon: "bi-tools", href: "#services" },
    { name: "FAQs", icon: "bi-question-circle-fill", href: "#faqs" },
    { name: "Terms", icon: "bi-file-earmark-text-fill", href: "#terms" },
  ];

  const socialLinks = [
    { icon: "bi-facebook", href: "#" },
    { icon: "bi-twitter", href: "#" },
    { icon: "bi-instagram", href: "#" },
    { icon: "bi-whatsapp", href: "#" },
  ];

  // ✅ Event Handlers
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      alert("Please enter your email address before subscribing.");
      emailRef.current.focus();
      return;
    }
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-dark text-light pt-5 mt-0">
      <div className="container">
        <div className="row gy-4">
          {/* Branding */}
          <div className="col-md-3 col-sm-6">
            <h5 className="fw-bold text-light">Gas Reservation System</h5>
            <h6>Marwat Gas Agency</h6>
            <p className="small">
              Providing safe and reliable LPG delivery services since 2013.
            </p>
            <p className="text-muted small">
              Your trusted partner for quick and easy online gas bookings —
              safe, reliable, and fast LPG delivery at your doorstep.
            </p>
          </div>

          {/* Quick Links (Using map) */}
          <div className="col-md-2 col-sm-6">
            <h6 className="fw-bold text-light">Quick Links</h6>
            <ul className="list-unstyled">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-light text-decoration-none d-block py-1"
                  >
                    <i className={`bi ${link.icon} me-2 text-light`}></i>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 col-sm-6">
            <h6 className="fw-bold text-light">Contact Us</h6>
            <p className="mb-1">
              <i className="bi bi-envelope-fill me-2 text-light"></i>{" "}
              support@gasreserve.com
            </p>
            <p className="mb-1">
              <i className="bi bi-telephone-fill me-2 text-light"></i>{" "}
              +92 98765 43210
            </p>
            <p className="mb-1">
              <i className="bi bi-geo-alt-fill me-2 text-light"></i> J Block,
              Street #17, Pakistan
            </p>

            {/* Social Media (Using map) */}
            <div className="mt-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-light fs-5 me-3"
                  onClick={() =>
                    alert(`You clicked on ${social.icon.replace("bi-", "")}`)
                  } // ✅ onClick event
                >
                  <i className={`bi ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-md-4 col-sm-12">
            <h6 className="fw-bold text-light">Subscribe to Our Newsletter</h6>
            <p className="small text-white">
              Get the latest updates and offers directly in your inbox.
            </p>
            <form className="d-flex" onSubmit={handleSubmit}>
              <input
                ref={emailRef}
                type="email"
                className="form-control me-2"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange} // ✅ onChange
              />
              <button type="submit" className="btn btn-warning fw-semibold">
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-success mt-2 small">
                ✅ Subscribed successfully! Thank you.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <p className="mb-0 small text-light">
            &copy; {new Date().getFullYear()} GasReserve. All rights reserved. |
            Designed with <i className="bi bi-heart-fill text-danger"></i> for
            your convenience
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
