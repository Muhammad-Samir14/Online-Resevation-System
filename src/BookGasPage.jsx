import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PRICE_MAP = {
  "6 Kg": 1650,
  "15 Kg": 4500,
  "45 Kg": 9200,
};

function BookGasPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    orderType: "Domestic",
    fullName: "",
    email: "",
    phoneNumber: "",
    cylinderType: "Domestic",
    cylinderSize: "6 Kg",
    quantity: 1,
    deliveryTimeSlot: "Morning (8 AM - 12 PM)",
    streetAddress: "",
    landmark: "",
    paymentMethod: "Cash on Delivery",

    senderName: "",
    senderNumber: "",
    amountSent: "",
    transactionId: "",

    additionalNotes: "",
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  useEffect(() => {
    const service = searchParams.get("service");
    const paramType = searchParams.get("type");
    const paramSize = searchParams.get("size");
    const paramQuantity = searchParams.get("quantity");
    const savedUser = localStorage.getItem("user");

    let parsedUser = null;
    if (savedUser) {
      try {
        parsedUser = JSON.parse(savedUser);
      } catch (error) {
        console.error("Could not read saved user:", error);
      }
    }

    setFormData((prev) => ({
      ...prev,
      fullName: parsedUser?.name || parsedUser?.fullName || "",
      email: parsedUser?.email || "",
      phoneNumber: parsedUser?.phoneNumber || "",
      orderType:
        service === "refill"
          ? "Refill"
          : service === "bulk"
          ? "Bulk"
          : "Domestic",
      quantity:
        service === "bulk"
          ? 5
          : paramQuantity
          ? parseInt(paramQuantity, 10) || 1
          : 1,
      cylinderType: paramType || prev.cylinderType,
      cylinderSize: paramSize || prev.cylinderSize,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeQuantity = (amount) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + amount),
    }));
  };

  const unitPrice = PRICE_MAP[formData.cylinderSize] || 0;
  const totalPrice = unitPrice * formData.quantity;

  const isOnlinePayment =
    formData.paymentMethod === "JazzCash" ||
    formData.paymentMethod === "Easypaisa";

  const getPaymentDetails = () => {
    if (formData.paymentMethod === "JazzCash") {
      return {
        title: "JazzCash",
        icon: "bi-phone-fill",
        accountTitle: "MARWAT GAS AGENCY",
        number: "03XX XXXXXXX",
      };
    }

    return {
      title: "Easypaisa",
      icon: "bi-wallet2",
      accountTitle: "MARWAT GAS AGENCY",
      number: "03XX XXXXXXX",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.from("bookings").insert([
        {
          order_type: formData.orderType,
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          cylinder_type: formData.cylinderType,
          cylinder_size: formData.cylinderSize,
          quantity: formData.quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
          delivery_time_slot: formData.deliveryTimeSlot,
          street_address: formData.streetAddress,
          landmark: formData.landmark,
          payment_method: formData.paymentMethod,
          sender_name: formData.senderName,
          sender_number: formData.senderNumber,
          amount_sent: formData.amountSent ? parseFloat(formData.amountSent) : null,
          transaction_id: formData.transactionId,
          payment_screenshot_name: paymentScreenshot?.name || null,
          additional_notes: formData.additionalNotes,
          status: "Pending",
        },
      ]);

      if (error) throw error;

      alert("Booking confirmed successfully!");
      console.log("Booking Response:", data);
    } catch (error) {
      console.error(error);
      alert(
        error.message ||
          "Could not submit booking. Please try again."
      );
    }
  };

  const SectionTitle = ({ icon, title, description }) => (
    <div className="mb-4">
      <div className="d-flex align-items-center gap-3 mb-1">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "42px",
            height: "42px",
            background: "#e8f1ff",
            color: "#0d6efd",
          }}
        >
          <i className={`bi ${icon}`}></i>
        </div>

        <div>
          <h5 className="fw-bold mb-0" style={{ color: "#10233f" }}>
            {title}
          </h5>

          {description && (
            <small className="text-muted">{description}</small>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      <main
        style={{
          background: "#f5f8fc",
          minHeight: "100vh",
        }}
      >
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-kicker">
                Online Reservation
              </span>

              <h1 className="section-title">
                Book Your LPG Cylinder
              </h1>

              <p className="section-description">
                Complete your delivery information and choose your preferred
                payment method.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="marwat-card p-4 p-lg-5 mb-4">
                    <SectionTitle
                      icon="bi-person-fill"
                      title="Customer Information"
                      description="Tell us who will receive the order."
                    />

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="fullName"
                          className="form-control marwat-input"
                          placeholder="Receiver's full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          name="phoneNumber"
                          className="form-control marwat-input"
                          placeholder="03XX XXXXXXX"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Email
                        </label>

                        <input
                          type="email"
                          name="email"
                          className="form-control marwat-input"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="marwat-card p-4 p-lg-5 mb-4">
                    <SectionTitle
                      icon="bi-fire"
                      title="Cylinder Details"
                      description="Choose your required LPG cylinder."
                    />

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Cylinder Type
                        </label>

                        <select
                          name="cylinderType"
                          className="form-select marwat-input"
                          value={formData.cylinderType}
                          onChange={handleInputChange}
                        >
                          <option>Domestic</option>
                          <option>Commercial</option>
                          <option>Industrial</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Cylinder Size
                        </label>

                        <select
                          name="cylinderSize"
                          className="form-select marwat-input"
                          value={formData.cylinderSize}
                          onChange={handleInputChange}
                        >
                          <option>6 Kg</option>
                          <option>15 Kg</option>
                          <option>45 Kg</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Quantity
                        </label>

                        <div
                          className="d-flex align-items-center justify-content-between p-2 rounded-3"
                          style={{
                            background: "#f5f8fc",
                            border: "1px solid #dce5f0",
                            minHeight: "48px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => changeQuantity(-1)}
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
                            style={{ minWidth: "25px" }}
                          >
                            {formData.quantity}
                          </strong>

                          <button
                            type="button"
                            onClick={() => changeQuantity(1)}
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

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Preferred Delivery Time
                        </label>

                        <select
                          name="deliveryTimeSlot"
                          className="form-select marwat-input"
                          value={formData.deliveryTimeSlot}
                          onChange={handleInputChange}
                        >
                          <option>Morning (8 AM - 12 PM)</option>
                          <option>Afternoon (12 PM - 4 PM)</option>
                          <option>Evening (4 PM - 8 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div
                      className="d-flex justify-content-between align-items-center mt-3 p-3 rounded-3"
                      style={{
                        background: "#eef5ff",
                        border: "1px solid #d9e6f8",
                      }}
                    >
                      <span className="fw-semibold text-muted">
                        Estimated Total
                      </span>

                      <strong
                        className="fs-4"
                        style={{ color: "#0d6efd" }}
                      >
                        Rs {totalPrice.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="marwat-card p-4 p-lg-5 mb-4">
                    <SectionTitle
                      icon="bi-geo-alt-fill"
                      title="Delivery Address"
                      description="Tell our delivery team where to bring your order."
                    />

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Street Address
                      </label>

                      <input
                        type="text"
                        name="streetAddress"
                        className="form-control marwat-input"
                        placeholder="House number, street and area"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label fw-semibold">
                        Nearest Landmark
                        <span className="text-muted fw-normal">
                          {" "}
                          (Optional)
                        </span>
                      </label>

                      <input
                        type="text"
                        name="landmark"
                        className="form-control marwat-input"
                        placeholder="Near mosque, school, market etc."
                        value={formData.landmark}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="marwat-card p-4 p-lg-5">
                    <SectionTitle
                      icon="bi-wallet2"
                      title="Payment"
                      description="Choose how you want to pay."
                    />

                    <div className="row g-3 mb-4">
                      {[
                        {
                          name: "Cash on Delivery",
                          icon: "bi-cash-stack",
                        },
                        {
                          name: "JazzCash",
                          icon: "bi-phone-fill",
                        },
                        {
                          name: "Easypaisa",
                          icon: "bi-wallet-fill",
                        },
                      ].map((method) => (
                        <div className="col-md-4" key={method.name}>
                          <label
                            className="w-100 p-3 rounded-3 border"
                            style={{
                              cursor: "pointer",
                              borderColor:
                                formData.paymentMethod === method.name
                                  ? "#0d6efd"
                                  : "#dce5f0",
                              background:
                                formData.paymentMethod === method.name
                                  ? "#eef5ff"
                                  : "#ffffff",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <input
                                type="radio"
                                className="form-check-input me-3"
                                name="paymentMethod"
                                value={method.name}
                                checked={
                                  formData.paymentMethod === method.name
                                }
                                onChange={handleInputChange}
                              />

                              <i
                                className={`bi ${method.icon} text-primary me-2`}
                              ></i>

                              <span className="fw-semibold">
                                {method.name}
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>

                    {isOnlinePayment && (
                      <div
                        className="rounded-4 p-4"
                        style={{
                          background: "#f7faff",
                          border: "1px solid #d9e6f8",
                        }}
                      >
                        <div className="row g-4">
                          <div className="col-lg-5">
                            <div
                              className="rounded-4 p-4 h-100"
                              style={{
                                background: "#10233f",
                                color: "white",
                              }}
                            >
                              <i
                                className={`bi ${
                                  getPaymentDetails().icon
                                } fs-2 text-warning`}
                              ></i>

                              <h4 className="fw-bold mt-3">
                                Pay via {getPaymentDetails().title}
                              </h4>

                              <p className="text-white-50 small">
                                Send your payment to the account below.
                              </p>

                              <hr className="border-secondary" />

                              <small className="text-white-50">
                                Account Title
                              </small>

                              <p className="fw-bold mb-3">
                                {getPaymentDetails().accountTitle}
                              </p>

                              <small className="text-white-50">
                                Mobile Number
                              </small>

                              <p className="fs-5 fw-bold text-warning mb-0">
                                {getPaymentDetails().number}
                              </p>
                            </div>
                          </div>

                          <div className="col-lg-7">
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                  Amount Sent
                                </label>

                                <input
                                  type="number"
                                  name="amountSent"
                                  className="form-control marwat-input"
                                  placeholder="Rs."
                                  value={formData.amountSent}
                                  onChange={handleInputChange}
                                  required={isOnlinePayment}
                                />
                              </div>

                              <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                  Sender Name
                                </label>

                                <input
                                  type="text"
                                  name="senderName"
                                  className="form-control marwat-input"
                                  placeholder="Account holder name"
                                  value={formData.senderName}
                                  onChange={handleInputChange}
                                  required={isOnlinePayment}
                                />
                              </div>

                              <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                  Sender Mobile Number
                                </label>

                                <input
                                  type="tel"
                                  name="senderNumber"
                                  className="form-control marwat-input"
                                  placeholder="03XX XXXXXXX"
                                  value={formData.senderNumber}
                                  onChange={handleInputChange}
                                  required={isOnlinePayment}
                                />
                              </div>

                              <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                  Transaction ID
                                </label>

                                <input
                                  type="text"
                                  name="transactionId"
                                  className="form-control marwat-input"
                                  placeholder="Transaction/reference ID"
                                  value={formData.transactionId}
                                  onChange={handleInputChange}
                                />
                              </div>

                              <div className="col-12">
                                <label className="form-label fw-semibold">
                                  Payment Screenshot
                                </label>

                                <div
                                  className="text-center rounded-3 p-4"
                                  style={{
                                    border: "2px dashed #aebed3",
                                    background: "white",
                                  }}
                                >
                                  <i className="bi bi-cloud-arrow-up fs-2 text-primary"></i>

                                  <p className="fw-semibold mb-2 mt-2">
                                    Upload payment screenshot
                                  </p>

                                  <input
                                    type="file"
                                    className="form-control"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(e) =>
                                      setPaymentScreenshot(
                                        e.target.files?.[0] || null
                                      )
                                    }
                                    required={isOnlinePayment}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <label className="form-label fw-semibold">
                        Additional Notes
                        <span className="text-muted fw-normal">
                          {" "}
                          (Optional)
                        </span>
                      </label>

                      <textarea
                        name="additionalNotes"
                        className="form-control"
                        rows="3"
                        placeholder="Special delivery instructions..."
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div
                    className="marwat-card p-4"
                    style={{ position: "sticky", top: "90px" }}
                  >
                    <h4 className="fw-bold mb-4">
                      <i className="bi bi-receipt text-primary me-2"></i>
                      Booking Summary
                    </h4>

                    <div className="mb-3">
                      <span className="text-muted">Selected:</span>
                      <strong className="ms-1">
                        {formData.cylinderType} {formData.cylinderSize}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Order Type</span>

                      <strong>{formData.orderType}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Cylinder</span>

                      <strong>{formData.cylinderSize}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Type</span>

                      <strong>{formData.cylinderType}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Quantity</span>

                      <strong>{formData.quantity}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Unit Price</span>

                      <strong>Rs {unitPrice.toLocaleString()}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Total Price</span>

                      <strong
                        className="fs-5"
                        style={{ color: "#0d6efd" }}
                      >
                        Rs {totalPrice.toLocaleString()}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Payment</span>

                      <strong>{formData.paymentMethod}</strong>
                    </div>

                    <hr />

                    <div
                      className="rounded-3 p-3 mb-4"
                      style={{
                        background: "#fff8dd",
                        border: "1px solid #ffe38c",
                      }}
                    >
                      <small>
                        <i className="bi bi-shield-check text-success me-2"></i>
                        Please verify your contact and delivery details before
                        confirming.
                      </small>
                    </div>

                    <button
                      type="submit"
                      className="btn marwat-primary-btn w-100 py-3"
                    >
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default BookGasPage;
