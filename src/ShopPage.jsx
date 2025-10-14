import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your cylinder images
import sixKgImg from './assets/6KG.jpg';
import fifteenKgImg from './assets/15KG.jpg';
import fortyFiveKgImg from './assets/45KG.jpg';

function ShopPage() {
  return (
    <section className="py-5 bg-light">
      <div className="container">

        {/* Heading Section */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">
            <i className="bi bi-shop me-2 text-warning"></i>
            LPG Shop
          </h2>
          <p className="text-muted mb-1">Timings: <strong>Monday - Saturday, 10:30 AM - 8:30 PM</strong></p>
          <p className="text-muted">Prices are inclusive of Cylinders and LPG</p>
        </div>

        {/* Info Section */}
        <div className="text-center mb-5">
          <button className="btn btn-outline-success px-4 mb-3">
            Click Here for LPG Refill
          </button>
          <p className="text-muted">
            <strong>Categories:</strong> Commercial Cylinder, Composite Cylinder, Domestic Cylinder, Industrial Cylinder, Steel Cylinder
          </p>
          <h5 className="fw-semibold text-danger">
            Current LPG Price: 275 PKR/Kg
          </h5>
        </div>

        {/* Product Cards */}
        <div className="row g-4">
          {/* Domestic Cylinder */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100 text-center">
              <img
                src={sixKgImg}
                alt="Domestic Cylinder 6KG"
                className="img-fluid mb-3 rounded"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <i className="bi bi-gas fs-1 text-warning mb-3"></i>
              <h5 className="fw-semibold">Domestic Cylinder</h5>
              <p className="text-muted">Ideal for home use, safe and efficient.</p>
              <p className="fw-bold mb-2">Price: 1650 PKR (6Kg)</p>
              <button className="btn btn-primary px-4">Add to Cart</button>
            </div>
          </div>

          {/* Commercial Cylinder */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100 text-center">
              <img
                src={fifteenKgImg}
                alt="Commercial Cylinder 15KG"
                className="img-fluid mb-3 rounded"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <i className="bi bi-gas fs-1 text-danger mb-3"></i>
              <h5 className="fw-semibold">Commercial Cylinder</h5>
              <p className="text-muted">For hotels and restaurants.</p>
              <p className="fw-bold mb-2">Price: 4500 PKR (15Kg)</p>
              <button className="btn btn-primary px-4">Add to Cart</button>
            </div>
          </div>

          {/* Industrial Cylinder */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100 text-center">
              <img
                src={fortyFiveKgImg}
                alt="Industrial Cylinder 45KG"
                className="img-fluid mb-3 rounded"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <i className="bi bi-gas fs-1 text-success mb-3"></i>
              <h5 className="fw-semibold">Industrial Cylinder</h5>
              <p className="text-muted">For factories and large-scale usage.</p>
              <p className="fw-bold mb-2">Price: 9200 PKR (45Kg)</p>
              <button className="btn btn-primary px-4">Add to Cart</button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ShopPage;