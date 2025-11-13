import React, { useState, useEffect, useMemo } from "react";
import FlightBookingDetails from "./FlightBookingDetails";
import "../../../public/sass/components/FlightBookingConfirmation.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useBatchAirlineLogos } from "../../services/batchLogoService";
import AirlineLogo from "../common/AirlineLogo";

// Responsive hook
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

const FlightBookingConfirmation = ({ flight, searchData, segment, personalDetails, passengers = [], onConfirmAndPay, onPreviousStep, currentStep, totalSteps, termsAccepted, setTermsAccepted }) => {
  const [activePassengerTab, setActivePassengerTab] = useState(0);
  const isDesktop = useMediaQuery('(min-width: 901px)');
  const isMobile = useMediaQuery('(max-width: 900px)');

  // Memoize the flights array to prevent infinite re-renders
  const flightsArray = useMemo(() => {
    return flight ? [flight] : [];
  }, [flight]);

  // Batch logo service for flight
  const { logoMap, loading: logoLoading, error: logoError } = useBatchAirlineLogos(flightsArray);

  return (
    <div className="container py-40">
      <div className="sectionTitle -md mb-32 text-center">
        <div className="sectionTitle__title text-30 fw-700 mb-10">Review & Confirm Your Booking</div>
        <div className="sectionTitle__text text-18 text-light-1">Please check all details below before proceeding to payment.</div>
      </div>
      <Tabs>
        <div className="confirmation-flex-row">
          <div className="confirmation-sidebar">
            <div className="px-15 py-30 rounded-8 border-light bg-white shadow-sm text-center">
              <TabList className="tabs__controls row y-gap-15 js-tabs-controls">
                <Tab className="col-12 tabs__button js-tabs-button">
                  <div className="d-flex items-center justify-center" style={{ gap: '8px' }}>
                    <i className="icon-user text-16 text-blue-1"></i>
                    <span className="text-14 fw-500">Passenger Details</span>
                  </div>
                </Tab>
                <Tab className="col-12 tabs__button js-tabs-button">
                  <div className="d-flex items-center justify-center" style={{ gap: '8px' }}>
                    <i className="icon-calendar text-16 text-blue-1"></i>
                    <span className="text-14 fw-500">Trip Details</span>
                  </div>
                </Tab>
                <Tab className="col-12 tabs__button js-tabs-button">
                  <div className="d-flex items-center justify-center" style={{ gap: '8px' }}>
                    <i className="icon-airplane text-16 text-blue-1"></i>
                    <span className="text-14 fw-500">Flight & Pricing</span>
                  </div>
                </Tab>
              </TabList>
            </div>
          </div>
          <div className="confirmation-content">
            <TabPanel>
              {/* Passenger Details with Sub-tabs */}
              {passengers && passengers.length > 0 ? (
                <div>
                  {/* Passenger Sub-tabs Header */}
                  <div className="passenger-subtabs-header">
                    <div className="passenger-subtabs-container">
                      {passengers.map((p, idx) => (
                        <button
                          key={idx}
                          className={`passenger-tab-button ${
                            activePassengerTab === idx ? 'active' : 'inactive'
                          }`}
                          onClick={() => setActivePassengerTab(idx)}
                        >
                          <div className="passenger-tab-content">
                            <i className="icon-user passenger-tab-icon"></i>
                            <span className="passenger-tab-text">
                              {p.gender === 'male' ? 'Mr.' : p.gender === 'female' ? 'Ms.' : ''} {p.fullName?.split(' ')[0] || `Passenger ${idx + 1}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                        </div>

                  {/* Active Passenger Details Card */}
                  {passengers[activePassengerTab] && (
                    <div className="confirmation-card">
                      <div className="confirmation-card-header">
                        <div className="confirmation-card-icon">
                          <i className="icon-user" />
                        </div>
                        <div>
                          <div className="confirmation-card-title">Passenger {activePassengerTab + 1}</div>
                          <div className="confirmation-card-subtitle">
                            {passengers[activePassengerTab].gender === 'male' ? 'Mr.' : passengers[activePassengerTab].gender === 'female' ? 'Ms.' : ''} {passengers[activePassengerTab].fullName}
                        </div>
                        </div>
                      </div>
                      <div className={isMobile ? "confirmation-info-grid-single" : "confirmation-info-grid"}>
                      <div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Full Name</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].fullName}</span>
                          </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Gender</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].gender}</span>
                          </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Date of Birth</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].dateOfBirth}</span>
                          </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Passport Number</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].passportNumber || 'Not provided'}</span>
                          </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Nationality</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].nationality}</span>
                          </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Seat Preference</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].seatPreference}</span>
                          </div>
                        </div>
                        <div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Email</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].email}</span>
                          </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Mobile Number</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].mobileNumber}</span>
                          </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Alternate Number</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].alternateNumber || 'Not provided'}</span>
                        </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Address 1</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].address1}</span>
                        </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Address 2</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].address2 || 'Not provided'}</span>
                        </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">State</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].state}</span>
                        </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">ZIP Code</span>
                            <span className="confirmation-info-value">{passengers[activePassengerTab].zip}</span>
                        </div>
                        </div>
                      </div>
                      {/* Special Requests full width */}
                      {passengers[activePassengerTab].specialRequests && (
                        <div className="confirmation-info-item-full">
                          <span className="confirmation-info-label">Special Requests</span>
                          <span className="confirmation-info-value">{passengers[activePassengerTab].specialRequests}</span>
                    </div>
                      )}
                    </div>
                  )}
                  </div>
              ) : (
                <div className="text-15 text-light-1">No passenger details found.</div>
              )}
            </TabPanel>
            <TabPanel>
              {/* Other Details Card (Trip type, dates, and Other Details) */}
              <div className="confirmation-card">
                <div className="confirmation-card-header">
                  <div className="confirmation-card-icon">
                    <i className="icon-calendar" />
                  </div>
                  <div>
                    <div className="confirmation-card-title">Search & Trip Details</div>
                    <div className="confirmation-card-subtitle">Your travel preferences and search criteria</div>
                  </div>
                </div>
                {/* 2x2 grid for details */}
                <div className="trip-details-grid">
                  {/* Upper Left - Route & Dates - 2x2 Grid */}
                  <div className="route-dates-grid">
                    {/* Row 1 */}
                    <div className="grid-row">
                      <div className="confirmation-info-item">
                        <span className="confirmation-info-label">Route</span>
                        <span className="confirmation-info-value">{searchData.from} → {searchData.to}</span>
                      </div>
                      <div className="confirmation-info-item">
                        <span className="confirmation-info-label">Trip Type</span>
                        <span className="confirmation-info-value">
                          <span className={`trip-type-badge ${searchData.tripType === 'ONEWAY' ? 'oneway' : 'roundtrip'}`}>
                            {searchData.tripType === 'ONEWAY' ? 'One Way' : 'Round Trip'}
                          </span>
                        </span>
                    </div>
                    </div>
                    {/* Row 2 */}
                    <div className="grid-row">
                      {searchData.tripType === 'ONEWAY' ? (
                        <>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Departure Date</span>
                            <span className="confirmation-info-value">{new Date(searchData.date).toLocaleDateString()}</span>
                        </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Departure Time</span>
                            <span className="confirmation-info-value">{searchData.time || 'Anytime'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Departure Date</span>
                            <span className="confirmation-info-value">{new Date(searchData.departureDate).toLocaleDateString()}</span>
                          </div>
                          <div className="confirmation-info-item">
                            <span className="confirmation-info-label">Return Date</span>
                            <span className="confirmation-info-value">{new Date(searchData.returnDate).toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                    {/* Row 3 for Round Trip - Return Time */}
                    {searchData.tripType === 'ROUNDTRIP' && (
                      <div className="grid-row">
                        <div className="confirmation-info-item">
                          <span className="confirmation-info-label">Departure Time</span>
                          <span className="confirmation-info-value">{searchData.departureTime || 'Anytime'}</span>
                        </div>
                        <div className="confirmation-info-item">
                          <span className="confirmation-info-label">Return Time</span>
                          <span className="confirmation-info-value">{searchData.returnTime || 'Anytime'}</span>
                        </div>
                      </div>
                    )}
                    {/* Row 4: Preferred Airlines */}
                    <div className="grid-row single-item">
                      <div className="confirmation-info-item">
                        <span className="confirmation-info-label">Preferred Airlines</span>
                        <span className="confirmation-info-value">
                          {[searchData.airline1, searchData.airline2].filter(Boolean).join(', ') || 'Any'}
                      </span>
                    </div>
                    </div>
                  </div>
                  {/* Upper Right - Passengers & Class - 2x2 Grid */}
                  <div className="passengers-class-grid">
                    {/* Row 1: Total Passengers & Cabin Class */}
                    <div className="grid-row">
                      <div className="confirmation-info-item">
                        <span className="confirmation-info-label">Total Passengers</span>
                        <span className="confirmation-info-value">
                          {(parseInt(searchData.adult) || 0) + (parseInt(searchData.child) || 0) + (parseInt(searchData.seatInfant) || 0)}
                      </span>
                    </div>
                      <div className="confirmation-info-item">
                        <span className="confirmation-info-label">Cabin Class</span>
                        <span className="confirmation-info-value">{searchData.cabinClass || 'Economy'}</span>
                    </div>
                    </div>
                    {/* Row 2: Adults & Children */}
                    <div className="grid-row">
                      <div className="confirmation-info-item">
                        <span className="confirmation-info-label">Adults</span>
                        <span className="confirmation-info-value">{searchData.adult || 0}</span>
                    </div>
                      <div className="confirmation-info-item">
                        <span className="confirmation-info-label">Children</span>
                        <span className="confirmation-info-value">{searchData.child || 0}</span>
                  </div>
                    </div>
                    {/* Row 3: Lap Infants & Seat Infants */}
                    <div className="grid-row">
                      <div className="confirmation-info-item">
                        <span className="confirmation-info-label">Lap Infants</span>
                        <span className="confirmation-info-value">{searchData.lapInfant || 0}</span>
                    </div>
                      <div className="confirmation-info-item">
                        <span className="confirmation-info-label">Seat Infants</span>
                        <span className="confirmation-info-value">{searchData.seatInfant || 0}</span>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              {/* Booking Details Card (Flight & Segment only) */}
              <div className="confirmation-card">
                <div className="confirmation-card-header">
                  <div className="confirmation-card-icon">
                    <i className="icon-airplane" />
                  </div>
                  <div>
                    <div className="confirmation-card-title">Flight & Pricing Details</div>
                    <div className="confirmation-card-subtitle">Complete flight information and pricing breakdown</div>
                  </div>
                </div>
                {flight ? (
                  <>
                    {/* Flight Information */}
                    <div className="flight-info-section">
                                              <div className="row y-gap-15">
                          <div className="col-12">
                            <div className="flight-airline-info">
                              <AirlineLogo 
                                className="flight-airline-logo"
                                alt="Airline Logo"
                                fallbackImage="/img/flights/default-flight.png"
                                validatingCarrierCode={flight.validatingCarrierCode}
                                airlineLogoUrl={flight.airlineLogo}
                                logoMap={logoMap}
                                logoLoading={logoLoading}
                              />
                              <div className="flight-airline-details">
                                <div className="airline-name">{flight.airline || flight.validatingCarrier}</div>
                                <div className="airline-type">Operating Carrier</div>
                              </div>
                              <div className="flight-info-details">
                                <div className="flight-info-item">
                                  <span className="flight-info-label">Total Duration</span>
                                  <span className="flight-info-value">{flight.totalDurationFormatted}</span>
                                </div>
                                <div className="flight-info-item">
                                  <span className="flight-info-label">Stops</span>
                                  <span className="flight-info-value">{flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
                                </div>
                                <div className="flight-info-item">
                                  <span className="flight-info-label">Baggage</span>
                                  <span className="flight-info-value">{flight.baggageInfo || 'Details at next step'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>

                    {/* Flight Segments */}
                    {flight.flightList && flight.flightList.length > 0 && (
                      <div className="flight-info-section">
                        <div className="flight-info-header">
                          <i className="icon-map"></i>
                          <span>Flight Segments</span>
                        </div>
                        {flight.flightList.map((segment, idx) => (
                          <div key={idx} className="flight-segment-card">
                            <div className="flight-segment-header">
                              <div className="flight-segment-title">
                                {segment.airline} {segment.flightNumber}
                              </div>
                              <div className="flight-segment-equipment">
                                {segment.equipment}
                              </div>
                            </div>
                            <div className="flight-segment-details">
                              <div className="flight-segment-airport">
                                <div className="airport-label">Departure</div>
                                <div className="airport-name">{segment.departureAirport}</div>
                                <div className="airport-time">{segment.departureTime}</div>
                                <div className="airport-date">{segment.departureDateFormatted}</div>
                              </div>
                              <div className="flight-segment-airport">
                                <div className="airport-label">Arrival</div>
                                <div className="airport-name">{segment.arrivalAirport}</div>
                                <div className="airport-time">{segment.arrivalTime}</div>
                                <div className="airport-date">{segment.arrivalDateFormatted}</div>
                              </div>
                            </div>
                            <div className="flight-segment-footer">
                              <div className="segment-duration">
                                <span className="segment-label">Duration:</span> {segment.duration}
                              </div>
                              <div className="segment-class">
                                <span className="segment-label">Class:</span> {segment.cabinClass}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pricing Breakdown */}
                    {flight.rawFares && flight.rawFares.length > 0 && (
                      <div className="pricing-section">
                        <div className="pricing-header">
                          <i className="icon-credit-card"></i>
                          <span>Pricing Breakdown</span>
                        </div>
                        
                        {/* Calculate passenger counts */}
                        {(() => {
                          const adults = parseInt(searchData.adult) || 0;
                          const children = parseInt(searchData.child) || 0;
                          const infants = parseInt(searchData.lapInfant) || 0;
                          
                          // Get fares for different passenger types
                          const adultFare = flight.rawFares.find(f => f.PaxType === 'ADT');
                          const childFare = flight.rawFares.find(f => f.PaxType === 'CHD');
                          const infantFare = flight.rawFares.find(f => f.PaxType === 'INF');
                          
                          // Calculate totals
                          const adultBaseFare = adultFare?.BaseFare || 0;
                          const adultTaxes = adultFare?.Taxes || 0;
                          const adultTotal = adultBaseFare + adultTaxes;
                          
                          const childBaseFare = childFare?.BaseFare || adultBaseFare; // Use adult price if no child price
                          const childTaxes = childFare?.Taxes || adultTaxes;
                          const childTotal = childBaseFare + childTaxes;
                          
                          const infantBaseFare = infantFare?.BaseFare || 0;
                          const infantTaxes = infantFare?.Taxes || 0;
                          const infantTotal = infantBaseFare + infantTaxes;
                          
                          const totalBaseFare = (adults * adultBaseFare) + (children * childBaseFare) + (infants * infantBaseFare);
                          const totalTaxes = (adults * adultTaxes) + (children * childTaxes) + (infants * infantTaxes);
                          const grandTotal = totalBaseFare + totalTaxes;
                          
                          return (
                            <>
                              {/* Adults */}
                              {adults > 0 && adultFare && (
                                <div className="pricing-card">
                                  <div className="pricing-card-title">Adults ({adults}x)</div>
                                  <div className="pricing-details">
                                    <div className="confirmation-info-item">
                                      <span className="confirmation-info-label">Base Fare (per person)</span>
                                      <span className="confirmation-info-value">${adultBaseFare.toFixed(2)}</span>
                                    </div>
                                    <div className="confirmation-info-item">
                                      <span className="confirmation-info-label">Taxes & Fees (per person)</span>
                                      <span className="confirmation-info-value">${adultTaxes.toFixed(2)}</span>
                                    </div>
                                  </div>
                                  <div className="pricing-total">
                                    <span className="pricing-total-label">Subtotal ({adults}x)</span>
                                    <span className="pricing-total-value">${(adults * adultTotal).toFixed(2)}</span>
                                  </div>
                                  {(adultFare.basicEconomyFare || adultFare.IsNonRefundableFare) && (
                                    <div className="pricing-warnings">
                                      {adultFare.basicEconomyFare && (
                                        <div className="warning-item basic-economy">Basic Economy - Restrictions apply</div>
                                      )}
                                      {adultFare.IsNonRefundableFare && (
                                        <div className="warning-item non-refundable">Non-Refundable</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Children */}
                              {children > 0 && (
                                <div className="pricing-card">
                                  <div className="pricing-card-title">Children ({children}x)</div>
                                  <div className="pricing-details">
                                    <div className="confirmation-info-item">
                                      <span className="confirmation-info-label">Base Fare (per person)</span>
                                      <span className="confirmation-info-value">${childBaseFare.toFixed(2)}</span>
                                    </div>
                                    <div className="confirmation-info-item">
                                      <span className="confirmation-info-label">Taxes & Fees (per person)</span>
                                      <span className="confirmation-info-value">${childTaxes.toFixed(2)}</span>
                                    </div>
                                  </div>
                                  <div className="pricing-total">
                                    <span className="pricing-total-label">Subtotal ({children}x)</span>
                                    <span className="pricing-total-value">${(children * childTotal).toFixed(2)}</span>
                                  </div>
                                  {childFare && (childFare.basicEconomyFare || childFare.IsNonRefundableFare) && (
                                    <div className="pricing-warnings">
                                      {childFare.basicEconomyFare && (
                                        <div className="warning-item basic-economy">Basic Economy - Restrictions apply</div>
                                      )}
                                      {childFare.IsNonRefundableFare && (
                                        <div className="warning-item non-refundable">Non-Refundable</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Infants */}
                              {infants > 0 && infantFare && (
                                <div className="pricing-card">
                                  <div className="pricing-card-title">Infants ({infants}x)</div>
                                  <div className="pricing-details">
                                    <div className="confirmation-info-item">
                                      <span className="confirmation-info-label">Base Fare (per person)</span>
                                      <span className="confirmation-info-value">${infantBaseFare.toFixed(2)}</span>
                                    </div>
                                    <div className="confirmation-info-item">
                                      <span className="confirmation-info-label">Taxes & Fees (per person)</span>
                                      <span className="confirmation-info-value">${infantTaxes.toFixed(2)}</span>
                                    </div>
                                  </div>
                                  <div className="pricing-total">
                                    <span className="pricing-total-label">Subtotal ({infants}x)</span>
                                    <span className="pricing-total-value">${(infants * infantTotal).toFixed(2)}</span>
                                  </div>
                                  {(infantFare.basicEconomyFare || infantFare.IsNonRefundableFare) && (
                                    <div className="pricing-warnings">
                                      {infantFare.basicEconomyFare && (
                                        <div className="warning-item basic-economy">Basic Economy - Restrictions apply</div>
                                      )}
                                      {infantFare.IsNonRefundableFare && (
                                        <div className="warning-item non-refundable">Non-Refundable</div>
                                      )}
                                    </div>
                                  )}
                    </div>
                              )}
                              
                              {/* Grand Total */}
                              <div className="pricing-card grand-total-card">
                                <div className="pricing-card-title">Grand Total</div>
                                <div className="pricing-details">
                                  <div className="confirmation-info-item">
                                    <span className="confirmation-info-label">Total Base Fare</span>
                                    <span className="confirmation-info-value">${totalBaseFare.toFixed(2)}</span>
                    </div>
                                  <div className="confirmation-info-item">
                                    <span className="confirmation-info-label">Total Taxes & Fees</span>
                                    <span className="confirmation-info-value">${totalTaxes.toFixed(2)}</span>
                    </div>
                    </div>
                                <div className="pricing-total grand-total">
                                  <span className="pricing-total-label">Total Amount</span>
                                  <span className="pricing-total-value">${grandTotal.toFixed(2)}</span>
                    </div>
                    </div>
                            </>
                          );
                        })()}
                    </div>
                    )}

                  </>
                ) : (
                  <div className="text-15 text-light-1">Flight or segment data not found.</div>
                )}
              </div>
            </TabPanel>
          </div>
        </div>
      </Tabs>
      
      
      {/* Terms and Confirm Button */}
      <div className="terms-confirm-section mt-40">
        <div className="row justify-center">
          <div className="col-12">
            <div className="terms-confirm-wrapper bg-light-2 rounded-12 p-30">
              <div className="row y-gap-20 items-center">
                {/* Left Side - Title and Description */}
                <div className="col-lg-4 col-md-6">
                  <div className="text-center text-lg-start">
                    <h4 className="text-20 fw-600 text-dark-1 mb-10">Ready to Book?</h4>
                    <p className="text-14 text-light-1">Review and accept the terms to proceed with your booking.</p>
                  </div>
                </div>
                
                {/* Middle - Terms Checkbox */}
                <div className="col-lg-4 col-md-6">
                  <div className="terms-checkbox">
                    <div className="form-checkbox d-flex items-center">
                      <input
                        type="checkbox"
                        id="termsCheckbox"
                        checked={termsAccepted}
                        onChange={e => setTermsAccepted(e.target.checked)}
                      />
                      <div className="form-checkbox__mark">
                        <div className="form-checkbox__icon icon-check" />
                      </div>
                      <label htmlFor="termsCheckbox" className="text-15 text-dark-1 ml-10">
                        I agree to the <a href="#" className="text-blue-1 fw-500">Terms & Conditions.</a>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Confirm & Pay Button */}
                <div className="col-lg-4 col-md-12">
                  <div className="text-center text-lg-start d-flex items-center justify-center justify-lg-start" style={{ height: '100%' }}>
                    <button
                      className="confirm-pay-button button h-60 px-40 -dark-1 text-white fw-600"
                      disabled={!termsAccepted}
                      onClick={onConfirmAndPay}
                      style={{
                        opacity: (!termsAccepted) ? 0.6 : 1,
                        cursor: (!termsAccepted) ? 'not-allowed' : 'pointer',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="icon-credit-card mr-10"></i>
                      Confirm & Pay ${(() => {
                        // Calculate the same total as in the pricing breakdown
                        const adults = parseInt(searchData.adult) || 0;
                        const children = parseInt(searchData.child) || 0;
                        const infants = parseInt(searchData.lapInfant) || 0;
                        
                        const adultFare = flight.rawFares?.find(f => f.PaxType === 'ADT');
                        const childFare = flight.rawFares?.find(f => f.PaxType === 'CHD');
                        const infantFare = flight.rawFares?.find(f => f.PaxType === 'INF');
                        
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
                      })()}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Message */}
      <div className="text-center mt-30">
        <div className={`text-16 ${!termsAccepted ? 'text-red-1' : 'text-green-1'} fw-500`}>
          {!termsAccepted ? (
            <>
              <i className="icon-warning mr-8"></i>
              Please review all information and accept the Terms & Conditions to proceed.
            </>
          ) : (
            <>
              {/* <i className="icon-check mr-8"></i> */}
              {/* Ready to proceed to payment */}
            </>
          )}
        </div>
      </div>
      {/* Navigation Buttons */}
      <div className="row x-gap-20 y-gap-20 pt-20">
        <div className="col-auto">
          <button
            className="button h-60 px-24 -blue-1 bg-light-2"
            disabled={currentStep === 0}
            onClick={onPreviousStep}
            type="button"
          >
            Previous
          </button>
        </div>

        {/* <div className="col-auto">
          <button
            className="button h-60 px-24 -dark-1 bg-blue-1 text-white"
            disabled={currentStep === totalSteps || !termsAccepted}
            onClick={onConfirmAndPay}
            type="button"
            style={{
              opacity: (!termsAccepted) ? 0.5 : 1,
              cursor: (!termsAccepted) ? 'not-allowed' : 'pointer'
            }}
          >
            Next <div className="icon-arrow-top-right ml-15" />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default FlightBookingConfirmation; 