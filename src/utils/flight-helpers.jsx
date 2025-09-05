// In src/utils/flight-helpers.js

// FIX 1: Add the missing helper function for formatting total duration
export const formatTotalDuration = (minutes) => {
    if (isNaN(minutes) || minutes < 0) return "";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };
  
  export const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    return new Date(dateTimeString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };
   
  export const formatDuration = (durationString) => {
    if (!durationString) return "";
    return durationString.replace('H', 'h ').replace('M', 'm');
  };
  
  export const transformFlightData = (apiResponse) => {
    const transformedFlights = [];
    if (!apiResponse.FlightItinerary || !Array.isArray(apiResponse.FlightItinerary)) {
      return transformedFlights;
    }
  
    apiResponse.FlightItinerary.forEach((itinerary, index) => {
      const flightSegments = [];
      const flightSegmentsOutbound = [];
      const flightSegmentsReturn = [];
      let totalDurationInMinutes = 0;
  
      let outboundDateFormatted = "";
      let returnDateFormatted = "";

      itinerary.Citypairs.forEach((citypair, citypairIndex) => {
        citypair.FlightSegment.forEach(segment => {
          totalDurationInMinutes += segment.DurationInMinutes;
          const mapped = {
            id: `${itinerary.ItineraryId}-${segment.FlightNumber}`,
            departureTime: formatTime(segment.DepartureDateTime),
            arrivalTime: formatTime(segment.ArrivalDateTime),
            departureDateFormatted: new Date(segment.DepartureDateTime).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
            arrivalDateFormatted: new Date(segment.ArrivalDateTime).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
            departureAirport: segment.DepartureLocationCode,
            arrivalAirport: segment.ArrivalLocationCode,
            originAirportName: segment.OriginAirportName,
            destinationAirportName: segment.DestinationAirportName,
            duration: formatDuration(segment.Duration),
            airline: segment.MarketingAirlineName,
            flightNumber: segment.FlightNumber,
            avatar: `/img/flights/${segment.FlightLogoName.replace('.gif', '.png')}`,
            avatarBase: `/img/flights/${String(segment.FlightLogoName).replace(/\.(gif|png|jpe?g)$/i, '')}`,
            FlightLogoName: segment.FlightLogoName, // Preserve original logo name for API calls
            operatingAirline: segment.OperatingAirlineName,
            brandName: segment.BrandName,
            cabinClass: segment.CabinClass,
            equipment: segment.AirEquipmentType,
            layoverTime: segment.LayoverTime || "",
            // Preserve full DateTime for layover calc
            DepartureDateTime: segment.DepartureDateTime,
            ArrivalDateTime: segment.ArrivalDateTime,
          };
          flightSegments.push(mapped);
          if (citypairIndex === 0) {
            flightSegmentsOutbound.push(mapped);
            if (!outboundDateFormatted) {
              outboundDateFormatted = new Date(segment.DepartureDateTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }
          } else if (citypairIndex === 1) {
            flightSegmentsReturn.push(mapped);
            if (!returnDateFormatted) {
              returnDateFormatted = new Date(segment.DepartureDateTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            }
          }
        });
      });
  
      const adultFare = itinerary.Fares?.find(f => f.PaxType === 'ADT');
      const displayPrice = adultFare ? adultFare.BaseFare + adultFare.Taxes : 0;
      
      // FIX 2: Make baggage handling dynamic instead of hardcoded
      let baggageInfoText = "Details at next step";
      const firstFare = itinerary.Fares?.[0];
      if (firstFare?.baggageAllowance) {
        // Get the first route key dynamically (e.g., 'PNQ-HYD', 'DEL-BOM', etc.)
        const firstRouteKey = Object.keys(firstFare.baggageAllowance)[0];
        if (firstRouteKey) {
          const checkInAllowance = firstFare.baggageAllowance[firstRouteKey].find(b => b.type === 'CHECKIN');
          if (checkInAllowance) {
              baggageInfoText = `${checkInAllowance.noOfPieces} Check-in`;
          }
        }
      }
  
      transformedFlights.push({
        id: itinerary.ItineraryId,
        selectId: `flight-${index}`,
        totalDurationInMinutes,
        totalDurationFormatted: formatTotalDuration(totalDurationInMinutes),
        flightList: flightSegments,
        flightListOutbound: flightSegmentsOutbound.length > 0 ? flightSegmentsOutbound : undefined,
        flightListReturn: flightSegmentsReturn.length > 0 ? flightSegmentsReturn : undefined,
        outboundDateFormatted: outboundDateFormatted || undefined,
        returnDateFormatted: returnDateFormatted || undefined,
        stops: flightSegments.length - 1,
        airline: itinerary.ValidatingCarrierName || flightSegments[0]?.airline,
        
        // FIX 3: Use the full DateTime string for filtering later
        departureTimeFull: itinerary.Citypairs[0]?.FlightSegment[0]?.DepartureDateTime,
  
        price: displayPrice,
        rawFares: itinerary.Fares,
        rawBaggage: firstFare?.baggageAllowance,
        validatingCarrier: itinerary.ValidatingCarrierName,
        brandName: itinerary.BrandName,
        baggageInfo: baggageInfoText,
      });
    });
  
    return transformedFlights;
  };