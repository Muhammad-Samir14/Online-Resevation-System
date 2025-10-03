import React, { useState } from "react";

function RegisterandLoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  // form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // handlers
  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", loginForm);
    alert("Login successful! (backend connection pending)");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registration submitted:", registerForm);
    alert("Registration successful! (backend connection pending)");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="text-center mb-4">
        <button
          className={`btn ${isLogin ? "btn-success" : "btn-outline-success"} me-2`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`btn ${!isLogin ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      {/* Login Form */}
      {isLogin && (
        <form onSubmit={handleLoginSubmit} className="card p-4 shadow">
          <h2 className="text-center mb-3">Login</h2>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
        </form>
      )}

      {/* Register Form */}
      {!isLogin && (
        <form onSubmit={handleRegisterSubmit} className="card p-4 shadow">
          <h2 className="text-center mb-3">Register</h2>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={registerForm.name}
              onChange={handleRegisterChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={registerForm.password}
              onChange={handleRegisterChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={registerForm.confirmPassword}
              onChange={handleRegisterChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      )}
    </div>
  );
}

export default RegisterandLoginPage
