// src/components/flight-booking/PriceBreakdown.jsx
import React from 'react';

const PriceBreakdown = ({ flight, searchData }) => {
  if (!flight || !searchData || !flight.rawFares) {
    return (
      <div className="text-14 text-light-1">Price breakdown not available</div>
    );
  }

  const adults = parseInt(searchData.adult) || 0;
  const children = parseInt(searchData.child) || 0;
  const infants = parseInt(searchData.lapInfant) || 0;

  // Get fares for different passenger types
  const adultFare = flight.rawFares.find(f => f.PaxType === 'ADT');
  const childFare = flight.rawFares.find(f => f.PaxType === 'CHD');
  const infantFare = flight.rawFares.find(f => f.PaxType === 'INF');

  // Debug logging to verify data
  console.log('PriceBreakdown Debug:', {
    flight: flight,
    rawFares: flight.rawFares,
    adultFare: adultFare,
    searchData: searchData,
    adults: adults,
    children: children,
    infants: infants
  });

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

  // Additional debug logging for calculations
  console.log('PriceBreakdown Calculations:', {
    adultBaseFare,
    adultTaxes,
    childBaseFare,
    childTaxes,
    infantBaseFare,
    infantTaxes,
    totalBaseFare,
    totalTaxes,
    grandTotal,
    adults,
    children,
    infants
  });

  return (
    <div className="price-breakdown">
      <div className="text-18 fw-500 mb-15">Price Breakdown</div>
      
      {/* Base Fare Section */}
      <div className="mb-15">
        <div className="text-15 fw-500 mb-10">Base Fare</div>
        {adults > 0 && (
          <div className="row y-gap-5 justify-between mb-5">
            <div className="col-auto">
              <div className="text-14 text-light-1">Adults ({adults}x)</div>
            </div>
            <div className="col-auto">
              <div className="text-14 text-light-1">${(adults * adultBaseFare).toFixed(2)}</div>
            </div>
          </div>
        )}
        {children > 0 && (
          <div className="row y-gap-5 justify-between mb-5">
            <div className="col-auto">
              <div className="text-14 text-light-1">Children ({children}x)</div>
            </div>
            <div className="col-auto">
              <div className="text-14 text-light-1">${(children * childBaseFare).toFixed(2)}</div>
            </div>
          </div>
        )}
        {infants > 0 && (
          <div className="row y-gap-5 justify-between mb-5">
            <div className="col-auto">
              <div className="text-14 text-light-1">Infants ({infants}x)</div>
            </div>
            <div className="col-auto">
              <div className="text-14 text-light-1">${(infants * infantBaseFare).toFixed(2)}</div>
            </div>
          </div>
        )}
        <div className="row y-gap-5 justify-between border-top-light pt-10 mt-10">
          <div className="col-auto">
            <div className="text-14 fw-500">Subtotal (Base Fare)</div>
          </div>
          <div className="col-auto">
            <div className="text-14 fw-500">${totalBaseFare.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Taxes & Fees Section */}
      <div className="mb-15">
        <div className="text-15 fw-500 mb-10">Taxes & Fees</div>
        {adults > 0 && (
          <div className="row y-gap-5 justify-between mb-5">
            <div className="col-auto">
              <div className="text-14 text-light-1">Adults ({adults}x)</div>
            </div>
            <div className="col-auto">
              <div className="text-14 text-light-1">${(adults * adultTaxes).toFixed(2)}</div>
            </div>
          </div>
        )}
        {children > 0 && (
          <div className="row y-gap-5 justify-between mb-5">
            <div className="col-auto">
              <div className="text-14 text-light-1">Children ({children}x)</div>
            </div>
            <div className="col-auto">
              <div className="text-14 text-light-1">${(children * childTaxes).toFixed(2)}</div>
            </div>
          </div>
        )}
        {infants > 0 && (
          <div className="row y-gap-5 justify-between mb-5">
            <div className="col-auto">
              <div className="text-14 text-light-1">Infants ({infants}x)</div>
            </div>
            <div className="col-auto">
              <div className="text-14 text-light-1">${(infants * infantTaxes).toFixed(2)}</div>
            </div>
          </div>
        )}
        <div className="row y-gap-5 justify-between border-top-light pt-10 mt-10">
          <div className="col-auto">
            <div className="text-14 fw-500">Subtotal (Taxes & Fees)</div>
          </div>
          <div className="col-auto">
            <div className="text-14 fw-500">${totalTaxes.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="border-top-light pt-15 mt-15">
        <div className="row y-gap-10 justify-between">
          <div className="col-auto">
            <div className="text-18 fw-600">Total Amount</div>
          </div>
          <div className="col-auto">
            <div className="text-18 fw-600">${grandTotal.toFixed(2)}</div>
          </div>
        </div>
        <div className="text-12 text-light-1 mt-5">
          All prices in USD. Taxes and fees included.
        </div>
      </div>

      {/* Fare Details */}
      {adultFare && (
        <div className="mt-20 pt-20 border-top-light">
          <div className="text-15 fw-500 mb-10">Fare Details</div>
          <div className="text-14 text-light-1 mb-5">
            <strong>Fare Type:</strong> {adultFare.FareTypeIndicator || 'Standard'}
          </div>
          {adultFare.basicEconomyFare && (
            <div className="text-14 text-orange-1 mb-5">
              <strong>⚠️ Basic Economy Fare</strong> - Restrictions may apply
            </div>
          )}
          {adultFare.IsNonRefundableFare && (
            <div className="text-14 text-red-1 mb-5">
              <strong>🚫 Non-Refundable Fare</strong>
            </div>
          )}
          {adultFare.BeforeExchangePenaltyAllowed && (
            <div className="text-14 text-light-1 mb-5">
              <strong>Exchange Fee:</strong> ${adultFare.BeforeExchangePenalty?.toFixed(2) || '0.00'}
            </div>
          )}
          {adultFare.BeforeRefundPenaltyAllowed && (
            <div className="text-14 text-light-1 mb-5">
              <strong>Refund Fee:</strong> ${adultFare.BeforeRefundPenalty?.toFixed(2) || '0.00'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceBreakdown;
