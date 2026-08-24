import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from "./supabaseClient";
import "./App.css";

function BulkDeliveryPage() {
  const [quantity, setQuantity] = useState(10);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  const benefits = [
    { icon: "bi bi-shop-window", text: "Restaurants & Hotels" },
    { icon: "bi bi-building", text: "Commercial Kitchens" },
    { icon: "bi bi-people", text: "Catering Businesses" },
    { icon: "bi bi-gear-wide-connected", text: "Factories & Industries" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("bulk_requests").insert({
        business_name: e.target.businessName.value,
        contact_name: e.target.contactName.value,
        phone: e.target.phone.value,
        email: e.target.email.value,
        business_type: e.target.businessType.value,
        delivery_address: e.target.address.value,
        quantity: quantity,
        cylinder_type: e.target.cylinderType.value,
        preferred_date: e.target.prefDate.value || null,
        preferred_time_slot: e.target.prefTime.value,
        notes: e.target.notes.value,
        status: "Pending",
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Bulk request failed:", err);
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <section className="py-5" style={{ backgroundColor: "#f0f5ff" }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: "72px", height: "72px", backgroundColor: "#fff8e1" }}>
              <i className="bi bi-truck fs-1 text-warning"></i>
            </div>
            <h2 className="fw-bold text-primary">Bulk LPG Delivery</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
              Need LPG in larger quantities? We provide bulk LPG delivery solutions for restaurants, hotels, commercial kitchens, businesses and other high-consumption customers.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="bulk-info-card p-4 shadow-sm h-100">
                <h5 className="fw-bold text-primary mb-3"><i className="bi bi-info-circle me-2"></i>Who Is This For?</h5>
                <p className="text-muted mb-4">
                  Bulk delivery is designed for customers with higher LPG consumption needs. Whether you run a restaurant, hotel, or industrial facility, we can supply the volume you require.
                </p>
                {benefits.map((b, i) => (
                  <div key={i} className="bulk-benefit-item">
                    <i className={`bi ${b.icon}`}></i>
                    <span className="fw-semibold text-dark">{b.text}</span>
                  </div>
                ))}
                <hr />
                <div className="mt-3">
                  <h6 className="fw-bold text-primary mb-2"><i className="bi bi-cash-coin me-2"></i>Pricing</h6>
                  <p className="text-muted mb-0">
                    Bulk LPG pricing depends on quantity, cylinder type, and delivery requirements. <strong className="text-dark">Contact us for a bulk quotation</strong> tailored to your needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-header bg-primary text-white rounded-top-4 py-3">
                  <h5 className="mb-0 fw-bold"><i className="bi bi-clipboard-plus me-2"></i>Bulk Order Request</h5>
                </div>
                <div className="card-body p-4">
                  {submitted ? (
                    <div className="alert alert-success rounded-3" role="alert">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Your bulk delivery request has been received! Our team will contact you shortly with a quotation.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">Customer / Business Information</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark">Business Name</label>
                          <input name="businessName" type="text" className="form-control" placeholder="Enter business name" required />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark">Contact Name</label>
                          <input name="contactName" type="text" className="form-control" placeholder="Enter contact name" required />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark">Phone Number</label>
                          <input name="phone" type="tel" className="form-control" placeholder="03XX XXXXXXX" required />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark">Email</label>
                          <input name="email" type="email" className="form-control" placeholder="example@email.com" />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark">Business Type / Usage</label>
                          <select name="businessType" className="form-select">
                            <option>Restaurant</option>
                            <option>Hotel</option>
                            <option>Commercial Kitchen</option>
                            <option>Catering</option>
                            <option>Factory / Industrial</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark">Cylinder Type</label>
                          <select name="cylinderType" className="form-select">
                            <option>Domestic (6 Kg)</option>
                            <option>Commercial (15 Kg)</option>
                            <option>Industrial (45 Kg)</option>
                            <option>Mixed / Not sure</option>
                          </select>
                        </div>
                      </div>

                      <h6 className="text-primary fw-bold mb-3 mt-4 border-bottom pb-2">Bulk Requirement</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark">Required Quantity</label>
                          <div className="qty-control">
                            <button type="button" onClick={decreaseQty} disabled={quantity <= 1}>&minus;</button>
                            <span className="qty-value">{quantity}</span>
                            <button type="button" onClick={increaseQty}>+</button>
                          </div>
                          <small className="text-muted d-block mt-1">Number of cylinders</small>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark">Preferred Delivery Date</label>
                          <input name="prefDate" type="date" className="form-control" />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold text-dark">Preferred Time Slot</label>
                          <select name="prefTime" className="form-select">
                            <option>Morning (8 AM - 12 PM)</option>
                            <option>Afternoon (12 PM - 4 PM)</option>
                            <option>Evening (4 PM - 8 PM)</option>
                          </select>
                        </div>
                      </div>

                      <h6 className="text-primary fw-bold mb-3 mt-4 border-bottom pb-2">Delivery Information</h6>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark">Delivery Address</label>
                        <input name="address" type="text" className="form-control" placeholder="Street, Block, City" required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark">Additional Notes (Optional)</label>
                        <textarea name="notes" className="form-control" rows="3" placeholder="Any special delivery instructions..."></textarea>
                      </div>

                      <div className="alert bg-primary-subtle text-primary rounded-3 py-2 mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Bulk quantity: {quantity}</strong> &mdash; Pricing: Contact us for bulk quotation
                      </div>

                      <div className="d-grid">
                        <button type="submit" className="btn btn-warning text-dark fw-bold py-2 rounded-3 shadow-sm" disabled={submitting}>
                          <i className="bi bi-send me-2"></i>{submitting ? "Submitting..." : "Request Bulk Delivery"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default BulkDeliveryPage;
