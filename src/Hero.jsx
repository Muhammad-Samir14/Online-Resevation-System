import { Link } from "react-router-dom";
import truckImage from "./assets/OmcYXJ copy.png";

function Hero() {
  const heroSections = [
    {
      title: "Marwat Gas Agency: Delivering Energy You Can Trust",
      desc1:
        "Established with a mission to provide safe, clean, and reliable LPG energy across Pakistan, Marwat Gas Agency has built a trusted reputation in the energy sector. With a dedicated network of distributors, delivery partners, and customer-focused support, we ensure efficient gas supply for homes, restaurants, and industries alike.",
      desc2:
        "Our professional management team is driven by quality, safety, and innovation — making Marwat Gas Agency one of the most dependable LPG service providers in the region.",
      btnText: "Reserve Now",
      btnLink: "/register",
      image: truckImage,
      bgColor: "#77BEF0",
      btnClass: "btn btn-warning text-dark fw-bold btn-lg shadow",
    },
  ];

  return (
    <>
      {heroSections.map((hero, index) => (
        <section
          key={index}
          className="py-5"
          style={{ backgroundColor: hero.bgColor }}
        >
          <div className="container">
            <div className="row align-items-center g-4">
              {/* Text Section */}
              <div className="col-md-6 order-1">
                <h1 className="display-5 fw-bold mb-3 text-dark hero-title">
                  {hero.title}
                </h1>
                <p className="lead text-dark mb-4 hero-lead">{hero.desc1}</p>
                <p className="text-dark mb-4 hero-desc">{hero.desc2}</p>
                <Link to={hero.btnLink} className={hero.btnClass}>
                  {hero.btnText}
                </Link>
              </div>

              {/* Image Section */}
              <div className="col-md-6 text-center order-2">
                <img
                  src={hero.image}
                  alt="Delivery worker loading LPG cylinders onto a truck"
                  className="img-fluid rounded-4 shadow hero-img"
                  style={{ width: "100%", maxWidth: "560px", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

export default Hero;
