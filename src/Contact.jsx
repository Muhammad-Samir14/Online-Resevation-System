import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: "", message: "" });
    setSubmitting(true);

    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          status: "New",
        },
      ]);

      if (error) throw error;

      setSubmitStatus({
        type: "success",
        message: "Your message has been sent! We'll get back to you soon.",
      });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: "Could not send your message. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ background: "#f5f8fc" }}>
        <section className="marwat-section">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-kicker">
                Contact Us
              </span>

              <h1 className="section-title">
                We're Here to Help
              </h1>

              <p className="section-description">
                Contact Marwat Gas Agency for LPG reservations, delivery
                queries and customer support.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-lg-4">
                <div
                  className="marwat-card p-4 h-100"
                  style={{ background: "#10233f", color: "white" }}
                >
                  <h3 className="fw-bold mb-4">
                    Contact Information
                  </h3>

                  <div className="mb-4">
                    <i className="bi bi-telephone-fill text-warning me-3"></i>
                    +92 98765 43210
                  </div>

                  <div className="mb-4">
                    <i className="bi bi-envelope-fill text-warning me-3"></i>
                    support@gasreserve.com
                  </div>

                  <div>
                    <i className="bi bi-geo-alt-fill text-warning me-3"></i>
                    Pakistan
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="marwat-card p-4 p-lg-5">
                  <h3 className="fw-bold mb-4">
                    Send Us a Message
                  </h3>

                  {submitStatus.message && (
                    <div
                      className={`alert ${submitStatus.type === "success" ? "alert-success" : "alert-danger"} d-flex align-items-center`}
                      role="alert"
                      style={{ borderRadius: "12px" }}
                    >
                      <i className={`bi ${submitStatus.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"} me-2`}></i>
                      {submitStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          className="form-control marwat-input"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          className="form-control marwat-input"
                          placeholder="03XX XXXXXXX"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Email
                        </label>

                        <input
                          type="email"
                          name="email"
                          className="form-control marwat-input"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Message
                        </label>

                        <textarea
                          rows="5"
                          name="message"
                          className="form-control marwat-input"
                          placeholder="How can we help you?"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn marwat-primary-btn px-5 py-3"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                          ) : (
                            <>Send Message</>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;
