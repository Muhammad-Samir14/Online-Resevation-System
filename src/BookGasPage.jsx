import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function BookGasPage() {
  return (
    <div
      className="py-5"
      style={{
        background: "linear-gradient(135deg, #c9eaff 0%, #fff8b5 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="container mt-4" style={{ maxWidth: "800px" }}>
        <div
          className="card shadow-lg border-0 rounded-4"
          style={{
            background: "linear-gradient(145deg, #ffffff, #f9fbff)",
          }}
        >
          {/* Header */}
          <div
            className="card-header text-white text-center rounded-top-4"
            style={{
              background: "linear-gradient(90deg, #007bff, #00c6ff)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            }}
          >
            <h3 className="mb-0 fw-bold">💨 Gas Cylinder Delivery Reservation</h3>
          </div>

          {/* Form Body */}
          <div className="card-body p-4">
            <form>
              <h5 className="text-center text-secondary mb-4">
                Fill your booking details below
              </h5>

              {/* Customer Info */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-primary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control border-primary shadow-sm"
                    placeholder="Receiver's full name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-primary">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control border-primary shadow-sm"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-primary">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control border-primary shadow-sm"
                    placeholder="e.g. 0300-1234567"
                  />
                </div>
              </div>

              {/* Cylinder Info */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-primary">
                    Cylinder Type
                  </label>
                  <select className="form-select border-primary shadow-sm">
                    <option value="Domestic">Domestic</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-primary">
                    Cylinder Size
                  </label>
                  <select className="form-select border-primary shadow-sm">
                    <option>6 Kg</option>
                    <option>15 Kg</option>
                    <option>45 Kg</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-primary">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-control border-primary shadow-sm"
                    defaultValue={1}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-primary">
                    Preferred Delivery Time Slot
                  </label>
                  <select className="form-select border-primary shadow-sm">
                    <option>Morning (8 AM - 12 PM)</option>
                    <option>Afternoon (12 PM - 4 PM)</option>
                    <option>Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              {/* Delivery Info */}
              <hr className="border-primary opacity-50" />
              <h5 className="text-center text-secondary mb-3">
                Delivery Address
              </h5>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">
                  Street Address
                </label>
                <input
                  type="text"
                  className="form-control border-primary shadow-sm"
                  placeholder="House #, Street Name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">
                  Nearest Landmark (Optional)
                </label>
                <input
                  type="text"
                  className="form-control border-primary shadow-sm"
                  placeholder="Near mosque, school, etc."
                />
              </div>

              {/* Payment */}
              <hr className="border-primary opacity-50" />
              <h5 className="text-center text-secondary mb-3">
                Payment Information
              </h5>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">
                  Payment Method
                </label>
                <select className="form-select border-primary shadow-sm">
                  <option>Cash on Delivery</option>
                  <option>Online Payment</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-primary">
                  Additional Notes (Optional)
                </label>
                <textarea
                  className="form-control border-primary shadow-sm"
                  rows="3"
                  placeholder="Any special delivery instructions..."
                ></textarea>
              </div>

              {/* Button */}
              <div className="d-grid mt-4">
                <button
                  type="button"
                  className="btn text-dark fw-semibold py-2 rounded-3 shadow-sm"
                  style={{
                    background: "linear-gradient(90deg, #ffd200, #ffef8f)",
                    border: "1px solid #ffcd00",
                  }}
                >
                  🚚 Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookGasPage;
