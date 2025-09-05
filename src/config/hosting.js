// Frontend Hosting Configuration
// This file controls how your frontend connects to the backend

const HOSTING_CONFIG = {
  // Current hosting mode - change this to switch between localhost and wifi
  HOSTING_MODE: 'wifi', // 'localhost' or 'wifi'
  
  // API URLs for different modes
  API_URLS: {
    localhost: {
      base: 'http://localhost:3000',
      flights: 'http://localhost:3000/api/flights',
      auth: 'http://localhost:3000/api/auth',
      wishlist: 'http://localhost:3000/api/wishlist',
      airlines: 'http://localhost:3000/api/airlines',
      promotions: 'http://localhost:3000/api/promotions'
    },
    wifi: {
      base: 'http://192.168.1.209:3000',
      flights: 'http://192.168.1.209:3000/api/flights',
      auth: 'http://192.168.1.209:3000/api/auth',
      wishlist: 'http://192.168.1.209:3000/api/wishlist',
      airlines: 'http://192.168.1.209:3000/api/airlines',
      promotions: 'http://192.168.1.209:3000/api/promotions'
    }
  }
};

// Get the current API base URL based on hosting mode
export const getApiBaseUrl = () => {
  const mode = HOSTING_CONFIG.HOSTING_MODE;
  return HOSTING_CONFIG.API_URLS[mode]?.base || HOSTING_CONFIG.API_URLS.wifi.base;
};

// Get specific API endpoint URL
export const getApiUrl = (endpoint) => {
  const mode = HOSTING_CONFIG.HOSTING_MODE;
  return HOSTING_CONFIG.API_URLS[mode]?.[endpoint] || HOSTING_CONFIG.API_URLS.wifi[endpoint];
};

// Get all API URLs for current mode
export const getCurrentApiUrls = () => {
  const mode = HOSTING_CONFIG.HOSTING_MODE;
  return HOSTING_CONFIG.API_URLS[mode] || HOSTING_CONFIG.API_URLS.wifi;
};

// Get hosting mode info
export const getHostingInfo = () => {
  const mode = HOSTING_CONFIG.HOSTING_MODE;
  const urls = getCurrentApiUrls();
  
  return {
    mode,
    baseUrl: urls.base,
    isLocalhost: mode === 'localhost',
    isWifi: mode === 'wifi',
    accessibleFrom: mode === 'localhost' ? 'This computer only' : 'Any device on WiFi network'
  };
};

// Log hosting configuration on app startup
export const logHostingInfo = () => {
  const info = getHostingInfo();
  console.log('🚀 Frontend Hosting Configuration:');
  console.log(`   Mode: ${info.mode.toUpperCase()}`);
};

export default HOSTING_CONFIG;
