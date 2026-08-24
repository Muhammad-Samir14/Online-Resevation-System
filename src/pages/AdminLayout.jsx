import React, { useState } from "react";
import CustomersManagement from "./CustomersManagement";
import DeliveryPersonnelManagement from "./DeliveryPersonnelManagement";
import ProductManagement from "./ProductManagement";
import OrdersManagement from "./OrdersManagement";

function AdminLayout() {
  const [activePage, setActivePage] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "customers", label: "Manage Customers", icon: "👤" },
    { id: "product", label: "Product Management", icon: "📦" },
    { id: "orders", label: "Order Management", icon: "📝" },
    { id: "delivery", label: "Delivery Management", icon: "🛒" },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "delivery": return <DeliveryPersonnelManagement />;
      case "customers": return <CustomersManagement />;
      case "product": return <ProductManagement />;
      case "orders": return <OrdersManagement />;
      default:
        return (
          <div className="animate__animated animate__fadeIn text-white">
            <header className="mb-5 d-flex justify-content-between align-items-center bg-dark p-4 rounded-4 shadow border border-secondary">
              <div>
                <h2 className="fw-bold mb-0 text-primary">Marwat Command Center</h2>
                <p className="text-secondary mb-0 small">Operational intelligence & monitoring</p>
              </div>
              <span className="badge bg-success p-2 shadow-sm">System Online</span>
            </header>

            <div className="row g-4">
              {[
                { title: "Commercial", value: 120, trend: "+12%", color: "primary" },
                { title: "Domestic", value: 340, trend: "+5%", color: "success" },
                { title: "Industrial", value: 75, trend: "-2%", color: "danger" },
                { title: "Orders Today", value: 12, trend: "High", color: "warning" },
                { title: "Orders This Week", value: 100, trend: "Stable", color: "info" },
                { title: "Total Revenue", value: "Rs. 950k", trend: "+18%", color: "primary" },
              ].map((stat, idx) => (
                <div key={idx} className="col-md-4">
                  <div className="card bg-dark border-secondary h-100 shadow-lg position-relative overflow-hidden" style={{ borderRadius: "20px" }}>
                    <div className={`position-absolute top-0 end-0 bg-${stat.color}`} style={{ width: "80px", height: "80px", filter: "blur(70px)", opacity: "0.2" }}></div>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-secondary text-uppercase fw-bold small">{stat.title}</span>
                        <span className={`text-${stat.color} small fw-bold`}>{stat.trend}</span>
                      </div>
                      <h2 className="fw-bold text-white mb-0">{stat.value}</h2>
                      <div className="progress mt-3" style={{ height: "4px", backgroundColor: "#333" }}>
                        <div className={`progress-bar bg-${stat.color}`} style={{ width: "70%" }}></div>
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
        .admin-wrapper { display: flex; height: 100vh; width: 100vw; background-color: #0f111a; color: white; overflow: hidden; }
        .sidebar { width: 280px; background-color: #161b22; border-right: 1px solid #2d333b; display: flex; flex-direction: column; padding: 1.5rem; }
        .content-area { flex-grow: 1; overflow-y: auto; padding: 3rem; background-color: #0f111a; }
      `}</style>

      <aside className="sidebar">
        <div className="mb-5 px-3 text-center">
          <h4 className="fw-bold text-white mb-0" style={{ letterSpacing: "1px" }}>MARWAT GAS</h4>
          <small className="text-primary fw-bold small">Admin Suite v2.0</small>
        </div>
        
        <nav className="nav nav-pills flex-column mb-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link text-start d-flex align-items-center py-3 mb-2 border-0 ${activePage === item.id ? "active bg-primary text-white shadow" : "text-secondary bg-transparent"}`}
              onClick={() => setActivePage(item.id)}
              style={{ borderRadius: "12px", transition: "0.3s" }}
            >
              <span className="me-3 fs-5">{item.icon}</span>
              <span className="fw-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-auto pt-4 border-top border-secondary">
          <a href="/" className="btn btn-danger w-100 py-2 border-0 fw-bold shadow-sm" style={{ borderRadius: "10px" }}>Exit to Home</a>
        </div>
      </aside>

      <main className="content-area">
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminLayout;