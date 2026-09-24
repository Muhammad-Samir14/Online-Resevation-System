import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/register"), 2000);
    } catch (err) {
      setError(err.message || "Could not update password. Please try again.");
    } finally {
      setLoading(false);
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
                background: "rgba(255,193,7,.12)",
              }}
            >
              <i className="bi bi-key-fill fs-2 text-warning"></i>
            </div>
            <h4 className="fw-bold mb-1" style={{ color: "#10233f" }}>
              Set New Password
            </h4>
            <p className="text-muted small mb-0">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="alert alert-danger small py-2 mb-3" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success small py-2 mb-3" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">New Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control marwat-input"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control marwat-input"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn marwat-primary-btn w-100 py-3"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</>
              ) : (
                <><i className="bi bi-check-circle-fill me-2"></i>Update Password</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
