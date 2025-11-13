// src/services/bookingHistoryService.js
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

// Fetch booking history
export const fetchBookingHistory = async (limit = 50, offset = 0) => {
  try {
    console.log('📋 Fetching booking history...', { limit, offset });
    
    const response = await fetch(getApiUrl('booking'), {
      method: 'GET',
      headers: getAuthHeaders()
    });

    // Handle 403 Forbidden (token expired/invalid)
    if (response.status === 403) {
      handle403Error(response, window.location.pathname);
      return; // Exit early, redirect is happening
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to fetch booking history: ${response.statusText}`;
      
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
    
    console.log('✅ Booking history fetched successfully:', {
      success: result.success,
      count: result.count,
      bookingsCount: result.bookings?.length || 0
    });

    return {
      success: true,
      data: result,
      message: 'Booking history fetched successfully'
    };

  } catch (error) {
    console.error('❌ Failed to fetch booking history:', error);
    
    return {
      success: false,
      error: 'FETCH_FAILED',
      message: error.message || 'Failed to fetch booking history. Please try again.',
      data: null
    };
  }
};

// Filter bookings by payment type
export const filterBookingsByPaymentType = (bookings, paymentType) => {
  if (!bookings || !Array.isArray(bookings)) return [];
  
  if (paymentType === 'ALL') return bookings;
  
  return bookings.filter(booking => {
    const bookingPaymentType = booking.paymentDetails?.PaymentType || booking.bookingType;
    return bookingPaymentType === paymentType;
  });
};

// Format booking date for display
export const formatBookingDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// Format booking status for display
export const formatBookingStatus = (status) => {
  if (!status) return 'Unknown';
  
  const statusMap = {
    'Success': 'Confirmed',
    'Pending': 'Processing',
    'Failed': 'Rejected',
    'Cancelled': 'Cancelled',
    'Processing': 'Processing',
    'Confirmed': 'Confirmed',
    'Rejected': 'Rejected'
  };
  
  return statusMap[status] || status;
};

// Get status badge class
export const getStatusBadgeClass = (status) => {
  if (!status) return 'bg-gray-1 text-gray-3';
  
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('success') || statusLower.includes('confirmed')) {
    return 'bg-blue-1-05 text-blue-1';
  }
  
  if (statusLower.includes('pending') || statusLower.includes('processing')) {
    return 'bg-yellow-4 text-yellow-3';
  }
  
  if (statusLower.includes('failed') || statusLower.includes('rejected')) {
    return 'bg-red-3 text-red-2';
  }
  
  if (statusLower.includes('cancelled')) {
    return 'bg-gray-1 text-gray-3';
  }
  
  return 'bg-gray-1 text-gray-3';
};

// Get payment type display name
export const getPaymentTypeDisplayName = (paymentType) => {
  const typeMap = {
    'HOLD': 'Hold Booking',
    'CC': 'Credit Card',
    'CK': 'Check Payment'
  };
  
  return typeMap[paymentType] || paymentType || 'Unknown';
};

// Get passenger count
export const getPassengerCount = (passengerDetails) => {
  if (!passengerDetails || !Array.isArray(passengerDetails)) return 0;
  return passengerDetails.length;
};

// Get passenger summary
export const getPassengerSummary = (passengerDetails) => {
  if (!passengerDetails || !Array.isArray(passengerDetails)) return 'No passengers';
  
  const summary = passengerDetails.map(passenger => {
    const title = passenger.UserTitle || '';
    const firstName = passenger.FirstName || '';
    const lastName = passenger.LastName || '';
    const paxType = passenger.PaxType || '';
    
    return `${title} ${firstName} ${lastName} (${paxType})`;
  }).join(', ');
  
  return summary || 'No passengers';
};

export default {
  fetchBookingHistory,
  filterBookingsByPaymentType,
  formatBookingDate,
  formatBookingStatus,
  getStatusBadgeClass,
  getPaymentTypeDisplayName,
  getPassengerCount,
  getPassengerSummary
};
