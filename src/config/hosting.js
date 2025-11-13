// Frontend Hosting Configuration - VERCEL DEPLOYMENT
// This file is now simplified for Vercel deployment

// ========================================
// VERCEL DEPLOYMENT CONFIGURATION
// ========================================
// No backend calls - using faker data only

export const getApiBaseUrl = () => {
  return '/api'; // Vercel will handle this
};

export const getApiUrl = (endpoint) => {
  return `/api/${endpoint}`; // Vercel will handle this
};

export const getCurrentApiUrls = () => {
  return {
    base: '/api',
    flights: '/api/flights',
    auth: '/api/auth',
    wishlist: '/api/wishlist',
    airlines: '/api/airlines',
    promotions: '/api/promotions'
  };
};

export const getHostingInfo = () => {
  return {
    mode: 'vercel',
    baseUrl: '/api',
    isLocalhost: false,
    isWifi: false,
    isVercel: true,
    accessibleFrom: 'Vercel deployment'
  };
};

// No logging for Vercel deployment
export const logHostingInfo = () => {
  // No console logs for production
};

export default {
  HOSTING_MODE: 'vercel',
  API_URLS: getCurrentApiUrls()
};