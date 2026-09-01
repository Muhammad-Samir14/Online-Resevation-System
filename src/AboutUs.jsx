import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import cylinderPhoto from "./assets/photo1.jpg";

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

        <section
          className="marwat-section"
          style={{
            background:
              "linear-gradient(135deg, #084298 0%, #0d6efd 52%, #5bb9ed 100%)",
          }}
        >
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <span className="text-warning fw-bold text-uppercase">
                  Who We Are
                </span>

                <h2 className="fw-bold text-white mt-2">
                  Marwat Gas Agency
                </h2>

                <p className="text-white fs-5">
                  Marwat Gas Agency is focused on making LPG cylinder
                  reservation and delivery simpler, safer and more convenient
                  for customers.
                </p>

                <p className="text-white-50">
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
