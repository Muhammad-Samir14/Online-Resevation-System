import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ShopNow() {
  // 🧩 Step 1 — Your original card data, kept same as before
  const shopOptions = [
    {
      icon: "bi bi-shop",
      title: "MARWAT LPG Shop",
      desc: "Visit our LPG shop for high-quality cylinders.",
      btnText: "Shop Now",
      btnColor: "btn btn-outline-success",
      iconColor: "text-success",
      bgColor: "bg-warning-subtle",
    },
    {
      icon: "bi bi-droplet-fill",
      title: "LPG Refill",
      desc: "Get your LPG cylinder refilled quickly and safely.",
      btnText: "Refill Now",
      btnColor: "btn btn-outline-danger",
      iconColor: "text-danger",
    },
    {
      icon: "bi bi-truck",
      title: "Bulk Deliveries",
      desc: "Order large quantities for commercial or industrial needs.",
      btnText: "Order Bulk",
      btnColor: "btn btn-outline-warning",
      iconColor: "text-warning",
    },
  ];

  // 🧩 Step 2 — Use map() to generate the cards dynamically
  return (
    <section className="py-5 bg-warning">
      <div className="container text-center">
        <h2 className="fw-bold mb-4">
          <i className="bi bi-bag-check-fill text-secondary me-2"></i>
          Shop Now
        </h2>

        <div className="row g-4">
          {shopOptions.map((item, index) => (
            <div key={index} className="col-md-4 col-sm-6">
              <div className="card border-0 shadow-sm p-4 h-100">
                <div className="card-body">
                  <i className={`${item.icon} fs-1 ${item.iconColor} mb-3`}></i>
                  <h5 className="card-title fw-semibold">{item.title}</h5>
                  <p className="card-text text-muted">{item.desc}</p>
                  <Link to="/shop" className={`${item.btnColor} px-4 mt-2`}>
                    {item.btnText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopNow;
