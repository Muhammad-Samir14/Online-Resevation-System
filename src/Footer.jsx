import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <div className="container">
        <div className="row">

          {/* Branding */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Gas Reservation System</h5>
            <h6>Marwat Gas Agency</h6>
            <p>Our Company is being providing Services since 2013 </p>
            <p className="text-muted">
              Your trusted partner for quick and easy online gas bookings. 
              Safe, reliable and fast LPG delivery right at your doorstep.
            </p>
          </div>

          {/* Useful Links */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none"><i className="bi bi-house-door-fill me-2"></i> Home</a></li>
              <li><a href="#about" className="text-light text-decoration-none"><i className="bi bi-info-circle-fill me-2"></i> About Us</a></li>
              <li><a href="#services" className="text-light text-decoration-none"><i className="bi bi-tools me-2"></i> Services</a></li>
              <li><a href="#faqs" className="text-light text-decoration-none"><i className="bi bi-question-circle-fill me-2"></i> FAQs</a></li>
              <li><a href="#terms" className="text-light text-decoration-none"><i className="bi bi-file-earmark-text-fill me-2"></i> Terms</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold">Contact Us</h6>
            <p className="text-muted mb-1"><i className="bi bi-envelope-fill me-2"></i> support@gasreserve.com</p>
            <p className="text-muted mb-1"><i className="bi bi-telephone-fill me-2"></i> +91 98765 43210</p>
            <p className="text-muted mb-1"><i className="bi bi-geo-alt-fill me-2"></i> 221B Baker Street, New Delhi, India</p>
            <p className="text-muted"><i className="bi bi-clock-fill me-2"></i> Mon - Sat: 9AM - 7PM</p>

            {/* Social Media */}
            <div className="mt-3">
              <a href="#" className="text-light fs-5 me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light fs-5 me-3"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-light fs-5 me-3"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light fs-5"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold">Subscribe to Our Newsletter</h6>
            <p className="text-muted">Get the latest updates and offers directly in your inbox.</p>
            <form className="d-flex">
              <input type="email" className="form-control me-2" placeholder="Enter your email" />
              <button type="button" className="btn btn-warning">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <p className="mb-0 text-muted">
            &copy; {new Date().getFullYear()} GasReserve. All rights reserved. | 
            Designed with <i className="bi bi-heart-fill text-danger"></i> for your convenience
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
