import { useState, useEffect } from "react";
import { useBatchAirlineLogos } from "../../../../../services/batchLogoService";
import AirlineLogo from "../../../../common/AirlineLogo";
import { 
  formatBookingDate, 
  formatBookingStatus, 
  getStatusBadgeClass, 
  getPaymentTypeDisplayName, 
  getPassengerCount, 
  getPassengerSummary 
} from "../../../../../services/bookingHistoryService";

const BookingDetailsModal = ({ booking, onClose }) => {
  const [flightsArray, setFlightsArray] = useState([]);
  const { logoMap, loading: logoLoading, error: logoError } = useBatchAirlineLogos(flightsArray);

  useEffect(() => {
    if (booking && booking.flightDetails) {
      // Create flights array for logo service
      const flights = Array.isArray(booking.flightDetails) 
        ? booking.flightDetails 
        : [booking.flightDetails];
      setFlightsArray(flights);
    }
  }, [booking]);

  if (!booking) return null;

  const formatPassengerName = (passenger) => {
    const title = passenger.UserTitle || '';
    const firstName = passenger.FirstName || '';
    const lastName = passenger.LastName || '';
    return `${title} ${firstName} ${lastName}`.trim();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={{ 
          borderRadius: '16px', 
          border: 'none', 
          boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          maxHeight: '90vh',
          background: '#ffffff'
        }}>
          {/* Flight Ticket Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            padding: '20px 24px',
            position: 'relative'
          }}>
            <div className="d-flex justify-between items-center">
              <div className="d-flex items-center">
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px'
                }}>
                  <i className="icon icon-airplane text-white" style={{ fontSize: '18px' }} />
                </div>
                <div>
                  <h5 className="text-white mb-1" style={{ fontSize: '22px', fontWeight: '700', margin: '0' }}>Flight Ticket</h5>
                  <p className="text-white mb-0" style={{ fontSize: '14px', opacity: '0.9', margin: '0' }}>
                    {booking.origin} → {booking.destination}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={onClose}
                aria-label="Close"
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                <i className="icon icon-close text-white" style={{ fontSize: '14px' }} />
              </button>
            </div>
            {/* Ticket perforation effect */}
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '24px',
              right: '24px',
              height: '20px',
              background: 'repeating-linear-gradient(to right, transparent 0px, transparent 10px, #e5e7eb 10px, #e5e7eb 20px)'
            }}></div>
          </div>
          
          <div className="modal-body" style={{ padding: '24px', background: 'white', maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Booking Information Section */}
              <div>
                <h6 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="icon icon-ticket mr-8" style={{ fontSize: '16px', color: '#3b82f6' }}></i>
                  Booking Information
                </h6>
                <div style={{ 
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>PNR</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{booking.PNR || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Status</span>
                      <span className={`rounded-full py-1 px-3 text-center text-12 fw-600 ${getStatusBadgeClass(booking.bookingStatus)}`}>
                        {formatBookingStatus(booking.bookingStatus)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Booking ID</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{booking.id || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Date</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{formatBookingDate(booking.createdAt)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Type</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        {getPaymentTypeDisplayName(booking.paymentDetails?.PaymentType || booking.bookingType)}
                      </span>
                    </div>
                    {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Reference</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{booking.ReferenceNumber || 'N/A'}</span>
                    </div> */}
                    {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Itinerary</span>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>
                        {booking.itineraryId ? booking.itineraryId.substring(0, 8) + '...' : 'N/A'}
                      </span>
                    </div> */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Passengers</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{getPassengerCount(booking.passengerDetails)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Details - Ultra Compact */}
              <div className="col-12">
                <div style={{ 
                  background: 'white',
                  borderRadius: '6px',
                  padding: '8px',
                  border: '2px solid #3b82f6'
                }}>
                  <div className="row y-gap-2">
                    <div className="col-3">
                      <div className="d-flex items-center">
                        {booking.flightDetails && (
                          <AirlineLogo
                            className="w-20 h-20 mr-6"
                            alt="Airline"
                            fallbackImage="/img/flights/default.png"
                            validatingCarrierCode={Array.isArray(booking.flightDetails) ? booking.flightDetails[0]?.validatingCarrierCode : booking.flightDetails.validatingCarrierCode}
                            airlineLogoUrl={Array.isArray(booking.flightDetails) ? booking.flightDetails[0]?.airlineLogo : booking.flightDetails.airlineLogo}
                            logoMap={logoMap}
                            logoLoading={logoLoading}
                          />
                        )}
                        <div>
                          <div className="text-12 fw-700 text-dark-1">{booking.origin} → {booking.destination}</div>
                          <div className="text-8 text-light-1">Route</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="text-center">
                        <div className="text-8 text-light-1 fw-500 mr-10">Departure</div>
                        <div className="text-12 fw-700 text-dark-1">
                          {Array.isArray(booking.flightDetails) ? booking.flightDetails[0]?.departureTime : booking.flightDetails?.departureTime || 'N/A'}
                        </div>
                        <div className="text-8 text-light-1">
                          {Array.isArray(booking.flightDetails) ? booking.flightDetails[0]?.departureAirport : booking.flightDetails?.departureAirport || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="text-center">
                        <div className="text-8 text-light-1 fw-500 mr-10">Duration</div>
                        <div className="text-12 fw-700 text-dark-1">
                          {Array.isArray(booking.flightDetails) ? booking.flightDetails[0]?.duration : booking.flightDetails?.duration || 'N/A'}
                        </div>
                        <div className="text-8 text-light-1">
                          {Array.isArray(booking.flightDetails) ? booking.flightDetails[0]?.stops : booking.flightDetails?.stops || 'Direct'}
                        </div>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="text-center">
                        <div className="text-8 text-light-1 fw-500 mr-10">Arrival</div>
                        <div className="text-12 fw-700 text-dark-1">
                          {Array.isArray(booking.flightDetails) ? booking.flightDetails[0]?.arrivalTime : booking.flightDetails?.arrivalTime || 'N/A'}
                        </div>
                        <div className="text-8 text-light-1">
                          {Array.isArray(booking.flightDetails) ? booking.flightDetails[0]?.arrivalAirport : booking.flightDetails?.arrivalAirport || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ALL Passenger Details - Ultra Compact */}
              {booking.passengerDetails && booking.passengerDetails.length > 0 && (
                <div className="col-12">
                  <div style={{ 
                    background: '#f8fafc',
                    borderRadius: '6px',
                    padding: '8px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div className="row y-gap-2">
                      {booking.passengerDetails.map((passenger, index) => (
                        <div key={index} className="col-12">
                          <div className="row y-gap-1">
                            <div className="col-3">
                              <div className="d-flex items-center py-1">
                                <span className="text-10 text-light-1 fw-500 mr-10">Name</span>
                                <span className="text-12 fw-700 text-dark-1">{formatPassengerName(passenger)}</span>
                              </div>
                            </div>
                            <div className="col-2">
                              <div className="d-flex  items-center py-1">
                                <span className="text-10 text-light-1 fw-500 mr-10">Type</span>
                                <span className="text-12 fw-700 text-dark-1">{passenger.PaxType || 'N/A'}</span>
                              </div>
                            </div>
                            <div className="col-2">
                              <div className="d-flex  items-center py-1">
                                <span className="text-10 text-light-1 fw-500 mr-10">Gender</span>
                                <span className="text-12 fw-700 text-dark-1">{passenger.Gender || 'N/A'}</span>
                              </div>
                            </div>
                            <div className="col-3">
                              <div className="d-flex  items-center py-1">
                                <span className="text-10 text-light-1 fw-500 mr-10">DOB</span>
                                <span className="text-12 fw-700 text-dark-1">{formatDate(passenger.DateOfBirth)}</span>
                              </div>
                            </div>
                            <div className="col-2">
                              <div className="d-flex  items-center py-1">
                                <span className="text-10 text-light-1 fw-500 mr-10">Nationality</span>
                                <span className="text-12 fw-700 text-dark-1">{passenger.Nationality || 'N/A'}</span>
                              </div>
                            </div>
                            {passenger.PassportNumber && (
                              <div className="col-6">
                                <div className="d-flex  items-center py-1">
                                  <span className="text-10 text-light-1 fw-500 mr-10">Passport</span>
                                  <span className="text-12 fw-700 text-dark-1">{passenger.PassportNumber}</span>
                                </div>
                              </div>
                            )}
                            {passenger.CountryOfIssue && (
                              <div className="col-6">
                                <div className="d-flex  items-center py-1">
                                  <span className="text-10 text-light-1 fw-500 mr-10">Issued In</span>
                                  <span className="text-12 fw-700 text-dark-1">{passenger.CountryOfIssue}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact & Payment Info - Ultra Compact */}
              <div className="col-12">
                <div style={{ 
                  background: '#f8fafc',
                  borderRadius: '6px',
                  padding: '8px',
                  border: '2px solid #e2e8f0'
                }}>
                  <div className="row y-gap-2">
                    {/* Contact Info */}
                    {booking.contactInfo && (
                      <>
                        <div className="col-4">
                          <div className="d-flex  items-center py-1">
                            <span className="text-10 text-light-1 fw-500 mr-10">Email</span>
                            <span className="text-12 fw-600 text-dark-1">{booking.contactInfo.Email || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="d-flex  items-center py-1">
                            <span className="text-10 text-light-1 fw-500 mr-10">Phone</span>
                            <span className="text-12 fw-600 text-dark-1">{booking.contactInfo.PhoneNumber || 'N/A'}</span>
                          </div>
                        </div>
                        {booking.contactInfo.AlternatePhoneNumber && (
                          <div className="col-4">
                            <div className="d-flex  items-center py-1">
                              <span className="text-10 text-light-1 fw-500 mr-10">Alt Phone</span>
                              <span className="text-12 fw-600 text-dark-1">{booking.contactInfo.AlternatePhoneNumber}</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {/* Payment Info */}
                    {booking.paymentDetails && (
                      <div className="col-4">
                        <div className="d-flex  items-center py-1">
                          <span className="text-10 text-light-1 fw-500 mr-10">Payment Type</span>
                          <span className="text-12 fw-700">
                            {getPaymentTypeDisplayName(booking.paymentDetails.PaymentType)}
                          </span>
                        </div>
                      </div>
                    )}
                    {booking.totalAmount && (
                      <div className="col-4">
                        <div className="d-flex  items-center py-1">
                          <span className="text-10 text-light-1 fw-500 mr-10">Total Amount</span>
                          <span className="text-12 fw-700 text-green-1">${booking.totalAmount}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Ticket Footer */}
          <div style={{ 
            padding: '12px 16px',
            background: '#f8fafc',
            border: 'none',
            borderTop: '2px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div className="d-flex  items-center">
              <div className="text-10 text-light-1">
                Booking Reference: {booking.ReferenceNumber || 'N/A'}
              </div>
              <button 
                type="button" 
                className="button -sm -blue-1 text-white px-16 py-6 rounded-6 fw-600"
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  border: 'none',
                  fontSize: '12px'
                }}
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
