import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Shop Now", path: "/shop" },
    { name: "Bulk Delivery", path: "/bulk-delivery" },
  ];

  return (
    <nav ref={navRef} className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-uppercase d-flex align-items-center">
          <img src={logo} alt="Logo" width="40" height="40" className="me-2 rounded-circle" />
          Marwat Gas Agency
        </Link>

        <button className="navbar-toggler" type="button" onClick={toggleMenu} aria-controls="navbarNav" aria-expanded={isOpen} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto text-center">
            {navItems.map((item, index) => (
              <li className="nav-item mx-2" key={index}>
                <Link
                  to={item.path}
                  className={`nav-link text-light ${location.pathname === item.path ? "fw-bold text-warning" : ""}`}
                  onClick={handleLinkClick}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="nav-item mx-2">
              <Link to="/register" onClick={handleLinkClick}>
                <button className="btn btn-warning text-dark fw-semibold px-3">Login</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
