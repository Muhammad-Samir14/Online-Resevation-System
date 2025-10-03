  import React from 'react';
  import photot1 from './assets/photo1.jpg';

  function Hero() {
    return (
      <section className="bg-light py-5">
        <div className="container">
          <div className="row align-items-center">
            {/* Text Content */}
            <div className="col-md-6">
              <h1 className="display-4 fw-bold mb-3">
                Book Your Gas Cylinder Online, Anytime!
              </h1>
              <p className="lead text-muted mb-4">
                Experience hassle-free gas reservations with our trusted and fast online system. 
                Schedule deliveries, track your orders, and get support — all from the comfort of your home.
              </p>
              <a href="#reserve" className="btn btn-primary btn-lg">
                Reserve Now
              </a>
            </div>

            {/* Image (optional, replace src with actual image later) */}
            <div className="col-md-6 text-center">
              <img
                src= {photot1}
                alt="Online Gas Reservation"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  export default Hero;
