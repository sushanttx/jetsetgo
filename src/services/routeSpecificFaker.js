import flightSearchFaker from './flightSearchFaker';
import airlinesData from '../data/airlines.json';

class RouteSpecificFaker {
  constructor() {
    // Extract Indian airlines from airlines.json
    this.indianAirlines = airlinesData.airlines.filter(airline => 
      airline.country === 'India'
    ).map(airline => airline.code);
    
    this.popularRoutes = {
      'BOM-DEL': {
        name: 'Mumbai to Delhi',
        duration: { min: 120, max: 180 }, // 2-3 hours
        airlines: this.indianAirlines,
        aircraft: ['Boeing 737-800', 'Airbus A320', 'Boeing 737-900', 'Airbus A321'],
        priceRange: { min: 3000, max: 15000 }
      },
      'DEL-BOM': {
        name: 'Delhi to Mumbai',
        duration: { min: 120, max: 180 },
        airlines: this.indianAirlines,
        aircraft: ['Boeing 737-800', 'Airbus A320', 'Boeing 737-900', 'Airbus A321'],
        priceRange: { min: 3000, max: 15000 }
      },
      'BOM-BLR': {
        name: 'Mumbai to Bangalore',
        duration: { min: 90, max: 120 }, // 1.5-2 hours
        airlines: this.indianAirlines,
        aircraft: ['Boeing 737-800', 'Airbus A320', 'Boeing 737-700'],
        priceRange: { min: 2500, max: 12000 }
      },
      'DEL-BLR': {
        name: 'Delhi to Bangalore',
        duration: { min: 150, max: 210 }, // 2.5-3.5 hours
        airlines: this.indianAirlines,
        aircraft: ['Boeing 737-800', 'Airbus A320', 'Boeing 737-900'],
        priceRange: { min: 4000, max: 18000 }
      },
      'BOM-CCU': {
        name: 'Mumbai to Kolkata',
        duration: { min: 150, max: 210 },
        airlines: this.indianAirlines,
        aircraft: ['Boeing 737-800', 'Airbus A320', 'Boeing 737-900'],
        priceRange: { min: 3500, max: 16000 }
      },
      'DEL-CCU': {
        name: 'Delhi to Kolkata',
        duration: { min: 120, max: 180 },
        airlines: this.indianAirlines,
        aircraft: ['Boeing 737-800', 'Airbus A320', 'Boeing 737-900'],
        priceRange: { min: 3000, max: 14000 }
      }
    };

    // Generate Indian airlines data dynamically from airlines.json
    this.indianAirlinesData = {};
    airlinesData.airlines.forEach(airline => {
      if (airline.country === 'India') {
        this.indianAirlinesData[airline.code] = {
          name: airline.name,
          logo: `${airline.code}.png`, // Use airline code for local images
          country: airline.country,
          alliance: airline.alliance
        };
      }
    });
  }

  // Get route-specific configuration
  getRouteConfig(departureCode, arrivalCode) {
    const routeKey = `${departureCode}-${arrivalCode}`;
    return this.popularRoutes[routeKey] || this.getDefaultRouteConfig();
  }

  getDefaultRouteConfig() {
    return {
      name: 'Generic Route',
      duration: { min: 60, max: 480 },
      airlines: this.indianAirlines,
      aircraft: ['Boeing 737-800', 'Airbus A320', 'Boeing 737-900', 'Airbus A321'],
      priceRange: { min: 2000, max: 25000 }
    };
  }

  // Get airline data by code
  getAirlineByCode(code) {
    return airlinesData.airlines.find(airline => airline.code === code);
  }

  // Get random Indian airline
  getRandomIndianAirline() {
    const indianAirline = airlinesData.airlines.find(airline => 
      airline.country === 'India' && this.indianAirlines.includes(airline.code)
    );
    return indianAirline || airlinesData.airlines.find(airline => airline.country === 'India');
  }

  // Create mock airport for missing codes
  createMockAirport(code) {
    return {
      code: code,
      name: `${code} Airport`,
      city: code,
      country: 'Unknown'
    };
  }

  // Generate realistic Indian domestic flight data
  generateIndianDomesticFlight(departureCode, arrivalCode, departureDate, returnDate = null) {
    // Create mock airports if not found
    const departureAirport = this.createMockAirport(departureCode);
    const arrivalAirport = this.createMockAirport(arrivalCode);
    
    const routeConfig = this.getRouteConfig(departureCode, arrivalCode);
    
    // Generate multiple flights (40-250)
    const itineraries = [];
    const numberOfResults = Math.floor(Math.random() * (250 - 40 + 1)) + 40;
    
    // Override the faker with route-specific data
    const originalGenerateFlightSegment = flightSearchFaker.generateFlightSegment;
    
    flightSearchFaker.generateFlightSegment = (segmentIndex, departureAirport, arrivalAirport, departureDate, isReturn = false) => {
      const airlineCode = this.getRandomIndianAirline();
      const airline = this.indianAirlines[airlineCode];
      const flightTimes = this.generateRealisticFlightTimes(departureDate, routeConfig);
      const duration = this.generateRouteSpecificDuration(routeConfig);
      
      return {
        DepartureLocationCode: departureAirport.code,
        DepartureDisplayName: departureAirport.city,
        OriginAirportName: departureAirport.name,
        DepartureTerminalId: this.getRandomTerminal(departureAirport.code),
        ArrivalLocationCode: arrivalAirport.code,
        DisplayName: arrivalAirport.city,
        DestinationAirportName: arrivalAirport.name,
        ArrivalTerminalId: this.getRandomTerminal(arrivalAirport.code),
        MarketingAirline: airlineCode,
        MarketingAirlineName: airline.name,
        FlightNumber: this.generateFlightNumber(airlineCode),
        OperatingAirline: airlineCode,
        OperatingAirlineName: airline.name,
        Duration: duration.duration,
        DurationInMinutes: duration.durationInMinutes,
        LayoverTime: segmentIndex > 0 ? this.generateLayoverTime() : "",
        FlightLogoName: airline.logo,
        AirEquipmentType: this.getRandomAircraft(routeConfig),
        AirlinePnr: null,
        SegmentStatus: null,
        NoOfSeats: this.generateSeatAvailability(),
        BookingClass: this.getRandomBookingClass(),
        CabinClass: this.getRandomCabinClass(),
        noOfStops: 0,
        NoOfStops: 0,
        BrandName: null,
        BrandId: null,
        BrandTier: null,
        DelimitedSegmentRef: null,
        SegmentReferenceKey: `s${segmentIndex + 1}`,
        RedEyeFlight: this.isRedEyeFlight(departureDate),
        SelfTransfer: false,
        DepartureDateTime: flightTimes.departureDateTime,
        ArrivalDateTime: flightTimes.arrivalDateTime,
        DepartureDateTimeEpoch: flightTimes.departureDateTimeEpoch,
        ArrivalDateTimeEpoch: flightTimes.arrivalDateTimeEpoch
      };
    };

    // Generate the flight search response
    const results = flightSearchFaker.generateFlightSearchResponse(
      departureCode, 
      arrivalCode, 
      departureDate, 
      returnDate
    );

    // Restore original method
    flightSearchFaker.generateFlightSegment = originalGenerateFlightSegment;

    // Apply route-specific pricing
    results.FlightItinerary.forEach(itinerary => {
      const pricing = this.generateRouteSpecificPricing(routeConfig);
      itinerary.Fares = [{
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
        fareBasisCodes: this.getRandomBookingClass(),
        bookingClasses: this.getRandomBookingClass(),
        FareTypeIndicator: "4",
        nonBrandedFare: false,
        basicEconomyFare: false,
        actions: {},
        tourNetFare: false,
        bundledFare: false,
        bundledFareId: null,
        bundledItineraryId: null,
        baggageAllowance: {
          [departureCode + '-' + arrivalCode]: [
            {
              noOfPieces: "1P",
              description1: "15KG",
              description2: "",
              type: "CHECKIN",
              weight: 15.0,
              measuringType: "KG"
            }
          ]
        }
      }];
    });

    return results;
  }

  getRandomIndianAirline() {
    const airlines = Object.keys(this.indianAirlinesData);
    return airlines[Math.floor(Math.random() * airlines.length)];
  }

  generateFlightNumber(airlineCode) {
    // Generate flight numbers dynamically based on airline
    const range = [100, 9999]; // Default range for all airlines
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  generateRealisticFlightTimes(departureDate, routeConfig) {
    const departureDateTime = new Date(departureDate);
    
    // Generate realistic departure times based on route
    const hourRanges = [
      { start: 6, end: 8 },   // Morning
      { start: 10, end: 12 }, // Late morning
      { start: 14, end: 16 }, // Afternoon
      { start: 18, end: 20 }, // Evening
      { start: 21, end: 23 }  // Night
    ];
    
    const selectedRange = hourRanges[Math.floor(Math.random() * hourRanges.length)];
    const hour = Math.floor(Math.random() * (selectedRange.end - selectedRange.start + 1)) + selectedRange.start;
    const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    
    departureDateTime.setHours(hour, minute, 0, 0);
    
    const flightDuration = Math.floor(Math.random() * (routeConfig.duration.max - routeConfig.duration.min + 1)) + routeConfig.duration.min;
    const arrivalDateTime = new Date(departureDateTime.getTime() + flightDuration * 60000);
    
    return {
      departureDateTime: departureDateTime.toISOString(),
      arrivalDateTime: arrivalDateTime.toISOString(),
      departureDateTimeEpoch: departureDateTime.getTime(),
      arrivalDateTimeEpoch: arrivalDateTime.getTime()
    };
  }

  generateRouteSpecificDuration(routeConfig) {
    const minutes = Math.floor(Math.random() * (routeConfig.duration.max - routeConfig.duration.min + 1)) + routeConfig.duration.min;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return {
      duration: `${hours}H ${mins}M`,
      durationInMinutes: minutes
    };
  }

  getRandomTerminal(airportCode) {
    const terminalMap = {
      'BOM': ['T1', 'T2'],
      'DEL': ['T1', 'T2', 'T3'],
      'BLR': ['T1', 'T2'],
      'CCU': ['T1', 'T2'],
      'HYD': ['T1', 'T2'],
      'MAA': ['T1', 'T2', 'T3']
    };
    
    const terminals = terminalMap[airportCode] || ['T1', 'T2'];
    return terminals[Math.floor(Math.random() * terminals.length)];
  }

  generateLayoverTime() {
    const layoverMinutes = Math.floor(Math.random() * 180) + 60; // 1-4 hours
    const hours = Math.floor(layoverMinutes / 60);
    const minutes = layoverMinutes % 60;
    return `${hours}H ${minutes}M`;
  }

  getRandomAircraft(routeConfig) {
    return routeConfig.aircraft[Math.floor(Math.random() * routeConfig.aircraft.length)];
  }

  generateSeatAvailability() {
    return Math.floor(Math.random() * 9) + 1; // 1-9 seats
  }

  getRandomBookingClass() {
    const classes = ['Y', 'B', 'M', 'H', 'Q', 'V', 'W', 'S', 'T', 'L', 'U', 'N', 'R', 'O', 'G', 'I', 'D', 'C', 'J', 'A', 'F'];
    return classes[Math.floor(Math.random() * classes.length)];
  }

  getRandomCabinClass() {
    const classes = ['Economy', 'Premium Economy', 'Business', 'First'];
    const weights = [0.7, 0.2, 0.08, 0.02]; // Weighted distribution
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < classes.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return classes[i];
      }
    }
    return 'Economy';
  }

  isRedEyeFlight(departureDate) {
    const hour = new Date(departureDate).getHours();
    return hour >= 20 || hour <= 6;
  }

  generateRouteSpecificPricing(routeConfig) {
    // Convert INR to USD (divide by 83)
    const basePriceINR = Math.floor(Math.random() * (routeConfig.priceRange.max - routeConfig.priceRange.min + 1)) + routeConfig.priceRange.min;
    const basePrice = Math.floor(basePriceINR / 83); // Convert to USD
    const taxes = Math.floor(basePrice * 0.15); // 15% taxes
    const fees = Math.floor(basePrice * 0.05); // 5% fees
    const totalPrice = basePrice + taxes + fees;

    return {
      BaseFare: basePrice,
      Taxes: taxes,
      Fees: fees,
      TotalFare: totalPrice,
      Currency: 'USD',
      FareType: Math.random() > 0.3 ? 'Refundable' : 'Non-Refundable',
      FareRules: {
        Cancellation: Math.random() > 0.3 ? 'Free cancellation' : 'Cancellation charges apply',
        Changes: Math.random() > 0.4 ? 'Free changes' : 'Change charges apply',
        Baggage: ['15kg included', '20kg included', '25kg included'][Math.floor(Math.random() * 3)]
      }
    };
  }

  // Generate BOM-DEL specific data
  generateBOMToDELSearch(departureDate, returnDate = null) {
    return this.generateIndianDomesticFlight('BOM', 'DEL', departureDate, returnDate);
  }

  // Generate any Indian domestic route
  generateIndianDomesticSearch(departureCode, arrivalCode, departureDate, returnDate = null) {
    return this.generateIndianDomesticFlight(departureCode, arrivalCode, departureDate, returnDate);
  }
}

export default new RouteSpecificFaker();
