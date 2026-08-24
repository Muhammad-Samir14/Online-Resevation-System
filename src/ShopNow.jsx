import { Link } from "react-router-dom";

function ShopNow() {
  const shopOptions = [
    {
      icon: "bi bi-shop",
      title: "MARWAT LPG Shop",
      desc: "LPG cylinders and accessories for home and commercial use.",
      btnText: "Shop Now",
      btnLink: "/shop",
      btnColor: "btn btn-warning text-dark fw-bold",
      iconColor: "text-primary",
      iconBg: "#e8f2ff",
    },
    {
      icon: "bi bi-truck",
      title: "Bulk Deliveries",
      desc: "Large-volume LPG supply for restaurants, hotels, businesses and commercial customers.",
      btnText: "Order Bulk",
      btnLink: "/bulk-delivery",
      btnColor: "btn btn-primary text-white fw-bold",
      iconColor: "text-warning",
      iconBg: "#fff8e1",
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: "#f0f5ff" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">
            <i className="bi bi-bag-check-fill text-warning me-2"></i>Our Services
          </h2>
          <p className="text-muted">Choose the option that fits your needs</p>
        </div>
        <div className="row g-4 justify-content-center">
          {shopOptions.map((item, index) => (
            <div key={index} className="col-md-6">
              <div
                className="card border-0 shadow-sm h-100 rounded-4 p-4"
                style={{ transition: "box-shadow 0.3s, transform 0.3s" }}
                onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(13,110,253,0.12)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div className="card-body text-center">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: "72px", height: "72px", backgroundColor: item.iconBg }}>
                    <i className={`${item.icon} fs-1 ${item.iconColor}`}></i>
                  </div>
                  <h5 className="card-title fw-bold text-dark">{item.title}</h5>
                  <p className="card-text text-muted mb-4">{item.desc}</p>
                  <Link to={item.btnLink} className={`${item.btnColor} px-4`}>{item.btnText}</Link>
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
