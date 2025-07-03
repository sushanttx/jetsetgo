const FlightBookingDetails = ({ flight, formData, segment }) => {
  if (!flight || !formData || !segment) {
    return (
      <div className="px-30 py-30 border-light rounded-4">
        <div className="text-20 fw-500 mb-30">Your booking details</div>
        <div className="text-15 text-light-1">Flight, segment, or form data not found.</div>
      </div>
    );
  }

  return (
    <div className="px-30 py-30 border-light rounded-4">
      <div className="text-20 fw-500 mb-30">Your booking details</div>
      <div className="mb-20">
        <div className="fw-500 mb-5">Flight Information</div>
        <div className="d-flex align-items-center mb-15">
          <img src={segment.avatar} alt="flight icon" style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }} />
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
      <div className="border-top-light mt-20 mb-20" />
      <div className="mb-20">
        <div className="fw-500 mb-5">Your Details</div>
        <div className="row y-gap-8">
          {/* One Way Form Fields */}
          {formData.date !== undefined && (
            <>
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
  );
};

export default FlightBookingDetails; 