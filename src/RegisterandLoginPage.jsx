import React, { useState } from "react";

function RegisterandLoginPage() {
  const [activeTab, setActiveTab] = useState("login");

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
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "book" ? "active" : ""}`}
                onClick={() => setActiveTab("book")}
              >
                Book Gas
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
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="Enter email" />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
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

          {/* GAS BOOKING FORM */}
          {activeTab === "book" && (
            <form>
              <h3 className="text-center mb-4">Gas Reservation</h3>

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" placeholder="Receiver's full name" />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" placeholder="e.g. 0300-1234567" />
              </div>

              <div className="mb-3">
                <label className="form-label">Cylinder Type</label>
                <select className="form-select">
                  <option value="Domestic">Domestic</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input type="number" min="1" className="form-control" defaultValue={1} />
              </div>

              <h5 className="mt-4">Delivery Address</h5>

              <div className="mb-3">
                <label className="form-label">Street Address</label>
                <input type="text" className="form-control" placeholder="House #, Street Name" />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">City</label>
                  <input type="text" className="form-control" placeholder="City name" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Postal Code / ZIP</label>
                  <input type="text" className="form-control" placeholder="e.g. 54000" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Nearest Landmark (Optional)</label>
                <input type="text" className="form-control" placeholder="Near mosque, school, etc." />
              </div>

              <div className="mb-3">
                <label className="form-label">Preferred Delivery Date</label>
                <input type="date" className="form-control" />
              </div>

              <button type="button" className="btn btn-warning w-100">
                Confirm Booking
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterandLoginPage;
