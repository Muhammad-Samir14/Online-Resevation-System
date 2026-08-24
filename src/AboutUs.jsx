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
                      <div className="marwat-card text-center p-4">
                        <i
                          className={`bi ${icon} fs-2 text-primary`}
                        ></i>

                        <h5 className="fw-bold mt-3 mb-0">
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