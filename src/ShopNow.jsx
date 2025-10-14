import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ShopNow() {
  return (
    <section className="py-5 bg-warning" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container text-center">
        <div className="mb-5">
          <h2 className="fw-bold text-primary">
            <i className="bi bi-bag-fill me-2 text-warning"></i>
            Shop Now
          </h2>
          <p className="text-muted">
            Choose from our range of LPG services for your convenience
          </p>
        </div>

        <div className="row g-4">
          {/* LPG Shop */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <i className="bi bi-shop fs-1 text-success mb-3"></i>
              <h5 className="fw-semibold">MARWAT LPG Shop</h5>
              <p className="text-muted">Visit our LPG shop for high-quality cylinders.</p>
              <Link to="/shop" className="btn btn-outline-primary px-4 mt-2">Shop Now</Link>
            </div>
          </div>

          {/* LPG Refill */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <i className="bi bi-droplet-fill fs-1 text-info mb-3"></i>
              <h5 className="fw-semibold">LPG Refill</h5>
              <p className="text-muted">Get your LPG cylinder refilled quickly and safely.</p>
              <Link to="/shop" className="btn btn-outline-info px-4 mt-2">Refill Now</Link>
            </div>
          </div>

          {/* Bulk Deliveries */}
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <i className="bi bi-truck fs-1 text-warning mb-3"></i>
              <h5 className="fw-semibold">Bulk Deliveries</h5>
              <p className="text-muted">Order large quantities for commercial or industrial needs.</p>
              <Link to="/shop" className="btn btn-outline-warning px-4 mt-2">Order Bulk</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShopNow;