// src/services/repriceService.js
import { getApiUrl } from '../config/hosting.js';
import { handle403Error, isTokenExpired } from '../utils/authUtils.js';

// Get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Auth token from localStorage:', token ? 'Token found' : 'No token found');
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    console.log('Token is expired, redirecting to login');
    // Use handle403Error for proper cleanup and redirect
    handle403Error({ status: 403 }, window.location.pathname);
    return {
      'Content-Type': 'application/json',
      'Authorization': ''
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Validate reprice payload
const validateRepricePayload = (payload) => {
  if (!payload.ItineraryId?.trim()) {
    throw new Error('ItineraryId is required');
  }
  
  if (typeof payload.AdultPaxCount !== 'number' || payload.AdultPaxCount < 0) {
    throw new Error('AdultPaxCount must be a non-negative number');
  }
  
  if (typeof payload.ChildPaxCount !== 'number' || payload.ChildPaxCount < 0) {
    throw new Error('ChildPaxCount must be a non-negative number');
  }
  
  if (typeof payload.InfantPaxCount !== 'number' || payload.InfantPaxCount < 0) {
    throw new Error('InfantPaxCount must be a non-negative number');
  }
  
  const totalPax = payload.AdultPaxCount + payload.ChildPaxCount + payload.InfantPaxCount;
  if (totalPax === 0) {
    throw new Error('At least one passenger is required');
  }
  
  if (totalPax > 9) {
    throw new Error('Maximum 9 passengers allowed');
  }
  
  return true;
};

// Build reprice payload
export const buildRepricePayload = (itineraryId, adultCount, childCount, infantCount) => {
  console.log('🔍 Building reprice payload:', {
    ItineraryId: itineraryId,
    AdultPaxCount: adultCount,
    ChildPaxCount: childCount,
    InfantPaxCount: infantCount
  });

  const payload = {
    ItineraryId: itineraryId?.trim(),
    AdultPaxCount: parseInt(adultCount) || 0,
    ChildPaxCount: parseInt(childCount) || 0,
    InfantPaxCount: parseInt(infantCount) || 0
  };

  // Validate payload
  validateRepricePayload(payload);

  console.log('✅ Reprice payload validation passed:', {
    ItineraryId: payload.ItineraryId,
    totalPassengers: payload.AdultPaxCount + payload.ChildPaxCount + payload.InfantPaxCount
  });

  return payload;
};

// Reprice itinerary
export const repriceItinerary = async (itineraryId, adultCount, childCount, infantCount) => {
  try {
    console.log('💰 Starting reprice request for itinerary:', itineraryId);
    
    const payload = buildRepricePayload(itineraryId, adultCount, childCount, infantCount);
    
    console.log('📤 Sending reprice payload:', payload);
    
    const response = await fetch(getApiUrl('reprice'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    // Handle 403 Forbidden (token expired/invalid)
    if (response.status === 403) {
      handle403Error(response, window.location.pathname);
      return; // Exit early, redirect is happening
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Reprice failed: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        console.warn('Could not parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    console.log('✅ Reprice successful:', {
      ItineraryId: result.ItineraryId || itineraryId,
      hasNewPricing: !!result.rawFares,
      passengerCounts: {
        adults: result.AdultPaxCount || adultCount,
        children: result.ChildPaxCount || childCount,
        infants: result.InfantPaxCount || infantCount
      }
    });

    return {
      success: true,
      data: result,
      message: 'Reprice completed successfully'
    };

  } catch (error) {
    console.error('❌ Reprice failed:', error);
    
    // Handle specific error cases
    if (error.message.includes('expired') || error.message.includes('invalid')) {
      return {
        success: false,
        error: 'ITINERARY_EXPIRED',
        message: 'This itinerary has expired. Please search for new flights.',
        data: null
      };
    }
    
    if (error.message.includes('not found')) {
      return {
        success: false,
        error: 'ITINERARY_NOT_FOUND',
        message: 'Itinerary not found. Please search for new flights.',
        data: null
      };
    }
    
    return {
      success: false,
      error: 'REPRICE_FAILED',
      message: error.message || 'Failed to reprice itinerary. Please try again.',
      data: null
    };
  }
};

// Test reprice functionality
export const testReprice = async (itineraryId, adultCount = 1, childCount = 0, infantCount = 0) => {
  try {
    console.log('🧪 Testing reprice functionality...');
    
    const result = await repriceItinerary(itineraryId, adultCount, childCount, infantCount);
    
    if (result.success) {
      console.log('✅ Test reprice successful:', result.data);
      return result;
    } else {
      console.log('❌ Test reprice failed:', result.message);
      return result;
    }
    
  } catch (error) {
    console.error('❌ Test reprice error:', error);
    return {
      success: false,
      error: 'TEST_FAILED',
      message: error.message || 'Test reprice failed',
      data: null
    };
  }
};

export default {
  buildRepricePayload,
  repriceItinerary,
  testReprice
};
