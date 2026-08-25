import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// Zod Schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function RegisterandLoginPage({ showOnlyBookGas }) {
  const [activeTab, setActiveTab] = useState("login");

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const {
    register: regRegister,
    handleSubmit: handleRegSubmit,
    formState: { errors: regErrors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onLogin = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/login", data);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Login failed!");
    }
  };

  const onRegister = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/register", data);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
  };

  // Book Gas form (unchanged)
  if (showOnlyBookGas) {
    return (
      <div className="container mt-5" style={{ maxWidth: "700px" }}>
        <div className="card shadow-lg border-0 rounded-4" style={{ background: "#f8f9fa" }}>
          <div className="card-header text-white text-center rounded-top-4" style={{ background: "linear-gradient(90deg, #28a745, #218838)" }}>
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
                <label className="form-label"><i className="bi bi-telephone-fill me-2"></i> Contact Number</label>
                <input type="text" className="form-control" placeholder="03XXXXXXXXX" />
              </div>
              <div className="mb-3">
                <label className="form-label">Preferred Delivery Time</label>
                <input type="text" className="form-control" placeholder="e.g. 2:00 PM - 4:00 PM" />
              </div>
              <button type="button" className="btn w-100 shadow-sm" style={{ background: "linear-gradient(90deg, #28a745, #218838)", color: "white" }}>
                Submit Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Login/Register ----------------
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      }}
    >
      <div className="card shadow-lg border-0 rounded-4" style={{ width: "100%", maxWidth: "700px", padding: "20px" }}>
        {/* Tabs */}
        <div className="card-header bg-white border-0">
          <ul className="nav nav-tabs card-header-tabs justify-content-center">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "login" ? "active text-success fw-bold" : "text-muted"}`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "register" ? "active text-primary fw-bold" : "text-muted"}`}
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
            <form onSubmit={handleLoginSubmit(onLogin)}>
              <h3 className="text-center mb-4 text-success">Login</h3>

              <div className="mb-3">
                <label className="form-label"><i className="bi bi-envelope-fill me-2"></i> Email</label>
                <input type="email" className={`form-control ${loginErrors.email ? "is-invalid" : ""}`} {...loginRegister("email")} placeholder="Enter email" />
                <div className="invalid-feedback">{loginErrors.email?.message}</div>
              </div>

              <div className="mb-3">
                <label className="form-label"><i className="bi bi-lock-fill me-2"></i> Password</label>
                <input type="password" className={`form-control ${loginErrors.password ? "is-invalid" : ""}`} {...loginRegister("password")} placeholder="Enter password" />
                <div className="invalid-feedback">{loginErrors.password?.message}</div>
              </div>

              <div className="mb-3 d-flex justify-content-between">
                <a href="#" className="text-success small">Forgot Password?</a>
              </div>

              <button
                type="submit"
                className="btn w-100 shadow-sm"
                style={{
                  background: "linear-gradient(90deg, #28a745, #218838)",
                  color: "white",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
              >
                Login
              </button>

              <p className="text-center mt-3 small">
                Don't have an account? <span className="text-primary fw-bold" style={{ cursor: "pointer" }} onClick={() => setActiveTab("register")}>Register</span>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === "register" && (
            <form onSubmit={handleRegSubmit(onRegister)}>
              <h3 className="text-center mb-4 text-primary">Register</h3>

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className={`form-control ${regErrors.fullName ? "is-invalid" : ""}`} {...regRegister("fullName")} placeholder="John Doe" />
                <div className="invalid-feedback">{regErrors.fullName?.message}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className={`form-control ${regErrors.email ? "is-invalid" : ""}`} {...regRegister("email")} placeholder="example@email.com" />
                <div className="invalid-feedback">{regErrors.email?.message}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className={`form-control ${regErrors.password ? "is-invalid" : ""}`} {...regRegister("password")} placeholder="Password" />
                <div className="invalid-feedback">{regErrors.password?.message}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" className={`form-control ${regErrors.confirmPassword ? "is-invalid" : ""}`} {...regRegister("confirmPassword")} placeholder="Confirm password" />
                <div className="invalid-feedback">{regErrors.confirmPassword?.message}</div>
              </div>

              <button
                type="submit"
                className="btn w-100 shadow-sm"
                style={{
                  background: "linear-gradient(90deg, #007bff, #0056b3)",
                  color: "white",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
              >
                Register
              </button>

              <p className="text-center mt-3 small">
                Already have an account? <span className="text-success fw-bold" style={{ cursor: "pointer" }} onClick={() => setActiveTab("login")}>Login</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterandLoginPage;
