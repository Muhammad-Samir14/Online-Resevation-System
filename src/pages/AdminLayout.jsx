import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import CustomersManagement from "./CustomersManagement";
import DeliveryPersonnelManagement from "./DeliveryPersonnelManagement";
import ProductManagement from "./ProductManagement";
import OrdersManagement from "./OrdersManagement";

const ADMIN_EMAIL = "isamirkhan5616@gmail.com";
const ADMIN_PASSWORD = "03489334Pro@";

function AdminLayout() {
  const [activePage, setActivePage] = useState("overview");
  const [authed, setAuthed] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_authed");
    if (stored === "true") setAuthed(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginErr("");
    try {
      if (loginEmail.trim().toLowerCase() === ADMIN_EMAIL && loginPass === ADMIN_PASSWORD) {
        const { error } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });
        sessionStorage.setItem("admin_authed", "true");
        setAuthed(true);
      } else {
        setLoginErr("Invalid admin credentials.");
      }
    } catch (err) {
      sessionStorage.setItem("admin_authed", "true");
      setAuthed(true);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
    setLoginEmail("");
    setLoginPass("");
  };

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: "bi-speedometer2" },
    { id: "customers", label: "Manage Customers", icon: "bi-people-fill" },
    { id: "product", label: "Product Management", icon: "bi-box-seam-fill" },
    { id: "orders", label: "Order Management", icon: "bi-clipboard-check-fill" },
    { id: "delivery", label: "Delivery Management", icon: "bi-truck" },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "delivery": return <DeliveryPersonnelManagement />;
      case "customers": return <CustomersManagement />;
      case "product": return <ProductManagement />;
      case "orders": return <OrdersManagement />;
      default:
        const stats = [
          { title: "Commercial", value: 120, trend: "+12%", color: "primary" },
          { title: "Domestic", value: 340, trend: "+5%", color: "success" },
          { title: "Industrial", value: 75, trend: "-2%", color: "danger" },
          { title: "Orders Today", value: 12, trend: "High", color: "warning" },
          { title: "Orders This Week", value: 100, trend: "Stable", color: "info" },
          { title: "Total Revenue", value: "Rs. 950k", trend: "+18%", color: "primary" },
        ];
        return (
          <div>
            <header className="mb-4 d-flex justify-content-between align-items-center bg-white p-4 rounded-4 shadow-sm border">
              <div>
                <h2 className="fw-bold mb-0 text-primary">Marwat Command Center</h2>
                <p className="text-muted mb-0 small">Operational intelligence &amp; monitoring</p>
              </div>
              <span className="badge bg-success p-2 shadow-sm">System Online</span>
            </header>
            <div className="row g-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="col-md-4">
                  <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden" style={{ borderRadius: "16px" }}>
                    <div className={`position-absolute top-0 end-0 bg-${stat.color}`} style={{ width: "80px", height: "80px", filter: "blur(70px)", opacity: "0.15" }}></div>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted text-uppercase fw-bold small">{stat.title}</span>
                        <span className={`text-${stat.color} small fw-bold`}>{stat.trend}</span>
                      </div>
                      <h2 className="fw-bold text-dark mb-0">{stat.value}</h2>
                      <div className="progress mt-3" style={{ height: "4px" }}>
                        <div className={`progress-bar bg-${stat.color}`} style={{ width: "70%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row mt-4">
              <div className="col-lg-12">
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "16px" }}>
                  <h5 className="fw-bold mb-4 text-primary"><i className="bi bi-activity me-2"></i>Live Operations Log</h5>
                  <div className="list-group list-group-flush">
                    <div className="list-group-item d-flex justify-content-between align-items-center px-0 border-bottom">
                      <span><i className="bi bi-truck text-primary me-2"></i>Truck #XYZ-5678 departed for Sector J-Block</span>
                      <small className="text-muted">2 mins ago</small>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center px-0 border-bottom">
                      <span><i className="bi bi-check-circle text-success me-2"></i>New Domestic Booking #1024 confirmed</span>
                      <small className="text-muted">15 mins ago</small>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <span><i className="bi bi-exclamation-triangle text-warning me-2"></i>Low Stock Alert: Industrial Cylinders below 10 units</span>
                      <small className="text-muted">1 hour ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!authed) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "linear-gradient(135deg, #e8f2ff 0%, #fff8e1 100%)" }}>
        <div className="card shadow border-0 rounded-4" style={{ width: "100%", maxWidth: "420px" }}>
          <div className="card-header bg-primary text-white text-center rounded-top-4 py-3">
            <h4 className="mb-0 fw-bold"><i className="bi bi-shield-lock me-2"></i>Admin Login</h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Email</label>
                <input type="email" className="form-control" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="admin@email.com" required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Password</label>
                <input type="password" className="form-control" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="Enter password" required />
              </div>
              {loginErr && <div className="alert alert-danger py-2 small">{loginErr}</div>}
              <button type="submit" className="btn btn-warning text-dark fw-bold w-100" disabled={loading}>
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f0f5ff" }}>
      <aside className="bg-primary d-flex flex-column p-3" style={{ width: "260px", minHeight: "100vh" }}>
        <div className="mb-4 px-2 text-center">
          <h5 className="fw-bold text-white mb-0">MARWAT GAS</h5>
          <small className="text-warning fw-bold">Admin Suite</small>
        </div>
        <nav className="nav nav-pills flex-column mb-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link text-start d-flex align-items-center py-2 mb-1 border-0 ${activePage === item.id ? "active bg-warning text-dark fw-bold" : "text-white"}`}
              onClick={() => setActivePage(item.id)}
              style={{ borderRadius: "10px", transition: "0.2s" }}
            >
              <i className={`bi ${item.icon} me-2 fs-5`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-3 border-top border-light">
          <button onClick={handleLogout} className="btn btn-danger w-100 py-2 fw-bold" style={{ borderRadius: "10px" }}>
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </aside>

      <main className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: "#f0f5ff" }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminLayout;
