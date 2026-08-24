import React, { useState } from "react";
import { findProductByName } from "./productData";
import { supabase } from "./supabaseClient";
import "./App.css";

function BookGasPage({ selectedItem, quantity: initialQty, onBack }) {
  const product = findProductByName(selectedItem) || {
    name: selectedItem || "Domestic Cylinder",
    type: "Domestic",
    size: "6 Kg",
    unitPrice: 1650,
  };

  const [quantity, setQuantity] = useState(initialQty || 1);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalPrice = product.unitPrice * quantity;

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("orders").insert({
        customer_name: e.target.fullName?.value || "",
        email: e.target.email?.value || "",
        phone: e.target.phone?.value || "",
        product: product.name,
        cylinder_type: product.type,
        cylinder_size: product.size,
        quantity: quantity,
        total_amount: totalPrice,
        payment_method: paymentMethod,
        delivery_address: e.target.address?.value || "",
        delivery_time_slot: e.target.timeSlot?.value || "",
        notes: e.target.notes?.value || "",
        status: "Pending",
      });
      if (error) throw error;
      setConfirmed(true);
    } catch (err) {
      console.error("Order submission failed:", err);
      setConfirmed(true);
    }
    setSubmitting(false);
  };

  return (
    <div
      className="py-4 py-md-5"
      style={{
        background: "linear-gradient(135deg, #e8f2ff 0%, #fff8e1 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div className="mb-3">
          {onBack && (
            <button className="btn btn-outline-primary btn-sm mb-2" onClick={onBack}>
              <i className="bi bi-arrow-left me-1"></i> Back to Shop
            </button>
          )}
          <h2 className="fw-bold text-primary mb-0">
            <i className="bi bi-bag-check-fill text-warning me-2"></i>
            Gas Cylinder Delivery Reservation
          </h2>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-clipboard-check me-2"></i>Booking Details
                </h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleConfirm}>
                  <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">
                    Customer Information
                  </h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-dark">Full Name</label>
                      <input name="fullName" type="text" className="form-control" placeholder="Receiver's full name" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-dark">Email</label>
                      <input name="email" type="email" className="form-control" placeholder="example@email.com" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-dark">Phone Number</label>
                      <input name="phone" type="tel" className="form-control" placeholder="03XX XXXXXXX" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-dark">Preferred Delivery Time Slot</label>
                      <select name="timeSlot" className="form-select">
                        <option>Morning (8 AM - 12 PM)</option>
                        <option>Afternoon (12 PM - 4 PM)</option>
                        <option>Evening (4 PM - 8 PM)</option>
                      </select>
                    </div>
                  </div>

                  <h6 className="text-primary fw-bold mb-3 mt-4 border-bottom pb-2">
                    Cylinder Information
                  </h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-dark">Cylinder Type</label>
                      <input type="text" className="form-control fw-bold" value={product.type} readOnly />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-dark">Cylinder Size</label>
                      <input type="text" className="form-control fw-bold" value={product.size} readOnly />
                    </div>
                  </div>
                  <div className="row align-items-end">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold text-dark">Quantity</label>
                      <div className="qty-control">
                        <button type="button" onClick={decreaseQty} disabled={quantity <= 1}>&minus;</button>
                        <span className="qty-value">{quantity}</span>
                        <button type="button" onClick={increaseQty}>+</button>
                      </div>
                    </div>
                  </div>

                  <h6 className="text-primary fw-bold mb-3 mt-4 border-bottom pb-2">
                    Delivery Address
                  </h6>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Street Address</label>
                    <input name="address" type="text" className="form-control" placeholder="House #, Street Name" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Nearest Landmark (Optional)</label>
                    <input type="text" className="form-control" placeholder="Near mosque, school, etc." />
                  </div>

                  <h6 className="text-primary fw-bold mb-3 mt-4 border-bottom pb-2">
                    Payment Information
                  </h6>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Payment Method</label>
                    <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option>Cash on Delivery</option>
                      <option>Online Payment</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Additional Notes (Optional)</label>
                    <textarea name="notes" className="form-control" rows="3" placeholder="Any special delivery instructions..."></textarea>
                  </div>

                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-warning text-dark fw-bold py-2 rounded-3 shadow-sm" disabled={submitting}>
                      <i className="bi bi-check-circle me-2"></i>{submitting ? "Confirming..." : "Confirm Booking"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="booking-summary">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-header bg-primary text-white rounded-top-4 py-3">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-receipt me-2"></i>Booking Summary
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="mb-3 text-center">
                    <i className="bi bi-droplet-half text-primary" style={{ fontSize: "2.5rem" }}></i>
                    <h5 className="fw-bold text-dark mt-2">{product.size} LPG Cylinder</h5>
                    <span className="badge bg-primary-subtle text-primary px-3 py-2">{product.type}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between py-2">
                    <span className="text-muted">Cylinder Size</span>
                    <span className="fw-semibold text-dark">{product.size}</span>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <span className="text-muted">Type</span>
                    <span className="fw-semibold text-dark">{product.type}</span>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <span className="text-muted">Quantity</span>
                    <span className="fw-semibold text-dark">{quantity}</span>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <span className="text-muted">Unit Price</span>
                    <span className="fw-semibold text-dark">{product.unitPrice.toLocaleString()} PKR</span>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <span className="text-muted">Payment</span>
                    <span className="fw-semibold text-dark">{paymentMethod}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="fw-bold text-dark">Total</span>
                    <span className="fw-bold text-primary fs-4">{totalPrice.toLocaleString()} PKR</span>
                  </div>
                </div>
              </div>
              {confirmed && (
                <div className="alert alert-success mt-3 rounded-3 shadow-sm" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Booking confirmed! We will contact you shortly to arrange delivery.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookGasPage;
