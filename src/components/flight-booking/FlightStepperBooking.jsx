import React, { useState, useEffect } from "react";
import "../../../public/sass/components/FlightStepperBooking.scss";
import FlightCustomerInfo from "./FlightCustomerInfo";
import FlightPaymentInfo from "./FlightPaymentInfo";
import FlightOrderSubmittedInfo from "./FlightOrderSubmittedInfo";
import FlightBookingConfirmation from "./FlightBookingConfirmation";
import { validateBookingPayload, submitBooking, buildBookingPayload } from "../../services/bookingService";

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
  const [paymentDetails, setPaymentDetails] = useState({
    paymentType: 'HOLD', // HOLD, CC, CK
    // Credit Card fields
    cardType: '',
    cardNumber: '',
    cvv: '',
    expiryDate: '',
    bankPhoneNum: '',
    billingPhoneNum: '',
    // Billing Address fields (for CC and CK)
    billingName: '',
    billingAddress1: '',
    billingAddress2: '',
    billingZipCode: '',
    billingCity: '',
    billingCountry: '',
    billingState: ''
  });
  const [bookingStatus, setBookingStatus] = useState({
    isLoading: false,
    isValidating: false,
    error: null,
    success: false,
    bookingResult: null
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  // Handle test validation (VALIDATION ONLY)
  const handleTestValidation = async () => {
    try {
      setBookingStatus(prev => ({ ...prev, isValidating: true, error: null }));
      
      // Build the booking payload
      const payload = buildBookingPayload(flight, searchData, passengers, personalDetails, paymentDetails);
      
      console.log('🔍 Testing validation with payload:', payload);
      
      // Submit validation request to backend
      const validationResult = await validateBookingPayload(payload);
      console.log('✅ Validation result:', validationResult);
      
      setBookingStatus(prev => ({ 
        ...prev, 
        isValidating: false, 
        bookingResult: {
          ...validationResult,
          testMode: true,
          message: 'Validation successful! Your booking data is valid.'
        }
      }));
      
    } catch (error) {
      console.error('❌ Validation error:', error);
      setBookingStatus(prev => ({ 
        ...prev, 
        isValidating: false, 
        error: error.message || 'Validation failed'
      }));
    }
  };

  // Handle booking submission (ACTUAL BOOKING)
  const handleBookingSubmission = async () => {
    try {
      setBookingStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Build the booking payload
      const payload = buildBookingPayload(flight, searchData, passengers, personalDetails, paymentDetails);
      
      console.log('📋 Submitting actual booking with payload:', payload);
      
      // Submit actual booking to backend
      const bookingResult = await submitBooking(payload);
      console.log('✅ Booking result:', bookingResult);
      console.log('📊 Booking result structure:', {
        success: bookingResult.success,
        hasData: !!bookingResult.data,
        directFields: Object.keys(bookingResult).filter(key => key !== 'success' && key !== 'data'),
        PNR: bookingResult.PNR,
        bookingId: bookingResult.bookingId,
        contactEmail: bookingResult.contactEmail
      });
      
      // Process the booking result from backend
      if (bookingResult.success) {
        // The backend sends data directly in the response, not nested under 'booking'
        const bookingData = bookingResult;
        
        setBookingStatus(prev => ({ 
          ...prev, 
          isLoading: false, 
          success: true, 
          bookingResult: {
            testMode: false,
            message: 'Your booking has been successfully submitted!',
            // Pass the raw booking data so FlightOrderSubmittedInfo can access all fields
            data: bookingData,
            // Also keep individual fields for backward compatibility
            pnr: bookingData.PNR || bookingData.pnr,
            orderNumber: bookingData.bookingId || bookingData.ReferenceNumber || bookingData.referenceNumber || bookingData.id,
            bookingDate: bookingData.createdAt || new Date().toISOString(),
            // Add missing fields from original booking data
            contactEmail: passengers[0]?.email || personalDetails?.email,
            contactPhone: passengers[0]?.mobileNumber || passengers[0]?.phone || personalDetails?.phone,
            passengersCount: passengers.length,
            airline: flight?.airline || flight?.carrierName,
            paymentType: paymentDetails?.paymentType,
            
            // Debug logging
            debugInfo: {
              passengersLength: passengers.length,
              firstPassengerEmail: passengers[0]?.email,
              firstPassengerPhone: passengers[0]?.mobileNumber,
              personalDetailsEmail: personalDetails?.email,
              personalDetailsPhone: personalDetails?.phone,
              paymentType: paymentDetails?.paymentType,
              airline: flight?.airline,
              carrierName: flight?.carrierName
            },
            totalAmount: (() => {
              // Calculate proper total based on passenger count and fares
              if (!flight || !flight.rawFares || !searchData) return '0.00';
              
              const adults = parseInt(searchData.adult) || 0;
              const children = parseInt(searchData.child) || 0;
              const infants = parseInt(searchData.lapInfant) || 0;
              
              const adultFare = flight.rawFares.find(f => f.PaxType === 'ADT');
              const childFare = flight.rawFares.find(f => f.PaxType === 'CHD');
              const infantFare = flight.rawFares.find(f => f.PaxType === 'INF');
              
              const adultBaseFare = adultFare?.BaseFare || 0;
              const adultTaxes = adultFare?.Taxes || 0;
              const adultTotal = adultBaseFare + adultTaxes;
              
              const childBaseFare = childFare?.BaseFare || adultBaseFare;
              const childTaxes = childFare?.Taxes || adultTaxes;
              const childTotal = childBaseFare + childTaxes;
              
              const infantBaseFare = infantFare?.BaseFare || 0;
              const infantTaxes = infantFare?.Taxes || 0;
              const infantTotal = infantBaseFare + infantTaxes;
              
              const totalBaseFare = (adults * adultBaseFare) + (children * childBaseFare) + (infants * infantBaseFare);
              const totalTaxes = (adults * adultTaxes) + (children * childTaxes) + (infants * infantTaxes);
              const grandTotal = totalBaseFare + totalTaxes;
              
              return grandTotal.toFixed(2);
            })(),
            paymentType: bookingData.paymentType || paymentDetails.paymentType,
            email: bookingData.contactEmail || personalDetails.email,
            phone: personalDetails.phone || personalDetails.mobileNumber,
            route: `${flight?.from} → ${flight?.to}`,
            airline: flight?.airline || 'Airline',
            passengerCount: bookingData.passengersCount || passengers.length,
            bookingReference: bookingData.ReferenceNumber || bookingData.referenceNumber,
            status: bookingData.bookingStatus || 'Confirmed',
            customerName: personalDetails.fullName || passengers[0]?.fullName,
            // Additional fields from backend response
            tripId: bookingData.tripId,
            productId: bookingData.productId,
            origin: bookingData.origin,
            destination: bookingData.destination
          }
        }));
        
        // Move to final step to show booking results
        setCurrentStep(3);
      } else {
        throw new Error(bookingResult.message || 'Booking failed');
      }
      
    } catch (error) {
      console.error('❌ Booking error:', error);
      setBookingStatus(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Booking failed. Please try again.' 
      }));
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
      onNextStep={nextStep}
      onPreviousStep={previousStep}
      currentStep={currentStep}
      totalSteps={3} />, // pass navigation handlers
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
      content: <FlightBookingConfirmation 
        flight={flight} 
        searchData={searchData} 
        personalDetails={personalDetails} 
        passengers={passengers} 
        onConfirmAndPay={nextStep}
        onPreviousStep={previousStep}
        currentStep={currentStep}
        totalSteps={3}
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted} />, // pass navigation handlers
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
      content: <FlightPaymentInfo 
        personalDetails={personalDetails} 
        paymentDetails={paymentDetails}
        setPaymentDetails={setPaymentDetails}
        bookingStatus={bookingStatus}
        onBookingSubmit={handleBookingSubmission}
        onTestValidation={handleTestValidation}
        flight={flight}
        searchData={searchData}
        onNextStep={nextStep}
        onPreviousStep={previousStep}
        currentStep={currentStep}
        totalSteps={3}
      />,
    },
    {
      title: "Final Step",
      stepNo: "4",
      stepBar: "",
      content: <FlightOrderSubmittedInfo 
        bookingResult={bookingStatus.bookingResult}
        onPreviousStep={previousStep}
        currentStep={currentStep}
        totalSteps={3}
        flight={flight}
        searchData={searchData}
      />,
    },
  ];

  return (
    <>
      <div className="flight-stepper-header">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div 
              className={`flight-stepper-step ${
                (currentStep === 3 && index < 3) || // Disable all previous tabs when on final step
                (index > 0 && !areAllPassengersComplete()) || 
                (index >= 2 && !termsAccepted) ||
                (index === 3 && !bookingStatus.success) ? 'disabled' : ''
              }`} 
              onClick={() => {
                // If we're on final step (3), disable all previous tabs
                if (currentStep === 3) {
                  return; // Disable all tab clicks when on final step
                }
                
                // Only allow navigation to step 0 or if all passengers are complete
                // For steps 2+ (Payment Details, Final Step), also require terms acceptance
                // For Final Step (index 3), also require successful booking submission
                if (index === 0 || 
                    (index === 1 && areAllPassengersComplete()) || 
                    (index === 2 && areAllPassengersComplete() && termsAccepted) ||
                    (index === 3 && areAllPassengersComplete() && termsAccepted && bookingStatus.success)) {
                  setCurrentStep(index);
                }
              }}
            >
              <div
                className={
                  currentStep === index
                    ? "active size-40 rounded-full flex-center bg-blue-1"
                    : (index > 0 && !areAllPassengersComplete()) || (index >= 2 && !termsAccepted) || (index === 3 && !bookingStatus.success)
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
              <div className={`text-18 fw-500 ml-10 ${
                (index > 0 && !areAllPassengersComplete()) || (index >= 2 && !termsAccepted) || (index === 3 && !bookingStatus.success) ? 'text-light-1' : ''
              }`}>
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

    </>
  );
};

export default FlightStepperBooking; 