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

const DARK_CARD_STYLE = {
  background: "#10233f",
  color: "white",
  border: "1px solid #1e3657",
  boxShadow: "0 12px 30px rgba(16,35,63,.15)",
  borderRadius: "18px",
};

const DARK_INPUT_STYLE = {
  background: "rgba(255,255,255,.08)",
  color: "white",
  border: "1px solid rgba(255,255,255,.15)",
  minHeight: "48px",
  borderRadius: "9px",
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

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setFormData((prev) => ({
        ...prev,
        fullName: user?.user_metadata?.full_name || user?.user_metadata?.name || "",
        email: user?.email || "",
        phoneNumber: user?.user_metadata?.phone_number || user?.user_metadata?.phone || "",
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
    })();
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
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase.from("bookings").insert([
        {
          user_id: user?.id || null,
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

      // Call edge function to send admin email notification
      try {
        const { supabaseUrl, supabaseAnonKey } = {
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        };
        await fetch(`${supabaseUrl}/functions/v1/send-order-notification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseAnonKey}`,
            apikey: supabaseAnonKey,
          },
          body: JSON.stringify({
            order: {
              id: data?.[0]?.id,
              full_name: formData.fullName,
              email: formData.email,
              phone_number: formData.phoneNumber,
              cylinder_type: formData.cylinderType,
              cylinder_size: formData.cylinderSize,
              quantity: formData.quantity,
              unit_price: unitPrice,
              total_price: totalPrice,
              payment_method: formData.paymentMethod,
              street_address: formData.streetAddress,
              landmark: formData.landmark,
              delivery_time_slot: formData.deliveryTimeSlot,
              created_at: new Date().toISOString(),
              status: "Pending",
            },
            adminEmail: "isamirkhan5616@gmail.com",
          }),
        });
      } catch (notifErr) {
        console.error("Notification send failed:", notifErr);
      }

      alert("Booking confirmed successfully!");
      window.location.href = "/track-order";
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
            background: "rgba(13,110,253,.18)",
            border: "1px solid rgba(13,110,253,.3)",
            color: "#ffc107",
          }}
        >
          <i className={`bi ${icon}`}></i>
        </div>

        <div>
          <h5 className="fw-bold mb-0 text-white">
            {title}
          </h5>

          {description && (
            <small className="text-white-50">{description}</small>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .booking-input::placeholder { color: rgba(255,255,255,.4); }
        .booking-input:focus {
          background: rgba(255,255,255,.12) !important;
          color: #fff !important;
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.2rem rgba(13,110,253,.15) !important;
        }
        .booking-input option {
          background: #10233f;
          color: #fff;
        }
      `}</style>
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
                  <div className="p-4 p-lg-5 mb-4" style={DARK_CARD_STYLE}>
                    <SectionTitle
                      icon="bi-person-fill"
                      title="Customer Information"
                      description="Tell us who will receive the order."
                    />

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-white-50">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="fullName"
                          className="form-control booking-input"
                          style={DARK_INPUT_STYLE}
                          placeholder="Receiver's full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-white-50">
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          name="phoneNumber"
                          className="form-control booking-input"
                          style={DARK_INPUT_STYLE}
                          placeholder="03XX XXXXXXX"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold text-white-50">
                          Email
                        </label>

                        <input
                          type="email"
                          name="email"
                          className="form-control booking-input"
                          style={DARK_INPUT_STYLE}
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 p-lg-5 mb-4" style={DARK_CARD_STYLE}>
                    <SectionTitle
                      icon="bi-fire"
                      title="Cylinder Details"
                      description="Choose your required LPG cylinder."
                    />

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-white-50">
                          Cylinder Type
                        </label>

                        <select
                          name="cylinderType"
                          className="form-select booking-input"
                          style={DARK_INPUT_STYLE}
                          value={formData.cylinderType}
                          onChange={handleInputChange}
                        >
                          <option>Domestic</option>
                          <option>Commercial</option>
                          <option>Industrial</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-white-50">
                          Cylinder Size
                        </label>

                        <select
                          name="cylinderSize"
                          className="form-select booking-input"
                          style={DARK_INPUT_STYLE}
                          value={formData.cylinderSize}
                          onChange={handleInputChange}
                        >
                          <option>6 Kg</option>
                          <option>15 Kg</option>
                          <option>45 Kg</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-white-50">
                          Quantity
                        </label>

                        <div
                          className="d-flex align-items-center justify-content-between p-2 rounded-3"
                          style={{
                            background: "rgba(255,255,255,.08)",
                            border: "1px solid rgba(255,255,255,.15)",
                            minHeight: "48px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => changeQuantity(-1)}
                            className="btn btn-outline-light d-flex align-items-center justify-content-center"
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                            }}
                          >
                            <i className="bi bi-dash-lg"></i>
                          </button>

                          <strong
                            className="fs-5 text-center text-white"
                            style={{ minWidth: "25px" }}
                          >
                            {formData.quantity}
                          </strong>

                          <button
                            type="button"
                            onClick={() => changeQuantity(1)}
                            className="btn btn-warning d-flex align-items-center justify-content-center"
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
                        <label className="form-label fw-semibold text-white-50">
                          Preferred Delivery Time
                        </label>

                        <select
                          name="deliveryTimeSlot"
                          className="form-select booking-input"
                          style={DARK_INPUT_STYLE}
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
                        background: "rgba(255,255,255,.06)",
                        border: "1px solid rgba(255,255,255,.12)",
                      }}
                    >
                      <span className="fw-semibold text-white-50">
                        Estimated Total
                      </span>

                      <strong
                        className="fs-4 text-warning"
                      >
                        Rs {totalPrice.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="p-4 p-lg-5 mb-4" style={DARK_CARD_STYLE}>
                    <SectionTitle
                      icon="bi-geo-alt-fill"
                      title="Delivery Address"
                      description="Tell our delivery team where to bring your order."
                    />

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-white-50">
                        Street Address
                      </label>

                      <input
                        type="text"
                        name="streetAddress"
                        className="form-control booking-input"
                        style={DARK_INPUT_STYLE}
                        placeholder="House number, street and area"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label fw-semibold text-white-50">
                        Nearest Landmark
                        <span className="text-white-50 fw-normal">
                          {" "}
                          (Optional)
                        </span>
                      </label>

                      <input
                        type="text"
                        name="landmark"
                        className="form-control booking-input"
                        style={DARK_INPUT_STYLE}
                        placeholder="Near mosque, school, market etc."
                        value={formData.landmark}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="p-4 p-lg-5" style={DARK_CARD_STYLE}>
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
                                  : "rgba(255,255,255,.15)",
                              background:
                                formData.paymentMethod === method.name
                                  ? "rgba(13,110,253,.15)"
                                  : "rgba(255,255,255,.05)",
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
                                className={`bi ${method.icon} text-warning me-2`}
                              ></i>

                              <span className="fw-semibold text-white">
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
                          background: "rgba(255,255,255,.05)",
                          border: "1px solid rgba(255,255,255,.12)",
                        }}
                      >
                        <div className="row g-4">
                          <div className="col-lg-5">
                            <div
                              className="rounded-4 p-4 h-100"
                              style={{
                                background: "#0a1a30",
                                color: "white",
                                border: "1px solid #1e3657",
                              }}
                            >
                              <i
                                className={`bi ${
                                  getPaymentDetails().icon
                                } fs-2 text-warning`}
                              ></i>

                              <h4 className="fw-bold mt-3 text-white">
                                Pay via {getPaymentDetails().title}
                              </h4>

                              <p className="text-white-50 small">
                                Send your payment to the account below.
                              </p>

                              <hr className="border-secondary" />

                              <small className="text-white-50">
                                Account Title
                              </small>

                              <p className="fw-bold mb-3 text-white">
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
                                <label className="form-label fw-semibold text-white-50">
                                  Amount Sent
                                </label>

                                <input
                                  type="number"
                                  name="amountSent"
                                  className="form-control booking-input"
                                  style={DARK_INPUT_STYLE}
                                  placeholder="Rs."
                                  value={formData.amountSent}
                                  onChange={handleInputChange}
                                  required={isOnlinePayment}
                                />
                              </div>

                              <div className="col-md-6">
                                <label className="form-label fw-semibold text-white-50">
                                  Sender Name
                                </label>

                                <input
                                  type="text"
                                  name="senderName"
                                  className="form-control booking-input"
                                  style={DARK_INPUT_STYLE}
                                  placeholder="Account holder name"
                                  value={formData.senderName}
                                  onChange={handleInputChange}
                                  required={isOnlinePayment}
                                />
                              </div>

                              <div className="col-md-6">
                                <label className="form-label fw-semibold text-white-50">
                                  Sender Mobile Number
                                </label>

                                <input
                                  type="tel"
                                  name="senderNumber"
                                  className="form-control booking-input"
                                  style={DARK_INPUT_STYLE}
                                  placeholder="03XX XXXXXXX"
                                  value={formData.senderNumber}
                                  onChange={handleInputChange}
                                  required={isOnlinePayment}
                                />
                              </div>

                              <div className="col-md-6">
                                <label className="form-label fw-semibold text-white-50">
                                  Transaction ID
                                </label>

                                <input
                                  type="text"
                                  name="transactionId"
                                  className="form-control booking-input"
                                  style={DARK_INPUT_STYLE}
                                  placeholder="Transaction/reference ID"
                                  value={formData.transactionId}
                                  onChange={handleInputChange}
                                />
                              </div>

                              <div className="col-12">
                                <label className="form-label fw-semibold text-white-50">
                                  Payment Screenshot
                                </label>

                                <div
                                  className="text-center rounded-3 p-4"
                                  style={{
                                    border: "2px dashed rgba(255,255,255,.2)",
                                    background: "rgba(255,255,255,.05)",
                                  }}
                                >
                                  <i className="bi bi-cloud-arrow-up fs-2 text-warning"></i>

                                  <p className="fw-semibold mb-2 mt-2 text-white">
                                    Upload payment screenshot
                                  </p>

                                  <input
                                    type="file"
                                    className="form-control"
                                    style={{
                                      background: "rgba(255,255,255,.08)",
                                      color: "white",
                                      border: "1px solid rgba(255,255,255,.15)",
                                    }}
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
                      <label className="form-label fw-semibold text-white-50">
                        Additional Notes
                        <span className="text-white-50 fw-normal">
                          {" "}
                          (Optional)
                        </span>
                      </label>

                      <textarea
                        name="additionalNotes"
                        className="form-control booking-input"
                        style={{
                          ...DARK_INPUT_STYLE,
                          minHeight: "auto",
                        }}
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
                    className="p-4"
                    style={{
                      ...DARK_CARD_STYLE,
                      position: "sticky",
                      top: "90px",
                    }}
                  >
                    <h4 className="fw-bold mb-4 text-white">
                      <i className="bi bi-receipt text-warning me-2"></i>
                      Booking Summary
                    </h4>

                    <div className="mb-3">
                      <span className="text-white-50">Selected:</span>
                      <strong className="ms-1 text-white">
                        {formData.cylinderType} {formData.cylinderSize}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-white-50">Order Type</span>

                      <strong className="text-white">{formData.orderType}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-white-50">Cylinder</span>

                      <strong className="text-white">{formData.cylinderSize}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-white-50">Type</span>

                      <strong className="text-white">{formData.cylinderType}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-white-50">Quantity</span>

                      <strong className="text-white">{formData.quantity}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-white-50">Unit Price</span>

                      <strong className="text-white">Rs {unitPrice.toLocaleString()}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-white-50">Total Price</span>

                      <strong
                        className="fs-5 text-warning"
                      >
                        Rs {totalPrice.toLocaleString()}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-white-50">Payment</span>

                      <strong className="text-white">{formData.paymentMethod}</strong>
                    </div>

                    <hr className="border-secondary" />

                    <div
                      className="rounded-3 p-3 mb-4"
                      style={{
                        background: "rgba(255,193,7,.1)",
                        border: "1px solid rgba(255,193,7,.25)",
                      }}
                    >
                      <small className="text-white-50">
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
