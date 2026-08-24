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

function RegisterandLoginPage() {
  //  The Fix
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

  // Login handler
// 🛠️ Real-world Login Handler
const onLogin = async (data) => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", data);
    
    // 1️⃣ Save User Token & Info so the browser remembers them
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user)); 

    alert(`Welcome back, ${res.data.user.name}! 👋`);

    // 2️⃣ Smart Redirect based on who logged in
    if (res.data.user.role === "admin") {
      window.location.href = "/admin"; // Load Admin Control Panel
    } else {
      window.location.href = "/shop"; // Load standard Gas Booking Shop
    }

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Login failed!");
  }
};
  // Registration handler 
  const onRegister = async (data) => {
    try {
      const backendData = {
        name: data.fullName, 
        email: data.email,
        password: data.password
      };

      const res = await axios.post("http://localhost:5000/api/auth/register", backendData);
      alert(res.data.message);
      setActiveTab("login"); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

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