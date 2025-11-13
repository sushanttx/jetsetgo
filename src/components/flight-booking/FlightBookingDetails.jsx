// src/components/flight-booking/FlightBookingDetails.jsx
import React, { useMemo } from 'react';
import PriceBreakdown from './PriceBreakdown';
import { useBatchAirlineLogos } from '../../services/batchLogoService';
import AirlineLogo from '../common/AirlineLogo';

const FlightBookingDetails = ({ flight, segment, searchData }) => {
  // Memoize the flights array to prevent infinite re-renders
  const flightsArray = useMemo(() => {
    return flight ? [flight] : [];
  }, [flight]);

  // Batch logo service for flight
  const { logoMap, loading: logoLoading, error: logoError } = useBatchAirlineLogos(flightsArray);

  if (!flight || !searchData) {
    return (
      <div className="px-30 py-30 border-light rounded-4">
        <div className="text-20 fw-500 mb-20">Your Booking Details</div>
        <div>Loading...</div>
      </div>
    );
  }

  // Extract baggage info
  const baggageInfo = flight.rawBaggage ? Object.entries(flight.rawBaggage) : [];

  return (
    <div className="px-30 py-30 border-light rounded-4">
      <div className="text-20 fw-500 mb-30">Your Booking Details</div>

      {/* --- Flight Information Section --- */}
      <div className="row x-gap-15 y-gap-20">
        <div className="col-auto">
          <AirlineLogo 
            className="size-40"
            alt="airline logo"
            fallbackImage={flight.flightList?.[0]?.avatar || '/img/flights/default-flight.png'}
            validatingCarrierCode={flight.validatingCarrierCode}
            airlineLogoUrl={flight.airlineLogo}
            logoMap={logoMap}
            logoLoading={logoLoading}
          />
        </div>
        <div className="col">
          <div className="text-15 fw-500">{new Date(searchData.date).toDateString()}</div>
          <div className="text-14 text-light-1">{flight.validatingCarrier}</div>
        </div>
      </div>

      {flight.flightList.map((seg, index) => (
        <div key={seg.id}>
            <div className="border-top-light mt-20 mb-20" />
            <div className="row y-gap-10">
                <div className="col-12 text-15 fw-500">{seg.departureAirport} → {seg.arrivalAirport}</div>
                <div className="col-auto"><div className="text-15 text-light-1">Depart:</div></div>
                <div className="col-auto"><div className="text-15 fw-500">{seg.departureTime} </div></div>
                <div className="col-auto"><div className="text-15 text-light-1">---→Arrive:</div></div>
                <div className="col-auto"><div className="text-15 fw-500">{seg.arrivalTime}</div></div>
                 <div className="col-12"><div className="text-14 text-light-1">{seg.duration} • {seg.airline} {seg.flightNumber}</div></div>
            </div>
            {seg.layoverTime && <div className="text-14 text-light-1 mt-10">Layover: {seg.layoverTime}</div>}
        </div>
      ))}
      
      <div className="border-top-light mt-20 mb-20" />

      {/* --- Price Breakdown Section --- */}
      <PriceBreakdown flight={flight} searchData={searchData} />

      {/* --- Baggage Information Section --- */}
      {baggageInfo.length > 0 && (
         <>
            <div className="border-top-light mt-20 mb-20" />
            <div className="text-18 fw-500 mb-10">Baggage Allowance</div>
            {baggageInfo.map(([route, allowances]) => (
                <div key={route}>
                    <div className="text-15 fw-500">{route}</div>
                    {allowances.map((allowance, i) => (
                        <div key={i} className="text-14 text-light-1 capitalize">{allowance.type.toLowerCase()}: {allowance.noOfPieces}</div>
                    ))}
                </div>
            ))}
         </>
      )}

    </div>
  );
};

export default FlightBookingDetails;