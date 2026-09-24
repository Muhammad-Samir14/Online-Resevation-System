import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/logo.png";

const ADMIN_EMAIL = "isamirkhan5616@gmail.com";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState({ type: "", message: "" });
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // First check: email must match the admin email
      if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setError("Access denied. This email is not authorized for admin access.");
        setLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Second check: verify is_admin = true in the profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin profile not found.");
      }

      if (!profile.is_admin) {
        await supabase.auth.signOut();
        throw new Error("Access denied. Your account does not have admin privileges.");
      }

      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotStatus({ type: "", message: "" });
    setForgotLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        forgotEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      if (resetError) throw resetError;
      setForgotStatus({
        type: "success",
        message: "Password reset link sent! Check your email inbox.",
      });
    } catch (err) {
      setForgotStatus({
        type: "error",
        message: err.message || "Could not send reset email. Please try again.",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #10233f 0%, #084298 100%)",
      }}
    >
      <div
        className="shadow-lg"
        style={{
          borderRadius: "22px",
          background: "#ffffff",
          maxWidth: "440px",
          width: "100%",
        }}
      >
        <div className="p-4 p-md-5">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "56px",
                height: "56px",
                background: "#eef5ff",
              }}
            >
              <img
                src={logo}
                alt="Marwat Gas Agency"
                width="40"
                height="40"
                className="rounded-circle"
              />
            </div>

            <h4 className="fw-bold mb-1" style={{ color: "#10233f" }}>
              Admin Portal
            </h4>

            <p className="text-muted small mb-0">
              Authorized personnel only
            </p>
          </div>

          {showForgotPassword ? (
            <div>
              {forgotStatus.message && (
                <div
                  className={`alert ${forgotStatus.type === "success" ? "alert-success" : "alert-danger"} small py-2 mb-3`}
                  role="alert"
                >
                  {forgotStatus.message}
                </div>
              )}

              <form onSubmit={handleForgotPassword}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Admin Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control marwat-input"
                      placeholder="admin@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn marwat-primary-btn w-100 py-3"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                  ) : (
                    <><i className="bi bi-envelope-paper me-2"></i>Send Reset Link</>
                  )}
                </button>
              </form>

              <p className="text-center mt-4 mb-0">
                <button
                  type="button"
                  className="btn btn-link p-0 fw-bold text-decoration-none"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotStatus({ type: "", message: "" });
                  }}
                >
                  Back to Admin Login
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Admin Email</label>

                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-envelope"></i>
                  </span>

                  <input
                    type="email"
                    className="form-control marwat-input"
                    placeholder="admin@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold">Password</label>

                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-lock"></i>
                  </span>

                  <input
                    type="password"
                    className="form-control marwat-input"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="text-end mb-3">
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none small fw-semibold"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </div>

              {error && (
                <div className="alert alert-danger small py-2" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn marwat-primary-btn w-100 py-3 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-shield-lock-fill me-2"></i>
                    Access Admin Panel
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
