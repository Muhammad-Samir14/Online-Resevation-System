import Navbar from "./Navbar";
import Footer from "./Footer";

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "Contact form UI is ready. We will connect it to Supabase/backend next."
    );
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

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Full Name
                        </label>

                        <input
                          type="text"
                          className="form-control marwat-input"
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          className="form-control marwat-input"
                          placeholder="03XX XXXXXXX"
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Email
                        </label>

                        <input
                          type="email"
                          className="form-control marwat-input"
                          placeholder="example@email.com"
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Message
                        </label>

                        <textarea
                          rows="5"
                          className="form-control"
                          placeholder="How can we help you?"
                          required
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn marwat-primary-btn px-5 py-3"
                        >
                          Send Message
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