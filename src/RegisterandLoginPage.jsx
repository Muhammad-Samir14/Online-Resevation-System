import React, { useState } from "react";

function RegisterandLoginPage({ showOnlyBookGas }) {
  const [activeTab, setActiveTab] = useState("login");

  // ✅ If the user comes from ShopPage with "Book Gas" request
  if (showOnlyBookGas) {
    return (
      <div className="container mt-5" style={{ maxWidth: "700px" }}>
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-header bg-success text-white text-center rounded-top-4">
            <h4 className="mb-0">Book Gas</h4>
          </div>
          <div className="card-body p-4">
            <form>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" placeholder="Enter your name" />
              </div>

              <div className="mb-3">
                <label className="form-label">Delivery Address</label>
                <input type="text" className="form-control" placeholder="Enter your address" />
              </div>

              <div className="mb-3">
                <label className="form-label">
                <i className="bi bi-telephone-fill me-2"></i> Contact Number
                </label>

                <input type="text" className="form-control" placeholder="03XXXXXXXXX" />
              </div>

              <div className="mb-3">
                <label className="form-label">Preferred Delivery Time</label>
                <input type="text" className="form-control" placeholder="e.g. 2:00 PM - 4:00 PM" />
              </div>

              <button type="button" className="btn btn-success w-100">
                Submit Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Default login/register page
  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow-lg border-0 rounded-4">
        {/* Tabs */}
        <div className="card-header bg-white border-0">
          <ul className="nav nav-tabs card-header-tabs justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "register" ? "active" : ""}`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </li>
          </ul>
        </div>

        {/* Card Body */}
        <div className="card-body p-4">
          {/* LOGIN FORM */}
          {activeTab === "login" && (
            <form>
              <h3 className="text-center mb-4">Login</h3>
              <div className="mb-3">
                <label className="form-label">
                <i className="bi bi-envelope-fill me-2"></i> Email
                </label>

                <input type="email" className="form-control" placeholder="Enter email" />
              </div>
              <div className="mb-3">
              <label className="form-label">
              <i className="bi bi-lock-fill me-2"></i> Password
              </label>

                <input type="password" className="form-control" placeholder="Enter password" />
              </div>
              <button type="button" className="btn btn-success w-100">
                Login
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === "register" && (
            <form>
              <h3 className="text-center mb-4">Register</h3>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" placeholder="John Doe" />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="example@email.com" />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Password" />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" placeholder="Confirm password" />
              </div>
              <button type="button" className="btn btn-primary w-100">
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterandLoginPage;
