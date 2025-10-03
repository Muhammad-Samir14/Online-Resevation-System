import React from "react";

function HeroCarousal() {
  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>

      <div className="carousel-inner">
        {/* Slide 1 */}
        <div className="carousel-item active bg-dark text-white" style={{ height: "80vh" }}>
          <div className="d-flex h-100 align-items-center justify-content-center flex-column text-center">
            <h1 className="fw-bold">Welcome to City Gas Agency</h1>
            <p className="lead">Book your LPG cylinder online in just a few clicks.</p>
            <a href="/register" className="btn btn-warning btn-lg mt-3">
              Book Now
            </a>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="carousel-item bg-light text-dark" style={{ height: "80vh" }}>
          <div className="d-flex h-100 align-items-center justify-content-center flex-column text-center">
            <h1 className="fw-bold">Fast and Reliable Delivery</h1>
            <p className="lead">After accepting your order, we deliver right to your doorstep.</p>
            <a href="/login" className="btn btn-primary btn-lg mt-3">
              Track Your Order
            </a>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="carousel-item bg-secondary text-white" style={{ height: "80vh" }}>
          <div className="d-flex h-100 align-items-center justify-content-center flex-column text-center">
            <h1 className="fw-bold">Safe and Convenient</h1>
            <p className="lead">Enjoy hassle-free booking and on-time delivery of cylinders.</p>
            <a href="#services" className="btn btn-light btn-lg mt-3">
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default HeroCarousal;
