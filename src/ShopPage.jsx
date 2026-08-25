import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

import sixKgImg from "./assets/6KG.jpg";
import fifteenKgImg from "./assets/15KG.jpg";
import fortyFiveKgImg from "./assets/45KG.jpg";

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
    Commercial: 1,
    Industrial: 1,
  });

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

  const accessories = [
    {
      icon: "bi-speedometer2",
      name: "Gas Regulator",
      desc: "Reliable pressure control for safer LPG cylinder usage.",
    },
    {
      icon: "bi-bezier2",
      name: "Gas Pipe",
      desc: "Durable LPG hose for secure gas connections.",
    },
    {
      icon: "bi-fire",
      name: "Gas Burner",
      desc: "Practical burner accessory for LPG cylinder use.",
    },
    {
      icon: "bi-shield-check",
      name: "Safety Accessories",
      desc: "Essential accessories for safer LPG handling.",
    },
  ];

  return (
    <>
      <Navbar />

      <main
        style={{
          background:
            "linear-gradient(180deg, #eef5ff 0%, #f7f9fc 45%, #eef3f8 100%)",
        }}
      >
        {/* HERO */}
        <section
          className="py-5 text-white"
          style={{
            background:
              "linear-gradient(135deg, #10233f 0%, #084298 55%, #0d6efd 100%)",
          }}
        >
          <div className="container text-center py-3">
            <span className="text-warning fw-bold text-uppercase">
              Marwat LPG Shop
            </span>

            <h1 className="fw-bold display-5 mt-2">
              Cylinders & LPG Solutions
            </h1>

            <p
              className="lead mx-auto mb-0 text-white-50"
              style={{ maxWidth: "720px" }}
            >
              Select your LPG cylinder, choose the quantity and book your
              delivery online.
            </p>
          </div>
        </section>

        {/* CYLINDERS */}
        <section className="marwat-section">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-kicker">Cylinder Range</span>

              <h2 className="section-title">
                Choose Your LPG Cylinder
              </h2>

              <p className="section-description">
                Prices include the cylinder and LPG.
              </p>
            </div>

            <div className="row g-4">
              {products.map((item) => {
                const quantity = quantities[item.type];
                const total = item.price * quantity;

                return (
                  <div
                    className="col-lg-4 col-md-6"
                    key={item.name}
                  >
                    <div
                      className="h-100 overflow-hidden"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #d9e4f0",
                        borderRadius: "20px",
                        boxShadow:
                          "0 12px 35px rgba(23,50,85,0.08)",
                      }}
                    >
                      {/* Image */}
                      <div
                        className="position-relative d-flex justify-content-center align-items-center"
                        style={{
                          height: "255px",
                          background:
                            "linear-gradient(145deg, #ffffff, #f3f7fc)",
                        }}
                      >
                        <span
                          className="position-absolute top-0 start-0 m-3 badge rounded-pill"
                          style={{
                            background: "#10233f",
                            padding: "9px 13px",
                          }}
                        >
                          {item.badge}
                        </span>

                        <img
                          src={item.img}
                          alt={item.name}
                          style={{
                            maxHeight: "205px",
                            maxWidth: "80%",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div>
                            <h4
                              className="fw-bold mb-1"
                              style={{
                                color: "#10233f",
                              }}
                            >
                              {item.name}
                            </h4>

                            <span className="badge bg-primary-subtle text-primary">
                              {item.size}
                            </span>
                          </div>

                          <div className="text-end">
                            <small className="text-muted d-block">
                              Unit Price
                            </small>

                            <strong
                              className="fs-5"
                              style={{
                                color: "#0d6efd",
                              }}
                            >
                              Rs {item.price.toLocaleString()}
                            </strong>
                          </div>
                        </div>

                        <p className="text-muted my-3">
                          {item.desc}
                        </p>

                        {/* QUANTITY */}
                        <div
                          className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-3"
                          style={{
                            background: "#f5f8fc",
                            border: "1px solid #dce5f0",
                          }}
                        >
                          <span className="fw-semibold">
                            Quantity
                          </span>

                          <div className="d-flex align-items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(item.type, -1)
                              }
                              className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                              style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                              }}
                            >
                              <i className="bi bi-dash-lg"></i>
                            </button>

                            <strong
                              className="fs-5 text-center"
                              style={{
                                minWidth: "25px",
                              }}
                            >
                              {quantity}
                            </strong>

                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(item.type, 1)
                              }
                              className="btn btn-primary d-flex align-items-center justify-content-center"
                              style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                              }}
                            >
                              <i className="bi bi-plus-lg"></i>
                            </button>
                          </div>
                        </div>

                        {/* TOTAL */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-muted">
                            Total
                          </span>

                          <strong
                            className="fs-4"
                            style={{
                              color: "#10233f",
                            }}
                          >
                            Rs {total.toLocaleString()}
                          </strong>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBook(item)}
                          className="btn marwat-primary-btn w-100 py-3"
                        >
                          Book Now
                          <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ACCESSORIES */}
        <section
          className="marwat-section"
          style={{
            background: "#e8f0f9",
          }}
        >
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-kicker">
                LPG Accessories
              </span>

              <h2 className="section-title">
                Essential Gas Accessories
              </h2>

              <p className="section-description">
                Useful accessories for safer and easier LPG use.
              </p>
            </div>

            <div className="row g-4">
              {accessories.map((item) => (
                <div
                  className="col-lg-3 col-md-6"
                  key={item.name}
                >
                  <div
                    className="h-100 p-4 rounded-4"
                    style={{
                      background: "#10233f",
                      color: "white",
                      border: "1px solid #1e3657",
                      boxShadow:
                        "0 12px 30px rgba(16,35,63,.15)",
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle mb-4"
                      style={{
                        width: "58px",
                        height: "58px",
                        background:
                          "rgba(255,193,7,.12)",
                      }}
                    >
                      <i
                        className={`bi ${item.icon} fs-3 text-warning`}
                      ></i>
                    </div>

                    <h5 className="fw-bold">
                      {item.name}
                    </h5>

                    <p className="text-white-50 mb-0">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ShopPage;