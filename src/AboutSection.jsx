import "./App.css";

const characteristics = [
  { icon: "bi bi-shield-check", title: "Safety First", desc: "Every cylinder is tested and certified to meet the highest safety standards before delivery.", iconBg: "#e8f2ff", iconColor: "text-primary" },
  { icon: "bi bi-truck", title: "Reliable Delivery", desc: "On-time delivery you can count on — our fleet ensures your LPG reaches you safely and promptly.", iconBg: "#fff8e1", iconColor: "text-warning" },
  { icon: "bi bi-calendar-check", title: "Easy Booking", desc: "Book your cylinder online in just a few clicks. No phone calls, no waiting in queues.", iconBg: "#e8f2ff", iconColor: "text-primary" },
  { icon: "bi bi-headset", title: "Customer Support", desc: "Our dedicated support team is always ready to help with any questions or concerns.", iconBg: "#fff8e1", iconColor: "text-warning" },
];

function AboutSection() {
  return (
    <section className="py-5" style={{ backgroundColor: "#f0f5ff" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">Why Choose Marwat Gas Agency?</h2>
          <p className="text-muted">Our commitment to quality and service excellence</p>
        </div>
        <div className="row g-4">
          {characteristics.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <div className="about-card">
                <div className="about-icon" style={{ backgroundColor: item.iconBg }}>
                  <i className={`bi ${item.icon} ${item.iconColor}`}></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                <p className="text-muted small mb-0">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
