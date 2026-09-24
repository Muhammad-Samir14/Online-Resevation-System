import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    commercialCustomers: 0,
    domesticCustomers: 0,
    industrialCustomers: 0,
    ordersToday: 0,
    ordersThisWeek: 0,
    totalRevenue: 0,
    revenueChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [customersRes, bookingsRes, productsRes] = await Promise.all([
        supabase.from("customers").select("*"),
        supabase.from("bookings").select("*"),
        supabase.from("products").select("name, stock"),
      ]);

      const customers = customersRes.data || [];
      const bookings = bookingsRes.data || [];

      const commercial = customers.filter(
        (c) => {
          const name = (c.name || "").toLowerCase();
          return name.includes("commercial") || name.includes("business") || name.includes("restaurant");
        }
      ).length;

      const domestic = customers.filter((c) => {
        const name = (c.name || "").toLowerCase();
        return !name.includes("commercial") && !name.includes("business") && !name.includes("restaurant") && !name.includes("industrial");
      }).length;

      const industrial = customers.filter((c) => {
        const name = (c.name || "").toLowerCase();
        return name.includes("industrial") || name.includes("factory");
      }).length;

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);

      const ordersToday = bookings.filter(
        (b) => new Date(b.created_at) >= startOfToday
      ).length;

      const ordersThisWeek = bookings.filter(
        (b) => new Date(b.created_at) >= startOfWeek
      ).length;

      const deliveredBookings = bookings.filter((b) => b.status === "Delivered");
      const totalRevenue = deliveredBookings.reduce(
        (sum, b) => sum + Number(b.total_price || 0), 0
      );

      const lastWeekStart = new Date(now);
      lastWeekStart.setDate(now.getDate() - 14);
      const lastWeekEnd = new Date(now);
      lastWeekEnd.setDate(now.getDate() - 7);

      const lastWeekRevenue = bookings
        .filter((b) => {
          const d = new Date(b.created_at);
          return d >= lastWeekStart && d < lastWeekEnd && b.status === "Delivered";
        })
        .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

      const revenueChange = lastWeekRevenue > 0
        ? Math.round(((totalRevenue - lastWeekRevenue) / lastWeekRevenue) * 100)
        : 0;

      setStats({
        commercialCustomers: commercial,
        domesticCustomers: domestic,
        industrialCustomers: industrial,
        ordersToday,
        ordersThisWeek,
        totalRevenue,
        revenueChange,
      });

      const sorted = [...bookings]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 6);
      setRecentOrders(sorted);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return { color: "#ffc107", bg: "rgba(255,193,7,.12)" };
      case "Confirmed": return { color: "#0d6efd", bg: "rgba(13,110,253,.12)" };
      case "Out for Delivery": return { color: "#0dcaf0", bg: "rgba(13,202,240,.12)" };
      case "Delivered": return { color: "#198754", bg: "rgba(25,135,84,.12)" };
      case "Cancelled": return { color: "#dc3545", bg: "rgba(220,53,69,.12)" };
      default: return { color: "#6c757d", bg: "rgba(108,117,125,.12)" };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getOrderStatusLabel = (count) => {
    if (count === 0) return "Low";
    if (count > 10) return "High";
    return "Normal";
  };

  const getOrderLabelStyle = (label) => {
    switch (label) {
      case "High": return { color: "#dc3545", bg: "rgba(220,53,69,.12)" };
      case "Normal": return { color: "#0d6efd", bg: "rgba(13,110,253,.12)" };
      case "Low": return { color: "#ffc107", bg: "rgba(255,193,7,.12)" };
      default: return { color: "#6c757d", bg: "rgba(108,117,125,.12)" };
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  const customerStats = [
    { label: "Commercial Customers", value: stats.commercialCustomers, icon: "bi-building-fill", color: "#0d6efd", percent: 65 },
    { label: "Domestic Customers", value: stats.domesticCustomers, icon: "bi-house-door-fill", color: "#198754", percent: 80 },
    { label: "Industrial Customers", value: stats.industrialCustomers, icon: "bi-gear-fill", color: "#ffc107", percent: 45 },
  ];

  const todayLabel = getOrderStatusLabel(stats.ordersToday);
  const todayLabelStyle = getOrderLabelStyle(todayLabel);
  const weekLabel = "Stable";
  const weekLabelStyle = getOrderLabelStyle("Normal");

  return (
    <div>
      {/* System Online indicator */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <small className="text-warning fw-bold text-uppercase" style={{ letterSpacing: "1.5px", fontSize: ".75rem" }}>
            Overview
          </small>
          <h2 className="fw-bold text-white mb-0">Dashboard</h2>
        </div>
        <div
          className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
          style={{ background: "rgba(25,135,84,.12)", border: "1px solid rgba(25,135,84,.25)" }}
        >
          <span
            className="rounded-circle"
            style={{
              width: "10px",
              height: "10px",
              background: "#198754",
              animation: "pulse 2s infinite",
            }}
          ></span>
          <span className="text-success fw-semibold small">System Online</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Customer stat cards with progress bars */}
      <div className="row g-3 g-md-4 mb-4">
        {customerStats.map((stat, idx) => (
          <div key={idx} className="col-12 col-md-4">
            <div className="stat-card h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-white-50 text-uppercase fw-bold" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                  {stat.label}
                </span>
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: "40px", height: "40px", background: `${stat.color}22` }}
                >
                  <i className={`bi ${stat.icon}`} style={{ color: stat.color, fontSize: "1.1rem" }}></i>
                </div>
              </div>
              <h3 className="fw-bold text-white mb-2">{stat.value}</h3>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-white-50 small" style={{ fontSize: ".75rem" }}>
                  {stat.percent}% of total
                </span>
                <span
                  className="small fw-semibold"
                  style={{ color: stat.percent >= 60 ? "#198754" : "#ffc107" }}
                >
                  <i className={`bi ${stat.percent >= 60 ? "bi-arrow-up" : "bi-arrow-down"} me-1`}></i>
                  {stat.percent >= 60 ? "+" : ""}{Math.abs(stat.percent - 50)}%
                </span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,.06)", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${stat.percent}%`,
                    background: stat.color,
                    borderRadius: "4px",
                    transition: "width 0.6s ease",
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Today + Orders This Week + Revenue */}
      <div className="row g-3 g-md-4 mb-5">
        <div className="col-12 col-md-4">
          <div className="stat-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-white-50 text-uppercase fw-bold" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                Orders Today
              </span>
              <span
                className="badge px-2 py-1"
                style={{ backgroundColor: todayLabelStyle.bg, color: todayLabelStyle.color, borderRadius: "6px", fontSize: ".7rem" }}
              >
                {todayLabel}
              </span>
            </div>
            <h3 className="fw-bold text-white mb-2">{stats.ordersToday}</h3>
            <div style={{ height: "6px", background: "rgba(255,255,255,.06)", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(stats.ordersToday * 10, 100)}%`,
                  background: "#0d6efd",
                  borderRadius: "4px",
                  transition: "width 0.6s ease",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-white-50 text-uppercase fw-bold" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                Orders This Week
              </span>
              <span
                className="badge px-2 py-1"
                style={{ backgroundColor: weekLabelStyle.bg, color: weekLabelStyle.color, borderRadius: "6px", fontSize: ".7rem" }}
              >
                {weekLabel}
              </span>
            </div>
            <h3 className="fw-bold text-white mb-2">{stats.ordersThisWeek}</h3>
            <div style={{ height: "6px", background: "rgba(255,255,255,.06)", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(stats.ordersThisWeek * 5, 100)}%`,
                  background: "#0dcaf0",
                  borderRadius: "4px",
                  transition: "width 0.6s ease",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-white-50 text-uppercase fw-bold" style={{ fontSize: ".7rem", letterSpacing: ".5px" }}>
                Total Revenue
              </span>
              <span
                className="small fw-semibold"
                style={{ color: stats.revenueChange >= 0 ? "#198754" : "#dc3545" }}
              >
                <i className={`bi ${stats.revenueChange >= 0 ? "bi-arrow-up" : "bi-arrow-down"} me-1`}></i>
                {Math.abs(stats.revenueChange)}%
              </span>
            </div>
            <h3 className="fw-bold text-white mb-2">Rs {stats.totalRevenue.toLocaleString()}</h3>
            <div style={{ height: "6px", background: "rgba(255,255,255,.06)", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(Math.abs(stats.revenueChange), 100)}%`,
                  background: "#198754",
                  borderRadius: "4px",
                  transition: "width 0.6s ease",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="stat-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold text-white mb-0">
              <i className="bi bi-clock-history text-warning me-2"></i>
              Recent Orders
            </h4>
          </div>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => onNavigate?.("orders")}
            style={{ borderRadius: "8px" }}
          >
            View All
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-5 text-white-50">
            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
            No orders yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Cylinder</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Status</th>
                  <th className="text-end">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const style = getStatusStyle(order.status);
                  return (
                    <tr key={order.id}>
                      <td>
                        <div className="fw-semibold text-white">{order.full_name}</div>
                        <small className="text-white-50">{order.email}</small>
                      </td>
                      <td>{order.cylinder_size}</td>
                      <td className="text-center">{order.quantity}</td>
                      <td className="text-center fw-bold text-warning">
                        Rs {Number(order.total_price || 0).toLocaleString()}
                      </td>
                      <td className="text-center">
                        <span
                          className="badge px-3 py-2"
                          style={{ backgroundColor: style.bg, color: style.color, borderRadius: "8px" }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="text-end text-white-50 small">{formatDate(order.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
