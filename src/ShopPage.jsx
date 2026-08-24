import React, { useState } from "react";
import sixKgImg from "./assets/6KG.jpg";
import fifteenKgImg from "./assets/15KG.jpg";
import fortyFiveKgImg from "./assets/45KG.jpg";
import BookGasPage from "./BookGasPage";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./App.css";

function ShopPage() {
  const [showBookGas, setShowBookGas] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [quantities, setQuantities] = useState({});

  const products = [
    { name: "Domestic Cylinder", img: sixKgImg, desc: "Ideal for home use, safe and efficient.", size: "6 Kg", unitPrice: 1650 },
    { name: "Commercial Cylinder", img: fifteenKgImg, desc: "For hotels and restaurants.", size: "15 Kg", unitPrice: 4500 },
    { name: "Industrial Cylinder", img: fortyFiveKgImg, desc: "For factories and large-scale usage.", size: "45 Kg", unitPrice: 9200 },
  ];

  const getQty = (name) => quantities[name] || 1;

  const decreaseQty = (name) => setQuantities((p) => ({ ...p, [name]: Math.max(1, (p[name] || 1) - 1) }));
  const increaseQty = (name) => setQuantities((p) => ({ ...p, [name]: (p[name] || 1) + 1 }));

  const handleAddToCart = (item) => {
    setSelectedItem(item.name);
    setSelectedQty(getQty(item.name));
    setShowBookGas(true);
  };

  if (showBookGas) {
    return (
      <>
        <Navbar />
        <div className="py-4">
          <BookGasPage selectedItem={selectedItem} quantity={selectedQty} onBack={() => setShowBookGas(false)} />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary">
              <i className="bi bi-shop me-2 text-warning"></i>MARWAT LPG Shop
            </h2>
            <p className="text-muted mb-1">Timings: <strong>Mon - Sat, 10:30 AM - 8:30 PM</strong></p>
            <p className="text-muted">Prices are inclusive of Cylinders and LPG</p>
          </div>
          <div className="row g-4">
            {products.map((item, index) => {
              const qty = getQty(item.name);
              const total = item.unitPrice * qty;
              return (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="shop-card h-100 d-flex flex-column">
                    <div className="card-img-wrap">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="card-body p-4 d-flex flex-column flex-grow-1">
                      <h5 className="fw-bold text-dark mb-1">{item.name}</h5>
                      <span className="badge bg-primary-subtle text-primary mb-2 align-self-start">{item.size}</span>
                      <p className="text-muted small mb-3">{item.desc}</p>
                      <p className="fw-bold text-primary fs-5 mb-1">{item.unitPrice.toLocaleString()} PKR</p>
                      <p className="text-muted small mb-3">per cylinder</p>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <label className="form-label fw-semibold text-dark mb-0">Quantity</label>
                        <div className="qty-control">
                          <button type="button" onClick={() => decreaseQty(item.name)} disabled={qty <= 1}>&minus;</button>
                          <span className="qty-value">{qty}</span>
                          <button type="button" onClick={() => increaseQty(item.name)}>+</button>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <span className="text-muted fw-semibold">Total</span>
                        <span className="fw-bold text-dark fs-5">{total.toLocaleString()} PKR</span>
                      </div>
                      <button className="btn btn-warning text-dark fw-bold w-100 mt-auto" onClick={() => handleAddToCart(item)}>
                        <i className="bi bi-cart-plus me-2"></i>Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default ShopPage;
