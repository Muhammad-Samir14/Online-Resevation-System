import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "./supabaseClient";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    phoneNumber: z
      .string()
      .min(10, "Enter a valid phone number")
      .max(15, "Enter a valid phone number"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterandLoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setLoginError("");
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      const role = authData.user?.app_metadata?.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/shop");
      }
    } catch (err) {
      setLoginError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data) => {
    setRegError("");
    setRegSuccess("");
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone_number: data.phoneNumber,
          },
        },
      });

      if (error) throw error;

      if (authData?.session) {
        const role = authData.user?.app_metadata?.role;
        navigate(role === "admin" ? "/admin" : "/shop");
      } else if (authData?.user) {
        setRegSuccess("Account created! Please check your email to confirm, then log in.");
        setActiveTab("login");
      } else {
        setRegSuccess("Account created successfully! You can now log in.");
        setActiveTab("login");
      }
    } catch (err) {
      setRegError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main
        className="d-flex align-items-center"
        style={{ minHeight: "calc(100vh - 76px)", background: "#f5f8fc" }}
      >
        <div className="container py-4 py-md-5">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              <div
                className="shadow-lg overflow-hidden"
                style={{ borderRadius: "22px", background: "#ffffff" }}
              >
                <div
                  className="p-4 p-md-5 text-white text-center"
                  style={{
                    background: "linear-gradient(135deg, #084298 0%, #0d6efd 100%)",
                  }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: "56px", height: "56px", background: "rgba(255,255,255,.15)" }}
                  >
                    <i className="bi bi-fire fs-2 text-warning"></i>
                  </div>
                  <h4 className="fw-bold mb-1">Marwat Gas Agency</h4>
                  <p className="text-white-50 small mb-0">Secure account access</p>
                </div>

                <div className="p-4 p-md-5">
                  <div className="d-flex justify-content-center mb-4">
                    <div
                      className="d-flex p-1 w-100"
                      style={{ background: "#eef3f8", borderRadius: "12px" }}
                    >
                      <button
                        type="button"
                        onClick={() => { setActiveTab("login"); setLoginError(""); setRegError(""); setRegSuccess(""); }}
                        className="btn flex-grow-1"
                        style={{
                          borderRadius: "9px",
                          background: activeTab === "login" ? "#0d6efd" : "transparent",
                          color: activeTab === "login" ? "#fff" : "#5d6877",
                          fontWeight: 600,
                        }}
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={() => { setActiveTab("register"); setLoginError(""); setRegError(""); setRegSuccess(""); }}
                        className="btn flex-grow-1"
                        style={{
                          borderRadius: "9px",
                          background: activeTab === "register" ? "#0d6efd" : "transparent",
                          color: activeTab === "register" ? "#fff" : "#5d6877",
                          fontWeight: 600,
                        }}
                      >
                        Register
                      </button>
                    </div>
                  </div>

                  {activeTab === "login" && (
                    <form onSubmit={handleLoginSubmit(onLogin)}>
                      <div className="text-center mb-4">
                        <span className="section-kicker">Welcome Back</span>
                        <h2 className="section-title mb-1">Login to Your Account</h2>
                        <p className="text-muted">Access your bookings and account.</p>
                      </div>

                      {loginError && (
                        <div className="alert alert-danger small py-2 mb-3" role="alert">
                          {loginError}
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Email Address</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            type="email"
                            className={`form-control marwat-input ${loginErrors.email ? "is-invalid" : ""}`}
                            placeholder="example@email.com"
                            {...loginRegister("email")}
                          />
                        </div>
                        {loginErrors.email && (
                          <div className="text-danger small mt-1">{loginErrors.email.message}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="bi bi-lock"></i>
                          </span>
                          <input
                            type="password"
                            className={`form-control marwat-input ${loginErrors.password ? "is-invalid" : ""}`}
                            placeholder="Enter password"
                            {...loginRegister("password")}
                          />
                        </div>
                        {loginErrors.password && (
                          <div className="text-danger small mt-1">{loginErrors.password.message}</div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="btn marwat-primary-btn w-100 py-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</>
                        ) : (
                          <>Login <i className="bi bi-arrow-right ms-2"></i></>
                        )}
                      </button>

                      <p className="text-center mt-4 mb-0">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          className="btn btn-link p-0 fw-bold text-decoration-none"
                          onClick={() => { setActiveTab("register"); setLoginError(""); }}
                        >
                          Register
                        </button>
                      </p>
                    </form>
                  )}

                  {activeTab === "register" && (
                    <form onSubmit={handleRegSubmit(onRegister)}>
                      <div className="text-center mb-4">
                        <span className="section-kicker">Create Account</span>
                        <h2 className="section-title mb-1">Register with Marwat Gas</h2>
                        <p className="text-muted">Create your account for faster future bookings.</p>
                      </div>

                      {regError && (
                        <div className="alert alert-danger small py-2 mb-3" role="alert">
                          {regError}
                        </div>
                      )}
                      {regSuccess && (
                        <div className="alert alert-success small py-2 mb-3" role="alert">
                          {regSuccess}
                        </div>
                      )}

                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold">Full Name</label>
                          <input
                            type="text"
                            className={`form-control marwat-input ${regErrors.fullName ? "is-invalid" : ""}`}
                            placeholder="Your full name"
                            {...regRegister("fullName")}
                          />
                          <div className="invalid-feedback">{regErrors.fullName?.message}</div>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold">Phone Number</label>
                          <input
                            type="tel"
                            className={`form-control marwat-input ${regErrors.phoneNumber ? "is-invalid" : ""}`}
                            placeholder="03XX XXXXXXX"
                            {...regRegister("phoneNumber")}
                          />
                          <div className="invalid-feedback">{regErrors.phoneNumber?.message}</div>
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold">Email Address</label>
                          <input
                            type="email"
                            className={`form-control marwat-input ${regErrors.email ? "is-invalid" : ""}`}
                            placeholder="example@email.com"
                            {...regRegister("email")}
                          />
                          <div className="invalid-feedback">{regErrors.email?.message}</div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Password</label>
                          <input
                            type="password"
                            className={`form-control marwat-input ${regErrors.password ? "is-invalid" : ""}`}
                            placeholder="Minimum 6 characters"
                            {...regRegister("password")}
                          />
                          <div className="invalid-feedback">{regErrors.password?.message}</div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Confirm Password</label>
                          <input
                            type="password"
                            className={`form-control marwat-input ${regErrors.confirmPassword ? "is-invalid" : ""}`}
                            placeholder="Repeat password"
                            {...regRegister("confirmPassword")}
                          />
                          <div className="invalid-feedback">{regErrors.confirmPassword?.message}</div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn marwat-primary-btn w-100 py-3 mt-4"
                        disabled={loading}
                      >
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</>
                        ) : (
                          <>Create Account <i className="bi bi-person-plus ms-2"></i></>
                        )}
                      </button>

                      <p className="text-center mt-4 mb-0">
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="btn btn-link p-0 fw-bold text-decoration-none"
                          onClick={() => { setActiveTab("login"); setRegError(""); setRegSuccess(""); }}
                        >
                          Login
                        </button>
                      </p>
                    </form>
                  )}

                  <div className="text-center mt-4">
                    <Link to="/" className="text-muted text-decoration-none small">
                      <i className="bi bi-arrow-left me-1"></i> Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default RegisterandLoginPage;
