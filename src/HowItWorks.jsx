import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function HowItWorks() {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">How It Works</h2>
          <p className="text-muted">Simple steps to reserve your gas online in minutes</p>
        </div>

        <div className="row g-4">
          <div className="col-md-4 text-center">
            <div className="p-4 shadow-sm h-100">
              <div className="mb-3">
                <i className="bi bi-phone-fill fs-1 text-primary"></i>
              </div>
              <h5>Step 1: Sign Up</h5>
              <p className="text-muted">Create your account using your phone number or customer ID.</p>
            </div>
          </div>

          <div className="col-md-4 text-center">
            <div className="p-4 shadow-sm h-100">
              <div className="mb-3">
                <i className="bi bi-journal-text fs-1 text-success"></i>
              </div>
              <h5>Step 2: Book Your Gas</h5>
              <p className="text-muted">Choose your gas cylinder type and confirm your booking.</p>
            </div>
          </div>

          <div className="col-md-4 text-center">
            <div className="p-4 shadow-sm h-100">
              <div className="mb-3">
                <i className="bi bi-truck fs-1 text-danger"></i>
              </div>
              <h5>Step 3: Get it Delivered</h5>
              <p className="text-muted">Relax while your gas is delivered to your doorstep safely.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
