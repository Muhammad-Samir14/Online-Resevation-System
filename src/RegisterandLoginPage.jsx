import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
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

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterandLoginPage() {
  const [activeTab, setActiveTab] = useState("login");

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: regRegister,
    handleSubmit: handleRegSubmit,
    formState: { errors: regErrors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert(`Welcome back, ${res.data.user.name}! 👋`);

      if (res.data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/shop";
      }
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Login failed!"
      );
    }
  };

  const onRegister = async (data) => {
    try {
      const backendData = {
        name: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        backendData
      );

      alert(res.data.message);

      setActiveTab("login");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Registration failed!"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main
        className="d-flex align-items-center"
        style={{
          minHeight: "calc(100vh - 76px)",
          background: "#f5f8fc",
        }}
      >
        <div className="container py-5">
          <div
            className="row justify-content-center align-items-center"
          >
            <div className="col-xl-10 col-lg-11">
              <div
                className="row g-0 overflow-hidden shadow-lg"
                style={{
                  borderRadius: "22px",
                  background: "#ffffff",
                }}
              >
                {/* LEFT BRAND PANEL */}
                <div
                  className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 text-white"
                  style={{
                    background:
                      "linear-gradient(145deg, #10233f 0%, #084298 100%)",
                  }}
                >
                  <div>
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                      style={{
                        width: "64px",
                        height: "64px",
                        background:
                          "rgba(255,193,7,.15)",
                      }}
                    >
                      <i className="bi bi-fire fs-2 text-warning"></i>
                    </div>

                    <h2 className="fw-bold mb-3">
                      Marwat Gas Agency
                    </h2>

                    <p className="text-white-50 fs-5">
                      Fast, reliable and convenient LPG
                      reservation and delivery services.
                    </p>
                  </div>

                  <div>
                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-shield-check text-warning me-3"></i>
                      Safe & dependable LPG service
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <i className="bi bi-truck text-warning me-3"></i>
                      Convenient doorstep delivery
                    </div>

                    <div className="d-flex align-items-center">
                      <i className="bi bi-phone text-warning me-3"></i>
                      Easy online booking
                    </div>
                  </div>
                </div>

                {/* FORM PANEL */}
                <div className="col-lg-7">
                  <div className="p-4 p-md-5">
                    {/* MOBILE BRAND */}
                    <div className="d-lg-none text-center mb-4">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                        style={{
                          width: "55px",
                          height: "55px",
                          background: "#fff4cc",
                        }}
                      >
                        <i className="bi bi-fire fs-3 text-warning"></i>
                      </div>

                      <h4
                        className="fw-bold mb-1"
                        style={{ color: "#10233f" }}
                      >
                        Marwat Gas Agency
                      </h4>

                      <p className="text-muted small mb-0">
                        Secure account access
                      </p>
                    </div>

                    {/* TABS */}
                    <div className="d-flex justify-content-center mb-4">
                      <div
                        className="d-flex p-1"
                        style={{
                          background: "#eef3f8",
                          borderRadius: "12px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTab("login")
                          }
                          className="btn px-4"
                          style={{
                            borderRadius: "9px",
                            background:
                              activeTab === "login"
                                ? "#10233f"
                                : "transparent",
                            color:
                              activeTab === "login"
                                ? "#fff"
                                : "#5d6877",
                            fontWeight: 600,
                          }}
                        >
                          Login
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveTab("register")
                          }
                          className="btn px-4"
                          style={{
                            borderRadius: "9px",
                            background:
                              activeTab === "register"
                                ? "#10233f"
                                : "transparent",
                            color:
                              activeTab === "register"
                                ? "#fff"
                                : "#5d6877",
                            fontWeight: 600,
                          }}
                        >
                          Register
                        </button>
                      </div>
                    </div>

                    {/* LOGIN */}
                    {activeTab === "login" && (
                      <form
                        onSubmit={handleLoginSubmit(
                          onLogin
                        )}
                      >
                        <div className="text-center mb-4">
                          <span className="section-kicker">
                            Welcome Back
                          </span>

                          <h2 className="section-title mb-1">
                            Login to Your Account
                          </h2>

                          <p className="text-muted">
                            Access your bookings and account.
                          </p>
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Email Address
                          </label>

                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-envelope"></i>
                            </span>

                            <input
                              type="email"
                              className={`form-control marwat-input ${
                                loginErrors.email
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="example@email.com"
                              {...loginRegister("email")}
                            />
                          </div>

                          {loginErrors.email && (
                            <div className="text-danger small mt-1">
                              {
                                loginErrors.email
                                  .message
                              }
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Password
                          </label>

                          <div className="input-group">
                            <span className="input-group-text bg-white">
                              <i className="bi bi-lock"></i>
                            </span>

                            <input
                              type="password"
                              className={`form-control marwat-input ${
                                loginErrors.password
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Enter password"
                              {...loginRegister(
                                "password"
                              )}
                            />
                          </div>

                          {loginErrors.password && (
                            <div className="text-danger small mt-1">
                              {
                                loginErrors.password
                                  .message
                              }
                            </div>
                          )}
                        </div>

                        <div className="text-end mb-4">
                          <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none small"
                          >
                            Forgot Password?
                          </button>
                        </div>

                        <button
                          type="submit"
                          className="btn marwat-primary-btn w-100 py-3"
                        >
                          Login
                          <i className="bi bi-arrow-right ms-2"></i>
                        </button>

                        <p className="text-center mt-4 mb-0">
                          Don't have an account?{" "}
                          <button
                            type="button"
                            className="btn btn-link p-0 fw-bold text-decoration-none"
                            onClick={() =>
                              setActiveTab(
                                "register"
                              )
                            }
                          >
                            Register
                          </button>
                        </p>
                      </form>
                    )}

                    {/* REGISTER */}
                    {activeTab === "register" && (
                      <form
                        onSubmit={handleRegSubmit(
                          onRegister
                        )}
                      >
                        <div className="text-center mb-4">
                          <span className="section-kicker">
                            Create Account
                          </span>

                          <h2 className="section-title mb-1">
                            Register with Marwat Gas
                          </h2>

                          <p className="text-muted">
                            Create your account for faster
                            future bookings.
                          </p>
                        </div>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Full Name
                            </label>

                            <input
                              type="text"
                              className={`form-control marwat-input ${
                                regErrors.fullName
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Your full name"
                              {...regRegister(
                                "fullName"
                              )}
                            />

                            <div className="invalid-feedback">
                              {
                                regErrors.fullName
                                  ?.message
                              }
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Mobile Number
                            </label>

                            <input
                              type="tel"
                              className={`form-control marwat-input ${
                                regErrors.phoneNumber
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="03XX XXXXXXX"
                              {...regRegister(
                                "phoneNumber"
                              )}
                            />

                            <div className="invalid-feedback">
                              {
                                regErrors
                                  .phoneNumber?.message
                              }
                            </div>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">
                              Email Address
                            </label>

                            <input
                              type="email"
                              className={`form-control marwat-input ${
                                regErrors.email
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="example@email.com"
                              {...regRegister("email")}
                            />

                            <div className="invalid-feedback">
                              {
                                regErrors.email?.message
                              }
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Password
                            </label>

                            <input
                              type="password"
                              className={`form-control marwat-input ${
                                regErrors.password
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Minimum 6 characters"
                              {...regRegister(
                                "password"
                              )}
                            />

                            <div className="invalid-feedback">
                              {
                                regErrors.password
                                  ?.message
                              }
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold">
                              Confirm Password
                            </label>

                            <input
                              type="password"
                              className={`form-control marwat-input ${
                                regErrors.confirmPassword
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Repeat password"
                              {...regRegister(
                                "confirmPassword"
                              )}
                            />

                            <div className="invalid-feedback">
                              {
                                regErrors
                                  .confirmPassword
                                  ?.message
                              }
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="btn marwat-primary-btn w-100 py-3 mt-4"
                        >
                          Create Account
                          <i className="bi bi-person-plus ms-2"></i>
                        </button>

                        <p className="text-center mt-4 mb-0">
                          Already have an account?{" "}
                          <button
                            type="button"
                            className="btn btn-link p-0 fw-bold text-decoration-none"
                            onClick={() =>
                              setActiveTab(
                                "login"
                              )
                            }
                          >
                            Login
                          </button>
                        </p>
                      </form>
                    )}

                    <div className="text-center mt-4">
                      <Link
                        to="/"
                        className="text-muted text-decoration-none small"
                      >
                        <i className="bi bi-arrow-left me-1"></i>
                        Back to Home
                      </Link>
                    </div>
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