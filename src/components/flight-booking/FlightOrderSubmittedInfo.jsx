const FlightOrderSubmittedInfo = ({ bookingResult, onPreviousStep, currentStep, totalSteps, flight, searchData }) => {
  // Extract data from backend response - handle nested structure
  const bookingData = bookingResult?.data || bookingResult;
  const responseData = bookingData?.data || bookingData; // Handle nested data structure
  
  // Debug: Let's see exactly what we're getting
  console.log('🚨 DEBUGGING - bookingResult keys:', Object.keys(bookingResult || {}));
  console.log('🚨 DEBUGGING - bookingData keys:', Object.keys(bookingData || {}));
  console.log('🚨 DEBUGGING - responseData keys:', Object.keys(responseData || {}));
  
  // Try to get the actual values from different possible locations
  const getContactEmail = () => {
    return bookingResult?.contactEmail || 
           responseData?.contactEmail || 
           bookingData?.contactEmail || 
           responseData?.contactInfo?.Email ||
           bookingData?.contactInfo?.Email ||
           'N/A';
  };
  
  const getContactPhone = () => {
    return bookingResult?.contactPhone || 
           responseData?.contactPhone || 
           bookingData?.contactPhone || 
           responseData?.contactInfo?.PhoneNumber ||
           bookingData?.contactInfo?.PhoneNumber ||
           'N/A';
  };
  
  const getPassengersCount = () => {
    return bookingResult?.passengersCount || 
           responseData?.passengersCount || 
           bookingData?.passengersCount ||
           'N/A';
  };
  
  const getAirline = () => {
    return bookingResult?.airline || 
           responseData?.airline || 
           bookingData?.airline ||
           'N/A';
  };
  
  const getPaymentType = () => {
    return bookingResult?.paymentType || 
           responseData?.paymentType || 
           bookingData?.paymentType ||
           'N/A';
  };
  
  // Flight timing information helpers
  const getDepartureTime = () => {
    return flight?.departureTime || 
           flight?.departure?.time || 
           flight?.segments?.[0]?.departureTime ||
           'N/A';
  };
  
  const getArrivalTime = () => {
    return flight?.arrivalTime || 
           flight?.arrival?.time || 
           flight?.segments?.[flight?.segments?.length - 1]?.arrivalTime ||
           'N/A';
  };
  
  const getDuration = () => {
    return flight?.duration || 
           flight?.totalDuration ||
           'N/A';
  };
  
  const getDepartureDate = () => {
    return flight?.departureDate || 
           flight?.departure?.date || 
           flight?.segments?.[0]?.departureDate ||
           searchData?.departureDate ||
           'N/A';
  };
  
  // Debug logging to see what data we're receiving
  console.log('🎫 FlightOrderSubmittedInfo received bookingResult:', bookingResult);
  console.log('📋 Extracted bookingData:', bookingData);
  console.log('📋 Response data:', responseData);
  console.log('✈️ Flight data:', flight);
  console.log('🔍 Search data:', searchData);
  console.log('🔍 Full bookingResult structure:', JSON.stringify(bookingResult, null, 2));
  
  // Direct field checks
  console.log('🚨 DIRECT CHECKS:');
  console.log('  - bookingResult.contactEmail:', bookingResult?.contactEmail);
  console.log('  - bookingResult.contactPhone:', bookingResult?.contactPhone);
  console.log('  - bookingResult.passengersCount:', bookingResult?.passengersCount);
  console.log('  - bookingResult.paymentType:', bookingResult?.paymentType);
  console.log('  - bookingResult.airline:', bookingResult?.airline);
  console.log('  - bookingResult.debugInfo:', bookingResult?.debugInfo);
  
  console.log('🔍 Key fields check:', {
    PNR: responseData?.PNR || bookingData?.PNR,
    bookingId: bookingResult?.bookingId || responseData?.bookingId,
    contactEmail: bookingResult?.contactEmail || responseData?.contactEmail || bookingData?.contactEmail,
    contactPhone: bookingResult?.contactPhone || responseData?.contactInfo?.PhoneNumber,
    bookingStatus: responseData?.bookingStatus || bookingData?.bookingStatus,
    passengersCount: bookingResult?.passengersCount || responseData?.passengersCount || bookingData?.passengersCount,
    airline: bookingResult?.airline || responseData?.airline || bookingData?.airline,
    paymentType: bookingResult?.paymentType || responseData?.paymentType || bookingData?.paymentType,
    tripId: responseData?.tripId,
    productId: responseData?.productId,
    origin: responseData?.origin,
    destination: responseData?.destination
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString();
    return new Date(dateString).toLocaleDateString();
  };

  const formatPaymentMethod = (paymentType) => {
    switch (paymentType) {
      case 'HOLD': return 'Hold Payment';
      case 'CC': return 'Credit Card';
      // case 'CK': return 'Check';
      default: return 'Unknown';
    }
  };

  return (
    <>
      <div className="col-xl-8 col-lg-8">
        <div className="order-completed-wrapper">
          <div className="d-flex flex-column items-center mt-40 lg:md-40 sm:mt-24">
            <div className="size-80 flex-center rounded-full bg-green-1">
              <i className="icon-check text-30 text-white" />
            </div>
            <div className="text-30 lh-1 fw-600 mt-20">
              {bookingResult?.testMode 
                ? 'Test Validation Successful!' 
                : 'Booking Submitted Successfully!'
              }
            </div>
            <div className="text-15 text-light-1 mt-10">
              {bookingResult?.testMode 
                ? 'This was a test validation - no actual booking was placed. All data was validated successfully.'
                : `Your booking has been confirmed! Details have been sent to: ${responseData?.contactEmail || bookingData?.contactEmail || bookingData?.contactInfo?.Email || 'your email'}`
              }
            </div>
            {bookingResult?.testMode && (
              <div className="mt-20 p-20 bg-blue-1 text-white rounded-8">
                <i className="icon-info text-20 mr-10"></i>
                <strong>TEST MODE:</strong> This is a validation test only. No real booking was created.
              </div>
            )}
            {(responseData?.PNR || bookingData?.PNR) && (
              <div className="text-16 fw-500 text-blue-1 mt-10">
                {bookingResult?.testMode ? 'Test PNR:' : 'PNR:'} {responseData?.PNR || bookingData?.PNR}
              </div>
            )}
          </div>
          {/* End header */}

          <div className="border-type-1 rounded-8 px-50 py-35 mt-40">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">Order Number</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {bookingResult?.bookingId || responseData?.bookingId || bookingData?.bookingId || responseData?.ReferenceNumber || bookingData?.referenceNumber || 'N/A'}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">Date</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {formatDate(bookingData?.createdAt)}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">Total</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  ${bookingResult?.totalAmount || bookingData?.totalAmount || bookingData?.price || bookingData?.totalPrice || bookingData?.grandTotal || '0.00'}
                </div>
              </div>
              {/* End .col */}
              <div className="col-lg-3 col-md-6">
                <div className="text-15 lh-12">Payment Method</div>
                <div className="text-15 lh-12 fw-500 text-blue-1 mt-10">
                  {formatPaymentMethod(getPaymentType())}
                </div>
              </div>
              {/* End .col */}
            </div>
          </div>
          {/* order price info */}

          <div className="border-light rounded-8 px-50 py-40 mt-40">
            <h4 className="text-20 fw-500 mb-30">Booking Information</h4>
            <div className="row y-gap-10">
              <div className="col-12">
                <div className="d-flex justify-between ">
                  <div className="text-15 lh-16">PNR Number</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {responseData?.PNR || bookingData?.PNR || 'N/A'}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Booking Status</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {responseData?.bookingStatus || bookingData?.bookingStatus || 'Confirmed'}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Email</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {getContactEmail()}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Phone</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {getContactPhone()}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Flight Route</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {(responseData?.origin || bookingData?.origin) && (responseData?.destination || bookingData?.destination)
                      ? `${responseData?.origin || bookingData?.origin} → ${responseData?.destination || bookingData?.destination}` 
                      : 'N/A'}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Departure Time</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {getDepartureTime()}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Arrival Time</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {getArrivalTime()}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Duration</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {getDuration()}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Departure Date</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {formatDate(getDepartureDate())}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Airline</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {getAirline()}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Passengers</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {getPassengersCount()}
                  </div>
                </div>
              </div>
              {/* End .col */}
              <div className="col-12">
                <div className="d-flex justify-between border-top-light pt-10">
                  <div className="text-15 lh-16">Booking Reference</div>
                  <div className="text-15 lh-16 fw-500 text-blue-1">
                    {responseData?.ReferenceNumber || bookingData?.referenceNumber || 'N/A'}
                  </div>
                </div>
              </div>
              {/* End .col */}
              {(responseData?.tripId || bookingData?.tripId) && (
                <div className="col-12">
                  <div className="d-flex justify-between border-top-light pt-10">
                    <div className="text-15 lh-16">Trip ID</div>
                    <div className="text-15 lh-16 fw-500 text-blue-1">
                      {responseData?.tripId || bookingData?.tripId}
                    </div>
                  </div>
                </div>
              )}
              {/* End .col */}
              {bookingData?.productId && (
                <div className="col-12">
                  <div className="d-flex justify-between border-top-light pt-10">
                    <div className="text-15 lh-16">Product ID</div>
                    <div className="text-15 lh-16 fw-500 text-blue-1">
                      {bookingData.productId}
                    </div>
                  </div>
                </div>
              )}
              {/* End .col */}
              {bookingData?.specialRequests && (
                <div className="col-12">
                  <div className="d-flex justify-between border-top-light pt-10">
                    <div className="text-15 lh-16">Special Requirements</div>
                    <div className="text-15 lh-16 fw-500 text-blue-1">
                      {bookingData.specialRequests}
                    </div>
                  </div>
                </div>
              )}
              {/* End .col */}
            </div>
            {/* End .row */}
          </div>
          {/* End order information */}
        </div>

        {/* Navigation Buttons - Final Step Only Shows Done Button */}
        <div className="row x-gap-20 y-gap-20 pt-20">
          <div className="col-auto">
            <button
              className="button h-60 px-24 -blue-1 bg-blue-1 text-white"
              onClick={() => window.location.href = '/'}
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightOrderSubmittedInfo; 