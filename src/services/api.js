// src/services/api.js
// FRONTEND-ONLY VERSION - NO API CALLS
// This file now uses faker instead of backend API calls

import flightSearchFaker from './flightSearchFaker';
import routeSpecificFaker from './routeSpecificFaker';

export async function searchFlights({ from, to, date, returnDate, cabinClass, ip, adult = 1, child = 0, lapInfant = 0, seatInfant = 0 }) {
  console.log("Using faker for flight search - no API calls");
  
  try {
    let results;
    
    // Use route-specific faker for Indian domestic routes
    const isIndianRoute = ['BOM', 'DEL', 'BLR', 'CCU', 'HYD', 'MAA'].includes(from) &&
                         ['BOM', 'DEL', 'BLR', 'CCU', 'HYD', 'MAA'].includes(to);
    
    if (isIndianRoute) {
      results = routeSpecificFaker.generateIndianDomesticSearch(
        from,
        to,
        date,
        returnDate
      );
    } else {
      results = flightSearchFaker.generateFlightSearchResponse(
        from,
        to,
        date,
        returnDate
      );
    }

    console.log("Faker generated results:", results);
    return results;
    
  } catch (error) {
    console.error('Faker search failed:', error);
    throw new Error('Flight search failed. Please try again.');
  }
} 