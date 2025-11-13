import { faker } from '@faker-js/faker';
import airlinesData from '../data/airlines.json';
import airportsData from '../data/airports.json';

class FlightSearchFaker {
  constructor() {
    this.airlines = airlinesData.airlines;
    this.airports = airportsData.airports;
    this.aircraftTypes = [
      'Boeing 737-800', 'Boeing 737-900', 'Boeing 737-700', 'Boeing 777-300ER',
      'Boeing 787-8', 'Boeing 787-9', 'Airbus A320', 'Airbus A321', 'Airbus A330-300',
      'Airbus A350-900', 'Airbus A380-800', 'Boeing 747-400', 'Boeing 737 MAX 8',
      'Airbus A319', 'Boeing 777-200', 'Airbus A330-200', 'Boeing 737-600'
    ];
    this.cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First'];
    this.bookingClasses = ['Y', 'B', 'M', 'H', 'Q', 'V', 'W', 'S', 'T', 'L', 'U', 'N', 'R', 'O', 'G', 'I', 'D', 'C', 'J', 'A', 'F'];
  }

  // Generate random airline data
  getRandomAirline() {
    const airline = faker.helpers.arrayElement(this.airlines);
    return {
      code: airline.code,
      name: airline.name,
      country: airline.country,
      alliance: airline.alliance,
      logoName: `${airline.code}.png` // Use airline code for local images
    };
  }

  // Generate random airport data
  getRandomAirport() {
    return faker.helpers.arrayElement(this.airports);
  }

  // Generate flight duration based on distance (rough estimation)
  generateFlightDuration(departureCode, arrivalCode) {
    // Mock distance calculation - in real scenario, you'd use actual distance
    const baseMinutes = faker.number.int({ min: 60, max: 480 }); // 1-8 hours
    const hours = Math.floor(baseMinutes / 60);
    const minutes = baseMinutes % 60;
    return {
      duration: `${hours}H ${minutes}M`,
      durationInMinutes: baseMinutes
    };
  }

  // Generate realistic flight times
  generateFlightTimes(departureDate, isRedEye = false) {
    let departureHour, arrivalHour;
    
    if (isRedEye) {
      departureHour = faker.number.int({ min: 20, max: 23 }); // 8 PM - 11 PM
    } else {
      departureHour = faker.number.int({ min: 6, max: 18 }); // 6 AM - 6 PM
    }
    
    const departureMinute = faker.helpers.arrayElement([0, 15, 30, 45]);
    const departureDateTime = new Date(departureDate);
    departureDateTime.setHours(departureHour, departureMinute, 0, 0);
    
    // Add flight duration
    const flightDuration = faker.number.int({ min: 60, max: 480 });
    const arrivalDateTime = new Date(departureDateTime.getTime() + flightDuration * 60000);
    
    return {
      departureDateTime: departureDateTime.toISOString(),
      arrivalDateTime: arrivalDateTime.toISOString(),
      departureDateTimeEpoch: departureDateTime.getTime(),
      arrivalDateTimeEpoch: arrivalDateTime.getTime()
    };
  }

  // Generate flight segment
  generateFlightSegment(segmentIndex, departureAirport, arrivalAirport, departureDate, isReturn = false) {
    const airline = this.getRandomAirline();
    const flightTimes = this.generateFlightTimes(departureDate, faker.datatype.boolean());
    const duration = this.generateFlightDuration(departureAirport.code, arrivalAirport.code);
    
    return {
      DepartureLocationCode: departureAirport.code,
      DepartureDisplayName: departureAirport.city,
      OriginAirportName: departureAirport.name,
      DepartureTerminalId: faker.helpers.arrayElement(['1', '2', '3', 'T1', 'T2', 'T3']),
      ArrivalLocationCode: arrivalAirport.code,
      DisplayName: arrivalAirport.city,
      DestinationAirportName: arrivalAirport.name,
      ArrivalTerminalId: faker.helpers.arrayElement(['1', '2', '3', 'T1', 'T2', 'T3']),
      MarketingAirline: airline.code,
      MarketingAirlineName: airline.name,
      FlightNumber: faker.number.int({ min: 100, max: 9999 }),
      OperatingAirline: airline.code,
      OperatingAirlineName: airline.name,
      Duration: duration.duration,
      DurationInMinutes: duration.durationInMinutes,
      LayoverTime: segmentIndex > 0 ? `${faker.number.int({ min: 1, max: 4 })}H ${faker.number.int({ min: 0, max: 59 })}M` : "",
      FlightLogoName: airline.logoName,
      AirEquipmentType: faker.helpers.arrayElement(this.aircraftTypes),
      AirlinePnr: null,
      SegmentStatus: null,
      NoOfSeats: faker.number.int({ min: 1, max: 9 }),
      BookingClass: faker.helpers.arrayElement(this.bookingClasses),
      CabinClass: faker.helpers.arrayElement(this.cabinClasses),
      noOfStops: 0,
      NoOfStops: 0,
      BrandName: null,
      BrandId: null,
      BrandTier: null,
      DelimitedSegmentRef: null,
      SegmentReferenceKey: `s${segmentIndex + 1}`,
      RedEyeFlight: flightTimes.departureDateTime.includes('T2') || flightTimes.departureDateTime.includes('T2'),
      SelfTransfer: false,
      DepartureDateTime: flightTimes.departureDateTime,
      ArrivalDateTime: flightTimes.arrivalDateTime,
      DepartureDateTimeEpoch: flightTimes.departureDateTimeEpoch,
      ArrivalDateTimeEpoch: flightTimes.arrivalDateTimeEpoch
    };
  }

  // Generate city pair (one way or round trip)
  generateCityPair(departureAirport, arrivalAirport, departureDate, returnDate = null, hasStops = false) {
    const segments = [];
    let totalDuration = 0;
    let noOfStops = 0;

    if (hasStops) {
      // Generate connecting flight
      const connectingAirport = this.getRandomAirport();
      noOfStops = 1;
      
      // First segment
      const firstSegment = this.generateFlightSegment(0, departureAirport, connectingAirport, departureDate);
      segments.push(firstSegment);
      totalDuration += firstSegment.DurationInMinutes;
      
      // Add layover time
      const layoverMinutes = faker.number.int({ min: 60, max: 240 });
      totalDuration += layoverMinutes;
      
      // Second segment
      const secondSegment = this.generateFlightSegment(1, connectingAirport, arrivalAirport, 
        new Date(departureDate.getTime() + (firstSegment.DurationInMinutes + layoverMinutes) * 60000));
      segments.push(secondSegment);
      totalDuration += secondSegment.DurationInMinutes;
    } else {
      // Direct flight
      const segment = this.generateFlightSegment(0, departureAirport, arrivalAirport, departureDate);
      segments.push(segment);
      totalDuration = segment.DurationInMinutes;
    }

    const totalHours = Math.floor(totalDuration / 60);
    const totalMinutes = totalDuration % 60;

    return {
      Duration: `${totalHours}H ${totalMinutes}M`,
      NoOfStops: noOfStops,
      FlightReferences: null,
      FlightKey: `j${faker.number.int({ min: 1, max: 10 })}`,
      FlightSegment: segments
    };
  }

  // Generate pricing data
  generatePricing() {
    const basePrice = faker.number.int({ min: 100, max: 2000 }); // USD pricing
    const taxes = faker.number.int({ min: 20, max: 300 });
    const fees = faker.number.int({ min: 5, max: 100 });
    const totalPrice = basePrice + taxes + fees;

    return {
      BaseFare: basePrice,
      Taxes: taxes,
      Fees: fees,
      TotalFare: totalPrice,
      Currency: 'USD',
      FareType: faker.helpers.arrayElement(['Refundable', 'Non-Refundable']),
      FareRules: {
        Cancellation: faker.helpers.arrayElement(['Free cancellation', 'Cancellation charges apply']),
        Changes: faker.helpers.arrayElement(['Free changes', 'Change charges apply']),
        Baggage: faker.helpers.arrayElement(['15kg included', '20kg included', '25kg included'])
      }
    };
  }

  // Generate complete flight itinerary
  generateFlightItinerary(departureAirport, arrivalAirport, departureDate, returnDate = null) {
    const validatingCarrier = this.getRandomAirline();
    const citypairs = [];
    
    // Outbound flight
    const outboundCityPair = this.generateCityPair(
      departureAirport, 
      arrivalAirport, 
      departureDate, 
      null, 
      faker.datatype.boolean({ probability: 0.3 }) // 30% chance of stops
    );
    citypairs.push(outboundCityPair);

    // Return flight (if round trip)
    if (returnDate) {
      const returnCityPair = this.generateCityPair(
        arrivalAirport, 
        departureAirport, 
        returnDate, 
        null, 
        faker.datatype.boolean({ probability: 0.3 })
      );
      citypairs.push(returnCityPair);
    }

    const pricing = this.generatePricing();

    return {
      ItineraryId: faker.string.uuid(),
      ValidatingCarrierCode: validatingCarrier.code,
      ValidatingCarrierName: validatingCarrier.name,
      RequestVersion: "V2",
      Citypairs: citypairs,
      Fares: [{
        CurrencyCode: pricing.Currency,
        BaseFare: pricing.BaseFare,
        Taxes: pricing.Taxes,
        CCFee: pricing.Fees,
        CCFeePercentage: 0.0,
        CCMax: pricing.TotalFare,
        PaxType: "ADT",
        InfantSSR: false,
        RefundInPercentage: false,
        ExchangeInPercentage: false,
        AfterExchangePenaltyAllowed: true,
        AfterExchangePenalty: Math.floor(pricing.BaseFare * 0.1),
        AfterRefundPenaltyAllowed: true,
        AfterRefundPenalty: Math.floor(pricing.BaseFare * 0.15),
        FareDisplayGray: false,
        BeforeExchangePenaltyAllowed: true,
        BeforeExchangePenalty: Math.floor(pricing.BaseFare * 0.1),
        BeforeRefundPenaltyAllowed: true,
        BeforeRefundPenalty: Math.floor(pricing.BaseFare * 0.15),
        PenaltyInfo: {},
        marketFare: 0.0,
        MarketTaxes: 0.0,
        marketFareMarkup: 0.0,
        TravellerBaseFare: pricing.BaseFare,
        TravellerTaxes: pricing.Taxes,
        TravellerMarkup: 0.0,
        TravellerOfferedAmount: 0.0,
        strikedFare: "",
        strikedFareMarkup: "",
        fareBasisCodes: faker.helpers.arrayElement(['Y', 'B', 'M', 'H', 'Q', 'V', 'W', 'S', 'T', 'L', 'U', 'N', 'R', 'O', 'G', 'I', 'D', 'C', 'J', 'A', 'F']),
        bookingClasses: faker.helpers.arrayElement(['Y', 'B', 'M', 'H', 'Q', 'V', 'W', 'S', 'T', 'L', 'U', 'N', 'R', 'O', 'G', 'I', 'D', 'C', 'J', 'A', 'F']),
        FareTypeIndicator: faker.helpers.arrayElement(['4', '5', '6']),
        nonBrandedFare: false,
        basicEconomyFare: false,
        actions: {},
        tourNetFare: false,
        bundledFare: false,
        bundledFareId: null,
        bundledItineraryId: null,
        baggageAllowance: {
          [citypairs[0].FlightSegment[0].DepartureLocationCode + '-' + citypairs[0].FlightSegment[0].ArrivalLocationCode]: [
            {
              noOfPieces: faker.helpers.arrayElement(['0P', '1P', '2P']),
              description1: faker.helpers.arrayElement(['15KG', '20KG', '25KG', '30KG']),
              description2: "",
              type: "CHECKIN",
              weight: faker.number.int({ min: 15, max: 30 }),
              measuringType: "KG"
            }
          ]
        }
      }],
      BrandId: faker.helpers.arrayElement(['ECOVALU', 'ECOFLEX', 'BUSINESS', 'FIRST']),
      BrandName: faker.helpers.arrayElement(['Economy VALUE', 'Economy FLEX', 'Business', 'First']),
      CabinClass: faker.helpers.arrayElement(['Economy', 'Premium Economy', 'Business', 'First']),
      Rank: 0.0,
      Tag: null,
      RichContentAmenities: {},
      SegmentMeals: {},
      noOfSeats: faker.number.int({ min: 1, max: 9 }),
      IsNonRefundableFare: faker.datatype.boolean({ probability: 0.3 }),
      IsBasicEconomyItin: false,
      FareType: "PUB",
      pricingTripType: null,
      RefundInPercentage: false,
      ExchangeInPercentage: false,
      AfterExchangePenaltyAllowed: true,
      AfterExchangePenalty: Math.floor(pricing.BaseFare * 0.1),
      AfterRefundPenaltyAllowed: true,
      AfterRefundPenalty: Math.floor(pricing.BaseFare * 0.15),
      BeforeExchangePenaltyAllowed: true,
      BeforeExchangePenalty: Math.floor(pricing.BaseFare * 0.1),
      BeforeRefundPenaltyAllowed: true,
      BeforeRefundPenalty: Math.floor(pricing.BaseFare * 0.15),
      LongLayOverFlight: false,
      lccCarrier: false,
      TotalDuration: citypairs.reduce((total, pair) => {
        const durationMatch = pair.Duration.match(/(\d+)H (\d+)M/);
        if (durationMatch) {
          return total + parseInt(durationMatch[1]) * 60 + parseInt(durationMatch[2]);
        }
        return total;
      }, 0),
      TotalStops: citypairs.reduce((total, pair) => total + pair.NoOfStops, 0)
    };
  }

  // Main method to generate flight search response
  generateFlightSearchResponse(departureCode, arrivalCode, departureDate, returnDate = null, passengerCount = 1) {
    console.log('🔍 Faker Debug - Departure Code:', departureCode);
    console.log('🔍 Faker Debug - Arrival Code:', arrivalCode);
    console.log('🔍 Faker Debug - Available airports:', this.airports.slice(0, 5).map(a => a.code));
    
    let departureAirport = this.airports.find(airport => airport.code === departureCode);
    let arrivalAirport = this.airports.find(airport => airport.code === arrivalCode);
    
    // If airports not found, create mock airports
    if (!departureAirport) {
      console.log('🔍 Creating mock departure airport for:', departureCode);
      departureAirport = {
        code: departureCode,
        name: `${departureCode} Airport`,
        city: departureCode,
        country: 'Unknown'
      };
    }
    
    if (!arrivalAirport) {
      console.log('🔍 Creating mock arrival airport for:', arrivalCode);
      arrivalAirport = {
        code: arrivalCode,
        name: `${arrivalCode} Airport`,
        city: arrivalCode,
        country: 'Unknown'
      };
    }
    
    console.log('🔍 Faker Debug - Using departure airport:', departureAirport);
    console.log('🔍 Faker Debug - Using arrival airport:', arrivalAirport);

    const itineraries = [];
    const numberOfResults = faker.number.int({ min: 40, max: 250 });

    for (let i = 0; i < numberOfResults; i++) {
      const itinerary = this.generateFlightItinerary(
        departureAirport, 
        arrivalAirport, 
        new Date(departureDate), 
        returnDate ? new Date(returnDate) : null
      );
      itineraries.push(itinerary);
    }

    // Sort by price
    itineraries.sort((a, b) => {
      const priceA = a.Fares?.[0]?.BaseFare + a.Fares?.[0]?.Taxes || 0;
      const priceB = b.Fares?.[0]?.BaseFare + b.Fares?.[0]?.Taxes || 0;
      return priceA - priceB;
    });

    return {
      FlightItinerary: itineraries,
      SearchMetadata: {
        SearchId: faker.string.uuid(),
        SearchTime: new Date().toISOString(),
        TotalResults: itineraries.length,
        DepartureCode: departureCode,
        ArrivalCode: arrivalCode,
        DepartureDate: departureDate,
        ReturnDate: returnDate,
        PassengerCount: passengerCount
      }
    };
  }

  // Generate search for specific route
  generateBOMToDELSearch(departureDate, returnDate = null) {
    return this.generateFlightSearchResponse('BOM', 'DEL', departureDate, returnDate);
  }

  // Generate search for any route
  generateRandomRouteSearch(departureDate, returnDate = null) {
    const departureAirport = this.getRandomAirport();
    const arrivalAirport = this.getRandomAirport();
    
    return this.generateFlightSearchResponse(
      departureAirport.code, 
      arrivalAirport.code, 
      departureDate, 
      returnDate
    );
  }
}

export default new FlightSearchFaker();
