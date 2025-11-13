// src/services/bookingService.js
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

// Validate booking payload
export const validateBookingPayload = async (payload) => {
  try {
    console.log('🔍 Validating booking payload with contact info:', {
      BookItineraryPaxContactInfo: payload.BookItineraryPaxContactInfo,
      ItineraryId: payload.ItineraryId,
      PaymentType: payload.BookItineraryPaymentDetail?.PaymentType
    });
    
    const response = await fetch(getApiUrl('test-booking-validate'), {
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
      throw new Error(`Validation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Booking validation error:', error);
    throw error;
  }
};

// Get booking examples
export const getBookingExamples = async () => {
  try {
    const response = await fetch(getApiUrl('test-booking-examples'), {
      method: 'GET',
      headers: getAuthHeaders()
    });

    // Handle 403 Forbidden (token expired/invalid)
    if (response.status === 403) {
      handle403Error(response, window.location.pathname);
      return; // Exit early, redirect is happening
    }

    if (!response.ok) {
      throw new Error(`Failed to get examples: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get examples error:', error);
    throw error;
  }
};

// Submit booking
export const submitBooking = async (payload) => {
  try {
    console.log('📤 Submitting booking with contact info:', {
      BookItineraryPaxContactInfo: payload.BookItineraryPaxContactInfo,
      ItineraryId: payload.ItineraryId,
      PaymentType: payload.BookItineraryPaymentDetail?.PaymentType
    });
    
    const response = await fetch(getApiUrl('booking-book'), {
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
      let errorMessage = `Booking failed: ${response.statusText}`;
      
      // Try to get detailed error from response
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(', ');
        }
      } catch (parseError) {
        console.log('Could not parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Booking submission error:', error);
    throw error;
  }
};

// Helper function to format date for TripPro API (DD/MM/YYYY)
export const formatDateForAPI = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to format expiry date for API (MM/YY)
export const formatExpiryDateForAPI = (expiryDate) => {
  if (!expiryDate) return '';
  
  // If it's already in MM/YY format, validate and return
  if (expiryDate.includes('/') && expiryDate.length <= 5) {
    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    // Validate month (1-12)
    if (monthNum < 1 || monthNum > 12) {
      console.warn('Invalid month in expiry date:', expiryDate);
      return '';
    }
    
    // Convert 2-digit year to 4-digit year
    let fullYear = yearNum;
    if (yearNum < 100) {
      // If year is less than 100, assume it's 20XX
      fullYear = 2000 + yearNum;
    }
    
    // Check if the date is in the future
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (fullYear < currentYear || (fullYear === currentYear && monthNum < currentMonth)) {
      console.warn('Expiry date is in the past:', expiryDate, '->', `${month}/${fullYear}`);
      // Return the original format but log the issue
      return expiryDate;
    }
    
    return expiryDate;
  }
  
  // If it's a full date, extract MM/YY
  const date = new Date(expiryDate);
  if (isNaN(date.getTime())) {
    console.warn('Invalid expiry date format:', expiryDate);
    return '';
  }
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
};

// Helper function to determine passenger type based on age
export const getPassengerType = (dateOfBirth, searchData) => {
  if (!dateOfBirth) return 'ADT';
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 2) return 'INF';
  if (age < 12) return 'CHD';
  return 'ADT';
};

// Helper function to get user title from gender
export const getUserTitle = (gender) => {
  switch (gender?.toLowerCase()) {
    case 'male': return 'Mr';
    case 'female': return 'Ms';
    default: return 'Mr';
  }
};

// Helper function to map frontend card types to backend-expected codes
export const mapCardTypeToBackend = (frontendCardType) => {
  switch (frontendCardType?.toLowerCase()) {
    case 'visa': return 'VI';
    case 'mastercard': return 'CA';
    case 'american express': return 'AX';
    case 'discover': return 'DS';
    default: return 'VI'; // Default to Visa if unknown
  }
};

// Helper function to validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Build complete booking payload
export const buildBookingPayload = (flight, searchData, passengers, personalDetails, paymentDetails) => {
  console.log('🔍 Building booking payload with data:', {
    flight: flight?.id || flight?.ItineraryId,
    passengersCount: passengers?.length,
    personalDetails: personalDetails,
    paymentDetails: paymentDetails
  });

  // Validate required data
  if (!flight?.id && !flight?.ItineraryId) {
    throw new Error('Flight ID is required');
  }
  
  if (!passengers || passengers.length === 0) {
    throw new Error('At least one passenger is required');
  }
  
  if (!personalDetails) {
    throw new Error('Personal details are required');
  }
  
  if (!paymentDetails) {
    throw new Error('Payment details are required');
  }

  // Validate contact info - use first passenger's contact info as primary
  let phoneNumber = '';
  let email = '';
  let alternatePhoneNumber = '';
  
  if (passengers.length > 0) {
    // Use first passenger's contact info as primary
    phoneNumber = passengers[0].mobileNumber || passengers[0].phone || '';
    email = passengers[0].email || '';
    
    // If there's a second passenger with a different phone number, use it as alternate
    if (passengers.length > 1) {
      const secondPassengerPhone = passengers[1].mobileNumber || passengers[1].phone || '';
      if (secondPassengerPhone.trim() && secondPassengerPhone.trim() !== phoneNumber.trim()) {
        alternatePhoneNumber = secondPassengerPhone.trim();
      }
    }
  }
  
  // Fallback to personalDetails if passenger info is not available
  if (!phoneNumber.trim()) {
    phoneNumber = personalDetails.phone || personalDetails.mobileNumber || '';
  }
  
  if (!email.trim()) {
    email = personalDetails.email || '';
  }
  
  if (!phoneNumber.trim()) {
    throw new Error('Phone number is required in passenger information or personal details');
  }
  
  if (!email.trim()) {
    throw new Error('Email is required in passenger information or personal details');
  }
  
  if (!isValidEmail(email.trim())) {
    throw new Error('Invalid email format');
  }

  const payload = {
    ItineraryId: flight?.id || flight?.ItineraryId,
    BookItineraryPaxDetail: [],
    BookItineraryPaxContactInfo: {
      PhoneNumber: phoneNumber.trim(),
      AlternatePhoneNumber: alternatePhoneNumber || (personalDetails.alternateNumber || personalDetails.alternatePhoneNumber || '').trim(),
      Email: email.trim()
    },
    BookItineraryPaymentDetail: {
      PaymentType: paymentDetails.paymentType
    }
  };

  // Debug logging for contact info
  console.log('📞 Contact Info being sent:', {
    PhoneNumber: payload.BookItineraryPaxContactInfo.PhoneNumber,
    AlternatePhoneNumber: payload.BookItineraryPaxContactInfo.AlternatePhoneNumber,
    Email: payload.BookItineraryPaxContactInfo.Email,
    source: {
      primaryPhone: passengers.length > 0 ? 'first passenger' : 'personal details',
      primaryEmail: passengers.length > 0 ? 'first passenger' : 'personal details',
      alternatePhone: alternatePhoneNumber ? 'second passenger' : 'personal details or empty'
    },
    passengersCount: passengers.length
  });

  // Add passenger details with validation
  passengers.forEach((passenger, index) => {
    // Validate required passenger fields
    if (!passenger.fullName?.trim()) {
      throw new Error(`Passenger ${index + 1}: Full name is required`);
    }
    
    if (!passenger.gender?.trim()) {
      throw new Error(`Passenger ${index + 1}: Gender is required`);
    }
    
    if (!passenger.dateOfBirth?.trim()) {
      throw new Error(`Passenger ${index + 1}: Date of birth is required`);
    }
    
    if (!passenger.nationality?.trim()) {
      throw new Error(`Passenger ${index + 1}: Nationality is required`);
    }

    const passengerType = getPassengerType(passenger.dateOfBirth, searchData);
    const [firstName, ...lastNameParts] = passenger.fullName.trim().split(' ');
    const lastName = lastNameParts.join(' ');
    
    if (!firstName?.trim()) {
      throw new Error(`Passenger ${index + 1}: First name is required`);
    }
    
    if (!lastName?.trim()) {
      throw new Error(`Passenger ${index + 1}: Last name is required`);
    }
    
    const formattedDateOfBirth = formatDateForAPI(passenger.dateOfBirth);
    if (!formattedDateOfBirth) {
      throw new Error(`Passenger ${index + 1}: Invalid date of birth format`);
    }
    
    payload.BookItineraryPaxDetail.push({
      PaxType: passengerType,
      Gender: passenger.gender.toLowerCase() === 'male' ? 'M' : 'F',
      UserTitle: getUserTitle(passenger.gender),
      FirstName: firstName.trim(),
      MiddleName: '',
      LastName: lastName.trim(),
      DateOfBirth: formattedDateOfBirth,
      PassportNumber: (passenger.passportNumber || '').trim(),
      CountryOfIssue: (passenger.nationality || '').trim(),
      Nationality: (passenger.nationality || '').trim(),
      PassportIssueDate: '',
      PassportExpiryDate: (passenger.passportExpiryDate || '').trim()
    });
  });

  // Add payment-specific details with validation
  if (paymentDetails.paymentType === 'HOLD') {
    // HOLD payment type - no additional fields needed
    // Just PaymentType: "HOLD" is sufficient
  } else if (paymentDetails.paymentType === 'CC') {
    // Validate credit card fields
    if (!paymentDetails.cardType?.trim()) {
      throw new Error('Credit card type is required');
    }
    
    if (!paymentDetails.cardNumber?.trim()) {
      throw new Error('Credit card number is required');
    }
    
    if (!paymentDetails.cvv?.trim()) {
      throw new Error('CVV is required');
    }
    
    if (!paymentDetails.expiryDate?.trim()) {
      throw new Error('Expiry date is required');
    }
    
    // Validate billing address for CC
    if (!paymentDetails.billingName?.trim()) {
      throw new Error('Billing name is required');
    }
    
    if (!paymentDetails.billingAddress1?.trim()) {
      throw new Error('Billing address is required');
    }
    
    if (!paymentDetails.billingCity?.trim()) {
      throw new Error('Billing city is required');
    }
    
    if (!paymentDetails.billingCountry?.trim()) {
      throw new Error('Billing country is required');
    }
    
    if (!paymentDetails.billingState?.trim()) {
      throw new Error('Billing state is required');
    }
    
    if (!paymentDetails.billingZipCode?.trim()) {
      throw new Error('Billing ZIP code is required');
    }
    
    const mappedCardType = mapCardTypeToBackend(paymentDetails.cardType);
    const formattedExpiryDate = formatExpiryDateForAPI(paymentDetails.expiryDate);
    
    console.log('💳 Card type mapping:', {
      frontend: paymentDetails.cardType,
      backend: mappedCardType
    });
    
    console.log('📅 Expiry date formatting:', {
      frontend: paymentDetails.expiryDate,
      backend: formattedExpiryDate
    });
    
    payload.BookItineraryPaymentDetail.BookItineraryCCDetails = {
      CardType: mappedCardType,
      CardNumber: paymentDetails.cardNumber.trim(),
      CVV: paymentDetails.cvv.trim(),
      ExpiryDate: formattedExpiryDate,
      BankPhoneNum: (paymentDetails.bankPhoneNum || '').trim(),
      BillingPhoneNum: (paymentDetails.billingPhoneNum || '').trim()
    };
    
    payload.BookItineraryPaymentDetail.BookItineraryBillingAddress = {
      Name: paymentDetails.billingName.trim(),
      Address1: paymentDetails.billingAddress1.trim(),
      Address2: (paymentDetails.billingAddress2 || '').trim(),
      ZipCode: paymentDetails.billingZipCode.trim(),
      City: paymentDetails.billingCity.trim(),
      Country: paymentDetails.billingCountry.trim(),
      State: paymentDetails.billingState.trim()
    };
  } else if (paymentDetails.paymentType === 'CK') {
    // Validate billing address for CK
    if (!paymentDetails.billingName?.trim()) {
      throw new Error('Billing name is required');
    }
    
    if (!paymentDetails.billingAddress1?.trim()) {
      throw new Error('Billing address is required');
    }
    
    if (!paymentDetails.billingCity?.trim()) {
      throw new Error('Billing city is required');
    }
    
    if (!paymentDetails.billingCountry?.trim()) {
      throw new Error('Billing country is required');
    }
    
    if (!paymentDetails.billingState?.trim()) {
      throw new Error('Billing state is required');
    }
    
    if (!paymentDetails.billingZipCode?.trim()) {
      throw new Error('Billing ZIP code is required');
    }
    
    // CK payment type - only billing address needed
    payload.BookItineraryPaymentDetail.BookItineraryBillingAddress = {
      Name: paymentDetails.billingName.trim(),
      Address1: paymentDetails.billingAddress1.trim(),
      Address2: (paymentDetails.billingAddress2 || '').trim(),
      ZipCode: paymentDetails.billingZipCode.trim(),
      City: paymentDetails.billingCity.trim(),
      Country: paymentDetails.billingCountry.trim(),
      State: paymentDetails.billingState.trim()
    };
  } else {
    throw new Error(`Invalid payment type: ${paymentDetails.paymentType}. Must be HOLD, CC, or CK`);
  }

  // Final validation
  if (payload.BookItineraryPaxDetail.length === 0) {
    throw new Error('No valid passenger details found');
  }
  
  if (!payload.BookItineraryPaxContactInfo.PhoneNumber || !payload.BookItineraryPaxContactInfo.Email) {
    throw new Error('Contact information is incomplete');
  }
  
  if (!payload.BookItineraryPaymentDetail.PaymentType) {
    throw new Error('Payment type is required');
  }

  console.log('✅ Booking payload validation passed:', {
    passengers: payload.BookItineraryPaxDetail.length,
    contactInfo: !!payload.BookItineraryPaxContactInfo.PhoneNumber && !!payload.BookItineraryPaxContactInfo.Email,
    paymentType: payload.BookItineraryPaymentDetail.PaymentType
  });

  return payload;
};
