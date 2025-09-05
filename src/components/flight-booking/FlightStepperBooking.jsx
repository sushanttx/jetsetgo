import React, { useState, useEffect } from "react";
import "../../../public/sass/components/FlightStepperBooking.scss";
import FlightCustomerInfo from "./FlightCustomerInfo";
import FlightPaymentInfo from "./FlightPaymentInfo";
import FlightOrderSubmittedInfo from "./FlightOrderSubmittedInfo";
import FlightBookingConfirmation from "./FlightBookingConfirmation";

const emptyPassenger = {
  fullName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  state: "",
  zip: "",
  specialRequests: "",
  gender: "",
  dateOfBirth: "",
  passportNumber: "",
  nationality: "",
  seatPreference: "",
  mobileNumber: "",
  alternateNumber: ""
};

const FlightStepperBooking = ({ flight, searchData, segment }) => {
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
  const [passengers, setPassengers] = useState([]);
  const [currentPassenger, setCurrentPassenger] = useState(emptyPassenger);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("flightPersonalDetails");
    if (saved) {
      setPersonalDetails(JSON.parse(saved));
    }
    const savedPassengers = localStorage.getItem("flightPassengers");
    if (savedPassengers) {
      setPassengers(JSON.parse(savedPassengers));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("flightPersonalDetails", JSON.stringify(personalDetails));
  }, [personalDetails]);
  useEffect(() => {
    localStorage.setItem("flightPassengers", JSON.stringify(passengers));
  }, [passengers]);


  const renderStep = () => {
    const { content } = steps[currentStep];
    return <>{content}</>;
  };

  // Calculate total passengers required
  const totalPassengersAllowed = 
    (parseInt(searchData?.adult) || 0) + 
    (parseInt(searchData?.child) || 0) + 
    (parseInt(searchData?.seatInfant) || 0);

  // Require all required fields for at least one passenger
  const isPassengerFilled = (p) =>
    p.fullName &&
    p.email &&
    p.nationality &&
    p.gender &&
    p.dateOfBirth &&
    p.mobileNumber &&
    p.address1 &&
    p.state &&
    p.zip &&
    p.seatPreference;

  // Check if all passengers are complete (all required passengers added with all required fields)
  const areAllPassengersComplete = () => {
    console.log('🔍 Validating passengers:', {
      passengersLength: passengers.length,
      totalPassengersAllowed,
      passengers: passengers
    });
    
    if (passengers.length !== totalPassengersAllowed) {
      console.log('❌ Not all passengers added yet');
      return false;
    }
    
    const allComplete = passengers.every((passenger, index) => {
      const requiredFields = ['fullName', 'email', 'gender', 'dateOfBirth', 'nationality', 'mobileNumber', 'address1', 'state', 'zip', 'seatPreference'];
      const passengerComplete = requiredFields.every(field => {
        const hasValue = passenger[field] && passenger[field].trim() !== '';
        if (!hasValue) {
          console.log(`❌ Passenger ${index + 1} missing field: ${field}`, passenger[field]);
        }
        return hasValue;
      });
      
      console.log(`✅ Passenger ${index + 1} complete:`, passengerComplete);
      return passengerComplete;
    });
    
    console.log('🎯 All passengers complete:', allComplete);
    return allComplete;
  };

  const isPassengersValid = () => areAllPassengersComplete();
  const isCurrentPassengerFilled = () => isPassengerFilled(currentPassenger);
  const isCurrentPassengerEmpty = () => Object.values(currentPassenger).every(v => v === "");

  const nextStep = () => {
    if (currentStep === 0) {
      // Only proceed if all passengers are complete
      if (!areAllPassengersComplete()) return;
    }
    if (currentStep < 3) { // 4 steps total (0, 1, 2, 3)
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: "Passenger Details",
      stepNo: "1",
      stepBar: (
        <>
          <div className="col d-none d-sm-block">
            <div className="w-full h-1 bg-border"></div>
          </div>
        </>
      ),
      content: <FlightCustomerInfo 
      flight={flight} 
      searchData={searchData}
      personalDetails={personalDetails}
      setPersonalDetails={setPersonalDetails}
      passengers={passengers}
      setPassengers={setPassengers}
      currentPassenger={currentPassenger}
      setCurrentPassenger={setCurrentPassenger}
      onNextStep={nextStep} />, // pass currentPassenger and nextStep handler
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
      content: <FlightBookingConfirmation flight={flight} searchData={searchData} personalDetails={personalDetails} passengers={passengers} onConfirmAndPay={() => setCurrentStep(currentStep + 1)} />, // pass handler
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

  return (
    <>
      <div className="flight-stepper-header">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div 
              className={`flight-stepper-step ${index > 0 && !areAllPassengersComplete() ? 'disabled' : ''}`} 
              onClick={() => {
                // Only allow navigation to step 0 or if all passengers are complete
                if (index === 0 || areAllPassengersComplete()) {
                  setCurrentStep(index);
                }
              }}
            >
              <div
                className={
                  currentStep === index
                    ? "active size-40 rounded-full flex-center bg-blue-1"
                    : index > 0 && !areAllPassengersComplete()
                    ? "size-40 rounded-full flex-center bg-light-2 text-light-1"
                    : "size-40 rounded-full flex-center bg-blue-1-05 text-blue-1 fw-500"
                }
              >
                {currentStep === index ? (
                  <i className="icon-check text-16 text-white"></i>
                ) : (
                  <span>{step.stepNo}</span>
                )}
              </div>
              <div className={`text-18 fw-500 ml-10 ${index > 0 && !areAllPassengersComplete() ? 'text-light-1' : ''}`}>
                {step.title}
              </div>
            </div>
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
            disabled={
              currentStep === 3 || // 4 steps total (0, 1, 2, 3)
              (currentStep === 0 && !areAllPassengersComplete())
            }
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