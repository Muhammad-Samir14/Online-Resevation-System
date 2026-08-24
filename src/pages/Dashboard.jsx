import React from "react";

export default function Dashboard() {
  return (
    <div className="animate__animated animate__fadeIn text-white p-4">
      <h2 className="fw-bold mb-4">Agency Overview</h2>
      
      {/* Metric Cards Row */}
      <div className="row g-4 mb-5">
        {[
          { title: "Total Revenue", val: "Rs. 24,500", color: "text-primary" },
          { title: "Pending Orders", val: "12", color: "text-warning" },
          { title: "Active Fleet", val: "05", color: "text-success" }
        ].map((item, i) => (
          <div key={i} className="col-md-4">
            <div className="bg-dark border border-secondary p-4 rounded-4 shadow-lg">
              <h6 className="text-secondary text-uppercase small">{item.title}</h6>
              <h3 className={`${item.color} fw-bold`}>{item.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="bg-dark border border-secondary p-4 rounded-4 shadow-lg">
        <h5 className="text-secondary fw-bold mb-4">RECENT ACTIVITY</h5>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between border-bottom border-secondary pb-2">
            <span>⚡ Database Metrics Synchronized</span>
            <small className="text-muted">Just now</small>
          </div>
          <div className="d-flex align-items-center justify-content-between border-bottom border-secondary pb-2">
            <span>🚚 Delivery Fleet #4 arrived at I-Block</span>
            <small className="text-muted">10 mins ago</small>
          </div>
        </div>
      </div>
    </div>
  );
}