import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <div className="container">
        <div className="row">

          {/* Branding */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">GasReserve</h5>
            <p className="text-muted">
              Your trusted partner for quick and easy online gas bookings.
            </p>
          </div>

          {/* Useful Links */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Home</a></li>
              <li><a href="#reserve" className="text-light text-decoration-none">Reserve Now</a></li>
              <li><a href="#contact" className="text-light text-decoration-none">Contact</a></li>
              <li><a href="#terms" className="text-light text-decoration-none">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold">Contact Us</h6>
            <p className="text-muted mb-1"><i className="bi bi-envelope-fill me-2"></i> support@gasreserve.com</p>
            <p className="text-muted mb-0"><i className="bi bi-telephone-fill me-2"></i> +91 98765 43210</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} GasReserve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
