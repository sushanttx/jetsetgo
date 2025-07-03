import React from "react";
import FlightBookingDetails from "./FlightBookingDetails";
import "../../../public/sass/components/FlightBookingConfirmation.scss";

const FlightBookingConfirmation = ({ flight, formData, segment, personalDetails }) => {
  return (
    <div className="container py-40">
      <div className="sectionTitle -md mb-32 text-center">
        <div className="sectionTitle__title text-30 fw-700 text-blue-1 mb-10">Review & Confirm Your Booking</div>
        <div className="sectionTitle__text text-18 text-light-1">Please check all details below before proceeding to payment.</div>
      </div>
      <div className="row x-gap-40 y-gap-40 justify-center flex-wrap-lg confirmation-cards-row">
        {/* Personal Details Card */}
        <div className="col-lg-4 col-md-6 mb-4 confirmation-card">
          <div className="bg-white rounded-4 shadow px-30 py-30 border-light confirmation-card-inner h-100 transition-all hover-shadow">
            <div className="text-20 fw-600 mb-20 text-blue-1 d-flex align-items-center">
              <i className="icon-user mr-10" /> Personal Details
            </div>
            <div className="row y-gap-10">
              <div className="col-12 text-16"><b>Full Name:</b> {personalDetails.fullName}</div>
              <div className="col-12 text-16"><b>Email:</b> {personalDetails.email}</div>
              <div className="col-12 text-16"><b>Phone:</b> {personalDetails.phone}</div>
              <div className="col-12 text-16"><b>Address 1:</b> {personalDetails.address1}</div>
              <div className="col-12 text-16"><b>Address 2:</b> {personalDetails.address2}</div>
              <div className="col-6 text-16"><b>State:</b> {personalDetails.state}</div>
              <div className="col-6 text-16"><b>ZIP:</b> {personalDetails.zip}</div>
              <div className="col-12 text-16"><b>Special Requests:</b> {personalDetails.specialRequests}</div>
            </div>
          </div>
        </div>
        {/* Booking Details Card (Flight & Segment only) */}
        <div className="col-lg-4 col-md-6 mb-4 confirmation-card">
          <div className="bg-white rounded-4 shadow px-30 py-30 border-light confirmation-card-inner h-100 transition-all hover-shadow">
            <div className="text-20 fw-600 mb-20 text-blue-1 d-flex align-items-center">
              <i className="icon-plane mr-10" /> Booking Details
            </div>
            {/* Only show flight and segment info, not user details */}
            {flight && segment ? (
              <div>
                <div className="fw-500 mb-5">Flight Information</div>
                <div className="d-flex align-items-center mb-15">
                  <img src={segment.avatar} alt="flight icon" style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12, boxShadow: '0 2px 8px rgba(13,71,161,0.10)' }} />
                  <div>
                    <div className="text-16 fw-600 mb-2">Segment</div>
                    <div className="text-15 mb-1"><b>From:</b> {segment.arrivalAirport} <span className="ml-5">({segment.departureTime})</span></div>
                    <div className="text-15 mb-1"><b>To:</b> {segment.departureAirport} <span className="ml-5">({segment.arrivalTime})</span></div>
                    <div className="text-15 mb-1"><b>Duration:</b> {segment.duration}</div>
                  </div>
                </div>
                <div className="row y-gap-8 mb-2">
                  <div className="col-6 text-15"><b>Flight ID:</b> {flight.id}</div>
                  <div className="col-6 text-15"><b>Price:</b> ${flight.price}</div>
                  <div className="col-6 text-15"><b>Deals:</b> {flight.deals}</div>
                </div>
              </div>
            ) : (
              <div className="text-15 text-light-1">Flight, segment, or form data not found.</div>
            )}
          </div>
        </div>
        {/* Trip Information Card (Trip type, dates, and Your Details) */}
        <div className="col-lg-4 col-md-12 mb-4 confirmation-card">
          <div className="bg-white rounded-4 shadow px-30 py-30 border-light confirmation-card-inner h-100 transition-all hover-shadow">
            <div className="text-20 fw-600 mb-20 text-blue-1 d-flex align-items-center">
              <i className="icon-calendar mr-10" /> Your Details
            </div>
            <div className="row y-gap-8">
              {/* One Way Form Fields */}
              {formData.date !== undefined && (
                <>
                  <div className="col-12 text-16"><b>Trip Type:</b> One Way</div>
                  <div className="col-6 text-15"><b>From:</b> {formData.from}</div>
                  <div className="col-6 text-15"><b>To:</b> {formData.to}</div>
                  <div className="col-6 text-15"><b>Date:</b> {formData.date}</div>
                  <div className="col-6 text-15"><b>Time:</b> {formData.time}</div>
                  <div className="col-6 text-15"><b>Adults:</b> {formData.adult}</div>
                  <div className="col-6 text-15"><b>Children:</b> {formData.child}</div>
                  <div className="col-6 text-15"><b>Lap Infant:</b> {formData.lapInfant}</div>
                  <div className="col-6 text-15"><b>Seat Infant:</b> {formData.seatInfant}</div>
                  <div className="col-6 text-15"><b>Cabin Class:</b> {formData.cabinClass}</div>
                  <div className="col-6 text-15"><b>Preferred Airline 1:</b> {formData.airline1}</div>
                  <div className="col-6 text-15"><b>Preferred Airline 2:</b> {formData.airline2}</div>
                  <div className="col-6 text-15"><b>Flexible Dates:</b> {formData.flexibleDates ? "Yes" : "No"}</div>
                  <div className="col-6 text-15"><b>No Penalties:</b> {formData.noPenalties ? "Yes" : "No"}</div>
                  <div className="col-6 text-15"><b>Direct Flights:</b> {formData.directFlights ? "Yes" : "No"}</div>
                  <div className="col-6 text-15"><b>Nearby Airports:</b> {formData.nearbyAirports ? "Yes" : "No"}</div>
                </>
              )}
              {/* Round Trip Form Fields */}
              {formData.departureDate !== undefined && (
                <>
                  <div className="col-12 text-16"><b>Trip Type:</b> Round Trip</div>
                  <div className="col-6 text-15"><b>From:</b> {formData.from}</div>
                  <div className="col-6 text-15"><b>To:</b> {formData.to}</div>
                  <div className="col-6 text-15"><b>Departure Date:</b> {formData.departureDate}</div>
                  <div className="col-6 text-15"><b>Departure Time:</b> {formData.departureTime}</div>
                  <div className="col-6 text-15"><b>Return Date:</b> {formData.returnDate}</div>
                  <div className="col-6 text-15"><b>Return Time:</b> {formData.returnTime}</div>
                  <div className="col-6 text-15"><b>Adults:</b> {formData.adult}</div>
                  <div className="col-6 text-15"><b>Children:</b> {formData.child}</div>
                  <div className="col-6 text-15"><b>Lap Infant:</b> {formData.lapInfant}</div>
                  <div className="col-6 text-15"><b>Seat Infant:</b> {formData.seatInfant}</div>
                  <div className="col-6 text-15"><b>Cabin Class:</b> {formData.cabinClass}</div>
                  <div className="col-6 text-15"><b>Preferred Airline 1:</b> {formData.airline1}</div>
                  <div className="col-6 text-15"><b>Preferred Airline 2:</b> {formData.airline2}</div>
                  <div className="col-6 text-15"><b>Flexible Dates:</b> {formData.flexibleDates ? "Yes" : "No"}</div>
                  <div className="col-6 text-15"><b>No Penalties:</b> {formData.noPenalties ? "Yes" : "No"}</div>
                  <div className="col-6 text-15"><b>Direct Flights:</b> {formData.directFlights ? "Yes" : "No"}</div>
                  <div className="col-6 text-15"><b>Nearby Airports:</b> {formData.nearbyAirports ? "Yes" : "No"}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-40">
        <div className="text-18 text-light-1">If all details are correct, click <span className="fw-600 text-blue-1">Next</span> to proceed to payment.</div>
      </div>
    </div>
  );
};

export default FlightBookingConfirmation; 