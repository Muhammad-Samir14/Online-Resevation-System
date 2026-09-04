import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
    currentStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [customersRes, bookingsRes, productsRes] = await Promise.all([
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("*"),
        supabase.from("products").select("name, stock"),
      ]);

      const bookings = bookingsRes.data || [];
      const products = productsRes.data || [];

      const pending = bookings.filter((b) => b.status === "Pending").length;
      const completed = bookings.filter(
        (b) => b.status === "Delivered"
      ).length;
      const revenue = bookings
        .filter((b) => b.status === "Delivered")
        .reduce((sum, b) => sum + Number(b.total_price || 0), 0);
      const stock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);

      setStats({
        totalCustomers: customersRes.count || 0,
        totalOrders: bookings.length,
        pendingOrders: pending,
        completedOrders: completed,
        revenue,
        currentStock: stock,
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Customers", value: stats.totalCustomers, icon: "bi-people-fill", color: "#0d6efd" },
    { label: "Total Orders", value: stats.totalOrders, icon: "bi-clipboard-data", color: "#0dcaf0" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: "bi-clock-fill", color: "#ffc107" },
    { label: "Completed Orders", value: stats.completedOrders, icon: "bi-check-circle-fill", color: "#198754" },
    { label: "Revenue", value: `Rs ${stats.revenue.toLocaleString()}`, icon: "bi-cash-stack", color: "#198754" },
    { label: "Current Stock", value: stats.currentStock, icon: "bi-box-seam", color: "#0d6efd" },
  ];

  return (
    <div>
      <div className="mb-5">
        <small className="text-warning fw-bold text-uppercase" style={{ letterSpacing: "1.5px", fontSize: ".75rem" }}>
          Overview
        </small>
        <h2 className="fw-bold text-white mb-1">Dashboard</h2>
        <p className="text-white-50 mb-0">Real-time agency performance at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="row g-3 g-md-4 mb-5">
        {statCards.map((stat, idx) => (
          <div key={idx} className="col-6 col-lg-4">
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
              <h3 className="fw-bold text-white mb-0">{stat.value}</h3>
            </div>
          </div>
        ))}
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
