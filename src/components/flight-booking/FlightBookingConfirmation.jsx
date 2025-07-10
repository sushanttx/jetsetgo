import React, { useState } from "react";
import FlightBookingDetails from "./FlightBookingDetails";
import "../../../public/sass/components/FlightBookingConfirmation.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const FlightBookingConfirmation = ({ flight, formData, segment, personalDetails, passengers = [], onConfirmAndPay }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <div className="container py-40">
      <div className="sectionTitle -md mb-32 text-center">
        <div className="sectionTitle__title text-30 fw-700 mb-10">Review & Confirm Your Booking</div>
        <div className="sectionTitle__text text-18 text-light-1">Please check all details below before proceeding to payment.</div>
      </div>
      <Tabs>
        <div className="confirmation-flex-row" style={{display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap'}}>
          <div style={{flex: '0 0 260px', minWidth: 200, maxWidth: 320}}>
            <div className="px-30 py-30 rounded-4 border-light">
              <TabList className="tabs__controls row y-gap-10 js-tabs-controls">
                <Tab className="col-12 tabs__button js-tabs-button">Personal Details</Tab>
                <Tab className="col-12 tabs__button js-tabs-button">Other Details</Tab>
                <Tab className="col-12 tabs__button js-tabs-button">Booking Details</Tab>
              </TabList>
            </div>
          </div>
          <div style={{flex: 1, minWidth: 0}}>
            <TabPanel>
              {/* Passenger Details Card */}
              {passengers && passengers.length > 0 ? (
                passengers.map((p, idx) => (
                  <div key={idx} className="rounded-4 px-30 py-30 border-light confirmation-card-inner h-100 transition-all hover-shadow mb-32">
                    <div className="confirmation-card-title text-22 text-dark-1 fw-700 mb-20" style={{display: 'flex', alignItems: 'center', gap: 10}}>
                      <i className="icon-user confirmation-icon" /> Passenger number {idx + 1}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                      <div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Full Name</span>
                          <span className="confirmation-info-value text-dark-1">{p.fullName}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Gender</span>
                          <span className="confirmation-info-value text-dark-1">{p.gender}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Date of Birth</span>
                          <span className="confirmation-info-value text-dark-1">{p.dateOfBirth}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Passport Number</span>
                          <span className="confirmation-info-value text-dark-1">{p.passportNumber}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Nationality</span>
                          <span className="confirmation-info-value text-dark-1">{p.nationality}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Seat Preference</span>
                          <span className="confirmation-info-value text-dark-1">{p.seatPreference}</span>
                        </div>
                      </div>
                      <div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Email</span>
                          <span className="confirmation-info-value text-dark-1">{p.email}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Mobile Number</span>
                          <span className="confirmation-info-value text-dark-1">{p.mobileNumber}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Alternate Number</span>
                          <span className="confirmation-info-value text-dark-1">{p.alternateNumber}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Address 1</span>
                          <span className="confirmation-info-value text-dark-1">{p.address1}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Address 2</span>
                          <span className="confirmation-info-value text-dark-1">{p.address2}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>State</span>
                          <span className="confirmation-info-value text-dark-1">{p.state}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>ZIP</span>
                          <span className="confirmation-info-value text-dark-1">{p.zip}</span>
                        </div>
                      </div>
                    </div>
                    {/* Special Requests full width */}
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Special Requests</span>
                      <span className="confirmation-info-value text-dark-1">{p.specialRequests}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-15 text-light-1">No passenger details found.</div>
              )}
            </TabPanel>
            <TabPanel>
              {/* Other Details Card (Trip type, dates, and Other Details) */}
              <div className="rounded-4  px-30 py-30 border-light confirmation-card-inner h-100 transition-all hover-shadow">
                <div className="confirmation-card-title text-22 text-dark-1 fw-700" style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <i className="icon-calendar confirmation-icon" /> Other Details
                </div>
                {/* 2x2 grid for details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2rem' }}>
                  {/* Upper Left */}
                  <div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>From</span>
                      <span className="confirmation-info-value text-dark-1">{formData.from}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>To</span>
                      <span className="confirmation-info-value text-dark-1">{formData.to}</span>
                    </div>
                    {formData.date !== undefined ? (
                      <>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Date</span>
                          <span className="confirmation-info-value text-dark-1">{formData.date}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Time</span>
                          <span className="confirmation-info-value text-dark-1">{formData.time}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Departure Date</span>
                          <span className="confirmation-info-value text-dark-1">{formData.departureDate}</span>
                        </div>
                        <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                          <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Departure Time</span>
                          <span className="confirmation-info-value text-dark-1">{formData.departureTime}</span>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Upper Right */}
                  <div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Trip Type</span>
                      <span className="confirmation-info-value text-dark-1">
                        <span className="confirmation-badge">{formData.date !== undefined ? 'One Way' : 'Round Trip'}</span>
                      </span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Cabin Class</span>
                      <span className="confirmation-info-value text-dark-1">{formData.cabinClass}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Preferred Airline 1</span>
                      <span className="confirmation-info-value text-dark-1">{formData.airline1}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Preferred Airline 2</span>
                      <span className="confirmation-info-value text-dark-1">{formData.airline2}</span>
                    </div>
                  </div>
                  {/* Bottom Left */}
                  <div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Adults</span>
                      <span className="confirmation-info-value text-dark-1">{formData.adult}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Children</span>
                      <span className="confirmation-info-value text-dark-1">{formData.child}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Lap Infant</span>
                      <span className="confirmation-info-value text-dark-1">{formData.lapInfant}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Seat Infant</span>
                      <span className="confirmation-info-value text-dark-1">{formData.seatInfant}</span>
                    </div>
                  </div>
                  {/* Bottom Right */}
                  <div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Flexible Dates</span>
                      <span className="confirmation-info-value text-dark-1">{formData.flexibleDates ? "Yes" : "No"}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>No Penalties</span>
                      <span className="confirmation-info-value text-dark-1">{formData.noPenalties ? "Yes" : "No"}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Direct Flights</span>
                      <span className="confirmation-info-value text-dark-1">{formData.directFlights ? "Yes" : "No"}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 0'}}>
                      <span className="confirmation-info-label text-light-1" style={{marginBottom: 4}}>Nearby Airports</span>
                      <span className="confirmation-info-value text-dark-1">{formData.nearbyAirports ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              {/* Booking Details Card (Flight & Segment only) */}
              <div className="rounded-4  px-30 py-30 border-light confirmation-card-inner h-100 transition-all hover-shadow mb-32">
                <div className="confirmation-card-title text-22 text-dark-1 fw-700 mb-20" style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <i className="icon-airplane confirmation-icon" /> Flight Summary
                </div>
                {flight ? (
                  <>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0'}}>
                      <span className="confirmation-info-label text-light-1">Airline</span>
                      <span className="confirmation-info-value text-dark-1">{flight.airline}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0'}}>
                      <span className="confirmation-info-label text-light-1">Date</span>
                      <span className="confirmation-info-value text-dark-1">{flight.date}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0'}}>
                      <span className="confirmation-info-label text-light-1">Time</span>
                      <span className="confirmation-info-value text-dark-1">{flight.time}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0'}}>
                      <span className="confirmation-info-label text-light-1">Base Fare</span>
                      <span className="confirmation-info-value text-dark-1">${flight.priceBreakdown?.baseFare}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0'}}>
                      <span className="confirmation-info-label text-light-1">Taxes</span>
                      <span className="confirmation-info-value text-dark-1">${flight.priceBreakdown?.taxes}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0'}}>
                      <span className="confirmation-info-label text-light-1">Fees</span>
                      <span className="confirmation-info-value text-dark-1">${flight.priceBreakdown?.fees}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0'}}>
                      <span className="confirmation-info-label text-light-1">Total</span>
                      <span className="confirmation-info-value text-dark-1">${flight.priceBreakdown?.total}</span>
                    </div>
                    <div className="confirmation-info-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '8px 0', fontWeight: 'bold', fontSize: 18}}>
                      <span className="confirmation-info-label text-dark-1">Total Fare</span>
                      <span className="confirmation-info-value text-blue-1" style={{marginLeft: 12}}>${flight.totalFare}</span>
                    </div>
                    <div className="confirmation-info-row mt-20" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                      <div className="form-checkbox d-flex items-center" style={{justifyContent: 'center'}}>
                        <input
                          type="checkbox"
                          id="termsCheckbox"
                          checked={termsAccepted}
                          onChange={e => setTermsAccepted(e.target.checked)}
                        />
                        <div className="form-checkbox__mark">
                          <div className="form-checkbox__icon icon-check" />
                        </div>
                        <label htmlFor="termsCheckbox" className="text-15 text-light-1 ml-10" style={{whiteSpace: 'nowrap'}}>
                          I agree to the <a href="#" className="text-blue-1">Terms & Conditions</a>
                        </label>
                      </div>
                      <button
                        className="button h-60 px-24 -dark-1 bg-blue-1 text-white mt-20"
                        style={{ display: 'block', margin: '0 auto' }}
                        disabled={!termsAccepted}
                        onClick={onConfirmAndPay}
                      >
                        Confirm & Pay
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-15 text-light-1">Flight or segment data not found.</div>
                )}
              </div>
            </TabPanel>
          </div>
        </div>
      </Tabs>
      <div className="text-center mt-40">
        <div className="text-18 text-light-1">If all details are correct, click <span className="fw-600 text-blue-1">Next</span> to proceed to payment.</div>
      </div>
    </div>
  );
};

export default FlightBookingConfirmation; 