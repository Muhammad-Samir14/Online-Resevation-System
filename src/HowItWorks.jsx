function HowItWorks() {
  return (
    <section className="py-5 bg-primary">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">How It Works</h2>
          <p className="text-muted">
            Follow these simple steps to reserve your LPG cylinder in minutes
          </p>
        </div>

        <div className="row g-4">
          {/* Step 1 */}
          <div className="col-md-4 text-center">
            <div className="p-4 h-100 bg-white rounded shadow-sm border-0 hover-shadow">
              <div className="mb-3">
                <i className="bi bi-person-circle fs-1 text-primary"></i>
              </div>
              <h5 className="fw-semibold mb-2">Step 1: Sign Up</h5>
              <p className="text-muted">
                Create your account using your mobile number or customer ID to get started.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="col-md-4 text-center">
            <div className="p-4 h-100 bg-white rounded shadow-sm border-0 hover-shadow">
              <div className="mb-3">
                <i className="bi bi-clipboard-check fs-1 text-success"></i>
              </div>
              <h5 className="fw-semibold mb-2">Step 2: Book Your Cylinder</h5>
              <p className="text-muted">
                Select your cylinder size, confirm your booking, and receive instant updates.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="col-md-4 text-center">
            <div className="p-4 h-100 bg-white rounded shadow-sm border-0 hover-shadow">
              <div className="mb-3">
                <i className="bi bi-truck fs-1 text-danger"></i>
              </div>
              <h5 className="fw-semibold mb-2">Step 3: Fast Delivery</h5>
              <p className="text-muted">
                Sit back and relax — your cylinder will be delivered to your doorstep safely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;