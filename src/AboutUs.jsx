import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <>
      <Navbar />

      <main>
        <section
          className="py-5 text-white"
          style={{
            background:
              "linear-gradient(135deg, #084298 0%, #0d6efd 100%)",
          }}
        >
          <div className="container py-4 text-center">
            <span className="text-warning fw-bold text-uppercase">
              About Marwat Gas
            </span>

            <h1 className="display-4 fw-bold mt-2">
              Reliable LPG Service You Can Trust
            </h1>

            <p className="lead mx-auto" style={{ maxWidth: "750px" }}>
              Providing convenient LPG booking and delivery solutions for
              homes and businesses.
            </p>
          </div>
        </section>

        <section className="marwat-section">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <span className="section-kicker">
                  Who We Are
                </span>

                <h2 className="section-title">
                  Marwat Gas Agency
                </h2>

                <p className="text-muted fs-5">
                  Marwat Gas Agency is focused on making LPG cylinder
                  reservation and delivery simpler, safer and more convenient
                  for customers.
                </p>

                <p className="text-muted">
                  Our online reservation system allows customers to select
                  their cylinder requirements, provide delivery information
                  and choose their preferred payment method from one easy
                  platform.
                </p>

                <Link
                  to="/book-gas"
                  className="btn marwat-primary-btn px-4 py-3 mt-2"
                >
                  Reserve Your Cylinder
                </Link>
              </div>

              <div className="col-lg-6">
                <div className="row g-3">
                  {[
                    ["bi-shield-check", "Safety First"],
                    ["bi-truck", "Reliable Delivery"],
                    ["bi-phone", "Easy Booking"],
                    ["bi-headset", "Customer Support"],
                  ].map(([icon, title]) => (
                    <div className="col-6" key={title}>
                      <div
                        className="text-center p-4 h-100 rounded-4"
                        style={{
                          background: "#eef5ff",
                          border: "1px solid #d9e6f8",
                          transition:
                            "transform 0.25s ease, box-shadow 0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-5px)";
                          e.currentTarget.style.boxShadow =
                            "0 18px 40px rgba(13, 110, 253, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{
                            width: "56px",
                            height: "56px",
                            background: "#0d6efd",
                          }}
                        >
                          <i
                            className={`bi ${icon} fs-3 text-white`}
                          ></i>
                        </div>

                        <h5
                          className="fw-bold mt-2 mb-0"
                          style={{ color: "#10233f" }}
                        >
                          {title}
                        </h5>
                      </div>
                    </div>
                  ))}
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

export default AboutUs;