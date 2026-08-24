import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "./supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your email or phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Enter a valid phone number")
      .regex(/^03\d{2}[-\s]?\d{7}$/, "Use format 03XX XXXXXXX"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterandLoginPage({ showOnlyBookGas }) {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.identifier.includes("@") ? data.identifier : `${data.identifier}@marwatgas.com`,
        password: data.password,
      });
      if (error) throw error;
      alert("Login successful!");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  const onRegister = async (data) => {
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
        },
      });
      if (error) throw error;

      await supabase.from("customers").insert({
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        status: "Active",
        total_orders: 0,
      });

      alert("Registration successful!");
      setActiveTab("login");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  if (showOnlyBookGas) {
    return (
      <div className="container mt-5" style={{ maxWidth: "700px" }}>
        <div className="card shadow-lg border-0 rounded-4" style={{ background: "#f8f9fa" }}>
          <div className="card-header text-white text-center rounded-top-4 bg-primary">
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
              <button type="button" className="btn btn-warning text-dark fw-bold w-100">Submit Booking</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="auth-header">
          <h4 className="fw-bold mb-0">Marwat Gas Agency</h4>
          <p className="mb-0 small">Welcome to your account</p>
        </div>

        <div className="px-3 pt-3">
          <ul className="nav nav-tabs justify-content-center border-0">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "login" ? "active" : ""}`} onClick={() => setActiveTab("login")}>Login</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "register" ? "active" : ""}`} onClick={() => setActiveTab("register")}>Register</button>
            </li>
          </ul>
        </div>

        <div className="card-body p-4">
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit(onLogin)}>
              <h5 className="text-center mb-4 text-primary fw-bold">Login to Your Account</h5>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark"><i className="bi bi-person-fill me-2"></i>Email or Phone Number</label>
                <input type="text" className={`form-control auth-input ${loginErrors.identifier ? "is-invalid" : ""}`} {...loginRegister("identifier")} placeholder="Email or 03XX XXXXXXX" />
                <div className="invalid-feedback">{loginErrors.identifier?.message}</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark"><i className="bi bi-lock-fill me-2"></i>Password</label>
                <input type="password" className={`form-control auth-input ${loginErrors.password ? "is-invalid" : ""}`} {...loginRegister("password")} placeholder="Enter password" />
                <div className="invalid-feedback">{loginErrors.password?.message}</div>
              </div>
              <div className="mb-3 d-flex justify-content-end">
                <a href="#" className="text-primary small text-decoration-none">Forgot Password?</a>
              </div>
              <button type="submit" className="btn btn-auth-primary w-100" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
              <p className="text-center mt-3 small text-muted">
                Don't have an account? <span className="text-primary fw-bold" style={{ cursor: "pointer" }} onClick={() => setActiveTab("register")}>Register</span>
              </p>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegSubmit(onRegister)}>
              <h5 className="text-center mb-4 text-primary fw-bold">Create New Account</h5>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Full Name</label>
                <input type="text" className={`form-control auth-input ${regErrors.fullName ? "is-invalid" : ""}`} {...regRegister("fullName")} placeholder="John Doe" />
                <div className="invalid-feedback">{regErrors.fullName?.message}</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Email</label>
                <input type="email" className={`form-control auth-input ${regErrors.email ? "is-invalid" : ""}`} {...regRegister("email")} placeholder="example@email.com" />
                <div className="invalid-feedback">{regErrors.email?.message}</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark"><i className="bi bi-telephone-fill me-2"></i>Phone Number</label>
                <input type="tel" className={`form-control auth-input ${regErrors.phone ? "is-invalid" : ""}`} {...regRegister("phone")} placeholder="03XX XXXXXXX" />
                <div className="invalid-feedback">{regErrors.phone?.message}</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Password</label>
                <input type="password" className={`form-control auth-input ${regErrors.password ? "is-invalid" : ""}`} {...regRegister("password")} placeholder="Password" />
                <div className="invalid-feedback">{regErrors.password?.message}</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Confirm Password</label>
                <input type="password" className={`form-control auth-input ${regErrors.confirmPassword ? "is-invalid" : ""}`} {...regRegister("confirmPassword")} placeholder="Confirm password" />
                <div className="invalid-feedback">{regErrors.confirmPassword?.message}</div>
              </div>
              <button type="submit" className="btn btn-auth-secondary w-100" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
              <p className="text-center mt-3 small text-muted">
                Already have an account? <span className="text-primary fw-bold" style={{ cursor: "pointer" }} onClick={() => setActiveTab("login")}>Login</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterandLoginPage;
