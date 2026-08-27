import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

import sixKgImg from "./assets/6KG.jpg";
import tenKgImg from "./assets/Screenshot_2026-08-27_161154 copy.png";
import fifteenKgImg from "./assets/15KG.jpg";
import fortyFiveKgImg from "./assets/45KG.jpg";
import regulatorImg from "./assets/Screenshot_2026-08-27_162826 copy.png";
import burnerImg from "./assets/Screenshot_2026-08-27_162826 copy.png";
import pipelineImg from "./assets/Screenshot_2026-08-27_162931.png";

function CatalogCard({ children }) {
  return (
    <div
      className="h-100 p-4 rounded-4 d-flex flex-column"
      style={{
        background: "#10233f",
        color: "white",
        border: "1px solid #1e3657",
        boxShadow: "0 12px 30px rgba(16,35,63,.15)",
      }}
    >
      {children}
    </div>
  );
}

function ProductImage({ image, alt, badge }) {
  return (
    <div className="text-center mb-4">
      <div
        className="position-relative d-inline-flex align-items-center justify-content-center rounded-circle overflow-hidden"
        style={{
          width: "150px",
          height: "150px",
          background: "#f1f4f8",
          border: "5px solid rgba(255,193,7,.2)",
        }}
      >
        <img
          src={image}
          alt={alt}
          className="w-100 h-100"
          style={{ objectFit: "contain" }}
        />
      </div>
      {badge && (
        <span className="badge rounded-pill d-block mx-auto mt-3" style={{ background: "#084298", padding: "8px 12px", width: "fit-content" }}>
          {badge}
        </span>
      )}
    </div>
  );
}

function PriceLine({ label, price }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <span className="text-white-50 small">{label}</span>
      <strong className="fs-5 text-warning">{price}</strong>
    </div>
  );
}

function ShopPage() {
  const navigate = useNavigate();

  const products = [
    {
      name: "Domestic Cylinder",
      type: "Domestic",
      size: "6 Kg",
      img: sixKgImg,
      desc: "Ideal for home use, cooking and everyday domestic LPG needs.",
      price: 1650,
      badge: "Home Use",
    },
    {
      name: "10 Kg Cylinder",
      type: "TenKg",
      size: "10 Kg",
      img: tenKgImg,
      desc: "A practical mid-size cylinder for homes and regular LPG needs.",
      price: 4000,
      badge: "Everyday Use",
    },
    {
      name: "Commercial Cylinder",
      type: "Commercial",
      size: "15 Kg",
      img: fifteenKgImg,
      desc: "Suitable for restaurants, hotels, cafés and commercial kitchens.",
      price: 4500,
      badge: "Commercial",
    },
    {
      name: "Industrial Cylinder",
      type: "Industrial",
      size: "45 Kg",
      img: fortyFiveKgImg,
      desc: "Designed for factories, workshops and large-scale LPG usage.",
      price: 9200,
      badge: "Heavy Duty",
    },
  ];

  const [quantities, setQuantities] = useState({
    Domestic: 1,
    TenKg: 1,
    Commercial: 1,
    Industrial: 1,
  });
  const [pipelineFeet, setPipelineFeet] = useState(1);

  const changeQuantity = (type, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(1, prev[type] + amount),
    }));
  };

  const handleBook = (product) => {
    const quantity = quantities[product.type];
    const params = new URLSearchParams({
      type: product.type,
      size: product.size,
      price: product.price.toString(),
      quantity: quantity.toString(),
      product: product.name,
    });

    navigate(`/book-gas?${params.toString()}`);
  };

  const handleBookAccessory = (item) => {
    const quantity = item.setFeet ? item.feet : 1;
    const unitPrice = item.numericPrice;
    const params = new URLSearchParams({
      type: "Accessory",
      size: item.setFeet ? `${item.feet} ft` : "1 Unit",
      price: unitPrice.toString(),
      quantity: quantity.toString(),
      product: item.name,
    });

    navigate(`/book-gas?${params.toString()}`);
  };

  const accessories = [
    {
      name: "Gas Regulator",
      desc: "Reliable pressure control for safer LPG cylinder usage.",
      price: "Rs 400",
      numericPrice: 400,
      image: regulatorImg,
      imageAlt: "Gas regulator",
      badge: "Safety Essential",
    },
    {
      name: "Gas Pipeline",
      desc: "Reliable coiled pipeline for secure LPG connections.",
      price: "Rs 80 / foot",
      numericPrice: 80,
      image: pipelineImg,
      imageAlt: "Coiled gas pipeline",
      badge: "Flexible Length",
      feet: pipelineFeet,
      setFeet: setPipelineFeet,
    },
    {
      name: "Gas Burner",
      desc: "Practical burner accessory for LPG cylinder use.",
      price: "Rs 500",
      numericPrice: 500,
      image: burnerImg,
      imageAlt: "Gas burner",
      badge: "Kitchen Essential",
    },
  ];

  return (
    <>
      <style>{`
        .catalog-book-btn { color: #ffffff !important; }
        .catalog-book-btn:hover { color: #ffffff !important; }
      `}</style>
      <Navbar />

      <main style={{ background: "linear-gradient(180deg, #eef5ff 0%, #f7f9fc 45%, #eef3f8 100%)" }}>
        <section
          className="py-5 text-white"
          style={{ background: "linear-gradient(135deg, #10233f 0%, #084298 55%, #0d6efd 100%)" }}
        >
          <div className="container text-center py-3">
            <span className="text-warning fw-bold text-uppercase">Marwat LPG Shop</span>
            <h1 className="fw-bold display-5 mt-2">Cylinders & LPG Solutions</h1>
            <p className="lead mx-auto mb-0 text-white-50" style={{ maxWidth: "720px" }}>
              Select your LPG cylinder, choose the quantity and book your delivery online.
            </p>
          </div>
        </section>

        <section className="marwat-section">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-kicker">Cylinder Range</span>
              <h2 className="section-title">Choose Your LPG Cylinder</h2>
              <p className="section-description">Prices include the cylinder and LPG.</p>
            </div>

            <div className="row g-4">
              {products.map((item) => {
                const quantity = quantities[item.type];
                const total = item.price * quantity;

                return (
                  <div className="col-xl-3 col-md-6" key={item.name}>
                    <CatalogCard>
                      <ProductImage image={item.img} alt={item.name} badge={item.badge} />

                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h5 className="fw-bold mb-0">{item.name}</h5>
                        <span className="badge bg-primary">{item.size}</span>
                      </div>
                      <p className="text-white-50 mb-3">{item.desc}</p>
                      <PriceLine label="Unit Price" price={`Rs ${item.price.toLocaleString()}`} />

                      <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-3" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)" }}>
                        <span className="fw-semibold">Quantity</span>
                        <div className="d-flex align-items-center gap-3">
                          <button type="button" onClick={() => changeQuantity(item.type, -1)} className="btn btn-outline-light d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", borderRadius: "50%" }}>
                            <i className="bi bi-dash-lg"></i>
                          </button>
                          <strong className="fs-5 text-center" style={{ minWidth: "25px" }}>{quantity}</strong>
                          <button type="button" onClick={() => changeQuantity(item.type, 1)} className="btn btn-warning d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", borderRadius: "50%" }}>
                            <i className="bi bi-plus-lg"></i>
                          </button>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="text-white-50">Total</span>
                        <strong className="fs-4 text-warning">Rs {total.toLocaleString()}</strong>
                      </div>
                      <button type="button" onClick={() => handleBook(item)} className="btn marwat-primary-btn catalog-book-btn w-100 py-3 mt-auto">
                        Book Now
                        <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </CatalogCard>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="marwat-section" style={{ background: "#e8f0f9" }}>
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-kicker">LPG Accessories</span>
              <h2 className="section-title">Essential Gas Accessories</h2>
              <p className="section-description">Useful accessories for safer and easier LPG use.</p>
            </div>

            <div className="row g-4">
              {accessories.map((item) => {
                const total = item.setFeet ? 80 * item.feet : item.numericPrice;
                return (
                  <div className="col-xl-4 col-md-6" key={item.name}>
                    <CatalogCard>
                      <ProductImage image={item.image} alt={item.imageAlt} badge={item.badge} />
                      <h5 className="fw-bold mb-2">{item.name}</h5>
                      <p className="text-white-50 mb-3">{item.desc}</p>
                      <PriceLine label="Unit Price" price={item.price} />

                      {item.setFeet && (
                        <>
                          <label className="form-label text-white fw-semibold" htmlFor={`${item.name}-feet`}>Feet</label>
                          <input
                            id={`${item.name}-feet`}
                            type="number"
                            min="1"
                            step="1"
                            className="form-control"
                            value={item.feet}
                            onChange={(event) => item.setFeet(Math.max(1, Number(event.target.value) || 1))}
                          />
                        </>
                      )}

                      <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                        <span className="text-white-50">Total</span>
                        <strong className="fs-4 text-warning">Rs {total.toLocaleString()}</strong>
                      </div>
                      <button type="button" onClick={() => handleBookAccessory(item)} className="btn marwat-primary-btn catalog-book-btn w-100 py-3 mt-auto">
                        Book Now
                        <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </CatalogCard>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ShopPage;
