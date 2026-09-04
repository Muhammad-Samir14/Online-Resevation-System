import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/logo.png";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const role = data.user?.app_metadata?.role;
      if (role !== "admin") {
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin authorization required.");
      }

      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid admin credentials.");
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

            <div className="mb-3">
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
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
