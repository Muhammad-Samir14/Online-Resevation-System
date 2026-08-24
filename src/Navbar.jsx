import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Shop Now", path: "/shop" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm"
      style={{
        background: "#0d6efd",
        minHeight: "76px",
      }}
    >
      <div className="container">
        <Link
          to="/"
          className="navbar-brand fw-bold text-uppercase d-flex align-items-center"
          onClick={handleLinkClick}
        >
          <div
            className="d-flex align-items-center justify-content-center bg-white rounded-circle me-2"
            style={{ width: "46px", height: "46px" }}
          >
            <img
              src={logo}
              alt="Marwat Gas Agency"
              width="38"
              height="38"
              className="rounded-circle"
            />
          </div>

          <span>Marwat Gas Agency</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center text-center">
            {navItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <li className="nav-item mx-lg-2" key={item.path}>
                  <Link
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`nav-link ${
                      active ? "fw-bold text-warning" : "text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}

            <li className="nav-item mx-lg-2 my-2 my-lg-0">
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="btn btn-warning fw-semibold px-4"
              >
                Login
              </Link>
            </li>

            <li className="nav-item mx-lg-2 my-2 my-lg-0">
              <Link
                to="/admin"
                onClick={handleLinkClick}
                className="btn btn-danger fw-semibold px-4"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;