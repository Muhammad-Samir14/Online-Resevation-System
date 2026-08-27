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
    path: "/services",
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
    <section className="marwat-section" style={{ background: "linear-gradient(180deg, #eef5ff 0%, #f7f9fc 100%)" }}>
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
            <div className="col-lg-4 col-md-6" key={item.title}>
              <div className="marwat-card h-100 p-4 text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                  style={{
                    width: "72px",
                    height: "72px",
                    background: `${item.accent}15`,
                  }}
                >
                  <i
                    className={`bi ${item.icon} fs-2`}
                    style={{ color: item.accent }}
                  ></i>
                </div>

                <h4 className="fw-bold" style={{ color: "#10233f" }}>
                  {item.title}
                </h4>

                <p className="text-muted mb-4">
                  {item.description}
                </p>

                <Link
                  to={item.path}
                  className="btn marwat-primary-btn px-4 py-2"
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
