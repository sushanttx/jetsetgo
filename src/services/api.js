// src/services/api.js
// Usage: import { searchFlights } from './services/api';
// This version calls your backend proxy, not the external API directly.

import { getApiUrl } from '../config/hosting';

const API_URL = getApiUrl('flights') + '/search';

export async function searchFlights({ from, to, date, returnDate, cabinClass, ip, adult = 1, child = 0, lapInfant = 0, seatInfant = 0 }) {
  // Map cabin class
  let cabinMap = {
    "Economy/Coach": "E",
    "Business Class": "B",
    "First Class": "F",
    "Premium": "P",
    "All Class Cabin": "E", // fallback
    "Economy": "E",
    "Business": "B",
    "First": "F",
    "Premium Economy": "P"
  };
  const mappedCabin = cabinMap[cabinClass] || "E";
  const tripType = returnDate ? "ROUNDTRIP" : "ONEWAY";

  // Format date to DD/MM/YYYY (avoid timezone shifts by splitting)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = String(dateString).split('-');
    if (year && month && day) return `${day}/${month}/${year}`;
    // Fallback to Date parsing if not in YYYY-MM-DD
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const originDestination = [
    {
      DepartureTime: formatDate(date),
      DepartureLocationCode: from,
      TripType: tripType,
      ArrivalLocationCode: to,
      CabinClass: mappedCabin
    }
  ];

  // If returnDate is provided, add the return leg (round-trip)
  if (returnDate) {
    originDestination.push({
      DepartureTime: formatDate(returnDate),
      DepartureLocationCode: to,
      TripType: tripType,
      ArrivalLocationCode: from,
      CabinClass: mappedCabin
    });
  }

  const payload = {
    OriginDestination: originDestination,
    passengers: {
      adults: parseInt(adult),
      children: parseInt(child),
      infants: parseInt(lapInfant) + parseInt(seatInfant)
    }
  };

  console.log("Sending payload to backend:", payload);

  // Get token from localStorage if available
  const token = localStorage.getItem('token');
  const searchAccessToken = import.meta.env.VITE_SEARCH_ACCESS_TOKEN || "";
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
} 