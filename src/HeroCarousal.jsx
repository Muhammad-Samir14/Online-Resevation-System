import { Link } from "react-router-dom";
import pic1 from "./assets/pic1.jpg";
import pic3 from "./assets/pic3.jpg";
import image3 from "./assets/image3.jpg";

function HeroCarousel() {
  const slides = [
    {
      image: pic1,
      title: "Welcome to Marwat Gas Agency",
      text: "Book your LPG cylinder online quickly and easily.",
      buttonText: "Book Now",
      buttonLink: "/register",
      buttonClass: "btn btn-warning fw-semibold px-4",
    },
    {
      image: pic3,
      title: "Fast and Reliable Delivery",
      text: "We deliver gas cylinders safely to your doorstep.",
      buttonText: "Track Order",
      buttonLink: "/login",
      buttonClass: "btn btn-primary fw-semibold px-4",
    },
    {
      image: image3,
      title: "Safe and Convenient",
      text: "Enjoy dependable service and easy online booking.",
      buttonText: "Learn More",
      buttonLink: "#",
      buttonClass: "btn btn-light fw-semibold px-4",
    },
  ];

  const captionStyle = {
    color: "#fff",
    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
  };

  return (
    <div
      id="heroCarousel"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
      data-bs-interval="4000"
      style={{
        backgroundColor: "#000", // prevents white background between slides
      }}
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
          ></button>
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            style={{ height: "100vh" }}
          >
            {/* Image Container to prevent flicker */}
            <div style={{ height: "100%", overflow: "hidden" }}>
              <img
                src={slide.image}
                className="d-block w-100"
                alt={slide.title}
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.8)",
                  backgroundColor: "#000", // fixes white flash
                }}
              />
            </div>

            {/* Caption */}
            <div className="carousel-caption d-flex flex-column h-100 align-items-center justify-content-center text-center px-3">
              <h1 className="fw-bold display-5" style={captionStyle}>
                {slide.title}
              </h1>
              <p className="lead mb-4" style={captionStyle}>
                {slide.text}
              </p>
              <Link to={slide.buttonLink} className={slide.buttonClass}>
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" />
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" />
      </button>
    </div>
  );
}

export default HeroCarousel;
