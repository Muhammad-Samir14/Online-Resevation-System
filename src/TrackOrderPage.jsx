import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Navbar from "./Navbar";
import Footer from "./Footer";

function TrackOrderPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .or(`customerName.eq.${user.email},user_email.eq.${user.email}`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    if (!order || !order.estimated_delivery_minutes || !order.eta_set_at) {
      return;
    }
    if (order.status === "Delivered" || order.status === "Cancelled") {
      setRemainingSeconds(0);
      return;
    }

    const computeRemaining = () => {
      const elapsed = (Date.now() - new Date(order.eta_set_at).getTime()) / 1000;
      const total = order.estimated_delivery_minutes * 60;
      const remaining = Math.max(0, total - elapsed);
      setRemainingSeconds(remaining);
    };

    computeRemaining();
    const interval = setInterval(computeRemaining, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Arrived";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins} min ${secs.toString().padStart(2, "0")} sec`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return { color: "#e5aa00", bg: "rgba(255, 193, 7, 0.1)" };
      case "Processing": return { color: "#0d6efd", bg: "rgba(13, 110, 253, 0.1)" };
      case "Out for Delivery": return { color: "#0d6efd", bg: "rgba(13, 110, 253, 0.1)" };
      case "Delivered": return { color: "#198754", bg: "rgba(25, 135, 84, 0.1)" };
      case "Cancelled": return { color: "#dc3545", bg: "rgba(220, 53, 69, 0.1)" };
      default: return { color: "#6c757d", bg: "rgba(108, 117, 125, 0.1)" };
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      );
    }

    if (!order) {
      return (
        <div className="text-center py-5">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{ width: "80px", height: "80px", background: "#eef5ff" }}
          >
            <i className="bi bi-box-seam fs-1 text-primary"></i>
          </div>
          <h3 className="fw-bold mb-2" style={{ color: "#10233f" }}>
            You have no active orders right now
          </h3>
          <p className="text-muted mb-4">
            Once you place an order and it's accepted by our team, you'll see its status and estimated delivery time here.
          </p>
          <button
            className="btn marwat-primary-btn px-4 py-3"
            onClick={() => navigate("/services")}
          >
            <i className="bi bi-fire me-2"></i>
            Order a Cylinder
          </button>
        </div>
      );
    }

    const style = getStatusStyle(order.status);
    const isDelivered = order.status === "Delivered";
    const isCancelled = order.status === "Cancelled";
    const hasEta = order.estimated_delivery_minutes && order.eta_set_at;

    return (
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div
            className="card shadow-lg border-0"
            style={{ borderRadius: "20px", overflow: "hidden" }}
          >
            {/* Header */}
            <div
              className="p-4 text-white"
              style={{ background: "linear-gradient(135deg, #10233f 0%, #084298 100%)" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-white-50 text-uppercase fw-bold">Order Tracking</small>
                  <h4 className="fw-bold mb-0">{order.product || "Cylinder Order"}</h4>
                </div>
                <span
                  className="badge border px-3 py-2"
                  style={{ backgroundColor: style.bg, color: style.color, borderColor: style.color }}
                >
                  {order.status || "Pending"}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <small className="text-muted text-uppercase fw-bold">Customer</small>
                  <div className="fw-semibold" style={{ color: "#10233f" }}>{order.customerName}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted text-uppercase fw-bold">Delivery Address</small>
                  <div className="fw-semibold" style={{ color: "#10233f" }}>{order.deliveryAddress || "—"}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted text-uppercase fw-bold">Order Date</small>
                  <div className="fw-semibold" style={{ color: "#10233f" }}>{order.orderDate || "—"}</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted text-uppercase fw-bold">Total Amount</small>
                  <div className="fw-semibold" style={{ color: "#0d6efd" }}>
                    Rs. {Number(order.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Countdown */}
              {hasEta && !isDelivered && !isCancelled && (
                <div
                  className="text-center p-4 rounded-4 mb-4"
                  style={{ background: "#eef5ff", border: "1px solid #cfe0f5" }}
                >
                  <small className="text-muted text-uppercase fw-bold d-block mb-2">
                    Estimated Arrival
                  </small>
                  {remainingSeconds !== null && remainingSeconds > 0 ? (
                    <>
                      <div className="display-5 fw-bold" style={{ color: "#0d6efd" }}>
                        {formatTime(remainingSeconds)}
                      </div>
                      <small className="text-muted">
                        Arriving in approximately {Math.ceil(remainingSeconds / 60)} minute(s)
                      </small>
                    </>
                  ) : (
                    <div className="fw-bold fs-4" style={{ color: "#198754" }}>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      Your order should be arriving now
                    </div>
                  )}
                </div>
              )}

              {hasEta && isDelivered && (
                <div
                  className="text-center p-4 rounded-4 mb-4"
                  style={{ background: "rgba(25, 135, 84, 0.1)", border: "1px solid #198754" }}
                >
                  <div className="fw-bold fs-4" style={{ color: "#198754" }}>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Order Delivered
                  </div>
                </div>
              )}

              {hasEta && isCancelled && (
                <div
                  className="text-center p-4 rounded-4 mb-4"
                  style={{ background: "rgba(220, 53, 69, 0.1)", border: "1px solid #dc3545" }}
                >
                  <div className="fw-bold fs-4" style={{ color: "#dc3545" }}>
                    <i className="bi bi-x-circle-fill me-2"></i>
                    Order Cancelled
                  </div>
                </div>
              )}

              {!hasEta && !isCancelled && (
                <div
                  className="text-center p-4 rounded-4 mb-4"
                  style={{ background: "#fff8dd", border: "1px solid #ffe38c" }}
                >
                  <div className="fw-semibold" style={{ color: "#e5aa00" }}>
                    <i className="bi bi-clock me-2"></i>
                    Waiting for the admin to set an estimated delivery time
                  </div>
                </div>
              )}

              {/* Status steps */}
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                {["Pending", "Processing", "Out for Delivery", "Delivered"].map((step, idx) => {
                  const stepOrder = ["Pending", "Processing", "Out for Delivery", "Delivered"];
                  const currentIdx = stepOrder.indexOf(order.status);
                  const isActive = idx <= currentIdx;
                  return (
                    <div key={step} className="d-flex align-items-center flex-shrink-0">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "36px",
                          height: "36px",
                          background: isActive ? "#0d6efd" : "#eef3f8",
                          color: isActive ? "#fff" : "#6c757d",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <span
                        className="ms-2 small fw-semibold"
                        style={{ color: isActive ? "#10233f" : "#6c757d" }}
                      >
                        {step}
                      </span>
                      {idx < 3 && <div className="mx-2" style={{ width: "24px", height: "2px", background: "#dce5f0" }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "linear-gradient(180deg, #eef5ff 0%, #f7f9fc 45%, #eef3f8 100%)" }}>
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-kicker">Order Tracking</span>
              <h2 className="section-title">Track Your Order</h2>
              <p className="section-description">
                See the current status and estimated delivery time for your most recent order.
              </p>
            </div>
            {renderContent()}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default TrackOrderPage;
