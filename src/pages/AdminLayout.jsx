import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomersManagement from "./CustomersManagement";
import DeliveryPersonnelManagement from "./DeliveryPersonnelManagement";
import ProductManagement from "./ProductManagement";
import OrdersManagement from "./OrdersManagement";

function AdminLayout() {
  const [activePage, setActivePage] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: "bi-speedometer2" },
    { id: "customers", label: "Manage Customers", icon: "bi-people-fill" },
    { id: "product", label: "Product Management", icon: "bi-box-seam" },
    { id: "orders", label: "Order Management", icon: "bi-clipboard-data" },
    { id: "delivery", label: "Delivery Management", icon: "bi-truck" },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "delivery": return <DeliveryPersonnelManagement />;
      case "customers": return <CustomersManagement />;
      case "product": return <ProductManagement />;
      case "orders": return <OrdersManagement />;
      default:
        return (
          <div>
            <header
              className="mb-5 d-flex justify-content-between align-items-center p-4 rounded-4 shadow-sm"
              style={{ background: "#fff", border: "1px solid #dce5f0" }}
            >
              <div>
                <h2 className="fw-bold mb-0" style={{ color: "#10233f" }}>
                  Marwat Command Center
                </h2>
                <p className="text-muted mb-0 small">
                  Operational intelligence &amp; monitoring
                </p>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 shadow-sm">
                <i className="bi bi-circle-fill me-2" style={{ fontSize: "0.6rem" }}></i>
                System Online
              </span>
            </header>

            <div className="row g-4">
              {[
                { title: "Commercial", value: 120, trend: "+12%", color: "#0d6efd" },
                { title: "Domestic", value: 340, trend: "+5%", color: "#198754" },
                { title: "Industrial", value: 75, trend: "-2%", color: "#dc3545" },
                { title: "Orders Today", value: 12, trend: "High", color: "#ffc107" },
                { title: "Orders This Week", value: 100, trend: "Stable", color: "#0dcaf0" },
                { title: "Total Revenue", value: "Rs. 950k", trend: "+18%", color: "#0d6efd" },
              ].map((stat, idx) => (
                <div key={idx} className="col-md-4">
                  <div
                    className="card h-100 shadow-sm position-relative overflow-hidden"
                    style={{
                      borderRadius: "16px",
                      background: "#fff",
                      border: "1px solid #dce5f0",
                    }}
                  >
                    <div
                      className="position-absolute top-0 end-0"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: stat.color,
                        filter: "blur(60px)",
                        opacity: "0.12",
                      }}
                    ></div>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between mb-3">
                        <span
                          className="text-uppercase fw-bold small"
                          style={{ color: "#6c757d" }}
                        >
                          {stat.title}
                        </span>
                        <span
                          className="small fw-bold"
                          style={{ color: stat.color }}
                        >
                          {stat.trend}
                        </span>
                      </div>
                      <h2 className="fw-bold mb-0" style={{ color: "#10233f" }}>
                        {stat.value}
                      </h2>
                      <div
                        className="progress mt-3"
                        style={{ height: "4px", backgroundColor: "#eef3f8" }}
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "70%", background: stat.color }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper { display: flex; height: 100vh; width: 100vw; background-color: #f5f8fc; overflow: hidden; }
        .sidebar { width: 260px; background: linear-gradient(180deg, #10233f 0%, #084298 100%); display: flex; flex-direction: column; padding: 1.5rem; }
        .content-area { flex-grow: 1; overflow-y: auto; padding: 2.5rem; background-color: #f5f8fc; }
      `}</style>

      <aside className="sidebar">
        <div className="mb-5 px-2">
          <h4 className="fw-bold text-white mb-0" style={{ letterSpacing: "1px" }}>
            MARWAT GAS
          </h4>
          <small className="text-warning fw-bold">Admin Suite</small>
        </div>

        <nav className="nav nav-pills flex-column mb-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link text-start d-flex align-items-center py-3 mb-1 border-0 ${
                activePage === item.id
                  ? "active text-white shadow-sm"
                  : "text-white-50"
              }`}
              onClick={() => setActivePage(item.id)}
              style={{
                borderRadius: "10px",
                transition: "0.25s",
                background:
                  activePage === item.id ? "rgba(255,255,255,.15)" : "transparent",
              }}
            >
              <i className={`bi ${item.icon} me-3 fs-5`}></i>
              <span className="fw-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-top border-secondary">
          <a
            href="/"
            className="btn btn-warning w-100 py-2 border-0 fw-bold shadow-sm"
            style={{ borderRadius: "10px" }}
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            Exit to Home
          </a>
        </div>
      </aside>

      <main className="content-area">{renderContent()}</main>
    </div>
  );
}

export default AdminLayout;
