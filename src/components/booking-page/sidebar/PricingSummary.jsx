const PricingSummary = ({ paymentType = 'HOLD', flight, searchData }) => {
  const getPaymentMethodInfo = () => {
    switch (paymentType) {
      case 'HOLD':
        return {
          method: 'Hold Payment',
          description: 'Payment will be processed later',
          icon: 'icon-calendar',
          color: 'text-blue-1'
        };
      case 'CC':
        return {
          method: 'Credit Card',
          description: 'Payment processed immediately',
          icon: 'icon-credit-card',
          color: 'text-green-1'
        };
      case 'CK':
        return {
          method: 'Check Payment',
          description: 'Payment via check',
          icon: 'icon-check',
          color: 'text-orange-1'
        };
      default:
        return {
          method: 'Hold Payment',
          description: 'Payment will be processed later',
          icon: 'icon-calendar',
          color: 'text-blue-1'
        };
    }
  };

  const paymentInfo = getPaymentMethodInfo();

  // Calculate pricing from flight data
  const calculatePricing = () => {
    if (!flight || !searchData || !flight.rawFares) {
      return {
        baseFare: 0,
        taxes: 0,
        total: 0,
        bookingFees: 0
      };
    }

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

    const childBaseFare = childFare?.BaseFare || adultBaseFare;
    const childTaxes = childFare?.Taxes || adultTaxes;

    const infantBaseFare = infantFare?.BaseFare || 0;
    const infantTaxes = infantFare?.Taxes || 0;

    const totalBaseFare = (adults * adultBaseFare) + (children * childBaseFare) + (infants * infantBaseFare);
    const totalTaxes = (adults * adultTaxes) + (children * childTaxes) + (infants * infantTaxes);
    const grandTotal = totalBaseFare + totalTaxes;

    return {
      baseFare: totalBaseFare,
      taxes: totalTaxes,
      total: grandTotal,
      bookingFees: 10 // Free booking fees
    };
  };

  const pricing = calculatePricing();

  // Get detailed passenger breakdown
  const getPassengerBreakdown = () => {
    if (!flight || !searchData || !flight.rawFares) {
      return [];
    }

    const adults = parseInt(searchData.adult) || 0;
    const children = parseInt(searchData.child) || 0;
    const infants = parseInt(searchData.lapInfant) || 0;

    const adultFare = flight.rawFares.find(f => f.PaxType === 'ADT');
    const childFare = flight.rawFares.find(f => f.PaxType === 'CHD');
    const infantFare = flight.rawFares.find(f => f.PaxType === 'INF');

    const breakdown = [];

    if (adults > 0) {
      breakdown.push({
        type: 'Adults',
        count: adults,
        baseFare: adultFare?.BaseFare || 0,
        taxes: adultFare?.Taxes || 0,
        total: ((adultFare?.BaseFare || 0) + (adultFare?.Taxes || 0)) * adults
      });
    }

    if (children > 0) {
      breakdown.push({
        type: 'Children',
        count: children,
        baseFare: childFare?.BaseFare || adultFare?.BaseFare || 0,
        taxes: childFare?.Taxes || adultFare?.Taxes || 0,
        total: ((childFare?.BaseFare || adultFare?.BaseFare || 0) + (childFare?.Taxes || adultFare?.Taxes || 0)) * children
      });
    }

    if (infants > 0) {
      breakdown.push({
        type: 'Infants',
        count: infants,
        baseFare: infantFare?.BaseFare || 0,
        taxes: infantFare?.Taxes || 0,
        total: ((infantFare?.BaseFare || 0) + (infantFare?.Taxes || 0)) * infants
      });
    }

    return breakdown;
  };

  const passengerBreakdown = getPassengerBreakdown();

  return (
    <div className="px-30 py-30 border-light rounded-4 mt-30">
      <div className="text-20 fw-500 mb-20">Your price summary</div>
      
      {/* Search Criteria Summary */}
      {searchData && (
        <div className="mb-20 pb-15 border-bottom-light">
          <div className="text-14 fw-500 mb-8">Trip Details</div>
          <div className="text-13 text-light-1 mb-3">
            <i className="icon-calendar mr-5"></i>
            {new Date(searchData.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-13 text-light-1">
            <i className="icon-users mr-5"></i>
            {searchData.adult} Adult{searchData.adult > 1 ? 's' : ''}
            {searchData.child > 0 && `, ${searchData.child} Child${searchData.child > 1 ? 'ren' : ''}`}
            {searchData.lapInfant > 0 && `, ${searchData.lapInfant} Infant${searchData.lapInfant > 1 ? 's' : ''}`}
          </div>
        </div>
      )}
      
      {/* Passenger Breakdown */}
      {passengerBreakdown.length > 0 && (
        <div className="mb-20">
          <div className="text-16 fw-500 mb-10">Passenger Breakdown</div>
          {passengerBreakdown.map((passenger, index) => (
            <div key={index} className="mb-10">
              <div className="row y-gap-5 justify-between">
                <div className="col-auto">
                  <div className="text-14 text-light-1">{passenger.type} ({passenger.count}x)</div>
                </div>
                <div className="col-auto">
                  <div className="text-14 text-light-1">${passenger.total.toFixed(2)}</div>
                </div>
              </div>
              <div className="row y-gap-5 justify-between ml-15">
                <div className="col-auto">
                  <div className="text-12 text-light-1">Base: ${passenger.baseFare.toFixed(2)} + Tax: ${passenger.taxes.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Base Fare Total */}
      <div className="row y-gap-5 justify-between">
        <div className="col-auto">
          <div className="text-15 fw-500">Base Fare Total</div>
        </div>
        {/* End col */}
        <div className="col-auto">
          <div className="text-15 fw-500">${pricing.baseFare.toFixed(2)}</div>
        </div>
        {/* End col */}
      </div>
      {/* End .row */}

      {/* Taxes and Fees */}
      <div className="row y-gap-5 justify-between pt-5">
        <div className="col-auto">
          <div className="text-15">Taxes and fees</div>
        </div>
        <div className="col-auto">
          <div className="text-15">${pricing.taxes.toFixed(2)}</div>
        </div>
      </div>
      {/* End .row */}

      {/* Booking fees */}
      <div className="row y-gap-5 justify-between pt-5">
        <div className="col-auto">
          <div className="text-15">Booking fees</div>
        </div>
        <div className="col-auto">
          <div className="text-15"></div>
        </div>
      </div>
      {/* End .row */}

      {/* Flight Information */}
      {flight && (
        <div className="mt-15 pt-15 border-top-light">
          <div className="text-14 fw-500 mb-10">Flight Details</div>
          
          {/* Route Information */}
          {flight.flightList && flight.flightList.length > 0 && (
            <div className="mb-10">
              <div className="text-13 text-light-1 mb-5">
                <i className="icon-plane mr-5"></i>
                {flight.flightList[0].departureAirport} → {flight.flightList[flight.flightList.length - 1].arrivalAirport} <span>| {flight.validatingCarrier}</span>
              </div>
              <div className="text-13 text-light-1">
                <i className="icon-clock mr-5"></i>
                {flight.flightList.reduce((total, segment) => total + (segment.duration || 0), 0)} Total Flight Duration
              </div>
            </div>
          )}
        </div>
      )}


      <div className="px-20 py-20 bg-blue-2 rounded-4 mt-20">
        <div className="row y-gap-5 justify-between">
          <div className="col-auto">
            <div className="text-18 lh-13 fw-500">Total Price</div>
          </div>
          <div className="col-auto">
            <div className="text-18 lh-13 fw-500">${pricing.total.toFixed(2)}</div>
          </div>
        </div>
      </div>
      {/* End .row */}
    </div>
    // End px-30
  );
};

export default PricingSummary;
