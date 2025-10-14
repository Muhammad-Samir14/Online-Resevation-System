import { Link } from "react-router-dom";
import pic1 from "./assets/pic1.jpg";
import pic3 from "./assets/pic3.jpg";
import image3 from "./assets/image3.jpg";

function HeroCarousal() {
  const captionStyle = {
    color: "#fff",
    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
  };

  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" />
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" />
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" />
      </div>

      <div className="carousel-inner">
        {/* Slide 1 */}
        <div className="carousel-item active">
          <img src={pic1} className="d-block w-100" style={{ height: "100vh", objectFit: "cover" }} />
          <div className="carousel-caption d-flex flex-column h-100 align-items-center justify-content-center">
            <h1 className="fw-bold display-4" style={captionStyle}>
              Welcome to Marwat Gas Agency
            </h1>
            <p className="lead mb-4" style={captionStyle}>
              Book your LPG cylinder online quickly and easily.
            </p>
            <Link to="/register" className="btn btn-warning fw-semibold px-4">
              Book Now
            </Link>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="carousel-item">
          <img src={pic3} className="d-block w-100" style={{ height: "100vh", objectFit: "cover" }} />
          <div className="carousel-caption d-flex flex-column h-100 align-items-center justify-content-center">
            <h1 className="fw-bold display-5" style={captionStyle}>
              Fast and Reliable Delivery
            </h1>
            <p className="lead mb-4" style={captionStyle}>
              We deliver gas cylinders safely to your doorstep.
            </p>
            <Link to="/login" className="btn btn-primary fw-semibold px-4">
              Track Order
            </Link>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="carousel-item">
          <img src={image3} className="d-block w-100" style={{ height: "100vh", objectFit: "cover" }} />
          <div className="carousel-caption d-flex flex-column h-100 align-items-center justify-content-center">
            <h1 className="fw-bold display-5" style={captionStyle}>
              Safe and Convenient
            </h1>
            <p className="lead mb-4" style={captionStyle}>
              Enjoy dependable service and easy online booking.
            </p>
            <a  className="btn btn-light fw-semibold px-4">
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" />
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" />
      </button>
    </div>
  );
}

export default HeroCarousal;
