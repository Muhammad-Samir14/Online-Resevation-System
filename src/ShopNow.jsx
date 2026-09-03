import { Link } from "react-router-dom";

function ShopNow() {
 const shopOptions = [
  {
    icon: "bi-shop",
    title: "Marwat LPG Shop",
    description:
      "Browse domestic, commercial and industrial LPG cylinders and accessories.",
    accent: "#0d6efd",
    button: "Shop Cylinders",
    path: "/shop",
  },
  {
    icon: "bi-droplet-fill",
    title: "LPG Refill",
    description:
      "Book a safe and convenient cylinder refill with doorstep delivery.",
    accent: "#0d6efd",
    button: "Book Refill",
    path: "/book-gas?service=refill",
  },
  {
    icon: "bi-truck",
    title: "Bulk Deliveries",
    description:
      "Reliable LPG supply solutions for restaurants, shops and businesses.",
    accent: "#0d6efd",
    button: "Order Bulk",
    path: "/book-gas?service=bulk",
  },
];

  return (
    <section className="marwat-section" style={{ background: "linear-gradient(135deg, #b9e4ff 0%, #d7efff 45%, #eef7ff 100%)" }}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="section-kicker">Our Services</span>

          <h2 className="section-title display-6">
            LPG Services Made Simple
          </h2>

          <p className="section-description">
            Choose the service you need and reserve your LPG cylinder quickly
            through Marwat Gas Agency.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {shopOptions.map((item) => (
            <div className="col-lg-4 col-md-6 d-flex" key={item.title}>
              <div
                className="h-100 p-4 rounded-4 text-center d-flex flex-column w-100"
                style={{
                  background: "#10233f",
                  color: "white",
                  border: "1px solid #1e3657",
                  boxShadow: "0 12px 30px rgba(16,35,63,.15)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 mx-auto"
                  style={{
                    width: "72px",
                    height: "72px",
                    background: "rgba(13,110,253,.18)",
                    border: "1px solid rgba(13,110,253,.3)",
                  }}
                >
                  <i
                    className={`bi ${item.icon} fs-2`}
                    style={{ color: "#ffc107" }}
                  ></i>
                </div>

                <h4 className="fw-bold mb-3 text-white">
                  {item.title}
                </h4>

                <p className="text-white-50 mb-4 flex-grow-1">
                  {item.description}
                </p>

                <Link
                  to={item.path}
                  className="btn marwat-primary-btn px-4 py-2 mt-auto"
                  style={{ color: "#ffffff" }}
                >
                  {item.button}
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopNow;
