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
      case "delivery":
        return <DeliveryPersonnelManagement />;
      case "customers":
        return <CustomersManagement />;
      case "product":
        return <ProductManagement />;
      case "orders":
        return <OrdersManagement />; // Render OrdersManagement component
      default:
        const stats = [
          { title: "Commercial Cylinders", value: 120, bg: "bg-primary", color: "text-white", section: "stock" },
          { title: "Domestic Cylinders", value: 340, bg: "bg-success", color: "text-white", section: "stock" },
          { title: "Industrial Cylinders", value: 75, bg: "bg-danger", color: "text-white", section: "stock" },
          { title: "Orders Today", value: 12, bg: "bg-warning", color: "text-dark", section: "orders" },
          { title: "Orders This Week", value: 100, bg: "bg-info", color: "text-dark", section: "orders" },
          { title: "Total Orders", value: 560, bg: "bg-secondary", color: "text-white", section: "orders" },
          { title: "Revenue This Week", value: "Rs. 245,000", bg: "bg-success", color: "text-white", section: "revenue" },
          { title: "Revenue Last Week", value: "Rs. 215,000", bg: "bg-info", color: "text-dark", section: "revenue" },
          { title: "Revenue Last Month", value: "Rs. 950,000", bg: "bg-warning", color: "text-dark", section: "revenue" },
        ];

        const sections = [
          { id: "stock", label: "Cylinder Stock Summary" },
          { id: "orders", label: "Order Summary" },
          { id: "revenue", label: "Revenue Summary" },
        ];

        return (
          <div>
            <h3 className="mb-4 text-center">📋 Dashboard Overview</h3>
            {sections.map((section) => (
              <div key={section.id} className="mb-4">
                <h5 className="mb-3">{section.label}</h5>
                <div className="row g-4">
                  {stats
                    .filter((stat) => stat.section === section.id)
                    .map((stat, idx) => (
                      <div key={idx} className="col-md-4">
                        <div className={`card shadow-sm ${stat.bg}`}>
                          <div className={`card-body text-center ${stat.color}`}>
                            <h5 className="card-title">{stat.title}</h5>
                            <p className="fs-3 fw-bold">{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4 className="fw-bold mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                className={`btn w-100 text-start ${
                  activePage === item.id ? "btn-primary" : "btn-outline-light"
                }`}
                onClick={() => setActivePage(item.id)}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <hr />
        <a href="/" className="btn btn-danger w-100">
          ← Back to Home
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto p-4">{renderContent()}</div>
    </div>
  );
}

export default AdminLayout;
