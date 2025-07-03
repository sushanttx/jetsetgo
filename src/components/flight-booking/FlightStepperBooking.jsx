import React, { useState, useEffect } from "react";
import FlightCustomerInfo from "./FlightCustomerInfo";
import FlightPaymentInfo from "./FlightPaymentInfo";
import FlightOrderSubmittedInfo from "./FlightOrderSubmittedInfo";
import FlightBookingConfirmation from "./FlightBookingConfirmation";

const FlightStepperBooking = ({ flight, formData, segment }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    state: "",
    zip: "",
    specialRequests: ""
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("flightPersonalDetails");
    if (saved) {
      setPersonalDetails(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("flightPersonalDetails", JSON.stringify(personalDetails));
  }, [personalDetails]);

  const steps = [
    {
      title: "Personal Details",
      stepNo: "1",
      stepBar: (
        <>
          <div className="col d-none d-sm-block">
            <div className="w-full h-1 bg-border"></div>
          </div>
        </>
      ),
      content: <FlightCustomerInfo flight={flight} formData={formData} segment={segment} personalDetails={personalDetails} setPersonalDetails={setPersonalDetails} />,
    },
    {
      title: "Confirmation",
      stepNo: "2",
      stepBar: (
        <>
          <div className="col d-none d-sm-block">
            <div className="w-full h-1 bg-border"></div>
          </div>
        </>
      ),
      content: <FlightBookingConfirmation flight={flight} formData={formData} segment={segment} personalDetails={personalDetails} />,
    },
    {
      title: "Payment Details",
      stepNo: "3",
      stepBar: (
        <>
          <div className="col d-none d-sm-block">
            <div className="w-full h-1 bg-border"></div>
          </div>
        </>
      ),
      content: <FlightPaymentInfo personalDetails={personalDetails} />,
    },
    {
      title: "Final Step",
      stepNo: "4",
      stepBar: "",
      content: <FlightOrderSubmittedInfo />,
    },
  ];

  const renderStep = () => {
    const { content } = steps[currentStep];
    return <>{content}</>;
  };

  const isPersonalDetailsFilled = () => {
    return (
      personalDetails.fullName &&
      personalDetails.email &&
      personalDetails.phone &&
      personalDetails.address1 &&
      personalDetails.state &&
      personalDetails.zip
    );
  };

  const nextStep = () => {
    if (currentStep === 0 && !isPersonalDetailsFilled()) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="row x-gap-40 y-gap-30 items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="col-auto">
              <div
                className="d-flex items-center cursor-pointer transition"
                onClick={() => setCurrentStep(index)}
              >
                <div
                  className={
                    currentStep === index
                      ? "active size-40 rounded-full flex-center bg-blue-1"
                      : "size-40 rounded-full flex-center bg-blue-1-05 text-blue-1 fw-500"
                  }
                >
                  {currentStep === index ? (
                    <>
                      <i className="icon-check text-16 text-white"></i>
                    </>
                  ) : (
                    <>
                      <span>{step.stepNo}</span>
                    </>
                  )}
                </div>

                <div className="text-18 fw-500 ml-10"> {step.title}</div>
              </div>
            </div>
            {/* End .col */}

            {step.stepBar}
          </React.Fragment>
        ))}
      </div>
      {/* End stepper header part */}

      <div className="row">{renderStep()}</div>
      {/* End main content */}

      <div className="row x-gap-20 y-gap-20 pt-20">
        <div className="col-auto">
          <button
            className="button h-60 px-24 -blue-1 bg-light-2"
            disabled={currentStep === 0}
            onClick={previousStep}
          >
            Previous
          </button>
        </div>
        {/* End prvious btn */}

        <div className="col-auto">
          <button
            className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
            disabled={currentStep === steps.length - 1 || (currentStep === 0 && !isPersonalDetailsFilled())}
            onClick={nextStep}
          >
            Next <div className="icon-arrow-top-right ml-15" />
          </button>
        </div>
        {/* End next btn */}
      </div>
      {/* End stepper button */}
    </>
  );
};

export default FlightStepperBooking; 