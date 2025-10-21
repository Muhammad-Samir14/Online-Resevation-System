import { useState, useRef } from "react";

function HowItWorks() {
  // Highlight clicked step
  const [activeStep, setActiveStep] = useState(null);
  const sectionRef = useRef(null);

  // Steps with icons + custom colors
  const steps = [
    {
      id: 1,
      icon: "bi bi-person-check-fill",
      title: "Sign Up",
      description:
        "Create your account using your phone or email to get started easily.",
      bgColor: "linear-gradient(135deg, #d4f1ffff, #b3e7ffff)", // blue shades
      iconColor: "text-primary",
    },
    {
      id: 2,
      icon: "bi bi-clipboard-check-fill",
      title: "Book Your Cylinder",
      description:
        "Select your preferred cylinder size and confirm your booking in seconds.",
      bgColor: "linear-gradient(135deg, #fff6cc, #ffeb99)", // yellow shades
      iconColor: "text-warning",
    },
    {
      id: 3,
      icon: "bi bi-truck-front-fill",
      title: "Fast Delivery",
      description:
        "Sit back and relax — your LPG cylinder will reach your doorstep safely.",
      bgColor: "linear-gradient(135deg, #e0ffe0, #b3ffb3)", // green shades
      iconColor: "text-success",
    },
  ];

  const handleStepClick = (id) => {
    setActiveStep(id);
  };

  return (
      <section className="py-5 bg-info">
      <div className="container">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">How It Works</h2>
          <p className="text-dark">
            Just three easy steps to get your LPG cylinder delivered fast!
          </p>
        </div>

        {/* Steps */}
        <div className="row g-4">
          {steps.map((step) => (
            <div key={step.id} className="col-md-4">
              <div
                className={`p-4 rounded-4 shadow-lg text-center transition h-100 ${
                  activeStep === step.id ? "border border-primary" : ""
                }`}
                style={{
                  cursor: "pointer",
                  background: step.bgColor,
                  transform: activeStep === step.id ? "scale(1.05)" : "scale(1)",
                  transition: "0.3s ease-in-out",
                }}
                onClick={() => handleStepClick(step.id)}
              >
                <i className={`${step.icon} ${step.iconColor} fs-1 mb-3`}></i>
                <h5 className="fw-bold">{step.title}</h5>
                <p className="text-dark">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

