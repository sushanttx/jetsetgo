// src/services/wishlistService.js
// Handles all wishlist-related API calls

import { getApiBaseUrl } from '../config/hosting';

const API_BASE_URL = getApiBaseUrl() + '/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token');
      throw new Error('Authentication token has expired. Please log in again.');
    }
  } catch (error) {
    console.warn('Could not parse token payload:', error);
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  if (response.ok) {
    return await response.json();
  } else if (response.status === 401) {
    throw new Error('Authentication failed. Please log in again.');
  } else if (response.status === 403) {
    throw new Error('Access denied. You do not have permission to perform this action.');
  } else if (response.status === 404) {
    throw new Error('Wishlist item not found.');
  } else if (response.status === 409) {
    throw new Error('Item already exists in wishlist.');
  } else if (response.status >= 500) {
    throw new Error('Server error. Please try again later.');
  } else {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
};

// Get user's wishlist with retry logic
export const fetchWishlist = async (retryCount = 0) => {
  try {
    console.log('fetchWishlist: Starting fetch, retry count:', retryCount);
    console.log('fetchWishlist: Auth headers:', getAuthHeaders());
    
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: getAuthHeaders()
    });

    console.log('fetchWishlist: Response status:', response.status);
    console.log('fetchWishlist: Response headers:', response.headers);

    return await handleApiResponse(response);
  } catch (error) {
    console.error('fetchWishlist: Error:', error);
    // Retry logic for network errors
    if (retryCount < 2 && (error.name === 'TypeError' || error.message.includes('fetch'))) {
      console.log(`Wishlist fetch failed, retrying... (${retryCount + 1}/2)`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return fetchWishlist(retryCount + 1);
    }
    throw error;
  }
};

// Add item to wishlist with rich payload
export const addToWishlist = async (itineraryId, itineraryData, userNotes = '', priority = 'normal') => {
  try {
    console.log('addToWishlist: Starting with itineraryId:', itineraryId);
    console.log('addToWishlist: Raw itineraryData:', itineraryData);
    
    // Determine if this is a round-trip or one-way flight
    const isRoundTrip = itineraryData.flightListReturn && itineraryData.flightListReturn.length > 0;
    const hasOutbound = itineraryData.flightListOutbound && itineraryData.flightListOutbound.length > 0;
    
    console.log('addToWishlist: Flight type - Round trip:', isRoundTrip, 'Has outbound:', hasOutbound);
    
    // Enhanced payload structure for transformed flight data
    const payload = {
      itineraryId,
      itineraryData: {
        // Core Flight Information - Handle both one-way and round-trip
        from: hasOutbound ? itineraryData.flightListOutbound[0]?.departureAirport || 'N/A' : 'N/A',
        to: hasOutbound ? itineraryData.flightListOutbound[0]?.arrivalAirport || 'N/A' : 'N/A',
        fromCity: hasOutbound ? itineraryData.flightListOutbound[0]?.departureAirport || 'N/A' : 'N/A',
        toCity: hasOutbound ? itineraryData.flightListOutbound[0]?.arrivalAirport || 'N/A' : 'N/A',
        fromCountry: hasOutbound ? itineraryData.flightListOutbound[0]?.fromCountry || 'Unknown' : 'Unknown',
        toCountry: hasOutbound ? itineraryData.flightListOutbound[0]?.toCountry || 'Unknown' : 'Unknown',
        
        // Flight Details
        airline: itineraryData.airline || 'N/A',
        airlineName: itineraryData.airline || 'N/A',
        flightNumber: hasOutbound ? itineraryData.flightListOutbound[0]?.flightNumber || 'N/A' : 'N/A',
        duration: itineraryData.totalDurationFormatted || 'N/A',
        durationInMinutes: itineraryData.totalDurationInMinutes || 0,
        stops: itineraryData.stops || 0,
        cabinClass: hasOutbound ? itineraryData.flightListOutbound[0]?.cabinClass || 'Economy' : 'Economy',
        
        // Pricing
        price: itineraryData.price || 0,
        currency: 'USD',
        baseFare: itineraryData.price || 0,
        taxes: 0,
        totalPrice: itineraryData.price || 0,
        
        // Dates & Times - Handle both one-way and round-trip
        departureDate: hasOutbound ? itineraryData.flightListOutbound[0]?.departureDateFormatted || 'N/A' : 'N/A',
        departureTime: hasOutbound ? itineraryData.flightListOutbound[0]?.departureTime || 'N/A' : 'N/A',
        arrivalDate: hasOutbound ? itineraryData.flightListOutbound[0]?.arrivalDateFormatted || 'N/A' : 'N/A',
        arrivalTime: hasOutbound ? itineraryData.flightListOutbound[0]?.arrivalTime || 'N/A' : 'N/A',
        
        // Enhanced Details
        departureTerminal: hasOutbound ? itineraryData.flightListOutbound[0]?.departureTerminal || 'N/A' : 'N/A',
        arrivalTerminal: hasOutbound ? itineraryData.flightListOutbound[0]?.arrivalTerminal || 'N/A' : 'N/A',
        bookingClass: hasOutbound ? itineraryData.flightListOutbound[0]?.cabinClass || 'Economy' : 'Economy',
        fareBasisCode: hasOutbound ? itineraryData.flightListOutbound[0]?.fareBasisCode || 'N/A' : 'N/A',
        brandId: itineraryData.brandId || 'N/A',
        brandName: itineraryData.brandName || 'N/A',
        brandTier: itineraryData.brandTier || 'N/A',
        segmentStatus: itineraryData.segmentStatus || 'Confirmed',
        redEyeFlight: itineraryData.redEyeFlight || false,
        selfTransfer: itineraryData.selfTransfer || false,
        noOfSeats: itineraryData.noOfSeats || 1,
        airlinePnr: itineraryData.airlinePnr || 'N/A',
        segmentReferenceKey: itineraryData.segmentReferenceKey || 'N/A',
        delimitedSegmentRef: itineraryData.delimitedSegmentRef || 'N/A',
        connectingFlight: itineraryData.connectingFlight || false,
        longLayOverFlight: itineraryData.longLayOverFlight || false,
        
        // Equipment & Aircraft
        equipment: hasOutbound ? itineraryData.flightListOutbound[0]?.equipment || 'N/A' : 'N/A',
        operatingAirline: hasOutbound ? itineraryData.flightListOutbound[0]?.operatingAirline || 'N/A' : 'N/A',
        operatingAirlineName: hasOutbound ? itineraryData.flightListOutbound[0]?.operatingAirline || 'N/A' : 'N/A',
        
        // Baggage
        baggageAllowance: itineraryData.rawBaggage || {},
        baggageDesc1: itineraryData.baggageInfo || '0P',
        baggageDesc2: 'Details at next step',
        baggageInfoUrl: 'N/A',
        
        // Additional Services
        segmentMeals: itineraryData.segmentMeals || {},
        richContentAmenities: itineraryData.richContentAmenities || {},
        
        // Search Context - Dynamically set trip type
        searchContext: itineraryData.searchContext || {
          adult: 1,
          child: 0,
          infant: 0,
          cabinClass: 'Economy',
          tripType: isRoundTrip ? 'ROUNDTRIP' : 'ONEWAY'
        },
        
        // UI Display
        avatar: hasOutbound ? itineraryData.flightListOutbound[0]?.avatar || '/img/flights/default-flight.png' : '/img/flights/default-flight.png',
        stops: itineraryData.stops || 0,
        
        // Transformed flight data structure - Preserve all original data
        flightListOutbound: itineraryData.flightListOutbound || [],
        flightListReturn: itineraryData.flightListReturn || [],
        outboundDateFormatted: itineraryData.outboundDateFormatted || 'N/A',
        returnDateFormatted: itineraryData.returnDateFormatted || 'N/A',
        totalDurationFormatted: itineraryData.totalDurationFormatted || 'N/A',
        totalDurationInMinutes: itineraryData.totalDurationInMinutes || 0,
        validatingCarrier: itineraryData.validatingCarrier || 'N/A',
        rawFares: itineraryData.rawFares || {},
        rawBaggage: itineraryData.rawBaggage || {},
        departureTimeFull: itineraryData.departureTimeFull || 'N/A',
        
        // Route information for display
        route: isRoundTrip 
          ? `${itineraryData.flightListOutbound?.[0]?.departureAirport || 'N/A'} → ${itineraryData.flightListOutbound?.[0]?.arrivalAirport || 'N/A'} • ${itineraryData.flightListReturn?.[0]?.departureAirport || 'N/A'} → ${itineraryData.flightListReturn?.[0]?.arrivalAirport || 'N/A'}`
          : `${itineraryData.flightListOutbound?.[0]?.departureAirport || 'N/A'} → ${itineraryData.flightListOutbound?.[0]?.arrivalAirport || 'N/A'}`,
        
        // Trip type indicator
        tripType: isRoundTrip ? 'ROUNDTRIP' : 'ONEWAY',
        
        // Additional round-trip specific data
        ...(isRoundTrip && {
          returnDepartureDate: itineraryData.flightListReturn?.[0]?.departureDateFormatted || 'N/A',
          returnDepartureTime: itineraryData.flightListReturn?.[0]?.departureTime || 'N/A',
          returnArrivalDate: itineraryData.flightListReturn?.[0]?.arrivalDateFormatted || 'N/A',
          returnArrivalTime: itineraryData.flightListReturn?.[0]?.arrivalTime || 'N/A',
          returnAirline: itineraryData.flightListReturn?.[0]?.airline || itineraryData.airline || 'N/A',
          returnFlightNumber: itineraryData.flightListReturn?.[0]?.flightNumber || 'N/A',
          returnCabinClass: itineraryData.flightListReturn?.[0]?.cabinClass || 'Economy'
        })
      },
      userNotes,
      priority
    };

    console.log('addToWishlist: Final payload:', payload);
    console.log('addToWishlist: Auth headers:', getAuthHeaders());

    const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    console.log('addToWishlist: Response status:', response.status);
    console.log('addToWishlist: Response headers:', response.headers);

    const result = await handleApiResponse(response);
    return { success: true, message: 'Added to wishlist successfully', data: result };
  } catch (error) {
    console.error('addToWishlist: Error:', error);
    throw error;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (itineraryId, retryCount = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/remove`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ itineraryId })
    });

    const result = await handleApiResponse(response);
    return { success: true, message: 'Removed from wishlist successfully', data: result };
  } catch (error) {
    // Retry logic for network errors
    if (retryCount < 2 && (error.name === 'TypeError' || error.message.includes('fetch'))) {
      console.log(`Wishlist remove failed, retrying... (${retryCount + 1}/2)`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return removeFromWishlist(itineraryId, retryCount + 1);
    }
    throw error;
  }
};

// Update wishlist item (for notes, priority, etc.)
export const updateWishlistItem = async (itineraryId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ itineraryId, ...updates })
    });

    const result = await handleApiResponse(response);
    return { success: true, message: 'Wishlist item updated successfully', data: result };
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    throw error;
  }
};

// Bulk remove items from wishlist
export const bulkRemoveFromWishlist = async (itineraryIds) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/bulk-remove`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ itineraryIds })
    });

    const result = await handleApiResponse(response);
    return { success: true, message: 'Items removed from wishlist successfully', data: result };
  } catch (error) {
    console.error('Error bulk removing from wishlist:', error);
    throw error;
  }
};

// Search/filter wishlist items
export const searchWishlist = async (filters) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const response = await fetch(`${API_BASE_URL}/wishlist/search?${queryParams}`, {
      headers: getAuthHeaders()
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Error searching wishlist:', error);
    throw error;
  }
};
