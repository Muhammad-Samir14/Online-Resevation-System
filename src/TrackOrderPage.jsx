import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Navbar from "./Navbar";
import Footer from "./Footer";

function TrackOrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/register");
          return;
        }

        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return { color: "#e5aa00", bg: "rgba(255, 193, 7, 0.1)" };
      case "Confirmed": return { color: "#0d6efd", bg: "rgba(13, 110, 253, 0.1)" };
      case "Out for Delivery": return { color: "#0d6efd", bg: "rgba(13, 110, 253, 0.1)" };
      case "Delivered": return { color: "#198754", bg: "rgba(25, 135, 84, 0.1)" };
      case "Cancelled": return { color: "#dc3545", bg: "rgba(220, 53, 69, 0.1)" };
      default: return { color: "#6c757d", bg: "rgba(108, 117, 125, 0.1)" };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-5">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{ width: "80px", height: "80px", background: "#eef5ff" }}
          >
            <i className="bi bi-box-seam fs-1 text-primary"></i>
          </div>
          <h3 className="fw-bold mb-2" style={{ color: "#10233f" }}>
            You have no orders yet
          </h3>
          <p className="text-muted mb-4">
            Once you place an order, you'll see its status and delivery updates here.
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

    return (
      <div className="row g-4">
        {orders.map((order) => {
          const style = getStatusStyle(order.status);
          const stepOrder = ["Pending", "Confirmed", "Out for Delivery", "Delivered"];
          const currentIdx = stepOrder.indexOf(order.status);
          const isCancelled = order.status === "Cancelled";

          return (
            <div className="col-12 col-lg-8" key={order.id}>
              <div className="card shadow-lg border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <div className="p-4 text-white" style={{ background: "linear-gradient(135deg, #10233f 0%, #084298 100%)" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-white-50 text-uppercase fw-bold">Order #{order.id?.slice(0, 8)}</small>
                      <h4 className="fw-bold mb-0">{order.cylinder_type} {order.cylinder_size}</h4>
                    </div>
                    <span className="badge border px-3 py-2" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.color }}>
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <small className="text-muted text-uppercase fw-bold">Customer</small>
                      <div className="fw-semibold" style={{ color: "#10233f" }}>{order.full_name}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted text-uppercase fw-bold">Delivery Address</small>
                      <div className="fw-semibold" style={{ color: "#10233f" }}>{order.street_address || "—"}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted text-uppercase fw-bold">Order Date</small>
                      <div className="fw-semibold" style={{ color: "#10233f" }}>{formatDate(order.created_at)}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted text-uppercase fw-bold">Total Amount</small>
                      <div className="fw-semibold" style={{ color: "#0d6efd" }}>Rs {Number(order.total_price || 0).toLocaleString()}</div>
                    </div>
                  </div>

                  {isCancelled ? (
                    <div className="text-center p-4 rounded-4" style={{ background: "rgba(220, 53, 69, 0.1)", border: "1px solid #dc3545" }}>
                      <div className="fw-bold fs-4" style={{ color: "#dc3545" }}>
                        <i className="bi bi-x-circle-fill me-2"></i>Order Cancelled
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      {["Pending", "Confirmed", "Out for Delivery", "Delivered"].map((step, idx) => {
                        const isActive = idx <= currentIdx;
                        return (
                          <div key={step} className="d-flex align-items-center flex-shrink-0">
                            <div className="d-flex align-items-center justify-content-center rounded-circle"
                              style={{ width: "36px", height: "36px", background: isActive ? "#0d6efd" : "#eef3f8", color: isActive ? "#fff" : "#6c757d", fontSize: ".85rem", fontWeight: 700 }}>
                              {idx + 1}
                            </div>
                            <span className="ms-2 small fw-semibold" style={{ color: isActive ? "#10233f" : "#6c757d" }}>{step}</span>
                            {idx < 3 && <div className="mx-2" style={{ width: "24px", height: "2px", background: "#dce5f0" }} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
              <h2 className="section-title">Track Your Orders</h2>
              <p className="section-description">
                See the current status for all your cylinder orders.
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
