import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import cylinderPhoto from "./assets/photo1.jpg";

function AboutUs() {
  return (
    <>
      <Navbar />

      <main style={{ background: "linear-gradient(135deg, #b9e4ff 0%, #d7efff 45%, #eef7ff 100%)" }}>
        <section className="marwat-section">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-kicker">About Marwat Gas</span>

              <h2 className="section-title display-6">
                Reliable LPG Service You Can Trust
              </h2>

              <p className="section-description">
                Providing convenient LPG booking and delivery solutions for
                homes and businesses.
              </p>
            </div>
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
                  platform. We combine safety, reliable delivery, easy booking
                  and responsive customer support in every service we provide.
                </p>

                <Link
                  to="/book-gas"
                  className="btn marwat-primary-btn px-4 py-3 mt-2"
                >
                  Reserve Your Cylinder
                </Link>
              </div>

              <div className="col-lg-6 text-center">
                <img
                  src={cylinderPhoto}
                  alt="Red LPG gas cylinders"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxHeight: "430px", width: "100%", objectFit: "cover" }}
                />
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
