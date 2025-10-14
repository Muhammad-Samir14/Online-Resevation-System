import React from 'react';
import photot1 from './assets/photo1.jpg';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="py-5" style={{ backgroundColor: "#77BEF0" }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Text Content */}
          <div className="col-md-6">
            <h1 className="display-5 fw-bold mb-3 text-dark">
              Marwat Gas Agency — Delivering Energy You Can Trust
            </h1>
            <p className="lead text-dark mb-4">
              Established with a mission to provide safe, clean, and reliable LPG energy across Pakistan, 
              <strong> Marwat Gas Agency </strong> has built a trusted reputation in the energy sector.  
              With a dedicated network of distributors, delivery partners, and customer-focused support,  
              we ensure efficient gas supply for homes, restaurants, and industries alike.
            </p>
            <p className="text-dark mb-4">
              Our professional management team is driven by quality, safety, and innovation — 
              making Marwat Gas Agency one of the most dependable LPG service providers in the region.
            </p>
            <Link to="/register" className="btn btn-warning text-dark fw-bold btn-lg shadow">
              Reserve Now
            </Link>
          </div>

          {/* Image Section */}
          <div className="col-md-6 text-center">
            <img
              src={photot1}
              alt="Marwat Gas Agency Online Booking"
              className="img-fluid rounded-4 shadow"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
